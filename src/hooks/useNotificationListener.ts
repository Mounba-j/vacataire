import { useEffect, useRef } from 'react';
import { useNotificationStore } from '../stores/notificationStore';
import { useAuthStore } from '../stores/authStore';

/**
 * Hook personnalisé pour écouter les nouvelles notifications
 * Permet d'afficher des toasts ou de jouer des sons lorsqu'une notification arrive
 */
export function useNotificationListener() {
  const { user } = useAuthStore();
  const { getNotificationsByUser } = useNotificationStore();
  const previousCountRef = useRef<number>(0);

  useEffect(() => {
    if (!user) return;

    const checkForNewNotifications = () => {
      const notifications = getNotificationsByUser(user.id);
      const currentCount = notifications.length;

      // Si on a plus de notifications qu'avant, c'est qu'il y en a une nouvelle
      if (previousCountRef.current > 0 && currentCount > previousCountRef.current) {
        const newNotification = notifications[0]; // La plus récente
        
        // Vous pouvez ajouter ici un toast ou un son
        // Par exemple avec sonner:
        // toast.info(newNotification.titre, {
        //   description: newNotification.contenu,
        // });

        // Ou un son:
        // playNotificationSound();
      }

      previousCountRef.current = currentCount;
    };

    // Vérifier toutes les 2 secondes (ajustable selon les besoins)
    const interval = setInterval(checkForNewNotifications, 2000);

    // Vérification initiale
    checkForNewNotifications();

    return () => clearInterval(interval);
  }, [user, getNotificationsByUser]);
}

/**
 * Fonction utilitaire pour jouer un son de notification
 */
export function playNotificationSound() {
  // Créer un son simple avec l'API Web Audio
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.frequency.value = 800;
  oscillator.type = 'sine';

  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.5);
}
