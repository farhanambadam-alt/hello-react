import { useState, useMemo } from 'react';
import { ArrowLeft, Star, Clock, Shield, CheckCircle2, Play, Plus, Minus, MapPin, Share2, Heart, AlertCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { atHomeArtists, atHomeReviews } from '@/data/atHomeData';
import type { AtHomeService } from '@/types/atHome';
import ServiceDrawer from '@/components/ServiceDrawer';
import PageFloatingFooter from '@/components/PageFloatingFooter';

const ArtistProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const artist = atHomeArtists.find(a => a.id === id) || atHomeArtists[0];
  const reviews = atHomeReviews[artist.id] || [];

  const [activeTab, setActiveTab] = useState<'services' | 'reviews' | 'portfolio'>('services');
  const [serviceFilter, setServiceFilter] = useState<string | null>(null);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [isFavorite, setIsFavorite] = useState(false);
  const [sliderPositions, setSliderPositions] = useState<Record<string, number>>({});
  const [showVideo, setShowVideo] = useState(false);
  const [drawerService, setDrawerService] = useState<AtHomeService | null>(null);

  const categories = useMemo(() => {
    return [...new Set(artist.services.map(s => s.category))];
  }, [artist]);

  const filteredServices = serviceFilter
    ? artist.services.filter(s => s.category === serviceFilter)
    : artist.services;

  const cartTotal = Object.entries(cart).reduce((total, [sId, qty]) => {
    const svc = artist.services.find(s => s.id === sId);
    return total + (svc?.price || 0) * qty;
  }, 0);
  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const shortfall = artist.minimumBooking - cartTotal;

  const addToCart = (serviceId: string) => {
    setCart(c => ({ ...c, [serviceId]: (c[serviceId] || 0) + 1 }));
  };
  const removeFromCart = (serviceId: string) => {
    setCart(c => {
      const n = { ...c };
      if (n[serviceId] > 1) n[serviceId]--;
      else delete n[serviceId];
      return n;
    });
  };

  const handleSliderMove = (photoId: string, e: React.TouchEvent | React.MouseEvent) => {
    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const percent = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    setSliderPositions(prev => ({ ...prev, [photoId]: percent }));
  };

  const ratingDist = [5, 4, 3, 2, 1].map(r => ({
    rating: r,
    count: reviews.filter(rev => rev.rating === r).length,
    percent: reviews.length > 0 ? (reviews.filter(rev => rev.rating === r).length / reviews.length) * 100 : 0,
  }));

  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  // Demo YouTube video
  const videoId = 'dQw4w9WgXcQ';

  return (
    <div
      className="min-h-screen relative pb-28 overflow-hidden"
      style={
        cartCount > 0
          ? {
              paddingBottom:
                shortfall > 0
                  ? 'calc(176px + var(--inset-bottom))'
                  : 'calc(140px + var(--inset-bottom))',
            }
          : undefined
      }
    >
      {/* Background handled by global GenderBackground */}

      {/* Video Hero */}
      <div className="relative h-[260px]">
        {showVideo ? (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
            className="w-full h-full"
            allow="autoplay; encrypted-media"
            allowFullScreen
            title={artist.name}
          />
        ) : (
          <>
            <img src={artist.videoThumbnail} alt={artist.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 via-transparent to-foreground/20" />
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={() => setShowVideo(true)}
                className="w-14 h-14 rounded-full bg-card/90 backdrop-blur-md flex items-center justify-center shadow-lg active:scale-90 transition-transform"
              >
                <Play size={22} className="text-foreground ml-0.5" />
              </button>
            </div>
          </>
        )}
        {/* Top nav */}
        <div className="absolute top-0 left-0 right-0 px-4 flex justify-between" style={{ paddingTop: 'calc(var(--inset-top) + 12px)' }}>
          <button
            onClick={() => window.appBack?.()}
            className="w-10 h-10 rounded-full bg-card/80 backdrop-blur-md flex items-center justify-center border border-border/30 min-h-[44px] min-w-[44px]"
          >
            <ArrowLeft size={18} className="text-foreground" />
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="w-10 h-10 rounded-full bg-card/80 backdrop-blur-md flex items-center justify-center border border-border/30 min-h-[44px] min-w-[44px]"
            >
              <Heart size={16} className={isFavorite ? 'text-destructive fill-destructive' : 'text-foreground'} />
            </button>
            <button className="w-10 h-10 rounded-full bg-card/80 backdrop-blur-md flex items-center justify-center border border-border/30 min-h-[44px] min-w-[44px]">
              <Share2 size={16} className="text-foreground" />
            </button>
          </div>
        </div>
        {/* Video badge */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-destructive/90 backdrop-blur-sm text-destructive-foreground text-[10px] font-heading font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-destructive-foreground animate-pulse" />
          VIDEO
        </div>
      </div>

      {/* Artist Info Card */}
      <div className="px-5 -mt-6 relative z-10">
        <div className="bg-card/95 backdrop-blur-sm rounded-2xl border border-border card-shadow p-4">
          <div className="flex items-center gap-3.5">
            <div className="w-[56px] h-[56px] rounded-full overflow-hidden flex-shrink-0 ring-2 ring-border">
              <img src={artist.avatar} alt={artist.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="font-heading font-bold text-[17px] text-foreground">{artist.name}</h1>
                <CheckCircle2 size={16} className="text-success flex-shrink-0" />
              </div>
              <p className="text-[12px] font-body text-muted-foreground">{artist.specialty}</p>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
            <div className="flex items-center gap-1.5 flex-1 justify-center">
              <Star size={14} className="text-accent fill-accent" />
              <span className="font-heading font-bold text-[14px] text-foreground">{artist.rating}</span>
              <span className="text-[11px] text-muted-foreground">Stars</span>
            </div>
            <div className="w-px h-6 bg-border" />
            <div className="flex-1 text-center">
              <span className="font-heading font-bold text-[14px] text-foreground">{artist.reviewCount}</span>
              <span className="text-[11px] text-muted-foreground ml-1">Reviews</span>
            </div>
            <div className="w-px h-6 bg-border" />
            <div className="flex items-center gap-1 flex-1 justify-center">
              <Clock size={12} className="text-success" />
              <span className="font-heading font-bold text-[14px] text-foreground">{artist.onTimePercent}%</span>
              <span className="text-[11px] text-muted-foreground">On-Time</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Nav */}
      <div className="flex gap-1 px-5 pt-4 pb-2">
        {(['services', 'reviews', 'portfolio'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2.5 text-[12px] font-heading font-semibold capitalize rounded-xl transition-all duration-200 min-h-[40px] ${
              activeTab === tab ? 'bg-primary text-primary-foreground' : 'bg-card/80 backdrop-blur-sm text-muted-foreground border border-border'
            }`}
          >
            {tab === 'portfolio' ? 'Before & After' : tab}
          </button>
        ))}
      </div>

      {/* Services Tab */}
      {activeTab === 'services' && (
        <div className="animate-fade-in-up" style={{ animationDuration: '250ms' }}>
          <div className="px-5 pt-2 pb-2">
            <h2 className="font-heading font-semibold text-[15px] text-foreground mb-3">Services & Packages</h2>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
              <button
                onClick={() => setServiceFilter(null)}
                className={`px-3.5 py-1.5 rounded-xl text-[11px] font-heading font-semibold whitespace-nowrap transition-all min-h-[32px] ${
                  !serviceFilter ? 'bg-primary text-primary-foreground' : 'bg-card/80 text-muted-foreground border border-border'
                }`}
              >
                All
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setServiceFilter(cat === serviceFilter ? null : cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-[11px] font-heading font-semibold capitalize whitespace-nowrap transition-all min-h-[32px] ${
                    serviceFilter === cat ? 'bg-primary text-primary-foreground' : 'bg-card/80 text-muted-foreground border border-border'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="px-4 space-y-2.5">
            {filteredServices.map((service, i) => (
              <ServiceCard
                key={service.id}
                service={service}
                qty={cart[service.id] || 0}
                onAdd={() => addToCart(service.id)}
                onRemove={() => removeFromCart(service.id)}
                onTap={() => setDrawerService(service)}
                index={i}
              />
            ))}
          </div>
        </div>
      )}

      {/* Reviews Tab */}
      {activeTab === 'reviews' && (
        <div className="animate-fade-in-up px-5 pt-2" style={{ animationDuration: '250ms' }}>
          <div className="bg-card/95 backdrop-blur-sm rounded-2xl border border-border card-shadow p-4 mb-4">
            <div className="flex items-center gap-5">
              <div className="text-center">
                <span className="font-heading font-bold text-[36px] text-foreground leading-none">{avgRating}</span>
                <div className="flex items-center gap-0.5 mt-1 justify-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={12} className={i < Math.round(Number(avgRating)) ? 'text-accent fill-accent' : 'text-border fill-border'} />
                  ))}
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">{reviews.length} reviews</p>
              </div>
              <div className="flex-1 space-y-1.5">
                {ratingDist.map(d => (
                  <div key={d.rating} className="flex items-center gap-2">
                    <span className="text-[11px] font-heading text-muted-foreground w-3">{d.rating}</span>
                    <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-accent rounded-full transition-all duration-500" style={{ width: `${d.percent}%` }} />
                    </div>
                    <span className="text-[10px] text-muted-foreground w-4 text-right">{d.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {reviews.map((review, i) => (
              <div
                key={review.id}
                className="bg-card/95 backdrop-blur-sm rounded-2xl border border-border card-shadow p-4"
                style={{ animation: `fade-in-up 0.35s ease-out ${i * 60}ms both` }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full overflow-hidden ring-1 ring-border">
                      <img src={review.userAvatar} alt={review.userName} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <span className="font-heading font-semibold text-[13px] text-foreground">{review.userName}</span>
                      <div className="flex items-center gap-0.5 mt-0.5">
                        {Array.from({ length: 5 }).map((_, j) => (
                          <Star key={j} size={10} className={j < review.rating ? 'text-accent fill-accent' : 'text-border fill-border'} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-heading uppercase tracking-wider text-muted-foreground">{review.date}</span>
                </div>
                <span className="inline-block text-[10px] font-heading font-semibold text-primary uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-primary/6 border border-primary/10 mb-2">
                  {review.service}
                </span>
                <p className="text-[13px] font-body text-muted-foreground leading-relaxed">{review.text}</p>

                {review.beforePhoto && review.afterPhoto && (
                  <div className="flex gap-2 mt-3">
                    <div className="flex-1">
                      <span className="text-[9px] font-heading font-bold text-muted-foreground uppercase tracking-wider mb-1 block">Before</span>
                      <div className="aspect-square rounded-xl overflow-hidden ring-1 ring-border">
                        <img src={review.beforePhoto} alt="Before" className="w-full h-full object-cover" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <span className="text-[9px] font-heading font-bold text-success uppercase tracking-wider mb-1 block">After</span>
                      <div className="aspect-square rounded-xl overflow-hidden ring-1 ring-success/30">
                        <img src={review.afterPhoto} alt="After" className="w-full h-full object-cover" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {reviews.length === 0 && (
              <div className="text-center py-14">
                <p className="font-heading text-[14px] text-muted-foreground">No reviews yet</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Before & After Tab */}
      {activeTab === 'portfolio' && (
        <div className="animate-fade-in-up px-5 pt-2" style={{ animationDuration: '250ms' }}>
          <h2 className="font-heading font-semibold text-[15px] text-foreground mb-3">Before & After</h2>
          {artist.beforeAfterPhotos.length > 0 ? (
            <div className="space-y-4">
              {artist.beforeAfterPhotos.map(photo => {
                const pos = sliderPositions[photo.id] ?? 50;
                return (
                  <div key={photo.id} className="bg-card/95 backdrop-blur-sm rounded-2xl border border-border card-shadow overflow-hidden">
                    <div className="px-4 pt-3 pb-2">
                      <span className="text-[12px] font-heading font-semibold text-foreground">{photo.service}</span>
                    </div>
                    <div
                      className="relative aspect-[4/3] cursor-col-resize select-none"
                      onMouseMove={(e) => e.buttons === 1 && handleSliderMove(photo.id, e)}
                      onTouchMove={(e) => handleSliderMove(photo.id, e)}
                    >
                      <img src={photo.after} alt="After" className="absolute inset-0 w-full h-full object-cover" />
                      <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
                        <img src={photo.before} alt="Before" className="absolute inset-0 w-full h-full object-cover" style={{ minWidth: `${(100 / pos) * 100}%`, maxWidth: `${(100 / pos) * 100}%` }} />
                      </div>
                      <div className="absolute top-0 bottom-0" style={{ left: `${pos}%` }}>
                        <div className="absolute -translate-x-1/2 top-0 bottom-0 w-0.5 bg-card shadow-lg" />
                        <div className="absolute -translate-x-1/2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-card shadow-lg flex items-center justify-center border border-border">
                          <span className="text-[10px] font-heading font-bold text-muted-foreground">⇔</span>
                        </div>
                      </div>
                      <span className="absolute top-3 left-3 text-[10px] font-heading font-bold text-card bg-foreground/70 px-2 py-0.5 rounded-md backdrop-blur-sm">BEFORE</span>
                      <span className="absolute top-3 right-3 text-[10px] font-heading font-bold text-card bg-success/80 px-2 py-0.5 rounded-md backdrop-blur-sm">AFTER</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-14">
              <p className="font-heading text-[14px] text-muted-foreground">No portfolio photos yet</p>
            </div>
          )}
        </div>
      )}

      {/* Floating Bottom Bar */}
      {cartCount > 0 && (
        <PageFloatingFooter>
          <div
            className="pointer-events-auto absolute bottom-0 left-0 right-0 border-t border-border bg-card/95 px-5 z-50"
            style={{
              boxShadow: 'var(--shadow-bottom-bar)',
              animation: 'slide-up 0.3s ease-out',
              paddingBottom: 'var(--inset-bottom)',
            }}
          >
            {shortfall > 0 && (
              <div className="flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-xl px-3 py-2 mt-3">
                <AlertCircle size={14} className="text-accent flex-shrink-0" />
                <span className="text-[11px] font-body text-foreground">
                  Add <span className="font-heading font-bold">₹{shortfall}</span> more to meet {artist.name.split(' ')[0]}'s minimum booking
                </span>
              </div>
            )}
            <div className="flex items-center justify-between py-3.5 max-w-lg mx-auto">
              <div>
                <span className="text-[12px] font-body text-muted-foreground">{cartCount} service{cartCount > 1 ? 's' : ''}</span>
                <p className="font-heading font-bold text-[18px] text-foreground leading-tight">₹{cartTotal}</p>
                {artist.travelFee > 0 && (
                  <span className="text-[10px] text-muted-foreground">+ ₹{artist.travelFee} travel fee</span>
                )}
              </div>
              <button
                disabled={shortfall > 0}
                onClick={() => navigate(`/at-home-booking/${artist.id}`, { state: { cart, artistId: artist.id } })}
                className={`font-heading font-semibold text-[14px] px-7 py-3.5 rounded-2xl transition-all min-h-[48px] ${
                  shortfall > 0
                    ? 'bg-muted text-muted-foreground cursor-not-allowed'
                    : 'bg-primary text-primary-foreground active:scale-95'
                }`}
              >
                Continue
              </button>
            </div>
          </div>
        </PageFloatingFooter>
      )}

      {/* Service Detail Drawer */}
      <ServiceDrawer
        service={drawerService}
        open={!!drawerService}
        onClose={() => setDrawerService(null)}
        onBook={(svc) => {
          addToCart(svc.id);
          setDrawerService(null);
        }}
      />
    </div>
  );
};

const ServiceCard = ({
  service,
  qty,
  onAdd,
  onRemove,
  onTap,
  index,
}: {
  service: AtHomeService;
  qty: number;
  onAdd: () => void;
  onRemove: () => void;
  onTap: () => void;
  index: number;
}) => (
  <div
    className="flex items-center gap-3.5 bg-card/95 backdrop-blur-sm rounded-2xl p-3 card-shadow border border-border cursor-pointer"
    style={{ animation: `fade-in-up 0.3s ease-out ${index * 50}ms both` }}
    onClick={onTap}
  >
    <div className="relative w-[80px] h-[80px] rounded-xl overflow-hidden flex-shrink-0 ring-1 ring-border">
      <img src={service.image} alt={service.name} className="w-full h-full object-cover" loading="lazy" />
      {service.originalPrice && (
        <div className="absolute top-1 left-1 bg-destructive/90 text-destructive-foreground text-[8px] font-heading font-bold px-1.5 py-0.5 rounded-md">
          {Math.round(((service.originalPrice - service.price) / service.originalPrice) * 100)}% OFF
        </div>
      )}
      {/* Play icon overlay on thumbnail */}
      <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-card/80 flex items-center justify-center">
        <Play size={8} className="text-foreground ml-px" />
      </div>
    </div>
    <div className="flex-1 min-w-0">
      <h4 className="font-heading font-medium text-[13px] text-foreground leading-tight">{service.name}</h4>
      <p className="text-[11px] font-body text-muted-foreground mt-0.5 line-clamp-1">{service.description}</p>
      <span className="text-[10px] font-body text-muted-foreground bg-secondary px-2 py-0.5 rounded-md inline-block mt-1">
        {service.duration}
      </span>
      <div className="flex items-center gap-2 mt-1">
        <span className="font-heading font-semibold text-[14px] text-foreground">₹{service.price}</span>
        {service.originalPrice && (
          <span className="text-[11px] text-muted-foreground line-through">₹{service.originalPrice}</span>
        )}
      </div>
    </div>
    <div onClick={(e) => e.stopPropagation()}>
      {qty > 0 ? (
        <div className="flex items-center gap-1 bg-primary/8 rounded-xl px-1 border border-primary/15 flex-shrink-0">
          <button onClick={onRemove} className="p-2 text-primary min-h-[40px] min-w-[32px] flex items-center justify-center">
            <Minus size={13} />
          </button>
          <span className="text-[13px] font-heading font-semibold text-primary w-4 text-center">{qty}</span>
          <button onClick={onAdd} className="p-2 text-primary min-h-[40px] min-w-[32px] flex items-center justify-center">
            <Plus size={13} />
          </button>
        </div>
      ) : (
        <button
          onClick={onAdd}
          className="bg-primary text-primary-foreground text-[11px] font-heading font-semibold px-4 py-2 rounded-xl active:scale-95 transition-transform min-h-[40px] flex-shrink-0"
        >
          Book Now
        </button>
      )}
    </div>
  </div>
);

export default ArtistProfile;
