import React, { useState, useEffect } from 'react';
import {
  User,
  GraduationCap,
  Briefcase,
  ExternalLink,
  Save,
  RotateCcw,
  Plus,
  X,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { CandidateProfile, WorkMode } from '../types/opportunity.js';
import {
  opportunityService,
  INITIAL_CANDIDATE_PROFILE,
} from '../api/opportunityService.js';
import { Button } from '../components/ui/Button.js';

export const Profile: React.FC = () => {
  const [profile, setProfile] = useState<CandidateProfile>(() =>
    opportunityService.getProfile()
  );
  const [newSkillInput, setNewSkillInput] = useState('');
  const [savedFeedback, setSavedFeedback] = useState(false);

  // Recalculate completion percentage dynamically
  const calculateCompletion = (p: CandidateProfile): number => {
    let score = 0;
    if (p.fullName.trim()) score += 10;
    if (p.email.trim()) score += 10;
    if (p.phone.trim()) score += 10;
    if (p.university.trim()) score += 15;
    if (p.degree.trim()) score += 10;
    if (p.headline.trim()) score += 10;
    if (p.skills.length >= 3) score += 15;
    if (p.portfolioUrl?.trim()) score += 10;
    if (p.githubUrl?.trim()) score += 10;
    return Math.min(100, score);
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillInput.trim()) return;
    const skill = newSkillInput.trim();
    if (!profile.skills.includes(skill)) {
      const updatedSkills = [...profile.skills, skill];
      const updatedProfile = { ...profile, skills: updatedSkills };
      updatedProfile.profileCompletionPercentage = calculateCompletion(updatedProfile);
      setProfile(updatedProfile);
      opportunityService.updateProfile(updatedProfile);
    }
    setNewSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const updatedSkills = profile.skills.filter((s) => s !== skillToRemove);
    const updatedProfile = { ...profile, skills: updatedSkills };
    updatedProfile.profileCompletionPercentage = calculateCompletion(updatedProfile);
    setProfile(updatedProfile);
    opportunityService.updateProfile(updatedProfile);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...profile,
      profileCompletionPercentage: calculateCompletion(profile),
    };
    opportunityService.updateProfile(updated);
    setProfile(updated);
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 3000);
  };

  const handleResetToDefault = () => {
    if (window.confirm('Reset candidate profile to Aryan Ranjan default template?')) {
      opportunityService.updateProfile(INITIAL_CANDIDATE_PROFILE);
      setProfile(INITIAL_CANDIDATE_PROFILE);
      setSavedFeedback(true);
      setTimeout(() => setSavedFeedback(false), 3000);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-mono">
      {/* Header */}
      <div className="border-b-2 border-manga-border pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-manga-accent uppercase tracking-widest">
              CANDIDATE ONBOARDING & DOSSIER
            </span>
            <span className="text-xs font-hindi text-manga-accent font-bold">
              // परिचय और तैयारी
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-heading uppercase tracking-wider text-white mt-1">
            Candidate Profile
          </h1>
          <p className="text-xs text-manga-muted mt-1">
            Your candidate information auto-fills opportunity applications across the platform.
          </p>
        </div>

        <button
          onClick={handleResetToDefault}
          className="text-xs text-manga-dim hover:text-white flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restore Default Template</span>
        </button>
      </div>

      {/* Profile Readiness Score Banner */}
      <div className="p-6 bg-manga-surface border-2 border-manga-borderStrong shadow-panel relative overflow-hidden">
        <div className="absolute inset-0 bg-screentone bg-screentone-sm opacity-15 pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-black border-2 border-manga-accent flex items-center justify-center font-bold text-xl text-white shadow-panel-accent shrink-0">
              {profile.profileCompletionPercentage}%
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold font-heading uppercase text-white">
                  Profile Readiness
                </h3>
                <span className="text-xs font-hindi text-emerald-400 font-bold">
                  // तैयारी सूचकांक
                </span>
              </div>
              <p className="text-xs text-manga-muted mt-0.5 max-w-md">
                {profile.profileCompletionPercentage >= 90
                  ? 'Your profile is fully calibrated for automated candidate matching.'
                  : 'Add your portfolio link and technical skills to maximize response rates.'}
              </p>
            </div>
          </div>

          <div className="w-full sm:w-48 bg-neutral-900 border border-white/20 h-3">
            <div
              className="bg-manga-accent h-full transition-all duration-500 shadow-glow-red"
              style={{ width: `${profile.profileCompletionPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {savedFeedback && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-500 text-emerald-200 text-xs flex items-center gap-2 animate-fade-in-up">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Candidate dossier saved successfully to local storage.</span>
        </div>
      )}

      {/* Main Profile Form */}
      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Section 1: Basic Information */}
        <div className="p-6 bg-manga-surface border border-manga-border shadow-panel space-y-4">
          <h2 className="text-sm font-bold uppercase text-white border-b border-manga-border pb-2 flex items-center gap-2">
            <User className="w-4 h-4 text-manga-accent" />
            <span>Personal Information // व्यक्तिगत जानकारी</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-manga-muted uppercase tracking-wider mb-1">
                Full Legal Name *
              </label>
              <input
                type="text"
                value={profile.fullName}
                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                className="w-full bg-manga-elevated border border-manga-border p-2.5 text-white focus:outline-none focus:border-manga-accent"
                required
              />
            </div>

            <div>
              <label className="block text-manga-muted uppercase tracking-wider mb-1">
                Email Address *
              </label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full bg-manga-elevated border border-manga-border p-2.5 text-white focus:outline-none focus:border-manga-accent"
                required
              />
            </div>

            <div>
              <label className="block text-manga-muted uppercase tracking-wider mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full bg-manga-elevated border border-manga-border p-2.5 text-white focus:outline-none focus:border-manga-accent"
              />
            </div>

            <div>
              <label className="block text-manga-muted uppercase tracking-wider mb-1">
                Current Location (City / Region)
              </label>
              <input
                type="text"
                value={profile.currentCity}
                onChange={(e) => setProfile({ ...profile, currentCity: e.target.value })}
                className="w-full bg-manga-elevated border border-manga-border p-2.5 text-white focus:outline-none focus:border-manga-accent"
              />
            </div>
          </div>

          <div>
            <label className="block text-manga-muted uppercase tracking-wider mb-1 text-xs">
              Candidate Headline / Professional Summary *
            </label>
            <input
              type="text"
              value={profile.headline}
              onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
              className="w-full bg-manga-elevated border border-manga-border p-2.5 text-xs text-white focus:outline-none focus:border-manga-accent"
              required
            />
          </div>

          <div>
            <label className="block text-manga-muted uppercase tracking-wider mb-1 text-xs">
              Bio & Focus Areas
            </label>
            <textarea
              rows={3}
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              className="w-full bg-manga-elevated border border-manga-border p-2.5 text-xs text-white focus:outline-none focus:border-manga-accent leading-relaxed"
            />
          </div>
        </div>

        {/* Section 2: Education & Academics */}
        <div className="p-6 bg-manga-surface border border-manga-border shadow-panel space-y-4">
          <h2 className="text-sm font-bold uppercase text-white border-b border-manga-border pb-2 flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-manga-accent" />
            <span>Academic Background // शिक्षा</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="sm:col-span-2">
              <label className="block text-manga-muted uppercase tracking-wider mb-1">
                University / Institution *
              </label>
              <input
                type="text"
                value={profile.university}
                onChange={(e) => setProfile({ ...profile, university: e.target.value })}
                className="w-full bg-manga-elevated border border-manga-border p-2.5 text-white focus:outline-none focus:border-manga-accent"
                required
              />
            </div>

            <div>
              <label className="block text-manga-muted uppercase tracking-wider mb-1">
                Graduation Year *
              </label>
              <input
                type="text"
                value={profile.graduationYear}
                onChange={(e) => setProfile({ ...profile, graduationYear: e.target.value })}
                className="w-full bg-manga-elevated border border-manga-border p-2.5 text-white focus:outline-none focus:border-manga-accent"
                required
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-manga-muted uppercase tracking-wider mb-1">
                Degree & Specialization *
              </label>
              <input
                type="text"
                value={profile.degree}
                onChange={(e) => setProfile({ ...profile, degree: e.target.value })}
                className="w-full bg-manga-elevated border border-manga-border p-2.5 text-white focus:outline-none focus:border-manga-accent"
                required
              />
            </div>
          </div>
        </div>

        {/* Section 3: Technical Skills Tag Manager */}
        <div className="p-6 bg-manga-surface border border-manga-border shadow-panel space-y-4">
          <h2 className="text-sm font-bold uppercase text-white border-b border-manga-border pb-2 flex items-center justify-between">
            <span>Technical Skills & Tools</span>
            <span className="text-xs text-manga-dim font-hindi">// कौशल</span>
          </h2>

          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-black border border-white/20 text-xs text-white"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="text-manga-dim hover:text-red-400 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-2 max-w-sm pt-2">
            <input
              type="text"
              placeholder="Add skill (e.g. Next.js, Docker)..."
              value={newSkillInput}
              onChange={(e) => setNewSkillInput(e.target.value)}
              className="flex-1 bg-manga-elevated border border-manga-border px-3 py-2 text-xs text-white focus:outline-none focus:border-manga-accent"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddSkill}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              Add
            </Button>
          </div>
        </div>

        {/* Section 4: Portfolio & Social Links */}
        <div className="p-6 bg-manga-surface border border-manga-border shadow-panel space-y-4">
          <h2 className="text-sm font-bold uppercase text-white border-b border-manga-border pb-2 flex items-center justify-between">
            <span>Portfolio & Work Samples</span>
            <span className="text-xs text-manga-dim font-hindi">// पोर्टफोलियो</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-manga-muted uppercase tracking-wider mb-1">
                Portfolio Website
              </label>
              <input
                type="url"
                value={profile.portfolioUrl || ''}
                onChange={(e) => setProfile({ ...profile, portfolioUrl: e.target.value })}
                className="w-full bg-manga-elevated border border-manga-border p-2.5 text-white focus:outline-none focus:border-manga-accent"
              />
            </div>

            <div>
              <label className="block text-manga-muted uppercase tracking-wider mb-1">
                GitHub Profile URL
              </label>
              <input
                type="url"
                value={profile.githubUrl || ''}
                onChange={(e) => setProfile({ ...profile, githubUrl: e.target.value })}
                className="w-full bg-manga-elevated border border-manga-border p-2.5 text-white focus:outline-none focus:border-manga-accent"
              />
            </div>

            <div>
              <label className="block text-manga-muted uppercase tracking-wider mb-1">
                LinkedIn Profile URL
              </label>
              <input
                type="url"
                value={profile.linkedinUrl || ''}
                onChange={(e) => setProfile({ ...profile, linkedinUrl: e.target.value })}
                className="w-full bg-manga-elevated border border-manga-border p-2.5 text-white focus:outline-none focus:border-manga-accent"
              />
            </div>
          </div>
        </div>

        {/* Section 5: Work Preferences */}
        <div className="p-6 bg-manga-surface border border-manga-border shadow-panel space-y-4">
          <h2 className="text-sm font-bold uppercase text-white border-b border-manga-border pb-2 flex items-center justify-between">
            <span>Work Preferences</span>
            <span className="text-xs text-manga-dim font-hindi">// प्राथमिकताएं</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-manga-muted uppercase tracking-wider mb-1">
                Preferred Work Mode
              </label>
              <select
                value={profile.workModePreference}
                onChange={(e) => setProfile({ ...profile, workModePreference: e.target.value as any })}
                className="w-full bg-manga-elevated border border-manga-border p-2.5 text-white focus:outline-none focus:border-manga-accent"
              >
                <option value="Hybrid">Hybrid // मिश्रित</option>
                <option value="Remote">Remote // दूरस्थ</option>
                <option value="On-site">On-site // कार्यालय</option>
                <option value="Flexible">Flexible // लचीला</option>
              </select>
            </div>

            <div>
              <label className="block text-manga-muted uppercase tracking-wider mb-1">
                Minimum Expected Monthly Stipend (INR)
              </label>
              <input
                type="number"
                step="5000"
                value={profile.expectedStipendMin}
                onChange={(e) => setProfile({ ...profile, expectedStipendMin: Number(e.target.value) })}
                className="w-full bg-manga-elevated border border-manga-border p-2.5 text-white focus:outline-none focus:border-manga-accent"
              />
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save Candidate Profile
          </Button>
        </div>
      </form>
    </div>
  );
};
