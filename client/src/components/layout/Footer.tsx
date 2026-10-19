import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Sparkles, ExternalLink, AlertTriangle, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t-2 border-manga-borderStrong bg-manga-surface mt-20 relative overflow-hidden">
      {/* Background Screentone Texture */}
      <div className="absolute inset-0 bg-screentone bg-screentone-sm opacity-10 pointer-events-none" />

      {/* Prominent Legal Disclaimer Banner */}
      <div className="bg-amber-950/20 border-b border-amber-500/30 px-4 py-3 relative z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-xs font-mono text-amber-200/90 text-center">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>DATA INTEGRITY NOTICE:</strong> All job and internship listings displayed on Kaamsetu are explicitly <strong>sample/mock demonstration opportunities</strong>. They are not active or verified vacancies.
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Manifesto */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-black border border-manga-accent flex items-center justify-center font-bold text-manga-accent font-display text-lg shadow-panel-accent">
                KS
              </div>
              <div className="flex items-center gap-2">
                <span className="font-display font-extrabold text-xl tracking-wider text-manga-text uppercase">
                  Kaamsetu<span className="text-manga-accent">.</span>IO
                </span>
                <span className="text-sm font-hindi text-manga-accent font-bold">
                  // कामसूत्र
                </span>
              </div>
            </div>
            <p className="text-xs text-manga-muted font-mono leading-relaxed max-w-md">
              A high-precision career and internship matching portal designed for students, freshers, and early-career builders. Crafted with editorial typography, transparent compensation benchmarks, explainable algorithmic matching, and structured application tracking.
            </p>
            <div className="pt-1 flex items-center gap-3 font-mono text-[11px] text-manga-dim">
              <span>Curated by Aryan Ranjan</span>
              <span>•</span>
              <a
                href="https://aryanranjan03.vercel.app"
                target="_blank"
                rel="noreferrer"
                className="text-manga-accent hover:underline inline-flex items-center gap-1"
              >
                <span>aryanranjan03.vercel.app</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-manga-text mb-4 border-l-2 border-manga-accent pl-2 flex items-center gap-1.5">
              <span>Navigation</span>
              <span className="text-manga-dim font-hindi">// सफ़र</span>
            </h4>
            <ul className="space-y-2 text-xs font-mono text-manga-muted">
              <li>
                <Link to="/" className="hover:text-white hover:underline transition-colors">
                  Platform Home
                </Link>
              </li>
              <li>
                <Link to="/opportunities" className="hover:text-white hover:underline transition-colors">
                  Explore Internships & Roles
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-white hover:underline transition-colors">
                  Candidate Dashboard & Saved
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-white hover:underline transition-colors">
                  Candidate Profile & Readiness
                </Link>
              </li>
            </ul>
          </div>

          {/* Core Values / Philosophy */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-manga-text mb-4 border-l-2 border-manga-accent pl-2 flex items-center gap-1.5">
              <span>Platform Values</span>
              <span className="text-manga-dim font-hindi">// सिद्धांत</span>
            </h4>
            <ul className="space-y-2 text-xs font-mono text-manga-muted">
              <li className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-manga-accent" />
                <span>Zero Hidden Compensation</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-manga-accent" />
                <span>Verified PPO Tracks</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-manga-accent" />
                <span>Student-First Mentorship</span>
              </li>
              <li className="text-[11px] text-manga-dim pt-2">
                WCAG 2.2 AA Contrast Compliant.
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-manga-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-manga-dim">
          <div>
            © {new Date().getFullYear()} Kaamsetu // कामसूत्र. Next-Gen Career & Internship Interface.
          </div>
          <div className="flex items-center gap-3">
            <span className="font-hindi text-manga-muted">सफ़र • लक्ष्य • तैयारी • सफलता</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
