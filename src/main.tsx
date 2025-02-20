import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
// Import des styles globaux
import './index.css';

// Création du point de montage React avec StrictMode pour de meilleures pratiques de développement
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);