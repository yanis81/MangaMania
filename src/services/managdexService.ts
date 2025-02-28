// Interface pour les données de manga de Jikan API
interface JikanMangaResponse {
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
      volumes: number;
    }>;
  }
  
  interface JikanMangaDetail {
    data: {
      mal_id: number;
      title: string;
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
      volumes: number;
    };
  }
  
  export const mangadexService = {
    async searchMangaByTitle(title: string): Promise<{ id: string; volumes: number } | null> {
      try {
        const cleanTitle = title
          .replace(/\([^)]*\)/g, '')
          .trim();
  
        console.log('Searching manga with Jikan API:', cleanTitle);
        try {
          const response = await fetch(`https://api.jikan.moe/v4/manga?q=${encodeURIComponent(cleanTitle)}&limit=5`);
  
          if (!response.ok) {
            console.error('Jikan API Error:', await response.text());
            throw new Error(`HTTP error! status: ${response.status}`);
          }
  
          const data: JikanMangaResponse = await response.json();
          
          if (!data.data || data.data.length === 0) {
            console.log('No manga found for title in Jikan:', cleanTitle);
            return null;
          }
  
          // Find best match by comparing titles
          const bestMatch = data.data.find(item => {
            const titles = [
              item.title.toLowerCase(),
              ...item.titles.map(t => t.title.toLowerCase())
            ];
  
            const searchTitle = cleanTitle.toLowerCase();
            return titles.some(t => t && (
              t === searchTitle ||
              t.includes(searchTitle) ||
              searchTitle.includes(t)
            ));
          });
  
          const selectedManga = bestMatch || data.data[0];
          
          if (!selectedManga) {
            console.log('No matching manga found in Jikan');
            return null;
          }
          
          return {
            id: `${selectedManga.mal_id}`,
            volumes: selectedManga.volumes || 10 // Valeur par défaut si volumes n'est pas défini
          };
        } catch (error) {
          console.error('Jikan API fetch error:', error);
          return null;
        }
      } catch (error) {
        console.error('Error searching manga:', error);
        return null;
      }
    },
  
    async getMangaCovers(mangaId: string, totalVolumes: number): Promise<string[]> {
      try {
        // Utiliser Jikan API pour récupérer les détails du manga
        try {
          const response = await fetch(`https://api.jikan.moe/v4/manga/${mangaId}/full`);
  
          if (!response.ok) {
            console.error('Jikan API Error:', await response.text());
            throw new Error(`HTTP error! status: ${response.status}`);
          }
  
          const data: JikanMangaDetail = await response.json();
          
          // Utiliser l'image principale comme base
          const defaultCover = data.data.images.jpg.large_image_url || data.data.images.jpg.image_url;
          
          // Récupérer les images de couverture pour chaque volume
          const volumeCovers: string[] = [];
          const volumes = Math.max(1, data.data.volumes || totalVolumes);
  
          // Essayer de récupérer les images de chaque volume via l'API Jikan
          try {
            // Jikan n'a pas d'endpoint spécifique pour les couvertures de volumes
            // Nous allons donc utiliser la même image pour tous les volumes
            for (let i = 0; i < volumes; i++) {
              volumeCovers.push(defaultCover);
            }
          } catch (error) {
            console.error('Error fetching volume covers:', error);
            // En cas d'erreur, utiliser l'image principale pour tous les volumes
            for (let i = 0; i < volumes; i++) {
              volumeCovers.push(defaultCover);
            }
          }
  
          return volumeCovers;
        } catch (error) {
          console.error('Jikan API fetch error:', error);
          // En cas d'erreur, retourner un tableau vide
          return [];
        }
      } catch (error) {
        console.error('Error fetching manga covers:', error);
        return [];
      }
    }
  };