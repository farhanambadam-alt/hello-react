import { useState, useEffect, useRef, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Salon } from '@/types/salon';

interface FeaturedCarouselProps {
  salons: Salon[];
}

const GRADIENT_PALETTES = [
  'from-[hsl(340,60%,35%)] to-[hsl(340,50%,50%)]',
  'from-[hsl(220,55%,30%)] to-[hsl(220,50%,48%)]',
  'from-[hsl(160,45%,28%)] to-[hsl(160,40%,42%)]',
];

const FeaturedCarousel = memo(({ salons }: FeaturedCarouselProps) => {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Pseudo-infinite: duplicate 5×
  const INFINITE_DATA = [
    ...salons,
    ...salons,
    ...salons,
    ...salons,
    ...salons,
  ];

  const startIndex = salons.length * 2;
  const [activeIndex, setActiveIndex] = useState(startIndex);

  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const userInteractingRef = useRef(false);

  // Center the starting card on mount
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    requestAnimationFrame(() => {
      const card = container.children[startIndex] as HTMLElement | undefined;
      if (!card) return;
      const cardWidth = card.offsetWidth;
      const containerWidth = container.offsetWidth;
      const scrollPos =
        card.offsetLeft - (containerWidth / 2 - cardWidth / 2);
      container.scrollLeft = scrollPos;
    });
  }, [startIndex]);

  // Seamless infinite reset: silently jump to the middle set when near edges
  const isResettingRef = useRef(false);

  const resetToCenter = useCallback(() => {
    const container = scrollRef.current;
    if (!container || !container.children.length || salons.length === 0) return;
    const card = container.children[0] as HTMLElement;
    const cardWidth = card.offsetWidth;
    const gap = 16;
    const step = cardWidth + gap;
    const currentIdx = Math.round(container.scrollLeft / step);
    const centerStart = salons.length * 2;
    const centerEnd = salons.length * 3 - 1;

    if (currentIdx >= centerEnd || currentIdx <= salons.length) {
      const equivalentIdx = centerStart + ((currentIdx % salons.length) + salons.length) % salons.length;
      isResettingRef.current = true;
      container.scrollLeft = equivalentIdx * step;
      setActiveIndex(equivalentIdx);
      requestAnimationFrame(() => {
        isResettingRef.current = false;
      });
    }
  }, [salons.length]);

  // Smooth scroll helper using requestAnimationFrame for buttery motion
  const smoothScrollTo = useCallback((container: HTMLElement, target: number, duration: number) => {
    const start = container.scrollLeft;
    const distance = target - start;
    const startTime = performance.now();

    const easeInOutCubic = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      container.scrollLeft = start + distance * easeInOutCubic(progress);
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  }, []);

  // Auto-loop with seamless reset
  const scrollToNext = useCallback(() => {
    const container = scrollRef.current;
    if (!container || !container.children.length) return;
    const card = container.children[0] as HTMLElement;
    const cardWidth = card.offsetWidth;
    const gap = 16;
    const nextPos = container.scrollLeft + cardWidth + gap;
    // Disable snap during programmatic scroll to prevent fighting
    container.style.scrollSnapType = 'none';
    smoothScrollTo(container, nextPos, 700);
    setTimeout(() => {
      container.style.scrollSnapType = '';
      resetToCenter();
    }, 750);
  }, [resetToCenter, smoothScrollTo]);

  useEffect(() => {
    if (salons.length === 0) return;

    autoplayRef.current = setInterval(() => {
      if (!userInteractingRef.current) {
        scrollToNext();
      }
    }, 3500);

    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [salons.length, scrollToNext]);

  // Pause on user interaction
  const handlePointerDown = useCallback(() => {
    userInteractingRef.current = true;
  }, []);

  const handlePointerUp = useCallback(() => {
    setTimeout(() => {
      userInteractingRef.current = false;
      resetToCenter();
    }, 2000);
  }, [resetToCenter]);
  // Track scroll to update active index
  const handleScroll = useCallback(() => {
    if (isResettingRef.current) return;
    const container = scrollRef.current;
    if (!container || !container.children.length) return;
    const card = container.children[0] as HTMLElement;
    const cardWidth = card.offsetWidth;
    const gap = 16;
    const idx = Math.round(container.scrollLeft / (cardWidth + gap));
    setActiveIndex(idx);
  }, []);

  const activeDot = salons.length > 0 ? ((activeIndex % salons.length) + salons.length) % salons.length : 0;

  return (
    <div className="flex flex-col gap-3">
      <div
        ref={scrollRef}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide px-[9%] md:px-[4%] lg:px-[6%] gap-4 md:gap-6"
        onScroll={handleScroll}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {INFINITE_DATA.map((salon, index) => {
          const isActive = index === activeIndex;
          const palette = GRADIENT_PALETTES[index % salons.length % GRADIENT_PALETTES.length];

          return (
            <div
              key={`${salon.id}-${index}`}
              className={`shrink-0 w-[82%] md:w-[46%] lg:w-[34%] max-w-[520px] snap-center rounded-[20px] min-h-[150px] md:min-h-[170px] transition-all duration-500 ease-out cursor-pointer relative overflow-hidden bg-gradient-to-r ${palette} ${
                isActive
                  ? 'scale-100 opacity-100 z-20 shadow-[0_15px_40px_rgb(0,0,0,0.2)]'
                  : 'md:scale-[0.95] scale-[0.88] md:opacity-80 opacity-60 z-10 shadow-[0_8px_20px_rgb(0,0,0,0.08)]'
              }`}
              onClick={() => navigate(`/salon/${salon.id}`)}
            >
              <div className="relative z-20 w-[58%] p-4 md:p-5 flex flex-col justify-between h-full min-h-[150px] md:min-h-[170px]">
                {salon.offer && (
                  <span className="self-start bg-accent text-accent-foreground text-[10px] md:text-[11px] font-heading font-semibold px-2.5 py-0.5 rounded-lg mb-2">
                    {salon.offer}
                  </span>
                )}
                <div className="flex-1 flex flex-col justify-center">
                  <h3 className="font-heading font-bold text-[16px] md:text-[18px] text-white leading-tight">
                    {salon.name}
                  </h3>
                  {salon.tagline && (
                    <p className="text-white/70 text-[11px] md:text-[12px] font-body mt-1 leading-snug">
                      {salon.tagline}
                    </p>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/salon/${salon.id}`);
                  }}
                  className="self-start mt-3 bg-white text-foreground text-[12px] md:text-[13px] font-heading font-semibold px-4 md:px-5 py-2 rounded-[10px] min-h-[32px] md:min-h-[36px] active:scale-95 transition-transform"
                >
                  Book Now
                </button>
              </div>

              <div className="absolute right-0 top-0 bottom-0 w-[55%] z-10">
                <img
                  src={salon.image}
                  alt={salon.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                  style={{
                    maskImage:
                      'linear-gradient(to right, transparent 0%, black 25%)',
                    WebkitMaskImage:
                      'linear-gradient(to right, transparent 0%, black 25%)',
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder.svg';
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination dots */}
      <div className="flex items-center justify-center gap-1.5">
        {salons.map((_, i) => (
          <span
            key={i}
            className={`rounded-full transition-all duration-300 ${
              i === activeDot
                ? 'w-5 h-1.5 bg-primary'
                : 'w-1.5 h-1.5 bg-muted-foreground/30'
            }`}
          />
        ))}
      </div>
    </div>
  );
});
FeaturedCarousel.displayName = 'FeaturedCarousel';

export default FeaturedCarousel;
