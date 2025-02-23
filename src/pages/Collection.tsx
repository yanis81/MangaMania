import React, { useState, useEffect } from 'react';
import { Search, Plus, BookOpen } from 'lucide-react';
import { mangaService, type MangaCollection } from '../services/mangaService';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

/**
 * Composant Collection
 * Page permettant de gérer la collection de mangas de l'utilisateur
 */
export function Collection() {
  const { user } = useAuth();
  const [collection, setCollection] = useState<MangaCollection[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCollection();
  }, [user]);

  const loadCollection = async () => {
    try {
      if (user) {
        const userCollection = await mangaService.getUserCollection();
        setCollection(userCollection);
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la collection:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour filtrer les mangas de la collection
  const filteredCollection = collection.filter(manga => 
    manga.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    manga.synopsis.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">
            Connectez-vous pour accéder à votre collection.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-gray-600">Chargement de votre collection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* En-tête de la page */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Ma Collection de Mangas
        </h1>
        <p className="text-lg text-gray-600">
          Gérez votre collection et retrouvez facilement vos mangas
        </p>
      </div>

      {/* Barre de recherche */}
      <div className="max-w-2xl mx-auto mb-12">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Rechercher dans ma collection..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
          </div>
        </div>
      </div>

      {/* Collection de l'utilisateur */}
      <div>
        <h2 className="text-2xl font-semibold mb-4 flex items-center">
          <BookOpen className="w-6 h-6 mr-2 text-indigo-600" />
          Ma Collection ({collection.length})
          {searchQuery && ` - ${filteredCollection.length} résultat(s)`}
        </h2>
        {collection.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-600">
              Votre collection est vide. Ajoutez des mangas depuis la page "Découvrir" !
            </p>
          </div>
        ) : filteredCollection.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-600">
              Aucun manga ne correspond à votre recherche.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCollection.map((manga) => (
              <div key={`collection-${manga.mal_id}`} className="bg-white rounded-lg shadow-md overflow-hidden">
                <Link to={`/manga/${manga.mal_id}`}>
                  <img
                    src={manga.image_url}
                    alt={manga.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{manga.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-3">
                      {manga.synopsis}
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}