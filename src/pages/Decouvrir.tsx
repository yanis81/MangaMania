import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Search,
  Plus,
  BookOpen,
  Trophy,
  Star,
  BookMarked,
  Calendar,
  Building2,
  BookCopy,
  Activity,
} from "lucide-react";
import { Link } from "react-router-dom";

// Interface pour les données de manga
interface Manga {
  mal_id: number;
  title: string;
  images: {
    webp: {
      image_url: string;
      large_image_url: string;
    };
  };
  synopsis: string;
  chapters: number;
  volumes: number;
  rank?: number;
  score?: number;
  authors?: Array<{ name: string }>;
  published?: {
    prop: {
      from: {
        year: number;
      };
    };
    string?: string;
  };
  genres?: Array<{ name: string }>;
  serializations?: Array<{ name: string }>;
  status?: string;
}

/**
 * Composant Decouvrir
 * Page permettant d'afficher les top manga et de chercher de nouveaux manga
 */
export function Decouvrir() {
  // États existants
  const [searchResults, setSearchResults] = useState<Manga[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [collection, setCollection] = useState<Manga[]>([]);
  const [topMangas, setTopMangas] = useState<Manga[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTop, setIsLoadingTop] = useState(false);

  useEffect(() => {
    fetchTopMangas();
  }, []);

  const searchMangas = async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    try {
      const response = await axios.get(
        `https://api.jikan.moe/v4/manga?q=${searchQuery}`
      );
      setSearchResults(response.data.data);
    } catch (error) {
      console.error("Erreur lors de la recherche:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addToCollection = (manga: Manga) => {
    if (!collection.find((m) => m.mal_id === manga.mal_id)) {
      setCollection([...collection, manga]);
    }
  };

  const fetchTopMangas = async () => {
    setIsLoadingTop(true);
    try {
      const response = await axios.get("https://api.jikan.moe/v4/top/manga");
      setTopMangas(response.data.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des tops mangas :", error);
    } finally {
      setIsLoadingTop(false);
    }
  };

  // Fonction pour traduire le statut en français
  const translateStatus = (status: string) => {
    const statusMap: { [key: string]: string } = {
      Finished: "Terminé",
      Publishing: "En cours",
      "On Hiatus": "En pause",
      Discontinued: "Abandonné",
      "Not yet published": "À paraître",
    };
    return statusMap[status] || status;
  };

  const MangaCard = ({
    manga,
    isTopManga = false,
  }: {
    manga: Manga;
    isTopManga?: boolean;
  }) => (
    <div
      className={`bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-[1.02] transition-transform ${
        isTopManga ? "h-full" : ""
      }`}
    >
      <Link to={`/manga/${manga.mal_id}`} className="block">
        <div className="relative">
          <img
            src={
              manga.images.webp.large_image_url || manga.images.webp.image_url
            }
            alt={manga.title}
            className="w-full h-64 object-cover"
          />
          {manga.rank && isTopManga && (
            <div className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-full flex items-center">
              <Trophy className="w-4 h-4 mr-1" />#{manga.rank}
            </div>
          )}
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold mb-2 line-clamp-1">{manga.title}</h3>

          {/* Informations principales */}
          <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
            {manga.score && (
              <span className="flex items-center text-gray-600">
                <Star className="w-4 h-4 mr-1 text-yellow-500" />
                {manga.score}/10
              </span>
            )}
            {manga.status && (
              <span className="flex items-center text-gray-600">
                <Activity className="w-4 h-4 mr-1" />
                {translateStatus(manga.status)}
              </span>
            )}
            {manga.volumes && (
              <span className="flex items-center text-gray-600">
                <BookCopy className="w-4 h-4 mr-1" />
                {manga.volumes} tomes
              </span>
            )}
            {manga.chapters && (
              <span className="flex items-center text-gray-600">
                <BookMarked className="w-4 h-4 mr-1" />
                {manga.chapters} chapitres
              </span>
            )}
          </div>

          {/* Maison d'édition et année */}
          <div className="mb-3 text-sm">
            {manga.serializations && manga.serializations.length > 0 && (
              <div className="flex items-center text-gray-600 mb-1">
                <Building2 className="w-4 h-4 mr-1" />
                {manga.serializations.map((s) => s.name).join(", ")}
              </div>
            )}
            {manga.published?.prop?.from?.year && (
              <div className="flex items-center text-gray-600">
                <Calendar className="w-4 h-4 mr-1" />
                {manga.published.string || manga.published.prop.from.year}
              </div>
            )}
          </div>

          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {manga.synopsis}
          </p>

          {manga.genres && (
            <div className="flex flex-wrap gap-2 mb-4">
              {manga.genres.slice(0, 3).map((genre) => (
                <span
                  key={genre.name}
                  className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>

      <div className="px-6 pb-6">
        <button
          onClick={() => addToCollection(manga)}
          disabled={collection.some((m) => m.mal_id === manga.mal_id)}
          className={`flex items-center justify-center w-full px-4 py-2 rounded-lg transition-colors ${
            collection.some((m) => m.mal_id === manga.mal_id)
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          } text-white`}
        >
          <Plus className="w-4 h-4 mr-2" />
          {collection.some((m) => m.mal_id === manga.mal_id)
            ? "Déjà dans la collection"
            : "Ajouter à ma collection"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* En-tête de la page */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Partez à l'exploration de nouveaux mangas
        </h1>
        <p className="text-lg text-gray-600">
          Découvrez les tops mangas et plein d'autres !
        </p>
      </div>

      {/* Barre de recherche */}
      <div className="max-w-2xl mx-auto mb-12">
        <h2 className="text-2xl font-semibold mb-6 flex items-center justify-center">
          <Search className="w-6 h-6 mr-2 text-indigo-600" />
          Rechercher un Manga
        </h2>
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Rechercher un manga..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  searchMangas();
                }
              }}
            />
            <Search
              className="absolute right-3 top-2.5 text-gray-400"
              size={20}
            />
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
      ) : (
        searchResults.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 flex items-center">
              <BookOpen className="w-6 h-6 mr-2 text-indigo-600" />
              Résultats de la recherche
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map((manga) => (
                <MangaCard key={`search-${manga.mal_id}`} manga={manga} />
              ))}
            </div>
          </div>
        )
      )}

      {/* Section Top Mangas */}
      <div className="mb-16">
        <h2 className="text-2xl font-semibold mb-6 flex items-center">
          <Trophy className="w-6 h-6 mr-2 text-yellow-500" />
          Top Mangas du Moment
        </h2>
        {isLoadingTop ? (
          <div className="text-center py-12">Chargement des tops mangas...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {topMangas.map((manga) => (
              <MangaCard
                key={`top-${manga.mal_id}`}
                manga={manga}
                isTopManga={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
