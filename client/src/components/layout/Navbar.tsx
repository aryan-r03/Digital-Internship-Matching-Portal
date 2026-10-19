import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Compass,
  Bookmark,
  User,
  Search,
  Sparkles,
  Menu,
  X,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { opportunityService } from '../../api/opportunityService.js';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quickSearch, setQuickSearch] = useState('');

  const savedCount = opportunityService.getSavedIds().length;
  const profile = opportunityService.getProfile();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickSearch.trim()) {
      navigate(`/opportunities?search=${encodeURIComponent(quickSearch.trim())}`);
      setQuickSearch('');
    }
  };

  const navLinks = [
    { label: 'Explore Roles', path: '/opportunities', icon: Compass, hindi: 'अवसर' },
    { label: 'Saved', path: '/dashboard?tab=saved', icon: Bookmark, hindi: 'सुरक्षित', badge: savedCount },
    { label: 'My Applications', path: '/dashboard?tab=applications', icon: Briefcase, hindi: 'आवेदन' },
    { label: 'Candidate Profile', path: '/profile', icon: User, hindi: 'प्रोफ़ाइल' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-manga-bg/95 backdrop-blur-md border-b border-manga-border">
      {/* Top Disclaimer Ticker */}
      <div className="bg-neutral-900 border-b border-white/10 px-4 py-1 text-[11px] font-mono text-center flex items-center justify-center gap-2 text-manga-muted">
        <span className="inline-flex items-center gap-1 text-manga-accent font-bold uppercase tracking-wider">
          <ShieldAlert className="w-3.5 h-3.5" /> Demo Platform:
        </span>
        <span>
          Sample mock listings only — not verified or live job postings. For evaluation & career interface testing.
        </span>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Bilingual Brand */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-9 h-9 bg-black border-2 border-manga-accent flex items-center justify-center font-bold text-white shadow-panel-accent group-hover:scale-105 transition-transform">
              <span className="font-display text-lg text-manga-accent">KS</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-display font-extrabold text-lg sm:text-xl tracking-wider text-manga-text uppercase group-hover:text-white transition-colors">
                  Kaamsetu<span className="text-manga-accent">.</span>IO
                </span>
                <span className="text-xs font-hindi text-manga-accent font-bold">
                  कामसूत्र
                </span>
              </div>
              <span className="font-mono text-[9px] uppercase tracking-widest text-manga-dim mt-0.5">
                Career & Internship Matching Engine
              </span>
            </div>
          </Link>

          {/* Quick Search Input */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:block flex-1 max-w-xs mx-4"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-manga-muted" />
              <input
                type="text"
                placeholder="Search by role, skill, or city..."
                value={quickSearch}
                onChange={(e) => setQuickSearch(e.target.value)}
                className="w-full bg-manga-surface border border-manga-border pl-9 pr-3 py-1.5 text-xs text-manga-text placeholder:text-manga-dim font-mono focus:outline-none focus:border-manga-accent transition-colors"
              />
            </div>
          </form>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path.split('?')[0];
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-3.5 py-2 text-xs font-mono uppercase tracking-wider transition-all border ${
                    isActive
                      ? 'border-manga-accent text-white bg-manga-accent/10 shadow-sm'
                      : 'border-transparent text-manga-muted hover:text-white hover:border-manga-border'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.label}</span>
                  <span className="text-[10px] text-manga-dim font-hindi">
                    {link.hindi}
                  </span>
                  {link.badge !== undefined && link.badge > 0 && (
                    <span className="px-1.5 py-0.2 bg-manga-accent text-white font-bold text-[10px]">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Candidate Profile Widget */}
          <div className="flex items-center gap-3">
            <Link
              to="/profile"
              className="flex items-center gap-2.5 p-1.5 bg-manga-surface border border-manga-border hover:border-manga-accent transition-colors group"
            >
              <div className="w-7 h-7 bg-black border border-white/20 flex items-center justify-center text-xs font-bold text-manga-accent font-display">
                AR
              </div>
              <div className="hidden sm:block text-left pr-1">
                <div className="text-xs font-bold text-manga-text font-mono leading-none group-hover:text-white">
                  {profile.fullName.split(' ')[0]}
                </div>
                <div className="text-[9px] uppercase tracking-wider text-emerald-400 font-mono mt-0.5">
                  {profile.profileCompletionPercentage}% Ready
                </div>
              </div>
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-manga-muted hover:text-white border border-manga-border"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-manga-border py-4 space-y-3 bg-manga-surface animate-fade-in-up">
            <form onSubmit={handleSearchSubmit} className="px-2">
              <input
                type="text"
                placeholder="Search internships (e.g. AI, React)..."
                value={quickSearch}
                onChange={(e) => setQuickSearch(e.target.value)}
                className="w-full bg-manga-elevated border border-manga-border px-3 py-2 text-xs font-mono text-manga-text"
              />
            </form>

            <div className="grid grid-cols-2 gap-2 px-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 border border-manga-border text-center text-xs font-mono uppercase text-manga-text hover:border-manga-accent flex flex-col items-center gap-0.5"
                >
                  <span>{link.label}</span>
                  <span className="text-[10px] text-manga-dim font-hindi">{link.hindi}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
