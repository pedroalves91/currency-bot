FROM node:20 AS deps
WORKDIR /app

# Copy only the files needed to install dependencies
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./

# Install dependencies with the preferred package manager
RUN npm ci


FROM node:20 AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

# Copy the rest of the files
COPY . .

# Run build with the preferred package manager
RUN npm run build

# Set NODE_ENV environment variable
ENV NODE_ENV production

# Re-run install only for production dependencies
RUN npm ci --only=production && npm cache clean --force


FROM node:20 AS runner
WORKDIR /app

# Copy the bundled code from the builder stage
COPY --from=builder --chown=node:node /app/dist ./dist
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY .env .env

# Use the node user from the image
USER node

# Start the server
CMD ["node", "dist/src/main.js"]
