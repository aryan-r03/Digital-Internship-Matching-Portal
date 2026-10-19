import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  ChevronLeft,
  ChevronRight,
  Maximize,
  Minimize,
  Sliders,
  ArrowLeft,
  Menu,
  MessageSquare,
  Sparkles,
  BookOpen,
  Volume2,
} from 'lucide-react';
import { Chapter } from '../../types/index.js';
import {
  useReaderPreferences,
  ReadingMode,
  FilterMode,
} from '../../context/ReaderPreferencesContext.js';
import { api } from '../../api/index.js';
import { Button } from '../ui/Button.js';
import { useAuth } from '../../context/AuthContext.js';

interface CinematicReaderProps {
  chapter: Chapter;
}

export const CinematicReader: React.FC<CinematicReaderProps> = ({ chapter }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    mode,
    setMode,
    direction,
    setDirection,
    filter,
    setFilter,
    showHUD,
    toggleHUD,
    fitToWidth,
    setFitToWidth,
  } = useReaderPreferences();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [hasCelebrated, setHasCelebrated] = useState<boolean>(false);

  // Comments state
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const pages = chapter.pages || [];
  const totalPages = pages.length;

  // Load comments
  useEffect(() => {
    async function loadComments() {
      try {
        const res = await api.getChapterComments(chapter.id);
        if (res.success && res.data) {
          setComments(res.data);
        }
      } catch (err) {
        console.error('Failed to load chapter comments:', err);
      }
    }
    loadComments();
    setCurrentPage(1);
    setHasCelebrated(false);
  }, [chapter.id]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if typing inside input/textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === 'ArrowRight') {
        direction === 'rtl' ? handlePrevPage() : handleNextPage();
      } else if (e.key === 'ArrowLeft') {
        direction === 'rtl' ? handleNextPage() : handlePrevPage();
      } else if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        handleNextPage();
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      } else if (e.key === 'm' || e.key === 'M') {
        toggleHUD();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, totalPages, direction]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      const next = mode === 'double' ? Math.min(totalPages, currentPage + 2) : currentPage + 1;
      setCurrentPage(next);
      if (next >= totalPages && !hasCelebrated) {
        triggerCelebration();
      }
    } else if (chapter.nextChapter) {
      navigate(`/read/${chapter.nextChapter.id}`);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      const prev = mode === 'double' ? Math.max(1, currentPage - 2) : currentPage - 1;
      setCurrentPage(prev);
    } else if (chapter.prevChapter) {
      navigate(`/read/${chapter.prevChapter.id}`);
    }
  };

  const triggerCelebration = () => {
    setHasCelebrated(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#E63946', '#FFFFFF', '#080808'],
    });
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;
    setIsSubmittingComment(true);
    try {
      const res = await api.addChapterComment(chapter.id, newComment.trim());
      if (res.success && res.data) {
        setComments([res.data, ...comments]);
        setNewComment('');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to post comment');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // Filter styles
  const filterClasses: Record<FilterMode, string> = {
    normal: '',
    'high-contrast': 'grayscale contrast-150',
    screentone: 'grayscale contrast-125',
    night: 'invert hue-rotate-180 brightness-90',
  };

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen bg-black text-manga-text select-none overflow-x-hidden flex flex-col justify-between"
    >
      {/* Screentone filter texture overlay if active */}
      {filter === 'screentone' && (
        <div className="fixed inset-0 bg-screentone bg-screentone-sm opacity-30 pointer-events-none z-30" />
      )}

      {/* Top Floating HUD */}
      <div
        className={`fixed top-0 left-0 right-0 z-40 bg-black/90 backdrop-blur-md border-b border-manga-border transition-transform duration-300 ${
          showHUD ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* Back button & Title */}
          <div className="flex items-center gap-3 min-w-0">
            <Link
              to={`/manga/${chapter.manga_slug}`}
              className="p-1.5 border border-manga-border hover:border-white text-manga-muted hover:text-white transition-colors"
              title="Return to Manga Overview"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-manga-accent uppercase">
                  Ch. {chapter.chapter_number}
                </span>
                <span className="text-xs font-mono text-manga-dim hidden sm:inline">•</span>
                <h1 className="text-xs sm:text-sm font-bold font-display uppercase tracking-wider text-white truncate">
                  {chapter.title}
                </h1>
              </div>
              <p className="text-[10px] text-manga-muted font-mono truncate">
                {chapter.manga_title}
              </p>
            </div>
          </div>

          {/* Reader Controls Toolbar */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Reading Mode Switcher */}
            <div className="hidden sm:flex border border-manga-border bg-manga-surface p-0.5">
              {(['single', 'double', 'vertical'] as ReadingMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`px-2 py-1 text-[11px] font-mono uppercase transition-colors cursor-pointer ${
                    mode === m ? 'bg-manga-accent text-white font-bold' : 'text-manga-muted hover:text-white'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>

            {/* Filter Mode Selector */}
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as FilterMode)}
              className="bg-manga-surface border border-manga-border px-2 py-1 text-xs font-mono text-manga-text focus:outline-none"
            >
              <option value="normal">Normal Art</option>
              <option value="high-contrast">Noir Ink</option>
              <option value="screentone">Screentone FX</option>
              <option value="night">Inverted Night</option>
            </select>

            {/* Fullscreen Toggle */}
            <button
              onClick={toggleFullscreen}
              className="p-1.5 border border-manga-border hover:border-white text-manga-muted hover:text-white transition-colors"
              title="Toggle Fullscreen (F)"
              aria-label="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Reader Stage Content */}
      <main
        className="flex-1 flex flex-col items-center justify-center pt-16 pb-20 min-h-screen cursor-pointer"
        onClick={(e) => {
          // If clicked in the middle 30%, toggle HUD
          const rect = e.currentTarget.getBoundingClientRect();
          const clickX = e.clientX - rect.left;
          const width = rect.width;
          if (clickX > width * 0.35 && clickX < width * 0.65) {
            toggleHUD();
          }
        }}
      >
        {/* MODE 1: VERTICAL STRIP (WEBTOON MODE) */}
        {mode === 'vertical' && (
          <div className="w-full max-w-4xl mx-auto flex flex-col items-center divide-y-0">
            {pages.map((page) => (
              <div key={page.pageNumber} className="relative w-full flex flex-col items-center">
                <img
                  src={page.imageUrl}
                  alt={`Page ${page.pageNumber}`}
                  loading="lazy"
                  className={`w-full max-w-3xl object-contain shadow-2xl transition-all ${filterClasses[filter]}`}
                />
                {page.caption && (
                  <div className="p-2 bg-black/90 text-center font-mono text-[11px] text-manga-muted tracking-wide w-full max-w-3xl border-b border-white/5">
                    {page.caption}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* MODE 2: SINGLE PAGE MODE */}
        {mode === 'single' && (
          <div className="relative w-full max-w-5xl mx-auto flex items-center justify-center p-2">
            {/* Left Nav overlay */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                direction === 'rtl' ? handleNextPage() : handlePrevPage();
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-3 bg-black/60 hover:bg-black/90 border border-manga-border text-white hover:text-manga-accent transition-all cursor-pointer"
              title="Previous Page (Left Arrow)"
              aria-label="Previous Page"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Current Page Image */}
            {pages[currentPage - 1] && (
              <div className="flex flex-col items-center animate-fade-in-up">
                <img
                  src={pages[currentPage - 1].imageUrl}
                  alt={`Page ${currentPage}`}
                  className={`max-h-[85vh] w-auto object-contain border border-manga-borderStrong shadow-2xl ${filterClasses[filter]}`}
                />
                {pages[currentPage - 1].caption && (
                  <p className="mt-2 text-xs font-mono text-manga-muted tracking-wider bg-black/80 px-3 py-1 border border-white/10">
                    {pages[currentPage - 1].caption}
                  </p>
                )}
              </div>
            )}

            {/* Right Nav overlay */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                direction === 'rtl' ? handlePrevPage() : handleNextPage();
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-3 bg-black/60 hover:bg-black/90 border border-manga-border text-white hover:text-manga-accent transition-all cursor-pointer"
              title="Next Page (Right Arrow)"
              aria-label="Next Page"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        )}

        {/* MODE 3: DOUBLE SPREAD MODE */}
        {mode === 'double' && (
          <div className="relative w-full max-w-6xl mx-auto flex items-center justify-center p-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrevPage();
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-3 bg-black/60 hover:bg-black/90 border border-manga-border text-white cursor-pointer"
              aria-label="Previous Spread"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div className="flex items-center justify-center gap-1">
              {/* Spread left page */}
              {pages[currentPage - 1] && (
                <img
                  src={pages[currentPage - 1].imageUrl}
                  alt={`Page ${currentPage}`}
                  className={`max-h-[85vh] w-auto object-contain border border-manga-border ${filterClasses[filter]}`}
                />
              )}
              {/* Spread right page */}
              {pages[currentPage] && (
                <img
                  src={pages[currentPage].imageUrl}
                  alt={`Page ${currentPage + 1}`}
                  className={`max-h-[85vh] w-auto object-contain border border-manga-border ${filterClasses[filter]}`}
                />
              )}
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNextPage();
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-3 bg-black/60 hover:bg-black/90 border border-manga-border text-white cursor-pointer"
              aria-label="Next Spread"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        )}

        {/* End of Chapter Card & Comments Section */}
        {currentPage === totalPages && (
          <div className="w-full max-w-3xl mx-auto mt-12 p-6 bg-manga-surface border-2 border-manga-borderStrong relative overflow-hidden animate-fade-in-up">
            <div className="absolute inset-0 bg-screentone bg-screentone-sm opacity-15 pointer-events-none" />

            <div className="relative z-10 text-center space-y-4">
              <span className="inline-block px-3 py-1 bg-manga-accent text-white font-mono text-xs uppercase font-bold tracking-widest shadow-glow-red">
                अध्याय {chapter.chapter_number} // CHAPTER COMPLETED
              </span>
              <h2 className="text-2xl font-bold font-display uppercase tracking-wider text-white">
                {chapter.title}
              </h2>
              <p className="text-xs text-manga-muted font-mono">
                You have reached the end of this chapter.
              </p>

              {/* Navigation to Next Chapter */}
              <div className="flex items-center justify-center gap-4 pt-4">
                {chapter.prevChapter && (
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/read/${chapter.prevChapter!.id}`)}
                  >
                    ← Ch. {chapter.prevChapter.chapter_number}
                  </Button>
                )}
                {chapter.nextChapter ? (
                  <Button
                    variant="primary"
                    onClick={() => navigate(`/read/${chapter.nextChapter!.id}`)}
                  >
                    Next: Ch. {chapter.nextChapter.chapter_number} →
                  </Button>
                ) : (
                  <Button
                    variant="secondary"
                    onClick={() => navigate(`/manga/${chapter.manga_slug}`)}
                  >
                    Return to Manga Catalog
                  </Button>
                )}
              </div>
            </div>

            {/* Chapter Discussions / Comments */}
            <div className="relative z-10 mt-10 pt-8 border-t border-manga-border text-left">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold font-mono uppercase text-manga-text flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-manga-accent" />
                  <span>Reader Discussion ({comments.length})</span>
                </h3>
                <span className="text-xs text-manga-dim font-hindi">पाठक समीक्षा</span>
              </div>

              {/* Post comment form */}
              {user ? (
                <form onSubmit={handlePostComment} className="mb-6">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Comment on this chapter... (SFX reactions, theories, favorite panel)"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="flex-1 bg-black border border-manga-border px-3 py-2 text-xs font-mono text-manga-text focus:outline-none focus:border-manga-accent"
                      maxLength={1000}
                    />
                    <Button
                      type="submit"
                      variant="primary"
                      size="sm"
                      isLoading={isSubmittingComment}
                      disabled={!newComment.trim()}
                    >
                      Post
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="p-3 bg-black border border-manga-border text-center text-xs font-mono text-manga-muted mb-6">
                  <Link to="/login" className="text-manga-accent font-bold hover:underline">
                    Log in
                  </Link>{' '}
                  to participate in the chapter discussion.
                </div>
              )}

              {/* Comments list */}
              <div className="space-y-3">
                {comments.length === 0 ? (
                  <p className="text-xs font-mono text-manga-dim text-center py-4">
                    Be the first reader to comment on this chapter!
                  </p>
                ) : (
                  comments.map((c) => (
                    <div
                      key={c.id}
                      className="p-3 bg-black/60 border border-manga-border/60 flex items-start gap-3"
                    >
                      <img
                        src={c.user?.avatar_url || 'https://api.dicebear.com/7.x/bottts-neutral/svg?seed=c'}
                        alt={c.user?.username}
                        className="w-7 h-7 object-cover border border-white/10 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                          <span className="font-bold text-manga-text">
                            {c.user?.username}
                            {c.user?.role !== 'reader' && (
                              <span className="ml-1.5 text-[9px] uppercase text-manga-accent font-bold">
                                [{c.user?.role}]
                              </span>
                            )}
                          </span>
                          <span className="text-manga-dim">
                            {new Date(c.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-xs font-mono text-manga-text/90 leading-relaxed">
                          {c.content}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Floating Scrubber / Navigation HUD */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-40 bg-black/95 backdrop-blur-md border-t border-manga-border p-3 transition-transform duration-300 ${
          showHUD ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4 font-mono">
          {/* Prev Chapter */}
          <button
            onClick={handlePrevPage}
            className="flex items-center gap-1 px-3 py-1.5 border border-manga-border hover:border-white text-xs text-manga-text transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Prev</span>
          </button>

          {/* Scrubber slider */}
          <div className="flex-1 flex items-center gap-3">
            <span className="text-xs text-manga-accent font-bold">
              {currentPage}
            </span>
            <input
              type="range"
              min={1}
              max={totalPages}
              value={currentPage}
              onChange={(e) => setCurrentPage(parseInt(e.target.value, 10))}
              className="flex-1 accent-manga-accent cursor-pointer h-1.5 bg-neutral-800"
            />
            <span className="text-xs text-manga-muted">
              {totalPages}
            </span>
          </div>

          {/* Next Chapter */}
          <button
            onClick={handleNextPage}
            className="flex items-center gap-1 px-3 py-1.5 bg-manga-accent text-white font-bold text-xs transition-colors hover:bg-manga-accentGlow cursor-pointer shadow-panel-accent"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
