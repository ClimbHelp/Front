# Structure du Router Next.js 14

## Vue d'ensemble

Ce projet utilise Next.js 14 avec l'App Router et les groupes de routes pour organiser l'application de manière logique et maintenable.

## Structure des routes

```
src/app/
├── globals.css              # Styles globaux
├── layout.tsx               # Layout racine
├── page.tsx                 # Page d'accueil (/)
├── (auth)/                  # Groupe de routes d'authentification
│   ├── layout.tsx           # Layout pour les pages d'auth
│   ├── login/
│   │   └── page.tsx         # Page de connexion (/login)
│   └── register/
│       └── page.tsx         # Page d'inscription (/register)
├── (dashboard)/             # Groupe de routes du dashboard
│   ├── layout.tsx           # Layout pour les pages du dashboard
│   ├── dashboard/
│   │   └── page.tsx         # Page dashboard (/dashboard)
│   └── profile/
│       └── page.tsx         # Page de profil (/profile)
├── payment/
│   └── page.tsx             # Page de paiement (/payment)
└── api/                     # API routes
    ├── chat/
    ├── chat-conversations/
    └── test-bdd/
```

## Groupes de routes

### 1. Groupe `(auth)` - Authentification

**Layout** : `(auth)/layout.tsx`
- Design centré avec fond dégradé
- Container blanc avec ombre
- Animation d'entrée

**Pages** :
- `/login` - Connexion utilisateur
- `/register` - Inscription utilisateur

**Fonctionnalités** :
- Formulaires avec validation
- Gestion des erreurs
- Redirection automatique
- Design responsive

### 2. Groupe `(dashboard)` - Zone utilisateur

**Layout** : `(dashboard)/layout.tsx`
- Header et Footer inclus
- Provider d'authentification
- Fond gris clair

**Pages** :
- `/dashboard` - Tableau de bord principal
- `/profile` - Gestion du profil utilisateur

**Fonctionnalités** :
- Protection des routes (redirection si non connecté)
- État de chargement
- Interface utilisateur complète

### 3. Routes indépendantes

**`/payment`** - Page de paiement
- Design moderne et professionnel
- Formulaires de paiement
- Validation en temps réel
- Composants spécialisés

## Avantages des groupes de routes

### 1. Organisation logique
- Routes liées sont groupées ensemble
- Séparation claire des responsabilités
- Navigation plus intuitive

### 2. Layouts partagés
- Chaque groupe a son propre layout
- Réduction de la duplication de code
- Cohérence visuelle par section

### 3. Performance
- Code splitting automatique par groupe
- Chargement optimisé
- Bundle size réduit

### 4. Maintenabilité
- Structure claire et prévisible
- Facile d'ajouter de nouvelles routes
- Debugging simplifié

## Navigation

### Routes publiques
- `/` - Page d'accueil
- `/login` - Connexion
- `/register` - Inscription
- `/payment` - Achat

### Routes protégées
- `/dashboard` - Tableau de bord
- `/profile` - Profil utilisateur

### Redirections automatiques
- Utilisateur non connecté → `/login`
- Utilisateur connecté → `/dashboard`

## Composants de navigation

### Header (`components/layout/Header.tsx`)
- Logo et navigation principale
- Liens vers les sections importantes
- Design responsive

### Footer (`components/layout/Footer.tsx`)
- Informations de contact
- Liens utiles
- Copyright

## Gestion de l'état

### AuthContext (`contexts/AuthContext.tsx`)
- État de l'authentification
- Fonctions de connexion/déconnexion
- Protection des routes

### Hooks personnalisés
- `usePaymentValidation` - Validation des formulaires
- `usePaymentFormatting` - Formatage des champs

## Styles et design

### CSS Modules
- Scoping automatique
- Pas de conflits de noms
- Support TypeScript

### Design System
- Composants UI réutilisables
- Palette de couleurs cohérente
- Typographie uniforme

## Responsive Design

### Breakpoints
- Mobile : < 768px
- Tablet : 768px - 1024px
- Desktop : > 1024px

### Adaptations
- Navigation mobile (hamburger menu)
- Grilles flexibles
- Textes adaptatifs

## Sécurité

### Protection des routes
- Vérification de l'authentification
- Redirection automatique
- État de chargement

### Validation
- Côté client et serveur
- Messages d'erreur clairs
- Sanitisation des données

## Performance

### Optimisations Next.js
- Code splitting automatique
- Lazy loading des composants
- Optimisation des images
- Compression automatique

### Bundle Analysis
- Monitoring de la taille des bundles
- Optimisation continue
- Tree shaking automatique

## Développement

### Hot Reload
- Changements instantanés
- Préservation de l'état
- Debugging facilité

### TypeScript
- Types stricts
- IntelliSense complet
- Détection d'erreurs précoce

## Tests

### Tests unitaires
- Composants isolés
- Hooks personnalisés
- Utilitaires

### Tests d'intégration
- Flux d'authentification
- Navigation
- Formulaires

### Tests E2E
- Scénarios complets
- Validation utilisateur
- Performance

## Déploiement

### Build optimisé
- Minification automatique
- Tree shaking
- Compression

### Monitoring
- Logs d'erreur
- Métriques de performance
- Analytics utilisateur 