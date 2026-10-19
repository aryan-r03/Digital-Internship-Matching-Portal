import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  Briefcase,
  MapPin,
  DollarSign,
  Layers,
} from 'lucide-react';
import { Opportunity, OpportunityFilterOptions } from '../types/opportunity.js';
import { opportunityService } from '../api/opportunityService.js';
import { OpportunityGrid } from '../components/opportunities/OpportunityGrid.js';
import { Button } from '../components/ui/Button.js';

export const Opportunities: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [roleType, setRoleType] = useState(searchParams.get('roleType') || 'All');
  const [workMode, setWorkMode] = useState(searchParams.get('workMode') || 'All');
  const [experienceLevel, setExperienceLevel] = useState(searchParams.get('experienceLevel') || 'All');
  const [location, setLocation] = useState(searchParams.get('location') || 'All');
  const [minStipend, setMinStipend] = useState<number>(
    parseInt(searchParams.get('minStipend') || '0', 10)
  );
  const [hasPPOOnly, setHasPPOOnly] = useState<boolean>(
    searchParams.get('hasPPO') === 'true'
  );
  const [sortBy, setSortBy] = useState<any>(searchParams.get('sortBy') || 'recommended');

  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const categories = [
    'All',
    'AI / Machine Learning',
    'Software Engineering',
    'Data Science',
    'UI/UX Design',
    'Cloud & DevOps',
    'Product Management',
    'Growth & Marketing',
  ];

  const roleTypes = ['All', 'Internship', 'Full-Time Fresher', 'Junior Associate'];
  const workModes = ['All', 'Remote', 'Hybrid', 'On-site'];
  const experienceLevels = ['All', 'Students / Freshers', '0-1 Years', '1-3 Years'];
  const locations = ['All', 'Remote', 'Bengaluru', 'Delhi NCR', 'Mumbai', 'Pune', 'Hyderabad'];

  const stipendOptions = [
    { label: 'Any Stipend', value: 0 },
    { label: '₹25,000+ / mo', value: 25000 },
    { label: '₹35,000+ / mo', value: 35000 },
    { label: '₹45,000+ / mo', value: 45000 },
    { label: '₹55,000+ / mo', value: 55000 },
  ];

  const sortOptions = [
    { id: 'recommended', label: 'Recommended / Featured' },
    { id: 'stipend_high', label: 'Highest Stipend' },
    { id: 'deadline_soon', label: 'Deadline Approaching' },
    { id: 'newest', label: 'Recently Posted' },
  ];

  const fetchOpportunities = async () => {
    setLoading(true);
    try {
      const filters: OpportunityFilterOptions = {
        search,
        category: category !== 'All' ? category : undefined,
        roleType: roleType !== 'All' ? roleType : undefined,
        workMode: workMode !== 'All' ? workMode : undefined,
        experienceLevel: experienceLevel !== 'All' ? experienceLevel : undefined,
        location: location !== 'All' ? location : undefined,
        minStipend: minStipend > 0 ? minStipend : undefined,
        hasPPOOnly,
        sortBy,
      };

      const res = await opportunityService.getOpportunities(filters);
      setOpportunities(res.items);
      setTotal(res.total);
    } catch (err) {
      console.error('Failed to load opportunities:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, [category, roleType, workMode, experienceLevel, location, minStipend, hasPPOOnly, sortBy]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOpportunities();
  };

  const handleResetFilters = () => {
    setSearch('');
    setCategory('All');
    setRoleType('All');
    setWorkMode('All');
    setExperienceLevel('All');
    setLocation('All');
    setMinStipend(0);
    setHasPPOOnly(false);
    setSortBy('recommended');
    setSearchParams({});
  };

  const activeFiltersCount =
    (category !== 'All' ? 1 : 0) +
    (roleType !== 'All' ? 1 : 0) +
    (workMode !== 'All' ? 1 : 0) +
    (experienceLevel !== 'All' ? 1 : 0) +
    (location !== 'All' ? 1 : 0) +
    (minStipend > 0 ? 1 : 0) +
    (hasPPOOnly ? 1 : 0) +
    (search.trim() ? 1 : 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header with Bilingual Microcopy */}
      <div className="border-b-2 border-manga-border pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-manga-accent uppercase tracking-widest">
              OPPORTUNITY CODEX
            </span>
            <span className="text-xs font-hindi text-manga-accent font-bold">
              // खोज और अवसर
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-heading uppercase tracking-wider text-white mt-1">
            Discover Internships & Roles
          </h1>
          <p className="text-xs text-manga-muted font-mono mt-1">
            Browse verified stipend listings across AI engineering, full stack development, and product design.
          </p>
        </div>

        {/* Demo data badge */}
        <div className="p-2.5 bg-neutral-900 border border-amber-500/30 text-[11px] font-mono text-amber-300 flex items-center gap-1.5 shrink-0">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          <span>Demo data — not live opportunities</span>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-manga-surface border border-manga-border p-4 sm:p-6 space-y-4 shadow-panel">
        {/* Search input bar */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-manga-muted" />
            <input
              type="text"
              placeholder="Filter by title, company, skills (e.g. PyTorch, React, Golang)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-manga-elevated border border-manga-border pl-10 pr-4 py-2.5 text-xs text-manga-text font-mono placeholder:text-manga-dim focus:outline-none focus:border-manga-accent"
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
              Reset ({activeFiltersCount})
            </Button>
          )}
        </form>

        {/* Filter controls row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 pt-2 border-t border-manga-border/60 font-mono text-xs">
          {/* Category */}
          <div>
            <label className="block text-manga-dim uppercase tracking-wider mb-1 text-[10px]">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-manga-elevated border border-manga-border p-2 text-manga-text focus:outline-none focus:border-manga-accent"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Role Type */}
          <div>
            <label className="block text-manga-dim uppercase tracking-wider mb-1 text-[10px]">
              Role Type
            </label>
            <select
              value={roleType}
              onChange={(e) => setRoleType(e.target.value)}
              className="w-full bg-manga-elevated border border-manga-border p-2 text-manga-text focus:outline-none focus:border-manga-accent"
            >
              {roleTypes.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Work Mode */}
          <div>
            <label className="block text-manga-dim uppercase tracking-wider mb-1 text-[10px]">
              Work Mode
            </label>
            <select
              value={workMode}
              onChange={(e) => setWorkMode(e.target.value)}
              className="w-full bg-manga-elevated border border-manga-border p-2 text-manga-text focus:outline-none focus:border-manga-accent"
            >
              {workModes.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="block text-manga-dim uppercase tracking-wider mb-1 text-[10px]">
              Location
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-manga-elevated border border-manga-border p-2 text-manga-text focus:outline-none focus:border-manga-accent"
            >
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Min Stipend */}
          <div>
            <label className="block text-manga-dim uppercase tracking-wider mb-1 text-[10px]">
              Min Stipend
            </label>
            <select
              value={minStipend}
              onChange={(e) => setMinStipend(Number(e.target.value))}
              className="w-full bg-manga-elevated border border-manga-border p-2 text-manga-text focus:outline-none focus:border-manga-accent"
            >
              {stipendOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-manga-dim uppercase tracking-wider mb-1 text-[10px]">
              Sort Order
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-manga-elevated border border-manga-border p-2 text-manga-text focus:outline-none focus:border-manga-accent"
            >
              {sortOptions.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Checkbox bar */}
        <div className="pt-2 border-t border-manga-border/60 flex items-center justify-between text-xs font-mono">
          <label className="inline-flex items-center gap-2 cursor-pointer select-none text-manga-text">
            <input
              type="checkbox"
              checked={hasPPOOnly}
              onChange={(e) => setHasPPOOnly(e.target.checked)}
              className="accent-manga-accent w-4 h-4"
            />
            <span>Show only listings with Pre-Placement Offer (PPO) potential</span>
          </label>

          <span className="text-[11px] text-manga-dim">
            Showing {opportunities.length} of {total} listings
          </span>
        </div>
      </div>

      {/* Grid List */}
      <OpportunityGrid
        items={opportunities}
        isLoading={loading}
        onResetFilters={handleResetFilters}
      />
    </div>
  );
};
