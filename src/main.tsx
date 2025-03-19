import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './App.tsx';
import PWAPrompt from './components/PWAPrompt';
// Import des styles globaux
import './index.css';

// Types pour la gestion de la PWA
type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

// Variable pour stocker la demande d'installation de la PWA
let deferredPrompt: BeforeInstallPromptEvent | null = null;

/**
 * Crée et affiche une notification PWA
 * @param type - Le type de notification ('install' | 'update' | 'offline')
 * @param onAction - Callback à exécuter lors de l'action
 * @param onClose - Callback optionnel de fermeture
 */
const showPWAPrompt = (
  type: 'install' | 'update' | 'offline',
  onAction?: () => Promise<void> | void,
  onClose?: () => void
) => {
  const root = document.createElement('div');
  root.id = `pwa-${type}`;
  document.body.appendChild(root);

  createRoot(root).render(
    <PWAPrompt
      type={type}
      onAction={async () => {
        await onAction?.();
        root.remove();
      }}
      onClose={() => {
        onClose?.();
        root.remove();
      }}
    />
  );
};

// Gestion de l'installation de la PWA
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e as BeforeInstallPromptEvent;
  
  showPWAPrompt('install', async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('Installation PWA acceptée');
      }
      deferredPrompt = null;
    }
  });
});

// Configuration du Service Worker
const updateSW = registerSW({
  onNeedRefresh: () => {
    showPWAPrompt('update', () => {
      location.reload();
    });
  },
  onOfflineReady: () => {
    showPWAPrompt('offline');
  },
});

// Montage de l'application React
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Element root non trouvé');

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);