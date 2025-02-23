import {
  collection,
  addDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
  getDoc,
  orderBy,
  serverTimestamp,
  Timestamp,
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
}

export const mangaService = {
  async addToCollection(
    manga: Omit<MangaCollection, "added_at" | "last_read">
  ) {
    if (!auth.currentUser) throw new Error("User must be authenticated");

    const mangaCollectionRef = collection(db, "manga_collection");
    const docRef = await addDoc(mangaCollectionRef, {
      userId: auth.currentUser.uid,
      mal_id: manga.mal_id,
      title: manga.title,
      image_url: manga.image_url,
      volumes: manga.volumes,
      chapters: manga.chapters,
      status: manga.status,
      score: manga.score,
      synopsis: manga.synopsis,
      reading_status: "plan-to-read",
      current_chapter: 0,
      current_volume: 0,
      last_read: serverTimestamp(),
      added_at: serverTimestamp(),
    });

    return docRef;
  },

  async removeFromCollection(mangaId: number) {
    if (!auth.currentUser) throw new Error("User must be authenticated");

    const mangaCollectionRef = collection(db, "manga_collection");
    const q = query(
      mangaCollectionRef,
      where("userId", "==", auth.currentUser.uid),
      where("mal_id", "==", mangaId)
    );

    const querySnapshot = await getDocs(q);
    const deletePromises = querySnapshot.docs.map((doc) => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
  },

  async getUserCollection() {
    if (!auth.currentUser) throw new Error("User must be authenticated");

    const mangaCollectionRef = collection(db, "manga_collection");
    const q = query(
      mangaCollectionRef,
      where("userId", "==", auth.currentUser.uid),
      orderBy("added_at", "desc")
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => {
      const data = doc.data() as MangaCollection; // Cast uniquement les données
      return {
        id: doc.id,
        ...data,
      };
    });
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

    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) throw new Error("Manga not found in collection");

    const docRef = querySnapshot.docs[0].ref;
    await updateDoc(docRef, {
      reading_status: status,
      current_chapter: currentChapter,
      current_volume: currentVolume,
      last_read: serverTimestamp(),
    });
  },

  async isInCollection(mangaId: number) {
    if (!auth.currentUser) return false;

    const mangaCollectionRef = collection(db, "manga_collection");
    const q = query(
      mangaCollectionRef,
      where("userId", "==", auth.currentUser.uid),
      where("mal_id", "==", mangaId)
    );

    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  },
};
