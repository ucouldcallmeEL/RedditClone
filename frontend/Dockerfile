# 1️⃣ Build stage
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 8080

# Create config.js with API_BASE_URL at runtime
# This allows the API URL to be set via environment variable when running the container
CMD /bin/sh -c "echo \"window._env_={API_BASE_URL:'${API_BASE_URL:-http://localhost:4000}'}\" > /usr/share/nginx/html/config.js && nginx -g 'daemon off;'"