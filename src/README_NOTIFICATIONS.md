# 🔔 Système de Notifications - Guide Rapide

## Fonctionnalités Implémentées

✅ **Store Zustand** pour la gestion centralisée des notifications  
✅ **Dropdown de notifications** dans le header avec badge  
✅ **Page dédiée** `/notifications` avec filtres avancés  
✅ **Intégration automatique** dans messages, offres, forum  
✅ **7 types de notifications** (message, offre, candidature, forum, CV, actualité, admin/system)  
✅ **Badge de compteur** dans le titre de la page  
✅ **Panel de test** pour développeurs  
✅ **Mode clair/sombre** compatible  
✅ **Responsive** sur mobile et desktop  

## Accès Rapide

### Pour Tester

1. **Connectez-vous** avec n'importe quel compte :
   - `enseignant1@vacataire.local` / `password123`
   - `ecole1@vacataire.local` / `password123`
   - `parent1@vacataire.local` / `password123`
   - `admin@vacataire.local` / `password123`

2. **Cliquez sur l'icône 🔔** dans le header pour voir vos notifications

3. **Utilisez le bouton "Test Notifications"** en bas à droite pour générer des notifications de test

4. **Visitez `/notifications`** pour la vue complète

### Actions Automatiques qui Génèrent des Notifications

- **💬 Envoi d'un message** → Notifie le destinataire
- **📄 Candidature à une offre** → Notifie l'école
- **💭 Réponse au forum** → Notifie l'auteur du post
- **📰 Publication d'actualité** → Notifie les utilisateurs concernés

## Utilisation dans le Code

### Créer une notification simple

```typescript
import { useNotificationStore } from './stores/notificationStore';

const { addNotification } = useNotificationStore();

addNotification({
  userId: targetUserId,
  type: 'system',
  titre: 'Bienvenue !',
  contenu: 'Votre compte a été créé avec succès',
  lien: '/dashboard',
});
```

### Fonctions helper disponibles

```typescript
const { 
  notifyNewMessage,
  notifyNewOffre,
  notifyNewCandidature,
  notifyForumReply,
  notifyNewActualite
} = useNotificationStore();

// Exemple : Notifier d'un nouveau message
notifyNewMessage(recipientId, senderId, senderName);

// Exemple : Notifier d'une nouvelle candidature
notifyNewCandidature(ecoleId, candidateName, offreId);
```

## Personnalisation

### Changer les couleurs

Éditez `getNotificationColor()` dans `/components/NotificationDropdown.tsx`

### Ajouter un nouveau type

1. Ajoutez le type dans `/stores/notificationStore.ts` :
```typescript
export type NotificationType = 
  | 'message' 
  | 'votre_nouveau_type';
```

2. Ajoutez l'icône et la couleur dans `NotificationDropdown.tsx`

3. Créez une fonction helper si nécessaire

## Architecture

```
/stores/notificationStore.ts       → Store Zustand (état global)
/components/NotificationDropdown.tsx → Widget dans le header
/pages/NotificationsPage.tsx       → Page complète
/components/NotificationTestPanel.tsx → Panel de test (dev)
/hooks/useNotificationListener.ts  → Hook pour écoute temps réel
/docs/NOTIFICATIONS.md             → Documentation complète
```

## Prochaines Étapes

Pour passer en production :

1. **Persistance** : Ajouter le middleware `persist` de Zustand ou connecter au backend
2. **API REST** : Créer les endpoints Laravel pour synchroniser avec la DB
3. **WebSockets** : Implémenter Laravel Echo pour les notifications temps réel
4. **Push notifications** : Ajouter le service worker pour les notifications PWA
5. **Préférences utilisateur** : Permettre de désactiver certains types
6. **Email** : Envoyer des emails pour les notifications importantes

## Support

- 📚 Documentation complète : `/docs/NOTIFICATIONS.md`
- 🐛 En cas de problème : Vérifier la console du navigateur
- 💡 Pour améliorer : Ouvrir une issue ou proposer une PR

---

**Créé avec ❤️ pour la plateforme Vacataire**
