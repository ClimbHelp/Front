# Configuration CI/CD pour le Front Next.js

## Vue d'ensemble

Ce pipeline GitHub Actions automatise le processus de test, build et déploiement du frontend Next.js.

## Variables d'environnement requises

Pour que le pipeline fonctionne correctement, vous devez configurer les secrets suivants dans votre repository GitHub :

### Secrets GitHub à configurer

1. **NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY**
   - Clé publique Stripe pour les paiements
   - Format : `pk_test_...` ou `pk_live_...`

2. **NEXT_PUBLIC_PAYMENT_SERVICE_URL**
   - URL du service de paiement
   - Exemple : `https://payment-service.example.com`

3. **NEXT_PUBLIC_AI_SERVICE_URL**
   - URL du service d'IA
   - Exemple : `https://ai-service.example.com`

4. **NEXT_PUBLIC_BDD_SERVICE_URL**
   - URL du service de base de données
   - Exemple : `https://bdd-service.example.com`

### Comment configurer les secrets

1. Allez dans votre repository GitHub
2. Cliquez sur **Settings** > **Secrets and variables** > **Actions**
3. Cliquez sur **New repository secret**
4. Ajoutez chaque variable avec sa valeur correspondante

## Étapes du pipeline

### 1. Test et Lint (`test`)
- Installation des dépendances
- Exécution du linting avec ESLint
- Build de l'application avec les variables d'environnement

### 2. Build et Push Docker (`build-and-push`)
- Construction de l'image Docker
- Push vers GitHub Container Registry (ghcr.io)
- Tagging automatique basé sur la branche et le commit

### 3. Déploiement Staging (`deploy-staging`)
- Déploiement automatique sur la branche `develop`
- Environnement de staging

### 4. Déploiement Production (`deploy-production`)
- Déploiement automatique sur la branche `main`
- Environnement de production

## Déclencheurs

Le pipeline se déclenche sur :
- Push sur les branches `main` et `develop`
- Pull requests vers `main` et `develop`
- Modifications dans le dossier `front/`

## Images Docker générées

Les images sont taggées automatiquement :
- `latest` : dernière version sur la branche principale
- `main-<sha>` : version spécifique de la branche main
- `develop-<sha>` : version spécifique de la branche develop
- `pr-<number>` : pull requests

## Personnalisation du déploiement

Pour personnaliser le déploiement, modifiez les étapes `deploy-staging` et `deploy-production` dans le fichier `.github/workflows/ci-cd.yml`.

Exemples de déploiement :
- Kubernetes : `kubectl apply -f k8s/`
- Docker Compose : `docker-compose up -d`
- Vercel : `vercel --prod`
- Netlify : `netlify deploy --prod`

## Troubleshooting

### Erreurs courantes

1. **Build échoue à cause des variables d'environnement**
   - Vérifiez que tous les secrets sont configurés
   - Assurez-vous que les URLs sont accessibles

2. **Push Docker échoue**
   - Vérifiez les permissions du repository
   - Assurez-vous que le token GitHub a les bonnes permissions

3. **Déploiement échoue**
   - Vérifiez la configuration de l'environnement
   - Assurez-vous que les ressources de déploiement sont disponibles

### Logs et debugging

Les logs détaillés sont disponibles dans l'onglet **Actions** de votre repository GitHub.
