import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, BookOpen, ArrowRight, Clock } from 'lucide-react';
import { releasesService, type MangaRelease } from '../services/releasesService';

export function Home() {
  const [todayReleases, setTodayReleases] = useState<MangaRelease[]>([]);
  const [upcomingReleases, setUpcomingReleases] = useState<MangaRelease[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReleases = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const today = await releasesService.getTodayReleases();
        setTodayReleases(today);
        
        const upcoming = await releasesService.getUpcomingReleases(5);
        setUpcomingReleases(upcoming);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
        console.error('Erreur lors de la récupération des sorties:', errorMessage);
        setError('Impossible de charger les sorties. Veuillez réessayer plus tard.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReleases();
  }, []);

  // Formater la date en français
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'long'
    });
  };

  const featuredManga = [
    {
      id: 1,
      title: "One Piece",
      cover: "https://images.unsplash.com/photo-1600189261867-30e5ffe7b8da?w=800&auto=format&fit=crop&q=80",
      description: "Follow Monkey D. Luffy and his pirate crew in their search for the ultimate treasure, the One Piece."
    },
    {
      id: 2,
      title: "Naruto",
      cover: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80",
      description: "The story of Naruto Uzumaki, a young ninja who seeks recognition and dreams of becoming the Hokage."
    },
    {
      id: 3,
      title: "Attack on Titan",
      cover: "https://images.unsplash.com/photo-1612178537253-bccd437b730e?w=800&auto=format&fit=crop&q=80",
      description: "In a world where humanity lives inside cities surrounded by enormous walls, a young boy vows to retake the world from the Titans."
    }
  ];

  return (
    <div className="space-y-12">
      <section className="relative h-96 rounded-xl overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1560942485-b2a11cc13456?w=1600&auto=format&fit=crop&q=80"
          alt="Hero"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 flex items-center">
          <div className="container mx-auto px-6">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Bienvenue sur MangaMania
            </h1>
            <p className="text-xl text-gray-200 mb-8 max-w-2xl">
              Découvrez des milliers de mangas, suivez votre progression de lecture
              et rejoignez une communauté de passionnés.
            </p>
            <Link to="/decouvrir" className="bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition inline-flex items-center">
              Découvrir des mangas
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Sorties du jour */}
      <section className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Calendar className="w-6 h-6 text-indigo-600 mr-2" />
            Sorties du jour
          </h2>
          <Link to="/calendrier" className="text-indigo-600 hover:text-indigo-800 flex items-center">
            Voir le calendrier
            <ArrowRight className="ml-1 w-4 h-4" />
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : todayReleases.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {todayReleases.map((release) => (
              <div key={release.id} className="bg-gray-50 rounded-lg p-3 hover:shadow-md transition-shadow">
                <div className="aspect-w-2 aspect-h-3 mb-2">
                  <img
                    src={release.coverImage}
                    alt={`${release.title} Tome ${release.volume}`}
                    className="w-full h-48 object-cover rounded-md shadow-sm"
                  />
                </div>
                <h3 className="font-medium text-gray-900 line-clamp-1">{release.title}</h3>
                <p className="text-sm text-gray-600">Tome {release.volume}</p>
                <p className="text-sm text-gray-600">{release.publisher}</p>
                {release.price && (
                  <p className="text-sm font-medium text-indigo-600 mt-1">{release.price}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-48 text-center">
            <BookOpen className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-gray-600">
              Aucune sortie prévue aujourd'hui
            </p>
            <Link to="/calendrier" className="mt-4 text-indigo-600 hover:text-indigo-800">
              Consulter le calendrier des prochaines sorties
            </Link>
          </div>
        )}
      </section>

      {/* Prochaines sorties */}
      {upcomingReleases.length > 0 && (
        <section className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Clock className="w-6 h-6 text-indigo-600 mr-2" />
              Prochaines sorties
            </h2>
            <Link to="/calendrier" className="text-indigo-600 hover:text-indigo-800 flex items-center">
              Voir toutes les sorties
              <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-4">
            {upcomingReleases.map((release) => (
              <div 
                key={release.id} 
                className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <img
                  src={release.coverImage}
                  alt={`${release.title} Tome ${release.volume}`}
                  className="w-12 h-16 object-cover rounded-md shadow-sm"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 line-clamp-1">{release.title}</h3>
                  <p className="text-sm text-gray-600">Tome {release.volume} • {release.publisher}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-indigo-600">{formatDate(release.releaseDate)}</p>
                  {release.price && (
                    <p className="text-sm text-gray-600">{release.price}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Mangas à la une</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredManga.map((manga) => (
            <div key={manga.id} className="bg-white rounded-xl shadow-md overflow-hidden">
              <img
                src={manga.cover}
                alt={manga.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {manga.title}
                </h3>
                <p className="text-gray-600">
                  {manga.description}
                </p>
                <button className="mt-4 text-indigo-600 font-semibold hover:text-indigo-700">
                  Lire maintenant →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}