import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  PenTool,
  Plus,
  Upload,
  BookOpen,
  Trash2,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Layers,
} from 'lucide-react';
import { api } from '../api/index.js';
import { Manga } from '../types/index.js';
import { useAuth } from '../context/AuthContext.js';
import { Button } from '../components/ui/Button.js';
import { Badge } from '../components/ui/Badge.js';

export const Studio: React.FC = () => {
  const { user, quickLogin } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'my_series' | 'new_series' | 'new_chapter'>('my_series');
  const [mangaList, setMangaList] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(true);

  // New Series Form state
  const [newSeries, setNewSeries] = useState({
    title: '',
    japanese_title: '',
    synopsis: '',
    cover_image: '',
    banner_image: '',
    author: user?.username || '',
    artist: user?.username || '',
    demographic: 'Seinen',
    status: 'Ongoing',
    release_year: 2025,
    genres: ['Action', 'Dark Fantasy'],
  });

  // New Chapter Form state
  const [newChapter, setNewChapter] = useState({
    manga_id: 0,
    chapter_number: 1,
    title: '',
    pagesText: `https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=90
https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=90
https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=90`,
  });

  const [formSubmitting, setFormSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const availableGenres = [
    'Action',
    'Dark Fantasy',
    'Cyberpunk',
    'Supernatural',
    'Psychological',
    'Historical',
    'Sci-Fi',
    'Mystery',
    'Romance',
    'Mecha',
    'Adventure',
  ];

  const fetchStudioManga = async () => {
    setLoading(true);
    try {
      const res = await api.getMangaList({ limit: 50 });
      if (res.success && res.data) {
        setMangaList(res.data.items);
        if (res.data.items.length > 0 && newChapter.manga_id === 0) {
          setNewChapter((prev) => ({ ...prev, manga_id: res.data.items[0].id }));
        }
      }
    } catch (err) {
      console.error('Failed to load creator series:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudioManga();
  }, [user]);

  const handleCreateSeries = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFeedback(null);
    try {
      const res = await api.createManga({
        ...newSeries,
        genres: newSeries.genres,
      });

      if (res.success && res.data) {
        setFeedback({ type: 'success', message: `Series "${newSeries.title}" published successfully!` });
        fetchStudioManga();
        setActiveTab('my_series');
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to publish series' });
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleCreateChapter = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFeedback(null);
    try {
      const pageUrls = newChapter.pagesText
        .split('\n')
        .map((u) => u.trim())
        .filter((u) => u.startsWith('http'));

      if (pageUrls.length === 0) {
        throw new Error('Please enter at least one valid image URL for the chapter pages.');
      }

      const pages = pageUrls.map((url, idx) => ({
        pageNumber: idx + 1,
        imageUrl: url,
        caption: `Panel ${idx + 1}`,
      }));

      const res = await api.createChapter({
        manga_id: Number(newChapter.manga_id),
        chapter_number: Number(newChapter.chapter_number),
        title: newChapter.title.trim(),
        pages,
      });

      if (res.success && res.data) {
        setFeedback({
          type: 'success',
          message: `Chapter ${newChapter.chapter_number} published successfully!`,
        });
        fetchStudioManga();
        setActiveTab('my_series');
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to publish chapter' });
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDeleteManga = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this manga series? This cannot be undone.')) {
      return;
    }
    try {
      await api.deleteManga(id);
      setMangaList((prev) => prev.filter((m) => m.id !== id));
      setFeedback({ type: 'success', message: 'Manga series deleted.' });
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to delete manga' });
    }
  };

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-14 h-14 bg-black border-2 border-manga-accent text-manga-accent mx-auto flex items-center justify-center font-display text-2xl font-bold shadow-panel-accent">
          <PenTool className="w-7 h-7" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-display font-black uppercase text-white">
            Creator Studio // 創作工房
          </h2>
          <p className="text-xs font-mono text-manga-muted leading-relaxed">
            Authentication is required to access the authoring workbench. Log in as a Creator or Admin to upload series and publish chapters.
          </p>
        </div>

        <div className="p-4 bg-manga-surface border border-manga-border space-y-3">
          <p className="text-xs font-mono text-manga-accent uppercase font-bold tracking-wider">
            Quick One-Click Creator Login:
          </p>
          <div className="flex justify-center gap-3">
            <Button variant="primary" size="sm" onClick={() => quickLogin('creator')}>
              Login as KenshiArtisan (Creator)
            </Button>
            <Button variant="outline" size="sm" onClick={() => quickLogin('admin')}>
              Login as MangaEditor (Admin)
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b-2 border-manga-border pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold text-manga-accent uppercase tracking-widest">
            PUBLISHING WORKBENCH // 創作工房
          </span>
          <h1 className="text-3xl sm:text-4xl font-black font-display uppercase tracking-wider text-white mt-1">
            Manga Creator Studio
          </h1>
          <p className="text-xs text-manga-muted font-mono mt-1">
            Author: <strong className="text-white">{user.username}</strong> [{user.role.toUpperCase()}]
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant={activeTab === 'new_series' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => { setActiveTab('new_series'); setFeedback(null); }}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            New Series
          </Button>
          <Button
            variant={activeTab === 'new_chapter' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => { setActiveTab('new_chapter'); setFeedback(null); }}
            leftIcon={<Upload className="w-4 h-4" />}
          >
            Upload Chapter
          </Button>
        </div>
      </div>

      {/* Feedback banner */}
      {feedback && (
        <div
          className={`p-4 border font-mono text-xs flex items-center gap-3 ${
            feedback.type === 'success'
              ? 'bg-emerald-950/40 border-emerald-500 text-emerald-200'
              : 'bg-red-950/40 border-red-500 text-red-200'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Tabs Switcher */}
      <div className="flex border-b border-manga-border font-mono text-xs uppercase tracking-wider">
        <button
          onClick={() => { setActiveTab('my_series'); setFeedback(null); }}
          className={`px-5 py-2.5 border-b-2 font-bold cursor-pointer ${
            activeTab === 'my_series'
              ? 'border-manga-accent text-white bg-manga-accent/10'
              : 'border-transparent text-manga-muted hover:text-white'
          }`}
        >
          Series Catalog ({mangaList.length}) // 管理
        </button>
        <button
          onClick={() => { setActiveTab('new_series'); setFeedback(null); }}
          className={`px-5 py-2.5 border-b-2 font-bold cursor-pointer ${
            activeTab === 'new_series'
              ? 'border-manga-accent text-white bg-manga-accent/10'
              : 'border-transparent text-manga-muted hover:text-white'
          }`}
        >
          Publish New Series // 連載登録
        </button>
        <button
          onClick={() => { setActiveTab('new_chapter'); setFeedback(null); }}
          className={`px-5 py-2.5 border-b-2 font-bold cursor-pointer ${
            activeTab === 'new_chapter'
              ? 'border-manga-accent text-white bg-manga-accent/10'
              : 'border-transparent text-manga-muted hover:text-white'
          }`}
        >
          Publish Chapter // 話追加
        </button>
      </div>

      {/* TAB 1: MY SERIES MANAGEMENT */}
      {activeTab === 'my_series' && (
        <div className="space-y-4">
          <div className="border border-manga-border bg-manga-surface shadow-panel overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-manga-elevated border-b border-manga-border text-manga-muted uppercase tracking-wider">
                <tr>
                  <th className="p-3">Series Title</th>
                  <th className="p-3">Demographic</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Chapters</th>
                  <th className="p-3">Rating</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-manga-border/60">
                {mangaList.map((m) => (
                  <tr key={m.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-3 flex items-center gap-3">
                      <img
                        src={m.cover_image}
                        alt={m.title}
                        className="w-8 h-11 object-cover border border-white/10 shrink-0"
                      />
                      <div>
                        <Link
                          to={`/manga/${m.slug}`}
                          className="font-bold text-white hover:text-manga-accent font-display text-sm tracking-wide"
                        >
                          {m.title}
                        </Link>
                        <div className="text-[10px] text-manga-dim">
                          {m.japanese_title} • by {m.author}
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-manga-accent font-bold">{m.demographic}</td>
                    <td className="p-3">
                      <Badge variant="kanji" size="sm">
                        {m.status}
                      </Badge>
                    </td>
                    <td className="p-3 text-white font-bold">{m.chapters_count || 0}</td>
                    <td className="p-3 text-manga-gold font-bold">★ {m.rating_avg.toFixed(1)}</td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => {
                          setNewChapter((prev) => ({
                            ...prev,
                            manga_id: m.id,
                            chapter_number: (m.chapters_count || 0) + 1,
                            title: `Chapter ${(m.chapters_count || 0) + 1}`,
                          }));
                          setActiveTab('new_chapter');
                        }}
                        className="px-2 py-1 bg-white/10 hover:bg-manga-accent hover:text-white border border-manga-border text-manga-text transition-colors cursor-pointer"
                        title="Upload Chapter"
                      >
                        + Chapter
                      </button>
                      <button
                        onClick={() => handleDeleteManga(m.id)}
                        className="p-1 text-manga-dim hover:text-red-400 cursor-pointer"
                        title="Delete series"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: PUBLISH NEW SERIES FORM */}
      {activeTab === 'new_series' && (
        <form onSubmit={handleCreateSeries} className="max-w-3xl space-y-6 bg-manga-surface border border-manga-border p-6 shadow-panel">
          <div className="border-b border-manga-border pb-3">
            <h2 className="text-xl font-bold font-display uppercase tracking-wider text-white">
              Series Information & Metadata
            </h2>
            <p className="text-xs text-manga-muted font-mono">
              Provide canonical series details for catalog indexing.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
            <div>
              <label className="block text-manga-muted uppercase tracking-wider mb-1">
                English / Main Title *
              </label>
              <input
                type="text"
                placeholder="e.g. Chrono Blade: Eclipse"
                value={newSeries.title}
                onChange={(e) => setNewSeries({ ...newSeries, title: e.target.value })}
                className="w-full bg-manga-elevated border border-manga-border p-2.5 text-manga-text focus:outline-none focus:border-manga-accent"
                required
              />
            </div>

            <div>
              <label className="block text-manga-muted uppercase tracking-wider mb-1">
                Japanese Title (Kanji/Kana)
              </label>
              <input
                type="text"
                placeholder="e.g. クロノ・ブレイド: 蝕"
                value={newSeries.japanese_title}
                onChange={(e) => setNewSeries({ ...newSeries, japanese_title: e.target.value })}
                className="w-full bg-manga-elevated border border-manga-border p-2.5 text-manga-text focus:outline-none focus:border-manga-accent font-japanese"
              />
            </div>
          </div>

          <div className="font-mono text-xs">
            <label className="block text-manga-muted uppercase tracking-wider mb-1">
              Synopsis & World Premise *
            </label>
            <textarea
              rows={4}
              placeholder="Detail the setting, central conflict, protagonists, and tone..."
              value={newSeries.synopsis}
              onChange={(e) => setNewSeries({ ...newSeries, synopsis: e.target.value })}
              className="w-full bg-manga-elevated border border-manga-border p-3 text-manga-text focus:outline-none focus:border-manga-accent"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
            <div>
              <label className="block text-manga-muted uppercase tracking-wider mb-1">
                Cover Image URL *
              </label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={newSeries.cover_image}
                onChange={(e) => setNewSeries({ ...newSeries, cover_image: e.target.value })}
                className="w-full bg-manga-elevated border border-manga-border p-2.5 text-manga-text focus:outline-none focus:border-manga-accent"
                required
              />
            </div>

            <div>
              <label className="block text-manga-muted uppercase tracking-wider mb-1">
                Wide Banner Image URL (Optional)
              </label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={newSeries.banner_image}
                onChange={(e) => setNewSeries({ ...newSeries, banner_image: e.target.value })}
                className="w-full bg-manga-elevated border border-manga-border p-2.5 text-manga-text focus:outline-none focus:border-manga-accent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
            <div>
              <label className="block text-manga-muted uppercase tracking-wider mb-1">
                Author / Writer
              </label>
              <input
                type="text"
                value={newSeries.author}
                onChange={(e) => setNewSeries({ ...newSeries, author: e.target.value })}
                className="w-full bg-manga-elevated border border-manga-border p-2.5 text-manga-text focus:outline-none focus:border-manga-accent"
                required
              />
            </div>

            <div>
              <label className="block text-manga-muted uppercase tracking-wider mb-1">
                Illustrator / Artist
              </label>
              <input
                type="text"
                value={newSeries.artist}
                onChange={(e) => setNewSeries({ ...newSeries, artist: e.target.value })}
                className="w-full bg-manga-elevated border border-manga-border p-2.5 text-manga-text focus:outline-none focus:border-manga-accent"
                required
              />
            </div>

            <div>
              <label className="block text-manga-muted uppercase tracking-wider mb-1">
                Target Demographic
              </label>
              <select
                value={newSeries.demographic}
                onChange={(e) => setNewSeries({ ...newSeries, demographic: e.target.value as any })}
                className="w-full bg-manga-elevated border border-manga-border p-2.5 text-manga-text focus:outline-none focus:border-manga-accent"
              >
                <option value="Shonen">Shonen // 少年</option>
                <option value="Seinen">Seinen // 青年</option>
                <option value="Shojo">Shojo // 少女</option>
                <option value="Josei">Josei // 女性</option>
              </select>
            </div>
          </div>

          {/* Genre checkboxes */}
          <div className="font-mono text-xs">
            <label className="block text-manga-muted uppercase tracking-wider mb-2">
              Select Genre Categories
            </label>
            <div className="flex flex-wrap gap-2">
              {availableGenres.map((g) => {
                const isSelected = newSeries.genres.includes(g);
                return (
                  <button
                    type="button"
                    key={g}
                    onClick={() => {
                      const updated = isSelected
                        ? newSeries.genres.filter((item) => item !== g)
                        : [...newSeries.genres, g];
                      setNewSeries({ ...newSeries, genres: updated });
                    }}
                    className={`px-3 py-1.5 border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-manga-accent bg-manga-accent text-white font-bold'
                        : 'border-manga-border hover:border-white text-manga-muted bg-manga-elevated'
                    }`}
                  >
                    #{g}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-manga-border flex justify-end gap-3">
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={formSubmitting}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Publish Series to Archive
            </Button>
          </div>
        </form>
      )}

      {/* TAB 3: UPLOAD CHAPTER FORM */}
      {activeTab === 'new_chapter' && (
        <form onSubmit={handleCreateChapter} className="max-w-3xl space-y-6 bg-manga-surface border border-manga-border p-6 shadow-panel">
          <div className="border-b border-manga-border pb-3">
            <h2 className="text-xl font-bold font-display uppercase tracking-wider text-white">
              Upload Chapter Panels
            </h2>
            <p className="text-xs text-manga-muted font-mono">
              Add sequential pages to an existing manga serialization.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
            <div>
              <label className="block text-manga-muted uppercase tracking-wider mb-1">
                Target Manga Series *
              </label>
              <select
                value={newChapter.manga_id}
                onChange={(e) => setNewChapter({ ...newChapter, manga_id: Number(e.target.value) })}
                className="w-full bg-manga-elevated border border-manga-border p-2.5 text-manga-text focus:outline-none focus:border-manga-accent"
                required
              >
                {mangaList.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-manga-muted uppercase tracking-wider mb-1">
                Chapter Number *
              </label>
              <input
                type="number"
                step="any"
                min="0"
                value={newChapter.chapter_number}
                onChange={(e) => setNewChapter({ ...newChapter, chapter_number: Number(e.target.value) })}
                className="w-full bg-manga-elevated border border-manga-border p-2.5 text-manga-text focus:outline-none focus:border-manga-accent"
                required
              />
            </div>

            <div>
              <label className="block text-manga-muted uppercase tracking-wider mb-1">
                Chapter Title *
              </label>
              <input
                type="text"
                placeholder="e.g. Strike of the Crimson Moon"
                value={newChapter.title}
                onChange={(e) => setNewChapter({ ...newChapter, title: e.target.value })}
                className="w-full bg-manga-elevated border border-manga-border p-2.5 text-manga-text focus:outline-none focus:border-manga-accent"
                required
              />
            </div>
          </div>

          {/* Page Image URLs */}
          <div className="font-mono text-xs space-y-2">
            <label className="block text-manga-muted uppercase tracking-wider">
              Chapter Pages Image URLs (One URL per line in order) *
            </label>
            <textarea
              rows={6}
              value={newChapter.pagesText}
              onChange={(e) => setNewChapter({ ...newChapter, pagesText: e.target.value })}
              className="w-full bg-manga-elevated border border-manga-border p-3 text-manga-text focus:outline-none focus:border-manga-accent font-mono text-xs leading-relaxed"
              required
            />
            <p className="text-[11px] text-manga-dim">
              Each URL will be indexed as an individual panel page in the Cinematic Reader.
            </p>
          </div>

          <div className="pt-4 border-t border-manga-border flex justify-end gap-3">
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={formSubmitting}
              leftIcon={<Upload className="w-4 h-4" />}
            >
              Publish Chapter
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};
