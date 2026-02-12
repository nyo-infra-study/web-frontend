# Stage 1: Build
FROM node:22-alpine AS build

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Install dependencies first (cache layer)
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy source and build
COPY . .
RUN pnpm build

# Stage 2: Serve with nginx
FROM nginx:alpine

# Copy built assets to nginx
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

# nginx must run in foreground (daemon off) so the container stays alive
# This is what Kubernetes manages as the running process on port 80
CMD ["nginx", "-g", "daemon off;"]
