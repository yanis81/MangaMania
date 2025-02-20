import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { Collection } from './pages/Collection';
import { Decouvrir } from './pages/Decouvrir';

/**
 * Composant principal de l'application
 * Configure le routage et la mise en page globale
 */
function App() {
  return (
    // Configuration du routeur pour la navigation
    <BrowserRouter>
      {/* Layout global de l'application avec le header intégrer */}
      <Layout>
        {/* Configuration des routes */}
        <Routes>
          {/* Route de la page d'accueil */}
          <Route path="/" element={<Home />} />
          {/* Route de la page collection */}
          <Route path="/collection" element={<Collection />} />

          <Route path="/decouvrir" element={<Decouvrir />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;