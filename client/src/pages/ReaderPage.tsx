import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api/index.js';
import { Chapter } from '../types/index.js';
import { CinematicReader } from '../components/reader/CinematicReader.js';
import { Button } from '../components/ui/Button.js';

export const ReaderPage: React.FC = () => {
  const { chapterId } = useParams<{ chapterId: string }>();
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadChapter() {
      if (!chapterId) return;
      setLoading(true);
      setError(null);
      try {
        const res = await api.getChapter(parseInt(chapterId, 10));
        if (res.success && res.data) {
          setChapter(res.data);
        } else {
          setError('Failed to load chapter data.');
        }
      } catch (err: any) {
        setError(err.message || 'Chapter not found.');
      } finally {
        setLoading(false);
      }
    }

    loadChapter();
    window.scrollTo(0, 0);
  }, [chapterId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-2 border-manga-accent border-t-transparent rounded-full animate-spin" />
        <p className="font-mono text-xs uppercase tracking-widest text-manga-muted animate-pulse">
          Opening Chapter Codex... // 読込中
        </p>
      </div>
    );
  }

  if (error || !chapter) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 text-center space-y-4">
        <div className="w-12 h-12 bg-neutral-900 border border-red-500 text-red-500 flex items-center justify-center font-display text-2xl font-bold">
          !
        </div>
        <h2 className="text-xl font-display font-bold uppercase text-white">
          Chapter Unavailable
        </h2>
        <p className="text-xs font-mono text-manga-muted max-w-sm">
          {error || 'The chapter could not be retrieved from the database.'}
        </p>
        <Link to="/explore">
          <Button variant="primary">Return to Catalog</Button>
        </Link>
      </div>
    );
  }

  return <CinematicReader chapter={chapter} />;
};
