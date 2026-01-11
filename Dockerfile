FROM node:20-slim AS builder

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig*.json ./
COPY .npmrc ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:20-slim AS runtime

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /usr/src/app/build ./build

RUN useradd --uid 1000 --create-home appuser && chown -R appuser:appuser /usr/src/app
USER appuser

EXPOSE 8100

ENV NODE_ENV=production
CMD ["node", "build/server.js"]
