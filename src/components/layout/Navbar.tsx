import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Bookmark, 
  Heart, 
  User, 
  Menu, 
  X, 
  LogOut, 
  ChevronDown 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useFavorites } from '../../context/FavoritesContext';

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks: { id: 'discover' | 'planner' | 'trips' | 'favorites'; label: string; count?: number }[] = [
    { id: 'discover', label: 'Discover' },
    { id: 'planner', label: 'AI Planner' },
    { id: 'trips', label: 'My Trips', count: savedTripsCount > 0 ? savedTripsCount : undefined },
    { id: 'favorites', label: 'Wishlist', count: favorites.length > 0 ? favorites.length : undefined },
  ];

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-200 ${
        scrolled
          ? 'bg-[#F7F5F0]/95 backdrop-blur-md shadow-[0_1px_3px_rgba(0,0,0,0.04)] border-b border-black/[0.06] py-3.5'
          : 'bg-[#F7F5F0]/80 backdrop-blur-xs border-b border-black/[0.04] py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={() => onNavigate('home')}
            className="text-left group cursor-pointer focus:outline-none"
            aria-label="Travillo Home"
          >
            <span className="text-xl sm:text-2xl font-serif font-bold tracking-[0.16em] text-[#171717] group-hover:text-[#12372A] transition-colors">
              TRAVILLO
            </span>
          </button>

          {/* Zone 2: 4 clean text navigation links */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-10 text-sm font-medium text-[#525252]">
            {navLinks.map((link) => {
              const isActive = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => onNavigate(link.id)}
                  className={`relative py-1 transition-colors cursor-pointer text-sm tracking-wide ${
                    isActive
                      ? 'text-[#12372A] font-semibold'
                      : 'hover:text-[#171717]'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.count !== undefined && (
                    <span className="ml-1 text-xs text-[#737373] tabular-nums">
                      ({link.count})
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute -bottom-1.5 left-0 right-0 h-[2px] bg-[#12372A] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Actions (Search & Auth) */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => onNavigate('discover')}
              className="p-2 text-[#737373] hover:text-[#171717] hover:bg-black/[0.03] rounded-xl transition-colors cursor-pointer"
              title="Search India destinations"
              aria-label="Search destinations"
            >
              <Search className="w-4 h-4" />
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-full border border-black/[0.08] bg-white hover:border-black/[0.15] transition-colors cursor-pointer"
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'Profile'}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-[#12372A] text-white flex items-center justify-center font-bold text-[10px]">
                      {(user.displayName || user.email || 'T').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="text-xs font-medium text-[#171717] max-w-[110px] truncate">
                    {user.displayName || user.email?.split('@')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#737373]" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-lg border border-black/[0.08] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-black/[0.06]">
                      <p className="text-xs font-semibold text-[#171717] truncate">
                        {user.displayName || 'Traveler'}
                      </p>
                      <p className="text-[11px] text-[#737373] truncate">{user.email}</p>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => { setUserDropdownOpen(false); onOpenProfile(); }}
                        className="w-full px-4 py-2 text-left text-xs font-medium text-[#374151] hover:bg-[#F7F5F0] flex items-center gap-2.5 cursor-pointer"
                      >
                        <User className="w-4 h-4 text-[#737373]" />
                        <span>Profile & Stats</span>
                      </button>

                      <button
                        onClick={() => { setUserDropdownOpen(false); onNavigate('trips'); }}
                        className="w-full px-4 py-2 text-left text-xs font-medium text-[#374151] hover:bg-[#F7F5F0] flex items-center justify-between cursor-pointer"
                      >
                        <span className="flex items-center gap-2.5">
                          <Bookmark className="w-4 h-4 text-[#737373]" />
                          <span>My Saved Trips</span>
                        </span>
                        {savedTripsCount > 0 && (
                          <span className="text-[11px] font-semibold text-[#12372A] tabular-nums">
                            {savedTripsCount}
                          </span>
                        )}
                      </button>

                      <button
                        onClick={() => { setUserDropdownOpen(false); onNavigate('favorites'); }}
                        className="w-full px-4 py-2 text-left text-xs font-medium text-[#374151] hover:bg-[#F7F5F0] flex items-center justify-between cursor-pointer"
                      >
                        <span className="flex items-center gap-2.5">
                          <Heart className="w-4 h-4 text-[#737373]" />
                          <span>Wishlist</span>
                        </span>
                        {favorites.length > 0 && (
                          <span className="text-[11px] font-semibold text-[#12372A] tabular-nums">
                            {favorites.length}
                          </span>
                        )}
                      </button>
                    </div>

                    <div className="border-t border-black/[0.06] pt-1">
                      <button
                        onClick={() => { setUserDropdownOpen(false); logout(); }}
                        className="w-full px-4 py-2 text-left text-xs font-medium text-rose-700 hover:bg-rose-50 flex items-center gap-2.5 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => openAuthModal('signin')}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#12372A] hover:bg-[#0e2c22] rounded-xl transition-all cursor-pointer whitespace-nowrap shadow-xs"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => onNavigate('discover')}
              className="p-2 text-[#737373] hover:text-[#171717]"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#171717] hover:bg-black/[0.04] rounded-xl"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-black/[0.08] bg-[#F7F5F0] px-4 pt-3 pb-6 animate-in slide-in-from-top-2 duration-150 space-y-2">
          {navLinks.map((link) => {
            const isActive = currentTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => {
                  onNavigate(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#12372A] text-white'
                    : 'text-[#374151] hover:bg-black/[0.03]'
                }`}
              >
                <span>{link.label}</span>
                {link.count !== undefined && (
                  <span className={`text-xs tabular-nums ${isActive ? 'text-white/80' : 'text-[#737373]'}`}>
                    {link.count}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-3 border-t border-black/[0.06] flex flex-col gap-2">
            {user ? (
              <>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenProfile();
                  }}
                  className="w-full text-left px-3.5 py-2 text-sm font-medium text-[#374151] flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  <span>Profile ({user.displayName || user.email})</span>
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full text-left px-3.5 py-2 text-sm font-medium text-rose-600 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal('signin');
                }}
                className="w-full py-2.5 text-center text-xs font-semibold text-white bg-[#12372A] rounded-xl"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
