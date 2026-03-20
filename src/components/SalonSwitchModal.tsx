import { useCart } from '@/contexts/CartContext';
import { ArrowRightLeft } from 'lucide-react';

const SalonSwitchModal = () => {
  const { showSwitchModal, salon, pendingAdd, confirmSwitch, cancelSwitch } = useCart();

  if (!showSwitchModal || !salon || !pendingAdd) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-foreground/50 backdrop-blur-sm"
        onClick={cancelSwitch}
        style={{ animation: 'fade-in 0.2s ease-out' }}
      />

      {/* Modal */}
      <div
        className="relative bg-card rounded-3xl p-6 w-full max-w-sm border border-border shadow-2xl"
        style={{ animation: 'bounce-in 0.35s ease-out' }}
      >
        <h2 className="font-heading font-bold text-[18px] text-foreground text-center">
          Change Salon?
        </h2>

        {/* Visual: side-by-side salon icons */}
        <div className="flex items-center justify-center gap-4 mt-5 mb-4">
          {/* Current salon */}
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-border shadow-md">
              <img
                src={salon.image}
                alt={salon.name}
                className="w-full h-full object-cover"
                decoding="async"
                width={64}
                height={64}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                }}
              />
            </div>
            <span className="text-[11px] font-heading font-medium text-muted-foreground text-center max-w-[80px] truncate">
              {salon.name}
            </span>
          </div>

          {/* Replace icon */}
          <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
            <ArrowRightLeft size={18} className="text-destructive" />
          </div>

          {/* New salon */}
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-primary/30 shadow-md ring-2 ring-primary/20">
              <img
                src={pendingAdd.salon.image}
                alt={pendingAdd.salon.name}
                className="w-full h-full object-cover"
                decoding="async"
                width={64}
                height={64}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                }}
              />
            </div>
            <span className="text-[11px] font-heading font-medium text-foreground text-center max-w-[80px] truncate">
              {pendingAdd.salon.name}
            </span>
          </div>
        </div>

        {/* Body text */}
        <p className="text-[13px] font-body text-muted-foreground text-center leading-relaxed">
          Your cart at <strong className="text-foreground">{salon.name}</strong> will be cleared to
          start a new booking at <strong className="text-foreground">{pendingAdd.salon.name}</strong>.
        </p>

        {/* Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={cancelSwitch}
            className="flex-1 py-3 rounded-2xl text-[13px] font-heading font-semibold text-foreground bg-secondary border border-border active:scale-95 transition-transform min-h-[48px]"
          >
            Keep Previous
          </button>
          <button
            onClick={confirmSwitch}
            className="flex-1 py-3 rounded-2xl text-[13px] font-heading font-semibold btn-themed min-h-[48px]"
          >
            Start New
          </button>
        </div>
      </div>
    </div>
  );
};

export default SalonSwitchModal;
