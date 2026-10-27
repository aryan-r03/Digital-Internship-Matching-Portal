import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { Button } from '../components/ui/Button.js';
import { Badge } from '../components/ui/Badge.js';

export const Login: React.FC = () => {
  const { login, quickLogin } = useAuth();
  const navigate = useNavigate();

  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login({ emailOrUsername, password });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid username or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (role: 'candidate' | 'employer' | 'admin' | 'reader' | 'creator') => {
    setLoading(true);
    setError(null);
    try {
      await quickLogin(role);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Quick login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 bg-manga-surface border-2 border-manga-borderStrong shadow-panel-lg overflow-hidden">
        {/* Left: Atmospheric Manga Visual Panel */}
        <div className="relative hidden md:flex flex-col justify-between p-8 bg-black border-r border-manga-border overflow-hidden">
          <div className="absolute inset-0 bg-screentone bg-screentone-sm opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <img
            src="https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80"
            alt="Manga Art"
            className="absolute inset-0 w-full h-full object-cover filter grayscale contrast-125 brightness-40 pointer-events-none"
          />

          <div className="relative z-10">
            <Badge variant="kanji" size="sm">
              कामसेतु // CODENAME
            </Badge>
          </div>

          <div className="relative z-10 space-y-2">
            <h2 className="text-3xl font-display font-black uppercase text-white leading-tight">
              Enter the Career Sanctuary
            </h2>
            <p className="text-xs font-mono text-manga-muted leading-relaxed">
              Resume your opportunity bookmarks, review applications, and immerse yourself in high-impact engineering careers.
            </p>
          </div>
        </div>

        {/* Right: Login Form */}
        <div className="p-6 sm:p-10 space-y-6 flex flex-col justify-center">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-manga-accent font-bold">
              AUTHENTICATION // प्रवेश
            </span>
            <h1 className="text-2xl font-bold font-display uppercase tracking-wider text-white mt-1">
              Sign In to Account
            </h1>
            <p className="text-xs text-manga-muted font-mono mt-0.5">
              Access your personal library and reading progression.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-950/40 border border-red-500 text-red-200 text-xs font-mono flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Demo Accounts Helper */}
          <div className="p-3.5 bg-black border border-manga-border space-y-2">
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-manga-accent font-bold uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Instant One-Click Demo Profiles:</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 font-mono text-[11px]">
              <button
                type="button"
                onClick={() => handleQuickDemo('reader')}
                className="p-1.5 bg-white/5 hover:bg-white/10 border border-manga-border text-center text-white transition-colors cursor-pointer"
              >
                Reader
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('creator')}
                className="p-1.5 bg-white/5 hover:bg-white/10 border border-manga-border text-center text-manga-accent transition-colors cursor-pointer"
              >
                Creator
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('admin')}
                className="p-1.5 bg-white/5 hover:bg-white/10 border border-manga-border text-center text-manga-gold transition-colors cursor-pointer"
              >
                Admin
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
            <div>
              <label className="block text-manga-muted uppercase tracking-wider mb-1">
                Email Address or Username
              </label>
              <input
                type="text"
                placeholder="reader@nextgenmanga.io"
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
                className="w-full bg-manga-elevated border border-manga-border px-3 py-2.5 text-manga-text focus:outline-none focus:border-manga-accent"
                required
              />
            </div>

            <div>
              <label className="block text-manga-muted uppercase tracking-wider mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-manga-elevated border border-manga-border px-3 py-2.5 text-manga-text focus:outline-none focus:border-manga-accent"
                required
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full"
              isLoading={loading}
              leftIcon={<LogIn className="w-4 h-4" />}
            >
              Sign In
            </Button>
          </form>

          <p className="text-center font-mono text-xs text-manga-muted pt-2 border-t border-manga-border/60">
            Don't have an account yet?{' '}
            <Link to="/register" className="text-manga-accent font-bold hover:underline">
              Create an Account →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
