import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { syncUserProfile } from '../lib/firestoreService';

export interface AuthErrorState {
  code: string;
  message: string;
  helpLink?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  openAuthModal: (mode?: 'signin' | 'signup') => void;
  closeAuthModal: () => void;
  authModalOpen: boolean;
  authModalMode: 'signin' | 'signup';
  setAuthModalMode: (mode: 'signin' | 'signup') => void;
  authError: AuthErrorState | null;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');
  const [authError, setAuthError] = useState<AuthErrorState | null>(null);

  useEffect(() => {
    // Real Firebase Auth persistence listener
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          await syncUserProfile({
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL
          });
        } catch (e) {
          console.error("Profile sync error:", e);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const formatFirebaseError = (err: unknown): AuthErrorState => {
    const rawMessage = err instanceof Error ? err.message : String(err);
    
    if (rawMessage.includes('identity-toolkit-api-has-not-been-used') || rawMessage.includes('identitytoolkit.googleapis.com')) {
      return {
        code: 'identity-toolkit-api-disabled',
        message: 'Firebase Authentication requires the Identity Toolkit API to be enabled on Google Cloud project 626484178360.',
        helpLink: 'https://console.developers.google.com/apis/api/identitytoolkit.googleapis.com/overview?project=626484178360'
      };
    }

    if (rawMessage.includes('email-already-in-use')) {
      return {
        code: 'email-already-in-use',
        message: 'This email is already registered. Please sign in or use another email.'
      };
    }

    if (rawMessage.includes('wrong-password') || rawMessage.includes('invalid-credential') || rawMessage.includes('user-not-found')) {
      return {
        code: 'invalid-credentials',
        message: 'Invalid email or password. Please verify your credentials and try again.'
      };
    }

    if (rawMessage.includes('weak-password')) {
      return {
        code: 'weak-password',
        message: 'Password is too weak. Please use at least 6 characters including letters and numbers.'
      };
    }

    if (rawMessage.includes('invalid-email')) {
      return {
        code: 'invalid-email',
        message: 'Please enter a valid email address.'
      };
    }

    if (rawMessage.includes('popup-closed-by-user')) {
      return {
        code: 'popup-closed',
        message: 'Google Sign-In popup was closed before completion. Please try again.'
      };
    }

    if (rawMessage.includes('network-request-failed')) {
      return {
        code: 'network-error',
        message: 'Network error. Please check your internet connection and try again.'
      };
    }

    return {
      code: 'auth-error',
      message: rawMessage
    };
  };

  const signInWithGoogle = async () => {
    setAuthError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        await syncUserProfile({
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL
        });
      }
      setAuthModalOpen(false);
    } catch (err: unknown) {
      const formatted = formatFirebaseError(err);
      setAuthError(formatted);
      console.error("Google sign-in error:", err);
      throw err;
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    setAuthError(null);
    try {
      const result = await signInWithEmailAndPassword(auth, email, pass);
      if (result.user) {
        await syncUserProfile({
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL
        });
      }
      setAuthModalOpen(false);
    } catch (err: unknown) {
      const formatted = formatFirebaseError(err);
      setAuthError(formatted);
      console.error("Email sign-in error:", err);
      throw err;
    }
  };

  const signUpWithEmail = async (email: string, pass: string, name: string) => {
    setAuthError(null);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, pass);
      if (result.user) {
        if (name) {
          await updateProfile(result.user, { displayName: name });
        }
        await syncUserProfile({
          uid: result.user.uid,
          email: result.user.email,
          displayName: name || result.user.email?.split('@')[0] || 'Traveler',
          photoURL: null
        });
      }
      setAuthModalOpen(false);
    } catch (err: unknown) {
      const formatted = formatFirebaseError(err);
      setAuthError(formatted);
      console.error("Email sign-up error:", err);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setAuthError(null);
    } catch (err) {
      console.error("Logout error:", err);
      throw err;
    }
  };

  const openAuthModal = (mode: 'signin' | 'signup' = 'signin') => {
    setAuthModalMode(mode);
    setAuthError(null);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
    setAuthError(null);
  };

  const clearAuthError = () => {
    setAuthError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        logout,
        openAuthModal,
        closeAuthModal,
        authModalOpen,
        authModalMode,
        setAuthModalMode,
        authError,
        clearAuthError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
