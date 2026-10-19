import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, BookOpen, Bookmark as BookmarkIcon, Eye } from 'lucide-react';
import { Manga } from '../../types/index.js';
import { Badge } from '../ui/Badge.js';
import { BookmarkModal } from './BookmarkModal.js';
import { useAuth } from '../../context/AuthContext.js';

interface MangaCardProps {
  manga: Manga;
  onBookmarkUpdated?: () => void;
}

export const MangaCard: React.FC<MangaCardProps> = ({ manga, onBookmarkUpdated }) => {
  const { user } = useAuth();
  const [showBookmarkModal, setShowBookmarkModal] = useState(false);
  const [currentBookmark, setCurrentBookmark] = useState(manga.userBookmark?.status || null);

  const statusKanji = manga.status === 'Completed' ? '完結' : '連載中';

  return (
    <div className="group relative flex flex-col bg-manga-surface border border-manga-border hover:border-manga-accent transition-all duration-300 shadow-panel hover:shadow-panel-accent">
      {/* Cover Image Container */}
      <Link to={`/manga/${manga.slug}`} className="relative aspect-[3/4] overflow-hidden bg-black block">
        <img
          src={manga.cover_image}
          alt={manga.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 filter contrast-105 group-hover:contrast-115"
        />

        {/* Screentone texture overlay on hover */}
        <div className="absolute inset-0 bg-screentone bg-screentone-sm opacity-0 group-hover:opacity-20 transition-opacity pointer-events-none" />

        {/* Gradient Shadow */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1 pointer-events-none">
          <Badge variant="kanji" size="sm">
            {statusKanji}
          </Badge>
          <div className="flex items-center gap-1 bg-black/85 backdrop-blur-sm border border-manga-gold/50 px-2 py-0.5 text-xs font-mono font-bold text-manga-gold">
            <Star className="w-3 h-3 fill-manga-gold text-manga-gold" />
            <span>{manga.rating_avg > 0 ? manga.rating_avg.toFixed(1) : 'New'}</span>
          </div>
        </div>

        {/* Bottom Metadata in Image */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] font-mono text-manga-text/90">
          <span className="flex items-center gap-1 bg-black/70 px-1.5 py-0.5 border border-white/10">
            <BookOpen className="w-3 h-3 text-manga-accent" />
            <span>{manga.chapters_count || 0} Ch.</span>
          </span>
          <span className="flex items-center gap-1 bg-black/70 px-1.5 py-0.5 border border-white/10">
            <Eye className="w-3 h-3 text-manga-muted" />
            <span>{manga.views_count.toLocaleString()}</span>
          </span>
        </div>
      </Link>

      {/* Content Info */}
      <div className="p-3.5 flex flex-col flex-1 justify-between gap-2.5">
        <div>
          <div className="flex items-center justify-between gap-1 mb-1">
            <span className="text-[10px] uppercase font-mono tracking-wider text-manga-accent font-semibold">
              {manga.demographic}
            </span>
            <span className="text-[10px] text-manga-dim font-mono">
              {manga.release_year}
            </span>
          </div>

          <Link
            to={`/manga/${manga.slug}`}
            className="block text-base font-bold font-display tracking-wide text-manga-text group-hover:text-manga-accent transition-colors line-clamp-1"
          >
            {manga.title}
          </Link>

          {manga.japanese_title && (
            <p className="text-xs text-manga-muted font-japanese tracking-wider truncate mt-0.5">
              {manga.japanese_title}
            </p>
          )}

          {/* Genre Chips */}
          <div className="flex flex-wrap gap-1 mt-2">
            {manga.genres.slice(0, 2).map((genre) => (
              <span
                key={genre}
                className="text-[10px] font-mono px-1.5 py-0.5 bg-black/50 border border-white/10 text-manga-muted"
              >
                {genre}
              </span>
            ))}
            {manga.genres.length > 2 && (
              <span className="text-[10px] font-mono px-1 py-0.5 text-manga-dim">
                +{manga.genres.length - 2}
              </span>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-2 border-t border-manga-border/60 flex items-center justify-between gap-2">
          <Link
            to={`/manga/${manga.slug}`}
            className="flex-1 text-center py-1.5 bg-white/5 hover:bg-manga-accent hover:text-white border border-manga-border hover:border-manga-accent text-xs font-mono uppercase tracking-wider text-manga-text transition-colors"
          >
            Read
          </Link>

          {user && (
            <button
              onClick={() => setShowBookmarkModal(true)}
              className={`p-1.5 border transition-colors cursor-pointer ${
                currentBookmark
                  ? 'border-manga-accent bg-manga-accent/20 text-manga-accent'
                  : 'border-manga-border hover:border-white text-manga-muted hover:text-white'
              }`}
              title={currentBookmark ? `Saved as: ${currentBookmark}` : 'Save to Library'}
              aria-label="Bookmark manga"
            >
              <BookmarkIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Bookmark Modal */}
      {showBookmarkModal && (
        <BookmarkModal
          isOpen={showBookmarkModal}
          onClose={() => setShowBookmarkModal(false)}
          mangaId={manga.id}
          mangaTitle={manga.title}
          currentStatus={currentBookmark}
          onUpdated={(newStatus) => {
            setCurrentBookmark(newStatus as any);
            if (onBookmarkUpdated) onBookmarkUpdated();
          }}
        />
      )}
    </div>
  );
};
