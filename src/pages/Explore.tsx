import { useState, useEffect, useRef } from 'react';
import { Search, SlidersHorizontal, Star, MapPin, ArrowLeft } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { featuredSalons, nearbySalons, categories } from '@/data/mockData';
import { useGender } from '@/contexts/GenderContext';
import AppHeader from '@/components/AppHeader';
import MiracleSearchBar from '@/components/MiracleSearchBar';
import ScrollToTop from '@/components/ScrollToTop';

const allSalons = [...featuredSalons, ...nearbySalons];

const ExplorePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { gender } = useGender();
  const [searchQuery, setSearchQuery] = useState('');
  const searchAutoFocusRef = useRef<boolean>(searchParams.get('autofocus') === '1');
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'default' | 'rating' | 'price_low' | 'price_high' | 'distance'>('default');
  const [filterOpenNow, setFilterOpenNow] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const categoryParam = searchParams.get('category');
  const sortParam = searchParams.get('sort');

  const genderCategories = categories.filter(c => c.gender === gender);

  const matchedCategory = categoryParam
    ? genderCategories.find(c => c.name.toLowerCase() === categoryParam.toLowerCase())?.id ?? null
    : null;

  const [selectedCategory, setSelectedCategory] = useState<string | null>(matchedCategory);

  useEffect(() => {
    setSelectedCategory(matchedCategory);
  }, [categoryParam, gender]);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  let filteredSalons = allSalons.filter(salon => {
    if (filterOpenNow && !salon.isOpen) return false;
    if (searchQuery) {
      return salon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
             salon.address.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  if (sortParam === 'nearby' || sortBy === 'distance') {
    filteredSalons = [...filteredSalons].sort((a, b) => {
      const distA = parseFloat(a.distance) || 999;
      const distB = parseFloat(b.distance) || 999;
      return distA - distB;
    });
  } else if (sortBy === 'rating') {
    filteredSalons = [...filteredSalons].sort((a, b) => b.rating - a.rating);
  } else if (sortBy === 'price_low') {
    filteredSalons = [...filteredSalons].sort((a, b) => a.startingPrice - b.startingPrice);
  } else if (sortBy === 'price_high') {
    filteredSalons = [...filteredSalons].sort((a, b) => b.startingPrice - a.startingPrice);
  }

  const headerLeft = (
    <div className="flex items-center gap-3">
      <button
        onClick={() => window.appBack?.()}
        className="min-w-[48px] min-h-[48px] rounded-full bg-secondary flex items-center justify-center"
        aria-label="Go back"
      >
        <ArrowLeft size={18} className="text-foreground" />
      </button>
      <h1 className="font-heading font-bold text-[18px] text-foreground">Explore</h1>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen pb-safe animate-pulse">
        <AppHeader leftSlot={headerLeft} showLocation={false} />
        <div className="max-w-7xl mx-auto px-5 pb-3">
          <div className="h-14 bg-muted rounded-2xl" />
        </div>
        <div className="flex gap-5 px-5 py-3 max-w-7xl mx-auto">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex flex-col items-center gap-2 flex-shrink-0">
              <div className="w-[62px] h-[62px] bg-muted rounded-full" />
              <div className="h-3 w-10 bg-muted rounded-full" />
            </div>
          ))}
        </div>
        <div className="px-5 space-y-3 max-w-7xl mx-auto">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card rounded-2xl overflow-hidden border border-border">
              <div className="h-[180px] bg-muted" />
              <div className="p-4 space-y-2.5">
                <div className="h-4 w-2/3 bg-muted rounded-full" />
                <div className="h-3 w-1/2 bg-muted rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-safe">
      <AppHeader leftSlot={headerLeft} showLocation={false} />

      {/* Search bar */}
      <div className="max-w-7xl mx-auto px-5 pb-3">
        <MiracleSearchBar
          onSearch={(val) => setSearchQuery(val)}
          placeholder="Search salons, services..."
          autoFocus={searchAutoFocusRef.current}
        />
      </div>

      {/* Category chips */}
      <div className="flex gap-5 overflow-x-auto px-5 py-3 scrollbar-hide max-w-7xl mx-auto" style={{ contain: 'layout style' }}>
        <button
          onClick={() => setSelectedCategory(null)}
          className="flex flex-col items-center gap-2 flex-shrink-0"
          aria-pressed={!selectedCategory}
        >
          <div
            className={`w-[62px] h-[62px] rounded-full overflow-hidden flex items-center justify-center bg-secondary ${
              !selectedCategory
                ? 'ring-2 ring-primary ring-offset-2 ring-offset-background scale-105'
                : 'ring-1 ring-border'
            }`}
            style={{ transition: 'transform 0.2s ease, box-shadow 0.2s ease' }}
          >
            <span className="font-heading font-bold text-[13px]">ALL</span>
          </div>
          <span className={`text-[11px] font-heading font-medium whitespace-nowrap ${
            !selectedCategory ? 'text-primary' : 'text-muted-foreground'
          }`} style={{ transition: 'color 0.2s ease' }}>
            All
          </span>
        </button>
        {genderCategories.map(cat => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(isActive ? null : cat.id)}
              className="flex flex-col items-center gap-2 flex-shrink-0"
              aria-pressed={isActive}
            >
              <div
                className={`w-[62px] h-[62px] rounded-full overflow-hidden ${
                  isActive
                    ? 'ring-2 ring-primary ring-offset-2 ring-offset-background scale-105'
                    : 'ring-1 ring-border'
                }`}
                style={{ transition: 'transform 0.2s ease, box-shadow 0.2s ease' }}
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                  width={62}
                  height={62}
                  onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }}
                />
              </div>
              <span className={`text-[11px] font-heading font-medium whitespace-nowrap ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`} style={{ transition: 'color 0.2s ease' }}>
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Salon Cards — responsive grid */}
      <div className="px-5 space-y-3 pb-4 max-w-7xl mx-auto md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:space-y-0">
        {filteredSalons.map(salon => (
          <div
            key={salon.id}
            onClick={() => navigate(`/salon/${salon.id}`)}
            className="bg-card rounded-[20px] overflow-hidden card-shadow active:scale-[0.97] transition-transform cursor-pointer"
            style={{ border: '1px solid hsl(var(--border) / 0.4)' }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && navigate(`/salon/${salon.id}`)}
          >
            <div className="relative aspect-[16/10]">
              <img
                src={salon.image}
                alt={salon.name}
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
                onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }}
              />
              <span className={`absolute top-3 right-3 text-[11px] font-heading font-semibold px-2.5 py-1 rounded-lg backdrop-blur-sm ${
                salon.isOpen ? 'bg-success/90 text-success-foreground' : 'bg-destructive/90 text-destructive-foreground'
              }`}>
                {salon.isOpen ? 'Open' : 'Closed'}
              </span>
              {salon.offer && (
                <span className="absolute top-3 left-3 bg-accent text-accent-foreground text-[11px] font-heading font-semibold px-3 py-1 rounded-lg">
                  {salon.offer}
                </span>
              )}
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between">
                <h3 className="font-heading font-semibold text-[15px] text-foreground leading-tight">{salon.name}</h3>
                <div className="flex items-center gap-1 bg-secondary px-2.5 py-1 rounded-lg flex-shrink-0 ml-2 border border-border">
                  <Star size={11} className="text-accent fill-accent" />
                  <span className="text-[12px] font-heading font-semibold text-foreground">{salon.rating}</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 mt-2">
                <MapPin size={12} className="text-muted-foreground flex-shrink-0" />
                <span className="text-[13px] font-body text-muted-foreground">{salon.address}</span>
                <span className="text-muted-foreground text-[13px]">·</span>
                <span className="text-[13px] font-body text-muted-foreground">{salon.distance}</span>
              </div>
              <div className="flex items-center justify-between mt-3.5">
                <span className="text-[13px] text-muted-foreground font-body">From <span className="font-heading font-semibold text-foreground">₹{salon.startingPrice}</span></span>
                <button
                  onClick={(e) => { e.stopPropagation(); navigate(`/salon/${salon.id}`); }}
                  className="text-[12px] font-heading font-semibold bg-primary text-primary-foreground px-5 py-2.5 rounded-[10px] min-h-[32px] active:scale-95 transition-transform"
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        ))}
        {filteredSalons.length === 0 && (
          <div className="text-center py-16 col-span-full">
            <Search size={36} className="mx-auto text-muted-foreground/30 mb-3" />
            <p className="font-heading font-medium text-[14px] text-muted-foreground">No salons found</p>
            <p className="text-[12px] font-body text-muted-foreground mt-1">Try a different search term</p>
          </div>
        )}
      </div>

      {/* Filter Drawer */}
      <Drawer open={filterOpen} onOpenChange={setFilterOpen}>
        <DrawerContent className="max-h-[70vh]">
          <DrawerHeader className="text-center pb-2">
            <DrawerTitle className="font-heading text-lg">Sort & Filter</DrawerTitle>
          </DrawerHeader>
          <div className="px-5 pb-6 space-y-5">
            <div>
              <h4 className="font-heading font-semibold text-sm text-foreground mb-2.5">Sort By</h4>
              <div className="flex flex-wrap gap-2">
                {([
                  { key: 'default', label: 'Default' },
                  { key: 'rating', label: 'Rating' },
                  { key: 'price_low', label: 'Price: Low' },
                  { key: 'price_high', label: 'Price: High' },
                  { key: 'distance', label: 'Nearest' },
                ] as const).map(opt => (
                  <button
                    key={opt.key}
                    onClick={() => setSortBy(opt.key)}
                    className={`px-4 py-2 rounded-xl text-[12px] font-heading font-semibold transition-colors min-h-[44px] ${
                      sortBy === opt.key ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground border border-border'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-heading font-semibold text-sm text-foreground mb-2.5">Filters</h4>
              <button
                onClick={() => setFilterOpenNow(!filterOpenNow)}
                className={`px-4 py-2 rounded-xl text-[12px] font-heading font-semibold transition-colors min-h-[44px] ${
                  filterOpenNow ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground border border-border'
                }`}
              >
                Open Now
              </button>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => { setSortBy('default'); setFilterOpenNow(false); }}
                className="flex-1 py-3 rounded-2xl font-heading font-medium text-sm border border-border text-foreground min-h-[48px]"
              >
                Reset
              </button>
              <button
                onClick={() => setFilterOpen(false)}
                className="flex-1 py-3 rounded-2xl font-heading font-semibold text-sm bg-primary text-primary-foreground min-h-[48px]"
              >
                Apply
              </button>
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      <ScrollToTop />
    </div>
  );
};

export default ExplorePage;
