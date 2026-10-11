import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  MapPin, 
  Search, 
  Flame, 
  Compass,
  Star,
  Zap,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import { DESTINATIONS } from '../../data/destinations';

interface HeroProps {
  onPlanTrip: (destinationName?: string, travelers?: number) => void;
  onExplore: () => void;
  onSelectDestination: (destName: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  onPlanTrip,
  onExplore,
  onSelectDestination
}) => {
  const [aiPrompt, setAiPrompt] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const quickChips = [
    { label: 'Mountains', icon: '🏔', prompt: '5 days peaceful mountain escape in Himachal under ₹20,000', dest: 'Manali' },
    { label: 'Beaches', icon: '🌊', prompt: '4 days relaxed beach trip in South Goa under ₹25,000', dest: 'Goa' },
    { label: 'Hidden Gems', icon: '✨', prompt: '6 days offbeat exploration in Meghalaya', dest: 'Meghalaya' },
    { label: 'Adventure', icon: '🎒', prompt: '7 days high-altitude road trip in Spiti Valley', dest: 'Spiti Valley' },
    { label: 'Romantic', icon: '💕', prompt: '3 days luxury heritage romantic getaway in Udaipur', dest: 'Udaipur' },
    { label: 'Budget', icon: '💰', prompt: 'Weekend backpacker trip to Rishikesh under ₹8,000', dest: 'Rishikesh' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) {
      onPlanTrip('Himachal', 2);
      return;
    }

    // Check if user entered a specific destination name
    const match = DESTINATIONS.find(d => 
      aiPrompt.toLowerCase().includes(d.name.toLowerCase()) ||
      aiPrompt.toLowerCase().includes(d.state.toLowerCase())
    );

    if (match) {
      onPlanTrip(match.name, 2);
    } else {
      onPlanTrip(aiPrompt.trim(), 2);
    }
  };

  const handleChipClick = (chip: typeof quickChips[0]) => {
    setAiPrompt(chip.prompt);
    onPlanTrip(chip.dest, 2);
  };

  return (
    <section className="relative pt-8 pb-20 md:py-16 overflow-hidden aurora-bg-light dark:aurora-bg-dark">
      {/* Background Soft Glow Elements */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-blue-500/10 dark:bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-20 right-1/4 w-96 h-96 bg-pink-500/10 dark:bg-pink-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[600px] h-64 bg-violet-500/10 dark:bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* ================= LEFT COLUMN ================= */}
          <div className="lg:col-span-6 space-y-7 text-left">
            {/* Pill kicker */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
              <span className="flex h-2 w-2 rounded-full bg-gradient-to-r from-blue-500 to-pink-500 animate-pulse" />
              <span className="text-xs font-semibold tracking-wide text-slate-700 dark:text-slate-300">
                Next-Gen AI Travel Engine for India
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-violet-500/10 text-violet-600 dark:text-violet-400">
                v2.6
              </span>
            </div>

            {/* Headline */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white font-sans leading-[1.08]">
                Your world.<br />
                Your vibe.<br />
                <span className="ai-gradient-text">Planned by AI ✦</span>
              </h1>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-normal leading-relaxed pt-2 max-w-xl">
                Tell Travillo your budget, mood and dates. AI builds the journey — complete with day-by-day maps, weather adaptation, and itemized budget optimization.
              </p>
            </div>

            {/* Large AI Command Bar with subtle animated glow */}
            <div className="relative group">
              <div 
                className={`p-[1.5px] rounded-2xl transition-all duration-300 ${
                  isFocused 
                    ? 'bg-gradient-to-r from-blue-500 via-violet-500 to-pink-500 shadow-xl shadow-violet-500/20' 
                    : 'bg-gradient-to-r from-blue-500/40 via-violet-500/40 to-pink-500/40 hover:from-blue-500 hover:to-pink-500 shadow-md'
                }`}
              >
                <form 
                  onSubmit={handleSubmit}
                  className="flex flex-col sm:flex-row items-stretch sm:items-center bg-white dark:bg-[#0F172A] rounded-[15px] p-2 gap-2"
                >
                  <div className="flex items-center gap-3 flex-1 pl-3 pr-2 py-1.5">
                    <Sparkles className="w-5 h-5 text-violet-500 shrink-0 animate-pulse" />
                    <input
                      type="text"
                      value={aiPrompt}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="✨ Plan a 5-day adventure in Himachal under ₹20,000"
                      className="w-full bg-transparent border-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm sm:text-base focus:outline-hidden font-medium"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-violet-600 to-pink-500 hover:from-blue-700 hover:to-pink-600 text-white font-semibold text-sm shadow-md hover:shadow-lg hover:shadow-violet-500/25 transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0 active:scale-95"
                  >
                    <span>Build Journey</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>

            {/* Quick Chips */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Quick Prompts
              </div>
              <div className="flex flex-wrap gap-2">
                {quickChips.map((chip) => (
                  <button
                    key={chip.label}
                    onClick={() => handleChipClick(chip)}
                    className="group px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-violet-400 dark:hover:border-violet-500 text-slate-700 dark:text-slate-200 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <span>{chip.icon}</span>
                    <span className="group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                      {chip.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Micro stats / Trust indicators */}
            <div className="pt-2 flex items-center gap-6 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span className="font-bold text-slate-800 dark:text-slate-200">4.9/5</span>
                <span>Traveler Rating</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-violet-500" />
                <span className="font-bold text-slate-800 dark:text-slate-200">&lt; 3s</span>
                <span>Gemini Generation</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Verified India Routes</span>
              </div>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: Bento Travel Composition ================= */}
          <div className="lg:col-span-6 relative">
            <div className="relative grid grid-cols-12 gap-3.5 sm:gap-4 p-2">
              
              {/* Card 1: Snowy Mountains (Top Left) */}
              <div 
                onClick={() => onSelectDestination('Spiti Valley')}
                className="col-span-7 relative h-56 sm:h-64 rounded-3xl overflow-hidden group cursor-pointer border border-white/60 dark:border-slate-700/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <img
                  src="https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80"
                  alt="Snowy Himalayas"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                <div className="absolute bottom-3.5 left-4 right-4 text-white">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-cyan-300 flex items-center gap-1">
                    <span>🏔 Himalayas</span>
                    <span>·</span>
                    <span>Winter Vibe</span>
                  </div>
                  <h3 className="text-base font-bold text-white leading-tight">Spiti & Gulmarg Peaks</h3>
                  <p className="text-xs text-slate-300 font-medium">₹18,500 · 6 Days</p>
                </div>
                {/* Floating AI Match Tag */}
                <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-[10px] font-bold text-violet-600 dark:text-violet-400 border border-violet-500/30 shadow-xs flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>98% Match</span>
                </div>
              </div>

              {/* Card 2: Tropical Coast (Top Right) */}
              <div 
                onClick={() => onSelectDestination('Goa')}
                className="col-span-5 relative h-56 sm:h-64 rounded-3xl overflow-hidden group cursor-pointer border border-white/60 dark:border-slate-700/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <img
                  src="https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80"
                  alt="Tropical Coast"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-pink-300">
                    🌊 Coastal Serenity
                  </div>
                  <h3 className="text-sm font-bold text-white leading-tight">South Goa Palms</h3>
                  <p className="text-[11px] text-slate-300">₹14,000 · 4 Days</p>
                </div>
              </div>

              {/* Card 3: Colorful Heritage Palace (Bottom Left) */}
              <div 
                onClick={() => onSelectDestination('Udaipur')}
                className="col-span-5 relative h-48 sm:h-52 rounded-3xl overflow-hidden group cursor-pointer border border-white/60 dark:border-slate-700/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <img
                  src="https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80"
                  alt="Udaipur Lake Palace"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-amber-300">
                    🏰 Royal Heritage
                  </div>
                  <h3 className="text-sm font-bold text-white leading-tight">Udaipur Palaces</h3>
                  <p className="text-[11px] text-slate-300">₹22,000 · 3 Days</p>
                </div>
              </div>

              {/* Card 4: Waterfalls / Lush Nature & Luxury Retreat (Bottom Right) */}
              <div 
                onClick={() => onSelectDestination('Meghalaya')}
                className="col-span-7 relative h-48 sm:h-52 rounded-3xl overflow-hidden group cursor-pointer border border-white/60 dark:border-slate-700/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <img
                  src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
                  alt="Meghalaya Waterfalls"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-emerald-300 flex items-center gap-1">
                    <span>🌿 Nature Wonders</span>
                    <span>·</span>
                    <span>Living Root Bridges</span>
                  </div>
                  <h3 className="text-base font-bold text-white leading-tight">Meghalaya Cascades</h3>
                  <p className="text-xs text-slate-300 font-medium">₹19,000 · 5 Days</p>
                </div>
              </div>

              {/* Floating Dynamic AI Badge in Center */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-2 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-violet-500/30 shadow-xl shadow-violet-500/20 flex items-center gap-2.5 z-20 pointer-events-none animate-ai-pulse">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-blue-600 via-violet-600 to-pink-500 flex items-center justify-center text-white">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div className="text-left">
                  <span className="block text-[11px] font-bold text-slate-900 dark:text-white leading-tight">
                    ✦ Live AI Route Optimization
                  </span>
                  <span className="block text-[9px] text-slate-500 dark:text-slate-400">
                    Weather-aware · Budget calibrated
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
