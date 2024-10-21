ARG NODE_VERSION=20.11.1
FROM node:${NODE_VERSION}-slim AS builder

WORKDIR /build
RUN apt-get update -y && apt-get install -y openssl
COPY package*.json .
COPY .dockerignore .
COPY prisma .
RUN yarn install
COPY tsconfig.json .
COPY src/ src/
RUN yarn build


FROM node:${NODE_VERSION}-slim AS runner
WORKDIR /app
RUN apt-get update -y && apt-get install -y openssl
COPY --from=builder build/package*.json .
COPY --from=builder build/dist ./dist/
CMD ["node", "/app/dist/src/app.js"]
