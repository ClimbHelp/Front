# ⚠️ Note sur styled-components, SSR et le FOUC (Flash Of Unstyled Content)

## Problème actuel
- Avec Next.js App Router (`/src/app`) et styled-components, le SSR (Server Side Rendering) des styles **n'est pas encore supporté officiellement**.
- Résultat : il y a un FOUC (Flash Of Unstyled Content) à chaque chargement de page, car les styles ne sont appliqués qu'après le chargement côté client.
- Le package `@styled-components/ssr` est annoncé par l'équipe styled-components, mais **n'est pas encore disponible sur npm** (juin 2024).

## Ce qu'il faudra faire dès que le support SSR sera disponible
1. **Installer le package SSR** (quand il sera publié) :
   ```sh
   npm install @styled-components/ssr
   ```
2. **Créer/adapter le provider** dans `src/app/providers.tsx` :
   ```tsx
   'use client';
   import React from 'react';
   import { useStyledComponentsRegistry } from '@styled-components/ssr';

   export default function StyledComponentsRegistry({ children }: { children: React.ReactNode }) {
     const Registry = useStyledComponentsRegistry();
     return <Registry>{children}</Registry>;
   }
   ```
3. **Envelopper l'application** dans ce provider dans `layout.tsx` :
   ```tsx
   import StyledComponentsRegistry from './providers';
   // ...
   <StyledComponentsRegistry>
     {/* ...app... */}
   </StyledComponentsRegistry>
   ```
4. **Redémarrer le serveur**

## En attendant
- Il n'y a pas de solution 100% propre pour supprimer le FOUC avec styled-components dans l'App Router.
- Si le FOUC devient trop gênant, tu peux :
  - Revenir au Pages Router (`/pages`) où le SSR styled-components fonctionne parfaitement
  - Utiliser un autre système de style compatible SSR (ex : CSS Modules, Emotion, etc.)

---
**À surveiller :**
- L'annonce officielle de la sortie de `@styled-components/ssr` sur https://github.com/styled-components/styled-components/issues/4398
- La documentation officielle styled-components : https://styled-components.com/docs/advanced#nextjs-app-directory-beta

---
**IMPORTANT :**
- **Si après le 7 juillet 2025 il n'y a toujours pas de correctif officiel pour le SSR styled-components dans l'App Router, il faudra migrer vers une autre solution (CSS Modules, Emotion, etc.) pour garantir un rendu sans FOUC avant la livraison du projet.** 