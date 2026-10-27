import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Building2,
  MapPin,
  Calendar,
  Sparkles,
  Bookmark,
  Send,
  CheckCircle2,
  ExternalLink,
  ArrowLeft,
  Share2,
  AlertTriangle,
  Briefcase,
  GraduationCap,
} from 'lucide-react';
import { Opportunity } from '../types/opportunity.js';
import { opportunityService } from '../api/opportunityService.js';
import { Button } from '../components/ui/Button.js';
import { Badge } from '../components/ui/Badge.js';
import { ApplyModal } from '../components/opportunities/ApplyModal.js';
import { OpportunityCard } from '../components/opportunities/OpportunityCard.js';

export const OpportunityDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [similarOpportunities, setSimilarOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    async function loadOpportunity() {
      if (!id) return;
      setLoading(true);
      try {
        const found = await opportunityService.getOpportunityById(id);
        if (found) {
          setOpportunity(found);
          setIsSaved(opportunityService.getSavedIds().includes(found.id));
          const applied = opportunityService.getApplications().some((a) => a.opportunityId === found.id);
          setHasApplied(applied);

          // Similar opportunities
          const all = await opportunityService.getOpportunities({ category: found.category });
          setSimilarOpportunities(all.items.filter((o) => o.id !== found.id).slice(0, 2));
        }
      } catch (err) {
        console.error('Failed to load opportunity:', err);
      } finally {
        setLoading(false);
      }
    }

    loadOpportunity();
    window.scrollTo(0, 0);
  }, [id]);

  const handleToggleSave = () => {
    if (!opportunity) return;
    const updated = opportunityService.toggleSave(opportunity.id);
    setIsSaved(updated);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4 font-mono text-xs text-manga-muted">
        <div className="w-10 h-10 border-2 border-manga-accent border-t-transparent rounded-full animate-spin mx-auto" />
        <p>Loading Opportunity Dossier...</p>
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-4 font-mono">
        <h2 className="text-2xl font-bold font-heading uppercase text-white">
          Opportunity Not Found
        </h2>
        <p className="text-xs text-manga-muted">
          The requested opportunity listing ID does not exist or has closed.
        </p>
        <Link to="/opportunities">
          <Button variant="primary">Return to Directory</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Top Navigation & Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Link
          to="/opportunities"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-manga-muted hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Opportunities Archive</span>
        </Link>
      </div>

      {/* Live Verified vs Demo Data Notice Banner */}
      {!opportunity.isMockData ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 text-xs font-mono text-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                <strong>VERIFIED LIVE LISTING:</strong> This role is aggregated from{' '}
                <a
                  href={opportunity.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-emerald-300 hover:text-white"
                >
                  {opportunity.sourceName || 'RemoteOK.com'}
                </a>
                . Applications redirect directly to the verified employer site.
              </span>
            </div>
            <a
              href={opportunity.applyUrl || opportunity.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shrink-0 transition-colors"
            >
              <span>Employer Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-3 bg-neutral-900 border border-amber-500/40 text-xs font-mono text-amber-200 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>DEMO SPECIFICATION:</strong> This listing is a sample/mock demonstration opportunity for evaluation. It is not an active employer opening.
              </span>
            </div>
            <span className="text-[10px] text-manga-dim uppercase shrink-0">
              RECORD: {opportunity.id}
            </span>
          </div>
        </div>
      )}

      {/* Hero Header Box */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-manga-surface border-2 border-manga-borderStrong p-6 sm:p-8 shadow-panel-lg space-y-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-screentone bg-screentone-sm opacity-15 pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start justify-between gap-6">
            {/* Company Logo & Titles */}
            <div className="flex items-start gap-4">
              <img
                src={opportunity.company.logoUrl}
                alt={opportunity.company.name}
                className="w-16 h-16 object-cover border-2 border-manga-border shadow-panel shrink-0 bg-black"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono font-bold text-manga-text">
                    {opportunity.company.name}
                  </span>
                  {opportunity.company.isVerified && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono text-manga-accent bg-black px-2 py-0.5 border border-manga-accent/40 font-bold">
                      <CheckCircle2 className="w-3 h-3 text-manga-accent" />
                      Verified Partner
                    </span>
                  )}
                  <a
                    href={opportunity.company.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-manga-dim hover:text-white inline-flex items-center gap-0.5 font-mono"
                  >
                    <span>Website</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <h1 className="text-2xl sm:text-4xl font-black font-heading uppercase tracking-wide text-white">
                  {opportunity.title}
                </h1>

                <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-manga-muted pt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-manga-accent" />
                    <span>{opportunity.location}</span>
                  </span>
                  <span>•</span>
                  <span className="uppercase text-white font-bold">{opportunity.workMode}</span>
                  <span>•</span>
                  <span>{opportunity.experienceLevel}</span>
                  <span>•</span>
                  <span>{opportunity.category}</span>
                </div>
              </div>
            </div>

            {/* Application CTAs */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <button
                onClick={handleToggleSave}
                className={`p-3 border font-mono text-xs flex items-center gap-2 transition-all cursor-pointer ${
                  isSaved
                    ? 'border-manga-accent bg-manga-accent/20 text-manga-accent shadow-panel-accent'
                    : 'border-manga-border hover:border-white text-manga-muted hover:text-white bg-black/60'
                }`}
                title="Save opportunity"
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-manga-accent' : ''}`} />
                <span className="hidden sm:inline">{isSaved ? 'Saved' : 'Save'}</span>
              </button>

              {!opportunity.isMockData ? (
                <a
                  href={opportunity.applyUrl || opportunity.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold uppercase tracking-wider transition-colors shadow-panel"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Apply on Employer Site</span>
                </a>
              ) : (
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => setShowApplyModal(true)}
                  disabled={hasApplied}
                  leftIcon={<Send className="w-4 h-4" />}
                >
                  {hasApplied ? 'Applied ✓' : 'Apply via Portal'}
                </Button>
              )}
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="relative z-10 pt-4 border-t border-manga-border/60 grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
            <div className="bg-black/60 p-3 border border-white/10">
              <span className="text-[10px] text-manga-dim uppercase block">Monthly Stipend</span>
              <strong className="text-white text-sm">{opportunity.stipend.amount}</strong>
            </div>
            <div className="bg-black/60 p-3 border border-white/10">
              <span className="text-[10px] text-manga-dim uppercase block">PPO Potential</span>
              <strong className="text-emerald-400 text-sm">{opportunity.stipend.ppoRange || 'Yes'}</strong>
            </div>
            <div className="bg-black/60 p-3 border border-white/10">
              <span className="text-[10px] text-manga-dim uppercase block">Tenure Duration</span>
              <strong className="text-white text-sm">{opportunity.duration}</strong>
            </div>
            <div className="bg-black/60 p-3 border border-white/10">
              <span className="text-[10px] text-manga-dim uppercase block">Deadline</span>
              <strong className="text-manga-accent text-sm">
                {new Date(opportunity.applicationDeadline).toLocaleDateString()}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dossier Content & Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Role Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Overview */}
          <div className="p-6 bg-manga-surface border border-manga-border shadow-panel space-y-3 font-mono">
            <h2 className="text-sm font-bold uppercase text-manga-accent tracking-wider border-b border-manga-border pb-2 flex items-center justify-between">
              <span>Role Overview</span>
              <span className="text-xs font-hindi text-manga-dim">// भूमिका विवरण</span>
            </h2>
            <p className="text-xs sm:text-sm text-manga-text leading-relaxed whitespace-pre-line">
              {opportunity.description}
            </p>
          </div>

          {/* Responsibilities */}
          <div className="p-6 bg-manga-surface border border-manga-border shadow-panel space-y-3 font-mono">
            <h2 className="text-sm font-bold uppercase text-white tracking-wider border-b border-manga-border pb-2 flex items-center justify-between">
              <span>Key Responsibilities</span>
              <span className="text-xs font-hindi text-manga-dim">// दायित्व</span>
            </h2>
            <ul className="space-y-2 text-xs sm:text-sm text-manga-text/90">
              {opportunity.responsibilities.map((resp, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-manga-accent font-bold mt-0.5">▸</span>
                  <span>{resp}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Requirements & Skills */}
          <div className="p-6 bg-manga-surface border border-manga-border shadow-panel space-y-4 font-mono">
            <h2 className="text-sm font-bold uppercase text-white tracking-wider border-b border-manga-border pb-2 flex items-center justify-between">
              <span>Candidate Qualifications & Skills</span>
              <span className="text-xs font-hindi text-manga-dim">// योग्यता</span>
            </h2>
            <ul className="space-y-2 text-xs sm:text-sm text-manga-text/90">
              {opportunity.requirements.map((req, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-manga-accent font-bold mt-0.5">▸</span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>

            <div className="pt-3 border-t border-manga-border/60">
              <span className="text-xs text-manga-dim block mb-2 uppercase">Technical Skill Stack:</span>
              <div className="flex flex-wrap gap-2">
                {opportunity.skillsRequired.map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 bg-black border border-white/20 text-xs text-white"
                  >
                    #{skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Perks & Mentorship */}
          <div className="p-6 bg-manga-surface border border-manga-border shadow-panel space-y-3 font-mono">
            <h2 className="text-sm font-bold uppercase text-white tracking-wider border-b border-manga-border pb-2 flex items-center justify-between">
              <span>Perks & Growth Opportunities</span>
              <span className="text-xs font-hindi text-manga-dim">// लाभ</span>
            </h2>
            <ul className="space-y-2 text-xs sm:text-sm text-manga-text/90">
              {opportunity.perks.map((perk, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{perk}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: Company & Eligibility Card */}
        <div className="space-y-6 font-mono text-xs">
          {/* Eligibility Specs */}
          <div className="p-6 bg-manga-surface border border-manga-border shadow-panel space-y-4">
            <h3 className="text-sm font-bold uppercase text-white border-b border-manga-border pb-2">
              Eligibility Criteria
            </h3>
            <div className="space-y-3">
              <div>
                <span className="text-manga-dim block text-[10px] uppercase">Eligible Batches</span>
                <strong className="text-white text-xs">{opportunity.batchEligibility.join(', ')}</strong>
              </div>
              <div>
                <span className="text-manga-dim block text-[10px] uppercase">Degrees Accepted</span>
                <strong className="text-white text-xs">{opportunity.degreeEligibility.join(', ')}</strong>
              </div>
              <div>
                <span className="text-manga-dim block text-[10px] uppercase">Open Positions</span>
                <strong className="text-manga-accent text-xs">{opportunity.openings} Openings</strong>
              </div>
              <div>
                <span className="text-manga-dim block text-[10px] uppercase">Active Applicants</span>
                <strong className="text-white text-xs">{opportunity.applicantCount} candidates applied</strong>
              </div>
            </div>

            <div className="pt-3 border-t border-manga-border">
              <Button
                variant="primary"
                size="md"
                className="w-full"
                onClick={() => setShowApplyModal(true)}
                disabled={hasApplied}
                leftIcon={<Send className="w-4 h-4" />}
              >
                {hasApplied ? 'Already Applied ✓' : 'Submit Application'}
              </Button>
            </div>
          </div>

          {/* Employer Info */}
          <div className="p-6 bg-manga-surface border border-manga-border shadow-panel space-y-3">
            <h3 className="text-sm font-bold uppercase text-white border-b border-manga-border pb-2">
              About the Company
            </h3>
            <div className="space-y-2 text-xs">
              <div>
                <span className="text-manga-dim block text-[10px] uppercase">Organization</span>
                <strong className="text-white">{opportunity.company.name}</strong>
              </div>
              <div>
                <span className="text-manga-dim block text-[10px] uppercase">Industry</span>
                <span className="text-manga-text">{opportunity.company.industry}</span>
              </div>
              <div>
                <span className="text-manga-dim block text-[10px] uppercase">Headquarters</span>
                <span className="text-manga-text">{opportunity.company.headquarters}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Opportunities Carousel */}
      {similarOpportunities.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-4">
          <h3 className="text-lg font-bold font-heading uppercase text-white border-b border-manga-border pb-2">
            Similar Openings in {opportunity.category}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {similarOpportunities.map((opp) => (
              <OpportunityCard key={opp.id} opportunity={opp} />
            ))}
          </div>
        </div>
      )}

      {/* Apply Modal */}
      {showApplyModal && (
        <ApplyModal
          isOpen={showApplyModal}
          onClose={() => setShowApplyModal(false)}
          opportunity={opportunity}
          onAppliedSuccessfully={() => {
            setHasApplied(true);
          }}
        />
      )}
    </div>
  );
};
