import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  query,
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { SavedTrip, FavoriteItem, UserProfileData } from '../types';

const LOCAL_TRIPS_PREFIX = 'travillo_saved_trips_';
const LOCAL_FAVS_PREFIX = 'travillo_saved_favs_';

/**
 * User Profile Services
 */
export async function syncUserProfile(user: {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}): Promise<void> {
  const path = `users/${user.uid}`;
  try {
    const userDocRef = doc(db, 'users', user.uid);
    const existing = await getDoc(userDocRef);

    const profileData: UserProfileData = {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || user.email?.split('@')[0] || 'Traveler',
      photoURL: user.photoURL || null,
      createdAt: existing.exists() ? existing.data()?.createdAt || new Date().toISOString() : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await setDoc(userDocRef, profileData, { merge: true });
  } catch (error) {
    try {
      handleFirestoreError(error, OperationType.WRITE, path);
    } catch {
      // Graceful continuation
    }
  }
}

export async function getUserProfile(userId: string): Promise<UserProfileData | null> {
  const path = `users/${userId}`;
  try {
    const docRef = doc(db, 'users', userId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as UserProfileData;
    }
    return null;
  } catch (error) {
    try {
      handleFirestoreError(error, OperationType.GET, path);
    } catch {
      // Graceful continuation
    }
    return null;
  }
}

/**
 * Saved Trips Services
 * Located at users/{userId}/trips/{tripId}
 */
export async function saveTripToFirestore(userId: string, trip: SavedTrip): Promise<void> {
  const path = `users/${userId}/trips/${trip.id}`;
  // Always persist locally as well for immediate offline availability
  try {
    const localTripsKey = `${LOCAL_TRIPS_PREFIX}${userId}`;
    const raw = localStorage.getItem(localTripsKey);
    const list: SavedTrip[] = raw ? JSON.parse(raw) : [];
    const updated = [trip, ...list.filter(t => t.id !== trip.id)];
    localStorage.setItem(localTripsKey, JSON.stringify(updated));
  } catch (e) {
    console.error("Local trips storage error:", e);
  }

  try {
    const tripDocRef = doc(db, 'users', userId, 'trips', trip.id);
    await setDoc(tripDocRef, trip);
  } catch (error) {
    try {
      handleFirestoreError(error, OperationType.CREATE, path);
    } catch (e) {
      console.warn("Firestore trip write error, saved locally:", e);
    }
  }
}

export async function getUserTrips(userId: string): Promise<SavedTrip[]> {
  const path = `users/${userId}/trips`;
  try {
    const tripsCol = collection(db, 'users', userId, 'trips');
    const tripsQuery = query(tripsCol, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(tripsQuery);
    const cloudTrips = snapshot.docs.map(doc => doc.data() as SavedTrip);
    if (cloudTrips.length > 0) {
      return cloudTrips;
    }
  } catch (error) {
    try {
      handleFirestoreError(error, OperationType.LIST, path);
    } catch {
      // fallback to local
    }
  }

  // Fallback to local
  try {
    const raw = localStorage.getItem(`${LOCAL_TRIPS_PREFIX}${userId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function subscribeUserTrips(
  userId: string,
  onUpdate: (trips: SavedTrip[]) => void,
  onError?: (error: Error) => void
): () => void {
  const path = `users/${userId}/trips`;
  const tripsCol = collection(db, 'users', userId, 'trips');
  const tripsQuery = query(tripsCol, orderBy('createdAt', 'desc'));

  // Initial local hydration
  try {
    const raw = localStorage.getItem(`${LOCAL_TRIPS_PREFIX}${userId}`);
    if (raw) {
      onUpdate(JSON.parse(raw));
    }
  } catch {
    // ignore
  }

  try {
    return onSnapshot(
      tripsQuery,
      (snapshot) => {
        const trips = snapshot.docs.map(doc => doc.data() as SavedTrip);
        if (trips.length > 0) {
          onUpdate(trips);
          try {
            localStorage.setItem(`${LOCAL_TRIPS_PREFIX}${userId}`, JSON.stringify(trips));
          } catch {
            // ignore
          }
        }
      },
      (err) => {
        try {
          handleFirestoreError(err, OperationType.LIST, path);
        } catch {
          // ignore
        }
        if (onError) onError(err);
      }
    );
  } catch {
    return () => {};
  }
}

export async function deleteTripFromFirestore(userId: string, tripId: string): Promise<void> {
  const path = `users/${userId}/trips/${tripId}`;
  try {
    const localTripsKey = `${LOCAL_TRIPS_PREFIX}${userId}`;
    const raw = localStorage.getItem(localTripsKey);
    if (raw) {
      const list: SavedTrip[] = JSON.parse(raw);
      const updated = list.filter(t => t.id !== tripId);
      localStorage.setItem(localTripsKey, JSON.stringify(updated));
    }
  } catch {
    // ignore
  }

  try {
    const tripDocRef = doc(db, 'users', userId, 'trips', tripId);
    await deleteDoc(tripDocRef);
  } catch (error) {
    try {
      handleFirestoreError(error, OperationType.DELETE, path);
    } catch {
      // ignore
    }
  }
}

/**
 * Favorites Services
 * Located at users/{userId}/favorites/{destinationId}
 */
export async function addFavoriteToFirestore(userId: string, item: FavoriteItem): Promise<void> {
  const path = `users/${userId}/favorites/${item.destinationId}`;
  try {
    const localFavKey = `${LOCAL_FAVS_PREFIX}${userId}`;
    const raw = localStorage.getItem(localFavKey);
    const list: FavoriteItem[] = raw ? JSON.parse(raw) : [];
    const updated = [item, ...list.filter(f => f.destinationId !== item.destinationId)];
    localStorage.setItem(localFavKey, JSON.stringify(updated));
  } catch {
    // ignore
  }

  try {
    const favRef = doc(db, 'users', userId, 'favorites', item.destinationId);
    await setDoc(favRef, item);
  } catch (error) {
    try {
      handleFirestoreError(error, OperationType.CREATE, path);
    } catch {
      // ignore
    }
  }
}

export async function removeFavoriteFromFirestore(userId: string, destinationId: string): Promise<void> {
  const path = `users/${userId}/favorites/${destinationId}`;
  try {
    const localFavKey = `${LOCAL_FAVS_PREFIX}${userId}`;
    const raw = localStorage.getItem(localFavKey);
    if (raw) {
      const list: FavoriteItem[] = JSON.parse(raw);
      const updated = list.filter(f => f.destinationId !== destinationId);
      localStorage.setItem(localFavKey, JSON.stringify(updated));
    }
  } catch {
    // ignore
  }

  try {
    const favRef = doc(db, 'users', userId, 'favorites', destinationId);
    await deleteDoc(favRef);
  } catch (error) {
    try {
      handleFirestoreError(error, OperationType.DELETE, path);
    } catch {
      // ignore
    }
  }
}

export function subscribeUserFavorites(
  userId: string,
  onUpdate: (favorites: FavoriteItem[]) => void,
  onError?: (error: Error) => void
): () => void {
  const path = `users/${userId}/favorites`;
  const favsCol = collection(db, 'users', userId, 'favorites');

  try {
    const raw = localStorage.getItem(`${LOCAL_FAVS_PREFIX}${userId}`);
    if (raw) {
      onUpdate(JSON.parse(raw));
    }
  } catch {
    // ignore
  }

  try {
    return onSnapshot(
      favsCol,
      (snapshot) => {
        const favs = snapshot.docs.map(doc => doc.data() as FavoriteItem);
        if (favs.length > 0) {
          onUpdate(favs);
          try {
            localStorage.setItem(`${LOCAL_FAVS_PREFIX}${userId}`, JSON.stringify(favs));
          } catch {
            // ignore
          }
        }
      },
      (err) => {
        try {
          handleFirestoreError(err, OperationType.LIST, path);
        } catch {
          // ignore
        }
        if (onError) onError(err);
      }
    );
  } catch {
    return () => {};
  }
}
