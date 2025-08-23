# Dockerfile pour le frontend Next.js
FROM node:18-alpine AS base

# Installer les dépendances uniquement quand nécessaire
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copier les fichiers de dépendances
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild la source uniquement quand nécessaire
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Définir les arguments de build pour les variables d'environnement
ARG NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_PAYMENT_SERVICE_URL
ARG NEXT_PUBLIC_AI_SERVICE_URL
ARG NEXT_PUBLIC_BDD_SERVICE_URL

# Définir les variables d'environnement pour le build
ENV NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_PAYMENT_SERVICE_URL=$NEXT_PUBLIC_PAYMENT_SERVICE_URL
ENV NEXT_PUBLIC_AI_SERVICE_URL=$NEXT_PUBLIC_AI_SERVICE_URL
ENV NEXT_PUBLIC_BDD_SERVICE_URL=$NEXT_PUBLIC_BDD_SERVICE_URL

# Générer la build de production
RUN npm run build

# Production image, copier tous les fichiers et exécuter next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Définir la permission correcte pour prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copier automatiquement les fichiers de sortie générés
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
