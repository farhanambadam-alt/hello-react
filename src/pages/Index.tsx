import { useState, useEffect } from 'react';
import { Star, RotateCcw, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FeaturedCarousel from '@/components/FeaturedCarousel';
import CategoryChips from '@/components/CategoryChips';
import NearbySalonCard from '@/components/NearbySalonCard';
import GlassGenderToggle from '@/components/GlassGenderToggle';
import MiracleSearchBar from '@/components/MiracleSearchBar';
import AppHeader from '@/components/AppHeader';
import ScrollToTop from '@/components/ScrollToTop';
import { categories, featuredSalons, nearbySalons, bookings } from '@/data/mockData';
import { useGender } from '@/contexts/GenderContext';

const HomePage = () => {
  const { gender } = useGender();
  const navigate = useNavigate();
  const [selectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const genderCategories = categories.filter((c) => c.gender === gender);
  const completedBookings = bookings.filter((b) => b.status === 'completed');

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  const SkeletonCard = () => (
    <div className="flex-shrink-0 w-52 bg-card rounded-2xl overflow-hidden card-shadow">
      <div className="h-32 skeleton-shimmer rounded-t-2xl" />
      <div className="p-3 space-y-2">
        <div className="h-4 w-3/4 skeleton-shimmer rounded-full" />
        <div className="h-3 w-1/2 skeleton-shimmer rounded-full" />
      </div>
    </div>
  );

  return (
    <div id="main-content" className="min-h-screen pb-safe">
      <AppHeader />

      {/* Gender Toggle + Heading */}
      <div className="px-5 pt-2 pb-3 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-serif text-[26px] text-foreground italic leading-tight tracking-tight">
            {gender === 'female' ? 'Beauty & Wellness' : 'Grooming & Style'}
          </h1>
        </div>
        <GlassGenderToggle />
      </div>

      {/* Search */}
      <div className="px-5 py-2 max-w-7xl mx-auto">
        <MiracleSearchBar asButton onClick={() => navigate('/explore?autofocus=1')} />
      </div>

      {/* Categories */}
      <div className="pt-3 max-w-7xl mx-auto">
        <CategoryChips
          categories={genderCategories}
          selected={selectedCategory}
          onSelect={(id) => {
            const cat = genderCategories.find(c => c.id === id);
            if (cat) {
              navigate(`/explore?category=${encodeURIComponent(cat.name.toLowerCase())}`);
            }
          }}
        />
      </div>

      {/* Featured */}
      <div className="pt-5 max-w-7xl mx-auto">
        <div className="flex items-center justify-between px-5 mb-3">
          <h2 className="font-heading font-semibold text-[16px] text-foreground">Featured Salons</h2>
          <button
            onClick={() => navigate('/explore?category=salon&sort=nearby')}
            className="text-[12px] font-heading font-medium text-primary flex items-center gap-0.5 min-h-[44px] px-2"
            aria-label="View all featured salons"
          >
            View All <ArrowRight size={12} />
          </button>
        </div>
        {isLoading ? (
          <div className="mx-5 aspect-[16/10] skeleton-shimmer rounded-2xl" />
        ) : (
          <FeaturedCarousel salons={featuredSalons} />
        )}
      </div>

      {/* Nearby */}
      <div className="pt-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between px-5 mb-3">
          <h2 className="font-heading font-semibold text-[16px] text-foreground">Nearby</h2>
          <button
            onClick={() => navigate('/explore?category=salon&sort=nearby')}
            className="text-[12px] font-heading font-medium text-primary flex items-center gap-0.5 min-h-[44px] px-2"
            aria-label="View all nearby salons"
          >
            View All <ArrowRight size={12} />
          </button>
        </div>
        <div
          className="flex gap-3 overflow-x-auto px-5 pb-4 scrollbar-hide md:grid md:grid-cols-3 lg:grid-cols-4 md:overflow-x-visible"
          style={{ contain: 'layout style' }}
        >
          {isLoading ? (
            <><SkeletonCard /><SkeletonCard /></>
          ) : (
            nearbySalons.map((salon) => <NearbySalonCard key={salon.id} salon={salon} />)
          )}
        </div>
      </div>

      {/* Suggested */}
      <div className="pt-1 pb-2 max-w-7xl mx-auto">
        <div className="flex items-center justify-between px-5 mb-3">
          <h2 className="font-heading font-semibold text-[16px] text-foreground">Suggested for You</h2>
        </div>
        <div className="px-5 space-y-3 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-3 md:space-y-0">
          {!isLoading &&
            [...featuredSalons, ...nearbySalons].slice(0, 3).map((salon) => (
              <div
                key={salon.id}
                onClick={() => navigate(`/salon/${salon.id}`)}
                className="flex items-center gap-3.5 bg-card rounded-[20px] p-3 card-shadow cursor-pointer active:scale-[0.98] transition-transform"
                style={{ border: '1px solid hsl(var(--border) / 0.4)' }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && navigate(`/salon/${salon.id}`)}
              >
                <img
                  src={salon.image}
                  alt={salon.name}
                  className="w-[68px] h-[68px] rounded-2xl object-cover flex-shrink-0"
                  decoding="async"
                  width={68}
                  height={68}
                  onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }}
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading font-semibold text-[14px] text-foreground truncate">{salon.name}</h3>
                  <p className="text-[12px] font-body text-muted-foreground mt-0.5 truncate">{salon.address} · {salon.distance}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Star size={11} className="text-accent fill-accent" />
                    <span className="text-[12px] text-foreground font-medium">{salon.rating}</span>
                    <span className="text-[11px] text-muted-foreground">· From ₹{salon.startingPrice}</span>
                  </div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); navigate(`/salon/${salon.id}`); }}
                  className="text-[12px] font-heading font-semibold bg-primary text-primary-foreground px-4 py-2 rounded-[10px] flex-shrink-0 min-h-[32px] active:scale-95 transition-transform"
                >
                  Book
                </button>
              </div>
            ))}
        </div>
      </div>

      {/* Book Again */}
      {completedBookings.length > 0 && (
        <div className="pt-5 pb-3 max-w-7xl mx-auto">
          <div className="flex items-center gap-2 px-5 mb-3">
            <RotateCcw size={15} className="text-primary" />
            <h2 className="font-heading font-semibold text-[16px] text-foreground">Book Again</h2>
          </div>
          <div className="flex gap-3 overflow-x-auto px-5 pb-3 scrollbar-hide" style={{ contain: 'layout style' }}>
            {completedBookings.map((booking) => (
              <div
                key={booking.id}
                onClick={() => navigate(`/salon/1`)}
                className="flex-shrink-0 w-60 bg-card rounded-[20px] p-3.5 card-shadow cursor-pointer active:scale-[0.97] transition-transform"
                style={{ border: '1px solid hsl(var(--border) / 0.4)' }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && navigate(`/salon/1`)}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={booking.salonImage}
                    alt={booking.salonName}
                    className="w-14 h-14 rounded-2xl object-cover flex-shrink-0"
                    decoding="async"
                    loading="lazy"
                    width={56}
                    height={56}
                    onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }}
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-heading font-semibold text-[13px] text-foreground truncate">{booking.salonName}</h4>
                    <p className="text-[11px] font-body text-muted-foreground truncate">{booking.services.join(', ')}</p>
                  </div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); navigate(`/salon/1`); }}
                  className="w-full mt-3 text-[12px] font-heading font-semibold text-primary bg-primary/12 py-2.5 rounded-[10px] active:scale-95 transition-transform border border-primary/20 min-h-[32px]"
                >
                  Rebook
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <ScrollToTop />
    </div>
  );
};

export default HomePage;
