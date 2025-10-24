FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json ./

# Install dependencies (using npm install since we don't have package-lock.json yet)
RUN npm install

# Copy application code
COPY . .

# Build the Next.js application (disabled for development)
# RUN npm run build

# Expose port
EXPOSE 3000

# VULNERABILITY: Development mode in production
ENV NODE_ENV=development

# Start the application in development mode (hot reload enabled)
CMD ["npm", "run", "dev"]