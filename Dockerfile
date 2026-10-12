# ==========================================
# Estágio 1: Build (Compilação do TypeScript)
# ==========================================
FROM node:26-alpine AS builder

WORKDIR /usr/src/app

# O engine do Prisma depende do OpenSSL, que não vem na imagem Alpine
RUN apk add --no-cache openssl

# Instala as dependências antes de copiar o código para aproveitar o cache de camadas
COPY package*.json .npmrc ./
RUN npm ci

COPY . .

# Gera o Prisma Client antes de compilar. O prisma.config.ts exige DATABASE_URL,
# mas o generate não conecta no banco, então um valor provisório é suficiente.
RUN DATABASE_URL="postgresql://build:build@localhost:5432/build" npx prisma generate
RUN npm run build

# ==========================================
# Estágio 2: Runner (Ambiente de Execução)
# ==========================================
FROM node:26-alpine AS runner

WORKDIR /usr/src/app

ENV NODE_ENV=production

RUN apk add --no-cache openssl

COPY package*.json .npmrc ./
RUN npm ci --omit=dev

COPY --from=builder /usr/src/app/dist ./dist

# O tsc compila o client gerado, mas não copia o binário do engine
COPY --from=builder /usr/src/app/generated/prisma/*.node ./dist/generated/prisma/

# Schema, migrations e config usados pelo "prisma migrate deploy"
COPY prisma ./prisma
COPY prisma.config.ts ./

EXPOSE 3333

CMD ["node", "dist/src/main/server.js"]
