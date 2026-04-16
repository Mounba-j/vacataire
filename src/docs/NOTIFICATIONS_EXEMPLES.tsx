/**
 * EXEMPLES D'UTILISATION DU SYSTÈME DE NOTIFICATIONS
 * 
 * Ce fichier contient des exemples pratiques d'utilisation
 * du système de notifications dans différents contextes.
 */

import { useNotificationStore } from '../stores/notificationStore';
import { useAuthStore } from '../stores/authStore';

// ========================================
// EXEMPLE 1: Notification simple
// ========================================

export function ExempleNotificationSimple() {
  const { addNotification } = useNotificationStore();
  const { user } = useAuthStore();

  const envoyerNotification = () => {
    if (!user) return;
    
    addNotification({
      userId: user.id,
      type: 'system',
      titre: 'Action réussie',
      contenu: 'Votre profil a été mis à jour avec succès',
    });
  };

  return <button onClick={envoyerNotification}>Mettre à jour</button>;
}

// ========================================
// EXEMPLE 2: Notification avec lien
// ========================================

export function ExempleNotificationAvecLien() {
  const { addNotification } = useNotificationStore();
  const { user } = useAuthStore();

  const creerOffre = () => {
    if (!user) return;
    
    // ... logique de création d'offre
    
    addNotification({
      userId: user.id,
      type: 'offre',
      titre: 'Offre créée',
      contenu: 'Votre offre a été publiée et est maintenant visible par les enseignants',
      lien: '/dashboard/ecole', // Lien cliquable
    });
  };

  return <button onClick={creerOffre}>Créer une offre</button>;
}

// ========================================
// EXEMPLE 3: Utiliser les helpers
// ========================================

export function ExempleHelpers() {
  const { notifyNewMessage, notifyNewOffre } = useNotificationStore();
  const { user } = useAuthStore();

  const envoyerMessage = (destinataireId: number, contenu: string) => {
    // ... logique d'envoi de message
    
    // Notifier le destinataire automatiquement
    if (user) {
      notifyNewMessage(
        destinataireId,
        user.id,
        user.name
      );
    }
  };

  const publierOffre = (titre: string, offreId: number, enseignantsIds: number[]) => {
    // ... logique de publication
    
    // Notifier tous les enseignants concernés
    enseignantsIds.forEach(enseignantId => {
      notifyNewOffre(enseignantId, titre, offreId);
    });
  };

  return null; // Exemples de fonctions
}

// ========================================
// EXEMPLE 4: Notification conditionnelle
// ========================================

export function ExempleNotificationConditionnelle() {
  const { addNotification } = useNotificationStore();
  const { user } = useAuthStore();

  const traiterCandidature = (statut: 'acceptee' | 'refusee', candidatId: number) => {
    if (!user) return;
    
    // Ne notifier que si acceptée
    if (statut === 'acceptee') {
      addNotification({
        userId: candidatId,
        type: 'candidature',
        titre: 'Candidature acceptée !',
        contenu: `${user.name} a accepté votre candidature`,
        lien: '/dashboard/enseignant',
      });
    }
  };

  return null;
}

// ========================================
// EXEMPLE 5: Notification à plusieurs utilisateurs
// ========================================

export function ExempleNotificationMultiple() {
  const { addNotification } = useNotificationStore();

  const publierActualite = (titre: string, contenu: string, utilisateursIds: number[]) => {
    // Notifier chaque utilisateur
    utilisateursIds.forEach(userId => {
      addNotification({
        userId,
        type: 'actualite',
        titre: 'Nouvelle actualité',
        contenu: titre,
        lien: '/dashboard',
      });
    });
  };

  return null;
}

// ========================================
// EXEMPLE 6: Notification avec métadonnées
// ========================================

export function ExempleNotificationAvecMetadata() {
  const { addNotification } = useNotificationStore();
  const { user } = useAuthStore();

  const notifierConsultationCV = (enseignantId: number, ecoleNom: string) => {
    if (!user) return;
    
    addNotification({
      userId: enseignantId,
      type: 'cv',
      titre: 'Votre CV a été consulté',
      contenu: `${ecoleNom} a consulté votre CV`,
      lien: '/dashboard/enseignant',
      metadata: {
        expediteurId: user.id,
        expediteurNom: ecoleNom,
        timestamp: new Date().toISOString(),
      },
    });
  };

  return null;
}

// ========================================
// EXEMPLE 7: Gérer les notifications dans un composant
// ========================================

export function ExempleGestionNotifications() {
  const { 
    getNotificationsByUser, 
    markAsRead, 
    deleteNotification 
  } = useNotificationStore();
  const { user } = useAuthStore();

  if (!user) return null;

  const notifications = getNotificationsByUser(user.id);
  const notificationsNonLues = notifications.filter(n => !n.lue);

  const marquerCommeLu = (notificationId: number) => {
    markAsRead(notificationId);
  };

  const supprimer = (notificationId: number) => {
    deleteNotification(notificationId);
  };

  return (
    <div>
      <h3>Vous avez {notificationsNonLues.length} notifications non lues</h3>
      {notifications.map(notification => (
        <div key={notification.id}>
          <p>{notification.titre}</p>
          {!notification.lue && (
            <button onClick={() => marquerCommeLu(notification.id)}>
              Marquer comme lu
            </button>
          )}
          <button onClick={() => supprimer(notification.id)}>
            Supprimer
          </button>
        </div>
      ))}
    </div>
  );
}

// ========================================
// EXEMPLE 8: Intégration dans un formulaire
// ========================================

export function ExempleFormulaireAvecNotification() {
  const { addNotification } = useNotificationStore();
  const { user } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    try {
      // ... logique de soumission du formulaire
      
      // Notification de succès
      addNotification({
        userId: user.id,
        type: 'system',
        titre: 'Formulaire envoyé',
        contenu: 'Votre formulaire a été envoyé avec succès',
      });
    } catch (error) {
      // Notification d'erreur
      addNotification({
        userId: user.id,
        type: 'system',
        titre: 'Erreur',
        contenu: 'Une erreur est survenue lors de l\'envoi du formulaire',
      });
    }
  };

  return <form onSubmit={handleSubmit}>...</form>;
}

// ========================================
// EXEMPLE 9: Notification périodique (rappel)
// ========================================

export function ExempleNotificationRappel() {
  const { addNotification } = useNotificationStore();
  const { user } = useAuthStore();

  // Vérifier si le CV est à jour (exemple)
  const verifierCV = () => {
    if (!user) return;
    
    const derniereMiseAJourCV = new Date('2025-01-01'); // Exemple
    const maintenant = new Date();
    const differenceJours = Math.floor(
      (maintenant.getTime() - derniereMiseAJourCV.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Rappel si plus de 90 jours
    if (differenceJours > 90) {
      addNotification({
        userId: user.id,
        type: 'system',
        titre: 'Rappel : Mettez à jour votre CV',
        contenu: 'Votre CV n\'a pas été mis à jour depuis plus de 3 mois',
        lien: '/dashboard/enseignant',
      });
    }
  };

  return null;
}

// ========================================
// BONNES PRATIQUES
// ========================================

/**
 * ✅ DO:
 * - Utiliser les fonctions helper (notifyNewMessage, etc.) quand elles existent
 * - Ajouter un lien pertinent pour permettre l'action directe
 * - Utiliser le bon type de notification pour les couleurs/icônes appropriées
 * - Garder les titres courts et explicites
 * - Rendre le contenu informatif mais concis
 * 
 * ❌ DON'T:
 * - Ne pas créer de notifications pour chaque action mineure
 * - Ne pas oublier de vérifier si user existe avant de notifier
 * - Ne pas spammer l'utilisateur avec trop de notifications
 * - Ne pas utiliser de texte trop long (utiliser line-clamp si nécessaire)
 */
