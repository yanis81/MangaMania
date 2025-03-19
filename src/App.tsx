import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from "./contexts/AuthContext";
import { Layout } from "./components/layout/Layout";
import { SEO } from "./components/SEO";

// Import des pages
import { Home } from "./pages/Home";
import { Collection } from "./pages/Collection";
import { Decouvrir } from "./pages/Decouvrir";
import { Lecture } from "./pages/Lecture";
import { Erreur404 } from "./pages/Erreur404";
import { MangaDetail } from "./pages/MangaDetail";
import { Calendrier } from "./pages/Calendrier";

/**
 * Routes de l'application
 * Définit la structure de navigation de l'application
 */
const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/collection" element={<Collection />} />
    <Route path="/decouvrir" element={<Decouvrir />} />
    <Route path="/lecture" element={<Lecture />} />
    <Route path="/calendrier" element={<Calendrier />} />
    <Route path="/manga/:id" element={<MangaDetail />} />
    <Route path="/*" element={<Erreur404 />} />
  </Routes>
);

/**
 * Composant principal de l'application
 * Gère la configuration du routeur et le contexte d'authentification
 */
const App: React.FC = () => {
  return (
    <HelmetProvider>
      <AuthProvider>
        <BrowserRouter>
          <Layout>
            {/* SEO par défaut pour l'application */}
            <SEO />
            <AppRoutes />
          </Layout>
        </BrowserRouter>
      </AuthProvider>
    </HelmetProvider>
  );
};

export default App;
