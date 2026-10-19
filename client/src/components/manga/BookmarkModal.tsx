import React, { useState } from 'react';
import { Modal } from '../ui/Modal.js';
import { Button } from '../ui/Button.js';
import { Bookmark, Check, Trash2 } from 'lucide-react';
import { api } from '../../api/index.js';
import { useAuth } from '../../context/AuthContext.js';

interface BookmarkModalProps {
  isOpen: boolean;
  onClose: () => void;
  mangaId: number;
  mangaTitle: string;
  currentStatus?: string | null;
  onUpdated: (status: string | null) => void;
}

export const BookmarkModal: React.FC<BookmarkModalProps> = ({
  isOpen,
  onClose,
  mangaId,
  mangaTitle,
  currentStatus,
  onUpdated,
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>(currentStatus || 'reading');

  const options = [
    { id: 'reading', label: 'Currently Reading', desc: 'Track chapter progress and auto-resume', hindi: 'अध्ययनरत' },
    { id: 'plan_to_read', label: 'Plan to Read', desc: 'Save in your backlog for upcoming reading', hindi: 'योजना' },
    { id: 'completed', label: 'Completed', desc: 'Finished reading all available chapters', hindi: 'पूर्ण' },
    { id: 'dropped', label: 'Dropped', desc: 'Temporarily or permanently shelved', hindi: 'स्थगित' },
  ];

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await api.upsertBookmark(mangaId, selectedStatus);
      onUpdated(selectedStatus);
      onClose();
    } catch (err: any) {
      alert(err.message || 'Failed to update bookmark');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await api.removeBookmark(mangaId);
      onUpdated(null);
      onClose();
    } catch (err: any) {
      alert(err.message || 'Failed to remove bookmark');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Library Tracker"
      subtitle={mangaTitle}
      maxWidth="md"
    >
      <div className="space-y-4">
        <p className="text-xs text-manga-muted font-mono">
          Select reading status to organize your personal manga archive:
        </p>

        <div className="space-y-2">
          {options.map((opt) => {
            const isSelected = selectedStatus === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSelectedStatus(opt.id)}
                className={`w-full flex items-center justify-between p-3 border text-left font-mono transition-all cursor-pointer ${
                  isSelected
                    ? 'border-manga-accent bg-manga-accent/10 shadow-sm'
                    : 'border-manga-border hover:border-white/30 bg-manga-elevated'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-manga-text">{opt.label}</span>
                    <span className="text-[10px] text-manga-accent font-hindi">{opt.hindi}</span>
                  </div>
                  <p className="text-xs text-manga-dim mt-0.5">{opt.desc}</p>
                </div>
                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-manga-accent flex items-center justify-center text-white">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-manga-border">
          {currentStatus ? (
            <button
              type="button"
              onClick={handleRemove}
              disabled={loading}
              className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 font-mono cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove from Library</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              isLoading={loading}
              onClick={handleSave}
              leftIcon={<Bookmark className="w-3.5 h-3.5" />}
            >
              Save Status
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
