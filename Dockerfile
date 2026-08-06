FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

RUN npm install -g serve

EXPOSE 8080

CMD ["sh", "-c", "API_URL=${VITE_APP_API_URL:-${BACKEND_URL:-}}; printf \"window.__APP_CONFIG__ = { VITE_APP_API_URL: '%s' };\\n\" \"$API_URL\" > /app/dist/runtime-config.js; serve -s dist -l ${PORT:-8080}"]