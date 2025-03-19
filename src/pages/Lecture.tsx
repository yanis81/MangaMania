import React, { useState, useEffect } from 'react';
import { BookOpen, CheckCircle2, Clock, AlertCircle, BookX, Eye, EyeOff } from 'lucide-react';
import { mangaService, type MangaCollection } from '../services/mangaService';
import { useAuth } from '../contexts/AuthContext';
import { SEO } from '../components/SEO';

// Configuration des statuts de lecture
const statusMap = {
  'reading': { icon: Eye, color: 'text-green-500', text: 'En lecture' },
  'completed': { icon: CheckCircle2, color: 'text-blue-500', text: 'Terminé' },
  'on-hold': { icon: Clock, color: 'text-yellow-500', text: 'En pause' },
  'dropped': { icon: BookX, color: 'text-red-500', text: 'Abandonné' },
  'plan-to-read': { icon: EyeOff, color: 'text-gray-500', text: 'À lire' }
};

export function Lecture() {
  const { user } = useAuth();
  const [mangas, setMangas] = useState<MangaCollection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Charger la liste des mangas
  useEffect(() => {
    loadMangaList();
  }, [user]);

  const loadMangaList = async () => {
    try {
      if (user) {
        const userCollection = await mangaService.getUserCollection();
        setMangas(userCollection);
      }
    } catch (error) {
      console.error('Error fetching reading list:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Mettre à jour le statut de lecture
  const updateMangaStatus = async (id: number, newStatus: MangaCollection['reading_status'], currentChapter: number, currentVolume: number) => {
    try {
      await mangaService.updateReadingStatus(id, newStatus, currentChapter, currentVolume);
      await loadMangaList();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
    }
  };

  // Mettre à jour le volume actuel
  const updateCurrentVolume = async (id: number, volume: number, currentChapter: number, status: MangaCollection['reading_status']) => {
    try {
      await mangaService.updateReadingStatus(
        id,
        status,
        currentChapter,
        Math.max(1, volume)
      );
      await loadMangaList();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du volume:', error);
    }
  };

  // Obtenir les informations de statut
  const getStatusInfo = (status: MangaCollection['reading_status']) => statusMap[status];

  if (!user) {
    return (
      <div key="not-authenticated" className="text-center py-12">
        <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Connectez-vous pour voir votre liste de lecture</h2>
        <p className="text-gray-600">Suivez votre progression de lecture et gérez vos mangas en cours.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div key="loading" className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-gray-600">Chargement de votre liste de lecture...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="Suivi de Lecture - MangaMania"
        description="Suivez votre progression de lecture manga par manga. Gérez vos séries en cours, terminées, en pause et à lire."
        type="website"
        url="/lecture"
        keywords="suivi lecture manga, progression lecture, statut lecture, bibliothèque manga"
      />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Suivi de Lecture
          </h1>
          <p className="text-lg text-gray-600">
            Gardez une trace de votre progression dans vos mangas préférés
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {['reading', 'completed', 'on-hold', 'dropped'].map(status => {
            const count = mangas.filter(m => m.reading_status === status).length;
            const { icon: StatusIcon, color, text } = getStatusInfo(status as MangaCollection['reading_status']);
            return (
              <div key={`status-${status}`} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-2">
                  <StatusIcon className={`w-6 h-6 ${color}`} />
                  <span className="text-2xl font-bold">{count}</span>
                </div>
                <p className="text-gray-600">{text}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-6">
          {mangas.map(manga => {
            const { icon: StatusIcon, color, text } = getStatusInfo(manga.reading_status);
            const progress = manga.volumes ? (manga.current_volume / manga.volumes) * 100 : 0;

            return (
              <div key={`manga-${manga.mal_id}`} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-48 h-48 md:h-auto">
                    <img
                      src={manga.image_url}
                      alt={manga.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-bold">{manga.title}</h2>
                      <div className="flex items-center">
                        <StatusIcon className={`w-5 h-5 ${color} mr-2`} />
                        <span className="text-sm text-gray-600">{text}</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">
                          Progression : Tome {manga.current_volume} / {manga.volumes || '?'}
                        </span>
                        <span className="text-sm font-medium text-indigo-600">
                          {progress.toFixed(1)}%
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full">
                        <div
                          className="h-2 bg-indigo-600 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center space-x-2">
                        <label htmlFor={`volume-${manga.mal_id}`} className="text-sm text-gray-600">
                          Tome actuel :
                        </label>
                        <input
                          type="number"
                          id={`volume-${manga.mal_id}`}
                          value={manga.current_volume}
                          onChange={(e) => updateCurrentVolume(
                            manga.mal_id,
                            parseInt(e.target.value),
                            manga.current_chapter,
                            manga.reading_status
                          )}
                          min="1"
                          max={manga.volumes || undefined}
                          className="w-20 px-2 py-1 border border-gray-300 rounded-md"
                        />
                      </div>

                      <select
                        value={manga.reading_status}
                        onChange={(e) => updateMangaStatus(
                          manga.mal_id,
                          e.target.value as MangaCollection['reading_status'],
                          manga.current_chapter,
                          manga.current_volume
                        )}
                        className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                      >
                        <option value="reading">En lecture</option>
                        <option value="completed">Terminé</option>
                        <option value="on-hold">En pause</option>
                        <option value="dropped">Abandonné</option>
                        <option value="plan-to-read">À lire</option>
                      </select>

                      <span className="text-sm text-gray-500">
                        Dernière lecture : {manga.last_read instanceof Date ? 
                          manga.last_read.toLocaleDateString() : 
                          new Date(manga.last_read.seconds * 1000).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}