# Guide des Tests - Front Next.js

## Vue d'ensemble

Ce projet utilise Jest et React Testing Library pour les tests unitaires et d'intégration.

## Structure des Tests

```
src/
├── components/
│   └── ui/
│       └── __tests__/
│           ├── Button.test.tsx
│           └── Input.test.tsx
├── contexts/
│   └── __tests__/
│       └── AuthContext.test.tsx
├── hooks/
│   └── __tests__/
│       └── usePaymentFormatting.test.ts
├── lib/
│   └── __tests__/
│       └── utils.test.ts
└── app/
    └── components/
        └── __tests__/
            └── ProtectedRoute.test.tsx
```

## Scripts de Test

- `npm test` - Exécute tous les tests
- `npm run test:watch` - Exécute les tests en mode watch
- `npm run test:coverage` - Exécute les tests avec rapport de couverture

## Configuration

### Jest Configuration (`jest.config.js`)
- Support Next.js avec `next/jest`
- Environnement jsdom pour les tests React
- Mappage des modules avec alias `@/`
- Seuils de couverture configurés à 70%

### Setup Jest (`jest.setup.js`)
- Import de `@testing-library/jest-dom`
- Mocks pour Next.js router et navigation
- Variables d'environnement de test
- Mocks pour les APIs du navigateur

## Types de Tests

### 1. Tests de Composants UI

**Exemple : Button.test.tsx**
```typescript
describe('Button Component', () => {
  it('renders with default props', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })
})
```

**Bonnes pratiques :**
- Tester le rendu par défaut
- Tester les props personnalisées
- Tester les interactions utilisateur
- Tester les états (disabled, loading, etc.)

### 2. Tests de Contextes

**Exemple : AuthContext.test.tsx**
```typescript
describe('AuthContext', () => {
  it('provides initial state', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )
    expect(screen.getByTestId('loading')).toHaveTextContent('true')
  })
})
```

**Bonnes pratiques :**
- Tester l'état initial
- Tester les fonctions de mise à jour
- Tester les erreurs
- Mocker localStorage et APIs externes

### 3. Tests de Hooks

**Exemple : usePaymentFormatting.test.ts**
```typescript
describe('usePaymentFormatting', () => {
  it('formats card number correctly', () => {
    const { result } = renderHook(() => usePaymentFormatting())
    expect(result.current.formatCardNumber('1234567890123456'))
      .toBe('1234 5678 9012 3456')
  })
})
```

**Bonnes pratiques :**
- Utiliser `renderHook` de React Testing Library
- Tester tous les cas d'usage
- Tester les cas limites et d'erreur

### 4. Tests d'Utilitaires

**Exemple : utils.test.ts**
```typescript
describe('Utils', () => {
  describe('formatPrice', () => {
    it('formats price with default currency', () => {
      expect(formatPrice(100)).toBe('100€')
    })
  })
})
```

**Bonnes pratiques :**
- Tests purs sans mocks
- Tester tous les cas d'usage
- Tester les cas limites

## Mocks et Stubs

### Mocks Globaux (jest.setup.js)

```javascript
// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      // ... autres méthodes
    }
  },
}))

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  // ...
}
```

### Mocks Locaux

```typescript
// Dans un test spécifique
jest.mock('../api', () => ({
  fetchUser: jest.fn().mockResolvedValue({ id: 1, name: 'Test' })
}))
```

## Couverture de Code

### Seuils Configurés
- **Branches** : 70%
- **Functions** : 70%
- **Lines** : 70%
- **Statements** : 70%

### Rapport de Couverture
Le rapport est généré dans le dossier `coverage/` et inclut :
- HTML : `coverage/lcov-report/index.html`
- LCOV : `coverage/lcov.info`

## Bonnes Pratiques

### 1. Nommage des Tests
```typescript
describe('ComponentName', () => {
  it('should render correctly with default props', () => {})
  it('should handle user interactions', () => {})
  it('should display error state when API fails', () => {})
})
```

### 2. Organisation des Tests
```typescript
describe('Component', () => {
  describe('when user is authenticated', () => {
    it('should render protected content', () => {})
  })
  
  describe('when user is not authenticated', () => {
    it('should redirect to login', () => {})
  })
})
```

### 3. Sélecteurs Recommandés
```typescript
// ✅ Préféré
screen.getByRole('button', { name: /submit/i })
screen.getByLabelText('Email')
screen.getByTestId('loading-spinner')

// ❌ Éviter
screen.getByClassName('btn-primary')
screen.getByText('Submit')
```

### 4. Assertions
```typescript
// ✅ Préféré
expect(screen.getByRole('button')).toBeInTheDocument()
expect(screen.getByRole('button')).toBeDisabled()
expect(mockFunction).toHaveBeenCalledWith(expectedArgs)

// ❌ Éviter
expect(wrapper.find('.button').exists()).toBe(true)
```

## Debugging des Tests

### Mode Debug
```bash
npm run test:watch
```
Puis appuyer sur `d` pour ouvrir le debugger.

### Logs Détaillés
```bash
npm test -- --verbose
```

### Test Spécifique
```bash
npm test -- Button.test.tsx
```

## Intégration CI/CD

Les tests sont automatiquement exécutés dans le pipeline CI/CD :
1. **Installation** des dépendances
2. **Linting** du code
3. **Tests** avec couverture
4. **Build** de l'application
5. **Déploiement** si les tests passent

## Ressources

- [React Testing Library Documentation](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Next.js Testing](https://nextjs.org/docs/testing)
