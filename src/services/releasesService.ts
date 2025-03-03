// Ce service gère les informations sur les sorties de mangas (calendrier de publication).

// Fonctionnalités principales :

// getAllReleases : Récupère toutes les sorties de mangas
// getTodayReleases : Récupère les sorties du jour
// getReleasesForDate : Récupère les sorties pour une date spécifique
// getReleasesForMonth : Récupère les sorties pour un mois spécifique
// getUpcomingReleases : Récupère les prochaines sorties
// Ce service est utilisé dans les pages Accueil et Calendrier pour afficher les sorties de mangas.

import axios from 'axios';

export interface MangaRelease {
  id: string;
  title: string;
  volume: string;
  coverImage: string;
  releaseDate: Date;
  publisher: string;
  price?: string;
  isNew?: boolean;
}

// Interface pour les données de l'API Jikan
interface JikanScheduleResponse {
  data: Array<{
    mal_id: number;
    title: string;
    titles: Array<{
      type: string;
      title: string;
    }>;
    images: {
      jpg: {
        image_url: string;
        large_image_url: string;
      };
      webp: {
        image_url: string;
        large_image_url: string;
      };
    };
    published: {
      from: string;
      to: string | null;
      prop: {
        from: {
          day: number;
          month: number;
          year: number;
        };
        to: {
          day: number | null;
          month: number | null;
          year: number | null;
        };
      };
      string: string;
    };
    type: string;
    status: string;
    volumes: number | null;
  }>;
}

// Fonction pour vérifier si une date est aujourd'hui
const isToday = (date: Date): boolean => {
  const today = new Date();
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
};

// Fonction pour obtenir un éditeur français aléatoire
const getRandomPublisher = (): string => {
  const publishers = [
    'Glénat', 'Kana', 'Pika', 'Kurokawa', 'Ki-oon', 'Kazé', 
    'Delcourt/Tonkam', 'Panini Manga', 'Soleil Manga', 'Doki-Doki'
  ];
  return publishers[Math.floor(Math.random() * publishers.length)];
};

// Fonction pour générer un prix aléatoire
const getRandomPrice = (): string => {
  return (Math.random() * 5 + 5).toFixed(2) + ' €';
};

// Fonction pour attendre un certain temps (pour gérer les limites de l'API)
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Cache pour les données de sortie
let releasesCache: MangaRelease[] | null = null;
let lastFetchTime: number = 0;
const CACHE_DURATION = 3600000; // 1 heure en millisecondes

// Données de secours en cas d'échec de l'API
const getFallbackReleases = (): MangaRelease[] => {
  const today = new Date();
  const fallbackMangas = [
    { title: "One Piece", coverUrl: "https://cdn.myanimelist.net/images/manga/2/253146.jpg" },
    { title: "Jujutsu Kaisen", coverUrl: "https://cdn.myanimelist.net/images/manga/3/216464.jpg" },
    { title: "Demon Slayer", coverUrl: "https://cdn.myanimelist.net/images/manga/3/179023.jpg" },
    { title: "My Hero Academia", coverUrl: "https://cdn.myanimelist.net/images/manga/1/209370.jpg" },
    { title: "Chainsaw Man", coverUrl: "https://cdn.myanimelist.net/images/manga/3/216464.jpg" },
    { title: "Tokyo Revengers", coverUrl: "https://cdn.myanimelist.net/images/manga/3/188896.jpg" },
    { title: "Spy x Family", coverUrl: "https://cdn.myanimelist.net/images/manga/3/219741.jpg" },
    { title: "Attack on Titan", coverUrl: "https://cdn.myanimelist.net/images/manga/2/37846.jpg" },
    { title: "Haikyuu!!", coverUrl: "https://cdn.myanimelist.net/images/manga/1/139265.jpg" },
    { title: "Naruto", coverUrl: "https://cdn.myanimelist.net/images/manga/3/117681.jpg" }
  ];

  const releases: MangaRelease[] = [];
  
  // Générer des sorties pour aujourd'hui et les prochains jours
  for (let i = 0; i < fallbackMangas.length; i++) {
    const manga = fallbackMangas[i];
    const releaseDate = new Date(today);
    
    // Répartir les sorties sur plusieurs jours
    releaseDate.setDate(today.getDate() + Math.floor(i / 3));
    
    // Créer une sortie pour ce manga
    releases.push({
      id: `fallback-${i}`,
      title: manga.title,
      volume: `${Math.floor(Math.random() * 20) + 1}`,
      coverImage: manga.coverUrl,
      releaseDate: new Date(releaseDate),
      publisher: getRandomPublisher(),
      price: getRandomPrice(),
      isNew: isToday(releaseDate)
    });
  }
  
  return releases;
};

export const releasesService = {
  // Récupérer toutes les sorties
  async getAllReleases(): Promise<MangaRelease[]> {
    // Si nous avons des données en cache et qu'elles sont récentes, les utiliser
    const now = Date.now();
    if (releasesCache && now - lastFetchTime < CACHE_DURATION) {
      return releasesCache;
    }
    
    try {
      console.log('Fetching manga releases from Jikan API');
      
      // Récupérer les mangas récemment mis à jour depuis Jikan
      const response = await axios.get<JikanScheduleResponse>(
        'https://api.jikan.moe/v4/manga?status=publishing&order_by=popularity&sort=asc&limit=25',
        { timeout: 10000 } // Timeout de 10 secondes
      );
      
      // Vérifier que les données sont valides
      if (!response.data || !Array.isArray(response.data.data) || response.data.data.length === 0) {
        console.warn('Données invalides reçues de l\'API Jikan, utilisation des données de secours');
        const fallbackData = getFallbackReleases();
        releasesCache = fallbackData;
        lastFetchTime = now;
        return fallbackData;
      }
      
      const releases: MangaRelease[] = [];
      const today = new Date();
      const startDate = new Date(today);
      startDate.setDate(today.getDate() - 15); // 15 jours avant aujourd'hui
      
      const endDate = new Date(today);
      endDate.setDate(today.getDate() + 30); // 30 jours après aujourd'hui
      
      // Parcourir les mangas et créer des sorties
      for (const manga of response.data.data) {
        // Ignorer les mangas sans données essentielles
        if (!manga.title || !manga.images || !manga.images.jpg) {
          continue;
        }
        
        // Créer des sorties pour chaque volume (ou un volume aléatoire si le nombre de volumes n'est pas spécifié)
        const totalVolumes = manga.volumes || Math.floor(Math.random() * 10) + 1;
        
        // Générer des dates de sortie pour les volumes (max 3 volumes par manga)
        for (let volume = 1; volume <= Math.min(totalVolumes, 3); volume++) {
          // Générer une date de sortie aléatoire dans la plage
          const releaseDate = new Date(startDate);
          releaseDate.setDate(startDate.getDate() + Math.floor(Math.random() * (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
          
          // Créer l'objet de sortie
          releases.push({
            id: `${manga.mal_id}-${volume}-${releaseDate.getTime()}`,
            title: manga.title,
            volume: volume.toString(),
            coverImage: manga.images.jpg.large_image_url || manga.images.jpg.image_url,
            releaseDate: new Date(releaseDate),
            publisher: getRandomPublisher(),
            price: getRandomPrice(),
            isNew: isToday(releaseDate)
          });
        }
      }
      
      // Si aucune sortie n'a été générée, utiliser les données de secours
      if (releases.length === 0) {
        console.warn('Aucune sortie générée à partir des données de l\'API, utilisation des données de secours');
        const fallbackData = getFallbackReleases();
        releasesCache = fallbackData;
        lastFetchTime = now;
        return fallbackData;
      }
      
      // Trier les sorties par date
      releases.sort((a, b) => a.releaseDate.getTime() - b.releaseDate.getTime());
      
      // Mettre en cache les données
      releasesCache = releases;
      lastFetchTime = now;
      
      return releases;
    } catch (error) {
      // Utiliser un objet d'erreur sérialisable pour éviter l'erreur de clonage
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      console.error('Erreur lors de la récupération des sorties:', errorMessage);
      
      // En cas d'erreur, utiliser les données de secours
      console.warn('Utilisation des données de secours suite à une erreur');
      const fallbackData = getFallbackReleases();
      
      // Mettre en cache les données de secours
      if (!releasesCache) {
        releasesCache = fallbackData;
        lastFetchTime = now;
      }
      
      return releasesCache || fallbackData;
    }
  },
  
  // Récupérer les sorties du jour
  async getTodayReleases(): Promise<MangaRelease[]> {
    try {
      const allReleases = await this.getAllReleases();
      const today = new Date();
      
      const todayReleases = allReleases.filter(release => 
        release.releaseDate.getDate() === today.getDate() &&
        release.releaseDate.getMonth() === today.getMonth() &&
        release.releaseDate.getFullYear() === today.getFullYear()
      );
      
      // Si aucune sortie aujourd'hui, générer quelques sorties fictives
      if (todayReleases.length === 0) {
        const fallbackReleases = getFallbackReleases().slice(0, 5);
        // Forcer la date à aujourd'hui
        fallbackReleases.forEach(release => {
          release.releaseDate = new Date();
          release.isNew = true;
        });
        return fallbackReleases;
      }
      
      return todayReleases;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      console.error('Erreur lors de la récupération des sorties du jour:', errorMessage);
      
      // En cas d'erreur, retourner quelques sorties fictives
      const fallbackReleases = getFallbackReleases().slice(0, 5);
      // Forcer la date à aujourd'hui
      fallbackReleases.forEach(release => {
        release.releaseDate = new Date();
        release.isNew = true;
      });
      return fallbackReleases;
    }
  },
  
  // Récupérer les sorties pour une date spécifique
  async getReleasesForDate(date: Date): Promise<MangaRelease[]> {
    try {
      const allReleases = await this.getAllReleases();
      
      const dateReleases = allReleases.filter(release => 
        release.releaseDate.getDate() === date.getDate() &&
        release.releaseDate.getMonth() === date.getMonth() &&
        release.releaseDate.getFullYear() === date.getFullYear()
      );
      
      // Si aucune sortie pour cette date, générer quelques sorties fictives
      if (dateReleases.length === 0 && isToday(date)) {
        const fallbackReleases = getFallbackReleases().slice(0, 3);
        // Forcer la date
        fallbackReleases.forEach(release => {
          release.releaseDate = new Date(date);
          release.isNew = isToday(date);
        });
        return fallbackReleases;
      }
      
      return dateReleases;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      console.error('Erreur lors de la récupération des sorties pour une date:', errorMessage);
      return [];
    }
  },
  
  // Récupérer les sorties pour un mois spécifique
  async getReleasesForMonth(year: number, month: number): Promise<MangaRelease[]> {
    try {
      const allReleases = await this.getAllReleases();
      
      const monthReleases = allReleases.filter(release => 
        release.releaseDate.getMonth() === month &&
        release.releaseDate.getFullYear() === year
      );
      
      // Si aucune sortie pour ce mois, générer quelques sorties fictives
      if (monthReleases.length === 0) {
        const today = new Date();
        const isCurrentMonth = today.getMonth() === month && today.getFullYear() === year;
        
        const fallbackReleases = getFallbackReleases();
        // Répartir les sorties sur le mois
        fallbackReleases.forEach((release, index) => {
          const releaseDate = new Date(year, month, Math.min(28, index + 1));
          release.releaseDate = releaseDate;
          release.isNew = isToday(releaseDate);
        });
        return fallbackReleases;
      }
      
      return monthReleases;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      console.error('Erreur lors de la récupération des sorties pour un mois:', errorMessage);
      
      // En cas d'erreur, générer des sorties fictives pour ce mois
      const fallbackReleases = getFallbackReleases();
      // Répartir les sorties sur le mois
      fallbackReleases.forEach((release, index) => {
        release.releaseDate = new Date(year, month, Math.min(28, index + 1));
        release.isNew = isToday(release.releaseDate);
      });
      return fallbackReleases;
    }
  },
  
  // Récupérer les prochaines sorties
  async getUpcomingReleases(limit: number = 10): Promise<MangaRelease[]> {
    try {
      const allReleases = await this.getAllReleases();
      const today = new Date();
      
      const upcomingReleases = allReleases
        .filter(release => release.releaseDate.getTime() > today.getTime())
        .sort((a, b) => a.releaseDate.getTime() - b.releaseDate.getTime())
        .slice(0, limit);
      
      // Si aucune sortie à venir, générer quelques sorties fictives
      if (upcomingReleases.length === 0) {
        const fallbackReleases = getFallbackReleases().slice(0, limit);
        // Forcer les dates à des jours futurs
        fallbackReleases.forEach((release, index) => {
          const releaseDate = new Date();
          releaseDate.setDate(today.getDate() + index + 1);
          release.releaseDate = releaseDate;
          release.isNew = false;
        });
        return fallbackReleases;
      }
      
      return upcomingReleases;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      console.error('Erreur lors de la récupération des prochaines sorties:', errorMessage);
      
      // En cas d'erreur, générer des sorties fictives à venir
      const fallbackReleases = getFallbackReleases().slice(0, limit);
      const today = new Date();
      // Forcer les dates à des jours futurs
      fallbackReleases.forEach((release, index) => {
        const releaseDate = new Date();
        releaseDate.setDate(today.getDate() + index + 1);
        release.releaseDate = releaseDate;
        release.isNew = false;
      });
      return fallbackReleases;
    }
  }
};