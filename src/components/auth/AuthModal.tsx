import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  AlertCircle, 
  Compass, 
  ArrowRight, 
  Loader2, 
  ExternalLink,
  ShieldAlert,
  Eye,
  EyeOff,
  CheckCircle2,
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AuthModal: React.FC = () => {
  const {
    authModalOpen,
    closeAuthModal,
    authModalMode,
    setAuthModalMode,
    modalTitle,
    modalSubtitle,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    resetPassword,
    authError,
    clearAuthError,
    showToast
  } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  if (!authModalOpen) return null;

  const resetFormState = () => {
    setEmail('');
    setPassword('');
    setName('');
    setShowPassword(false);
    setIsForgotPassword(false);
    setResetSent(false);
    setLocalError(null);
    clearAuthError();
  };

  const handleClose = () => {
    resetFormState();
    closeAuthModal();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearAuthError();

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setLocalError('Please enter your email address.');
      return;
    }

    if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setLocalError('Please provide a valid email address.');
      return;
    }

    if (!password) {
      setLocalError('Please enter your password.');
      return;
    }

    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters long.');
      return;
    }

    if (authModalMode === 'signup' && !name.trim()) {
      setLocalError('Please enter your name.');
      return;
    }

    setLoading(true);
    try {
      if (authModalMode === 'signup') {
        await signUpWithEmail(cleanEmail, password, name.trim());
        showToast('Account created successfully! Welcome to Travillo ✦', 'success');
      } else {
        await signInWithEmail(cleanEmail, password);
        showToast('Signed in successfully! Welcome back ✦', 'success');
      }
      resetFormState();
    } catch {
      // Error handled by AuthContext
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLocalError(null);
    clearAuthError();
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      showToast('Signed in with Google! Welcome to Travillo ✦', 'success');
      resetFormState();
    } catch {
      // Error handled by AuthContext
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearAuthError();

    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setLocalError('Please enter a valid email address to receive the password reset link.');
      return;
    }

    setResetLoading(true);
    try {
      await resetPassword(cleanEmail);
      setResetSent(true);
      showToast('Password reset link sent to your email ✓', 'info');
    } catch {
      // Error handled by AuthContext
    } finally {
      setResetLoading(false);
    }
  };

  const activeTitle = modalTitle || (authModalMode === 'signup' ? 'Start Your Journey ✦' : 'Save your journey ✦');
  const activeSubtitle = modalSubtitle || 'Create an account or sign in to save trips, sync itineraries and access them from any device.';

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      onClick={handleClose}
    >
      <div 
        className="relative w-full max-w-md bg-white dark:bg-[#0F172A] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[94vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow Header Accent Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-violet-600 to-pink-500 shrink-0" />

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
          aria-label="Close authentication modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="p-6 sm:p-7 pb-5 text-center border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/50 shrink-0">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-violet-600 to-pink-500 text-white shadow-md shadow-violet-500/25 mb-3">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>

          <h3 id="auth-modal-title" className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight font-sans">
            {isForgotPassword ? 'Reset Password' : activeTitle}
          </h3>

          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed max-w-sm mx-auto">
            {isForgotPassword 
              ? 'Enter your registered email address and we will send you a link to reset your password.'
              : activeSubtitle}
          </p>

          {/* Mode Switch Tabs (hidden during forgot password mode) */}
          {!isForgotPassword && (
            <div className="flex p-1 mt-5 bg-slate-200/80 dark:bg-slate-800 rounded-xl" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={authModalMode === 'signin'}
                onClick={() => { setAuthModalMode('signin'); setLocalError(null); clearAuthError(); }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  authModalMode === 'signin'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={authModalMode === 'signup'}
                onClick={() => { setAuthModalMode('signup'); setLocalError(null); clearAuthError(); }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  authModalMode === 'signup'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Create Account
              </button>
            </div>
          )}
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-7 pt-5 space-y-4 overflow-y-auto">
          {/* Identity Toolkit Guidance Banner if needed */}
          {authError?.helpLink && (
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-2">
              <div className="flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wide">
                    Google Identity API Notice
                  </h4>
                  <p className="text-xs text-amber-800 dark:text-amber-300 mt-0.5 leading-relaxed">
                    {authError.message}
                  </p>
                </div>
              </div>

              <a
                href={authError.helpLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 px-3 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Enable Identity Toolkit in GCP Console</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          {/* Standard Error Notice */}
          {(localError || (authError && !authError.helpLink)) && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2.5 animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{localError || authError?.message}</span>
            </div>
          )}

          {/* ================= FORGOT PASSWORD VIEW ================= */}
          {isForgotPassword ? (
            <div className="space-y-4 animate-in fade-in duration-200">
              {resetSent ? (
                <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                    Password Reset Email Sent
                  </h4>
                  <p className="text-xs text-emerald-700 dark:text-emerald-300 leading-relaxed">
                    We have dispatched a password recovery link to <span className="font-semibold">{email}</span>. Please verify your inbox and spam folder.
                  </p>
                  <button
                    type="button"
                    onClick={() => { setIsForgotPassword(false); setResetSent(false); }}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    Return to Sign In
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotPasswordSubmit} className="space-y-3.5" noValidate>
                  <div>
                    <label htmlFor="reset-email" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Registered Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" aria-hidden="true" />
                      <input
                        id="reset-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@domain.com"
                        autoComplete="email"
                        className="w-full pl-10 pr-4 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 via-violet-600 to-pink-500 hover:from-blue-700 hover:to-pink-600 text-white text-xs font-bold rounded-xl shadow-md shadow-violet-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer active:scale-95"
                  >
                    {resetLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <span>Send Password Reset Link ✦</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => { setIsForgotPassword(false); setLocalError(null); }}
                    className="w-full py-2 text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Sign In</span>
                  </button>
                </form>
              )}
            </div>
          ) : (
            /* ================= REGULAR SIGN IN / SIGN UP VIEW ================= */
            <>
              {/* Google Sign-In Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={googleLoading || loading}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 transition-all shadow-2xs hover:shadow-xs disabled:opacity-60 cursor-pointer"
              >
                {googleLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-slate-600 dark:text-slate-300" />
                ) : (
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                )}
                <span>Continue with Google</span>
              </button>

              {/* Divider */}
              <div className="relative flex items-center justify-center my-3">
                <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
                <span className="absolute px-3 bg-white dark:bg-[#0F172A] text-[11px] text-slate-400 uppercase tracking-wider font-bold">
                  Or with email
                </span>
              </div>

              {/* Email / Password Form */}
              <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
                {authModalMode === 'signup' && (
                  <div>
                    <label htmlFor="auth-name" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" aria-hidden="true" />
                      <input
                        id="auth-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Maya Chen"
                        className="w-full pl-10 pr-4 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label htmlFor="auth-email" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" aria-hidden="true" />
                    <input
                      id="auth-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@domain.com"
                      autoComplete="email"
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="auth-password" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Password
                    </label>
                    {authModalMode === 'signin' && (
                      <button
                        type="button"
                        onClick={() => { setIsForgotPassword(true); setLocalError(null); }}
                        className="text-[11px] font-semibold text-violet-600 dark:text-violet-400 hover:underline cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" aria-hidden="true" />
                    <input
                      id="auth-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={authModalMode === 'signup' ? 'At least 6 characters' : 'Enter your password'}
                      autoComplete={authModalMode === 'signup' ? 'new-password' : 'current-password'}
                      className="w-full pl-10 pr-10 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 text-slate-900 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Primary Submit Button */}
                <button
                  type="submit"
                  disabled={loading || googleLoading}
                  className="w-full mt-2 py-3 bg-gradient-to-r from-blue-600 via-violet-600 to-pink-500 hover:from-blue-700 hover:to-pink-600 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-violet-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer active:scale-95"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                  ) : (
                    <>
                      <span>{authModalMode === 'signin' ? 'Sign In ✦' : 'Create Account ✦'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Mode switch helper footer */}
              <div className="text-center pt-2">
                {authModalMode === 'signin' ? (
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => { setAuthModalMode('signup'); setLocalError(null); clearAuthError(); }}
                      className="font-bold text-violet-600 dark:text-violet-400 hover:underline cursor-pointer"
                    >
                      Create Account
                    </button>
                  </p>
                ) : (
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => { setAuthModalMode('signin'); setLocalError(null); clearAuthError(); }}
                      className="font-bold text-violet-600 dark:text-violet-400 hover:underline cursor-pointer"
                    >
                      Sign In
                    </button>
                  </p>
                )}
              </div>
            </>
          )}

          {/* Dismiss button */}
          <div className="text-center pt-1">
            <button
              type="button"
              onClick={handleClose}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
            >
              Cancel and return to app
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
