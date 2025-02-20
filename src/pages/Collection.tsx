import React, { useState } from 'react';
import axios from 'axios';
import { Search, Plus, BookOpen } from 'lucide-react';

// Interface pour les données de manga
interface Manga {
  mal_id: number;
  title: string;
  images: {
    jpg: {
      image_url: string;
    };
  };
  synopsis: string;
}

/**
 * Composant Collection
 * Page permettant de gérer la collection de mangas de l'utilisateur
 */
export function Collection() {
  // État pour stocker les résultats de recherche
  const [searchResults, setSearchResults] = useState<Manga[]>([]);
  // État pour stocker la valeur de recherche
  const [searchQuery, setSearchQuery] = useState('');
  // État pour stocker la collection de l'utilisateur
  const [collection, setCollection] = useState<Manga[]>([]);
  // État pour gérer le chargement
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Fonction pour rechercher des mangas via l'API Jikan
   */
  const searchMangas = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await axios.get(`https://api.jikan.moe/v4/manga?q=${searchQuery}`);
      setSearchResults(response.data.data);
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Fonction pour ajouter un manga à la collection
   */
  const addToCollection = (manga: Manga) => {
    if (!collection.find(m => m.mal_id === manga.mal_id)) {
      setCollection([...collection, manga]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* En-tête de la page */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Ma Collection de Mangas
        </h1>
        <p className="text-lg text-gray-600">
          Gérez votre collection et ajoutez de nouveaux mangas
        </p>
      </div>

      {/* Barre de recherche */}
      <div className="max-w-2xl mx-auto mb-12">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Rechercher un manga..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  searchMangas();
                }
              }}
            />
            <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
          </div>
          <button
            onClick={searchMangas}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Rechercher
          </button>
        </div>
      </div>

      {/* Résultats de recherche */}
      {isLoading ? (
        <div className="text-center">Chargement...</div>
      ) : searchResults.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Résultats de la recherche</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.map((manga) => (
              <div key={`search-${manga.mal_id}`} className="bg-white rounded-lg shadow-md overflow-hidden">
                <img
                  src={manga.images.jpg.image_url}
                  alt={manga.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{manga.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {manga.synopsis}
                  </p>
                  <button
                    onClick={() => addToCollection(manga)}
                    disabled={collection.some(m => m.mal_id === manga.mal_id)}
                    className={`flex items-center justify-center w-full px-4 py-2 rounded-lg transition-colors ${
                      collection.some(m => m.mal_id === manga.mal_id)
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-700'
                    } text-white`}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {collection.some(m => m.mal_id === manga.mal_id)
                      ? 'Déjà dans la collection'
                      : 'Ajouter à ma collection'
                    }
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Collection de l'utilisateur */}
      <div>
        <h2 className="text-2xl font-semibold mb-4 flex items-center">
          <BookOpen className="w-6 h-6 mr-2 text-indigo-600" />
          Ma Collection ({collection.length})
        </h2>
        {collection.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-600">
              Votre collection est vide. Recherchez des mangas pour les ajouter !
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collection.map((manga) => (
              <div key={`collection-${manga.mal_id}`} className="bg-white rounded-lg shadow-md overflow-hidden">
                <img
                  src={manga.images.jpg.image_url}
                  alt={manga.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{manga.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {manga.synopsis}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}