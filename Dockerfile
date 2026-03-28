# Build Stage
FROM node:22-alpine AS build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Serve Stage
FROM nginx:alpine
# Copy the build artifacts to the default Nginx directory
COPY --from=build-stage /app/dist /usr/share/nginx/html
# Update the default Nginx configuration to listen on port 8080 for Cloud Run
RUN sed -i 's/listen\(.*\)80;/listen 8080;/g' /etc/nginx/conf.d/default.conf
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
