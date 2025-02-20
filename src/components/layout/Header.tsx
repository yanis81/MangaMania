import React from 'react';
import { Link } from 'react-router-dom';
// Import des icônes nécessaires depuis lucide-react
import { BookOpen, Search, Library, Bell } from 'lucide-react';

/**
 * Composant Header
 * Affiche l'en-tête de l'application avec le logo et la navigation principale
 */
export function Header() {
  return (
    // En-tête fixe en haut de la page
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      {/* Conteneur avec largeur maximale et padding */}
      <div className="max-w-7xl mx-auto px-4">
        {/* Flex container pour le logo et la navigation */}
        <div className="flex items-center justify-between h-16">
          {/* Logo et titre de l'application */}
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="w-6 h-6 text-indigo-600" />
            <span className="text-xl font-bold text-gray-900">MangaMania</span>
          </Link>
          
          {/* Navigation principale */}
          <nav className="flex items-center space-x-6">
            {/* Lien Découvrir */}
            <Link to="/decouvrir" className="flex flex-col items-center text-gray-600 hover:text-indigo-600">
              <Search className="w-6 h-6" />
              <span className="text-xs">Découvrir</span>
            </Link>
            {/* Lien Collection */}
            <Link to="/collection" className="flex flex-col items-center text-gray-600 hover:text-indigo-600">
              <Library className="w-6 h-6" />
              <span className="text-xs">Collection</span>
            </Link>
            {/* Lien Notifications */}
            <Link to="/notifications" className="flex flex-col items-center text-gray-600 hover:text-indigo-600">
              <Bell className="w-6 h-6" />
              <span className="text-xs">Notifications</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}