import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const ToastNotification: React.FC = () => {
  const { toast, dismissToast } = useAuth();

  if (!toast) return null;

  const isSuccess = toast.type === 'success' || !toast.type;
  const isError = toast.type === 'error';

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto max-w-md w-auto animate-in fade-in slide-in-from-top-4 duration-300">
      <div className={`flex items-center gap-3 px-5 py-3 rounded-2xl shadow-xl backdrop-blur-xl border text-sm font-medium transition-all ${
        isSuccess
          ? 'bg-slate-900/90 text-white border-violet-500/30 shadow-violet-500/10'
          : isError
          ? 'bg-rose-950/90 text-rose-100 border-rose-500/40 shadow-rose-500/10'
          : 'bg-slate-900/90 text-slate-100 border-slate-700/60 shadow-slate-900/10'
      }`}>
        {isSuccess && (
          <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
        )}
        {isError && (
          <div className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
            <AlertCircle className="w-4 h-4 text-rose-400" />
          </div>
        )}
        {!isSuccess && !isError && (
          <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
            <Info className="w-4 h-4 text-blue-400" />
          </div>
        )}

        <span className="text-xs sm:text-sm font-semibold tracking-wide">
          {toast.message}
        </span>

        <button
          onClick={dismissToast}
          className="p-1 -mr-1 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer ml-2"
          aria-label="Dismiss notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
