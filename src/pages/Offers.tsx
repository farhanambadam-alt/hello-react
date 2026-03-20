import { Tag, Clock, Sparkles, Gift, Copy, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import ScrollToTop from '@/components/ScrollToTop';

const offers = [
  { title: 'First Visit Special', desc: 'Get 40% off on your first booking', badge: 'New User', color: 'bg-primary/10 text-primary', icon: Sparkles, code: 'FIRST40' },
  { title: 'Weekend Glow Up', desc: 'Flat ₹200 off on weekends', badge: 'Weekend', color: 'bg-accent/20 text-accent-foreground', icon: Gift, code: 'WKND200' },
  { title: 'Festival Special', desc: 'Buy 2 services, get 1 free', badge: 'Limited', color: 'bg-success/10 text-success', icon: Tag, code: 'FEST2FOR1' },
];

const handleCopyCode = (code: string) => {
  navigator.clipboard.writeText(code).then(() => {
    toast.success(`Code "${code}" copied!`);
  });
};

const OffersPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pb-20 md:max-w-5xl md:mx-auto">
      {/* Sticky header */}
      <header className="sticky top-0 z-20 bg-background/90 backdrop-blur-md px-5 pt-6 pb-4 border-b border-border/30">
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.appBack?.()}
            className="w-9 h-9 min-w-[44px] min-h-[44px] rounded-full bg-secondary flex items-center justify-center"
            aria-label="Go back"
          >
            <ArrowLeft size={18} className="text-foreground" />
          </button>
          <div>
            <h1 className="font-heading font-bold text-xl text-foreground">Offers & Deals</h1>
            <p className="text-xs font-body text-muted-foreground mt-1">Exclusive offers just for you</p>
          </div>
        </div>
      </header>

      <div className="px-5 pt-4 space-y-3 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:space-y-0">
        {offers.map((offer, i) => (
          <div
            key={i}
            className="bg-card rounded-2xl p-4 card-shadow border border-border animate-fade-in-up"
            style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'both' }}
          >
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${offer.color}`}>
                <offer.icon size={20} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-heading font-semibold text-sm text-foreground">{offer.title}</h3>
                  <span className={`text-[9px] font-heading font-semibold px-2 py-0.5 rounded-full ${offer.color}`}>{offer.badge}</span>
                </div>
                <p className="text-xs font-body text-muted-foreground mt-1">{offer.desc}</p>
                <div className="flex items-center justify-between mt-2.5">
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Clock size={10} /> Expires in 3 days
                  </div>
                  <button
                    onClick={() => handleCopyCode(offer.code)}
                    className="flex items-center gap-1.5 bg-primary/8 border border-primary/15 rounded-lg px-3 py-1.5 active:scale-95 transition-transform min-h-[44px]"
                    aria-label={`Copy code ${offer.code}`}
                  >
                    <span className="text-[11px] font-heading font-bold text-primary tracking-wider">{offer.code}</span>
                    <Copy size={11} className="text-primary" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ScrollToTop />
    </div>
  );
};

export default OffersPage;
