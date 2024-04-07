# Install dependencies only when needed
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Rebuild the source code only when needed
FROM node:20-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY . .

ENV NODE_ENV production

ARG NEXT_PUBLIC_POSTHOG_KEY
ENV NEXT_PUBLIC_POSTHOG_KEY=$NEXT_PUBLIC_POSTHOG_KEY

ARG NEXT_PUBLIC_POSTHOG_HOST
ENV NEXT_PUBLIC_POSTHOG_HOST=$NEXT_PUBLIC_POSTHOG_HOST

RUN yarn prisma:generate && yarn build

# Production image, copy all the files and run next
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nextgroup
RUN adduser --system --uid 1001 nextuser

COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

COPY --from=builder --chown=nextuser:nextgroup /app/.next/standalone ./
COPY --from=builder --chown=nextuser:nextgroup /app/.next/static ./.next/static
COPY --from=builder --chown=nextuser:nextgroup /app/prisma ./prisma

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

RUN  yarn add prisma && DATABASE_URL=$DATABASE_URL yarn prisma:migrate:deploy

RUN apk add --no-cache curl

USER nextuser

ENV HOSTNAME "0.0.0.0"
EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]