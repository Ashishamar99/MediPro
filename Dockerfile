ARG NODE_VERSION=20.11.1
FROM node:${NODE_VERSION}-slim as builder

WORKDIR /build
COPY package*.json .
COPY .dockerignore .
COPY prisma .
RUN yarn install
COPY tsconfig.json .
COPY src/ src/
RUN yarn build


FROM node:${NODE_VERSION}-slim as runner
WORKDIR /app

COPY --from=builder build/package*.json .
COPY --from=builder build/dist ./dist/
CMD ["node", "dist/app.js"]
