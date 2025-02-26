FROM node:18-alpine

WORKDIR /app

# Copy package.json files
COPY package*.json ./
COPY client/package*.json ./client/

# Install dependencies
RUN npm install
RUN cd client && npm install

# Copy source files
COPY . .

# Build the React app
RUN cd client && npm run build

EXPOSE 3000

CMD ["npm", "start"]