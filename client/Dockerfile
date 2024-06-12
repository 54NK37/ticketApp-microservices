FROM node:16.14.2

# Add the following lines
ENV CI=true
ENV WDS_SOCKET_PORT=0

WORKDIR /app
COPY package.json .
RUN npm install
COPY . .

CMD ["npm", "run", "dev"]