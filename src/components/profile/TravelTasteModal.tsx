import React, { useState } from 'react';
import { X, Sparkles, MapPin, DollarSign, Utensils, Heart, Check, Clock, Users, Compass, Zap } from 'lucide-react';
import { usePreferences } from '../../context/PreferencesContext';
import { useAuth } from '../../context/AuthContext';
import { IndiaTravelStyle, BudgetTier, TravelerType } from '../../types';

export const TravelTasteModal: React.FC = () => {
  const { preferences, updatePreferences, isPreferenceModalOpen, closePreferenceModal } = usePreferences();

  const [homeCity, setHomeCity] = useState(preferences.homeCity);
  const [preferredStyles, setPreferredStyles] = useState<IndiaTravelStyle[]>(preferences.preferredStyles);
  const [budgetLevel, setBudgetLevel] = useState<BudgetTier>(preferences.budgetLevel);
  const [dietPreference, setDietPreference] = useState(preferences.dietPreference);
  const [travelPace, setTravelPace] = useState(preferences.travelPace);
  const [travelerGroup, setTravelerGroup] = useState<TravelerType>(preferences.travelerGroup);
  const [monsoonAware, setMonsoonAware] = useState(preferences.monsoonAware);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isPreferenceModalOpen) return null;

  const styleOptions: { name: IndiaTravelStyle; icon: string }[] = [
    { name: 'Mountains', icon: '🏔️' },
    { name: 'Beaches', icon: '🌊' },
    { name: 'Adventure', icon: '🧗' },
    { name: 'Heritage', icon: '🏰' },
    { name: 'Spiritual', icon: '🪔' },
    { name: 'Wildlife', icon: '🐅' },
    { name: 'Nature', icon: '🌿' },
    { name: 'Food', icon: '🥘' },
    { name: 'Honeymoon', icon: '💕' },
    { name: 'Weekend Getaway', icon: '⚡' },
    { name: 'Backpacking', icon: '🎒' }
  ];

  const cityOptions = [
    'Delhi NCR', 'Mumbai', 'Bengaluru', 'Kolkata', 'Chennai', 
    'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Chandigarh', 'Kochi'
  ];

  const toggleStyle = (style: IndiaTravelStyle) => {
    if (preferredStyles.includes(style)) {
      setPreferredStyles(preferredStyles.filter(s => s !== style));
    } else {
      setPreferredStyles([...preferredStyles, style]);
    }
  };

  const { user, openAuthModal, showToast } = useAuth();

  const handleSave = async () => {
    if (!user) {
      closePreferenceModal();
      openAuthModal('signin', {
        title: 'Save your journey ✦',
        subtitle: 'Create an account or sign in to save trips, sync itineraries and access them from any device.',
        pendingAction: { type: 'open_taste_profile' }
      });
      return;
    }

    await updatePreferences({
      homeCity,
      preferredStyles,
      budgetLevel,
      dietPreference,
      travelPace,
      travelerGroup,
      monsoonAware,
    });
    setSavedSuccess(true);
    showToast('Travel DNA preferences saved to cloud ✓', 'success');
    setTimeout(() => {
      setSavedSuccess(false);
      closePreferenceModal();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-[#0F172A] rounded-3xl max-w-xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-blue-500/5 via-violet-500/10 to-pink-500/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-violet-600 to-pink-500 text-white flex items-center justify-center shadow-md shadow-violet-500/20">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white font-sans flex items-center gap-1.5">
                <span>Your Travel DNA</span>
                <span className="text-violet-600 dark:text-violet-400">✦</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Personalizes Gemini itineraries, Discovery matches & Copilot reasoning.
              </p>
            </div>
          </div>
          <button
            onClick={closePreferenceModal}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700 dark:text-slate-300">
          
          {/* Home City */}
          <div className="space-y-2">
            <label className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 uppercase text-[10px] tracking-wider">
              <MapPin className="w-3.5 h-3.5 text-violet-500" />
              <span>Starting City / Origin Hub</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {cityOptions.map(city => (
                <button
                  key={city}
                  type="button"
                  onClick={() => setHomeCity(city)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    homeCity === city
                      ? 'bg-violet-600 text-white border-violet-600 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-violet-400'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          {/* Mountains vs Beaches vs Styles */}
          <div className="space-y-2">
            <label className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 uppercase text-[10px] tracking-wider">
              <Compass className="w-3.5 h-3.5 text-pink-500" />
              <span>Favorite Terrains & Themes (Select All That Apply)</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {styleOptions.map(s => {
                const isSelected = preferredStyles.includes(s.name);
                return (
                  <button
                    key={s.name}
                    type="button"
                    onClick={() => toggleStyle(s.name)}
                    className={`p-2.5 rounded-xl border text-left flex items-center justify-between text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white border-transparent shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-violet-300'
                    }`}
                  >
                    <span>{s.icon} {s.name}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Budget Tier */}
          <div className="space-y-2">
            <label className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 uppercase text-[10px] tracking-wider">
              <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
              <span>Budget Calibration</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Budget', 'Moderate', 'Luxury'] as BudgetTier[]).map(tier => (
                <button
                  key={tier}
                  type="button"
                  onClick={() => setBudgetLevel(tier)}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                    budgetLevel === tier
                      ? 'bg-violet-50 dark:bg-violet-950/50 border-violet-500 ring-1 ring-violet-500 text-violet-700 dark:text-violet-300 font-bold'
                      : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <span className="block text-xs font-bold">{tier}</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    {tier === 'Budget' ? '₹1.5k–2.5k' : tier === 'Moderate' ? '₹3.5k–6k' : '₹8k+'} / day
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Traveler Group */}
          <div className="space-y-2">
            <label className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 uppercase text-[10px] tracking-wider">
              <Users className="w-3.5 h-3.5 text-blue-500" />
              <span>Default Traveler Dynamics</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['Solo', 'Couple', 'Friends', 'Family'] as TravelerType[]).map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTravelerGroup(t)}
                  className={`p-2.5 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer ${
                    travelerGroup === t
                      ? 'bg-violet-600 text-white border-violet-600 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Diet Preferences */}
          <div className="space-y-2">
            <label className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 uppercase text-[10px] tracking-wider">
              <Utensils className="w-3.5 h-3.5 text-pink-500" />
              <span>Food & Culinary Filter</span>
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {['All', 'Pure Veg', 'Non-Veg', 'Jain Food', 'Vegan'].map(diet => (
                <button
                  key={diet}
                  type="button"
                  onClick={() => setDietPreference(diet as any)}
                  className={`p-2 rounded-xl border text-center text-xs font-semibold transition-all cursor-pointer ${
                    dietPreference === diet
                      ? 'bg-pink-600 text-white border-pink-600 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {diet}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between">
          <button
            onClick={closePreferenceModal}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-violet-600 to-pink-500 hover:from-blue-700 hover:to-pink-600 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>Saved DNA!</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-cyan-200" />
                <span>Save Travel DNA ✦</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
