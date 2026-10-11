import React, { useState } from 'react';
import { 
  DollarSign, 
  Sparkles, 
  TrendingDown, 
  Check, 
  ArrowRight, 
  Sliders, 
  ShieldCheck, 
  Zap, 
  RotateCcw,
  Hotel,
  Car,
  Utensils,
  Ticket,
  MapPin,
  TrendingUp,
  Percent
} from 'lucide-react';
import { Itinerary } from '../../types';

interface AIBudgetOptimizerPanelProps {
  itinerary: Itinerary;
  onApplyOptimizedItinerary: (updated: Itinerary) => void;
}

export const AIBudgetOptimizerPanel: React.FC<AIBudgetOptimizerPanelProps> = ({
  itinerary,
  onApplyOptimizedItinerary
}) => {
  const currentTotalNum = parseInt(itinerary.estimatedTotalBudget.replace(/[^0-9]/g, '') || '25000');
  const travelersCount = itinerary.travelers || 2;
  const perPersonCurrent = Math.round(currentTotalNum / travelersCount);

  const [targetBudget, setTargetBudget] = useState<number>(Math.round(currentTotalNum * 0.8));
  const [instruction, setInstruction] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    optimizedItinerary: Itinerary;
    optimizationSummary: string;
    savingsAmount: string;
  } | null>(null);

  const presets = [
    { label: '📉 -15% Lean Trim', target: Math.round(currentTotalNum * 0.85), pct: 15 },
    { label: '🎒 -25% Value Pacing', target: Math.round(currentTotalNum * 0.75), pct: 25 },
    { label: '⚡ -35% Max Optimization', target: Math.round(currentTotalNum * 0.65), pct: 35 },
  ];

  // Estimated category breakdown percentages
  const categories = [
    { name: 'Accommodation', key: 'accommodation', icon: Hotel, pct: 38, val: itinerary.budgetBreakdown.accommodation, color: 'from-blue-500 to-indigo-500' },
    { name: 'Transport & Transit', key: 'transport', icon: Car, pct: 26, val: itinerary.budgetBreakdown.transport, color: 'from-violet-500 to-purple-500' },
    { name: 'Food & Regional Thalis', key: 'food', icon: Utensils, pct: 18, val: itinerary.budgetBreakdown.food, color: 'from-pink-500 to-rose-500' },
    { name: 'Activities & Monuments', key: 'activities', icon: Ticket, pct: 11, val: itinerary.budgetBreakdown.activities, color: 'from-cyan-500 to-teal-500' },
    { name: 'Local Travel & Auto', key: 'local', icon: MapPin, pct: 7, val: '₹1,500 – ₹3,000 approx', color: 'from-amber-500 to-orange-500' }
  ];

  const handleRunOptimization = async (customTarget?: number, customNote?: string) => {
    const finalTarget = customTarget !== undefined ? customTarget : targetBudget;
    const finalNote = customNote !== undefined ? customNote : instruction;

    setLoading(true);
    try {
      const res = await fetch('/api/optimize-budget', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itinerary,
          targetBudget: finalTarget,
          instruction: finalNote || `Reduce trip budget from ₹${currentTotalNum.toLocaleString('en-IN')} to ₹${finalTarget.toLocaleString('en-IN')} without losing iconic stops.`
        })
      });

      if (!res.ok) throw new Error('Optimization failed');
      const data = await res.json();
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (result?.optimizedItinerary) {
      onApplyOptimizedItinerary(result.optimizedItinerary);
    }
  };

  return (
    <div className="bg-white dark:bg-[#0F172A] rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-lg space-y-8 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Budget Architect Dashboard</span>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white font-sans">
            Visual Budget Optimization
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            Simulate target reductions or instruct Gemini to trim lodging/transit costs while preserving marquee experiences.
          </p>
        </div>

        {/* Current Cost Cards */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Total Budget
            </span>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              {itinerary.estimatedTotalBudget}
            </div>
            <span className="text-[11px] text-violet-600 dark:text-violet-400 font-semibold">
              ₹{perPersonCurrent.toLocaleString('en-IN')} / person
            </span>
          </div>
        </div>
      </div>

      {/* ================= Itemized Cost Breakdown Dashboard ================= */}
      <div className="space-y-4">
        <h4 className="text-xs uppercase tracking-wider font-bold text-slate-400 flex items-center gap-2">
          <span>Cost Allocation by Category</span>
          <span className="text-[10px] text-violet-500 font-mono">(Visual Progress)</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {categories.map((cat) => {
            const IconComp = cat.icon;
            return (
              <div
                key={cat.name}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-800 text-violet-600 dark:text-violet-400 shadow-2xs">
                    <IconComp className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {cat.pct}%
                  </span>
                </div>

                <div>
                  <h5 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                    {cat.name}
                  </h5>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    {cat.val}
                  </p>
                </div>

                <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${cat.color} rounded-full`}
                    style={{ width: `${cat.pct * 2.2}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= Interactive Slider & Presets (-15%, -25%, -35%) ================= */}
      <div className="grid md:grid-cols-2 gap-6 bg-slate-50 dark:bg-slate-900/80 p-5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800">
        
        {/* Left: Slider & Presets */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-violet-500" />
              <span>Target Budget Calibration</span>
            </label>
            <span className="text-lg font-extrabold text-violet-600 dark:text-violet-400">
              ₹{targetBudget.toLocaleString('en-IN')}
            </span>
          </div>

          <input
            type="range"
            min={Math.round(currentTotalNum * 0.4)}
            max={currentTotalNum}
            step={500}
            value={targetBudget}
            onChange={(e) => setTargetBudget(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-violet-600"
          />

          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Min: ₹{Math.round(currentTotalNum * 0.4).toLocaleString('en-IN')}</span>
            <span className="font-bold text-pink-600 dark:text-pink-400">
              -₹{(currentTotalNum - targetBudget).toLocaleString('en-IN')} Saved
            </span>
            <span>Current: ₹{currentTotalNum.toLocaleString('en-IN')}</span>
          </div>

          {/* Presets: -15%, -25%, -35% */}
          <div className="pt-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Optimization Presets
            </span>
            <div className="grid grid-cols-3 gap-2">
              {presets.map((p, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setTargetBudget(p.target);
                    handleRunOptimization(p.target);
                  }}
                  className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-left hover:border-violet-500 transition-colors cursor-pointer group shadow-2xs active:scale-95"
                >
                  <span className="text-xs font-bold text-slate-900 dark:text-white block group-hover:text-violet-500">
                    -{p.pct}%
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    ₹{p.target.toLocaleString('en-IN')}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Natural Language Optimization Command */}
        <div className="space-y-3 flex flex-col justify-between">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-violet-500" />
              <span>Natural-Language Constraints</span>
            </label>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Tell Gemini what not to remove (e.g. "Keep Solang Valley, change 4-star hotels to heritage homestays").
            </p>
            <textarea
              rows={3}
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              placeholder="e.g. Reduce to ₹18,000 without removing Solang Valley or river rafting; opt for homestays."
              className="w-full p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-violet-500 transition-all resize-none shadow-2xs"
            />
          </div>

          <button
            onClick={() => handleRunOptimization()}
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-violet-600 to-pink-500 hover:from-blue-700 hover:to-pink-600 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50 active:scale-95"
          >
            {loading ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin text-cyan-200" />
                <span>Gemini is balancing transit & stays...</span>
              </>
            ) : (
              <>
                <TrendingDown className="w-4 h-4 text-cyan-200" />
                <span>Optimize to ₹{targetBudget.toLocaleString('en-IN')} ✦</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ================= Result Display ================= */}
      {result && (
        <div className="p-6 rounded-3xl bg-violet-50/70 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-800 space-y-5 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-violet-600 text-white text-[10px] font-bold uppercase tracking-wider">
                  Success
                </span>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  Optimized Budget Plan Ready
                </h4>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                Potential savings unlocked: <strong className="text-pink-600 dark:text-pink-400">{result.savingsAmount}</strong>.
              </p>
            </div>

            <button
              onClick={handleApply}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-violet-600 to-pink-500 hover:from-blue-700 hover:to-pink-600 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0 active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>Apply to Current Itinerary View ✦</span>
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-violet-100 dark:border-violet-900/60 text-xs text-slate-700 dark:text-slate-300 space-y-1.5">
            <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[10px] block">
              Architect's Optimization Notes:
            </span>
            <p className="leading-relaxed whitespace-pre-line text-slate-600 dark:text-slate-300">
              {result.optimizationSummary}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">New Total Budget</span>
              <span className="text-base font-extrabold text-violet-600 dark:text-violet-400">{result.optimizedItinerary.estimatedTotalBudget}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Stays & Lodging</span>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{result.optimizedItinerary.budgetBreakdown.accommodation}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Transit Corridors</span>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{result.optimizedItinerary.budgetBreakdown.transport}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
