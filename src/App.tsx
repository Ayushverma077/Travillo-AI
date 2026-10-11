import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { PreferencesProvider, usePreferences } from './context/PreferencesContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/layout/Navbar';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/home/Hero';
import { TrendingDestinations } from './components/home/TrendingDestinations';
import { HomeSections } from './components/home/HomeSections';
import { DiscoverView } from './components/destinations/DiscoverView';
import { DestinationDetailModal } from './components/destinations/DestinationDetailModal';
import { AIPlannerView } from './components/planner/AIPlannerView';
import { MyTripsView } from './components/trips/MyTripsView';
import { FavoritesView } from './components/favorites/FavoritesView';
import { AuthModal } from './components/auth/AuthModal';
import { ProfileModal } from './components/profile/ProfileModal';
import { TravelTasteModal } from './components/profile/TravelTasteModal';
import { AICopilotWidget } from './components/copilot/AICopilotWidget';
import { AboutModal, PrivacyModal, TermsModal } from './components/common/Modals';
import { ToastNotification } from './components/common/ToastNotification';
import { DESTINATIONS } from './data/destinations';
import { Destination, TravelStyle, SavedTrip, Itinerary } from './types';
import { subscribeUserTrips } from './lib/firestoreService';

function MainApp() {
  const { user, pendingAction, clearPendingAction } = useAuth();
  const { openPreferenceModal } = usePreferences();
  const [currentTab, setCurrentTab] = useState<'home' | 'discover' | 'planner' | 'trips' | 'favorites'>('home');
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [styleFilter, setStyleFilter] = useState<TravelStyle | null>(null);

  // Pre-fill states for AI planner
  const [plannerDestination, setPlannerDestination] = useState<string>('');
  const [plannerTravelers, setPlannerTravelers] = useState<number>(2);
  const [plannerDuration, setPlannerDuration] = useState<number>(4);
  const [activeItinerary, setActiveItinerary] = useState<Itinerary | null>(null);

  // Saved trips synced from Firestore
  const [savedTrips, setSavedTrips] = useState<SavedTrip[]>([]);

  // Modals state
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [termsModalOpen, setTermsModalOpen] = useState(false);

  // Sync user saved trips when logged in
  useEffect(() => {
    if (!user) {
      setSavedTrips([]);
      return;
    }

    const unsubscribe = subscribeUserTrips(
      user.uid,
      (trips) => {
        setSavedTrips(trips);
      },
      (err) => {
        console.error("Trips subscription error:", err);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Scroll to top on tab change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentTab]);

  // Handle pending action navigation or modal triggers after successful authentication
  useEffect(() => {
    if (!user || !pendingAction) return;

    if (pendingAction.type === 'navigate' && pendingAction.payload) {
      const targetTab = pendingAction.payload;
      clearPendingAction();
      if (targetTab === 'discover') setStyleFilter(null);
      setCurrentTab(targetTab);
    } else if (pendingAction.type === 'open_profile') {
      clearPendingAction();
      setProfileModalOpen(true);
    } else if (pendingAction.type === 'open_taste_profile') {
      clearPendingAction();
      openPreferenceModal();
    }
  }, [user, pendingAction, openPreferenceModal, clearPendingAction]);

  const handlePlanTripFromCard = (dest: Destination) => {
    setPlannerDestination(dest.name);
    setPlannerDuration(dest.idealDays || 4);
    setActiveItinerary(null);
    setCurrentTab('planner');
    if (selectedDestination) {
      setSelectedDestination(null);
    }
  };

  const handlePlanTripFromHero = (destName?: string, travelers?: number) => {
    if (destName) {
      setPlannerDestination(destName);
    }
    if (travelers) {
      setPlannerTravelers(travelers);
    }
    setActiveItinerary(null);
    setCurrentTab('planner');
  };

  const handleSelectStyle = (style: TravelStyle) => {
    setStyleFilter(style);
    setCurrentTab('discover');
  };

  const handleReplanTrip = (trip: SavedTrip) => {
    setPlannerDestination(trip.destination);
    setPlannerDuration(trip.duration);
    setPlannerTravelers(trip.travelers);
    setActiveItinerary(trip.itinerary);
    setCurrentTab('planner');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#090D16] text-slate-900 dark:text-slate-100 selection:bg-violet-600 selection:text-white transition-colors duration-200">
      {/* Global Navigation */}
      <Navbar
        currentTab={currentTab}
        onNavigate={(tab) => {
          if (tab === 'discover') setStyleFilter(null);
          setCurrentTab(tab);
        }}
        savedTripsCount={savedTrips.length}
        onOpenProfile={() => setProfileModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16 md:pb-0">
        {currentTab === 'home' && (
          <div>
            <Hero
              onPlanTrip={handlePlanTripFromHero}
              onExplore={() => {
                setStyleFilter(null);
                setCurrentTab('discover');
              }}
              onSelectDestination={(destName) => {
                const found = DESTINATIONS.find(d => d.name.toLowerCase().includes(destName.toLowerCase()));
                if (found) {
                  setSelectedDestination(found);
                } else {
                  setPlannerDestination(destName);
                  setActiveItinerary(null);
                  setCurrentTab('planner');
                }
              }}
            />

            <TrendingDestinations
              destinations={DESTINATIONS}
              onSelectDestination={(dest) => setSelectedDestination(dest)}
              onPlanTrip={handlePlanTripFromCard}
              onViewAll={() => {
                setStyleFilter(null);
                setCurrentTab('discover');
              }}
            />

            <HomeSections
              destinations={DESTINATIONS}
              onSelectDestination={(dest) => setSelectedDestination(dest)}
              onPlanTrip={handlePlanTripFromCard}
              onNavigateToStyle={(st) => handleSelectStyle(st as TravelStyle)}
              onNavigateToDiscover={() => {
                setStyleFilter(null);
                setCurrentTab('discover');
              }}
              onStartPlanning={() => {
                setActiveItinerary(null);
                setCurrentTab('planner');
              }}
            />
          </div>
        )}

        {currentTab === 'discover' && (
          <DiscoverView
            destinations={DESTINATIONS}
            onSelectDestination={(dest) => setSelectedDestination(dest)}
            onPlanTrip={handlePlanTripFromCard}
            initialStyleFilter={styleFilter}
          />
        )}

        {currentTab === 'planner' && (
          <AIPlannerView
            initialDestination={plannerDestination}
            initialTravelers={plannerTravelers}
            initialDuration={plannerDuration}
            activeItinerary={activeItinerary}
            onActiveItineraryChange={(it) => setActiveItinerary(it)}
            onTripSavedSuccess={(trip) => {
              setSavedTrips(prev => [trip, ...prev.filter(t => t.id !== trip.id)]);
            }}
          />
        )}

        {currentTab === 'trips' && (
          <MyTripsView
            trips={savedTrips}
            onPlanFirstTrip={() => {
              setActiveItinerary(null);
              setCurrentTab('planner');
            }}
            onTripDeleted={(tripId) => {
              setSavedTrips(prev => prev.filter(t => t.id !== tripId));
            }}
            onReplanTrip={handleReplanTrip}
          />
        )}

        {currentTab === 'favorites' && (
          <FavoritesView
            destinations={DESTINATIONS}
            onSelectDestination={(dest) => setSelectedDestination(dest)}
            onPlanTrip={handlePlanTripFromCard}
            onExplore={() => {
              setStyleFilter(null);
              setCurrentTab('discover');
            }}
          />
        )}
      </main>

      {/* Global Footer */}
      <Footer
        onNavigate={(tab) => {
          if (tab === 'discover') setStyleFilter(null);
          setCurrentTab(tab);
        }}
        onOpenAbout={() => setAboutModalOpen(true)}
        onOpenPrivacy={() => setPrivacyModalOpen(true)}
        onOpenTerms={() => setTermsModalOpen(true)}
      />

      {/* Floating AI Travel Copilot Widget */}
      <AICopilotWidget
        activeItinerary={activeItinerary}
        currentDestinationName={plannerDestination || selectedDestination?.name}
        onApplyModifiedItinerary={(updated) => {
          setActiveItinerary(updated);
          setCurrentTab('planner');
        }}
        onTriggerPlan={(dest, days, budget) => {
          setPlannerDestination(dest);
          setPlannerDuration(days);
          setActiveItinerary(null);
          setCurrentTab('planner');
        }}
        onSelectDestination={(destName) => {
          const found = DESTINATIONS.find(d => d.name.toLowerCase().includes(destName.toLowerCase()));
          if (found) {
            setSelectedDestination(found);
          } else {
            setPlannerDestination(destName);
            setActiveItinerary(null);
            setCurrentTab('planner');
          }
        }}
      />

      {/* Responsive Mobile Bottom Navigation */}
      <MobileBottomNav
        currentTab={currentTab}
        onNavigate={(tab) => {
          if (tab === 'discover') setStyleFilter(null);
          setCurrentTab(tab);
        }}
        onOpenProfile={() => setProfileModalOpen(true)}
        savedTripsCount={savedTrips.length}
      />

      {/* Destination Detail Modal */}
      <DestinationDetailModal
        destination={selectedDestination}
        onClose={() => setSelectedDestination(null)}
        onPlanTrip={handlePlanTripFromCard}
      />

      {/* Auth Modal & Global Toasts */}
      <AuthModal />
      <ToastNotification />

      {/* User Profile Modal */}
      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        savedTrips={savedTrips}
        onNavigateTrips={() => setCurrentTab('trips')}
        onNavigateFavorites={() => setCurrentTab('favorites')}
      />

      {/* Travel Taste DNA Profile Modal */}
      <TravelTasteModal />

      {/* Informational Modals */}
      <AboutModal isOpen={aboutModalOpen} onClose={() => setAboutModalOpen(false)} />
      <PrivacyModal isOpen={privacyModalOpen} onClose={() => setPrivacyModalOpen(false)} />
      <TermsModal isOpen={termsModalOpen} onClose={() => setTermsModalOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <FavoritesProvider>
          <PreferencesProvider>
            <MainApp />
          </PreferencesProvider>
        </FavoritesProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
