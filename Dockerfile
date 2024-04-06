# FROM node:20-alpine AS base


# FROM base AS installer
# WORKDIR /app

# COPY actions/ /actions
# COPY app /app
# COPY components/ /components
# COPY constants/ /constants
# COPY contexts/ /contexts
# COPY helper/ /helper
# COPY lib/ /lib
# COPY prisma/ /prisma
# COPY public/ /public
# COPY services/ /services
# COPY sia/ /sia
# COPY .eslintrc.json /eslintrc.json
# COPY env.d.ts /env.d.ts
# COPY components.json /components.json
# COPY middleware.ts /middleware.ts
# COPY next.config.js /next.config.js
# COPY package.json /package.json
# COPY postcss.config.js /postcss.config.js
# COPY tailwind.config.ts /tailwind.config.ts
# COPY tsconfig.json /tsconfig.json


# # Set hardcoded environment variables
# ENV DATABASE_URL="postgresql://placeholder:for@build:5432/gets_overwritten_at_runtime?schema=public"
# ENV NEXTAUTH_SECRET="placeholder_for_next_auth_of_64_chars_get_overwritten_at_runtime"
# # ENV SIA_ENCRYPTION_KEY="placeholder_for_build_key_of_64_chars_get_overwritten_at_runtime"

# # ARG NEXT_PUBLIC_SENTRY_DSN
# # ARG SENTRY_AUTH_TOKEN

# # Set the working directory
# WORKDIR /app

# # Install the dependencies
# RUN npm install

# # Create a .env file
# RUN touch /app/.env

# # Build the project
# RUN npm run build

# #
# ## step 3: setup production runner
# #
# FROM base AS runner

# RUN adduser --system --uid 1001 nextjs

# WORKDIR /home/nextjs

# COPY --from=installer /next.config.js .
# COPY --from=installer /package.json .
# # Leverage output traces to reduce image size
# COPY --from=installer --chown=nextjs:nextjs /.next/static ./.next/static
# COPY --from=installer --chown=nextjs:nextjs /public ./public


# EXPOSE 3000
# ENV HOSTNAME "0.0.0.0"
# USER nextjs

# # # Prepare volume for uploads
# # RUN mkdir -p /home/nextjs/apps/web/uploads/
# # VOLUME /home/nextjs/apps/web/uploads/

# CMD node apps/web/server.js

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

COPY actions/ /actions
COPY app /app
COPY components/ /components
COPY constants/ /constants
COPY contexts/ /contexts
COPY helper/ /helper
COPY lib/ /lib
COPY prisma/ /prisma
COPY public/ /public
COPY services/ /services
COPY sia/ /sia
COPY .eslintrc.json /eslintrc.json
COPY env.d.ts /env.d.ts
COPY components.json /components.json
COPY middleware.ts /middleware.ts
COPY next.config.js /next.config.js
COPY package.json /package.json
COPY postcss.config.js /postcss.config.js
COPY tailwind.config.ts /tailwind.config.ts
COPY tsconfig.json /tsconfig.json

RUN yarn build

# Production image, copy all the files and run next
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 bloggroup
RUN adduser --system --uid 1001 bloguser

COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=bloguser:bloggroup /app/.next/standalone ./
COPY --from=builder --chown=bloguser:bloggroup /app/.next/static ./.next/static

USER bloguser

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]