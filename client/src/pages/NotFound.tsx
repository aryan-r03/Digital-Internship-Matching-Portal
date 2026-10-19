import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button.js';
import { Home, Compass } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4 text-center font-mono">
      <div className="max-w-md space-y-6">
        <div className="relative inline-block">
          <div className="text-8xl sm:text-9xl font-black font-heading text-white tracking-widest drop-shadow-lg">
            4<span className="text-manga-accent">0</span>4
          </div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-black border border-manga-accent px-3 py-0.5 text-xs font-hindi font-bold text-manga-accent uppercase tracking-widest">
            मार्ग भटक गए // LOST ROUTE
          </div>
        </div>

        <p className="text-xs sm:text-sm text-manga-muted leading-relaxed">
          The requested opportunity, profile coordinate, or page could not be located in the KaamSutra directory.
        </p>

        <div className="pt-2 flex justify-center gap-3">
          <Link to="/">
            <Button variant="outline" size="md" leftIcon={<Home className="w-4 h-4" />}>
              Platform Home
            </Button>
          </Link>
          <Link to="/opportunities">
            <Button variant="primary" size="md" leftIcon={<Compass className="w-4 h-4" />}>
              Explore Roles
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
