import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Bookmark, 
  Heart, 
  User, 
  Menu, 
  X, 
  LogOut, 
  ChevronDown,
  Sparkles,
  Sun,
  Moon,
  Lock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useFavorites } from '../../context/FavoritesContext';
import { usePreferences } from '../../context/PreferencesContext';
import { useTheme } from '../../context/ThemeContext';

interface NavbarProps {
  currentTab: 'home' | 'discover' | 'planner' | 'trips' | 'favorites';
  onNavigate: (tab: 'home' | 'discover' | 'planner' | 'trips' | 'favorites') => void;
  savedTripsCount: number;
  onOpenProfile: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onNavigate,
  savedTripsCount,
  onOpenProfile
}) => {
  const { user, openAuthModal, logout } = useAuth();
  const { favorites } = useFavorites();
  const { openPreferenceModal } = usePreferences();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleProtectedNavigation = (tabId: 'trips' | 'favorites') => {
    if (user) {
      onNavigate(tabId);
    } else {
      openAuthModal('signin', {
        title: 'Save your journey ✦',
        subtitle: 'Create an account or sign in to save trips, sync itineraries and access them from any device.',
        pendingAction: { type: 'navigate', payload: tabId }
      });
    }
  };

  const handleTasteProfileClick = () => {
    if (user) {
      openPreferenceModal();
    } else {
      openAuthModal('signin', {
        title: 'Save your journey ✦',
        subtitle: 'Create an account or sign in to save trips, sync itineraries and access them from any device.',
        pendingAction: { type: 'open_taste_profile' }
      });
    }
  };

  const navLinks: { id: 'discover' | 'planner' | 'trips' | 'favorites'; label: string; count?: number; isAi?: boolean; isProtected?: boolean }[] = [
    { id: 'discover', label: 'Discover' },
    { id: 'planner', label: 'AI Planner', isAi: true },
    { id: 'trips', label: 'My Trips', count: user && savedTripsCount > 0 ? savedTripsCount : undefined, isProtected: true },
    { id: 'favorites', label: 'Saved', count: user && favorites.length > 0 ? favorites.length : undefined, isProtected: true },
  ];

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-white/85 dark:bg-[#090D16]/90 backdrop-blur-xl shadow-xs border-b border-slate-200/80 dark:border-slate-800/80 py-3'
          : 'bg-white/60 dark:bg-[#090D16]/60 backdrop-blur-md border-b border-slate-100 dark:border-slate-800/40 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo Brand */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 group cursor-pointer focus:outline-hidden"
            aria-label="Travillo Home"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-violet-600 to-pink-500 p-[1.5px] shadow-sm group-hover:shadow-md group-hover:shadow-violet-500/20 transition-all duration-300">
              <div className="w-full h-full bg-white dark:bg-[#0F172A] rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-violet-600 dark:text-violet-400 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white font-sans">
                  TRAVILLO
                </span>
                <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">
                  AI
                </span>
              </div>
            </div>
          </button>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const isActive = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => {
                    if (link.isProtected) {
                      handleProtectedNavigation(link.id as 'trips' | 'favorites');
                    } else {
                      onNavigate(link.id);
                    }
                  }}
                  className={`relative px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/40 font-bold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-slate-800/60'
                  }`}
                >
                  {link.isAi && (
                    <Sparkles className={`w-3.5 h-3.5 ${isActive ? 'text-violet-600 dark:text-violet-400' : 'text-violet-500'}`} />
                  )}
                  <span>{link.label}</span>
                  {link.count !== undefined && (
                    <span className="ml-0.5 text-xs px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold tabular-nums">
                      {link.count}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-gradient-to-r from-blue-500 via-violet-500 to-pink-500 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Controls */}
          <div className="hidden md:flex items-center gap-2">
            {/* Quick Search trigger */}
            <button
              onClick={() => onNavigate('discover')}
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              title="Search India destinations"
              aria-label="Search destinations"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Travel DNA Button */}
            <button
              onClick={handleTasteProfileClick}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-violet-600 dark:hover:text-violet-400 bg-gradient-to-r from-blue-500/5 via-violet-500/10 to-pink-500/5 hover:from-blue-500/10 hover:to-pink-500/10 border border-violet-500/20 transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
              title="Personalize Travel DNA"
            >
              <Sparkles className="w-3.5 h-3.5 text-violet-500 animate-pulse" />
              <span>Travel DNA ✦</span>
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>

            {/* USER STATE: Logged In vs Logged Out */}
            {user ? (
              <div className="flex items-center gap-2">
                {/* User Profile avatar/name button */}
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 hover:border-violet-400 dark:hover:border-violet-500 transition-all cursor-pointer shadow-2xs"
                    aria-label="User profile menu"
                  >
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName || 'Profile'}
                        className="w-6 h-6 rounded-full object-cover ring-1 ring-violet-500/30"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-600 to-violet-600 text-white flex items-center justify-center font-bold text-[10px]">
                        {(user.displayName || user.email || 'T').charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 max-w-[100px] truncate">
                      {user.displayName || user.email?.split('@')[0]}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {/* Dropdown Menu */}
                  {userDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-60 bg-white dark:bg-[#111827] rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                      onMouseLeave={() => setUserDropdownOpen(false)}
                    >
                      <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {user.displayName || 'Traveler'}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                      </div>

                      <div className="py-1">
                        <button
                          onClick={() => { setUserDropdownOpen(false); onOpenProfile(); }}
                          className="w-full px-4 py-2 text-left text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2.5 cursor-pointer"
                        >
                          <User className="w-4 h-4 text-slate-400" />
                          <span>Profile & Stats</span>
                        </button>

                        <button
                          onClick={() => { setUserDropdownOpen(false); openPreferenceModal(); }}
                          className="w-full px-4 py-2 text-left text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2.5 cursor-pointer"
                        >
                          <Sparkles className="w-4 h-4 text-violet-500" />
                          <span>Travel DNA ✦</span>
                        </button>

                        <button
                          onClick={() => { setUserDropdownOpen(false); onNavigate('trips'); }}
                          className="w-full px-4 py-2 text-left text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between cursor-pointer"
                        >
                          <span className="flex items-center gap-2.5">
                            <Bookmark className="w-4 h-4 text-slate-400" />
                            <span>My Trips</span>
                          </span>
                          {savedTripsCount > 0 && (
                            <span className="text-[11px] font-bold text-violet-600 dark:text-violet-400 tabular-nums">
                              {savedTripsCount}
                            </span>
                          )}
                        </button>

                        <button
                          onClick={() => { setUserDropdownOpen(false); onNavigate('favorites'); }}
                          className="w-full px-4 py-2 text-left text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between cursor-pointer"
                        >
                          <span className="flex items-center gap-2.5">
                            <Heart className="w-4 h-4 text-rose-500" />
                            <span>Saved (Wishlist)</span>
                          </span>
                          {favorites.length > 0 && (
                            <span className="text-[11px] font-bold text-rose-500 tabular-nums">
                              {favorites.length}
                            </span>
                          )}
                        </button>
                      </div>

                      <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
                        <button
                          onClick={() => { setUserDropdownOpen(false); logout(); }}
                          className="w-full px-4 py-2 text-left text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2.5 cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Direct Navbar Logout Button */}
                <button
                  onClick={logout}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50/60 dark:hover:bg-rose-950/30 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                  title="Sign out of Travillo"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              /* When logged out: Sign In and Create Account */
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openAuthModal('signin')}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  onClick={() => openAuthModal('signup')}
                  className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-blue-600 via-violet-600 to-pink-500 hover:from-blue-700 hover:to-pink-600 rounded-xl shadow-xs hover:shadow-md hover:shadow-violet-500/20 transition-all cursor-pointer whitespace-nowrap active:scale-95"
                >
                  Create Account
                </button>
              </div>
            )}
          </div>

          {/* Mobile Right Controls */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => onNavigate('discover')}
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#090D16]/95 backdrop-blur-xl px-4 pt-3 pb-6 animate-in slide-in-from-top-2 duration-150 space-y-2">
          {navLinks.map((link) => {
            const isActive = currentTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (link.isProtected) {
                    handleProtectedNavigation(link.id as 'trips' | 'favorites');
                  } else {
                    onNavigate(link.id);
                  }
                }}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-between cursor-pointer ${
                  isActive
                    ? 'bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 font-bold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span className="flex items-center gap-2">
                  {link.isAi && <Sparkles className="w-4 h-4 text-violet-500" />}
                  <span>{link.label}</span>
                </span>
                {link.count !== undefined ? (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 font-bold">
                    {link.count}
                  </span>
                ) : link.isProtected && !user ? (
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                ) : null}
              </button>
            );
          })}

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleTasteProfileClick();
              }}
              className="w-full text-left px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-violet-500" />
              <span>Travel DNA ✦</span>
            </button>

            {user ? (
              <>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenProfile();
                  }}
                  className="w-full text-left px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  <span>Profile & Stats ({user.displayName || user.email?.split('@')[0]})</span>
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full text-left px-4 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 pt-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAuthModal('signin');
                  }}
                  className="w-full py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl text-center hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAuthModal('signup');
                  }}
                  className="w-full py-2.5 text-xs font-bold text-white bg-gradient-to-r from-blue-600 via-violet-600 to-pink-500 rounded-xl text-center shadow-md shadow-violet-500/20"
                >
                  Create Account
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
