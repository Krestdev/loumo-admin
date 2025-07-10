# -------- Builder Stage --------
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy app source code
COPY . .

ARG NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL

# Build Next.js app (generates .next folder)
RUN npm run build

# -------- Runtime Stage --------
FROM node:22-alpine AS runtime

# Set working directory
WORKDIR /app

# Only copy necessary runtime files
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/next.config.ts ./next.config.ts
# if using TypeScript
COPY --from=builder /app/tsconfig.json ./tsconfig.json 

# If you use any runtime-only files (e.g. env, i18n, middlewares), copy them too
# COPY --from=builder /app/.env.prod ./.end

# Expose default Next.js port
EXPOSE 3000

# Start Next.js in production
CMD ["npm", "run", "start"]
