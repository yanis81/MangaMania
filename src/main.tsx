import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './App.tsx';
import PWAPrompt from './components/PWAPrompt';
// Import des styles globaux
import './index.css';

// Variable pour stocker la demande d'installation de la PWA
let deferredPrompt: any = null;

// Écoute de l'événement "beforeinstallprompt" qui se déclenche quand la PWA peut être installée
window.addEventListener('beforeinstallprompt', (e) => {
  // Empêche l'affichage de la popup d'installation par défaut
  e.preventDefault();
  // Stocke l'événement pour une utilisation ultérieure
  deferredPrompt = e;
  
  // Création d'un conteneur pour notre notification personnalisée
  const root = document.createElement('div');
  root.id = 'pwa-prompt';
  document.body.appendChild(root);
  
  // Affichage de notre notification personnalisée d'installation
  createRoot(root).render(
    <PWAPrompt
      type="install"
      onAction={async () => {
        if (deferredPrompt) {
          // Déclenche la popup d'installation native
          deferredPrompt.prompt();
          // Attend la réponse de l'utilisateur
          const { outcome } = await deferredPrompt.userChoice;
          if (outcome === 'accepted') {
            console.log('User accepted the install prompt');
          }
          // Réinitialise la variable
          deferredPrompt = null;
        }
        // Supprime la notification
        root.remove();
      }}
    />
  );
});

// Enregistrement et configuration du Service Worker
const updateSW = registerSW({
  onNeedRefresh() {
    // Création d'un conteneur pour la notification de mise à jour
    const root = document.createElement('div');
    root.id = 'pwa-update';
    document.body.appendChild(root);
    
    // Affichage de la notification de mise à jour
    createRoot(root).render(
      <PWAPrompt
        type="update"
        onAction={() => {
          // Recharge la page pour appliquer la mise à jour
          location.reload();
          root.remove();
        }}
      />
    );
  },
  onOfflineReady() {
    // Création d'un conteneur pour la notification de mode hors ligne
    const root = document.createElement('div');
    root.id = 'pwa-offline';
    document.body.appendChild(root);
    
    // Affichage de la notification de mode hors ligne
    createRoot(root).render(
      <PWAPrompt
        type="offline"
        onClose={() => root.remove()}
      />
    );
  },
});

// Montage de l'application React avec StrictMode
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);