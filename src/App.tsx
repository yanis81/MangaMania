import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { Layout } from "./components/layout/Layout";
import { Home } from "./pages/Home";
import { Collection } from "./pages/Collection";
import { Decouvrir } from "./pages/Decouvrir";
import { Lecture } from "./pages/Lecture";
import { Erreur404 } from "./pages/Erreur404";
import { MangaDetail } from "./pages/MangaDetail";

/**
 * Composant principal de l'application
 * Configure le routage et la mise en page globale
 */
function App() {
  return (
    <AuthProvider>
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
            {/* Route de la page découvrir */}
            <Route path="/decouvrir" element={<Decouvrir />} />
            {/* Route de la page lecture */}
            <Route path="/lecture" element={<Lecture />} />
            {/* Route de la page individuel d'un manga*/}
            <Route path="/manga/:id" element={<MangaDetail />} />
            {/* Route de la page erreur 404 */}
            <Route path="/*" element={<Erreur404 />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
