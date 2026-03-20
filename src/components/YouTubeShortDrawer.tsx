import { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import YouTubeShort from '@/components/YouTubeShort';

interface YouTubeShortDrawerProps {
  open: boolean;
  onClose: () => void;
  videoId: string;
}

const YouTubeShortDrawer = ({ open, onClose, videoId }: YouTubeShortDrawerProps) => {
  const [entering, setEntering] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (open) requestAnimationFrame(() => setEntering(true));
    else setEntering(false);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open]);

  const handleClose = useCallback(() => {
    setExiting(true);
    setTimeout(() => {
      setExiting(false);
      setEntering(false);
      onClose();
    }, 300);
  }, [onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100]" style={{ isolation: 'isolate' }}>
      <div
        className={`absolute inset-0 bg-foreground/60 backdrop-blur-sm transition-opacity duration-300 ${
          entering && !exiting ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />

      <div
        className={`absolute bottom-0 left-0 right-0 z-[101] bg-card rounded-t-3xl border-t border-border shadow-2xl transition-transform duration-300 ease-out ${
          entering && !exiting ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ maxHeight: '90vh' }}
      >
        <button
          onClick={handleClose}
          className="absolute -top-14 right-4 z-[102] transition-all duration-300"
          style={{
            opacity: entering && !exiting ? 1 : 0,
            transform: entering && !exiting ? 'scale(1)' : 'scale(0.9)',
          }}
          aria-label="Close"
        >
          <div className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-card/90 backdrop-blur-md flex items-center justify-center border border-border shadow-lg">
            <X size={18} className="text-foreground" />
          </div>
        </button>

        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full bg-muted" />
        </div>

        <div className="flex items-center justify-between px-5 pb-3">
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-destructive fill-current">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z" />
              <path d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="white" />
            </svg>
            <span className="text-[13px] font-heading font-semibold text-foreground">
              YouTube Short
            </span>
          </div>
        </div>

        <div className="overflow-y-auto px-2 sm:px-4 pb-[max(env(safe-area-inset-bottom),20px)]">
          <div
            className="relative w-full max-w-[360px] mx-auto rounded-2xl overflow-hidden border border-border"
            style={{ aspectRatio: '9 / 16', maxHeight: 'calc(90vh - 100px)', background: '#000' }}
          >
            <YouTubeShort videoId={videoId} mode="full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default YouTubeShortDrawer;
