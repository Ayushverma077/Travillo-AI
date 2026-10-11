import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserTravelPreferences, IndiaTravelStyle, BudgetTier, TravelerType } from '../types';
import { useAuth } from './AuthContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

const DEFAULT_PREFERENCES: UserTravelPreferences = {
  homeCity: 'Delhi NCR',
  preferredStyles: ['Mountains', 'Nature', 'Heritage', 'Food'],
  budgetLevel: 'Moderate',
  dietPreference: 'Vegetarian',
  travelPace: 'Balanced',
  travelerGroup: 'Couple',
  monsoonAware: true,
};

interface PreferencesContextType {
  preferences: UserTravelPreferences;
  updatePreferences: (newPrefs: Partial<UserTravelPreferences>) => Promise<void>;
  isPreferenceModalOpen: boolean;
  openPreferenceModal: () => void;
  closePreferenceModal: () => void;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export const PreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserTravelPreferences>(() => {
    try {
      const stored = localStorage.getItem('travillo_user_preferences');
      if (stored) {
        return { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn('Failed to parse local preferences', e);
    }
    return DEFAULT_PREFERENCES;
  });

  const [isPreferenceModalOpen, setIsPreferenceModalOpen] = useState(false);

  // Sync from Firestore when user logs in
  useEffect(() => {
    if (!user) return;
    const uid = user.uid;

    let isMounted = true;
    async function loadCloudPrefs() {
      try {
        const prefRef = doc(db, 'users', uid, 'settings', 'preferences');
        const snap = await getDoc(prefRef);
        if (snap.exists() && isMounted) {
          const cloudData = snap.data() as UserTravelPreferences;
          setPreferences(prev => ({ ...prev, ...cloudData }));
          localStorage.setItem('travillo_user_preferences', JSON.stringify({ ...preferences, ...cloudData }));
        }
      } catch (err) {
        console.warn('Could not fetch cloud preferences:', err);
      }
    }

    loadCloudPrefs();
    return () => { isMounted = false; };
  }, [user]);

  const updatePreferences = async (newPrefs: Partial<UserTravelPreferences>) => {
    const updated = { ...preferences, ...newPrefs };
    setPreferences(updated);
    try {
      localStorage.setItem('travillo_user_preferences', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }

    if (user) {
      try {
        const prefRef = doc(db, 'users', user.uid, 'settings', 'preferences');
        await setDoc(prefRef, updated, { merge: true });
      } catch (err) {
        console.error('Error saving preferences to Firestore:', err);
      }
    }
  };

  return (
    <PreferencesContext.Provider
      value={{
        preferences,
        updatePreferences,
        isPreferenceModalOpen,
        openPreferenceModal: () => setIsPreferenceModalOpen(true),
        closePreferenceModal: () => setIsPreferenceModalOpen(false),
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
};

export const usePreferences = () => {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
};
