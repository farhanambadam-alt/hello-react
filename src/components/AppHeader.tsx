import { useState, useEffect, useCallback, type ReactNode } from 'react';
import { Bell, MapPin, ChevronDown } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGender } from '@/contexts/GenderContext';
import NotificationDrawer from '@/components/NotificationDrawer';
import LocationPickerDrawer from '@/components/LocationPickerDrawer';

interface AppHeaderProps {
  /** Optional left slot (e.g. back button). If omitted, shows profile avatar + greeting. */
  leftSlot?: ReactNode;
  /** Optional right slot override. If omitted, shows location + bell. */
  rightSlot?: ReactNode;
  /** Show location picker button (default true) */
  showLocation?: boolean;
  /** Show notification bell (default true) */
  showNotification?: boolean;
}

const AppHeader = ({
  leftSlot,
  rightSlot,
  showLocation = true,
  showNotification = true,
}: AppHeaderProps) => {
  const { gender } = useGender();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);

  const handleScroll = useCallback(() => {
    const el = document.getElementById('scroll-container');
    setScrolled((el?.scrollTop ?? window.scrollY) > 10);
  }, []);

  useEffect(() => {
    const el = document.getElementById('scroll-container');
    const target = el || window;
    target.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => target.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const isHome = location.pathname === '/';

  const transparentBg = 'transparent';
  const solidBg = 'hsl(var(--background) / 0.45)';

  const defaultLeft = (
    <button
      onClick={() => navigate('/profile')}
      className="flex items-center gap-3 min-h-[48px] active:opacity-70"
      style={{ transition: 'opacity 0.15s ease' }}
      aria-label="Go to profile"
    >
      <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-primary/20 shadow-sm">
        <img
          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop"
          alt="Profile"
          className="w-full h-full object-cover"
          decoding="async"
          width={40}
          height={40}
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder.svg';
          }}
        />
      </div>
      <div className="text-left">
        <p className="text-[10px] text-muted-foreground font-body leading-none tracking-widest uppercase">
          Welcome back
        </p>
        <p className="font-heading font-bold text-[15px] text-foreground mt-0.5 tracking-tight">
          Aarav
        </p>
      </div>
    </button>
  );

  const defaultRight = (
    <div className="flex items-center gap-1.5">
      {showLocation && (
        <button
          onClick={() => setLocationOpen(true)}
          className="flex items-center gap-1.5 border px-3 rounded-xl min-h-[48px] shadow-sm active:scale-[0.96] bg-card/60 border-border/40"
          style={{ transition: 'transform 0.15s ease, background 0.3s ease' }}
          aria-label="Select location"
        >
          <MapPin size={14} className="text-accent" />
          <span className="text-[13px] font-body font-semibold text-foreground">Bangalore</span>
          <ChevronDown size={11} className="text-muted-foreground/70" />
        </button>
      )}
      {showNotification && (
        <button
          onClick={() => setNotifOpen(true)}
          className="relative border rounded-xl min-h-[48px] min-w-[48px] flex items-center justify-center shadow-sm active:scale-[0.96] bg-card/60 border-border/40"
          style={{ transition: 'transform 0.15s ease, background 0.3s ease' }}
          aria-label="Notifications"
        >
          <Bell size={18} className="text-foreground" />
          <span className="absolute top-3 right-3 w-[6px] h-[6px] bg-accent rounded-full ring-[2px] ring-background" />
        </button>
      )}
    </div>
  );

  return (
    <>
      <header
        className="sticky top-0 left-0 right-0 z-40"
        style={{
          paddingTop: 'calc(var(--inset-top) + 6px)',
          paddingLeft: 'var(--inset-left)',
          paddingRight: 'var(--inset-right)',
          background: scrolled ? solidBg : transparentBg,
          borderBottom: scrolled
            ? '1px solid hsl(var(--border) / 0.5)'
            : '1px solid transparent',
          WebkitBackdropFilter: scrolled ? 'saturate(180%) blur(18px)' : 'none',
          backdropFilter: scrolled ? 'saturate(180%) blur(18px)' : 'none',
          boxShadow: scrolled
            ? '0 1px 10px -3px hsl(var(--foreground) / 0.07)'
            : 'none',
          transform: 'translateZ(0)',
          transition:
            'background 0.35s ease, border-bottom 0.3s ease, box-shadow 0.3s ease, backdrop-filter 0.3s ease',
        }}
      >
        <div className="max-w-7xl mx-auto px-5 md:px-8 pb-2.5 pt-1">
          <div className="flex items-center justify-between">
            {leftSlot ?? defaultLeft}
            {rightSlot ?? defaultRight}
          </div>
        </div>
      </header>

      {/* Drawers */}
      <NotificationDrawer open={notifOpen} onClose={() => setNotifOpen(false)} />
      <LocationPickerDrawer
        open={locationOpen}
        onClose={() => setLocationOpen(false)}
      />
    </>
  );
};

export default AppHeader;
