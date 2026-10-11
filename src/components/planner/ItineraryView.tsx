import React, { useState } from 'react';
import { 
  Sparkles, 
  Calendar, 
  DollarSign, 
  Users, 
  Clock, 
  Sun, 
  Sunset, 
  Moon, 
  Utensils, 
  Compass, 
  Briefcase, 
  ShieldAlert, 
  Bookmark, 
  Check, 
  Share2, 
  RotateCcw,
  MapPin,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Map as MapIcon,
  Sliders,
  CloudRain,
  Plus,
  Flame,
  ArrowUpDown,
  Zap,
  Edit3,
  Navigation
} from 'lucide-react';
import { Itinerary, SavedTrip, DayPlan } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { InteractiveItineraryMap } from './InteractiveItineraryMap';
import { AIBudgetOptimizerPanel } from './AIBudgetOptimizerPanel';
import { DayEditModal } from './DayEditModal';

interface ItineraryViewProps {
  itinerary: Itinerary;
  onSaveTrip: () => Promise<void>;
  isSaving: boolean;
  isSaved: boolean;
  onReplan: () => void;
  onUpdateItinerary?: (updated: Itinerary) => void;
}

export const ItineraryView: React.FC<ItineraryViewProps> = ({
  itinerary,
  onSaveTrip,
  isSaving,
  isSaved,
  onReplan,
  onUpdateItinerary
}) => {
  const { user, openAuthModal } = useAuth();
  const [activeTab, setActiveTab] = useState<'itinerary' | 'budget' | 'logistics'>('itinerary');
  const [expandedDays, setExpandedDays] = useState<Record<number, boolean>>({ 1: true, 2: true });
  const [copied, setCopied] = useState(false);
  const [highlightedPlace, setHighlightedPlace] = useState<string | null>(null);

  // Day edit modal state
  const [editingDay, setEditingDay] = useState<DayPlan | null>(null);
  const [isDayEditOpen, setIsDayEditOpen] = useState(false);

  const toggleDay = (dayNum: number) => {
    setExpandedDays(prev => ({
      ...prev,
      [dayNum]: !prev[dayNum]
    }));
  };

  const expandAllDays = () => {
    const all: Record<number, boolean> = {};
    itinerary.days.forEach(d => { all[d.dayNumber] = true; });
    setExpandedDays(all);
  };

  const collapseAllDays = () => {
    setExpandedDays({});
  };

  const handleShare = () => {
    const text = `Check out my ${itinerary.duration}-day travel itinerary for ${itinerary.destination} on Travillo AI: "${itinerary.tripTitle}". Estimated budget: ${itinerary.estimatedTotalBudget}.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveClick = async () => {
    if (!user) {
      openAuthModal('signin', {
        title: 'Save your journey ✦',
        subtitle: 'Create an account or sign in to save trips, sync itineraries and access them from any device.',
        pendingAction: {
          type: 'save_trip',
          payload: { itinerary }
        }
      });
      return;
    }
    await onSaveTrip();
  };

  const handleDaySaved = (updatedDay: DayPlan) => {
    if (!onUpdateItinerary) return;
    const newDays = itinerary.days.map(d => d.dayNumber === updatedDay.dayNumber ? updatedDay : d);
    onUpdateItinerary({
      ...itinerary,
      days: newDays
    });
  };

  const handleAddDay = () => {
    if (!onUpdateItinerary) return;
    const nextDayNum = itinerary.days.length + 1;
    const newDay: DayPlan = {
      dayNumber: nextDayNum,
      title: `Serene Exploration & Local Artisan Trails Day ${nextDayNum}`,
      morning: `Morning excursion to nearby village craft settlements and scenic pine lookouts for sunrise chai.`,
      afternoon: `Traditional craft workshop with native artisans, followed by lunch at a hidden riverside cafe.`,
      evening: `Farewell twilight stroll along the illuminated promenade, enjoying regional sweets and tea.`,
      places: [`${itinerary.destination} Cultural Atelier`, `Panoramic Ridge Viewpoint`, `Central Street Promenade`],
      activities: ['Artisan atelier visit', 'Scenic sunset walk', 'Bazaar forage'],
      foodSuggestions: ['Regional sweet delicacies', 'Specialty thali lunch', 'Kulhad masala chai'],
      estimatedDailyCost: '₹3,200',
      transportGuidance: 'Local e-rickshaws or leisurely walking.',
      usefulNotes: 'Keep footwear comfortable for cobblestones and village trails.'
    };

    onUpdateItinerary({
      ...itinerary,
      duration: nextDayNum,
      days: [...itinerary.days, newDay]
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* ================= Top Itinerary Hero Banner ================= */}
      <div className="relative rounded-3xl bg-white dark:bg-[#0F172A] p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-lg space-y-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-blue-500/10 via-violet-500/10 to-pink-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 text-xs font-bold border border-violet-500/20 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Generated Itinerary ✦</span>
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold">
                {itinerary.destination} · {itinerary.duration} Days
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight font-sans">
              {itinerary.tripTitle}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              {itinerary.summary}
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={handleSaveClick}
              disabled={isSaving || isSaved}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer shadow-md active:scale-95 ${
                isSaved
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gradient-to-r from-blue-600 via-violet-600 to-pink-500 hover:from-blue-700 hover:to-pink-600 text-white'
              }`}
            >
              {isSaved ? <Check className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
              <span>{isSaved ? 'Saved to Trips' : isSaving ? 'Saving...' : 'Save Trip'}</span>
            </button>

            <button
              onClick={handleShare}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors cursor-pointer"
              title="Share itinerary"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onReplan}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Replan</span>
            </button>
          </div>
        </div>

        {/* Highlight Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Estimated Total</span>
            <span className="text-base font-extrabold text-violet-600 dark:text-violet-400">{itinerary.estimatedTotalBudget}</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Party Size</span>
            <span className="text-base font-extrabold text-slate-900 dark:text-white">{itinerary.travelers} {itinerary.travelers === 1 ? 'Solo' : 'Travelers'}</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Transit Mode</span>
            <span className="text-base font-extrabold text-slate-900 dark:text-white truncate block">{itinerary.budgetBreakdown.transport}</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Best Window</span>
            <span className="text-base font-extrabold text-slate-900 dark:text-white truncate block">{itinerary.bestSeasonConsiderations.split('.')[0] || 'Seasonal'}</span>
          </div>
        </div>
      </div>

      {/* ================= View Switcher Tabs ================= */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar">
        {[
          { id: 'itinerary', label: 'Timeline & Map Split View', icon: MapIcon },
          { id: 'budget', label: 'AI Budget Optimizer', icon: Sliders },
          { id: 'logistics', label: 'Stays & Logistics', icon: Briefcase }
        ].map((tab) => {
          const IconC = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-4 text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border-b-2 whitespace-nowrap ${
                isActive
                  ? 'border-violet-600 text-violet-600 dark:text-violet-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <IconC className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ================= TAB 1: DESKTOP SPLIT VIEW (LEFT: Itinerary, RIGHT: Map) ================= */}
      {activeTab === 'itinerary' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ================= LEFT COLUMN: Smart Timeline Cards ================= */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Header controls & Weather adaptation bar */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-500/10 via-violet-500/10 to-pink-500/10 border border-violet-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-violet-600 text-white flex items-center justify-center shrink-0">
                  <CloudRain className="w-4 h-4 text-cyan-200" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block text-xs">
                    Weather-Aware Scheduling Intelligence
                  </span>
                  <span className="text-[11px] text-slate-600 dark:text-slate-400">
                    Adapt for monsoon showers, mountain snow, or midday heatwaves.
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  setEditingDay(itinerary.days[0]);
                  setIsDayEditOpen(true);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-violet-200 dark:border-violet-700 text-violet-600 dark:text-violet-400 font-bold text-xs shadow-2xs hover:shadow-xs transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Simulate Weather Swap</span>
              </button>
            </div>

            <div className="flex items-center justify-between pt-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-sans">
                Day-by-Day Timeline Schedule
              </h3>
              <div className="flex items-center gap-2 text-xs">
                <button onClick={expandAllDays} className="text-violet-600 dark:text-violet-400 font-bold hover:underline cursor-pointer">
                  Expand all
                </button>
                <span className="text-slate-300 dark:text-slate-700">·</span>
                <button onClick={collapseAllDays} className="text-slate-400 font-medium hover:underline cursor-pointer">
                  Collapse all
                </button>
              </div>
            </div>

            {/* Timeline Day Cards */}
            <div className="space-y-4">
              {itinerary.days.map((day) => {
                const isExpanded = !!expandedDays[day.dayNumber];
                return (
                  <div
                    key={day.dayNumber}
                    className="bg-white dark:bg-[#0F172A] rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden transition-all duration-200"
                  >
                    {/* Collapsible Card Header */}
                    <div
                      onClick={() => toggleDay(day.dayNumber)}
                      className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-violet-600 to-pink-500 text-white flex flex-col items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                          <span className="text-[9px] uppercase tracking-wider text-cyan-200 font-mono">Day</span>
                          <span className="text-base leading-none">{day.dayNumber}</span>
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-slate-900 dark:text-white font-sans">
                            {day.title}
                          </h4>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            <span className="font-semibold text-slate-700 dark:text-slate-300">Est. Daily: {day.estimatedDailyCost}</span>
                            <span>·</span>
                            <span className="text-emerald-600 dark:text-emerald-400 font-medium">⛅ 21°C Pleasant</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingDay(day);
                            setIsDayEditOpen(true);
                          }}
                          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-violet-100 dark:hover:bg-violet-950 text-slate-700 dark:text-slate-300 hover:text-violet-600 transition-colors cursor-pointer text-xs font-semibold flex items-center gap-1 shadow-2xs"
                          title="Refine day with AI"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-violet-500" />
                          <span className="hidden sm:inline">Refine Day</span>
                        </button>

                        <div className="p-1 text-slate-400">
                          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </div>
                      </div>
                    </div>

                    {/* Expanded Content with Exact Timeline Slots: 09:00, 13:00, 17:30 */}
                    {isExpanded && (
                      <div className="px-5 pb-6 pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-5 text-xs">
                        
                        {/* Timeline slots */}
                        <div className="space-y-3 pt-2">
                          
                          {/* Slot 1: 09:00 Morning Activity */}
                          <div 
                            onClick={() => setHighlightedPlace(day.places[0] || null)}
                            className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 hover:border-amber-500/40 transition-colors cursor-pointer flex gap-3.5"
                          >
                            <div className="flex flex-col items-center shrink-0 pt-0.5">
                              <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono font-bold text-[11px]">
                                09:00
                              </span>
                              <Sun className="w-4 h-4 text-amber-500 mt-2" />
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-slate-900 dark:text-white text-xs">
                                  {day.places[0] || 'Morning Cultural Sights'}
                                </span>
                                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">Locate on map 📍</span>
                              </div>
                              <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                                {day.morning}
                              </p>
                            </div>
                          </div>

                          {/* Slot 2: 13:00 Afternoon Stop & Regional Dining */}
                          <div 
                            onClick={() => setHighlightedPlace(day.places[1] || day.places[0] || null)}
                            className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/20 hover:border-blue-500/40 transition-colors cursor-pointer flex gap-3.5"
                          >
                            <div className="flex flex-col items-center shrink-0 pt-0.5">
                              <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 font-mono font-bold text-[11px]">
                                13:00
                              </span>
                              <Sunset className="w-4 h-4 text-blue-500 mt-2" />
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-slate-900 dark:text-white text-xs">
                                  {day.places[1] || day.places[0] || 'Afternoon Highlights'}
                                </span>
                                <span className="text-[10px] text-blue-600 dark:text-blue-400 font-medium">Locate on map 📍</span>
                              </div>
                              <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                                {day.afternoon}
                              </p>
                            </div>
                          </div>

                          {/* Slot 3: 17:30 Twilight Gathering & Dinner */}
                          <div 
                            onClick={() => setHighlightedPlace(day.places[2] || day.places[0] || null)}
                            className="p-4 rounded-2xl bg-violet-500/5 border border-violet-500/20 hover:border-violet-500/40 transition-colors cursor-pointer flex gap-3.5"
                          >
                            <div className="flex flex-col items-center shrink-0 pt-0.5">
                              <span className="px-2 py-0.5 rounded-md bg-violet-500/10 text-violet-600 dark:text-violet-400 font-mono font-bold text-[11px]">
                                17:30
                              </span>
                              <Moon className="w-4 h-4 text-violet-500 mt-2" />
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-slate-900 dark:text-white text-xs">
                                  {day.places[2] || day.places[0] || 'Evening & Dinner Promenade'}
                                </span>
                                <span className="text-[10px] text-violet-600 dark:text-violet-400 font-medium">Locate on map 📍</span>
                              </div>
                              <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                                {day.evening}
                              </p>
                            </div>
                          </div>

                        </div>

                        {/* Food Recommendations */}
                        <div className="p-3.5 rounded-2xl bg-pink-500/5 border border-pink-500/20 flex items-start gap-3">
                          <Utensils className="w-4 h-4 text-pink-500 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white block text-[11px] uppercase tracking-wider">
                              Signature Regional Cuisine & Thalis
                            </span>
                            <p className="text-slate-600 dark:text-slate-300 mt-0.5 font-normal">
                              {day.foodSuggestions.join(' • ')}
                            </p>
                          </div>
                        </div>

                        {/* Transit & Tips */}
                        <div className="grid sm:grid-cols-2 gap-3 text-xs">
                          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                            <span className="font-bold text-slate-800 dark:text-slate-200 block text-[11px]">Transit & Road Timing:</span>
                            <p className="text-slate-600 dark:text-slate-400 mt-0.5">{day.transportGuidance}</p>
                          </div>
                          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                            <span className="font-bold text-slate-800 dark:text-slate-200 block text-[11px]">AI Insight & Pro-Tip:</span>
                            <p className="text-slate-600 dark:text-slate-400 mt-0.5">{day.usefulNotes}</p>
                          </div>
                        </div>

                      </div>
                    )}
                  </div>
                );
              })}

              {/* Add Day Button */}
              <div className="pt-2 text-center">
                <button
                  onClick={handleAddDay}
                  className="px-6 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 hover:border-violet-500 text-slate-700 dark:text-slate-300 font-bold text-xs transition-all flex items-center justify-center gap-2 mx-auto cursor-pointer shadow-2xs hover:bg-violet-50/40"
                >
                  <Plus className="w-4 h-4 text-violet-500" />
                  <span>Extend Journey with Day {itinerary.days.length + 1} ✦</span>
                </button>
              </div>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: Sticky Interactive Map ================= */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
            <InteractiveItineraryMap
              itinerary={itinerary}
              highlightedPlace={highlightedPlace}
            />

            {/* Quick Waypoints List underneath map */}
            <div className="bg-white dark:bg-[#0F172A] p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-violet-500" />
                  <span>Waypoints Quick Jump</span>
                </span>
                <span className="text-[10px] text-slate-400">Click to focus map</span>
              </div>

              <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1 no-scrollbar text-xs">
                {itinerary.days.flatMap(d => d.places.map((place, i) => ({ dayNum: d.dayNumber, place, order: i + 1 }))).slice(0, 8).map((pt, idx) => (
                  <button
                    key={idx}
                    onClick={() => setHighlightedPlace(pt.place)}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-violet-50 dark:hover:bg-violet-950/40 border border-slate-200/60 dark:border-slate-800 text-left transition-colors cursor-pointer flex items-center justify-between"
                  >
                    <span className="text-slate-800 dark:text-slate-200 font-medium truncate max-w-[200px]">📍 {pt.place}</span>
                    <span className="text-[10px] font-bold text-violet-600 dark:text-violet-400">Day {pt.dayNum}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ================= TAB 2: AI Budget Optimizer ================= */}
      {activeTab === 'budget' && (
        <AIBudgetOptimizerPanel
          itinerary={itinerary}
          onApplyOptimizedItinerary={(updated) => {
            if (onUpdateItinerary) onUpdateItinerary(updated);
            setActiveTab('itinerary');
          }}
        />
      )}

      {/* ================= TAB 3: Stays & Logistics ================= */}
      {activeTab === 'logistics' && (
        <div className="bg-white dark:bg-[#0F172A] rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-md space-y-6">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white font-sans">
              Accommodation & Logistics Guidance
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Verified stay recommendations, local permits, rail booking tips, and clothing packing list.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 text-xs">
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-violet-600 dark:text-violet-400 font-bold text-sm">
                <Briefcase className="w-4 h-4" />
                <span>Stay Recommendations</span>
              </div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                {itinerary.budgetBreakdown.accommodation}
              </p>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500">
                Recommended areas: Near central market for first-timers; upper valley ridge for scenic silence.
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-pink-600 dark:text-pink-400 font-bold text-sm">
                <ShieldAlert className="w-4 h-4" />
                <span>Seasonal Advisory & Guidelines</span>
              </div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                {itinerary.bestSeasonConsiderations}
              </p>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500">
                Dress code: Modest attire covering shoulders & knees recommended for all heritage temple premises.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= Day Edit & Weather Adapt Modal ================= */}
      {isDayEditOpen && editingDay && (
        <DayEditModal
          isOpen={isDayEditOpen}
          day={editingDay}
          destination={itinerary.destination}
          onClose={() => setIsDayEditOpen(false)}
          onSaveDay={(saved) => {
            handleDaySaved(saved);
            setIsDayEditOpen(false);
          }}
        />
      )}

    </div>
  );
};
