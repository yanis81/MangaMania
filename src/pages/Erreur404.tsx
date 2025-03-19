import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { SEO } from '../components/SEO';

/**
 * Page d'erreur 404 - Page non trouvée
 * Affiche un message d'erreur convivial et un lien de retour à l'accueil
 */
export function Erreur404() {
  return (
    <>
      <SEO 
        title="Page non trouvée - MangaMania"
        description="La page que vous recherchez n'existe pas ou a été déplacée."
        type="website"
        url="/*"
      />
      
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Page non trouvée</h1>
          <p className="text-gray-600 mb-8">
            Désolé, la page que vous recherchez n'existe pas.
          </p>
          <Link
            to="/"
            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </>
  );
}