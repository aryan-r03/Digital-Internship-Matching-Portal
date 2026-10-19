import React from 'react';
import { Opportunity } from '../../types/opportunity.js';
import { OpportunityCard } from './OpportunityCard.js';
import { Briefcase, RotateCcw } from 'lucide-react';
import { Button } from '../ui/Button.js';

interface OpportunityGridProps {
  items: Opportunity[];
  isLoading?: boolean;
  emptyTitle?: string;
  emptyMessage?: string;
  onResetFilters?: () => void;
  onBookmarkToggled?: () => void;
}

export const OpportunityGrid: React.FC<OpportunityGridProps> = ({
  items,
  isLoading = false,
  emptyTitle = 'No Opportunities Match Criteria',
  emptyMessage = 'Try expanding your salary range, clearing specific filters, or searching for broader keywords.',
  onResetFilters,
  onBookmarkToggled,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div
            key={idx}
            className="p-5 bg-manga-surface border border-manga-border space-y-4 animate-pulse shadow-panel"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-neutral-900 border border-white/10" />
              <div className="space-y-1.5 flex-1">
                <div className="h-4 bg-neutral-800 w-1/2" />
                <div className="h-3 bg-neutral-900 w-1/3" />
              </div>
            </div>
            <div className="h-5 bg-neutral-800 w-3/4" />
            <div className="h-12 bg-neutral-900 w-full" />
            <div className="flex gap-2">
              <div className="h-3 bg-neutral-900 w-16" />
              <div className="h-3 bg-neutral-900 w-16" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="py-20 px-4 text-center border-2 border-dashed border-manga-border bg-manga-surface/60 relative overflow-hidden my-6">
        <div className="absolute inset-0 bg-screentone bg-screentone-md opacity-10 pointer-events-none" />
        <div className="relative z-10 max-w-md mx-auto space-y-4">
          <div className="w-12 h-12 bg-black border-2 border-manga-accent text-manga-accent mx-auto flex items-center justify-center font-display text-xl font-bold shadow-panel-accent">
            <Briefcase className="w-6 h-6" />
          </div>

          <div>
            <div className="text-xs font-hindi text-manga-accent font-bold">
              कोई अवसर नहीं मिला // No Results Found
            </div>
            <h3 className="text-lg font-bold font-heading uppercase tracking-wide text-white mt-0.5">
              {emptyTitle}
            </h3>
            <p className="text-xs text-manga-muted font-mono leading-relaxed mt-1">
              {emptyMessage}
            </p>
          </div>

          {onResetFilters && (
            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onResetFilters}
                leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((opp) => (
        <OpportunityCard
          key={opp.id}
          opportunity={opp}
          onBookmarkToggled={onBookmarkToggled}
        />
      ))}
    </div>
  );
};
