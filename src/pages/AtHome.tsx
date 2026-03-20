import { MapPin, Bell, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import GlassGenderToggle from '@/components/GlassGenderToggle';
import MiracleSearchBar from '@/components/MiracleSearchBar';
import AppHeader from '@/components/AppHeader';
import ScrollToTop from '@/components/ScrollToTop';

const AtHome = () => {
  const navigate = useNavigate();
  const hasArtists = false;

  const headerLeft = (
    <div className="flex items-center gap-3">
      <button
        onClick={() => window.appBack?.()}
        className="min-w-[48px] min-h-[48px] rounded-full bg-secondary flex items-center justify-center"
        aria-label="Go back"
      >
        <ArrowLeft size={18} className="text-foreground" />
      </button>
      <div>
        <h1 className="font-heading text-foreground font-extrabold text-left text-[22px] tracking-tight">
          𝑨𝒕 𝑯𝒐𝒎𝒆
        </h1>
        <div className="flex items-center gap-1.5 mt-1">
          <MapPin size={12} className="text-primary" />
          <span className="text-[12px] font-body text-muted-foreground">Koramangala, Bangalore</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen relative pb-safe">
      <AppHeader leftSlot={headerLeft} showLocation={false} />

      {/* Search Bar */}
      <div className="px-5 mt-4 max-w-7xl mx-auto">
        <MiracleSearchBar placeholder="Search for artists or services" />
      </div>

      {/* Gender Toggle */}
      <div className="flex justify-center mt-5 mb-2 max-w-7xl mx-auto">
        <GlassGenderToggle />
      </div>

      {/* Description */}
      <p className="text-center text-[12px] font-body text-muted-foreground px-10 mt-1 mb-5 leading-relaxed max-w-7xl mx-auto">
        Explore beauty professionals offering home services in your area
      </p>

      <div className="mx-5 border-t border-border/60 mb-5 max-w-7xl md:mx-auto" />

      {/* Content */}
      {hasArtists ? null : (
        <div className="px-5 pt-16 flex flex-col items-center text-center max-w-7xl mx-auto">
          <div className="w-32 h-32 rounded-full bg-secondary/60 flex items-center justify-center mb-6">
            <MapPin size={48} className="text-muted-foreground/40" />
          </div>
          <h2 className="font-heading font-bold text-[18px] text-foreground mb-2">
            No Artists in Your Area Yet
          </h2>
          <p className="text-[14px] font-body text-muted-foreground max-w-[280px] leading-relaxed">
            We're expanding fast! Get notified as soon as artists become available near you.
          </p>
          <button className="mt-6 bg-primary text-primary-foreground font-heading font-semibold text-[14px] px-8 py-3.5 rounded-2xl active:scale-95 transition-transform min-h-[48px] flex items-center gap-2">
            <Bell size={16} />
            Notify Me When Available
          </button>
        </div>
      )}

      <ScrollToTop />
    </div>
  );
};

export default AtHome;
