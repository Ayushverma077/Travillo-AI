import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { FavoriteItem, Destination } from '../types';
import {
  subscribeUserFavorites,
  addFavoriteToFirestore,
  removeFavoriteFromFirestore
} from '../lib/firestoreService';

interface FavoritesContextType {
  favorites: FavoriteItem[];
  isFavorite: (destinationId: string) => boolean;
  toggleFavorite: (destination: Destination) => Promise<void>;
  loading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, openAuthModal } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeUserFavorites(
      user.uid,
      (favs) => {
        setFavorites(favs);
        setLoading(false);
      },
      (err) => {
        console.error("Favorites subscription error:", err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const isFavorite = (destinationId: string) => {
    return favorites.some((f) => f.destinationId === destinationId);
  };

  const toggleFavorite = async (destination: Destination) => {
    if (!user) {
      openAuthModal('signin');
      return;
    }

    const exists = isFavorite(destination.id);
    if (exists) {
      try {
        await removeFavoriteFromFirestore(user.uid, destination.id);
      } catch (e) {
        console.error("Error removing favorite:", e);
      }
    } else {
      const item: FavoriteItem = {
        destinationId: destination.id,
        userId: user.uid,
        destinationName: destination.name,
        destinationState: destination.state,
        destinationRegion: destination.region,
        destinationCountry: destination.country || 'India',
        heroImage: destination.heroImage,
        createdAt: new Date().toISOString()
      };
      try {
        await addFavoriteToFirestore(user.uid, item);
      } catch (e) {
        console.error("Error adding favorite:", e);
      }
    }
  };

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite, loading }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
