import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
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

export type PendingAction = 
  | { type: 'save_trip'; payload: { itinerary: any; formData?: any } }
  | { type: 'save_favorite'; payload: any }
  | { type: 'navigate'; payload: 'home' | 'discover' | 'planner' | 'trips' | 'favorites' }
  | { type: 'open_taste_profile' }
  | { type: 'open_profile' };

export interface AuthModalOptions {
  title?: string;
  subtitle?: string;
  pendingAction?: PendingAction;
}

export interface ToastNotification {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'error';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<User | null>;
  signInWithEmail: (email: string, pass: string) => Promise<User | null>;
  signUpWithEmail: (email: string, pass: string, name: string) => Promise<User | null>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  openAuthModal: (mode?: 'signin' | 'signup', options?: AuthModalOptions) => void;
  closeAuthModal: () => void;
  authModalOpen: boolean;
  authModalMode: 'signin' | 'signup';
  setAuthModalMode: (mode: 'signin' | 'signup') => void;
  modalTitle?: string;
  modalSubtitle?: string;
  pendingAction: PendingAction | null;
  setPendingAction: (action: PendingAction | null) => void;
  clearPendingAction: () => void;
  authError: AuthErrorState | null;
  clearAuthError: () => void;
  toast: ToastNotification | null;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  dismissToast: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');
  const [modalTitle, setModalTitle] = useState<string | undefined>(undefined);
  const [modalSubtitle, setModalSubtitle] = useState<string | undefined>(undefined);
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(() => {
    try {
      const stored = sessionStorage.getItem('travillo_pending_action');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [authError, setAuthError] = useState<AuthErrorState | null>(null);
  const [toast, setToast] = useState<ToastNotification | null>(null);

  // Sync pending action to sessionStorage
  const handleSetPendingAction = (action: PendingAction | null) => {
    setPendingAction(action);
    try {
      if (action) {
        sessionStorage.setItem('travillo_pending_action', JSON.stringify(action));
      } else {
        sessionStorage.removeItem('travillo_pending_action');
      }
    } catch (e) {
      console.warn('sessionStorage error', e);
    }
  };

  const clearPendingAction = () => {
    handleSetPendingAction(null);
  };

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({
      id: `toast_${Date.now()}`,
      message,
      type
    });
  };

  const dismissToast = () => {
    setToast(null);
  };

  // Auto-dismiss toast
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast]);

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
        message: 'Firebase Authentication requires the Identity Toolkit API to be enabled on your Firebase project.',
        helpLink: 'https://console.firebase.google.com/project/travillo-ai/authentication'
      };
    }

    if (rawMessage.includes('email-already-in-use') || rawMessage.includes('auth/email-already-in-use')) {
      return {
        code: 'email-already-in-use',
        message: 'This email is already registered. Please sign in or use another email.'
      };
    }

    if (
      rawMessage.includes('wrong-password') || 
      rawMessage.includes('invalid-credential') || 
      rawMessage.includes('user-not-found') ||
      rawMessage.includes('auth/invalid-credential') ||
      rawMessage.includes('auth/wrong-password') ||
      rawMessage.includes('auth/user-not-found')
    ) {
      return {
        code: 'invalid-credentials',
        message: 'Invalid email or password. Please verify your credentials and try again.'
      };
    }

    if (rawMessage.includes('weak-password') || rawMessage.includes('auth/weak-password')) {
      return {
        code: 'weak-password',
        message: 'Password is too weak. Please use at least 6 characters.'
      };
    }

    if (rawMessage.includes('invalid-email') || rawMessage.includes('auth/invalid-email')) {
      return {
        code: 'invalid-email',
        message: 'Please enter a valid email address.'
      };
    }

    if (rawMessage.includes('popup-closed-by-user') || rawMessage.includes('auth/popup-closed-by-user')) {
      return {
        code: 'popup-closed',
        message: 'Google Sign-In popup was closed before completion. Please try again.'
      };
    }

    if (rawMessage.includes('popup-blocked') || rawMessage.includes('auth/popup-blocked')) {
      return {
        code: 'popup-blocked',
        message: 'Pop-up was blocked by browser. Please allow popups for Google Sign-In.'
      };
    }

    if (rawMessage.includes('network-request-failed') || rawMessage.includes('auth/network-request-failed')) {
      return {
        code: 'network-error',
        message: 'Network error. Please check your internet connection and try again.'
      };
    }

    if (rawMessage.includes('too-many-requests') || rawMessage.includes('auth/too-many-requests')) {
      return {
        code: 'too-many-requests',
        message: 'Too many attempts. Please wait a few moments or reset your password.'
      };
    }

    return {
      code: 'auth-error',
      message: rawMessage.replace(/^Firebase:\s*/, '')
    };
  };

  const signInWithGoogle = async (): Promise<User | null> => {
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
      return result.user;
    } catch (err: unknown) {
      const formatted = formatFirebaseError(err);
      setAuthError(formatted);
      console.error("Google sign-in error:", err);
      throw err;
    }
  };

  const signInWithEmail = async (email: string, pass: string): Promise<User | null> => {
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
      return result.user;
    } catch (err: unknown) {
      const formatted = formatFirebaseError(err);
      setAuthError(formatted);
      console.error("Email sign-in error:", err);
      throw err;
    }
  };

  const signUpWithEmail = async (email: string, pass: string, name: string): Promise<User | null> => {
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
      return result.user;
    } catch (err: unknown) {
      const formatted = formatFirebaseError(err);
      setAuthError(formatted);
      console.error("Email sign-up error:", err);
      throw err;
    }
  };

  const resetPassword = async (email: string) => {
    setAuthError(null);
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err: unknown) {
      const formatted = formatFirebaseError(err);
      setAuthError(formatted);
      console.error("Password reset error:", err);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setAuthError(null);
      showToast('Signed out successfully', 'info');
    } catch (err) {
      console.error("Logout error:", err);
      throw err;
    }
  };

  const openAuthModal = (mode: 'signin' | 'signup' = 'signin', options?: AuthModalOptions) => {
    setAuthModalMode(mode);
    setModalTitle(options?.title);
    setModalSubtitle(options?.subtitle);
    if (options?.pendingAction) {
      handleSetPendingAction(options.pendingAction);
    }
    setAuthError(null);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
    setModalTitle(undefined);
    setModalSubtitle(undefined);
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
        resetPassword,
        logout,
        openAuthModal,
        closeAuthModal,
        authModalOpen,
        authModalMode,
        setAuthModalMode,
        modalTitle,
        modalSubtitle,
        pendingAction,
        setPendingAction: handleSetPendingAction,
        clearPendingAction,
        authError,
        clearAuthError,
        toast,
        showToast,
        dismissToast
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
