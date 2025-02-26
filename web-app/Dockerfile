FROM node:18-alpine AS builder

WORKDIR /app

# Copy package.json files
COPY package*.json ./
COPY client/package*.json ./client/

# Install dependencies for server
RUN npm install

# Install client dependencies and downgrade axios to avoid process/browser issues
RUN cd client && npm install
RUN cd client && npm uninstall axios && npm install axios@0.27.2

# Copy source files
COPY . .

# Build the React app
RUN cd client && npm run build

# Second stage - only keep what's needed for production
FROM node:18-alpine

WORKDIR /app

# Copy package.json and install only production dependencies
COPY package*.json ./
RUN npm install --production

# Copy built client and server files
COPY --from=builder /app/client/build ./client/build
COPY server.js ./

EXPOSE 3000

CMD ["npm", "start"]