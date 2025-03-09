import { useState, useEffect } from 'react';

/**
 * Hook personnalisé pour suivre l'état de la connexion réseau
 * @returns {boolean} - true si l'appareil est en ligne, false sinon
 */
export const useNetworkStatus = () => {
  // Initialise l'état avec la valeur actuelle de navigator.onLine
  // navigator.onLine retourne true si le navigateur est connecté à internet
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Fonction appelée quand la connexion est rétablie
    const handleOnline = () => setIsOnline(true);
    
    // Fonction appelée quand la connexion est perdue
    const handleOffline = () => setIsOnline(false);

    // Ajoute les écouteurs d'événements pour détecter les changements de connexion
    window.addEventListener('online', handleOnline);   // Événement déclenché quand la connexion est rétablie
    window.addEventListener('offline', handleOffline); // Événement déclenché quand la connexion est perdue

    // Fonction de nettoyage pour retirer les écouteurs d'événements
    // Cette fonction est appelée quand le composant est démonté
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []); // Le tableau de dépendances vide signifie que l'effet n'est exécuté qu'une fois au montage

  // Retourne l'état actuel de la connexion
  return isOnline;
}; 