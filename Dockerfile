# ---------- Build Stage ----------
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy project files
COPY . .

# Build the project
RUN npm run build


# ---------- Production Stage ----------
FROM nginx:1.29-alpine

# Remove default nginx page
RUN rm -rf /usr/share/nginx/html/*

# Copy build files
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]