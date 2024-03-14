FROM node:20.11.1 as builder

WORKDIR /build
COPY package*.json .
RUN yarn install
COPY tsconfig.json .
COPY prisma .
COPY src/ src/
RUN yarn build


FROM node:20.11.1 as runner
WORKDIR /app

COPY --from=builder build/package*.json .
COPY --from=builder build/node_modules node_modules/
COPY --from=builder build/dist ./dist/
CMD ["node", "dist/app.js"]