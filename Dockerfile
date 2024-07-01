FROM node:20.9.0-alpine AS build

WORKDIR /app

RUN apk update && apk add --no-cache nmap && \
  echo @edge http://nl.alpinelinux.org/alpine/edge/community >> /etc/apk/repositories && \
  echo @edge http://nl.alpinelinux.org/alpine/edge/main >> /etc/apk/repositories && \
  apk update && \
  apk add --no-cache \
  chromium \
  harfbuzz \
  "freetype>2.8" \
  ttf-freefont \
  nss

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

ENV DOCKER_ENVIRONMENT=true

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci 

# Copy application code
COPY . .

# generate prisma schema
RUN npx prisma generate

# Compile typescript
RUN npx tsc

# Create new stage
FROM node:20.9.0-alpine

WORKDIR /app

# Copy files from build stage
COPY --from=build /app/package*.json ./
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/prisma ./prisma

# Set entry point
ENTRYPOINT ["node", "dist/index.js"]