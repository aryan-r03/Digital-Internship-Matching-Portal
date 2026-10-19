import React from 'react';
import { Manga } from '../../types/index.js';
import { MangaCard } from './MangaCard.js';
import { BookOpen } from 'lucide-react';

interface MangaGridProps {
  items: Manga[];
  isLoading?: boolean;
  emptyTitle?: string;
  emptyMessage?: string;
  onBookmarkUpdated?: () => void;
}

export const MangaGrid: React.FC<MangaGridProps> = ({
  items,
  isLoading = false,
  emptyTitle = 'No Manga Series Found',
  emptyMessage = 'Try adjusting your search criteria, genre filters, or demographic selection.',
  onBookmarkUpdated,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
        {Array.from({ length: 10 }).map((_, idx) => (
          <div
            key={idx}
            className="flex flex-col bg-manga-surface border border-manga-border p-2 space-y-3 animate-pulse"
          >
            <div className="aspect-[3/4] bg-neutral-900 border border-white/5 relative overflow-hidden">
              <div className="absolute inset-0 bg-screentone bg-screentone-sm opacity-20" />
            </div>
            <div className="space-y-1.5 p-1">
              <div className="h-4 bg-neutral-800 w-3/4 rounded-none" />
              <div className="h-3 bg-neutral-900 w-1/2 rounded-none" />
              <div className="flex gap-1 pt-1">
                <div className="h-3 bg-neutral-900 w-12" />
                <div className="h-3 bg-neutral-900 w-12" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="py-20 px-4 text-center border-2 border-dashed border-manga-border bg-manga-surface/50 relative overflow-hidden my-8">
        <div className="absolute inset-0 bg-screentone bg-screentone-md opacity-10 pointer-events-none" />
        <div className="relative z-10 max-w-md mx-auto space-y-3">
          <div className="w-12 h-12 bg-black border border-manga-accent text-manga-accent mx-auto flex items-center justify-center font-display text-xl font-bold shadow-panel-accent">
            !
          </div>
          <h3 className="text-lg font-bold font-display uppercase tracking-wider text-manga-text">
            {emptyTitle}
          </h3>
          <p className="text-xs text-manga-muted font-mono leading-relaxed">
            {emptyMessage}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
      {items.map((manga) => (
        <MangaCard
          key={manga.id}
          manga={manga}
          onBookmarkUpdated={onBookmarkUpdated}
        />
      ))}
    </div>
  );
};
