# Stage 1: Build
FROM node:22-alpine AS build

WORKDIR /app

# Build argument for API URL (passed during docker build)
ARG VITE_API_URL=http://localhost:8080/api

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Install dependencies first (cache layer)
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy source and build
COPY . .

# Make build arg available as env var for Vite
ENV VITE_API_URL=${VITE_API_URL}

RUN pnpm build

# Stage 2: Serve with nginx
FROM nginx:alpine

# Copy built assets to nginx
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

# nginx must run in foreground (daemon off) so the container stays alive
# This is what Kubernetes manages as the running process on port 80
CMD ["nginx", "-g", "daemon off;"]
