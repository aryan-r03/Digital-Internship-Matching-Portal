import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, RotateCcw, SlidersHorizontal, BookOpen } from 'lucide-react';
import { api } from '../api/index.js';
import { Manga } from '../types/index.js';
import { MangaGrid } from '../components/manga/MangaGrid.js';
import { Button } from '../components/ui/Button.js';

export const Explore: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [genre, setGenre] = useState(searchParams.get('genre') || 'All');
  const [demographic, setDemographic] = useState(searchParams.get('demographic') || 'All');
  const [status, setStatus] = useState(searchParams.get('status') || 'All');
  const [sort, setSort] = useState(searchParams.get('sort') || 'trending');

  const [mangaList, setMangaList] = useState<Manga[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const limit = 15;

  const genres = [
    'All',
    'Dark Fantasy',
    'Cyberpunk',
    'Supernatural',
    'Action',
    'Psychological',
    'Historical',
    'Romance',
    'Mecha',
    'Fantasy',
    'Mystery',
    'Drama',
    'Adventure',
  ];

  const demographics = ['All', 'Shonen', 'Seinen', 'Shojo', 'Josei'];
  const statuses = ['All', 'Ongoing', 'Completed'];
  const sortOptions = [
    { id: 'trending', label: 'Most Popular / Trending' },
    { id: 'top_rated', label: 'Highest Rated' },
    { id: 'newest', label: 'Recently Added' },
    { id: 'alphabetical', label: 'Alphabetical (A-Z)' },
  ];

  const fetchManga = async (resetOffset = false) => {
    setLoading(true);
    const currentOffset = resetOffset ? 0 : offset;
    try {
      const res = await api.getMangaList({
        search: search.trim(),
        genre: genre !== 'All' ? genre : undefined,
        demographic: demographic !== 'All' ? demographic : undefined,
        status: status !== 'All' ? status : undefined,
        sort,
        limit,
        offset: currentOffset,
      });

      if (res.success && res.data) {
        if (resetOffset) {
          setMangaList(res.data.items);
          setOffset(0);
        } else {
          setMangaList((prev) => [...prev, ...res.data.items]);
        }
        setTotal(res.data.total);
      }
    } catch (err) {
      console.error('Failed to fetch manga list:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManga(true);
  }, [genre, demographic, status, sort]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchManga(true);
  };

  const handleResetFilters = () => {
    setSearch('');
    setGenre('All');
    setDemographic('All');
    setStatus('All');
    setSort('trending');
    setSearchParams({});
  };

  const handleLoadMore = () => {
    const nextOffset = offset + limit;
    setOffset(nextOffset);
    api.getMangaList({
      search: search.trim(),
      genre: genre !== 'All' ? genre : undefined,
      demographic: demographic !== 'All' ? demographic : undefined,
      status: status !== 'All' ? status : undefined,
      sort,
      limit,
      offset: nextOffset,
    }).then((res) => {
      if (res.success && res.data) {
        setMangaList((prev) => [...prev, ...res.data.items]);
      }
    });
  };

  const activeFiltersCount =
    (genre !== 'All' ? 1 : 0) +
    (demographic !== 'All' ? 1 : 0) +
    (status !== 'All' ? 1 : 0) +
    (search.trim() ? 1 : 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="border-b-2 border-manga-border pb-4">
        <span className="text-xs font-mono font-bold text-manga-accent uppercase tracking-widest">
          CATALOG ARCHIVE // संपूर्ण सूची
        </span>
        <h1 className="text-3xl sm:text-4xl font-black font-display uppercase tracking-wider text-white mt-1">
          Explore All Series
        </h1>
        <p className="text-xs text-manga-muted font-mono mt-1">
          Discover high-octane serializations, dark psychological thrillers, and rich supernatural epics.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-manga-surface border border-manga-border p-4 sm:p-6 space-y-4 shadow-panel">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-manga-muted" />
            <input
              type="text"
              placeholder="Filter by title, author, artist, or keywords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-manga-elevated border border-manga-border pl-10 pr-4 py-2.5 text-sm text-manga-text font-mono placeholder:text-manga-dim focus:outline-none focus:border-manga-accent"
            />
          </div>
          <Button type="submit" variant="primary" size="md">
            Search
          </Button>
          {activeFiltersCount > 0 && (
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={handleResetFilters}
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            >
              Reset
            </Button>
          )}
        </form>

        {/* Dropdowns row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-manga-border/60 font-mono text-xs">
          {/* Genre */}
          <div>
            <label className="block text-manga-muted uppercase tracking-wider mb-1">
              Genre // कार्यक्षेत्र
            </label>
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full bg-manga-elevated border border-manga-border p-2 text-manga-text focus:outline-none focus:border-manga-accent"
            >
              {genres.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          {/* Demographic */}
          <div>
            <label className="block text-manga-muted uppercase tracking-wider mb-1">
              Demographic // लक्ष्य वर्ग
            </label>
            <select
              value={demographic}
              onChange={(e) => setDemographic(e.target.value)}
              className="w-full bg-manga-elevated border border-manga-border p-2 text-manga-text focus:outline-none focus:border-manga-accent"
            >
              {demographics.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-manga-muted uppercase tracking-wider mb-1">
              Publication Status // स्थिति
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-manga-elevated border border-manga-border p-2 text-manga-text focus:outline-none focus:border-manga-accent"
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-manga-muted uppercase tracking-wider mb-1">
              Sort Sequence // क्रम
            </label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full bg-manga-elevated border border-manga-border p-2 text-manga-text focus:outline-none focus:border-manga-accent"
            >
              {sortOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Header Count */}
      <div className="flex items-center justify-between text-xs font-mono text-manga-muted">
        <div>
          Showing <span className="font-bold text-white">{mangaList.length}</span> of{' '}
          <span className="font-bold text-white">{total}</span> titles
        </div>
        {activeFiltersCount > 0 && (
          <div className="text-manga-accent font-bold">
            {activeFiltersCount} active filter{activeFiltersCount > 1 ? 's' : ''} applied
          </div>
        )}
      </div>

      {/* Manga Grid */}
      <MangaGrid
        items={mangaList}
        isLoading={loading && offset === 0}
        emptyTitle="No Titles Match Criteria"
        emptyMessage="Try clearing your filters or testing a different search keyword."
      />

      {/* Load More Button */}
      {mangaList.length < total && (
        <div className="text-center pt-8">
          <Button
            variant="outline"
            size="lg"
            onClick={handleLoadMore}
            isLoading={loading}
          >
            Load More Series ({total - mangaList.length} remaining)
          </Button>
        </div>
      )}
    </div>
  );
};
