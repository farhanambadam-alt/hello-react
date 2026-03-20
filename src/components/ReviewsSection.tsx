import { useState, useEffect, useRef } from 'react';
import { Star, CheckCircle2, ThumbsUp, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Artist, Review } from '@/types/salon';

interface ReviewsSectionProps {
  artists: Artist[];
  reviews: Review[];
  selectedArtist: string | null;
  onSelectArtist: (id: string | null) => void;
}

const ReviewsSection = ({ artists, reviews, selectedArtist, onSelectArtist }: ReviewsSectionProps) => {
  const [isJiggling, setIsJiggling] = useState(false);
  const [jiggleAvatarId, setJiggleAvatarId] = useState<string | null>(null);
  const artistScrollRef = useRef<HTMLDivElement>(null);

  const scrollArtists = (direction: 'left' | 'right') => {
    artistScrollRef.current?.scrollBy({ left: direction === 'left' ? -220 : 220, behavior: 'smooth' });
  };

  const handleArtistTap = (artistId: string | null, isSelected?: boolean, index?: number) => {
    const newId = isSelected ? null : artistId;
    onSelectArtist(newId);
    // Trigger jelly animation on the tapped avatar
    const jellyId = newId === null ? 'all' : newId;
    setJiggleAvatarId(jellyId);
    setTimeout(() => setJiggleAvatarId(null), 450);
    // Auto-center the tapped avatar
    const container = artistScrollRef.current;
    if (container && index != null) {
      const child = container.children[index] as HTMLElement | undefined;
      if (child) {
        const scrollLeft = child.offsetLeft - container.offsetWidth / 2 + child.offsetWidth / 2;
        container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
      }
    }
  };

  const filteredReviews = reviews.filter((r) => {
    if (selectedArtist && r.artistId !== selectedArtist) return false;
    return true;
  });

  const currentArtist = artists.find((a) => a.id === selectedArtist);
  const avgRating = filteredReviews.length > 0
    ? (filteredReviews.reduce((sum, r) => sum + r.rating, 0) / filteredReviews.length).toFixed(1)
    : '0.0';

  const reviewPhotos = [
    'https://images.unsplash.com/photo-1585747860019-8e8e13c2e4f2?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1622288432450-277d0fef5ed6?w=300&h=300&fit=crop',
  ];

  useEffect(() => {
    setIsJiggling(true);
    const timer = setTimeout(() => setIsJiggling(false), 600);
    return () => clearTimeout(timer);
  }, [selectedArtist]);

  return (
    <div className="animate-fade-in-up" style={{ animationDuration: '250ms' }}>
      {/* Stylists Header */}
      <div className="px-5 pt-5 pb-1">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="font-serif text-[20px] text-foreground italic">Our Stylists</h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollArtists('left')}
              className="h-8 w-8 rounded-full border border-border bg-card flex items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Scroll stylists left"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              type="button"
              onClick={() => scrollArtists('right')}
              className="h-8 w-8 rounded-full border border-border bg-primary text-primary-foreground flex items-center justify-center transition-opacity hover:opacity-90"
              aria-label="Scroll stylists right"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Artist Selector */}
        <div ref={artistScrollRef} className="flex overflow-x-auto scrollbar-hide py-4 items-end gap-4 scroll-smooth">
          <button
            type="button"
            onPointerUp={() => handleArtistTap(null, false, 0)}
            className="flex flex-col items-center flex-shrink-0 gap-2 touch-manipulation select-none"
            aria-pressed={!selectedArtist}
          >
            <div
              className={`rounded-2xl flex items-center justify-center font-heading font-bold text-foreground transition-[width,height,border-color,box-shadow] duration-300 ease-out ${
                !selectedArtist
                  ? 'w-[60px] h-[60px] text-[13px] border-[2.5px] border-primary bg-secondary shadow-md'
                  : 'w-[48px] h-[48px] text-[11px] bg-card border border-border'
              }`}
              style={jiggleAvatarId === 'all' ? { animation: 'jelly-avatar 0.45s ease' } : undefined}
            >
              ALL
            </div>
            <div className={`w-1.5 h-1.5 rounded-full transition-[transform,background-color] duration-300 ${!selectedArtist ? 'bg-primary scale-100' : 'bg-transparent scale-0'}`} />
          </button>

          {artists.map((artist, idx) => {
            const isSelected = selectedArtist === artist.id;
            return (
              <button
                key={artist.id}
                type="button"
                onPointerUp={() => handleArtistTap(artist.id, isSelected, idx + 1)}
                className="flex flex-col items-center flex-shrink-0 gap-2 touch-manipulation select-none"
                aria-pressed={isSelected}
              >
                <div
                  className={`rounded-2xl overflow-hidden transition-[width,height,border-color,box-shadow] duration-300 ease-out ${
                    isSelected
                      ? 'w-[60px] h-[60px] border-[2.5px] border-primary shadow-md'
                      : 'w-[48px] h-[48px] border border-border'
                  }`}
                  style={jiggleAvatarId === artist.id ? { animation: 'jelly-avatar 0.45s ease' } : undefined}
                >
                  <img src={artist.avatar} alt={artist.name} className="w-full h-full object-cover pointer-events-none" draggable={false} />
                </div>
                <div className={`w-1.5 h-1.5 rounded-full transition-[transform,background-color] duration-300 ${isSelected ? 'bg-primary scale-100' : 'bg-transparent scale-0'}`} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Reviews Container */}
      <div
        className="mx-4 mb-4 bg-card rounded-2xl border border-border card-shadow"
        style={{
          animation: isJiggling ? 'jelly-container 0.5s ease' : 'none',
          transformOrigin: 'top center',
        }}
      >
        <div className="px-5 pt-5 pb-3">
          {/* Selected artist profile */}
          {currentArtist && (
            <div className="flex items-center gap-4 mb-5 pb-4 border-b border-border">
              <div className="w-[72px] h-[72px] rounded-xl overflow-hidden flex-shrink-0 ring-1 ring-border">
                <img src={currentArtist.avatar} alt={currentArtist.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-heading font-bold text-[16px] block truncate text-foreground">
                  {currentArtist.name}
                </span>
                <p className="text-[13px] font-body text-muted-foreground mt-0.5">{currentArtist.specialty}</p>
                <div className="flex items-center gap-1 mt-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < Math.round(Number(avgRating)) ? 'text-accent fill-accent' : 'text-border fill-border'}
                    />
                  ))}
                  <span className="text-[13px] font-heading font-semibold ml-1.5 text-foreground">{avgRating}</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <h3 className="font-heading font-semibold text-[15px] text-foreground">
              {currentArtist ? 'Reviews' : 'All Reviews'}
            </h3>
            <div className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 bg-secondary border border-border">
              <Star size={12} className="text-accent fill-accent" />
              <span className="text-[13px] font-heading font-bold text-foreground">{avgRating}</span>
              <span className="text-[11px] text-muted-foreground">({filteredReviews.length})</span>
            </div>
          </div>
        </div>

        {/* Review Cards */}
        <div className="space-y-2 px-2.5 pb-3 md:grid md:grid-cols-2 md:gap-2 md:space-y-0">
          {filteredReviews.map((review, index) => (
            <div
              key={review.id}
              className="rounded-2xl p-4 bg-background"
              style={{ animation: `fade-in-up 0.35s ease-out ${index * 60}ms both` }}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 ring-1 ring-border">
                    <img src={review.userAvatar} alt={review.userName} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-heading font-semibold text-[13px] text-foreground">{review.userName}</span>
                      <CheckCircle2 size={12} className="text-success" />
                    </div>
                    <div className="flex items-center gap-0.5 mt-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={10}
                          className={i < review.rating ? 'text-accent fill-accent' : 'text-border fill-border'}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-heading uppercase tracking-wider text-muted-foreground whitespace-nowrap pt-1">
                  {review.date}
                </span>
              </div>

              <div className="mb-2">
                <span className="inline-block text-[10px] font-heading font-semibold text-primary uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-primary/6 border border-primary/10">
                  {review.service}
                </span>
              </div>

              <p className="text-[13px] font-body text-muted-foreground leading-relaxed">
                {review.text}
              </p>

              {review.hasPhoto && (
                <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide">
                  {reviewPhotos.map((photo, i) => (
                    <div key={i} className="w-28 h-28 flex-shrink-0 rounded-xl overflow-hidden ring-1 ring-border">
                      <img src={photo} alt={`Review photo ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-1.5 mt-3 pt-2.5 border-t border-border/50">
                <ThumbsUp size={12} className="text-muted-foreground" />
                <span className="text-[11px] font-body text-muted-foreground">{review.helpful} found helpful</span>
              </div>
            </div>
          ))}

          {filteredReviews.length === 0 && (
            <div className="text-center py-14">
              <p className="font-heading text-[14px] text-muted-foreground">No reviews yet</p>
              <p className="text-[12px] font-body mt-1.5 text-muted-foreground">Be the first to share your experience</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewsSection;
