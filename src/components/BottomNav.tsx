import { Search, CalendarDays, User } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import atSalonIcon from '@/assets/at-salon.svg';
import atHomeIcon from '@/assets/at-home.svg';

type TabItem = {
  icon?: typeof Search;
  svgSrc?: string;
  label: string;
  path: string;
};

const tabs: TabItem[] = [
  { svgSrc: atSalonIcon, label: 'At Salon', path: '/' },
  { svgSrc: atHomeIcon, label: 'At Home', path: '/at-home' },
  { icon: Search, label: 'Explore', path: '/explore' },
  { icon: CalendarDays, label: 'Bookings', path: '/bookings' },
  { icon: User, label: 'Profile', path: '/profile' },
];

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const [spotlightX, setSpotlightX] = useState(0);
  const [spotlightW, setSpotlightW] = useState(0);
  const activeIndex = tabs.findIndex((t) => t.path === location.pathname);

  const updateSpotlight = useCallback(() => {
    const btn = buttonsRef.current[activeIndex];
    if (!btn) return;
    const nav = btn.parentElement!;
    const navRect = nav.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    setSpotlightX(btnRect.left - navRect.left + btnRect.width / 2);
    setSpotlightW(btnRect.width);
  }, [activeIndex]);

  useEffect(() => {
    updateSpotlight();
    window.addEventListener('resize', updateSpotlight);
    return () => window.removeEventListener('resize', updateSpotlight);
  }, [updateSpotlight]);

  const hidden = useMemo(() => {
    const p = location.pathname;
    return p.startsWith('/salon/') || p.startsWith('/booking/') || p.startsWith('/artist/') || p.startsWith('/at-home-booking/');
  }, [location.pathname]);

  if (hidden) return null;

  return (
    <nav
      className="absolute bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none md:bottom-4"
      style={{
        paddingBottom: 'var(--inset-bottom)',
      }}
    >
      <div
        className="pointer-events-auto relative flex items-center w-[calc(100%-24px)] max-w-sm md:max-w-md md:w-auto rounded-[36px] p-2.5 md:rounded-[36px] justify-around md:justify-center overflow-hidden backdrop-blur-2xl backdrop-saturate-150"
        style={{
          background: 'linear-gradient(180deg, rgba(62,66,76,0.68) 0%, rgba(48,52,60,0.70) 100%)',
          border: '1.5px solid rgba(255, 255, 255, 0.10)',
          boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.08), inset 0 -1px 2px 0 rgba(0,0,0,0.20), 0 0 0 0.5px rgba(0,0,0,0.30), 0 14px 36px -6px rgba(0,0,0,0.50), 0 4px 12px -2px rgba(0,0,0,0.25)',
          transform: 'translateZ(0)',
        }}
      >
        {/* Sliding spotlight indicator — GPU-composited via transform */}
        {activeIndex >= 0 && (
          <div
            className="absolute pointer-events-none z-0 flex flex-col items-center"
            style={{
              left: 0,
              width: spotlightW * 1.2,
              transform: `translateX(${spotlightX - (spotlightW * 1.2) / 2}px)`,
              top: 0,
              bottom: 0,
              transition: 'transform 0.4s cubic-bezier(0.42, 0, 0.58, 1)',
              willChange: 'transform',
            }}
            aria-hidden="true"
          >
            {/* Light source capsule */}
            <span
              className="shrink-0 rounded-full"
              style={{
              width: '30px',
                height: '5px',
                background: 'hsl(35, 92%, 58%)',
                boxShadow: '0 0 18px 6px hsla(35, 92%, 58%, 0.6), 0 0 40px 12px hsla(35, 90%, 55%, 0.25)',
              }}
            />
            {/* Trapezoid beam */}
            <span
              className="flex-1 w-full"
              style={{
                clipPath: 'polygon(25% 0%, 75% 0%, 110% 100%, -10% 100%)',
                background:
                  'linear-gradient(to bottom, hsla(35, 92%, 58%, 0.40) 0%, hsla(35, 88%, 52%, 0.18) 25%, hsla(35, 80%, 50%, 0.06) 55%, transparent 100%)',
              }}
            />
          </div>
        )}

        {tabs.map((tab, i) => {
          const isActive = i === activeIndex;
          return (
            <button
              key={tab.path}
              ref={(el) => { buttonsRef.current[i] = el; }}
              onClick={() => navigate(tab.path, { replace: true })}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
              className="relative z-10 flex flex-col items-center justify-center min-w-[48px] min-h-[48px] md:min-w-[56px] md:min-h-[52px] px-1 md:px-2"
              style={{
                WebkitTapHighlightColor: 'transparent',
                transition: 'transform 0.15s ease',
              }}
            >
              <span
                className="relative z-10 flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded-full"
                style={{
                  animation: isActive ? 'icon-bump 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards' : 'none',
                  transform: isActive ? 'scale(1.12)' : 'scale(1)',
                }}
              >
                {tab.svgSrc ? (
                  <img
                    src={tab.svgSrc}
                    alt=""
                    width={32}
                    height={32}
                    className="w-[32px] h-[32px] md:w-8 md:h-8"
                    decoding="async"
                    style={{
                      filter: isActive
                        ? 'brightness(0)'
                        : 'opacity(0.35)',
                    }}
                  />
                ) : (
                  tab.icon && (
                    <tab.icon
                      size={28}
                      strokeWidth={isActive ? 2.2 : 1.6}
                      className="md:!w-7 md:!h-7"
                      style={{
                        color: isActive ? 'rgb(20, 20, 20)' : 'rgba(255,255,255,0.5)',
                      }}
                    />
                  )
                )}
              </span>
              <span
                className="text-[11px] md:text-[11px] leading-tight mt-0.5 truncate max-w-[60px]"
                style={{
                  color: isActive ? 'rgb(20, 20, 20)' : 'rgba(255,255,255,0.5)',
                  fontWeight: isActive ? 600 : 500,
                }}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
