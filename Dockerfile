# ---- Stage 1: build the React client ----
FROM node:22-alpine AS client-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

# ---- Stage 2: production server ----
FROM node:22-alpine
ENV NODE_ENV=production
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY server.js ./
COPY config ./config
COPY server ./server
COPY --from=client-build /app/client/dist ./client/dist

# Cloud Run provides PORT (8080 by default); config.js reads it
ENV PORT=8080
EXPOSE 8080
USER node
CMD ["node", "server.js"]
