import React from "react";
import { Link } from "react-router-dom";
// Import des icônes pour les différentes sections
import { BookOpen, Search, Library } from "lucide-react";

/**
 * Composant Home
 * Page d'accueil de l'application présentant les principales fonctionnalités
 */
export function Home() {
  return (
    // Conteneur principal avec padding et largeur maximale
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* En-tête de la page avec titre et description */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Bienvenue sur MangaMania
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Découvrez de nouveaux mangas, gérez votre collection et suivez votre
          progression de lecture en un seul endroit.
        </p>
      </div>

      {/* Grille des fonctionnalités principales */}
      <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        {/* Carte "Découvrir des Mangas" */}
        <Link
          to="/decouvrir"
          className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
        >
          <Search className="w-12 h-12 text-indigo-600 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Découvrir des Mangas</h2>
          <p className="text-gray-600">
            Explorez de nouvelles séries et trouvez votre prochain manga
            préféré.
          </p>
        </Link>

        {/* Carte "Gérer ma Collection" */}
        <Link
          to="/collection"
          className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
        >
          <Library className="w-12 h-12 text-indigo-600 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Gérer ma Collection</h2>
          <p className="text-gray-600">
            Gardez une trace de votre collection de mangas et de votre
            progression.
          </p>
        </Link>

        {/* Carte "Suivre ma Lecture" */}
        <Link
          to="/lecture"
          className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
        >
          <BookOpen className="w-12 h-12 text-indigo-600 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Suivre ma Lecture</h2>
          <p className="text-gray-600">
            Ne manquez plus aucune sortie et suivez votre progression de
            lecture.
          </p>
        </Link>
      </div>

      {/* Section image */}
      <div className="mt-16 text-center">
        <img
          src="https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?auto=format&fit=crop&q=80&w=1200"
          alt="Collection de Mangas"
          className="rounded-xl shadow-lg mx-auto max-w-3xl"
        />
      </div>
    </div>
  );
}
