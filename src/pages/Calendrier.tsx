import React, { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, BookOpen, Calendar as CalendarIcon, Filter, AlertCircle } from 'lucide-react';
import { releasesService, type MangaRelease } from '../services/releasesService';
import { SEO } from '../components/SEO';

// Constantes
const MONTH_NAMES = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

const WEEK_DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

export function Calendrier() {
  // États
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [releases, setReleases] = useState<MangaRelease[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedDateReleases, setSelectedDateReleases] = useState<MangaRelease[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [publishers, setPublishers] = useState<string[]>([]);
  const [selectedPublisher, setSelectedPublisher] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Effets
  useEffect(() => {
    fetchReleases();
  }, [currentMonth, currentYear]);

  useEffect(() => {
    if (selectedDate) {
      fetchSelectedDateReleases();
    }
  }, [selectedDate, selectedPublisher]);

  // Fonctions de navigation
  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Fonctions utilitaires
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('fr-FR', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number): number => {
    return new Date(year, month, 1).getDay();
  };

  // Fonction pour générer les jours du calendrier
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    const days = [];

    // Jours du mois précédent
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);
    const prevMonthDays = firstDay === 0 ? 6 : firstDay - 1;

    for (let i = daysInPrevMonth - prevMonthDays + 1; i <= daysInPrevMonth; i++) {
      days.push({
        day: i,
        date: new Date(prevYear, prevMonth, i),
        isCurrentMonth: false
      });
    }

    // Jours du mois actuel
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        date: new Date(currentYear, currentMonth, i),
        isCurrentMonth: true
      });
    }

    // Jours du mois suivant
    const remainingDays = 42 - days.length; // 6 semaines * 7 jours = 42
    const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
    const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;

    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        date: new Date(nextYear, nextMonth, i),
        isCurrentMonth: false
      });
    }

    return days;
  };

  // Fonctions de récupération des données
  const fetchReleases = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const monthReleases = await releasesService.getReleasesForMonth(currentYear, currentMonth);
      setReleases(monthReleases);
      
      const uniquePublishers = Array.from(new Set(monthReleases.map(release => release.publisher)));
      setPublishers(uniquePublishers);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      console.error('Erreur lors de la récupération des sorties:', errorMessage);
      setError('Impossible de charger les sorties. Veuillez réessayer plus tard.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSelectedDateReleases = async () => {
    if (selectedDate) {
      try {
        const dateReleases = await releasesService.getReleasesForDate(selectedDate);
        setSelectedDateReleases(
          selectedPublisher
            ? dateReleases.filter(release => release.publisher === selectedPublisher)
            : dateReleases
        );
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
        console.error('Erreur lors de la récupération des sorties pour la date sélectionnée:', errorMessage);
        setError('Impossible de charger les sorties pour cette date.');
      }
    }
  };

  // Fonctions de vérification
  const hasReleases = (date: Date): boolean => {
    return releases.some(release => 
      release.releaseDate.getDate() === date.getDate() &&
      release.releaseDate.getMonth() === date.getMonth() &&
      release.releaseDate.getFullYear() === date.getFullYear()
    );
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  const isSelected = (date: Date): boolean => {
    return selectedDate !== null &&
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear();
  };

  return (
    <>
      <SEO 
        title="Calendrier des Sorties Manga - MangaMania"
        description="Consultez le calendrier des sorties manga et ne manquez plus aucune nouveauté de vos séries préférées."
        type="website"
        url="/calendrier"
        keywords="calendrier manga, sorties manga, nouveautés manga, dates de sortie, planning manga"
      />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center">
            <CalendarIcon className="w-10 h-10 mr-4 text-indigo-600" />
            Calendrier des Sorties
          </h1>
          <p className="text-lg text-gray-600">
            Découvrez les prochaines sorties de mangas et ne manquez aucun tome !
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendrier */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={goToPreviousMonth}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <ChevronLeft className="w-6 h-6 text-gray-600" />
              </button>
              <h2 className="text-xl font-bold text-gray-900">
                {MONTH_NAMES[currentMonth]} {currentYear}
              </h2>
              <button
                onClick={goToNextMonth}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <ChevronRight className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Jours de la semaine */}
            <div className="grid grid-cols-7 mb-2">
              {WEEK_DAYS.map((day) => (
                <div key={day} className="text-center font-medium text-gray-600 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Jours du mois */}
            <div className="grid grid-cols-7 gap-1">
              {generateCalendarDays().map((day, index) => {
                const dayDate = day.date;
                const dayHasReleases = hasReleases(dayDate);
                const dayIsToday = isToday(dayDate);
                const dayIsSelected = isSelected(dayDate);
                
                return (
                  <button
                    key={index}
                    onClick={() => setSelectedDate(dayDate)}
                    className={`
                      h-12 flex flex-col items-center justify-center rounded-lg
                      ${!day.isCurrentMonth ? 'text-gray-400' : 'text-gray-800'}
                      ${dayIsToday ? 'bg-indigo-100 font-bold' : ''}
                      ${dayIsSelected ? 'bg-indigo-600 text-white' : ''}
                      ${dayHasReleases && !dayIsSelected ? 'border-2 border-indigo-400' : ''}
                      hover:bg-gray-100 ${dayIsSelected ? 'hover:bg-indigo-700' : ''}
                    `}
                  >
                    <span>{day.day}</span>
                    {dayHasReleases && (
                      <div className={`w-1.5 h-1.5 rounded-full mt-0.5 ${dayIsSelected ? 'bg-white' : 'bg-indigo-500'}`}></div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Légende */}
            <div className="mt-6 flex items-center justify-center space-x-6 text-sm">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-indigo-100 rounded-full mr-2"></div>
                <span>Aujourd'hui</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-indigo-400 rounded-full mr-2"></div>
                <span>Sorties disponibles</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-indigo-600 rounded-full mr-2"></div>
                <span>Sélectionné</span>
              </div>
            </div>
          </div>

          {/* Sorties du jour sélectionné */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            {selectedDate && (
              <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Sorties du {formatDate(selectedDate)}
                </h2>
                
                {/* Filtre par éditeur */}
                {publishers.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center space-x-2">
                      <Filter className="w-4 h-4 text-gray-500" />
                      <label htmlFor="publisher-filter" className="text-sm text-gray-600">
                        Filtrer par éditeur:
                      </label>
                    </div>
                    <select
                      id="publisher-filter"
                      value={selectedPublisher}
                      onChange={(e) => setSelectedPublisher(e.target.value)}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                      <option value="">Tous les éditeurs</option>
                      {publishers.map((publisher) => (
                        <option key={publisher} value={publisher}>
                          {publisher}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
            ) : selectedDateReleases.length > 0 ? (
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {selectedDateReleases.map((release) => (
                  <div
                    key={release.id}
                    className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <img
                      src={release.coverImage}
                      alt={`${release.title} Tome ${release.volume}`}
                      className="w-16 h-24 object-cover rounded-md shadow-sm"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{release.title}</h3>
                      <p className="text-sm text-gray-600">Tome {release.volume}</p>
                      <p className="text-sm text-gray-600">{release.publisher}</p>
                      {release.price && (
                        <p className="text-sm font-medium text-indigo-600">{release.price}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <BookOpen className="w-12 h-12 text-gray-400 mb-4" />
                <p className="text-gray-600">
                  Aucune sortie prévue pour cette date
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}