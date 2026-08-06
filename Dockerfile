FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

RUN npm install -g serve

EXPOSE 8080

CMD ["sh", "-c", "API_URL=${VITE_APP_API_URL:-${BACKEND_URL:-}}; AUTH0_DOMAIN=${VITE_AUTH0_DOMAIN:-}; AUTH0_CLIENT_ID=${VITE_AUTH0_CLIENT_ID:-}; AUTH0_AUDIENCE=${VITE_AUTH0_AUDIENCE:-}; printf \"window.__APP_CONFIG__ = { VITE_APP_API_URL: '%s', VITE_AUTH0_DOMAIN: '%s', VITE_AUTH0_CLIENT_ID: '%s', VITE_AUTH0_AUDIENCE: '%s' };\\n\" \"$API_URL\" \"$AUTH0_DOMAIN\" \"$AUTH0_CLIENT_ID\" \"$AUTH0_AUDIENCE\" > /app/dist/runtime-config.js; serve -s dist -l ${PORT:-8080}"]