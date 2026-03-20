import { useState, useEffect, useRef, useCallback } from 'react';
import { X, Instagram, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import InstagramEmbed from '@/components/InstagramEmbed';
import { Skeleton } from '@/components/ui/skeleton';

interface GalleryItem {
  type: 'post' | 'reel';
  url: string;
}

interface InstagramMediaDrawerProps {
  open: boolean;
  onClose: () => void;
  items: GalleryItem[];
  activeIndex: number;
  onChangeIndex: (index: number) => void;
}

const InstagramMediaDrawer = ({
  open,
  onClose,
  items,
  activeIndex,
  onChangeIndex,
}: InstagramMediaDrawerProps) => {
  const [entering, setEntering] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [embedLoaded, setEmbedLoaded] = useState(false);
  const thumbsRef = useRef<HTMLDivElement>(null);
  const touchRef = useRef<{ x: number; y: number } | null>(null);

  const current = items[activeIndex];
  const isReel = current?.type === 'reel';

  // Reset loaded state when index changes
  useEffect(() => {
    setEmbedLoaded(false);
  }, [activeIndex]);

  // Animate in immediately on open
  useEffect(() => {
    if (open) requestAnimationFrame(() => setEntering(true));
    else setEntering(false);
  }, [open]);

  // Lock body scroll
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  // Scroll active thumb into view
  useEffect(() => {
    if (!thumbsRef.current) return;
    const el = thumbsRef.current.children[activeIndex] as HTMLElement;
    el?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [activeIndex]);

  // Keyboard nav
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') onChangeIndex((activeIndex - 1 + items.length) % items.length);
      if (e.key === 'ArrowRight') onChangeIndex((activeIndex + 1) % items.length);
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, activeIndex, items.length, onChangeIndex]);

  const handleClose = useCallback(() => {
    setExiting(true);
    setTimeout(() => {
      setExiting(false);
      setEntering(false);
      onClose();
    }, 300);
  }, [onClose]);

  if (!open || !current) return null;

  return (
    <div className="fixed inset-0 z-[100]" style={{ isolation: 'isolate' }}>
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-foreground/60 backdrop-blur-sm transition-opacity duration-300 ${
          entering && !exiting ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />

      {/* Drawer panel — opens immediately */}
      <div
        className={`absolute bottom-0 left-0 right-0 z-[101] bg-card rounded-t-3xl border-t border-border shadow-2xl transition-transform duration-300 ease-out ${
          entering && !exiting ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ maxHeight: '88vh' }}
      >
        {/* Close button */}
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

        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full bg-muted" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pb-3">
          <div className="flex items-center gap-2">
            <Instagram size={14} className="text-primary" />
            <span className="text-[13px] font-heading font-semibold text-foreground capitalize">
              {current.type}
            </span>
          </div>
          <span className="text-[12px] font-body text-muted-foreground">
            {activeIndex + 1} / {items.length}
          </span>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(88vh - 100px)' }}>
          {/* Main media with swipe */}
          <div
            className="relative px-4"
            onTouchStart={(e) => {
              touchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            }}
            onTouchEnd={(e) => {
              if (!touchRef.current) return;
              const dx = touchRef.current.x - e.changedTouches[0].clientX;
              const dy = Math.abs(touchRef.current.y - e.changedTouches[0].clientY);
              touchRef.current = null;
              if (dy > Math.abs(dx)) return;
              if (Math.abs(dx) > 40) {
                if (dx > 0) onChangeIndex((activeIndex + 1) % items.length);
                else onChangeIndex((activeIndex - 1 + items.length) % items.length);
              }
            }}
          >
            {/* Pre-sized container: uses aspect ratio placeholder to prevent layout shift */}
            <div
              key={activeIndex}
              className="relative w-full max-w-[400px] mx-auto rounded-2xl overflow-hidden border border-border"
              style={{
                aspectRatio: isReel ? '9 / 12' : '1 / 1',
                background: isReel ? '#000' : 'hsl(var(--secondary))',
              }}
            >
              {/* Placeholder shown until embed loads */}
              <div
                className={`absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 transition-opacity duration-500 ${
                  embedLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
                }`}
              >
                <Skeleton className="absolute inset-0 rounded-none" />
                <Instagram size={32} className="relative z-10 text-muted-foreground/40 animate-pulse" />
                {isReel && (
                  <div className="relative z-10 w-12 h-12 rounded-full bg-card/90 flex items-center justify-center shadow-md">
                    <Play size={16} className="text-foreground ml-0.5" fill="currentColor" />
                  </div>
                )}
                <span className="relative z-10 text-[11px] text-muted-foreground/50 font-body">
                  Loading {current.type}…
                </span>
              </div>

              {/* Actual embed — fades in on load */}
              <div
                className={`relative w-full h-full transition-opacity duration-500 ${
                  embedLoaded ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <InstagramEmbed
                  url={current.url}
                  type={current.type}
                  mode="full"
                  onLoaded={() => setEmbedLoaded(true)}
                />
              </div>
            </div>

            {/* Nav arrows for desktop */}
            {items.length > 1 && (
              <>
                <button
                  onClick={() => onChangeIndex((activeIndex - 1 + items.length) % items.length)}
                  className="hidden md:flex absolute left-1 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-card/80 backdrop-blur-md border border-border items-center justify-center hover:bg-card transition-colors"
                  aria-label="Previous"
                >
                  <ChevronLeft size={16} className="text-foreground" />
                </button>
                <button
                  onClick={() => onChangeIndex((activeIndex + 1) % items.length)}
                  className="hidden md:flex absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-card/80 backdrop-blur-md border border-border items-center justify-center hover:bg-card transition-colors"
                  aria-label="Next"
                >
                  <ChevronRight size={16} className="text-foreground" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail strip */}
          <div className="px-4 pt-4 pb-[max(env(safe-area-inset-bottom),20px)]">
            <div
              ref={thumbsRef}
              className="flex gap-2.5 overflow-x-auto scrollbar-hide py-1 justify-center items-center"
            >
              {items.map((item, i) => {
                const isActive = i === activeIndex;
                const isItemReel = item.type === 'reel';
                return (
                  <button
                    key={i}
                    onClick={() => onChangeIndex(i)}
                    className={`relative flex-shrink-0 overflow-hidden transition-[width,height,opacity,transform] duration-200 ease-out bg-secondary ${
                      isActive
                        ? 'w-[60px] h-[60px] rounded-2xl ring-2 ring-primary ring-offset-2 ring-offset-card scale-105'
                        : 'w-[50px] h-[50px] rounded-xl opacity-50 hover:opacity-80'
                    }`}
                  >
                    <InstagramEmbed url={item.url} type={item.type} mode="thumb" />
                    {/* Click overlay */}
                    <div className="absolute inset-0 z-20" />
                    {isItemReel && (
                      <div className="absolute inset-0 z-10 flex items-center justify-center bg-foreground/30">
                        <Play size={10} className="text-primary-foreground" fill="white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstagramMediaDrawer;
