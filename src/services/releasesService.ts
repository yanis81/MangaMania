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

// Cache pour les données de sortie
let releasesCache: MangaRelease[] | null = null;
let lastFetchTime: number = 0;
const CACHE_DURATION = 3600000; // 1 heure en millisecondes

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
        'https://api.jikan.moe/v4/manga?status=publishing&order_by=popularity&sort=asc&limit=100'
      );
      
      if (!response.data || !response.data.data) {
        throw new Error('Données invalides reçues de l\'API Jikan');
      }
      
      const releases: MangaRelease[] = [];
      const today = new Date();
      const startDate = new Date(today);
      startDate.setDate(today.getDate() - 30); // 30 jours avant aujourd'hui
      
      const endDate = new Date(today);
      endDate.setDate(today.getDate() + 30); // 30 jours après aujourd'hui
      
      // Parcourir les mangas et créer des sorties
      for (const manga of response.data.data) {
        // Ignorer les mangas sans date de publication
        if (!manga.published || !manga.published.prop.from) {
          continue;
        }
        
        // Créer des sorties pour chaque volume (ou un volume aléatoire si le nombre de volumes n'est pas spécifié)
        const totalVolumes = manga.volumes || Math.floor(Math.random() * 20) + 1;
        
        // Générer des dates de sortie pour les volumes
        for (let volume = 1; volume <= Math.min(totalVolumes, 5); volume++) {
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
      
      // En cas d'erreur, retourner un tableau vide ou les données en cache si disponibles
      return releasesCache || [];
    }
  },
  
  // Récupérer les sorties du jour
  async getTodayReleases(): Promise<MangaRelease[]> {
    try {
      const allReleases = await this.getAllReleases();
      const today = new Date();
      
      return allReleases.filter(release => 
        release.releaseDate.getDate() === today.getDate() &&
        release.releaseDate.getMonth() === today.getMonth() &&
        release.releaseDate.getFullYear() === today.getFullYear()
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      console.error('Erreur lors de la récupération des sorties du jour:', errorMessage);
      return [];
    }
  },
  
  // Récupérer les sorties pour une date spécifique
  async getReleasesForDate(date: Date): Promise<MangaRelease[]> {
    try {
      const allReleases = await this.getAllReleases();
      
      return allReleases.filter(release => 
        release.releaseDate.getDate() === date.getDate() &&
        release.releaseDate.getMonth() === date.getMonth() &&
        release.releaseDate.getFullYear() === date.getFullYear()
      );
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
      
      return allReleases.filter(release => 
        release.releaseDate.getMonth() === month &&
        release.releaseDate.getFullYear() === year
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      console.error('Erreur lors de la récupération des sorties pour un mois:', errorMessage);
      return [];
    }
  },
  
  // Récupérer les prochaines sorties
  async getUpcomingReleases(limit: number = 10): Promise<MangaRelease[]> {
    try {
      const allReleases = await this.getAllReleases();
      const today = new Date();
      
      return allReleases
        .filter(release => release.releaseDate.getTime() >= today.getTime())
        .sort((a, b) => a.releaseDate.getTime() - b.releaseDate.getTime())
        .slice(0, limit);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      console.error('Erreur lors de la récupération des prochaines sorties:', errorMessage);
      return [];
    }
  }
};