import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  CloudRain, 
  Sun, 
  Snowflake, 
  Compass, 
  Check, 
  Utensils, 
  ShieldAlert, 
  Flame,
  Plus
} from 'lucide-react';
import { DayPlan } from '../../types';

interface DayEditModalProps {
  day: DayPlan;
  destination: string;
  isOpen: boolean;
  onClose: () => void;
  onSaveDay: (updatedDay: DayPlan) => void;
}

export const DayEditModal: React.FC<DayEditModalProps> = ({
  day,
  destination,
  isOpen,
  onClose,
  onSaveDay
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'quick' | 'weather' | 'custom'>('quick');
  const [selectedWeather, setSelectedWeather] = useState<'Monsoon Rain' | 'Winter Snow' | 'Summer Heat' | 'Foggy / Chill'>('Monsoon Rain');
  const [customPrompt, setCustomPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [previewDay, setPreviewDay] = useState<DayPlan | null>(null);
  const [notes, setNotes] = useState<string | null>(null);

  const weatherScenarios = [
    { id: 'Monsoon Rain', label: '🌧️ Monsoon Showers', desc: 'Swap open treks for covered palaces & spice arcades' },
    { id: 'Winter Snow', label: '❄️ Winter Snow / Chill', desc: 'Cozy fireside cafes & scenic heated drives' },
    { id: 'Summer Heat', label: '☀️ Peak Midday Heat', desc: 'Early morning excursions & indoor heritage galleries' },
    { id: 'Foggy / Chill', label: '🌫️ Misty Mountain Fog', desc: 'Tea tasting, temple bells & botanical walks' },
  ];

  const handleModify = async (actionType: string, customInstruction?: string, weatherCond?: string) => {
    setLoading(true);
    setNotes(null);
    try {
      const res = await fetch('/api/modify-day', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dayPlan: previewDay || day,
          destination,
          actionType,
          customInstruction: customInstruction || customPrompt,
          weatherCondition: weatherCond || selectedWeather
        })
      });

      if (!res.ok) throw new Error('Failed to modify day');
      const data = await res.json();
      setPreviewDay(data.updatedDay);
      setNotes(data.reasoning);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmSave = () => {
    if (previewDay) {
      onSaveDay(previewDay);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full border border-neutral-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-[#12372A] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-800 text-white flex items-center justify-center font-bold text-sm">
              D{day.dayNumber}
            </div>
            <div>
              <h3 className="text-lg font-bold font-serif-heading">
                Refine Day {day.dayNumber}: {day.title}
              </h3>
              <p className="text-xs text-emerald-200/80">
                Adapt for weather, switch paces, or request custom activities with Gemini
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-emerald-200/80 hover:text-white hover:bg-emerald-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Modes Navigation */}
        <div className="p-3 bg-[#FAF9F6] border-b border-neutral-200 flex gap-2">
          <button
            onClick={() => setActiveTab('quick')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
              activeTab === 'quick'
                ? 'bg-[#12372A] text-white'
                : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            ⚡ Quick Re-rolls
          </button>
          <button
            onClick={() => setActiveTab('weather')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5 ${
              activeTab === 'weather'
                ? 'bg-[#12372A] text-white'
                : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5 text-blue-500" />
            <span>Weather Adaptation</span>
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
              activeTab === 'custom'
                ? 'bg-[#12372A] text-white'
                : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            ✏️ Custom AI Prompt
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-neutral-700 flex-1">
          {/* Tab 1: Quick Actions */}
          {activeTab === 'quick' && (
            <div className="space-y-4">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                Instant AI Transformations
              </span>
              <div className="grid sm:grid-cols-2 gap-3">
                <button
                  onClick={() => handleModify('regenerate')}
                  disabled={loading}
                  className="p-4 rounded-2xl bg-neutral-50 hover:bg-emerald-50/50 border border-neutral-200 hover:border-emerald-700 text-left transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2 font-bold text-neutral-900 group-hover:text-emerald-900">
                    <Sparkles className="w-4 h-4 text-emerald-700" />
                    <span>Regenerate Day Completely</span>
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-1">
                    Fresh curation of morning temple trails, regional food & sunset spots.
                  </p>
                </button>

                <button
                  onClick={() => handleModify('adventure')}
                  disabled={loading}
                  className="p-4 rounded-2xl bg-neutral-50 hover:bg-amber-50/50 border border-neutral-200 hover:border-amber-700 text-left transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2 font-bold text-neutral-900 group-hover:text-amber-900">
                    <Flame className="w-4 h-4 text-amber-700" />
                    <span>Infuse High Adventure</span>
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-1">
                    Swap slow walks for rapids, cliff vantage points & rugged excursions.
                  </p>
                </button>

                <button
                  onClick={() => handleModify('peaceful')}
                  disabled={loading}
                  className="p-4 rounded-2xl bg-neutral-50 hover:bg-teal-50/50 border border-neutral-200 hover:border-teal-700 text-left transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2 font-bold text-neutral-900 group-hover:text-teal-900">
                    <Compass className="w-4 h-4 text-teal-700" />
                    <span>Slow & Peaceful Day</span>
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-1">
                    Leisurely breakfast, riverside benches, silent meditation & pine cafes.
                  </p>
                </button>

                <button
                  onClick={() => handleModify('vegetarian')}
                  disabled={loading}
                  className="p-4 rounded-2xl bg-neutral-50 hover:bg-green-50/50 border border-neutral-200 hover:border-green-700 text-left transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2 font-bold text-neutral-900 group-hover:text-green-900">
                    <Utensils className="w-4 h-4 text-green-700" />
                    <span>Pure Vegetarian & Food Tour</span>
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-1">
                    Highlight famous heritage pure-veg bhojanalayas & street snacks.
                  </p>
                </button>
              </div>
            </div>
          )}

          {/* Tab 2: Weather Adaptation */}
          {activeTab === 'weather' && (
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                  Simulate Weather Scenario for Day {day.dayNumber}
                </span>
                <p className="text-[11px] text-neutral-500">
                  Gemini will swap exposed outdoor activities with sheltered cultural alternatives while retaining the destination's magic.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                {weatherScenarios.map((w) => (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => setSelectedWeather(w.id as any)}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      selectedWeather === w.id
                        ? 'bg-blue-50/70 border-blue-600 text-blue-900 shadow-xs'
                        : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    <div className="font-bold text-xs">{w.label}</div>
                    <div className="text-[10px] text-neutral-500 mt-0.5">{w.desc}</div>
                  </button>
                ))}
              </div>

              <button
                onClick={() => handleModify('weather_adapt', undefined, selectedWeather)}
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin text-blue-200" />
                    <span>Adapting activities for {selectedWeather}...</span>
                  </>
                ) : (
                  <>
                    <CloudRain className="w-4 h-4 text-blue-200" />
                    <span>Apply Weather-Resilient Alternatives</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Tab 3: Custom AI Prompt */}
          {activeTab === 'custom' && (
            <div className="space-y-3">
              <div>
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                  Custom AI Instruction for Day {day.dayNumber}
                </span>
                <p className="text-[11px] text-neutral-500">
                  Tell Gemini exactly what you want to change (e.g. "Replace afternoon trek with pottery workshop").
                </p>
              </div>

              <textarea
                rows={4}
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="e.g. In the afternoon, include a visit to the local Tibetan monastery and add a momo-making class."
                className="w-full p-3 rounded-2xl bg-white border border-neutral-200 text-xs text-neutral-800 focus:outline-hidden focus:ring-2 focus:ring-[#12372A]"
              />

              <button
                onClick={() => handleModify('custom', customPrompt)}
                disabled={loading || !customPrompt.trim()}
                className="w-full py-3 px-4 rounded-xl bg-[#12372A] hover:bg-[#0c241c] text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin text-emerald-300" />
                    <span>Rewriting day schedule...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-emerald-300" />
                    <span>Update Day {day.dayNumber}</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Modified Preview Section */}
          {previewDay && (
            <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-md bg-emerald-800 text-white font-bold text-[10px] uppercase">
                  AI Preview
                </span>
                <span className="text-[11px] text-neutral-500 font-medium">
                  {previewDay.estimatedDailyCost}
                </span>
              </div>

              <h4 className="font-bold text-sm text-neutral-900 font-serif-heading">
                {previewDay.title}
              </h4>

              {notes && (
                <p className="text-[11px] text-emerald-900 bg-white/70 p-2.5 rounded-xl border border-emerald-100 leading-relaxed">
                  💡 {notes}
                </p>
              )}

              <div className="space-y-1.5 text-[11px] text-neutral-700">
                <div><strong>Morning:</strong> {previewDay.morning}</div>
                <div><strong>Afternoon:</strong> {previewDay.afternoon}</div>
                <div><strong>Evening:</strong> {previewDay.evening}</div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#FAF9F6] border-t border-neutral-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-neutral-500 hover:text-neutral-800 font-semibold cursor-pointer"
          >
            Cancel
          </button>

          {previewDay && (
            <button
              onClick={handleConfirmSave}
              className="px-6 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Save Changes to Itinerary</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
