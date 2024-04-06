# Rebuild the source code only when needed
FROM node:20-alpine AS builder

RUN apk add --no-cache libc6-compat
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY app /app
COPY components/ /components
COPY constants/ /constants
COPY helper/ /helper
COPY lib/ /lib
COPY prisma/ /prisma
COPY public/ /public
COPY services/ /services
COPY sia/ /sia
COPY types/ /types
COPY .eslintrc.json /eslintrc.json
COPY env.d.ts /env.d.ts
COPY components.json /components.json
COPY middleware.ts /middleware.ts
COPY next.config.js /next.config.js
COPY postcss.config.js /postcss.config.js
COPY tailwind.config.ts /tailwind.config.ts
COPY tsconfig.json /tsconfig.json

RUN yarn prisma:generate && yarn build

# Production image, copy all the files and run next
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nextgroup
RUN adduser --system --uid 1001 nextuser

COPY --from=builder ./public ./public
COPY --from=builder ./package.json ./package.json

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextuser:nextgroup ./.next/standalone ./
COPY --from=builder --chown=bloguser:bloggroup ./.next/static ./.next/static

USER nextuser

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]