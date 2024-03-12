FROM node:19.8.1
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
CMD ["node", "src/index.js"]
EXPOSE 3000