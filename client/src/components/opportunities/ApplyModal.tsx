import React, { useState } from 'react';
import { Modal } from '../ui/Modal.js';
import { Button } from '../ui/Button.js';
import { CheckCircle2, FileText, Send, User, Sparkles, AlertCircle } from 'lucide-react';
import { Opportunity } from '../../types/opportunity.js';
import { opportunityService } from '../../api/opportunityService.js';

interface ApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  opportunity: Opportunity;
  onAppliedSuccessfully: () => void;
}

export const ApplyModal: React.FC<ApplyModalProps> = ({
  isOpen,
  onClose,
  opportunity,
  onAppliedSuccessfully,
}) => {
  const profile = opportunityService.getProfile();
  const [coverNote, setCoverNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await opportunityService.submitApplication(opportunity.id, coverNote);
      setSubmitted(true);
      onAppliedSuccessfully();
    } catch (err: any) {
      setError(err.message || 'Failed to submit application.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Candidate Application"
      subtitle={`${opportunity.title} • ${opportunity.company.name}`}
      maxWidth="lg"
    >
      {/* Explicit Mock Data Reminder */}
      <div className="bg-amber-950/30 border border-amber-500/40 p-2.5 mb-4 text-[11px] font-mono text-amber-200 flex items-center gap-2">
        <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
        <span>
          <strong>Simulated Application Flow:</strong> This is a frontend demo submission for {opportunity.company.name}.
        </span>
      </div>

      {submitted ? (
        <div className="text-center py-8 space-y-4 font-mono animate-fade-in-up">
          <div className="w-14 h-14 bg-emerald-950/40 border-2 border-emerald-500 text-emerald-400 mx-auto flex items-center justify-center shadow-panel">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <div className="text-xs font-hindi text-emerald-400 font-bold">
              आवेदन सफलतापूर्वक दर्ज // Application Recorded
            </div>
            <h3 className="text-xl font-bold font-heading uppercase text-white mt-1">
              Application Submitted
            </h3>
            <p className="text-xs text-manga-muted max-w-md mx-auto mt-2 leading-relaxed">
              Your candidate dossier has been added to your personal dashboard under <strong>"My Applications"</strong>. Status: <span className="text-emerald-400 font-bold">Applied</span>.
            </p>
          </div>
          <div className="pt-4 flex justify-center gap-3">
            <Button variant="primary" size="sm" onClick={onClose}>
              Done & Return
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
          {error && (
            <div className="p-3 bg-red-950/40 border border-red-500 text-red-200 text-xs font-mono">
              {error}
            </div>
          )}

          {/* Candidate Dossier Overview */}
          <div className="p-3.5 bg-manga-elevated border border-manga-border space-y-2">
            <div className="flex items-center justify-between border-b border-manga-border pb-2">
              <span className="text-xs font-bold uppercase text-white flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-manga-accent" />
                <span>Applying As: {profile.fullName}</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-bold">
                {profile.profileCompletionPercentage}% Profile Ready
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] text-manga-muted">
              <div>
                <span className="text-manga-dim">Email:</span> {profile.email}
              </div>
              <div>
                <span className="text-manga-dim">College:</span> {profile.university}
              </div>
              <div>
                <span className="text-manga-dim">Degree:</span> {profile.degree}
              </div>
              <div>
                <span className="text-manga-dim">Resume:</span> {profile.resumeFileName || 'Default_Resume.pdf'}
              </div>
            </div>
          </div>

          {/* Quick Cover Note */}
          <div>
            <label className="block text-manga-muted uppercase tracking-wider mb-1">
              Short Pitch / Cover Note (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="Why are you uniquely equipped for this specific role? Mention relevant projects or GitHub repos..."
              value={coverNote}
              onChange={(e) => setCoverNote(e.target.value)}
              className="w-full bg-manga-elevated border border-manga-border p-3 text-xs text-manga-text font-mono focus:outline-none focus:border-manga-accent leading-relaxed"
              maxLength={600}
            />
            <div className="text-right text-[10px] text-manga-dim">
              {coverNote.length}/600 chars
            </div>
          </div>

          {/* Footer Controls */}
          <div className="pt-3 border-t border-manga-border flex items-center justify-between">
            <Button variant="outline" size="sm" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              type="submit"
              isLoading={isSubmitting}
              leftIcon={<Send className="w-3.5 h-3.5" />}
            >
              Confirm & Submit Application
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
