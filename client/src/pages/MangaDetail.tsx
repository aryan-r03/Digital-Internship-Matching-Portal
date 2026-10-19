import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  BookOpen,
  Bookmark,
  Calendar,
  User,
  Eye,
  MessageSquare,
  ThumbsUp,
  Share2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { api } from '../api/index.js';
import { Manga, Review, Chapter } from '../types/index.js';
import { Badge } from '../components/ui/Badge.js';
import { Button } from '../components/ui/Button.js';
import { BookmarkModal } from '../components/manga/BookmarkModal.js';
import { ReviewModal } from '../components/manga/ReviewModal.js';
import { useAuth } from '../context/AuthContext.js';

export const MangaDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [manga, setManga] = useState<Manga | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [activeTab, setActiveTab] = useState<'chapters' | 'reviews' | 'about'>('chapters');
  const [loading, setLoading] = useState(true);

  const [showBookmarkModal, setShowBookmarkModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [currentBookmarkStatus, setCurrentBookmarkStatus] = useState<string | null>(null);

  const loadManga = async () => {
    if (!slug) return;
    setLoading(true);
    try {
      const res = await api.getMangaBySlug(slug);
      if (res.success && res.data) {
        setManga(res.data);
        setCurrentBookmarkStatus(res.data.userBookmark?.status || null);
        // Load reviews
        const revRes = await api.getMangaReviews(res.data.id);
        if (revRes.success && revRes.data) {
          setReviews(revRes.data);
        }
      }
    } catch (err) {
      console.error('Failed to load manga:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadManga();
  }, [slug]);

  const handleLikeReview = async (reviewId: number) => {
    try {
      await api.likeReview(reviewId);
      setReviews((prev) =>
        prev.map((r) => (r.id === reviewId ? { ...r, likes_count: r.likes_count + 1 } : r))
      );
    } catch (err) {
      console.error('Error liking review:', err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-10 h-10 border-2 border-manga-accent border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="font-mono text-xs uppercase tracking-widest text-manga-muted">
          Loading Series Archive...
        </p>
      </div>
    );
  }

  if (!manga) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="text-2xl font-display font-bold uppercase text-white">
          Series Not Found
        </h2>
        <p className="text-xs font-mono text-manga-muted">
          The requested manga record does not exist or may have been unindexed.
        </p>
        <Link to="/explore">
          <Button variant="primary">Return to Catalog</Button>
        </Link>
      </div>
    );
  }

  const chapters = manga.chapters || [];
  const firstChapter = chapters.length > 0 ? chapters[0] : null;

  return (
    <div className="space-y-8 pb-16">
      {/* 1. TOP CINEMATIC BANNER */}
      <div className="relative min-h-[360px] sm:min-h-[440px] flex items-end border-b-2 border-manga-borderStrong overflow-hidden bg-black">
        {/* Banner image with mask */}
        <div className="absolute inset-0">
          <img
            src={manga.banner_image || manga.cover_image}
            alt={manga.title}
            className="w-full h-full object-cover filter grayscale contrast-125 brightness-40"
          />
          <div className="absolute inset-0 bg-screentone bg-screentone-sm opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-t from-manga-bg via-black/75 to-transparent" />
        </div>

        {/* Hero Info Overlay */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 pt-20 w-full">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 sm:gap-8">
            {/* Manga Cover */}
            <div className="relative w-44 sm:w-56 aspect-[3/4] bg-black border-2 border-manga-borderStrong shadow-panel-lg overflow-hidden shrink-0">
              <img
                src={manga.cover_image}
                alt={manga.title}
                className="w-full h-full object-cover filter contrast-105"
              />
              <div className="absolute top-2 left-2">
                <Badge variant="kanji" size="sm">
                  {manga.status === 'Completed' ? 'पूर्ण' : 'जारी'}
                </Badge>
              </div>
            </div>

            {/* Title & Metadata */}
            <div className="flex-1 space-y-3 text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <Badge variant="accent">{manga.demographic}</Badge>
                <Badge variant="default">{manga.status}</Badge>
                <span className="text-xs font-mono text-manga-dim">
                  Published {manga.release_year}
                </span>
              </div>

              <div>
                <h1 className="text-3xl sm:text-5xl font-black font-display uppercase tracking-tight text-white leading-tight">
                  {manga.title}
                </h1>
                {manga.japanese_title && (
                  <p className="text-lg sm:text-xl font-hindi font-bold text-manga-accent tracking-widest pt-1">
                    {manga.japanese_title}
                  </p>
                )}
              </div>

              {/* Creators */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-mono text-manga-muted">
                <span>
                  Author: <strong className="text-white">{manga.author}</strong>
                </span>
                <span>•</span>
                <span>
                  Artist: <strong className="text-white">{manga.artist}</strong>
                </span>
              </div>

              {/* Metrics */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-1 font-mono text-xs">
                <div className="flex items-center gap-1.5 text-manga-gold font-bold bg-black/60 px-2.5 py-1 border border-manga-gold/30">
                  <Star className="w-4 h-4 fill-manga-gold" />
                  <span>★ {manga.rating_avg.toFixed(1)} / 5.0</span>
                  <span className="text-manga-dim font-normal">({manga.rating_count} reviews)</span>
                </div>
                <div className="flex items-center gap-1 text-manga-muted bg-black/60 px-2.5 py-1 border border-white/10">
                  <BookOpen className="w-3.5 h-3.5 text-manga-accent" />
                  <span>{chapters.length} Chapters</span>
                </div>
                <div className="flex items-center gap-1 text-manga-muted bg-black/60 px-2.5 py-1 border border-white/10">
                  <Eye className="w-3.5 h-3.5" />
                  <span>{manga.views_count.toLocaleString()} Views</span>
                </div>
              </div>

              {/* CTA Action Bar */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-3">
                {firstChapter && (
                  <Link to={`/read/${firstChapter.id}`}>
                    <Button
                      variant="primary"
                      size="md"
                      leftIcon={<BookOpen className="w-4 h-4" />}
                    >
                      Read Chapter 1
                    </Button>
                  </Link>
                )}

                {user ? (
                  <Button
                    variant={currentBookmarkStatus ? 'secondary' : 'outline'}
                    size="md"
                    onClick={() => setShowBookmarkModal(true)}
                    leftIcon={<Bookmark className="w-4 h-4" />}
                  >
                    {currentBookmarkStatus
                      ? `In Library: ${currentBookmarkStatus.replace('_', ' ')}`
                      : 'Add to Library'}
                  </Button>
                ) : (
                  <Link to="/login">
                    <Button variant="outline" size="md" leftIcon={<Bookmark className="w-4 h-4" />}>
                      Bookmark Series
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. TABBED CONTENT SECTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Tab Navigation */}
        <div className="flex items-center border-b-2 border-manga-border font-mono text-xs uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('chapters')}
            className={`px-5 py-3 border-b-2 font-bold transition-all cursor-pointer ${
              activeTab === 'chapters'
                ? 'border-manga-accent text-white bg-manga-accent/10'
                : 'border-transparent text-manga-muted hover:text-white'
            }`}
          >
            Chapters ({chapters.length}) // अध्याय
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-5 py-3 border-b-2 font-bold transition-all cursor-pointer ${
              activeTab === 'reviews'
                ? 'border-manga-accent text-white bg-manga-accent/10'
                : 'border-transparent text-manga-muted hover:text-white'
            }`}
          >
            Reviews ({reviews.length}) // समीक्षा
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`px-5 py-3 border-b-2 font-bold transition-all cursor-pointer ${
              activeTab === 'about'
                ? 'border-manga-accent text-white bg-manga-accent/10'
                : 'border-transparent text-manga-muted hover:text-white'
            }`}
          >
            About & Details // विवरण
          </button>
        </div>

        {/* TAB 1: CHAPTERS LIST */}
        {activeTab === 'chapters' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-mono text-manga-muted">
              <span>Showing all available chapters in chronological order</span>
              <span>Total: {chapters.length}</span>
            </div>

            {chapters.length === 0 ? (
              <div className="p-8 text-center border border-manga-border bg-manga-surface font-mono text-xs text-manga-dim">
                No chapters have been released yet for this serialization.
              </div>
            ) : (
              <div className="divide-y divide-manga-border border border-manga-border bg-manga-surface shadow-panel">
                {chapters.map((ch) => (
                  <Link
                    key={ch.id}
                    to={`/read/${ch.id}`}
                    className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors group"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-10 h-10 bg-black border border-manga-border group-hover:border-manga-accent flex items-center justify-center font-display font-black text-sm text-manga-accent shrink-0">
                        {ch.chapter_number}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-bold font-display uppercase tracking-wide text-white group-hover:text-manga-accent transition-colors truncate">
                          Ch. {ch.chapter_number} — {ch.title}
                        </div>
                        <div className="text-xs text-manga-muted font-mono flex items-center gap-2 mt-0.5">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(ch.release_date).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>{ch.views_count.toLocaleString()} views</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="hidden sm:inline-block px-3 py-1 bg-white/5 group-hover:bg-manga-accent text-manga-text group-hover:text-white text-xs font-mono uppercase tracking-wider transition-colors">
                        Read Chapter →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: COMMUNITY REVIEWS */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold font-display uppercase text-white">
                  Community Critiques & Scoring
                </h3>
                <p className="text-xs text-manga-muted font-mono">
                  Ratings reflect story progression, visual screentones, and character arcs.
                </p>
              </div>

              {user ? (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setShowReviewModal(true)}
                  leftIcon={<MessageSquare className="w-3.5 h-3.5" />}
                >
                  Write a Review
                </Button>
              ) : (
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Log in to Review
                  </Button>
                </Link>
              )}
            </div>

            {reviews.length === 0 ? (
              <div className="p-12 text-center border border-manga-border bg-manga-surface font-mono space-y-3">
                <p className="text-xs text-manga-muted">
                  No editorial critiques submitted yet for this series.
                </p>
                {user && (
                  <Button variant="outline" size="sm" onClick={() => setShowReviewModal(true)}>
                    Be the First Reviewer
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-5 bg-manga-surface border border-manga-border shadow-panel space-y-3"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={rev.user.avatar_url || 'https://api.dicebear.com/7.x/bottts-neutral/svg?seed=rev'}
                          alt={rev.user.username}
                          className="w-8 h-8 object-cover border border-white/10"
                        />
                        <div>
                          <div className="text-xs font-bold font-mono text-white">
                            {rev.user.username}
                            {rev.user.role !== 'reader' && (
                              <span className="ml-1 text-[9px] uppercase text-manga-accent">
                                [{rev.user.role}]
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-manga-dim font-mono">
                            Reviewed on {new Date(rev.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {/* Overall Rating */}
                      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-black border border-manga-gold text-manga-gold font-mono font-bold text-xs">
                        <Star className="w-3.5 h-3.5 fill-manga-gold" />
                        <span>★ {rev.rating_overall.toFixed(1)}</span>
                      </div>
                    </div>

                    {/* Criteria score chips */}
                    <div className="flex flex-wrap gap-2 text-[11px] font-mono">
                      <span className="px-2 py-0.5 bg-black/60 border border-white/10 text-manga-muted">
                        Story: <strong className="text-white">{rev.rating_story}/5</strong>
                      </span>
                      <span className="px-2 py-0.5 bg-black/60 border border-white/10 text-manga-muted">
                        Art: <strong className="text-white">{rev.rating_art}/5</strong>
                      </span>
                      <span className="px-2 py-0.5 bg-black/60 border border-white/10 text-manga-muted">
                        Characters: <strong className="text-white">{rev.rating_characters}/5</strong>
                      </span>
                    </div>

                    {/* Title & Body */}
                    <h4 className="text-sm font-bold font-display uppercase tracking-wide text-white">
                      {rev.title}
                    </h4>
                    <p className="text-xs font-mono text-manga-text/90 leading-relaxed whitespace-pre-line">
                      {rev.content}
                    </p>

                    {/* Likes footer */}
                    <div className="pt-2 border-t border-manga-border/50 flex items-center justify-between text-xs font-mono text-manga-dim">
                      <button
                        onClick={() => handleLikeReview(rev.id)}
                        className="flex items-center gap-1.5 text-manga-muted hover:text-white transition-colors cursor-pointer"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>Helpful ({rev.likes_count})</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ABOUT & DETAILS */}
        {activeTab === 'about' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 p-6 bg-manga-surface border border-manga-border shadow-panel space-y-4">
              <h3 className="text-sm font-bold font-mono uppercase text-manga-accent tracking-wider">
                Synopsis & Narrative // सारांश
              </h3>
              <p className="text-sm font-mono text-manga-text leading-relaxed whitespace-pre-line">
                {manga.synopsis}
              </p>

              <div className="pt-4 border-t border-manga-border">
                <h4 className="text-xs font-mono uppercase text-manga-muted mb-2">
                  Genre Categorization
                </h4>
                <div className="flex flex-wrap gap-2">
                  {manga.genres.map((g) => (
                    <span
                      key={g}
                      className="px-3 py-1 bg-black border border-white/20 text-xs font-mono text-manga-text"
                    >
                      #{g}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar metadata */}
            <div className="p-6 bg-manga-surface border border-manga-border shadow-panel space-y-4 font-mono text-xs">
              <h3 className="text-sm font-bold uppercase text-white tracking-wider border-b border-manga-border pb-2">
                Series Specifications
              </h3>
              <div className="space-y-2.5">
                <div className="flex justify-between py-1 border-b border-manga-border/50">
                  <span className="text-manga-muted">Regional Title:</span>
                  <span className="text-white font-hindi">{manga.japanese_title || 'N/A'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-manga-border/50">
                  <span className="text-manga-muted">Target Demographic:</span>
                  <span className="text-manga-accent font-bold">{manga.demographic}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-manga-border/50">
                  <span className="text-manga-muted">Serialization Status:</span>
                  <span className="text-white">{manga.status}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-manga-border/50">
                  <span className="text-manga-muted">Initial Release:</span>
                  <span className="text-white">{manga.release_year}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-manga-border/50">
                  <span className="text-manga-muted">Author / Story:</span>
                  <span className="text-white">{manga.author}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-manga-muted">Illustration:</span>
                  <span className="text-white">{manga.artist}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bookmark Modal */}
      {showBookmarkModal && (
        <BookmarkModal
          isOpen={showBookmarkModal}
          onClose={() => setShowBookmarkModal(false)}
          mangaId={manga.id}
          mangaTitle={manga.title}
          currentStatus={currentBookmarkStatus}
          onUpdated={(newStatus) => setCurrentBookmarkStatus(newStatus)}
        />
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <ReviewModal
          isOpen={showReviewModal}
          onClose={() => setShowReviewModal(false)}
          mangaId={manga.id}
          mangaTitle={manga.title}
          onSubmitted={() => loadManga()}
        />
      )}
    </div>
  );
};
