FROM node:20-slim as build

WORKDIR /app
USER root
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# production env
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
