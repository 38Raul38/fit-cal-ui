# Build stage
FROM node:22-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Accept build arguments
ARG VITE_AUTH_API_URL
ARG VITE_FITCAL_API_URL
ARG VITE_GOOGLE_CLIENT_ID

# Set environment variables for build
ENV VITE_AUTH_API_URL=$VITE_AUTH_API_URL
ENV VITE_FITCAL_API_URL=$VITE_FITCAL_API_URL
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID

RUN echo "VITE_AUTH_API_URL=$VITE_AUTH_API_URL"
RUN echo "VITE_FITCAL_API_URL=$VITE_FITCAL_API_URL"

# Build the application (skip TypeScript checking for faster builds)
RUN npx vite build

# Production stage
FROM nginx:alpine

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx configuration (optional)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
