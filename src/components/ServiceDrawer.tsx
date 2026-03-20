import { useState } from 'react';
import { X, Clock, Play, ChevronDown, ChevronUp } from 'lucide-react';
import { Drawer, DrawerContent, DrawerClose } from '@/components/ui/drawer';
import type { AtHomeService } from '@/types/atHome';

interface ServiceDrawerProps {
  service: AtHomeService | null;
  open: boolean;
  onClose: () => void;
  onBook: (service: AtHomeService) => void;
}

const ServiceDrawer = ({ service, open, onClose, onBook }: ServiceDrawerProps) => {
  const [expanded, setExpanded] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  if (!service) return null;

  // Example YouTube video ID for demo
  const videoId = 'dQw4w9WgXcQ';

  return (
    <Drawer open={open} onOpenChange={(o) => !o && onClose()}>
      <DrawerContent className="max-h-[90vh] rounded-t-3xl border-border">
        <div className="overflow-y-auto max-h-[85vh] pb-6">
          {/* Video / Image section */}
          <div className="relative mx-4 mt-2 rounded-2xl overflow-hidden aspect-video bg-secondary">
            {showVideo ? (
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                className="w-full h-full"
                allow="autoplay; encrypted-media"
                allowFullScreen
                title={service.name}
              />
            ) : (
              <>
                <img src={service.image} alt={service.name} className="w-full h-full object-cover" />
                <button
                  onClick={() => setShowVideo(true)}
                  className="absolute inset-0 flex items-center justify-center bg-foreground/10"
                >
                  <div className="w-14 h-14 rounded-full bg-card/90 backdrop-blur-md flex items-center justify-center shadow-lg">
                    <Play size={22} className="text-foreground ml-0.5" />
                  </div>
                </button>
              </>
            )}
          </div>

          {/* Service Info */}
          <div className="px-5 pt-4">
            <h3 className="font-heading font-bold text-[20px] text-foreground leading-tight">{service.name}</h3>
            {service.category && (
              <span className="inline-block mt-2 text-[11px] font-heading font-semibold text-primary bg-primary/8 border border-primary/12 px-3 py-1 rounded-lg capitalize">
                {service.category}
              </span>
            )}

            {/* Description */}
            <div className="mt-3">
              <p className={`text-[13px] font-body text-muted-foreground leading-relaxed ${!expanded ? 'line-clamp-2' : ''}`}>
                {service.description} This professional service is performed at your home by a certified beautician using premium products. Expect salon-quality results in the comfort of your own space.
              </p>
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-[12px] font-heading font-semibold text-foreground flex items-center gap-0.5 mt-1"
              >
                {expanded ? 'Show Less' : 'Read More'}
                {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            </div>

            {/* Booking Details */}
            <h4 className="font-heading font-semibold text-[14px] text-foreground mt-5 mb-3">Booking Details</h4>
            <div className="flex gap-3">
              <div className="flex-1 bg-secondary/60 rounded-2xl p-4 border border-border">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <span className="text-[16px] font-heading font-bold text-primary">₹</span>
                </div>
                <span className="text-[11px] font-body text-muted-foreground">Price</span>
                <p className="font-heading font-bold text-[18px] text-foreground">₹{service.price}</p>
                {service.originalPrice && (
                  <span className="text-[11px] text-muted-foreground line-through">₹{service.originalPrice}</span>
                )}
              </div>
              <div className="flex-1 bg-secondary/60 rounded-2xl p-4 border border-border">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <Clock size={16} className="text-primary" />
                </div>
                <span className="text-[11px] font-body text-muted-foreground">Duration</span>
                <p className="font-heading font-bold text-[18px] text-foreground">{service.duration}</p>
              </div>
            </div>

            {/* Select Time */}
            <div className="flex items-center gap-2 mt-5 text-muted-foreground">
              <Clock size={14} />
              <span className="text-[13px] font-heading font-medium">Select Time</span>
            </div>
          </div>

          {/* CTA */}
          <div className="px-5 mt-5">
            <button
              onClick={() => onBook(service)}
              className="w-full bg-primary text-primary-foreground font-heading font-semibold text-[15px] py-4 rounded-2xl active:scale-[0.97] transition-transform min-h-[52px]"
            >
              Select Time to Book
            </button>
          </div>
        </div>

        <DrawerClose className="absolute top-3 right-3 w-8 h-8 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center border border-border">
          <X size={16} className="text-foreground" />
        </DrawerClose>
      </DrawerContent>
    </Drawer>
  );
};

export default ServiceDrawer;
