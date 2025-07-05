# Architecture du Projet ClimbHelp

## Vue d'ensemble

Ce projet utilise Next.js 14 avec l'App Router, TypeScript strict, et une architecture modulaire pour une meilleure maintenabilité et extensibilité.

## Structure des dossiers

```
front/
├── src/
│   ├── app/                    # App Router (Next.js 14+)
│   │   ├── globals.css         # Styles globaux
│   │   ├── layout.tsx          # Layout racine
│   │   ├── page.tsx            # Page d'accueil
│   │   ├── (auth)/             # Routes groupées pour l'auth
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── auth-callback/
│   │   ├── (dashboard)/        # Routes groupées pour le dashboard
│   │   │   └── profile/
│   │   ├── payment/            # Page de paiement
│   │   └── api/                # API routes
│   ├── components/             # Composants réutilisables
│   │   ├── ui/                # Composants UI de base
│   │   │   ├── Button.tsx
│   │   │   ├── Button.module.css
│   │   │   ├── Input.tsx
│   │   │   └── Input.module.css
│   │   ├── layout/            # Composants de layout
│   │   │   ├── Header.tsx
│   │   │   ├── Header.module.css
│   │   │   ├── Footer.tsx
│   │   │   └── Footer.module.css
│   │   ├── auth/              # Composants d'authentification
│   │   ├── chatbot/           # Composants du chatbot
│   │   ├── payment/           # Composants de paiement
│   │   └── profile/           # Composants de profil
│   ├── contexts/              # Contextes React
│   │   └── AuthContext.tsx
│   ├── hooks/                 # Hooks personnalisés
│   │   ├── usePaymentValidation.ts
│   │   └── usePaymentFormatting.ts
│   ├── lib/                   # Utilitaires et configurations
│   │   ├── utils.ts           # Fonctions utilitaires
│   │   ├── db.ts              # Configuration API
│   │   ├── auth.ts            # Gestion de l'authentification
│   │   └── payment-config.ts  # Configuration de paiement
│   ├── types/                 # Types TypeScript
│   │   └── payment.ts
│   └── styles/                # Styles globaux et thèmes
├── public/                    # Assets statiques
├── next.config.ts             # Configuration Next.js
├── tsconfig.json              # Configuration TypeScript
└── package.json               # Dépendances
```

## Composants

### Composants UI de base (`components/ui/`)

Ces composants sont réutilisables dans toute l'application :

- **Button** : Bouton avec différentes variantes (primary, secondary, outline)
- **Input** : Champ de saisie avec validation et gestion d'erreurs

### Composants de layout (`components/layout/`)

Composants pour la structure de l'application :

- **Header** : Navigation principale
- **Footer** : Pied de page avec liens

### Composants spécialisés

- **Auth** : Composants d'authentification
- **Payment** : Composants de paiement
- **Chatbot** : Composants du chatbot
- **Profile** : Composants de profil utilisateur

## Hooks personnalisés (`hooks/`)

- **usePaymentValidation** : Validation des formulaires de paiement
- **usePaymentFormatting** : Formatage des champs de paiement

## Utilitaires (`lib/`)

### utils.ts
Fonctions utilitaires communes :
- `cn()` : Combine les classes CSS
- `formatPrice()` : Formate les prix
- `formatDate()` : Formate les dates
- `isValidEmail()` : Valide les emails
- `generateId()` : Génère des IDs uniques

### db.ts
Client API pour communiquer avec les microservices :
- `ApiClient` : Classe pour les requêtes HTTP
- `authService` : Service d'authentification
- `userService` : Service utilisateur
- `chatService` : Service de chat

### auth.ts
Gestionnaire d'authentification :
- `AuthManager` : Singleton pour gérer l'auth
- Gestion des tokens
- Gestion des données utilisateur

## Contextes (`contexts/`)

### AuthContext
Contexte React pour l'authentification :
- État de l'utilisateur
- Fonctions de connexion/déconnexion
- Gestion du chargement

## Types TypeScript (`types/`)

Définitions de types pour :
- Données de paiement
- Validation des formulaires
- Méthodes de paiement

## Configuration

### next.config.ts
Configuration Next.js avec :
- Routes typées
- Optimisations de production
- Headers de sécurité
- Redirections

### tsconfig.json
Configuration TypeScript stricte avec :
- Vérifications strictes
- Path mapping
- Configuration pour Next.js

## Bonnes pratiques

### 1. Architecture modulaire
- Séparation claire des responsabilités
- Composants réutilisables
- Hooks personnalisés pour la logique métier

### 2. TypeScript strict
- Types stricts pour éviter les erreurs
- Interfaces bien définies
- Validation des props

### 3. CSS Modules
- Scoping automatique des styles
- Pas de conflits de noms
- Support TypeScript

### 4. Performance
- Optimisations Next.js
- Lazy loading des composants
- Code splitting automatique

### 5. Sécurité
- Validation côté client et serveur
- Headers de sécurité
- Gestion sécurisée des tokens

## Extensibilité

L'architecture est conçue pour être facilement extensible :

1. **Nouveaux composants** : Ajoutez-les dans le dossier approprié
2. **Nouveaux hooks** : Créez-les dans `hooks/`
3. **Nouveaux services** : Ajoutez-les dans `lib/`
4. **Nouvelles pages** : Créez-les dans `app/`

## Développement

### Installation
```bash
npm install
```

### Développement
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Production
```bash
npm start
```

## Tests

### Tests unitaires
```bash
npm test
```

### Tests E2E
```bash
npm run test:e2e
```

## Déploiement

Le projet est configuré pour être déployé sur :
- Vercel (recommandé)
- Netlify
- AWS Amplify
- Docker

## Monitoring

- Logs d'erreur
- Métriques de performance
- Analytics utilisateur 