import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  MapPin, 
  Navigation, 
  Calendar, 
  Users, 
  DollarSign, 
  Compass, 
  Loader2, 
  AlertCircle,
  Car,
  Home,
  FileText,
  Sliders,
  Check
} from 'lucide-react';
import { 
  PlannerInput, 
  Itinerary, 
  SavedTrip, 
  BudgetTier, 
  TravelerType, 
  TransportPreference, 
  AccommodationPreference 
} from '../../types';
import { ItineraryView } from './ItineraryView';
import { useAuth } from '../../context/AuthContext';
import { saveTripToFirestore } from '../../lib/firestoreService';

interface AIPlannerViewProps {
  initialDestination?: string;
  initialTravelers?: number;
  initialDuration?: number;
  onTripSavedSuccess?: (savedTrip: SavedTrip) => void;
}

export const AIPlannerView: React.FC<AIPlannerViewProps> = ({
  initialDestination = '',
  initialTravelers = 2,
  initialDuration = 4,
  onTripSavedSuccess
}) => {
  const { user } = useAuth();

  const [formData, setFormData] = useState<PlannerInput>({
    destination: initialDestination,
    startingLocation: 'Delhi',
    duration: initialDuration,
    approximateDates: 'Upcoming Season',
    budget: 'Moderate',
    currency: 'INR',
    travelers: initialTravelers,
    travelerType: 'Couple',
    interests: ['Heritage', 'Nature', 'Food'],
    travelStyle: 'Heritage & Nature',
    transportPreference: 'Train',
    accommodationPreference: 'Hotel',
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [generatedItinerary, setGeneratedItinerary] = useState<Itinerary | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Update if initial destination changed
  useEffect(() => {
    if (initialDestination) {
      setFormData(prev => ({
        ...prev,
        destination: initialDestination,
        duration: initialDuration || prev.duration,
        travelers: initialTravelers || prev.travelers
      }));
      setGeneratedItinerary(null);
      setIsSaved(false);
      setError(null);
    }
  }, [initialDestination, initialTravelers, initialDuration]);

  // Dynamic loading messages
  const loadingSteps = [
    'Consulting Gemini India travel reasoning...',
    'Analyzing rail corridors, Vande Bharat & flight routes...',
    'Curating regional thalis, street food & signature cuisine...',
    'Estimating realistic budgets in Indian Rupees (₹)...',
    'Synthesizing temple etiquette & local transit strategies...'
  ];

  useEffect(() => {
    let interval: any;
    if (loading) {
      interval = setInterval(() => {
        setLoadingStepIndex(prev => (prev + 1) % loadingSteps.length);
      }, 2500);
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

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.destination.trim()) {
      setError('Please provide a destination name.');
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

      if (!res.ok) {
        throw new Error('Failed to generate trip itinerary.');
      }

      const data: Itinerary = await res.json();
      setGeneratedItinerary(data);
    } catch (err: unknown) {
      console.error(err);
      setError('Failed to generate your personalized itinerary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
    } catch (e) {
      console.error('Error saving trip to Firestore:', e);
      setError('Could not save trip to Firestore. Please verify permissions.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="py-12 bg-[#FAF9F6] min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Planner Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>Gemini AI Travel Engine</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold font-serif-heading text-neutral-900 tracking-tight">
            Personalized Trip Planner
          </h1>
          <p className="text-sm text-neutral-500 mt-2">
            Provide your journey preferences below. Our AI reasons through logistics, daily pacing, and local gastronomy to generate a bespoke itinerary.
          </p>
        </div>

        {/* Loading Animated State */}
        {loading && (
          <div className="bg-white rounded-3xl p-12 text-center border border-neutral-200/80 shadow-xl max-w-xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="relative inline-flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-emerald-50 border-4 border-emerald-100 flex items-center justify-center">
                <Compass className="w-10 h-10 text-emerald-600 animate-spin" />
              </div>
              <Sparkles className="w-5 h-5 text-amber-500 absolute -top-1 -right-1 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold font-serif-heading text-neutral-900">
                Building your journey...
              </h3>
              <p className="text-xs text-emerald-800 font-semibold h-5 transition-all">
                {loadingSteps[loadingStepIndex]}
              </p>
              <p className="text-[11px] text-neutral-400">
                Please wait a moment while Gemini calculates the ideal route and budget for {formData.destination}.
              </p>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200/80 text-red-700 text-xs flex items-center gap-3 mb-6">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Show Form only when not showing generated itinerary OR user wants to replan */}
        {!loading && !generatedItinerary && (
          <form onSubmit={handleGenerate} className="bg-white rounded-3xl p-6 sm:p-10 border border-neutral-200/80 shadow-md space-y-8">
            {/* Step 1: Destination & Logistics */}
            <div>
              <h3 className="text-base font-bold font-serif-heading text-neutral-900 mb-4 pb-2 border-b border-neutral-100 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-700" />
                <span>1. Core Destination & Timing</span>
              </h3>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                    Target Destination <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={formData.destination}
                      onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                      placeholder="e.g. Kerala, Jaipur, Kyoto, Banff..."
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                    Departing City / Origin
                  </label>
                  <div className="relative">
                    <Navigation className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={formData.startingLocation}
                      onChange={(e) => setFormData({ ...formData, startingLocation: e.target.value })}
                      placeholder="e.g. Mumbai, New York, London, Delhi..."
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 font-medium"
                    />
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                {/* Duration Slider */}
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-neutral-700 mb-1.5">
                    <span>Trip Duration</span>
                    <span className="text-emerald-700 font-bold px-2 py-0.5 rounded-md bg-emerald-50">
                      {formData.duration} Days
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="14"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value, 10) })}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-neutral-400 mt-1">
                    <span>1 Day</span>
                    <span>7 Days</span>
                    <span>14 Days</span>
                  </div>
                </div>

                {/* Approximate Dates */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                    Approximate Season / Travel Window
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={formData.approximateDates}
                      onChange={(e) => setFormData({ ...formData, approximateDates: e.target.value })}
                      placeholder="e.g. November, Next Month, Autumn..."
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Budget & Travelers */}
            <div>
              <h3 className="text-base font-bold font-serif-heading text-neutral-900 mb-4 pb-2 border-b border-neutral-100 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-700" />
                <span>2. Budget Tier & Travelers</span>
              </h3>

              <div className="grid sm:grid-cols-3 gap-4">
                {/* Budget tier */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                    Budget Level (Daily spend)
                  </label>
                  <select
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value as BudgetTier })}
                    className="w-full p-2.5 text-xs font-semibold bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none text-neutral-800 cursor-pointer"
                  >
                    <option value="Budget">Budget (₹1,500 – ₹3,500 / day)</option>
                    <option value="Moderate">Moderate (₹4,000 – ₹8,000 / day)</option>
                    <option value="Luxury">Luxury (₹9,000+ / day)</option>
                  </select>
                </div>

                {/* Traveler Type */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                    Travel Group Type
                  </label>
                  <select
                    value={formData.travelerType}
                    onChange={(e) => setFormData({ ...formData, travelerType: e.target.value as TravelerType })}
                    className="w-full p-2.5 text-xs font-semibold bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none text-neutral-800 cursor-pointer"
                  >
                    <option value="Solo">Solo Explorer</option>
                    <option value="Couple">Couple / Partners</option>
                    <option value="Family">Family (Kids / Parents)</option>
                    <option value="Friends/Group">Friends / Group</option>
                  </select>
                </div>

                {/* Number of Travelers */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                    Number of Travelers
                  </label>
                  <div className="relative">
                    <Users className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={formData.travelers}
                      onChange={(e) => setFormData({ ...formData, travelers: Math.max(1, parseInt(e.target.value, 10) || 1) })}
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Interests & Styles */}
            <div>
              <h3 className="text-base font-bold font-serif-heading text-neutral-900 mb-4 pb-2 border-b border-neutral-100 flex items-center gap-2">
                <Compass className="w-4 h-4 text-emerald-700" />
                <span>3. Travel Interests & Preferences</span>
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-2">
                    What excites you about this Indian journey? (Select multiple)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {interestOptions.map((interest) => {
                      const selected = formData.interests.includes(interest);
                      return (
                        <button
                          key={interest}
                          type="button"
                          onClick={() => toggleInterest(interest)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                            selected
                              ? 'bg-emerald-700 text-white shadow-xs'
                              : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                          }`}
                        >
                          {selected && <Check className="w-3.5 h-3.5" />}
                          <span>{interest}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Transport */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                      Preferred Transit Mode
                    </label>
                    <select
                      value={formData.transportPreference}
                      onChange={(e) => setFormData({ ...formData, transportPreference: e.target.value as TransportPreference })}
                      className="w-full p-2.5 text-xs font-semibold bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none text-neutral-800 cursor-pointer"
                    >
                      <option value="Train">Indian Railways (Vande Bharat / Express)</option>
                      <option value="Flight">Domestic Flight</option>
                      <option value="Bus">Intercity Volvo / Luxury Bus</option>
                      <option value="Self-drive">Self-drive Car / Roadtrip</option>
                      <option value="Flexible / Recommend for me">Flexible / Recommend for me</option>
                    </select>
                  </div>

                  {/* Accommodation */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                      Preferred Stay Type
                    </label>
                    <select
                      value={formData.accommodationPreference}
                      onChange={(e) => setFormData({ ...formData, accommodationPreference: e.target.value as AccommodationPreference })}
                      className="w-full p-2.5 text-xs font-semibold bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none text-neutral-800 cursor-pointer"
                    >
                      <option value="Hotel">Comfort Hotel (3–4 Star)</option>
                      <option value="Homestay">Authentic Homestay / Haveli</option>
                      <option value="Resort">Luxury Heritage Palace / Resort</option>
                      <option value="Budget Hotel">Budget Hotel / Guesthouse</option>
                      <option value="Hostel">Backpacker Hostel / Zostel</option>
                      <option value="Flexible">Flexible / Diverse Stays</option>
                    </select>
                  </div>
                </div>

                {/* Additional Notes */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                    Special Wishes or Dietary/Accessibility Notes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="e.g. Vegetarian/Vegan dining options, avoid steep stairs, prioritize sunrise viewpoints..."
                    className="w-full p-3 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600"
                  />
                </div>
              </div>
            </div>

            {/* Generate CTA Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full py-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm uppercase tracking-wider rounded-2xl shadow-lg shadow-emerald-800/25 transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01]"
              >
                <Sparkles className="w-4 h-4 text-emerald-200" />
                <span>Generate Personalized Itinerary with Gemini</span>
              </button>
            </div>
          </form>
        )}

        {/* Show Generated Itinerary */}
        {!loading && generatedItinerary && (
          <ItineraryView
            itinerary={generatedItinerary}
            onSaveTrip={handleSaveTrip}
            isSaving={isSaving}
            isSaved={isSaved}
            onReplan={() => setGeneratedItinerary(null)}
          />
        )}
      </div>
    </div>
  );
};
