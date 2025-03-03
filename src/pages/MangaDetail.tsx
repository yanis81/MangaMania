import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  BookOpen, 
  Star, 
  Calendar, 
  Building2, 
  BookCopy, 
  Activity,
  ArrowLeft,
  Plus,
  Users,
  Globe,
  Tag,
  Trophy,
  Heart,
  Check,
  BookOpenCheck
} from 'lucide-react';
import { mangaService } from '../services/mangaService';
import { useAuth } from '../contexts/AuthContext';

interface MangaDetail {
  mal_id: number;
  title: string;
  title_japanese: string;
  images: {
    webp: {
      large_image_url: string;
      image_url: string;
    };
  };
  synopsis: string;
  background: string;
  chapters: number;
  volumes: number;
  status: string;
  publishing: boolean;
  published: {
    from: string;
    to: string;
    prop: {
      from: { year: number };
      to: { year: number | null };
    };
    string: string;
  };
  rank: number;
  score: number;
  scored_by: number;
  popularity: number;
  members: number;
  favorites: number;
  authors: Array<{ name: string; url: string }>;
  serializations: Array<{ name: string; url: string }>;
  genres: Array<{ name: string; url: string }>;
  themes: Array<{ name: string; url: string }>;
  demographics: Array<{ name: string }>;
}

export function MangaDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [manga, setManga] = useState<MangaDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInCollection, setIsInCollection] = useState(false);
  const [isAddingToCollection, setIsAddingToCollection] = useState(false);

  useEffect(() => {
    const fetchMangaDetails = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`https://api.jikan.moe/v4/manga/${id}/full`);
        setManga(response.data.data);
        if (user) {
          const inCollection = await mangaService.isInCollection(Number(id));
          setIsInCollection(inCollection);
        }
        setError(null);
      } catch (err) {
        setError('Une erreur est survenue lors du chargement des données du manga');
        console.error('Erreur lors de la récupération des détails du manga:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchMangaDetails();
    }
  }, [id, user]);

  const handleCollectionToggle = async () => {
    if (!user || !manga) return;

    try {
      setIsAddingToCollection(true);
      if (isInCollection) {
        await mangaService.removeFromCollection(manga.mal_id);
        setIsInCollection(false);
      } else {
        await mangaService.addToCollection({
          mal_id: manga.mal_id,
          title: manga.title,
          images: {
            webp: {
              image_url: manga.images.webp.image_url,
              large_image_url: manga.images.webp.large_image_url
            }
          },
          volumes: manga.volumes,
          chapters: manga.chapters,
          status: manga.status,
          score: manga.score,
          synopsis: manga.synopsis
        });
        setIsInCollection(true);
      }
    } catch (error) {
      console.error('Erreur lors de la modification de la collection:', error);
    } finally {
      setIsAddingToCollection(false);
    }
  };

  const translateStatus = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'Finished': 'Terminé',
      'Publishing': 'En cours',
      'On Hiatus': 'En pause',
      'Discontinued': 'Abandonné',
      'Not yet published': 'À paraître'
    };
    return statusMap[status] || status;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Chargement...</div>
      </div>
    );
  }

  if (error || !manga) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-lg text-red-600 mb-4">{error}</div>
        <Link to="/decouvrir" className="text-indigo-600 hover:text-indigo-800">
          Retourner à la page de découverte
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Bouton retour */}
        <Link
          to="/decouvrir"
          className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Retour à la découverte
        </Link>

        {/* En-tête du manga */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="md:flex">
            {/* Image du manga */}
            <div className="md:w-1/3">
              <img
                src={manga.images.webp.large_image_url}
                alt={manga.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Informations principales */}
            <div className="p-8 md:w-2/3">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {manga.title}
                  </h1>
                  {manga.title_japanese && (
                    <p className="text-gray-600 mb-2">{manga.title_japanese}</p>
                  )}
                </div>
                {user && (
                  <div className="flex gap-2">
                    <button
                      onClick={handleCollectionToggle}
                      disabled={isAddingToCollection}
                      className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                        isInCollection
                          ? 'bg-green-500 text-white'
                          : isAddingToCollection
                          ? 'bg-gray-300 cursor-wait'
                          : 'bg-indigo-600 text-white hover:bg-indigo-700'
                      }`}
                    >
                      {isInCollection ? (
                        <>
                          <Check className="w-5 h-5 mr-2" />
                          Dans la collection
                        </>
                      ) : isAddingToCollection ? (
                        <>
                          <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Ajout en cours...
                        </>
                      ) : (
                        <>
                          <Plus className="w-5 h-5 mr-2" />
                          Ajouter à ma collection
                        </>
                      )}
                    </button>
                    {isInCollection && (
                      <Link
                        to="/lecture"
                        className="flex items-center px-4 py-2 rounded-lg bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition-colors"
                      >
                        <BookOpenCheck className="w-5 h-5 mr-2" />
                        Voir dans ma lecture
                      </Link>
                    )}
                  </div>
                )}
              </div>

              {/* Statistiques */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-500 mr-2" />
                  <span className="text-gray-900">{manga.score}/10</span>
                </div>
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-blue-500 mr-2" />
                  <span className="text-gray-900">{manga.scored_by.toLocaleString()} votes</span>
                </div>
                <div className="flex items-center">
                  <Trophy className="w-5 h-5 text-purple-500 mr-2" />
                  <span className="text-gray-900">#{manga.rank}</span>
                </div>
                <div className="flex items-center">
                  <Heart className="w-5 h-5 text-red-500 mr-2" />
                  <span className="text-gray-900">{manga.favorites.toLocaleString()}</span>
                </div>
              </div>

              {/* Informations détaillées */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Activity className="w-5 h-5 text-gray-500 mr-2" />
                  <span className="text-gray-700">
                    Statut: {translateStatus(manga.status)}
                  </span>
                </div>
                {manga.volumes && (
                  <div className="flex items-center">
                    <BookCopy className="w-5 h-5 text-gray-500 mr-2" />
                    <span className="text-gray-700">{manga.volumes} tomes</span>
                  </div>
                )}
                {manga.chapters && (
                  <div className="flex items-center">
                    <BookOpen className="w-5 h-5 text-gray-500 mr-2" />
                    <span className="text-gray-700">{manga.chapters} chapitres</span>
                  </div>
                )}
                {manga.published && (
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-gray-500 mr-2" />
                    <span className="text-gray-700">{manga.published.string}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Contenu détaillé */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Synopsis et background */}
          <div className="md:col-span-2 space-y-8">
            {/* Synopsis */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">Synopsis</h2>
              <p className="text-gray-700 whitespace-pre-line">{manga.synopsis}</p>
            </div>

            {/* Background */}
            {manga.background && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-semibold mb-4">Contexte</h2>
                <p className="text-gray-700 whitespace-pre-line">{manga.background}</p>
              </div>
            )}
          </div>

          {/* Informations complémentaires */}
          <div className="space-y-8">
            {/* Auteurs et Magazines */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Informations</h2>
              
              {/* Auteurs */}
              {manga.authors.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-medium text-gray-900 mb-2 flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    Auteurs
                  </h3>
                  <ul className="list-disc list-inside text-gray-700">
                    {manga.authors.map(author => (
                      <li key={author.name}>{author.name}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Magazines */}
              {manga.serializations.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-medium text-gray-900 mb-2 flex items-center">
                    <Building2 className="w-4 h-4 mr-2" />
                    Magazines
                  </h3>
                  <ul className="list-disc list-inside text-gray-700">
                    {manga.serializations.map(serial => (
                      <li key={serial.name}>{serial.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Genres et Thèmes */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Genres et Thèmes</h2>
              
              {/* Genres */}
              {manga.genres.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-medium text-gray-900 mb-2 flex items-center">
                    <Tag className="w-4 h-4 mr-2" />
                    Genres
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {manga.genres.map(genre => (
                      <span
                        key={genre.name}
                        className="bg-indigo-100 text-indigo-800 text-sm px-3 py-1 rounded-full"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Thèmes */}
              {manga.themes.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-2 flex items-center">
                    <Globe className="w-4 h-4 mr-2" />
                    Thèmes
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {manga.themes.map(theme => (
                      <span
                        key={theme.name}
                        className="bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded-full"
                      >
                        {theme.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}