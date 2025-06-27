# Chatbot avec Conversation Contextuelle

## Fonctionnalités

Le chatbot a été amélioré pour supporter des conversations contextuelles avec sauvegarde dans Supabase.

### Nouvelles fonctionnalités

1. **Conversation contextuelle** : Le bot a maintenant accès à l'historique de la conversation en cours
2. **Sauvegarde automatique** : Chaque échange est sauvegardé dans Supabase
3. **Sessions de conversation** : Les conversations sont organisées par session avec un UUID unique
4. **Persistance** : L'historique est restauré lors de la reconnexion
5. **Authentification avec ID** : L'ID utilisateur est inclus dans le token JWT

## Architecture

### Flux de données

1. **Frontend** → Envoie le message + historique au service AI
2. **Service AI** → Utilise l'historique pour générer une réponse contextuelle
3. **Frontend** → Sauvegarde l'échange dans Supabase via le service BDD
4. **Service BDD** → Stocke la conversation avec conversation_uid

### Structure des données

```typescript
interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface ConversationExchange {
  user_id: number;
  message: string;
  response: string;
  conversation_uid: string;
}

interface UserInfo {
  username: string;
  email: string;
  userId: number;
}
```

## Configuration

### Variables d'environnement

```env
# Service AI
AI_SERVICE_URL=http://localhost:3004

# Service BDD
BDD_SERVICE_URL=http://localhost:3003
```

### Base de données

La table `chat_conversations` stocke :
- `user_id` : ID de l'utilisateur (clé étrangère vers users.id)
- `conversation_uid` : UUID unique de la session
- `message` : Message de l'utilisateur
- `response` : Réponse du bot
- `created_at` / `updated_at` : Timestamps

### Token JWT

Le token JWT contient maintenant :
```json
{
  "username": "string",
  "email": "string", 
  "userId": number,
  "exp": number,
  "aud": "string"
}
```

## API Routes

### Frontend → Service AI
- `POST /api/chat` : Envoie message + historique au service AI

### Frontend → Service BDD
- `POST /api/chat-conversations` : Sauvegarde un échange avec user_id
- `GET /api/chat-conversations/session/[conversationUid]` : Récupère l'historique d'une session

## Utilisation

### Démarrage d'une nouvelle conversation
1. L'utilisateur envoie un message
2. Un nouveau `conversation_uid` est généré
3. Le message est envoyé au service AI sans historique
4. L'échange est sauvegardé dans Supabase avec user_id

### Continuation d'une conversation
1. L'utilisateur envoie un message
2. L'historique de la session est récupéré depuis Supabase
3. Le message + historique sont envoyés au service AI
4. Le bot génère une réponse contextuelle
5. L'échange est sauvegardé dans Supabase avec user_id

### Restauration d'une session
1. L'utilisateur se reconnecte
2. Le `conversation_uid` est restauré depuis localStorage
3. L'historique est chargé depuis Supabase
4. La conversation peut continuer

## Avantages

1. **Contexte** : Le bot comprend le fil de la conversation
2. **Persistance** : Les conversations ne sont pas perdues
3. **Sessions** : Plusieurs conversations peuvent coexister
4. **Performance** : L'historique est chargé à la demande
5. **Sécurité** : Utilisation de l'ID utilisateur au lieu de l'email
6. **Token enrichi** : L'ID utilisateur est disponible dans le token JWT

## Limitations actuelles

1. L'historique est limité à la session en cours
2. Pas de limite sur la taille de l'historique envoyé à l'AI
3. Pas de nettoyage automatique des anciennes conversations 