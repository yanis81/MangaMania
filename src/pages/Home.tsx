import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, BookOpen, ArrowRight, Clock, Star, BookMarked, Library } from 'lucide-react';
import { releasesService, type MangaRelease } from '../services/releasesService';
import { SEO } from '../components/SEO';

// Fonctionnalités disponibles sur la plateforme
const features = [
  {
    icon: BookMarked,
    title: "Suivi de Lecture",
    description: "Gardez une trace de tous vos mangas en cours de lecture"
  },
  {
    icon: Calendar,
    title: "Calendrier des Sorties",
    description: "Ne manquez plus aucune sortie de vos séries préférées"
  },
  {
    icon: Library,
    title: "Collection Personnelle",
    description: "Gérez votre collection de mangas en toute simplicité"
  },
  {
    icon: Star,
    title: "Recommandations",
    description: "Découvrez de nouveaux mangas selon vos goûts"
  }
];

export function Home() {
  const [todayReleases, setTodayReleases] = useState<MangaRelease[]>([]);
  const [upcomingReleases, setUpcomingReleases] = useState<MangaRelease[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Formater la date en français
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'long'
    });
  };

  // Charger les sorties du jour et à venir
  useEffect(() => {
    const fetchReleases = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [today, upcoming] = await Promise.all([
          releasesService.getTodayReleases(),
          releasesService.getUpcomingReleases(5)
        ]);
        setTodayReleases(today);
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

  return (
    <>
      <SEO 
        title="MangaMania - Votre Gestionnaire de Collection de Mangas"
        description="Découvrez, collectionnez et suivez vos mangas préférés. Rejoignez une communauté passionnée et ne manquez plus aucune sortie."
        type="website"
        url="/"
        keywords="manga, collection, lecture, suivi, bibliothèque, japon, anime"
      />
      
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative min-h-screen md:h-[80vh] flex items-center">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1560942485-b2a11cc13456?w=1600&auto=format&fit=crop&q=80"
              alt="Hero Background"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40" />
          </div>
          <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-0">
            <div className="max-w-2xl">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Explorez l'Univers des 
                <span className="text-indigo-400"> Mangas</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-200 mb-8 leading-relaxed">
                Découvrez, collectionnez et suivez vos mangas préférés. 
                Rejoignez une communauté passionnée et ne manquez plus aucune sortie.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/decouvrir"
                  className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 inline-flex items-center justify-center"
                >
                  Explorer les Mangas
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link
                  to="/collection"
                  className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-lg text-lg font-semibold backdrop-blur-sm transition-all text-center"
                >
                  Gérer ma Collection
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Tout ce dont vous avez besoin
              </h2>
              <p className="text-lg sm:text-xl text-gray-600">
                Des outils puissants pour gérer votre passion des mangas
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-all hover:transform hover:-translate-y-1"
                >
                  <feature.icon className="w-12 h-12 text-indigo-600 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Today's Releases */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-12">
              <div className="mb-6 sm:mb-0">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                  Sorties du Jour
                </h2>
                <p className="text-lg sm:text-xl text-gray-600">
                  Les dernières nouveautés à ne pas manquer
                </p>
              </div>
              <Link
                to="/calendrier"
                className="inline-flex items-center text-indigo-600 hover:text-indigo-700 text-lg font-semibold"
              >
                Voir le calendrier
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-8">
                {error}
              </div>
            )}

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent" />
              </div>
            ) : todayReleases.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {todayReleases.map((release) => (
                  <div
                    key={release.id}
                    className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow"
                  >
                    <div className="aspect-w-2 aspect-h-3 relative">
                      <img
                        src={release.coverImage}
                        alt={`${release.title} Tome ${release.volume}`}
                        className="w-full h-64 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-lg font-semibold text-white line-clamp-1">
                          {release.title}
                        </h3>
                        <p className="text-gray-200">Tome {release.volume}</p>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-gray-600">{release.publisher}</p>
                      {release.price && (
                        <p className="text-lg font-semibold text-indigo-600 mt-1">
                          {release.price}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-xl shadow-sm">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Aucune sortie aujourd'hui
                </h3>
                <p className="text-gray-600 mb-6">
                  Consultez le calendrier pour voir les prochaines sorties
                </p>
                <Link
                  to="/calendrier"
                  className="text-indigo-600 hover:text-indigo-700 font-semibold"
                >
                  Voir le calendrier →
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Upcoming Releases */}
        {upcomingReleases.length > 0 && (
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center mb-12">
                <Clock className="w-8 h-8 text-indigo-600 mr-4" />
                <div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                    À Venir
                  </h2>
                  <p className="text-lg sm:text-xl text-gray-600">
                    Préparez-vous pour les prochaines sorties
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {upcomingReleases.map((release) => (
                  <div
                    key={release.id}
                    className="bg-gray-50 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 hover:shadow-lg transition-all"
                  >
                    <img
                      src={release.coverImage}
                      alt={`${release.title} Tome ${release.volume}`}
                      className="w-full sm:w-20 h-40 sm:h-28 object-cover rounded-lg shadow-sm"
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">
                        {release.title}
                      </h3>
                      <p className="text-gray-600">
                        Tome {release.volume} • {release.publisher}
                      </p>
                    </div>
                    <div className="w-full sm:w-auto text-left sm:text-right">
                      <p className="text-lg font-semibold text-indigo-600 mb-1">
                        {formatDate(release.releaseDate)}
                      </p>
                      {release.price && (
                        <p className="text-gray-600">{release.price}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center mt-12">
                <Link
                  to="/calendrier"
                  className="inline-flex items-center bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Voir toutes les sorties
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
}