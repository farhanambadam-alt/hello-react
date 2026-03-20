import { X, Play } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useState, useEffect, useCallback, useRef } from 'react';

interface MediaItem {
  type: 'image' | 'video';
  src: string;
  videoSrc?: string;
  span?: string;
}

interface MediaLightboxProps {
  open: boolean;
  onClose: () => void;
  items: MediaItem[];
  activeIndex: number;
  onChangeIndex: (index: number) => void;
}



const MediaLightbox = ({ open, onClose, items, activeIndex, onChangeIndex }: MediaLightboxProps) => {
  const [loaded, setLoaded] = useState(false);
  const [exiting, setExiting] = useState(false);
  const touchRef = useRef<{ x: number; y: number } | null>(null);
  const thumbsRef = useRef<HTMLDivElement>(null);
  const current = items[activeIndex];

  useEffect(() => { setLoaded(false); }, [activeIndex]);

  // Scroll active thumbnail into view
  useEffect(() => {
    if (!thumbsRef.current) return;
    const active = thumbsRef.current.children[activeIndex] as HTMLElement;
    active?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [activeIndex]);

  // Lock body scroll
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  const handleClose = useCallback(() => {
    setExiting(true);
    setTimeout(() => { setExiting(false); onClose(); }, 250);
  }, [onClose]);

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
  }, [open, activeIndex, items.length, onChangeIndex, handleClose]);

  if (!open || !current) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col transition-[opacity,transform] duration-300 ease-out ${
        exiting ? 'opacity-0 scale-[1.02]' : 'opacity-100 scale-100'
      }`}
      style={{ isolation: 'isolate' }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-foreground/95 backdrop-blur-2xl" />

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between px-5 pt-[max(env(safe-area-inset-top),16px)] pb-3">
        <span className="text-primary-foreground/50 text-[13px] font-heading font-medium tracking-wide">
          {activeIndex + 1} / {items.length}
        </span>
        <button
          onClick={handleClose}
          className="w-10 h-10 rounded-full bg-primary-foreground/10 backdrop-blur-md flex items-center justify-center border border-primary-foreground/10 active:scale-90 transition-all min-h-[44px] min-w-[44px]"
          aria-label="Close"
        >
          <X size={18} className="text-primary-foreground" />
        </button>
      </div>

      {/* Main swipeable media */}
      <div
        className="relative z-[5] flex-1 flex items-center justify-center px-5 min-h-0"
        onTouchStart={(e) => {
          touchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }}
        onTouchEnd={(e) => {
          if (!touchRef.current) return;
          const dx = touchRef.current.x - e.changedTouches[0].clientX;
          const dy = Math.abs(touchRef.current.y - e.changedTouches[0].clientY);
          touchRef.current = null;
          if (dy > Math.abs(dx)) return; // vertical scroll, ignore
          if (Math.abs(dx) > 40) {
            if (dx > 0) onChangeIndex((activeIndex + 1) % items.length);
            else onChangeIndex((activeIndex - 1 + items.length) % items.length);
          }
        }}
      >
        <div
          className={`relative w-full max-w-[88vw] md:max-w-[60vw] rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 ease-out ${
            loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          {!loaded && (
            <Skeleton className="absolute inset-0 rounded-3xl bg-primary-foreground/5" />
          )}

          {current.type === 'image' ? (
            <img
              key={activeIndex}
              src={current.src}
              alt={`Gallery ${activeIndex + 1}`}
              className="w-full h-auto max-h-[65vh] object-contain bg-black/20 rounded-3xl"
              onLoad={() => setLoaded(true)}
              onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg'; setLoaded(true); }}
              draggable={false}
            />
          ) : (
            <div className="w-full aspect-video bg-black rounded-3xl overflow-hidden">
              <video
                key={activeIndex}
                src={current.videoSrc || current.src}
                controls
                autoPlay
                playsInline
                className="w-full h-full object-contain"
                onLoadedData={() => setLoaded(true)}
                poster={current.src}
              />
            </div>
          )}
        </div>
      </div>

      {/* Thumbnail strip */}
      <div className="relative z-10 flex-shrink-0 px-4 pb-[max(env(safe-area-inset-bottom),24px)] pt-4">
        <div
          ref={thumbsRef}
          className="flex gap-2.5 justify-center items-center overflow-x-auto scrollbar-hide py-1"
        >
          {items.map((item, i) => {
            const isActive = i === activeIndex;
            return (
              <button
                key={i}
                onClick={() => onChangeIndex(i)}
                className={`relative flex-shrink-0 overflow-hidden transition-[width,height,opacity,transform] duration-250 ease-out ${
                  isActive
                    ? 'w-[56px] h-[56px] md:w-[64px] md:h-[64px] rounded-2xl ring-2 ring-primary-foreground ring-offset-2 ring-offset-transparent scale-110'
                    : 'w-[44px] h-[44px] md:w-[52px] md:h-[52px] rounded-xl opacity-40 hover:opacity-70'
                }`}
              >
                <img
                  src={item.src}
                  alt={`Thumb ${i + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  draggable={false}
                  onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }}
                />
                {item.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-inherit">
                    <Play size={12} className="text-primary-foreground" fill="white" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MediaLightbox;
