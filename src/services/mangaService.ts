// Ce service gère toutes les interactions avec Firestore pour la collection de mangas de l'utilisateur.

// Fonctionnalités principales :

// addToCollection : Ajoute un manga à la collection de l'utilisateur
// removeFromCollection : Supprime un manga de la collection
// getUserCollection : Récupère tous les mangas de la collection de l'utilisateur
// updateReadingStatus : Met à jour le statut de lecture d'un manga
// isInCollection : Vérifie si un manga est déjà dans la collection
// Ce service est utilisé dans les pages Collection et Lecture pour gérer les mangas de l'utilisateur.

import {
  collection,
  addDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  updateDoc,
  serverTimestamp,
  Timestamp,
  limit,
} from "firebase/firestore";
import { db, auth } from "../lib/firebase";

export interface MangaCollection {
  mal_id: number;
  title: string;
  image_url: string;
  volumes: number;
  chapters: number;
  status: string;
  score: number;
  synopsis: string;
  reading_status:
    | "reading"
    | "completed"
    | "on-hold"
    | "dropped"
    | "plan-to-read";
  current_chapter: number;
  current_volume: number;
  last_read: Timestamp;
  added_at: Timestamp;
  userId: string;
}

export const mangaService = {
  async initializeCollection() {
    if (!auth.currentUser) return;

    try {
      const collectionRef = collection(db, "manga_collection");
      const q = query(
        collectionRef,
        where("userId", "==", auth.currentUser.uid),
        limit(1)
      );
      await getDocs(q);
    } catch (error) {
      console.error("Error initializing collection:", error);
    }
  },

  async addToCollection(manga: {
    mal_id: number;
    title: string;
    images: {
      webp: {
        image_url: string;
        large_image_url: string;
      };
    };
    volumes?: number;
    chapters?: number;
    status?: string;
    score?: number;
    synopsis?: string;
  }) {
    if (!auth.currentUser) throw new Error("User must be authenticated");

    await this.initializeCollection();

    const exists = await this.isInCollection(manga.mal_id);
    if (exists) {
      throw new Error("Ce manga est déjà dans votre collection");
    }

    const mangaCollectionRef = collection(db, "manga_collection");

    const mangaData = {
      userId: auth.currentUser.uid,
      mal_id: manga.mal_id,
      title: manga.title,
      image_url:
        manga.images.webp.large_image_url || manga.images.webp.image_url,
      volumes: manga.volumes || 0,
      chapters: manga.chapters || 0,
      status: manga.status || "unknown",
      score: manga.score || 0,
      synopsis: manga.synopsis || "",
      reading_status: "plan-to-read" as const,
      current_chapter: 0,
      current_volume: 0,
      last_read: serverTimestamp(),
      added_at: serverTimestamp(),
    };

    try {
      const docRef = await addDoc(mangaCollectionRef, mangaData);
      return { id: docRef.id, ...mangaData };
    } catch (error) {
      console.error("Error adding manga to collection:", error);
      throw new Error("Erreur lors de l'ajout du manga à la collection");
    }
  },

  async removeFromCollection(mangaId: number) {
    if (!auth.currentUser) throw new Error("User must be authenticated");

    const mangaCollectionRef = collection(db, "manga_collection");
    const q = query(
      mangaCollectionRef,
      where("userId", "==", auth.currentUser.uid),
      where("mal_id", "==", mangaId)
    );

    try {
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        await deleteDoc(querySnapshot.docs[0].ref);
      }
    } catch (error) {
      console.error("Error removing manga from collection:", error);
      throw new Error(
        "Erreur lors de la suppression du manga de la collection"
      );
    }
  },

  async getUserCollection(): Promise<MangaCollection[]> {
    if (!auth.currentUser) throw new Error("User must be authenticated");

    const mangaCollectionRef = collection(db, "manga_collection");
    // Suppression de orderBy pour éviter le besoin d'un index composite
    const q = query(
      mangaCollectionRef,
      where("userId", "==", auth.currentUser.uid)
    );

    try {
      const querySnapshot = await getDocs(q);
      const mangas = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        // Convertir les timestamps en objets Timestamp
        const last_read =
          data.last_read instanceof Timestamp
            ? data.last_read
            : new Timestamp(0, 0);
        const added_at =
          data.added_at instanceof Timestamp
            ? data.added_at
            : new Timestamp(0, 0);

        return {
          ...data,
          mal_id: data.mal_id,
          last_read,
          added_at,
        } as MangaCollection;
      });

      // Tri côté client
      return mangas.sort((a, b) => b.added_at.seconds - a.added_at.seconds);
    } catch (error) {
      console.error("Error fetching user collection:", error);
      throw new Error("Erreur lors de la récupération de la collection");
    }
  },

  async updateReadingStatus(
    mangaId: number,
    status: MangaCollection["reading_status"],
    currentChapter: number,
    currentVolume: number
  ) {
    if (!auth.currentUser) throw new Error("User must be authenticated");

    const mangaCollectionRef = collection(db, "manga_collection");
    const q = query(
      mangaCollectionRef,
      where("userId", "==", auth.currentUser.uid),
      where("mal_id", "==", mangaId)
    );

    try {
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty)
        throw new Error("Manga non trouvé dans la collection");

      const docRef = querySnapshot.docs[0].ref;
      await updateDoc(docRef, {
        reading_status: status,
        current_chapter: currentChapter,
        current_volume: currentVolume,
        last_read: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error updating reading status:", error);
      throw new Error("Erreur lors de la mise à jour du statut de lecture");
    }
  },

  async isInCollection(mangaId: number): Promise<boolean> {
    if (!auth.currentUser) return false;

    const mangaCollectionRef = collection(db, "manga_collection");
    const q = query(
      mangaCollectionRef,
      where("userId", "==", auth.currentUser.uid),
      where("mal_id", "==", mangaId)
    );

    try {
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (error) {
      console.error("Error checking collection status:", error);
      return false;
    }
  },
};
