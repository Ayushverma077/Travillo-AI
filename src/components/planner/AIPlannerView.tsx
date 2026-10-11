import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  MapPin, 
  Navigation, 
  Calendar, 
  Users, 
  DollarSign, 
  Compass, 
  AlertCircle,
  Car,
  Home,
  Check,
  ArrowRight,
  ArrowLeft,
  Flame,
  Star,
  Zap,
  RotateCcw
} from 'lucide-react';
import { 
  PlannerInput, 
  Itinerary, 
  SavedTrip, 
  BudgetTier, 
  TravelerType 
} from '../../types';
import { ItineraryView } from './ItineraryView';
import { useAuth } from '../../context/AuthContext';
import { saveTripToFirestore } from '../../lib/firestoreService';
import { usePreferences } from '../../context/PreferencesContext';

interface AIPlannerViewProps {
  initialDestination?: string;
  initialTravelers?: number;
  initialDuration?: number;
  initialBudget?: BudgetTier;
  onTripSavedSuccess?: (savedTrip: SavedTrip) => void;
  activeItinerary?: Itinerary | null;
  onActiveItineraryChange?: (itinerary: Itinerary | null) => void;
}

export const AIPlannerView: React.FC<AIPlannerViewProps> = ({
  initialDestination = '',
  initialTravelers = 2,
  initialDuration = 4,
  initialBudget,
  onTripSavedSuccess,
  activeItinerary = null,
  onActiveItineraryChange
}) => {
  const { user, pendingAction, clearPendingAction, showToast } = useAuth();
  const { preferences } = usePreferences();

  // Step state: 1 to 7
  const [currentStep, setCurrentStep] = useState<number>(1);

  const [formData, setFormData] = useState<PlannerInput>({
    destination: initialDestination,
    startingLocation: preferences.homeCity || 'Delhi',
    duration: initialDuration,
    approximateDates: 'Upcoming Season',
    budget: initialBudget || preferences.budgetLevel || 'Moderate',
    currency: 'INR',
    travelers: initialTravelers,
    travelerType: preferences.travelerGroup || 'Couple',
    interests: preferences.preferredStyles.length > 0 ? preferences.preferredStyles.slice(0, 4) : ['Heritage', 'Nature', 'Food'],
    travelStyle: 'Balanced',
    transportPreference: 'Train',
    accommodationPreference: 'Hotel',
    notes: preferences.dietPreference !== 'All' ? `Diet: ${preferences.dietPreference}` : ''
  });

  const [loading, setLoading] = useState(false);
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [generatedItinerary, setGeneratedItinerary] = useState<Itinerary | null>(activeItinerary);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (activeItinerary) {
      setGeneratedItinerary(activeItinerary);
    }
  }, [activeItinerary]);

  useEffect(() => {
    if (onActiveItineraryChange) {
      onActiveItineraryChange(generatedItinerary);
    }
  }, [generatedItinerary, onActiveItineraryChange]);

  useEffect(() => {
    if (initialDestination) {
      setFormData(prev => ({
        ...prev,
        destination: initialDestination,
        duration: initialDuration || prev.duration,
        travelers: initialTravelers || prev.travelers,
        budget: initialBudget || prev.budget
      }));
      setGeneratedItinerary(null);
      setIsSaved(false);
      setError(null);
    }
  }, [initialDestination, initialTravelers, initialDuration, initialBudget]);

  const loadingSteps = [
    'Consulting Gemini India travel reasoning...',
    'Analyzing rail corridors, Vande Bharat & highway routes...',
    'Curating regional thalis, street food & signature cuisine...',
    'Estimating realistic budgets in Indian Rupees (₹)...',
    'Synthesizing temple etiquette & weather adaptations...'
  ];

  useEffect(() => {
    let interval: any;
    if (loading) {
      interval = setInterval(() => {
        setLoadingStepIndex(prev => (prev + 1) % loadingSteps.length);
      }, 2400);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const interestOptions = [
    'Mountains', 'Beaches', 'Adventure', 'Heritage', 'Spiritual', 
    'Wildlife', 'Nature', 'Food', 'Honeymoon', 'Weekend Getaway', 'Backpacking'
  ];

  const toggleInterest = (interest: string) => {
    setFormData(prev => {
      const exists = prev.interests.includes(interest);
      if (exists) {
        return { ...prev, interests: prev.interests.filter(i => i !== interest) };
      } else {
        return { ...prev, interests: [...prev.interests, interest] };
      }
    });
  };

  const handleGenerate = async () => {
    setError(null);
    if (!formData.destination.trim()) {
      setError('Please specify a destination.');
      setCurrentStep(1);
      return;
    }

    setLoading(true);
    setIsSaved(false);

    try {
      const res = await fetch('/api/plan-trip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error('Failed to generate trip itinerary.');

      const data: Itinerary = await res.json();
      setGeneratedItinerary(data);
    } catch (err: unknown) {
      console.error(err);
      setError('Failed to generate your personalized itinerary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Auto-complete pending save_trip action after successful authentication
  useEffect(() => {
    if (!user || !pendingAction) return;

    if (pendingAction.type === 'save_trip') {
      const targetItinerary = pendingAction.payload?.itinerary || generatedItinerary || activeItinerary;
      if (!targetItinerary) return;

      clearPendingAction();
      setIsSaving(true);

      const tripId = `trip_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const savedTrip: SavedTrip = {
        id: tripId,
        userId: user.uid,
        title: targetItinerary.tripTitle,
        destination: targetItinerary.destination,
        startingLocation: formData.startingLocation || targetItinerary.startingCity || 'Delhi',
        duration: targetItinerary.duration,
        approximateDates: formData.approximateDates,
        budget: formData.budget,
        currency: formData.currency || 'INR',
        travelers: targetItinerary.travelers || 2,
        interests: formData.interests,
        travelStyle: formData.travelStyle,
        transportPreference: formData.transportPreference,
        accommodationPreference: formData.accommodationPreference,
        notes: formData.notes,
        itinerary: targetItinerary,
        estimatedCost: targetItinerary.estimatedTotalBudget,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      saveTripToFirestore(user.uid, savedTrip)
        .then(() => {
          setIsSaved(true);
          if (onTripSavedSuccess) {
            onTripSavedSuccess(savedTrip);
          }
          showToast('Trip saved successfully ✓', 'success');
        })
        .catch((e) => {
          console.error('Error auto-saving trip after login:', e);
          setError('Could not save trip to Firestore. Please check permissions.');
        })
        .finally(() => {
          setIsSaving(false);
        });
    }
  }, [user, pendingAction, generatedItinerary, activeItinerary]);

  const handleSaveTrip = async () => {
    if (!user || !generatedItinerary) return;

    setIsSaving(true);
    try {
      const tripId = `trip_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const savedTrip: SavedTrip = {
        id: tripId,
        userId: user.uid,
        title: generatedItinerary.tripTitle,
        destination: generatedItinerary.destination,
        startingLocation: formData.startingLocation,
        duration: generatedItinerary.duration,
        approximateDates: formData.approximateDates,
        budget: formData.budget,
        currency: formData.currency || 'INR',
        travelers: generatedItinerary.travelers,
        interests: formData.interests,
        travelStyle: formData.travelStyle,
        transportPreference: formData.transportPreference,
        accommodationPreference: formData.accommodationPreference,
        notes: formData.notes,
        itinerary: generatedItinerary,
        estimatedCost: generatedItinerary.estimatedTotalBudget,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await saveTripToFirestore(user.uid, savedTrip);
      setIsSaved(true);
      if (onTripSavedSuccess) {
        onTripSavedSuccess(savedTrip);
      }
      showToast('Trip saved successfully ✓', 'success');
    } catch (e) {
      console.error('Error saving trip to Firestore:', e);
      setError('Could not save trip to Firestore. Please verify permissions.');
    } finally {
      setIsSaving(false);
    }
  };

  const stepsList = [
    { num: 1, title: 'Destination' },
    { num: 2, title: 'From' },
    { num: 3, title: 'Dates & Days' },
    { num: 4, title: 'Travelers' },
    { num: 5, title: 'Budget' },
    { num: 6, title: 'Vibe' },
    { num: 7, title: 'Interests' },
    { num: 8, title: 'Generate' }
  ];

  return (
    <div className="py-12 bg-slate-50 dark:bg-[#090D16] min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Loading Animated State */}
        {loading && (
          <div className="bg-white dark:bg-[#0F172A] rounded-3xl p-10 sm:p-14 text-center border border-slate-200 dark:border-slate-800 shadow-2xl max-w-xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-200 my-12">
            <div className="relative inline-flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-500/10 via-violet-500/10 to-pink-500/10 border-2 border-violet-500/30 flex items-center justify-center">
                <Compass className="w-10 h-10 text-violet-600 dark:text-violet-400 animate-spin" />
              </div>
              <Sparkles className="w-6 h-6 text-pink-500 absolute -top-1 -right-1 animate-bounce" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-sans">
                Crafting Your Journey
              </h3>
              <p className="text-sm text-violet-600 dark:text-violet-400 font-semibold h-10 transition-all duration-300">
                {loadingSteps[loadingStepIndex]}
              </p>
            </div>

            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-600 via-violet-600 to-pink-500 rounded-full animate-pulse w-3/4" />
            </div>
            <p className="text-xs text-slate-400">Powered by Gemini 3.8 Flash</p>
          </div>
        )}

        {/* ================= STEP-BY-STEP PLANNER FLOW ================= */}
        {!loading && !generatedItinerary && (
          <div className="space-y-8">
            
            {/* Planner Header */}
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 text-xs font-bold border border-violet-500/20">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Smart AI Trip Architect</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight font-sans">
                Build your bespoke <span className="ai-gradient-text">Indian Odyssey ✦</span>
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                8 quick steps to generate day-wise routes, food recommendations, and budget calibrations.
              </p>
            </div>

            {/* Animated Step Progress Bar */}
            <div className="bg-white dark:bg-[#0F172A] rounded-2xl p-4 shadow-sm border border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">
                <span>Step {currentStep} of {stepsList.length}: {stepsList[currentStep - 1].title}</span>
                <span className="text-violet-600 dark:text-violet-400">{Math.round((currentStep / stepsList.length) * 100)}% Complete</span>
              </div>
              
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-600 via-violet-600 to-pink-500 transition-all duration-300 rounded-full"
                  style={{ width: `${(currentStep / stepsList.length) * 100}%` }}
                />
              </div>

              {/* Step dots */}
              <div className="hidden sm:flex items-center justify-between mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px]">
                {stepsList.map((s) => (
                  <button
                    key={s.num}
                    onClick={() => setCurrentStep(s.num)}
                    className={`font-semibold cursor-pointer transition-colors ${
                      currentStep === s.num
                        ? 'text-violet-600 dark:text-violet-400 font-bold'
                        : currentStep > s.num
                        ? 'text-slate-800 dark:text-slate-200'
                        : 'text-slate-400 dark:text-slate-600'
                    }`}
                  >
                    {s.num}. {s.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Step Card Container */}
            <div className="bg-white dark:bg-[#0F172A] rounded-3xl p-6 sm:p-10 shadow-lg border border-slate-200/80 dark:border-slate-800 space-y-8">
              
              {/* STEP 1: Destination */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">Step 1</span>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Where do you want to travel?</h3>
                    <p className="text-xs text-slate-500">Pick any city, hill station, coastal town, or circuit in India.</p>
                  </div>

                  <div className="relative">
                    <MapPin className="w-5 h-5 text-violet-500 absolute left-4 top-3.5" />
                    <input
                      type="text"
                      value={formData.destination}
                      onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                      placeholder="e.g. Manali, Spiti Valley, Munnar, Goa, Udaipur..."
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-base text-slate-900 dark:text-white placeholder:text-slate-400 font-semibold focus:outline-hidden focus:ring-2 focus:ring-violet-500"
                      autoFocus
                    />
                  </div>

                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Popular In India</span>
                    <div className="flex flex-wrap gap-2">
                      {['Manali', 'Goa', 'Udaipur', 'Munnar', 'Rishikesh', 'Spiti Valley', 'Meghalaya', 'Varanasi'].map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => setFormData({ ...formData, destination: d })}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                            formData.destination === d
                              ? 'bg-violet-600 text-white border-violet-600 shadow-xs'
                              : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-violet-400'
                          }`}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: From (Origin) */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">Step 2</span>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Where are you starting from?</h3>
                    <p className="text-xs text-slate-500">Used for flight, train (Vande Bharat), and road transit routing.</p>
                  </div>

                  <div className="relative">
                    <Navigation className="w-5 h-5 text-violet-500 absolute left-4 top-3.5" />
                    <input
                      type="text"
                      value={formData.startingLocation}
                      onChange={(e) => setFormData({ ...formData, startingLocation: e.target.value })}
                      placeholder="e.g. Delhi, Mumbai, Bengaluru, Kolkata, Chennai..."
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-base text-slate-900 dark:text-white placeholder:text-slate-400 font-semibold focus:outline-hidden focus:ring-2 focus:ring-violet-500"
                    />
                  </div>

                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Major Origin Hubs</span>
                    <div className="flex flex-wrap gap-2">
                      {['Delhi NCR', 'Mumbai', 'Bengaluru', 'Kolkata', 'Chennai', 'Hyderabad', 'Pune', 'Ahmedabad'].map((hub) => (
                        <button
                          key={hub}
                          type="button"
                          onClick={() => setFormData({ ...formData, startingLocation: hub })}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                            formData.startingLocation === hub
                              ? 'bg-violet-600 text-white border-violet-600 shadow-xs'
                              : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-violet-400'
                          }`}
                        >
                          {hub}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Dates & Duration */}
              {currentStep === 3 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">Step 3</span>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">How many days is your journey?</h3>
                    <p className="text-xs text-slate-500">Pick ideal trip duration and approximate travel timing.</p>
                  </div>

                  {/* Duration Slider & Chips */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Trip Duration:</span>
                      <span className="text-lg font-extrabold text-violet-600 dark:text-violet-400 tabular-nums">
                        {formData.duration} Days
                      </span>
                    </div>

                    <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                      {[2, 3, 4, 5, 6, 7, 10].map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => setFormData({ ...formData, duration: d })}
                          className={`py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                            formData.duration === d
                              ? 'bg-violet-600 text-white border-violet-600 shadow-sm'
                              : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-violet-400'
                          }`}
                        >
                          {d} Days
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Season Timing */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Target Season</span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {['Upcoming Season', 'Winter (Nov–Feb)', 'Summer (Mar–Jun)', 'Monsoon (Jul–Sep)'].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setFormData({ ...formData, approximateDates: s })}
                          className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                            formData.approximateDates === s
                              ? 'bg-violet-600 text-white border-violet-600 shadow-xs'
                              : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Travelers */}
              {currentStep === 4 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">Step 4</span>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Who is traveling?</h3>
                    <p className="text-xs text-slate-500">Influences hotel room counts, activity intensity, and pacing.</p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { type: 'Solo', icon: '🎒', count: 1, desc: 'Individual explorer' },
                      { type: 'Couple', icon: '💕', count: 2, desc: 'Romantic getaway' },
                      { type: 'Friends', icon: '🍻', count: 4, desc: 'Group adventure' },
                      { type: 'Family', icon: '👨‍👩‍👧', count: 4, desc: 'All ages & comfort' }
                    ].map((item) => (
                      <button
                        key={item.type}
                        type="button"
                        onClick={() => setFormData({ ...formData, travelerType: item.type as TravelerType, travelers: item.count })}
                        className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                          formData.travelerType === item.type
                            ? 'bg-violet-50 dark:bg-violet-950/50 border-violet-500 shadow-md ring-1 ring-violet-500'
                            : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-violet-300'
                        }`}
                      >
                        <span className="text-2xl block mb-2">{item.icon}</span>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">{item.type}</h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Exact Traveler Count:</label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={formData.travelers}
                      onChange={(e) => setFormData({ ...formData, travelers: parseInt(e.target.value, 10) || 1 })}
                      className="w-20 px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-center text-sm font-bold"
                    />
                  </div>
                </div>
              )}

              {/* STEP 5: Budget */}
              {currentStep === 5 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">Step 5</span>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">What is your budget tier?</h3>
                    <p className="text-xs text-slate-500">Estimates stays, transit, meals, and entry tickets in Indian Rupees.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      { 
                        tier: 'Budget' as BudgetTier, 
                        label: 'Backpacker / Budget', 
                        est: '₹1,500 – ₹2,500 / day', 
                        details: 'Hostels, sleeper/3AC trains, street food & dhabas' 
                      },
                      { 
                        tier: 'Moderate' as BudgetTier, 
                        label: 'Balanced / Comfort', 
                        est: '₹3,500 – ₹6,000 / day', 
                        details: '3-star boutique hotels, AC cabs/flights, dine-in restaurants' 
                      },
                      { 
                        tier: 'Luxury' as BudgetTier, 
                        label: 'Premium / Luxury', 
                        est: '₹8,000+ / day', 
                        details: 'Heritage palaces, luxury resorts, private chauffeur' 
                      }
                    ].map((b) => (
                      <button
                        key={b.tier}
                        type="button"
                        onClick={() => setFormData({ ...formData, budget: b.tier })}
                        className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
                          formData.budget === b.tier
                            ? 'bg-violet-50 dark:bg-violet-950/50 border-violet-500 shadow-md ring-1 ring-violet-500'
                            : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-violet-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">{b.label}</h4>
                          {formData.budget === b.tier && <Check className="w-4 h-4 text-violet-600" />}
                        </div>
                        <span className="text-xs font-extrabold text-violet-600 dark:text-violet-400 block mb-2">{b.est}</span>
                        <p className="text-xs text-slate-500 leading-relaxed">{b.details}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 6: Travel Vibe & Pace */}
              {currentStep === 6 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">Step 6</span>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Choose your travel rhythm</h3>
                    <p className="text-xs text-slate-500">Sets the intensity of the day-wise itinerary schedule.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      { vibe: 'Relaxed', icon: '☕', desc: 'Slow mornings, 2-3 stops daily, plenty of cafe chill time' },
                      { vibe: 'Balanced', icon: '⚖️', desc: 'Optimal sightseeing, good lunch rests, scenic sunsets' },
                      { vibe: 'Fast-paced', icon: '⚡', desc: 'Pack as much in as possible, early starts, high energy' }
                    ].map((v) => (
                      <button
                        key={v.vibe}
                        type="button"
                        onClick={() => setFormData({ ...formData, travelStyle: v.vibe })}
                        className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
                          formData.travelStyle === v.vibe
                            ? 'bg-violet-50 dark:bg-violet-950/50 border-violet-500 shadow-md ring-1 ring-violet-500'
                            : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-violet-300'
                        }`}
                      >
                        <span className="text-2xl block mb-2">{v.icon}</span>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">{v.vibe}</h4>
                        <p className="text-xs text-slate-500 mt-1">{v.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 7: Interests & Food */}
              {currentStep === 7 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">Step 7</span>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">What experiences spark your interest?</h3>
                    <p className="text-xs text-slate-500">Select any themes you want highlighted in morning, afternoon, and evening slots.</p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
                    {interestOptions.map((opt) => {
                      const selected = formData.interests.includes(opt);
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => toggleInterest(opt)}
                          className={`py-3 px-3.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-between ${
                            selected
                              ? 'bg-gradient-to-r from-blue-600 via-violet-600 to-pink-500 text-white border-transparent shadow-xs'
                              : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-violet-400'
                          }`}
                        >
                          <span>{opt}</span>
                          {selected && <Check className="w-3.5 h-3.5" />}
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Dietary / Special Notes (Optional):
                    </label>
                    <input
                      type="text"
                      value={formData.notes || ''}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="e.g. Pure vegetarian only, Jain food, senior citizens, prefer scenic hikes..."
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400"
                    />
                  </div>
                </div>
              )}

              {/* STEP 8: Review & Generate */}
              {currentStep === 8 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">Step 8</span>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Review your journey blueprint</h3>
                    <p className="text-xs text-slate-500">Gemini will synthesize route waypoints, daily pacing, and budget estimates.</p>
                  </div>

                  {/* Summary Card */}
                  <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-500/10 via-violet-500/10 to-pink-500/10 border border-violet-500/20 space-y-3">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                      <div>
                        <span className="text-slate-400 block font-medium">Destination:</span>
                        <strong className="text-slate-900 dark:text-white text-sm">{formData.destination || 'India'}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-medium">Origin:</span>
                        <strong className="text-slate-900 dark:text-white text-sm">{formData.startingLocation}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-medium">Duration:</span>
                        <strong className="text-slate-900 dark:text-white text-sm">{formData.duration} Days</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-medium">Budget:</span>
                        <strong className="text-slate-900 dark:text-white text-sm">{formData.budget}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-medium">Travelers:</span>
                        <strong className="text-slate-900 dark:text-white text-sm">{formData.travelers} ({formData.travelerType})</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-medium">Pace:</span>
                        <strong className="text-slate-900 dark:text-white text-sm">{formData.travelStyle}</strong>
                      </div>
                      <div className="col-span-2">
                        <span className="text-slate-400 block font-medium">Interests:</span>
                        <strong className="text-slate-900 dark:text-white text-sm">{formData.interests.join(', ')}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={handleGenerate}
                      className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-violet-600 to-pink-500 hover:from-blue-700 hover:to-pink-600 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-violet-500/25 transition-all cursor-pointer flex items-center justify-center gap-2 mx-auto active:scale-95"
                    >
                      <Sparkles className="w-5 h-5 text-cyan-200" />
                      <span>Generate Itinerary with AI ✦</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Navigation Bar (Back & Next) */}
              <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(prev => prev - 1)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                ) : <div />}

                {currentStep < 8 ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (currentStep === 1 && !formData.destination.trim()) {
                        setError('Please specify a destination before continuing.');
                        return;
                      }
                      setError(null);
                      setCurrentStep(prev => prev + 1);
                    }}
                    className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : null}
              </div>

            </div>
          </div>
        )}

        {/* ================= GENERATED ITINERARY VIEW ================= */}
        {!loading && generatedItinerary && (
          <ItineraryView
            itinerary={generatedItinerary}
            onSaveTrip={handleSaveTrip}
            isSaving={isSaving}
            isSaved={isSaved}
            onReplan={() => setGeneratedItinerary(null)}
            onUpdateItinerary={(updated) => setGeneratedItinerary(updated)}
          />
        )}

      </div>
    </div>
  );
};
