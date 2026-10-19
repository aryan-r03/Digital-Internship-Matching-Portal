import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Briefcase,
  Bookmark,
  CheckCircle2,
  Clock,
  ArrowRight,
  User,
  Sparkles,
  MapPin,
  ExternalLink,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';
import { Opportunity, ApplicationRecord } from '../types/opportunity.js';
import { opportunityService } from '../api/opportunityService.js';
import { Button } from '../components/ui/Button.js';
import { OpportunityCard } from '../components/opportunities/OpportunityCard.js';

export const Dashboard: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') === 'saved' ? 'saved' : 'applications';

  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [savedOpportunities, setSavedOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);

  const profile = opportunityService.getProfile();

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const apps = opportunityService.getApplications();
      setApplications(apps);
      const saved = await opportunityService.getSavedOpportunities();
      setSavedOpportunities(saved);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [activeTab]);

  const statusColors = {
    Applied: 'bg-neutral-800 text-neutral-300 border-neutral-700',
    'In Review': 'bg-blue-950/60 text-blue-300 border-blue-600',
    Shortlisted: 'bg-emerald-950/60 text-emerald-300 border-emerald-500',
    Assessment: 'bg-purple-950/60 text-purple-300 border-purple-500',
    'Interview Scheduled': 'bg-amber-950/60 text-amber-300 border-amber-500',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-mono">
      {/* Header */}
      <div className="border-b-2 border-manga-border pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-manga-accent uppercase tracking-widest">
              CANDIDATE DASHBOARD
            </span>
            <span className="text-xs font-hindi text-manga-accent font-bold">
              // अभ्यर्थी डैशबोर्ड
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-heading uppercase tracking-wider text-white mt-1">
            Tracking & Applications
          </h1>
          <p className="text-xs text-manga-muted mt-1">
            Manage your submitted applications, interview stages, and saved opportunities.
          </p>
        </div>

        {/* Profile Readiness Meter Widget */}
        <Link
          to="/profile"
          className="p-3 bg-manga-surface border border-manga-border hover:border-manga-accent transition-colors flex items-center gap-3 shrink-0 shadow-panel"
        >
          <div className="w-10 h-10 rounded-full bg-black border-2 border-manga-accent flex items-center justify-center font-bold text-xs text-white">
            {profile.profileCompletionPercentage}%
          </div>
          <div className="text-left text-xs">
            <div className="font-bold text-white uppercase font-heading">
              {profile.fullName}
            </div>
            <div className="text-[10px] text-emerald-400">
              Profile Ready for Matching →
            </div>
          </div>
        </Link>
      </div>

      {/* Tabs Row */}
      <div className="flex items-center gap-2 border-b border-manga-border pb-3 text-xs uppercase tracking-wider">
        <button
          onClick={() => setSearchParams({ tab: 'applications' })}
          className={`px-5 py-2.5 border font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'applications'
              ? 'border-manga-accent bg-manga-accent text-white shadow-panel-accent'
              : 'border-manga-border hover:border-white text-manga-muted hover:text-white bg-manga-surface'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>My Applications ({applications.length})</span>
          <span className="text-[10px] font-hindi opacity-75">// आवेदन</span>
        </button>

        <button
          onClick={() => setSearchParams({ tab: 'saved' })}
          className={`px-5 py-2.5 border font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'saved'
              ? 'border-manga-accent bg-manga-accent text-white shadow-panel-accent'
              : 'border-manga-border hover:border-white text-manga-muted hover:text-white bg-manga-surface'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>Saved Opportunities ({savedOpportunities.length})</span>
          <span className="text-[10px] font-hindi opacity-75">// सुरक्षित</span>
        </button>
      </div>

      {/* VIEW 1: MY APPLICATIONS */}
      {activeTab === 'applications' && (
        <div className="space-y-4">
          {applications.length === 0 ? (
            <div className="p-16 text-center border-2 border-dashed border-manga-border bg-manga-surface space-y-3">
              <Briefcase className="w-10 h-10 text-manga-dim mx-auto" />
              <h3 className="text-base font-bold font-heading uppercase text-white">
                No Applications Submitted Yet
              </h3>
              <p className="text-xs text-manga-muted max-w-sm mx-auto">
                Explore open opportunities and submit your candidacy to track interview progression here.
              </p>
              <div className="pt-2">
                <Link to="/opportunities">
                  <Button variant="primary" size="sm">
                    Browse Open Roles
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-manga-border border border-manga-border bg-manga-surface shadow-panel">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={app.companyLogoUrl}
                      alt={app.companyName}
                      className="w-12 h-12 object-cover border border-white/20 shrink-0 bg-black"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-manga-muted">
                          {app.companyName}
                        </span>
                        <span>•</span>
                        <span className="text-[11px] text-manga-dim">
                          Applied {new Date(app.appliedDate).toLocaleDateString()}
                        </span>
                      </div>

                      <Link
                        to={`/opportunities/${app.opportunityId}`}
                        className="text-base font-bold font-heading text-white hover:text-manga-accent transition-colors block uppercase"
                      >
                        {app.opportunityTitle}
                      </Link>

                      <div className="flex items-center gap-3 text-xs text-manga-muted">
                        <span>{app.location} ({app.workMode})</span>
                        <span>•</span>
                        <strong className="text-white">{app.stipendAmount}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                    <span
                      className={`px-3 py-1 border text-xs font-bold uppercase tracking-wider ${
                        (statusColors as any)[app.status] || 'bg-neutral-800 text-white'
                      }`}
                    >
                      {app.status}
                    </span>
                    <Link
                      to={`/opportunities/${app.opportunityId}`}
                      className="text-xs text-manga-accent hover:underline flex items-center gap-1"
                    >
                      <span>View Dossier</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: SAVED OPPORTUNITIES */}
      {activeTab === 'saved' && (
        <div className="space-y-4">
          {savedOpportunities.length === 0 ? (
            <div className="p-16 text-center border-2 border-dashed border-manga-border bg-manga-surface space-y-3">
              <Bookmark className="w-10 h-10 text-manga-dim mx-auto" />
              <h3 className="text-base font-bold font-heading uppercase text-white">
                Your Saved Vault is Empty
              </h3>
              <p className="text-xs text-manga-muted max-w-sm mx-auto">
                Bookmark interesting internships while browsing the directory to review them later.
              </p>
              <div className="pt-2">
                <Link to="/opportunities">
                  <Button variant="primary" size="sm">
                    Discover Opportunities
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedOpportunities.map((opp) => (
                <OpportunityCard
                  key={opp.id}
                  opportunity={opp}
                  onBookmarkToggled={loadDashboardData}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
