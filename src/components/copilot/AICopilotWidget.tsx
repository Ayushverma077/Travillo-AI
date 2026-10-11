import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  ArrowRight, 
  Check, 
  ChevronRight, 
  Bot,
  MapPin,
  TrendingDown,
  Compass,
  Zap,
  Minimize2
} from 'lucide-react';
import { CopilotMessage, Itinerary } from '../../types';
import { usePreferences } from '../../context/PreferencesContext';

interface AICopilotWidgetProps {
  activeItinerary: Itinerary | null;
  currentDestinationName?: string;
  onApplyModifiedItinerary?: (updatedItinerary: Itinerary) => void;
  onTriggerPlan?: (dest: string, days: number, budget?: string) => void;
  onSelectDestination?: (destName: string) => void;
}

export const AICopilotWidget: React.FC<AICopilotWidgetProps> = ({
  activeItinerary,
  currentDestinationName,
  onApplyModifiedItinerary,
  onTriggerPlan,
  onSelectDestination,
}) => {
  const { preferences } = usePreferences();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Namaste! I am your Travillo AI Copilot. Ask me to refine day-by-day stops, optimize budgets, discover peaceful retreats near ${preferences.homeCity || 'Delhi'}, or adapt for weather!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Suggestion chips depending on whether an itinerary is currently open
  const quickPrompts = activeItinerary
    ? [
        { label: '📉 Make this trip cheaper', prompt: 'Make this trip cheaper by optimizing stays and transit' },
        { label: '🧗 Replace Day 2 with adventure', prompt: 'Replace Day 2 with high-adrenaline adventure activities' },
        { label: '🥗 Add vegetarian restaurants', prompt: 'Add authentic vegetarian restaurants to the food recommendations' },
        { label: '🌧️ Weather plan for rain', prompt: 'Adapt this itinerary for rainy or overcast weather' },
      ]
    : [
        { label: '🏔️ Plan Manali under ₹20k', prompt: 'Plan Manali for 5 days under ₹20k' },
        { label: '🧘 Peaceful places near Delhi', prompt: 'Suggest peaceful quiet places near Delhi' },
        { label: '🌊 4-day Goa heritage & beaches', prompt: 'Plan a 4-day South Goa relaxed beach & heritage trip' },
        { label: '☕ Coorg coffee & waterfalls', prompt: 'Plan 3 days in Coorg coffee plantations' },
      ];

  const handleSend = async (userPrompt?: string) => {
    const textToSend = userPrompt || input.trim();
    if (!textToSend || loading) return;

    const userMsg: CopilotMessage = {
      id: `msg_${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!userPrompt) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/copilot-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          activeItinerary: activeItinerary || null,
          currentDestination: currentDestinationName || null,
          userPreferences: preferences,
          history: messages.slice(-4)
        })
      });

      if (!res.ok) throw new Error('Copilot error');

      const data = await res.json();
      const botMsg: CopilotMessage = {
        id: `bot_${Date.now()}`,
        sender: 'assistant',
        text: data.reply || "Here's what I recommend for your Indian journey.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionPayload: data.actionType !== 'none' ? {
          type: data.actionType,
          itinerary: data.modifiedItinerary,
          destinationName: data.planTrigger?.destination,
          duration: data.planTrigger?.duration,
          budget: data.planTrigger?.budget,
          suggestedDestinations: data.suggestedDestinations
        } : undefined
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      const fallbackMsg: CopilotMessage = {
        id: `bot_${Date.now()}`,
        sender: 'assistant',
        text: "I experienced a brief connection blip, but I'm ready to assist. You can ask me to optimize your budget, customize specific days, or suggest calm getaways!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ================= Floating "✦ Ask Travillo" Trigger Button ================= */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 md:bottom-6 right-5 md:right-6 z-50 p-[1.5px] rounded-full bg-gradient-to-r from-blue-600 via-violet-600 to-pink-500 shadow-xl shadow-violet-500/25 hover:shadow-2xl hover:shadow-violet-500/40 hover:scale-105 active:scale-95 transition-all duration-300 group cursor-pointer"
          aria-label="Ask Travillo AI Copilot"
        >
          <div className="flex items-center gap-2.5 px-4 sm:px-5 py-3 rounded-full bg-slate-950 text-white font-sans">
            <div className="relative flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-violet-400 group-hover:rotate-12 group-hover:text-pink-400 transition-all duration-300 animate-pulse" />
              <span className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-pink-400 absolute -top-1 -right-1 animate-ping" />
            </div>
            <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold tracking-tight">
              <span className="text-white">✦ Ask Travillo</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 font-mono">
                AI
              </span>
            </div>
          </div>
        </button>
      )}

      {/* ================= Redesigned Copilot Window ================= */}
      {isOpen && (
        <div className="fixed bottom-16 md:bottom-6 right-3 md:right-6 z-50 w-[calc(100vw-1.5rem)] sm:w-[420px] max-h-[640px] h-[85vh] bg-white dark:bg-[#0F172A] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          
          {/* Header with Aurora AI Gradient */}
          <div className="p-4 bg-gradient-to-r from-blue-700 via-violet-800 to-purple-900 text-white flex items-center justify-between shrink-0 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-pink-500/20 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center gap-3 relative z-10">
              <div className="w-9 h-9 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-cyan-200 border border-white/20">
                <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: '8s' }} />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-bold tracking-tight text-white">✦ Travillo Copilot</h4>
                  <span className="px-1.5 py-0.2 rounded-md bg-white/20 text-[9px] font-mono text-cyan-200">
                    Gemini 3.8
                  </span>
                </div>
                {/* Current Trip Awareness Indicator */}
                <p className="text-[11px] text-cyan-200/90 flex items-center gap-1 mt-0.5 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  {activeItinerary 
                    ? `Context: ${activeItinerary.destination} (${activeItinerary.days?.length || 4} Days)` 
                    : `Global Mode · India Travel Reasoning`}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/15 transition-colors cursor-pointer relative z-10"
              title="Close Copilot"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50 dark:bg-[#090D16]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-2xs ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-blue-600 via-violet-600 to-pink-500 text-white rounded-tr-xs font-medium'
                      : 'bg-white dark:bg-[#1E293B] text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/80 rounded-tl-xs'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  {/* Contextual Action Payloads */}
                  {msg.actionPayload?.type === 'modify_itinerary' && msg.actionPayload.itinerary && (
                    <div className="mt-3 p-3 rounded-2xl bg-violet-50 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-800/60 text-slate-900 dark:text-slate-100 space-y-2">
                      <div className="flex items-center gap-1.5 text-violet-700 dark:text-violet-300 font-bold text-[11px]">
                        <Check className="w-3.5 h-3.5 text-violet-600" />
                        <span>Itinerary Optimized by AI</span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300">
                        New Budget: <strong>{msg.actionPayload.itinerary.estimatedTotalBudget}</strong>
                      </p>
                      <button
                        onClick={() => {
                          if (onApplyModifiedItinerary && msg.actionPayload?.itinerary) {
                            onApplyModifiedItinerary(msg.actionPayload.itinerary);
                          }
                        }}
                        className="w-full py-2 rounded-xl bg-gradient-to-r from-blue-600 via-violet-600 to-pink-500 text-white font-bold text-[11px] cursor-pointer transition-all shadow-xs hover:shadow-md active:scale-95"
                      >
                        Apply to Current Itinerary View ✦
                      </button>
                    </div>
                  )}

                  {msg.actionPayload?.type === 'trigger_plan' && msg.actionPayload.destinationName && (
                    <div className="mt-3 p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-white text-[11px]">
                          {msg.actionPayload.destinationName}
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                          {msg.actionPayload.duration || 4} Days
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          if (onTriggerPlan && msg.actionPayload?.destinationName) {
                            onTriggerPlan(
                              msg.actionPayload.destinationName,
                              msg.actionPayload.duration || 4,
                              msg.actionPayload.budget || 'Moderate'
                            );
                            setIsOpen(false);
                          }
                        }}
                        className="w-full py-2 rounded-xl bg-gradient-to-r from-blue-600 via-violet-600 to-pink-500 text-white font-bold text-[11px] cursor-pointer transition-all flex items-center justify-center gap-1.5 active:scale-95 shadow-xs"
                      >
                        <span>Open & Generate in Trip Planner</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {msg.actionPayload?.type === 'suggest_destinations' && msg.actionPayload.suggestedDestinations && (
                    <div className="mt-3 space-y-2 w-full">
                      {msg.actionPayload.suggestedDestinations.map((dest, i) => (
                        <div key={i} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-left">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900 dark:text-white text-[11px]">{dest.name}</span>
                            <span className="text-[9px] text-violet-600 dark:text-violet-400 font-semibold">{dest.estimatedBudget}</span>
                          </div>
                          <p className="text-[10px] text-slate-600 dark:text-slate-300 mt-0.5 leading-snug">{dest.reason}</p>
                          <button
                            onClick={() => {
                              if (onTriggerPlan) {
                                onTriggerPlan(dest.name, 4, 'Moderate');
                                setIsOpen(false);
                              }
                            }}
                            className="mt-1.5 text-[10px] text-violet-600 dark:text-violet-400 hover:text-violet-700 font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <span>Plan this trip ✦</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <span className="text-[9px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
              </div>
            ))}

            {/* AI Typing / Generation Pulsing Animation */}
            {loading && (
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs w-fit shadow-xs animate-ai-pulse">
                <Sparkles className="w-3.5 h-3.5 text-violet-500 animate-spin" />
                <span className="font-medium">Gemini is reasoning about routes & budget...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestion Chips */}
          <div className="px-3 py-2 bg-slate-100/80 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 overflow-x-auto flex gap-1.5 no-scrollbar shrink-0">
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(qp.prompt)}
                disabled={loading}
                className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer shadow-2xs hover:border-violet-500"
              >
                {qp.label}
              </button>
            ))}
          </div>

          {/* Chat Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white dark:bg-[#0F172A] border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Copilot (e.g. Make this trip cheaper)..."
              disabled={loading}
              className="flex-1 px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-violet-500 focus:bg-white dark:focus:bg-slate-800 transition-all font-medium"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2.5 bg-gradient-to-r from-blue-600 via-violet-600 to-pink-500 hover:from-blue-700 hover:to-pink-600 disabled:opacity-40 text-white rounded-xl transition-all cursor-pointer shrink-0 shadow-sm active:scale-95"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </>
  );
};
