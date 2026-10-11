import React from 'react';
import { Sparkles, ArrowRight, Star, Clock, MapPin, Compass, Flame, Shield, Heart } from 'lucide-react';
import { Destination } from '../../types';
import { usePreferences } from '../../context/PreferencesContext';
import { useFavorites } from '../../context/FavoritesContext';

interface HomeSectionsProps {
  destinations: Destination[];
  onSelectDestination: (destination: Destination) => void;
  onPlanTrip: (destination: Destination) => void;
  onNavigateToStyle: (style: string) => void;
  onNavigateToDiscover: () => void;
  onStartPlanning: () => void;
}

export const HomeSections: React.FC<HomeSectionsProps> = ({
  destinations,
  onSelectDestination,
  onPlanTrip,
  onNavigateToStyle,
  onNavigateToDiscover,
  onStartPlanning
}) => {
  const { preferences, openPreferenceModal } = usePreferences();
  const { isFavorite, toggleFavorite } = useFavorites();

  // 1. AI Picks For You (Calibrated with user taste preferences)
  const aiPicks = destinations
    .filter(d => 
      preferences.preferredStyles.some(s => d.travelStyles.includes(s as any)) ||
      d.budgetLevel === preferences.budgetLevel ||
      d.rating >= 4.88
    )
    .slice(0, 3);

  // 2. Hidden Gems
  const hiddenGems = destinations
    .filter(d => d.travelStyles.includes('Backpacking') || d.region === 'Northeast India' || d.rating >= 4.9)
    .slice(0, 4);

  // 3. Weekend Escapes (idealDays <= 3 or 4)
  const weekendEscapes = destinations
    .filter(d => d.travelStyles.includes('Weekend Getaway') || d.idealDays <= 4)
    .slice(0, 4);

  // 4. Explore by Mood options
  const moods = [
    {
      id: 'zen',
      name: 'Peaceful & Stillness',
      icon: '🧘‍♂️',
      tag: 'Mindful Retreats',
      color: 'from-blue-600/80 to-cyan-500/80',
      bgImg: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80',
      dest: 'Munnar'
    },
    {
      id: 'adrenaline',
      name: 'Pure Adrenaline',
      icon: '⚡',
      tag: 'Trekking & Rafting',
      color: 'from-amber-600/80 to-rose-600/80',
      bgImg: 'https://images.unsplash.com/photo-1533240332313-0db49b459ad6?auto=format&fit=crop&w=600&q=80',
      dest: 'Rishikesh'
    },
    {
      id: 'royal',
      name: 'Regal Heritage',
      icon: '👑',
      tag: 'Palaces & Forts',
      color: 'from-purple-600/80 to-pink-600/80',
      bgImg: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80',
      dest: 'Udaipur'
    },
    {
      id: 'coastal',
      name: 'Coastal Chill',
      icon: '🌴',
      tag: 'Beaches & Cafes',
      color: 'from-cyan-600/80 to-blue-600/80',
      bgImg: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80',
      dest: 'Goa'
    },
    {
      id: 'spiritual',
      name: 'Sacred Sanctum',
      icon: '🪔',
      tag: 'Ghats & Ashrams',
      color: 'from-orange-600/80 to-amber-600/80',
      bgImg: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=600&q=80',
      dest: 'Varanasi'
    },
    {
      id: 'mountain',
      name: 'Alpine Heights',
      icon: '🏔',
      tag: 'Snow & Passes',
      color: 'from-violet-600/80 to-indigo-600/80',
      bgImg: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=600&q=80',
      dest: 'Spiti Valley'
    }
  ];

  return (
    <div className="space-y-24 py-6">
      
      {/* ========================================================
          1. ✦ AI PICKS FOR YOU (Bento & Large Feature Layout)
         ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>✦ AI Picks For You</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight font-sans">
              Personalized Recommendations
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-xl">
              Calibrated from your Travel DNA: <span className="font-semibold text-violet-600 dark:text-violet-400">{preferences.homeCity || 'India'} origin · {preferences.budgetLevel} budget · {preferences.preferredStyles.join(', ')}</span>
            </p>
          </div>

          <button
            onClick={openPreferenceModal}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-violet-400 transition-all cursor-pointer shadow-2xs shrink-0"
          >
            Edit Travel DNA ✦
          </button>
        </div>

        {/* Bento AI Showcase: 1 Hero Feature Card + 2 Stacked Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {aiPicks[0] && (
            <div 
              onClick={() => onSelectDestination(aiPicks[0])}
              className="lg:col-span-7 relative min-h-[380px] rounded-3xl overflow-hidden group cursor-pointer border border-slate-200/80 dark:border-slate-800 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between p-7 text-white"
            >
              <img
                src={aiPicks[0].heroImage}
                alt={aiPicks[0].name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
              
              {/* Top Meta */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-violet-600/90 backdrop-blur-md text-xs font-bold text-white shadow-sm flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-cyan-200" />
                  <span>99% AI Affinity Match</span>
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(aiPicks[0]);
                  }}
                  className="p-2.5 rounded-full bg-black/40 backdrop-blur-md text-white hover:scale-110 transition-transform"
                >
                  <Heart className={`w-4 h-4 ${isFavorite(aiPicks[0].id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                </button>
              </div>

              {/* Bottom Content */}
              <div className="relative z-10 space-y-3">
                <div className="flex items-center gap-2 text-xs text-cyan-300 font-semibold uppercase tracking-wider">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{aiPicks[0].state} · {aiPicks[0].region}</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                  {aiPicks[0].name}
                </h3>
                <p className="text-sm text-slate-200 line-clamp-2 max-w-lg">
                  {aiPicks[0].shortDescription}
                </p>

                <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-white/20">
                  <div className="flex items-center gap-4 text-xs font-medium text-slate-200">
                    <span>{aiPicks[0].idealDays} Days</span>
                    <span>·</span>
                    <span>{aiPicks[0].estimatedDailyBudget} / day</span>
                    <span>·</span>
                    <span className="flex items-center gap-1 text-amber-300 font-bold">
                      <Star className="w-3.5 h-3.5 fill-current" /> {aiPicks[0].rating}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onPlanTrip(aiPicks[0]);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-violet-600 to-pink-500 hover:from-blue-700 hover:to-pink-600 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 active:scale-95"
                  >
                    <span>Build Itinerary</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Right Column: 2 Horizontal Cards */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {aiPicks.slice(1, 3).map((dest) => (
              <div
                key={dest.id}
                onClick={() => onSelectDestination(dest)}
                className="relative flex-1 min-h-[178px] rounded-3xl overflow-hidden group cursor-pointer border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all duration-300 p-5 flex flex-col justify-between text-white"
              >
                <img
                  src={dest.heroImage}
                  alt={dest.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-transparent" />

                <div className="relative z-10 flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-bold text-white">
                    ✦ {dest.travelStyles[0]}
                  </span>
                  <span className="flex items-center gap-1 text-amber-300 text-xs font-bold">
                    <Star className="w-3 h-3 fill-current" /> {dest.rating}
                  </span>
                </div>

                <div className="relative z-10 flex items-end justify-between gap-3">
                  <div>
                    <span className="text-[11px] text-slate-300 font-medium block">
                      {dest.state}
                    </span>
                    <h4 className="text-xl font-bold text-white leading-tight">
                      {dest.name}
                    </h4>
                    <span className="text-xs text-slate-300 font-medium block mt-0.5">
                      {dest.idealDays} Days · {dest.estimatedDailyBudget}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onPlanTrip(dest);
                    }}
                    className="p-2.5 rounded-xl bg-white/20 hover:bg-violet-600 text-white backdrop-blur-md transition-colors"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          2. 💎 HIDDEN GEMS (Horizontal Card Rail)
         ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-bold mb-2">
              <span>💎 Untouched India</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight font-sans">
              Hidden Gems & Secret Sanctuaries
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-xl">
              High-altitude passes, living root bridges, and tranquil Himalayan valleys far from tourist crowds.
            </p>
          </div>

          <button
            onClick={onNavigateToDiscover}
            className="text-xs font-bold text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-1 cursor-pointer shrink-0"
          >
            <span>View all offbeat gems</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {hiddenGems.map((gem) => (
            <div
              key={gem.id}
              onClick={() => onSelectDestination(gem)}
              className="group relative bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 hover:border-cyan-500/40 shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={gem.heroImage}
                  alt={gem.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-black/50 backdrop-blur-md text-[10px] font-bold text-cyan-300">
                  💎 Secret Gem
                </span>
                <span className="absolute bottom-2.5 left-3 text-white text-xs font-semibold">
                  {gem.idealDays} Days
                </span>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block">
                    {gem.state}
                  </span>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                    {gem.name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                    {gem.shortDescription}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {gem.estimatedDailyBudget}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onPlanTrip(gem);
                    }}
                    className="text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 flex items-center gap-1"
                  >
                    <span>Plan</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================
          3. ⚡ WEEKEND ESCAPES (Quick 2-4 day resets)
         ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold mb-2">
              <span>⚡ Fast Resets</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight font-sans">
              Weekend Escapes
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-xl">
              Spontaneous 2 to 4 day getaways designed for seamless road trips and rapid battery recharges.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {weekendEscapes.map((esc) => (
            <div
              key={esc.id}
              onClick={() => onSelectDestination(esc)}
              className="group relative bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 hover:border-amber-500/40 shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={esc.heroImage}
                  alt={esc.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-amber-500/90 text-[10px] font-bold text-white">
                  ⚡ Quick Escape
                </span>
                <span className="absolute bottom-2.5 right-3 text-white text-xs font-semibold">
                  {esc.idealDays} Days
                </span>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block">
                    {esc.state}
                  </span>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    {esc.name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                    {esc.shortDescription}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {esc.estimatedDailyBudget}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onPlanTrip(esc);
                    }}
                    className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:text-amber-700 flex items-center gap-1"
                  >
                    <span>Plan with AI</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================
          4. 🌈 EXPLORE BY MOOD (Vibrant Mood Cards)
         ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 text-pink-600 dark:text-pink-400 text-xs font-bold mb-2">
            <span>🌈 Emotional Resonance</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight font-sans">
            Explore By Mood
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-xl">
            Match your journey to your current headspace — stillness, adrenaline, luxury, or spiritual grounding.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
          {moods.map((mood) => {
            const foundDest = destinations.find(d => d.name === mood.dest);
            return (
              <div
                key={mood.id}
                onClick={() => {
                  if (foundDest) onSelectDestination(foundDest);
                }}
                className="group relative h-48 rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 p-3.5 flex flex-col justify-between text-white"
              >
                <img
                  src={mood.bgImg}
                  alt={mood.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${mood.color} mix-blend-multiply`} />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                <div className="relative z-10 flex items-center justify-between">
                  <span className="text-xl">{mood.icon}</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-white/20 backdrop-blur-md">
                    {mood.tag}
                  </span>
                </div>

                <div className="relative z-10">
                  <h4 className="text-sm font-bold text-white leading-tight">
                    {mood.name}
                  </h4>
                  <span className="text-[10px] text-white/80 block mt-0.5">
                    e.g. {mood.dest}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================
          5. 🗺 EXPLORE INDIA (Visual Region Showcase)
         ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-blue-900/90 via-violet-950/90 to-purple-950/90 text-white p-8 sm:p-12 overflow-hidden shadow-xl border border-violet-500/20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-cyan-300 text-xs font-bold">
              <span>🗺 Pan-India Discovery</span>
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-sans">
              From Alpine Glaciers to Coral Atolls
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed font-light">
              Travillo spans all distinct travel zones of India: Himachal, Kashmir, Uttarakhand, Rajasthan royal trails, Goa & Konkan coastlines, Kerala backwaters, Northeast rainforests, and Andaman archipelagos.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={onNavigateToDiscover}
                className="px-6 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2 active:scale-95"
              >
                <span>Browse All States & Regions</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          6. ✨ PLAN WITH AI (Futuristic CTA)
         ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-tr from-blue-600 via-violet-600 to-pink-500 p-8 sm:p-14 text-white text-center shadow-xl shadow-violet-500/20 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
              <span>✦ Instant Gemini 3.8 Flash Itinerary Generation</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-sans">
              Ready to embark on your next journey?
            </h2>

            <p className="text-sm sm:text-base text-white/90 leading-relaxed font-light">
              Skip weeks of spreadsheet research. Give Travillo your dream destination, dates and budget, and generate a day-wise interactive route in under 3 seconds.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={onStartPlanning}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-sm shadow-lg hover:shadow-xl transition-all cursor-pointer active:scale-95"
              >
                Launch AI Planner ✦
              </button>
              <button
                onClick={onNavigateToDiscover}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-semibold text-sm backdrop-blur-md transition-all cursor-pointer"
              >
                Explore Destinations
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
