import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { Button } from '../components/ui/Button.js';
import { Badge } from '../components/ui/Badge.js';

export const Register: React.FC = () => {
  const { register, quickLogin } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'reader' | 'creator'>('reader');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username.length < 3) {
      setError('Username must be at least 3 characters.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await register({ username, email, password, role });
      navigate('/explore');
    } catch (err: any) {
      setError(err.message || 'Failed to create account.');
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
            src="https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80"
            alt="Manga Art"
            className="absolute inset-0 w-full h-full object-cover filter grayscale contrast-125 brightness-40 pointer-events-none"
          />

          <div className="relative z-10">
            <Badge variant="kanji" size="sm">
              अभ्यर्थी पंजीकरण // NEW RECRUIT
            </Badge>
          </div>

          <div className="relative z-10 space-y-2">
            <h2 className="text-3xl font-display font-black uppercase text-white leading-tight">
              Join the KaamSutra Network
            </h2>
            <p className="text-xs font-mono text-manga-muted leading-relaxed">
              Create a candidate account to save opportunities and track applications, or register as a recruiter to post roles.
            </p>
          </div>
        </div>

        {/* Right: Registration Form */}
        <div className="p-6 sm:p-10 space-y-6 flex flex-col justify-center">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-manga-accent font-bold">
              REGISTRATION // नया खाता
            </span>
            <h1 className="text-2xl font-bold font-display uppercase tracking-wider text-white mt-1">
              Create New Account
            </h1>
            <p className="text-xs text-manga-muted font-mono mt-0.5">
              Choose your profile designation and get started.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-950/40 border border-red-500 text-red-200 text-xs font-mono flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
            <div>
              <label className="block text-manga-muted uppercase tracking-wider mb-1">
                Display Username
              </label>
              <input
                type="text"
                placeholder="e.g. MangaNinja"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-manga-elevated border border-manga-border px-3 py-2 text-manga-text focus:outline-none focus:border-manga-accent"
                required
              />
            </div>

            <div>
              <label className="block text-manga-muted uppercase tracking-wider mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="reader@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-manga-elevated border border-manga-border px-3 py-2 text-manga-text focus:outline-none focus:border-manga-accent"
                required
              />
            </div>

            <div>
              <label className="block text-manga-muted uppercase tracking-wider mb-1">
                Password (min. 6 characters)
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-manga-elevated border border-manga-border px-3 py-2 text-manga-text focus:outline-none focus:border-manga-accent"
                required
              />
            </div>

            <div>
              <label className="block text-manga-muted uppercase tracking-wider mb-1">
                Account Designation / Role
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('reader')}
                  className={`p-2 border text-center transition-all cursor-pointer ${
                    role === 'reader'
                      ? 'border-manga-accent bg-manga-accent/15 text-white font-bold'
                      : 'border-manga-border text-manga-muted bg-manga-elevated'
                  }`}
                >
                  Candidate // अभ्यर्थी
                </button>
                <button
                  type="button"
                  onClick={() => setRole('creator')}
                  className={`p-2 border text-center transition-all cursor-pointer ${
                    role === 'creator'
                      ? 'border-manga-accent bg-manga-accent/15 text-white font-bold'
                      : 'border-manga-border text-manga-muted bg-manga-elevated'
                  }`}
                >
                  Recruiter // नियोक्ता
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full"
              isLoading={loading}
              leftIcon={<UserPlus className="w-4 h-4" />}
            >
              Register Account
            </Button>
          </form>

          <p className="text-center font-mono text-xs text-manga-muted pt-2 border-t border-manga-border/60">
            Already have an account?{' '}
            <Link to="/login" className="text-manga-accent font-bold hover:underline">
              Sign In Instead →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
