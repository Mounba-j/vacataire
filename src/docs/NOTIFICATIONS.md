# Système de Notifications - Vacataire

## Vue d'ensemble

Le système de notifications permet de notifier les utilisateurs en temps réel des événements importants sur la plateforme : nouveaux messages, candidatures, réponses au forum, etc.

## Architecture

### Store (`/stores/notificationStore.ts`)

Le store Zustand gère l'état global des notifications :

```typescript
- notifications: Notification[] // Liste de toutes les notifications
- addNotification() // Ajouter une notification
- markAsRead() // Marquer comme lue
- markAllAsRead() // Tout marquer comme lu
- deleteNotification() // Supprimer une notification
- getNotificationsByUser() // Récupérer par utilisateur
- getUnreadCount() // Nombre de non lues
```

### Types de notifications

- `message` : Nouveaux messages privés
- `offre` : Nouvelles offres d'emploi
- `candidature` : Nouvelles candidatures
- `forum` : Réponses aux posts du forum
- `cv` : Consultations de CV
- `actualite` : Nouvelles actualités
- `admin` : Notifications administratives
- `system` : Notifications système

## Composants

### NotificationDropdown (`/components/NotificationDropdown.tsx`)

Widget de notifications dans le header avec :
- Badge indiquant le nombre de notifications non lues
- Liste déroulante des dernières notifications
- Actions : marquer comme lu, supprimer
- Lien vers la page complète

### NotificationsPage (`/pages/NotificationsPage.tsx`)

Page complète de gestion des notifications avec :
- Filtres (toutes, non lues, par type)
- Actions groupées (tout marquer comme lu, tout supprimer)
- Vue détaillée de chaque notification

### NotificationTestPanel (`/components/NotificationTestPanel.tsx`)

Panneau de test pour développeurs permettant de générer des notifications de test.

## Intégration

### 1. Dans les stores

Les notifications sont automatiquement créées lors de certaines actions :

**Messages** (`/stores/messageStore.ts`)
```typescript
sendMessage() {
  // ... envoi du message
  useNotificationStore.getState().notifyNewMessage(
    recipientId,
    senderId,
    senderName
  );
}
```

**Offres** (`/stores/offreStore.ts`)
```typescript
addCandidature() {
  // ... ajout de la candidature
  useNotificationStore.getState().notifyNewCandidature(
    ecoleId,
    candidateName,
    offreId
  );
}
```

**Forum** (`/stores/forumStore.ts`)
```typescript
addReponse() {
  // ... ajout de la réponse
  useNotificationStore.getState().notifyForumReply(
    postAuthorId,
    postId,
    replyAuthorName
  );
}
```

### 2. Création manuelle

Pour créer une notification personnalisée :

```typescript
import { useNotificationStore } from '../stores/notificationStore';

const { addNotification } = useNotificationStore();

addNotification({
  userId: targetUserId,
  type: 'system',
  titre: 'Titre de la notification',
  contenu: 'Contenu détaillé',
  lien: '/chemin/optionnel', // Optionnel
  metadata: { // Optionnel
    customData: 'value'
  }
});
```

### 3. Fonctions helper

Le store fournit des fonctions helper pour les cas courants :

```typescript
// Nouveau message
notifyNewMessage(userId, expediteurId, expediteurNom);

// Nouvelle offre
notifyNewOffre(userId, titre, offreId);

// Nouvelle candidature
notifyNewCandidature(userId, candidatNom, offreId);

// Réponse au forum
notifyForumReply(userId, postId, auteurNom);

// Nouvelle actualité
notifyNewActualite(userId, titre);
```

## Utilisation avancée

### Hook de notification en temps réel

```typescript
import { useNotificationListener } from '../hooks/useNotificationListener';

function MyComponent() {
  // Active l'écoute des nouvelles notifications
  useNotificationListener();
  
  return <div>...</div>;
}
```

### Son de notification

```typescript
import { playNotificationSound } from '../hooks/useNotificationListener';

// Jouer un son lors d'une notification
playNotificationSound();
```

## Personnalisation

### Couleurs et icônes

Les couleurs et icônes sont définies par type dans `NotificationDropdown.tsx` :

```typescript
const getNotificationColor = (type: NotificationType) => {
  switch (type) {
    case 'message':
      return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600';
    // ...
  }
};
```

### Format de date

Le formatage relatif des dates est géré dans la fonction `formatDate()` :
- "À l'instant" (< 1 min)
- "Il y a X min" (< 1h)
- "Il y a Xh" (< 24h)
- "Il y a Xj" (< 7j)
- Date complète (> 7j)

## Routes

- `/notifications` : Page complète des notifications (tous les rôles connectés)

## Permissions

Tous les utilisateurs authentiqués ont accès aux notifications :
- Admin
- Enseignant
- École
- Parent

## Données persistantes

Les notifications sont actuellement stockées en mémoire (Zustand). Pour une persistance réelle :

1. Ajouter la persistance localStorage :
```typescript
import { persist } from 'zustand/middleware';

export const useNotificationStore = create(
  persist(
    (set, get) => ({ ... }),
    { name: 'vacataire-notifications' }
  )
);
```

2. Ou intégrer avec le backend Laravel via API REST

## Tests

Utilisez le `NotificationTestPanel` (visible dans le DashboardLayout en mode dev) pour tester tous les types de notifications sans déclencher les actions réelles.

## Bonnes pratiques

1. **Ne pas spammer** : Grouper les notifications similaires
2. **Être explicite** : Titres et contenus clairs
3. **Ajouter des liens** : Permettre l'action directe
4. **Nettoyer régulièrement** : Supprimer les anciennes notifications
5. **Respecter les préférences** : Implémenter des paramètres de notification

## Future roadmap

- [ ] Préférences utilisateur (activer/désactiver par type)
- [ ] Notifications push (PWA)
- [ ] Email pour notifications importantes
- [ ] Groupement intelligent des notifications
- [ ] Marquage en masse par type
- [ ] Export des notifications
- [ ] Statistiques de notifications
