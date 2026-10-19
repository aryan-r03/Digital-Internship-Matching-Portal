import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  MapPin,
  Clock,
  Sparkles,
  Bookmark,
  CheckCircle2,
  Calendar,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import { Opportunity } from '../../types/opportunity.js';
import { Badge } from '../ui/Badge.js';
import { opportunityService } from '../../api/opportunityService.js';

interface OpportunityCardProps {
  opportunity: Opportunity;
  onBookmarkToggled?: () => void;
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({
  opportunity,
  onBookmarkToggled,
}) => {
  const [isSaved, setIsSaved] = useState(() =>
    opportunityService.getSavedIds().includes(opportunity.id)
  );

  const handleToggleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const updated = opportunityService.toggleSave(opportunity.id);
    setIsSaved(updated);
    if (onBookmarkToggled) onBookmarkToggled();
  };

  const workModeStyles = {
    Remote: 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300',
    Hybrid: 'bg-blue-950/40 border-blue-500/40 text-blue-300',
    'On-site': 'bg-amber-950/40 border-amber-500/40 text-amber-300',
  }[opportunity.workMode];

  return (
    <div className="group relative flex flex-col justify-between bg-manga-surface border border-manga-border hover:border-manga-accent transition-all duration-300 shadow-panel hover:shadow-panel-accent overflow-hidden">
      {/* Background Screentone Pattern */}
      <div className="absolute inset-0 bg-screentone bg-screentone-sm opacity-0 group-hover:opacity-15 transition-opacity pointer-events-none" />

      {/* Mandatory Demo Data Notice Banner */}
      <div className="bg-neutral-900 border-b border-manga-border px-3 py-1 flex items-center justify-between text-[10px] font-mono text-manga-dim">
        <span className="flex items-center gap-1 text-amber-400 font-semibold">
          <AlertCircle className="w-3 h-3" />
          Demo data — not live opportunities
        </span>
        <span className="text-[9px] uppercase tracking-wider text-manga-muted">
          ID: {opportunity.id}
        </span>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between space-y-4 relative z-10">
        {/* Header: Company & Bookmark */}
        <div>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={opportunity.company.logoUrl}
                alt={opportunity.company.name}
                className="w-11 h-11 object-cover border border-manga-border group-hover:border-manga-accent transition-colors shrink-0 bg-black"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-mono font-bold text-manga-text truncate">
                    {opportunity.company.name}
                  </span>
                  {opportunity.company.isVerified && (
                    <span title="Verified Employer" className="inline-flex items-center">
                      <CheckCircle2 className="w-3.5 h-3.5 text-manga-accent shrink-0" />
                    </span>
                  )}
                </div>
                <div className="text-[11px] font-mono text-manga-muted flex items-center gap-2 mt-0.5">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-manga-dim" />
                    <span>{opportunity.location}</span>
                  </span>
                  <span>•</span>
                  <span className={`px-1.5 py-0.2 border text-[10px] font-bold uppercase ${workModeStyles}`}>
                    {opportunity.workMode}
                  </span>
                </div>
              </div>
            </div>

            {/* Bookmark button */}
            <button
              onClick={handleToggleSave}
              className={`p-2 border transition-all cursor-pointer ${
                isSaved
                  ? 'border-manga-accent bg-manga-accent/20 text-manga-accent shadow-sm'
                  : 'border-manga-border hover:border-white text-manga-dim hover:text-white bg-black/40'
              }`}
              title={isSaved ? 'Saved in candidate vault' : 'Save opportunity'}
              aria-label="Save opportunity"
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-manga-accent' : ''}`} />
            </button>
          </div>

          {/* Role Title */}
          <Link
            to={`/opportunities/${opportunity.id}`}
            className="block text-base sm:text-lg font-bold font-heading uppercase tracking-wide text-white group-hover:text-manga-accent transition-colors mt-3 line-clamp-1"
          >
            {opportunity.title}
          </Link>

          {/* Compensation & PPO Banner */}
          <div className="mt-2.5 p-2.5 bg-black/60 border border-white/10 flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
            <div>
              <span className="text-manga-dim block text-[10px] uppercase">Stipend / Comp</span>
              <strong className="text-white font-bold">{opportunity.stipend.amount}</strong>
            </div>
            {opportunity.stipend.hasPPO && (
              <div className="text-right">
                <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 justify-end">
                  <Sparkles className="w-2.5 h-2.5" /> PPO Potential
                </span>
                <span className="text-[11px] text-manga-muted font-bold">
                  {opportunity.stipend.ppoRange || 'Full-time Conversion'}
                </span>
              </div>
            )}
          </div>

          {/* Batch & Degree eligibility */}
          <div className="flex items-center gap-2 text-[11px] font-mono text-manga-muted mt-2.5">
            <span className="text-manga-dim">Eligible:</span>
            <span>{opportunity.batchEligibility.join(' / ')} Batch</span>
            <span>•</span>
            <span>{opportunity.duration}</span>
          </div>

          {/* Skills Required */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {opportunity.skillsRequired.slice(0, 3).map((skill) => (
              <span
                key={skill}
                className="text-[10px] font-mono px-2 py-0.5 bg-neutral-900 border border-manga-border text-manga-text"
              >
                {skill}
              </span>
            ))}
            {opportunity.skillsRequired.length > 3 && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 text-manga-dim">
                +{opportunity.skillsRequired.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Footer: Deadline & Action CTA */}
        <div className="pt-3 border-t border-manga-border flex items-center justify-between gap-3 font-mono text-xs">
          <div className="flex items-center gap-1 text-[11px] text-manga-dim">
            <Calendar className="w-3 h-3 text-manga-accent" />
            <span>Apply by {new Date(opportunity.applicationDeadline).toLocaleDateString()}</span>
          </div>

          <Link
            to={`/opportunities/${opportunity.id}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-white group-hover:text-manga-accent group-hover:translate-x-0.5 transition-all"
          >
            <span>View Role</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
