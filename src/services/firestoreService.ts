import { 
  db, 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  getDocs, 
  deleteDoc, 
  onSnapshot 
} from '../firebase';
import { 
  UserProfile, 
  Song, 
  LyricItem, 
  GalleryItem, 
  VideoItem, 
  ProjectItem, 
  BookItem, 
  TimelineItem, 
  SocialLink, 
  ContactMessage,
  SiteBranding,
  HomepageConfig,
  NavigationItem,
  AppearanceConfig,
  SEOConfig,
  YouTubeSettings
} from '../types';

export const firestoreService = {
  // Sync or save entity to collection
  async saveDocument<T extends Record<string, any>>(collectionName: string, id: string, data: T): Promise<void> {
    try {
      const docRef = doc(db, collectionName, id);
      await setDoc(docRef, data, { merge: true });
    } catch (error) {
      console.warn(`Firestore saveDocument error on ${collectionName}/${id}:`, error);
    }
  },

  async deleteDocument(collectionName: string, id: string): Promise<void> {
    try {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.warn(`Firestore deleteDocument error on ${collectionName}/${id}:`, error);
    }
  },

  async fetchCollection<T>(collectionName: string): Promise<T[] | null> {
    try {
      const querySnapshot = await getDocs(collection(db, collectionName));
      if (querySnapshot.empty) return null;
      const results: T[] = [];
      querySnapshot.forEach((docSnap) => {
        results.push({ id: docSnap.id, ...docSnap.data() } as unknown as T);
      });
      return results;
    } catch (error) {
      console.warn(`Firestore fetchCollection error on ${collectionName}:`, error);
      return null;
    }
  },

  async fetchDocument<T>(collectionName: string, id: string): Promise<T | null> {
    try {
      const docRef = doc(db, collectionName, id);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return { id: snap.id, ...snap.data() } as unknown as T;
      }
      return null;
    } catch (error) {
      console.warn(`Firestore fetchDocument error on ${collectionName}/${id}:`, error);
      return null;
    }
  },

  // Real-time listener for a collection
  subscribeCollection<T>(collectionName: string, onUpdate: (items: T[]) => void): () => void {
    try {
      const unsubscribe = onSnapshot(collection(db, collectionName), (snapshot) => {
        const items: T[] = [];
        snapshot.forEach((docSnap) => {
          items.push({ id: docSnap.id, ...docSnap.data() } as unknown as T);
        });
        if (items.length > 0) {
          onUpdate(items);
        }
      }, (error) => {
        console.warn(`Firestore onSnapshot error on ${collectionName}:`, error);
      });
      return unsubscribe;
    } catch (err) {
      console.warn(`Firestore subscribeCollection error on ${collectionName}:`, err);
      return () => {};
    }
  }
};
