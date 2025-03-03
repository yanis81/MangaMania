import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { mangaService } from '../services/mangaService';
import { coverImageAdapter } from '../services/coverImageAdapter';
import { Library, BookOpen, BookCopy, Book as Books, Eye, CheckCircle2, Clock, BookX, EyeOff, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { MangaCollection } from '../services/mangaService';

export function Collection() {
  const { user } = useAuth();
  const [mangas, setMangas] = React.useState<MangaCollection[]>([]);
  const [filteredMangas, setFilteredMangas] = React.useState<MangaCollection[]>([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [selectedManga, setSelectedManga] = React.useState<MangaCollection | null>(null);
  const [volumeCovers, setVolumeCovers] = React.useState<string[]>([]);
  const [loadingCovers, setLoadingCovers] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchCollection = async () => {
      if (user) {
        try {
          const collection = await mangaService.getUserCollection();
          setMangas(collection);
          setFilteredMangas(collection);
          setError(null);
        } catch (error) {
          console.error('Error fetching collection:', error);
          setError('Erreur lors du chargement de la collection');
        }
      }
      setLoading(false);
    };

    fetchCollection();
  }, [user]);

  React.useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredMangas(mangas);
    } else {
      const query = searchQuery.toLowerCase().trim();
      const filtered = mangas.filter(manga => 
        manga.title.toLowerCase().includes(query)
      );
      setFilteredMangas(filtered);
    }
  }, [searchQuery, mangas]);

  const fetchMangaCovers = async (manga: MangaCollection) => {
    setLoadingCovers(true);
    setError(null);
    try {
      const mangaInfo = await coverImageAdapter.searchMangaByTitle(manga.title);
      if (mangaInfo) {
        console.log(`Found manga info for ${manga.title}:`, mangaInfo);
        const covers = await coverImageAdapter.getMangaCovers(mangaInfo.id, manga.volumes);
        console.log(`Retrieved ${covers.length} covers for ${manga.title}`);
        setVolumeCovers(covers);
      } else {
        setError(`Aucune information trouvée pour ${manga.title}`);
      }
    } catch (error) {
      console.error('Error fetching manga covers:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Erreur lors du chargement des couvertures');
      }
    }
    setLoadingCovers(false);
  };

  React.useEffect(() => {
    if (selectedManga) {
      fetchMangaCovers(selectedManga);
    }
  }, [selectedManga]);

  const totalMangas = mangas.length;
  const totalVolumes = mangas.reduce((acc, manga) => acc + manga.current_volume, 0);

  const getStatusInfo = (status: MangaCollection['reading_status']) => {
    const statusMap = {
      'reading': { icon: Eye, color: 'text-green-500 bg-green-50', text: 'En lecture' },
      'completed': { icon: CheckCircle2, color: 'text-blue-500 bg-blue-50', text: 'Terminé' },
      'on-hold': { icon: Clock, color: 'text-yellow-500 bg-yellow-50', text: 'En pause' },
      'dropped': { icon: BookX, color: 'text-red-500 bg-red-50', text: 'Abandonné' },
      'plan-to-read': { icon: EyeOff, color: 'text-gray-500 bg-gray-50', text: 'À lire' }
    };
    return statusMap[status];
  };

  if (!user) {
    return (
      <div key="not-authenticated" className="text-center py-12">
        <Library className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Connectez-vous pour voir votre collection</h2>
        <p className="text-gray-600">Vous pourrez gérer vos mangas et suivre votre progression de lecture.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div key="loading" className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (mangas.length === 0) {
    return (
      <div key="empty-collection" className="text-center py-12">
        <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Votre collection est vide</h2>
        <p className="text-gray-600">Commencez à ajouter des mangas à votre collection !</p>
      </div>
    );
  }

  if (selectedManga) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              setSelectedManga(null);
              setVolumeCovers([]);
              setError(null);
            }}
            className="text-indigo-600 hover:text-indigo-800 flex items-center"
          >
            ← Retour à la collection
          </button>
          <h1 className="text-3xl font-bold text-gray-900">{selectedManga.title}</h1>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8">
            <img
              src={selectedManga.image_url}
              alt={selectedManga.title}
              className="w-48 h-auto rounded-lg shadow-md mx-auto md:mx-0"
            />
            <div>
              <h2 className="text-2xl font-bold mb-2 text-center md:text-left">{selectedManga.title}</h2>
              <p className="text-gray-600 mb-4 text-center md:text-left">
                {selectedManga.volumes} tomes au total
              </p>
              <p className="text-gray-600 text-center md:text-left">
                Vous possédez {selectedManga.current_volume} tomes
              </p>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {loadingCovers ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : volumeCovers.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {volumeCovers.map((coverUrl, index) => {
                const volume = index + 1;
                return (
                  <div
                    key={`volume-${volume}`}
                    className={`relative group ${
                      volume <= selectedManga.current_volume
                        ? 'opacity-100'
                        : 'opacity-50'
                    }`}
                  >
                    <div className="aspect-w-2 aspect-h-3 bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={coverUrl}
                        alt={`Tome ${volume}`}
                        className="object-cover w-full h-full"
                        onError={(e) => {
                          e.currentTarget.src = selectedManga.image_url;
                        }}
                      />
                      {volume <= selectedManga.current_volume && (
                        <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
                          <BookCopy className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                    <p className="text-center mt-2 font-medium">
                      Tome {volume}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : !error && (
            <div className="text-center text-gray-600 py-12">
              Aucune couverture disponible
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Ma Collection</h1>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="bg-white rounded-lg shadow-sm p-4 flex items-center gap-3 flex-1">
            <Books className="w-6 h-6 text-indigo-600" />
            <div>
              <p className="text-sm text-gray-600">Total Mangas</p>
              <p className="text-xl font-bold text-gray-900">{totalMangas}</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 flex items-center gap-3 flex-1">
            <BookCopy className="w-6 h-6 text-indigo-600" />
            <div>
              <p className="text-sm text-gray-600">Total Tomes</p>
              <p className="text-xl font-bold text-gray-900">{totalVolumes}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="relative w-full max-w-md mx-auto">
        <input
          type="text"
          placeholder="Rechercher dans ma collection..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
      </div>

      {filteredMangas.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-lg shadow-md">
          <Search className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600">Aucun manga ne correspond à votre recherche</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMangas.map((manga) => {
            const { icon: StatusIcon, color, text } = getStatusInfo(manga.reading_status);
            
            return (
              <div
                key={`manga-${manga.mal_id}`}
                className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform hover:scale-[1.02] transition-transform"
                onClick={() => setSelectedManga(manga)}
              >
                <div className="relative">
                  <img
                    src={manga.image_url}
                    alt={manga.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className={`absolute top-2 right-2 rounded-full px-3 py-1 flex items-center gap-1 ${color}`}>
                    <StatusIcon className="w-4 h-4" />
                    <span className="text-sm font-medium">{text}</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-1">{manga.title}</h3>
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span className="flex items-center">
                      <BookCopy className="w-4 h-4 mr-1 text-indigo-600" />
                      {manga.current_volume} / {manga.volumes || '?'} tomes
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}