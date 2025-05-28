FROM node:alpine AS development

WORKDIR /usr/src/app

# Install system dependencies
RUN apk add --no-cache openssl

# Copy package files and install dependencies (using npm, pnpm, or yarn)
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN \
  if [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then npm install -g pnpm && pnpm install; \
  elif [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
  else npm install; fi


# Copy the rest of the application code
COPY . .

# Generate Prisma client
RUN npx prisma generate

CMD ["npm", "run", "start:dev"]

FROM node:alpine AS production

WORKDIR /usr/src/app

# Install system dependencies
RUN apk add --no-cache openssl

# Copy package files and install dependencies (using npm, pnpm, or yarn)
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN \
  if [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then npm install -g pnpm && pnpm install; \
  elif [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
  else npm install; fi

# Copy the rest of the application code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

CMD ["npm", "run", "start:prod"]
