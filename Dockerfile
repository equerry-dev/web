# syntax=docker/dockerfile:1

# ---- Build the static site --------------------------------------------------
FROM node:26-alpine@sha256:144769ec3f32e8ee36b3cfde91e82bee25d9367b20f31a151f3f7eea3a2a8541 AS build
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
FROM nginx:1.31-alpine@sha256:8b1e78743a03dbb2c95171cc58639fef29abc8816598e27fb910ed2e621e589a AS runtime
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
# nginx:alpine default CMD runs `nginx -g 'daemon off;'`.
