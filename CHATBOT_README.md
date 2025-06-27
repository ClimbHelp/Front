# Chatbot ClimbHelp

## Fonctionnalités

- ✅ Bouton rond en bas à droite de la page
- ✅ Popup qui s'ouvre au clic
- ✅ Accessible uniquement aux utilisateurs connectés
- ✅ Persistance de l'état entre les pages (localStorage)
- ✅ Interface moderne et responsive
- ✅ Intégration avec le service AI

## Installation

1. **Configuration d'environnement**
   
   Créez un fichier `.env.local` dans le dossier `front-Alexiiisv/` :
   ```bash
   AI_SERVICE_URL=http://localhost:3001
   ```

2. **Démarrer le service AI**
   
   Dans le dossier `ai-service/` :
   ```bash
   npm install
   npm run dev
   ```

3. **Démarrer le frontend**
   
   Dans le dossier `front-Alexiiisv/` :
   ```bash
   npm install
   npm run dev
   ```

## Utilisation

1. Connectez-vous à votre compte
2. Le bouton chatbot (💬) apparaîtra en bas à droite
3. Cliquez sur le bouton pour ouvrir la popup
4. Tapez vos messages et appuyez sur Entrée ou cliquez sur "Envoyer"
5. La popup reste ouverte lors de la navigation entre les pages
6. Cliquez sur ✕ pour fermer la popup

## Architecture

### Composants créés

- `ChatbotContext.tsx` : Gestion de l'état global du chatbot
- `ChatBot.tsx` : Interface utilisateur du chatbot
- `registry.tsx` : Configuration styled-components pour Next.js
- `api/chat/route.ts` : Route API pour communiquer avec le service AI

### Fonctionnalités techniques

- **Persistance** : L'état du chatbot (ouvert/fermé et messages) est sauvegardé dans localStorage
- **Authentification** : Le chatbot n'apparaît que pour les utilisateurs connectés
- **Responsive** : Interface adaptée aux différentes tailles d'écran
- **Accessibilité** : Labels ARIA et navigation au clavier
- **Performance** : Scroll automatique vers les nouveaux messages

## Personnalisation

### Modifier les couleurs

Dans `ChatBot.tsx`, vous pouvez modifier les couleurs en changeant les valeurs dans les styled-components :

```typescript
// Couleur du bouton fermé
background: '#2ed573'

// Couleur du bouton ouvert
background: '#ff4757'

// Couleur des messages utilisateur
background: '#667eea'
```

### Modifier le style

Tous les styles sont dans `ChatBot.tsx` avec styled-components. Vous pouvez facilement modifier :
- La taille de la popup (`width`, `height`)
- La position (`bottom`, `right`)
- Les couleurs et gradients
- Les animations

## Dépannage

### Le chatbot n'apparaît pas
- Vérifiez que vous êtes connecté
- Vérifiez que le service AI est démarré
- Vérifiez la configuration `AI_SERVICE_URL`

### Erreurs de communication
- Vérifiez que le service AI répond sur le bon port
- Vérifiez les logs du service AI
- Vérifiez la configuration CORS

### Problèmes de style
- Vérifiez que styled-components est bien installé
- Vérifiez que le registry est bien configuré
- Redémarrez le serveur de développement 