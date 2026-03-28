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
# We use sed to replace 80 with 8080 in the default configuration
RUN sed -i 's/listen \(.*\)80;/listen 8080;/g' /etc/nginx/conf.d/default.conf
# Expose the Cloud Run default port
EXPOSE 8080
# Explicitly tell Nginx to listen on the port provided by Cloud Run, 
# defaulting to 8080 if not set.
CMD ["sh", "-c", "sed -i 's/listen [0-9]*/listen '$PORT'/g' /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
