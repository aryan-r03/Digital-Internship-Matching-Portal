import React, { useState } from 'react';
import { Modal } from '../ui/Modal.js';
import { Button } from '../ui/Button.js';
import { Star, MessageSquare } from 'lucide-react';
import { api } from '../../api/index.js';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  mangaId: number;
  mangaTitle: string;
  onSubmitted: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  mangaId,
  mangaTitle,
  onSubmitted,
}) => {
  const [ratingStory, setRatingStory] = useState(5);
  const [ratingArt, setRatingArt] = useState(5);
  const [ratingCharacters, setRatingCharacters] = useState(5);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const overallScore = ((ratingStory + ratingArt + ratingCharacters) / 3).toFixed(1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (title.trim().length < 2) {
      setError('Title must be at least 2 characters.');
      return;
    }
    if (content.trim().length < 10) {
      setError('Review content must be at least 10 characters.');
      return;
    }

    setLoading(true);
    try {
      await api.submitReview(mangaId, {
        rating_story: ratingStory,
        rating_art: ratingArt,
        rating_characters: ratingCharacters,
        title: title.trim(),
        content: content.trim(),
      });
      onSubmitted();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  const renderRatingBar = (
    label: string,
    value: number,
    onChange: (val: number) => void
  ) => (
    <div className="flex items-center justify-between gap-4 py-2 border-b border-manga-border/50">
      <span className="text-xs font-mono uppercase text-manga-text">{label}</span>
      <div className="flex items-center gap-1.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            type="button"
            key={star}
            onClick={() => onChange(star)}
            className="p-1 focus:outline-none cursor-pointer"
          >
            <Star
              className={`w-5 h-5 transition-colors ${
                star <= value
                  ? 'fill-manga-gold text-manga-gold'
                  : 'text-neutral-700 hover:text-neutral-500'
              }`}
            />
          </button>
        ))}
        <span className="text-xs font-mono text-manga-gold font-bold ml-1 w-4 text-right">
          {value}
        </span>
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Write Manga Review"
      subtitle={mangaTitle}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-950/40 border border-red-500/50 text-red-200 text-xs font-mono">
            {error}
          </div>
        )}

        {/* Rating Breakdown */}
        <div className="bg-manga-elevated p-3 border border-manga-border space-y-1">
          {renderRatingBar('Story Pacing & Narrative', ratingStory, setRatingStory)}
          {renderRatingBar('Art Direction & Screentones', ratingArt, setRatingArt)}
          {renderRatingBar('Character Development', ratingCharacters, setRatingCharacters)}

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs font-mono font-bold uppercase text-manga-accent">
              Calculated Overall Score:
            </span>
            <div className="flex items-center gap-1 text-sm font-mono font-bold text-manga-gold">
              <Star className="w-4 h-4 fill-manga-gold" />
              <span>{overallScore} / 5.0</span>
            </div>
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-manga-muted mb-1">
            Review Headline
          </label>
          <input
            type="text"
            placeholder="e.g. A visual tour de force with haunting ink textures..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-manga-elevated border border-manga-border px-3 py-2 text-sm text-manga-text font-mono focus:outline-none focus:border-manga-accent"
            maxLength={100}
            required
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-manga-muted mb-1">
            Detailed Commentary & Impressions
          </label>
          <textarea
            rows={4}
            placeholder="Share your thoughts on the panel compositions, action sequences, emotional weight, or worldbuilding..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-manga-elevated border border-manga-border p-3 text-sm text-manga-text font-mono focus:outline-none focus:border-manga-accent leading-relaxed"
            maxLength={2000}
            required
          />
          <div className="text-right text-[10px] text-manga-dim font-mono">
            {content.length}/2000 characters
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-manga-border">
          <Button variant="outline" size="sm" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            type="submit"
            isLoading={loading}
            leftIcon={<MessageSquare className="w-3.5 h-3.5" />}
          >
            Publish Review
          </Button>
        </div>
      </form>
    </Modal>
  );
};
