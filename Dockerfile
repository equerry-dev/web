# syntax=docker/dockerfile:1

# ---- Build the static site --------------------------------------------------
FROM node:24-alpine@sha256:2bdb65ed1dab192432bc31c95f94155ca5ad7fc1392fb7eb7526ab682fa5bf14 AS build
WORKDIR /app

# Pinned pnpm, no install scripts (supply-chain hardening).
RUN npm install -g pnpm@10.33.4 --ignore-scripts

# Install against the committed lockfile; no install scripts.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
RUN pnpm install --frozen-lockfile --ignore-scripts

# Build. adapter-static emits ./build (paraglide + svelte-kit sync run here).
COPY . .
RUN pnpm exec svelte-kit sync && pnpm build

# ---- Serve with nginx -------------------------------------------------------
FROM nginx:1.27-alpine@sha256:65645c7bb6a0661892a8b03b89d0743208a18dd2f3f17a54ef4b76fb8e2f2a10 AS runtime
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
# nginx:alpine default CMD runs `nginx -g 'daemon off;'`.
