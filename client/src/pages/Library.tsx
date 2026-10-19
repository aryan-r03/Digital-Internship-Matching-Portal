import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, BookOpen, Trash2, ArrowRight, Sparkles } from 'lucide-react';
import { api } from '../api/index.js';
import { Bookmark as BookmarkType } from '../types/index.js';
import { useAuth } from '../context/AuthContext.js';
import { Button } from '../components/ui/Button.js';
import { Badge } from '../components/ui/Badge.js';

export const Library: React.FC = () => {
  const { user, quickLogin } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('all');
  const [bookmarks, setBookmarks] = useState<BookmarkType[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLibrary = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await api.getLibrary(activeTab !== 'all' ? activeTab : undefined);
      if (res.success && res.data) {
        setBookmarks(res.data);
      }
    } catch (err) {
      console.error('Failed to load user library:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLibrary();
  }, [user, activeTab]);

  const handleRemove = async (mangaId: number) => {
    try {
      await api.removeBookmark(mangaId);
      setBookmarks((prev) => prev.filter((b) => b.manga_id !== mangaId));
    } catch (err: any) {
      alert(err.message || 'Failed to remove from library');
    }
  };

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-14 h-14 bg-black border-2 border-manga-accent text-manga-accent mx-auto flex items-center justify-center font-display text-2xl font-bold shadow-panel-accent">
          <Bookmark className="w-7 h-7" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-display font-black uppercase tracking-wider text-white">
            Personal Vault // व्यक्तिगत संग्रह
          </h2>
          <p className="text-xs font-mono text-manga-muted leading-relaxed">
            Please log in or select a demo profile to view your bookmarked opportunities, track progress, and auto-resume where you left off.
          </p>
        </div>

        <div className="p-4 bg-manga-surface border border-manga-border space-y-3">
          <p className="text-xs font-mono text-manga-accent uppercase font-bold tracking-wider">
            Quick One-Click Demo Profiles:
          </p>
          <div className="flex justify-center gap-3">
            <Button variant="primary" size="sm" onClick={() => quickLogin('reader')}>
              YukiReader (Candidate)
            </Button>
            <Button variant="outline" size="sm" onClick={() => quickLogin('creator')}>
              KenshiArtisan (Recruiter)
            </Button>
            <Button variant="outline" size="sm" onClick={() => quickLogin('admin')}>
              MangaEditor (Admin)
            </Button>
          </div>
        </div>

        <div className="pt-2">
          <Link to="/login">
            <Button variant="outline" size="md">
              Sign In with Credentials →
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'all', label: 'All Titles', hindi: 'सभी' },
    { id: 'reading', label: 'Currently Reading', hindi: 'सक्रिय' },
    { id: 'plan_to_read', label: 'Plan to Read', hindi: 'योजना' },
    { id: 'completed', label: 'Completed', hindi: 'पूर्ण' },
    { id: 'dropped', label: 'Dropped', hindi: 'स्थगित' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b-2 border-manga-border pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold text-manga-accent uppercase tracking-widest">
            PERSONAL VAULT // कार्यकक्ष
          </span>
          <h1 className="text-3xl sm:text-4xl font-black font-display uppercase tracking-wider text-white mt-1">
            My Reading Library
          </h1>
          <p className="text-xs text-manga-muted font-mono mt-1">
            {bookmarks.length} titles saved in your personal archive
          </p>
        </div>
        <Link to="/explore">
          <Button variant="outline" size="sm" leftIcon={<BookOpen className="w-4 h-4" />}>
            Discover More Manga
          </Button>
        </Link>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-manga-border pb-3 font-mono text-xs">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2 border transition-all cursor-pointer ${
              activeTab === t.id
                ? 'border-manga-accent bg-manga-accent text-white font-bold shadow-panel-accent'
                : 'border-manga-border hover:border-white text-manga-muted hover:text-white bg-manga-surface'
            }`}
          >
            {t.label} <span className="font-hindi text-[10px] opacity-75">{t.hindi}</span>
          </button>
        ))}
      </div>

      {/* Bookmarks List */}
      {loading ? (
        <div className="py-20 text-center font-mono text-xs text-manga-muted">
          Loading library collection...
        </div>
      ) : bookmarks.length === 0 ? (
        <div className="py-20 px-4 text-center border-2 border-dashed border-manga-border bg-manga-surface space-y-3">
          <Bookmark className="w-10 h-10 text-manga-dim mx-auto" />
          <h3 className="text-lg font-bold font-display uppercase text-white">
            No Titles in this Shelf
          </h3>
          <p className="text-xs text-manga-muted font-mono max-w-sm mx-auto">
            You don't have any manga categorized under "{activeTab}". Browse the catalog to start building your collection.
          </p>
          <div className="pt-2">
            <Link to="/explore">
              <Button variant="primary" size="sm">
                Explore Manga Series
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarks.map((b) => (
            <div
              key={b.id}
              className="flex bg-manga-surface border border-manga-border hover:border-manga-accent transition-all duration-300 shadow-panel group"
            >
              <Link to={`/manga/${b.manga.slug}`} className="w-32 aspect-[3/4] shrink-0 bg-black overflow-hidden block">
                <img
                  src={b.manga.cover_image}
                  alt={b.manga.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </Link>

              <div className="p-4 flex-1 flex flex-col justify-between min-w-0">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <Badge variant="kanji" size="sm">
                      {b.status.replace('_', ' ')}
                    </Badge>
                    <span className="text-manga-gold font-bold">
                      ★ {b.manga.rating_avg.toFixed(1)}
                    </span>
                  </div>

                  <Link
                    to={`/manga/${b.manga.slug}`}
                    className="text-sm font-bold font-display uppercase tracking-wide text-white group-hover:text-manga-accent transition-colors line-clamp-1 block pt-1"
                  >
                    {b.manga.title}
                  </Link>

                  {b.manga.japanese_title && (
                    <p className="text-[11px] text-manga-muted font-hindi truncate">
                      {b.manga.japanese_title}
                    </p>
                  )}

                  <div className="text-xs font-mono text-manga-dim pt-1">
                    {b.last_read_chapter ? (
                      <span className="text-manga-text font-bold">
                        Last Read: Ch. {b.last_read_chapter.chapter_number}
                      </span>
                    ) : (
                      <span>Not started yet</span>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-manga-border/60 flex items-center justify-between gap-2">
                  {b.last_read_chapter ? (
                    <Link
                      to={`/read/${b.last_read_chapter.id}`}
                      className="flex-1 text-center py-1 bg-manga-accent hover:bg-manga-accentGlow text-white text-xs font-mono uppercase font-bold tracking-wider transition-colors shadow-panel-accent"
                    >
                      Resume
                    </Link>
                  ) : (
                    <Link
                      to={`/manga/${b.manga.slug}`}
                      className="flex-1 text-center py-1 bg-white/5 hover:bg-white/10 text-manga-text text-xs font-mono uppercase tracking-wider transition-colors border border-manga-border"
                    >
                      Read Ch. 1
                    </Link>
                  )}

                  <button
                    onClick={() => handleRemove(b.manga_id)}
                    className="p-1.5 text-manga-dim hover:text-red-400 border border-transparent hover:border-red-500/30 transition-colors cursor-pointer"
                    title="Remove from Library"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
