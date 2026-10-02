import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/home/Hero';
import { TrendingDestinations } from './components/home/TrendingDestinations';
import { TravelStyles } from './components/home/TravelStyles';
import { AIPreview } from './components/home/AIPreview';
import { WhyTravillo } from './components/home/WhyTravillo';
import { HowItWorks } from './components/home/HowItWorks';
import { FinalCTA } from './components/home/FinalCTA';
import { DiscoverView } from './components/destinations/DiscoverView';
import { DestinationDetailModal } from './components/destinations/DestinationDetailModal';
import { AIPlannerView } from './components/planner/AIPlannerView';
import { MyTripsView } from './components/trips/MyTripsView';
import { FavoritesView } from './components/favorites/FavoritesView';
import { AuthModal } from './components/auth/AuthModal';
import { ProfileModal } from './components/profile/ProfileModal';
import { AboutModal, PrivacyModal, TermsModal } from './components/common/Modals';
import { DESTINATIONS } from './data/destinations';
import { Destination, TravelStyle, SavedTrip } from './types';
import { subscribeUserTrips } from './lib/firestoreService';

function MainApp() {
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState<'home' | 'discover' | 'planner' | 'trips' | 'favorites'>('home');
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [styleFilter, setStyleFilter] = useState<TravelStyle | null>(null);

  // Pre-fill states for AI planner
  const [plannerDestination, setPlannerDestination] = useState<string>('');
  const [plannerTravelers, setPlannerTravelers] = useState<number>(2);
  const [plannerDuration, setPlannerDuration] = useState<number>(4);

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

  const handlePlanTripFromCard = (dest: Destination) => {
    setPlannerDestination(dest.name);
    setPlannerDuration(dest.idealDays || 4);
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
    setCurrentTab('planner');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F5F0] text-[#171717] selection:bg-[#12372A] selection:text-white">
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
      <main className="flex-1">
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

            <TravelStyles onSelectStyle={handleSelectStyle} />

            <AIPreview onStartPlanning={() => setCurrentTab('planner')} />

            <WhyTravillo />

            <HowItWorks />

            <FinalCTA
              onPlanTrip={() => setCurrentTab('planner')}
              onExplore={() => {
                setStyleFilter(null);
                setCurrentTab('discover');
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
            onTripSavedSuccess={(trip) => {
              setSavedTrips(prev => [trip, ...prev.filter(t => t.id !== trip.id)]);
            }}
          />
        )}

        {currentTab === 'trips' && (
          <MyTripsView
            trips={savedTrips}
            onPlanFirstTrip={() => setCurrentTab('planner')}
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

      {/* Destination Detail Modal */}
      <DestinationDetailModal
        destination={selectedDestination}
        onClose={() => setSelectedDestination(null)}
        onPlanTrip={handlePlanTripFromCard}
      />

      {/* Auth Modal */}
      <AuthModal />

      {/* User Profile Modal */}
      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        savedTrips={savedTrips}
        onNavigateTrips={() => setCurrentTab('trips')}
        onNavigateFavorites={() => setCurrentTab('favorites')}
      />

      {/* Informational Modals */}
      <AboutModal isOpen={aboutModalOpen} onClose={() => setAboutModalOpen(false)} />
      <PrivacyModal isOpen={privacyModalOpen} onClose={() => setPrivacyModalOpen(false)} />
      <TermsModal isOpen={termsModalOpen} onClose={() => setTermsModalOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <MainApp />
      </FavoritesProvider>
    </AuthProvider>
  );
}
