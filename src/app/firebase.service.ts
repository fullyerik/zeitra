import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  setDoc,
  getDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  getDocs as getDocsAll,
  increment,
  updateDoc,
  arrayUnion,
  deleteDoc,
} from 'firebase/firestore';

const app = initializeApp(environment.firebase);
const auth = getAuth(app);
const db = getFirestore(app);

const CLOUDINARY_CLOUD = environment.cloudinary.cloudName;
const CLOUDINARY_AVATAR_PRESET = environment.cloudinary.avatarPreset;
const CLOUDINARY_BANNER_PRESET = environment.cloudinary.bannerPreset;

@Injectable({ providedIn: 'root' })
export class FirebaseService {
  async register(email: string, password: string, username: string) {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: username });
      await setDoc(doc(db, 'users', cred.user.uid), {
        username,
        email,
        bio: '',
        avatarUrl: '',
        bannerUrl: '',
        avatarBorder: 'border-blue',
        avatarGlow: '',
        showEmail: false,
        links: [],
        coins: 0,
        ownedBorders: ['border-blue'],
        ownedGlows: [''],
        ownedTitles: ['none'],
        selectedTitle: 'none',
        ownedUsernameStyles: ['default'],
        selectedUsernameStyle: 'default',
        createdAt: new Date(),
      });
      return { user: cred.user, error: null };
    } catch (e: any) {
      return { user: null, error: e.message };
    }
  }

  async login(email: string, password: string) {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      return { user: cred.user, error: null };
    } catch (e: any) {
      return { user: null, error: e.message };
    }
  }

  async logout() {
    await signOut(auth);
  }

  getCurrentUser(): User | null {
    return auth.currentUser;
  }

  onAuthChange(callback: (user: User | null) => void) {
    onAuthStateChanged(auth, callback);
  }

  async getUserProfile(uid: string) {
    try {
      const snap = await getDoc(doc(db, 'users', uid));
      return snap.exists() ? snap.data() : null;
    } catch (e) {
      return null;
    }
  }

  async searchUserByUsername(username: string) {
    try {
      const q = query(
        collection(db, 'users'),
        where('username', '>=', username),
        where('username', '<=', username + '\uf8ff'),
        limit(10),
      );
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ uid: d.id, ...d.data() }));
    } catch (e) {
      return [];
    }
  }

  async updateUserProfile(uid: string, data: any) {
    try {
      await setDoc(doc(db, 'users', uid), data, { merge: true });
      if (data.username) {
        await updateProfile(auth.currentUser!, { displayName: data.username });
      }
      return null;
    } catch (e: any) {
      return e.message;
    }
  }

  async uploadAvatar(file: File): Promise<string | null> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_AVATAR_PRESET);
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      return data.secure_url || null;
    } catch (e) {
      return null;
    }
  }

  async uploadBanner(file: File): Promise<string | null> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_BANNER_PRESET);
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      return data.secure_url || null;
    } catch (e) {
      return null;
    }
  }

  async submitScore(
    userId: string,
    username: string,
    game: string,
    level: number,
    diff: number,
  ) {
    try {
      const roundedDiff = Math.round(diff * 1000) / 1000;
      // Titel + Username-Style vom aktuellen User holen (für Leaderboard-Anzeige)
      let selectedTitle = 'none';
      let selectedUsernameStyle = 'default';
      try {
        const userSnap = await getDoc(doc(db, 'users', userId));
        if (userSnap.exists()) {
          selectedTitle = (userSnap.data()['selectedTitle'] as string) ?? 'none';
          selectedUsernameStyle = (userSnap.data()['selectedUsernameStyle'] as string) ?? 'default';
        }
      } catch {}

      const q = query(
        collection(db, 'leaderboard'),
        where('userId', '==', userId),
        where('game', '==', game),
        where('level', '==', level),
      );
      const existing = await getDocs(q);
      if (!existing.empty) {
        const bestDoc = existing.docs[0];
        const bestDiff = bestDoc.data()['diff'];
        if (roundedDiff >= bestDiff) return null;
        await setDoc(doc(db, 'leaderboard', bestDoc.id), {
          userId,
          username,
          game,
          level,
          diff: roundedDiff,
          selectedTitle,
          selectedUsernameStyle,
          createdAt: new Date(),
        });
      } else {
        await addDoc(collection(db, 'leaderboard'), {
          userId,
          username,
          game,
          level,
          diff: roundedDiff,
          selectedTitle,
          selectedUsernameStyle,
          createdAt: new Date(),
        });
      }
      return null;
    } catch (e: any) {
      console.error('Leaderboard error:', e);
      return e.message;
    }
  }

  async getLeaderboard(game: string, level: number) {
    try {
      const q = query(
        collection(db, 'leaderboard'),
        where('game', '==', game),
        where('level', '==', level),
        orderBy('diff', 'asc'),
        limit(10),
      );
      const snap = await getDocs(q);
      return snap.docs.map((d) => d.data());
    } catch (e: any) {
      console.error('Leaderboard fetch error:', e);
      return [];
    }
  }

  async getUserStats(uid: string) {
    try {
      const q = query(collection(db, 'leaderboard'), where('userId', '==', uid));
      const snap = await getDocs(q);
      return snap.docs.map((d) => d.data());
    } catch (e) {
      return [];
    }
  }

  async addCoins(uid: string, amount: number): Promise<number | null> {
    try {
      const ref = doc(db, 'users', uid);
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        await setDoc(ref, { coins: amount }, { merge: true });
        return amount;
      }
      await updateDoc(ref, { coins: increment(amount) });
      const updated = await getDoc(ref);
      return (updated.data()?.['coins'] as number) ?? null;
    } catch (e) {
      console.error('addCoins error:', e);
      return null;
    }
  }

  async getUserCoins(uid: string): Promise<number> {
    try {
      const snap = await getDoc(doc(db, 'users', uid));
      return snap.exists() ? ((snap.data()['coins'] as number) ?? 0) : 0;
    } catch (e) {
      return 0;
    }
  }

  async listTopUsers(max: number = 20) {
    try {
      const q = query(collection(db, 'users'), orderBy('coins', 'desc'), limit(max));
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ uid: d.id, ...d.data() }));
    } catch (e) {
      console.error('listTopUsers error:', e);
      return [];
    }
  }

  async setUserCoinsAbsolute(uid: string, value: number): Promise<number | null> {
    try {
      await updateDoc(doc(db, 'users', uid), { coins: value });
      return value;
    } catch (e) {
      console.error('setUserCoinsAbsolute error:', e);
      return null;
    }
  }

  async setUserOwnedItems(
    uid: string,
    type: 'border' | 'glow',
    items: string[],
  ): Promise<boolean> {
    try {
      const field = type === 'border' ? 'ownedBorders' : 'ownedGlows';
      await updateDoc(doc(db, 'users', uid), { [field]: items });
      return true;
    } catch (e) {
      console.error('setUserOwnedItems error:', e);
      return false;
    }
  }

  async deleteLeaderboardEntries(game: string, level: number): Promise<number> {
    try {
      const q = query(
        collection(db, 'leaderboard'),
        where('game', '==', game),
        where('level', '==', level),
      );
      const snap = await getDocs(q);
      let count = 0;
      for (const d of snap.docs) {
        await deleteDoc(d.ref);
        count++;
      }
      return count;
    } catch (e) {
      console.error('deleteLeaderboardEntries error:', e);
      return 0;
    }
  }

  async purchaseItem(
    uid: string,
    itemType: 'border' | 'glow' | 'title' | 'usernameStyle',
    itemId: string,
    price: number,
  ): Promise<{ success: boolean; error?: string; newCoins?: number }> {
    try {
      const ref = doc(db, 'users', uid);
      const snap = await getDoc(ref);
      if (!snap.exists()) return { success: false, error: 'User nicht gefunden' };
      const data = snap.data();
      const coins = (data['coins'] as number) ?? 0;
      const ownedFields: Record<string, string> = {
        border: 'ownedBorders',
        glow: 'ownedGlows',
        title: 'ownedTitles',
        usernameStyle: 'ownedUsernameStyles',
      };
      const ownedField = ownedFields[itemType];
      const owned = (data[ownedField] as string[]) ?? [];
      if (owned.includes(itemId)) return { success: false, error: 'Bereits im Besitz' };
      if (coins < price) return { success: false, error: 'Nicht genug Münzen' };
      await updateDoc(ref, {
        coins: increment(-price),
        [ownedField]: arrayUnion(itemId),
      });
      return { success: true, newCoins: coins - price };
    } catch (e: any) {
      console.error('purchaseItem error:', e);
      return { success: false, error: e.message };
    }
  }
}
