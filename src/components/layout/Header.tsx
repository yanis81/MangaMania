import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Search, Library, Eye } from 'lucide-react';

/**
 * Composant Header
 * Affiche l'en-tête de l'application avec le logo et la navigation principale
 */
export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="w-6 h-6 text-indigo-600" />
            <span className="text-xl font-bold text-gray-900">MangaCollect</span>
          </Link>
          
          <nav className="flex items-center space-x-6">
            <Link to="/discover" className="flex flex-col items-center text-gray-600 hover:text-indigo-600">
              <Search className="w-6 h-6" />
              <span className="text-xs">Découvrir</span>
            </Link>
            <Link to="/collection" className="flex flex-col items-center text-gray-600 hover:text-indigo-600">
              <Library className="w-6 h-6" />
              <span className="text-xs">Collection</span>
            </Link>
            <Link to="/lecture" className="flex flex-col items-center text-gray-600 hover:text-indigo-600">
              <Eye className="w-6 h-6" />
              <span className="text-xs">Lecture</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}