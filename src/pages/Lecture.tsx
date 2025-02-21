import React, { useState } from 'react';
import { BookOpen, CheckCircle2, Clock, AlertCircle, BookX, Eye, EyeOff } from 'lucide-react';

// Interface pour les données de manga en lecture
interface MangaLecture {
  id: number;
  title: string;
  coverUrl: string;
  totalChapters: number;
  currentChapter: number;
  status: 'reading' | 'completed' | 'on-hold' | 'dropped' | 'plan-to-read';
  lastRead: string;
}

/**
 * Composant Lecture
 * Page permettant de suivre sa progression de lecture des mangas
 */
export function Lecture() {
  // Données de test pour la démonstration
  const [mangas, setMangas] = useState<MangaLecture[]>([
    {
      id: 1,
      title: "One Piece",
      coverUrl: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?auto=format&fit=crop&q=80&w=400",
      totalChapters: 1100,
      currentChapter: 1087,
      status: 'reading',
      lastRead: '2024-03-15'
    },
    {
      id: 2,
      title: "Naruto",
      coverUrl: "https://images.unsplash.com/photo-1613376023733-0a73315d9b06?auto=format&fit=crop&q=80&w=400",
      totalChapters: 700,
      currentChapter: 700,
      status: 'completed',
      lastRead: '2024-02-28'
    },
    {
      id: 3,
      title: "Death Note",
      coverUrl: "https://images.unsplash.com/photo-1614583225154-5fcdda07019e?auto=format&fit=crop&q=80&w=400",
      totalChapters: 108,
      currentChapter: 45,
      status: 'on-hold',
      lastRead: '2024-01-15'
    }
  ]);

  // Fonction pour mettre à jour le statut d'un manga
  const updateMangaStatus = (id: number, newStatus: MangaLecture['status']) => {
    setMangas(mangas.map(manga => 
      manga.id === id ? { ...manga, status: newStatus } : manga
    ));
  };

  // Fonction pour mettre à jour le chapitre actuel
  const updateCurrentChapter = (id: number, chapter: number) => {
    setMangas(mangas.map(manga => 
      manga.id === id ? { 
        ...manga, 
        currentChapter: Math.min(Math.max(1, chapter), manga.totalChapters),
        lastRead: new Date().toISOString().split('T')[0]
      } : manga
    ));
  };

  // Fonction pour obtenir l'icône et la couleur en fonction du statut
  const getStatusInfo = (status: MangaLecture['status']) => {
    const statusMap = {
      'reading': { icon: Eye, color: 'text-green-500', text: 'En lecture' },
      'completed': { icon: CheckCircle2, color: 'text-blue-500', text: 'Terminé' },
      'on-hold': { icon: Clock, color: 'text-yellow-500', text: 'En pause' },
      'dropped': { icon: BookX, color: 'text-red-500', text: 'Abandonné' },
      'plan-to-read': { icon: EyeOff, color: 'text-gray-500', text: 'À lire' }
    };
    return statusMap[status];
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* En-tête de la page */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Suivi de Lecture
        </h1>
        <p className="text-lg text-gray-600">
          Gardez une trace de votre progression dans vos mangas préférés
        </p>
      </div>

      {/* Statistiques de lecture */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {['reading', 'completed', 'on-hold', 'dropped'].map(status => {
          const count = mangas.filter(m => m.status === status).length;
          const { icon: StatusIcon, color, text } = getStatusInfo(status as MangaLecture['status']);
          return (
            <div key={status} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-2">
                <StatusIcon className={`w-6 h-6 ${color}`} />
                <span className="text-2xl font-bold">{count}</span>
              </div>
              <p className="text-gray-600">{text}</p>
            </div>
          );
        })}
      </div>

      {/* Liste des mangas */}
      <div className="grid grid-cols-1 gap-6">
        {mangas.map(manga => {
          const { icon: StatusIcon, color, text } = getStatusInfo(manga.status);
          const progress = (manga.currentChapter / manga.totalChapters) * 100;

          return (
            <div key={manga.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="flex flex-col md:flex-row">
                {/* Image de couverture */}
                <div className="w-full md:w-48 h-48 md:h-auto">
                  <img
                    src={manga.coverUrl}
                    alt={manga.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Informations du manga */}
                <div className="flex-1 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">{manga.title}</h2>
                    <div className="flex items-center">
                      <StatusIcon className={`w-5 h-5 ${color} mr-2`} />
                      <span className="text-sm text-gray-600">{text}</span>
                    </div>
                  </div>

                  {/* Barre de progression */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">
                        Progression : {manga.currentChapter} / {manga.totalChapters} chapitres
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

                  {/* Contrôles */}
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center space-x-2">
                      <label htmlFor={`chapter-${manga.id}`} className="text-sm text-gray-600">
                        Chapitre actuel :
                      </label>
                      <input
                        type="number"
                        id={`chapter-${manga.id}`}
                        value={manga.currentChapter}
                        onChange={(e) => updateCurrentChapter(manga.id, parseInt(e.target.value))}
                        min="1"
                        max={manga.totalChapters}
                        className="w-20 px-2 py-1 border border-gray-300 rounded-md"
                      />
                    </div>

                    <select
                      value={manga.status}
                      onChange={(e) => updateMangaStatus(manga.id, e.target.value as MangaLecture['status'])}
                      className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="reading">En lecture</option>
                      <option value="completed">Terminé</option>
                      <option value="on-hold">En pause</option>
                      <option value="dropped">Abandonné</option>
                      <option value="plan-to-read">À lire</option>
                    </select>

                    <span className="text-sm text-gray-500">
                      Dernière lecture : {manga.lastRead}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}