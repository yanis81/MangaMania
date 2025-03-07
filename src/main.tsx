import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './App.tsx';
import PWAPrompt from './components/PWAPrompt';
// Import des styles globaux
import './index.css';

let deferredPrompt: any = null;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  
  // Afficher le prompt d'installation
  const root = document.createElement('div');
  root.id = 'pwa-prompt';
  document.body.appendChild(root);
  
  createRoot(root).render(
    <PWAPrompt
      type="install"
      onAction={async () => {
        if (deferredPrompt) {
          deferredPrompt.prompt();
          const { outcome } = await deferredPrompt.userChoice;
          if (outcome === 'accepted') {
            console.log('User accepted the install prompt');
          }
          deferredPrompt = null;
        }
        root.remove();
      }}
    />
  );
});

// PWA
const updateSW = registerSW({
  onNeedRefresh() {
    const root = document.createElement('div');
    root.id = 'pwa-update';
    document.body.appendChild(root);
    
    createRoot(root).render(
      <PWAPrompt
        type="update"
        onAction={() => {
          location.reload();
          root.remove();
        }}
      />
    );
  },
  onOfflineReady() {
    const root = document.createElement('div');
    root.id = 'pwa-offline';
    document.body.appendChild(root);
    
    createRoot(root).render(
      <PWAPrompt
        type="offline"
        onClose={() => root.remove()}
      />
    );
  },
});

// Création du point de montage React avec StrictMode pour de meilleures pratiques de développement
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);