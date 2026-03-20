import { useState } from 'react';
import { ArrowLeft, Check, Calendar as CalendarIcon, Clock, MapPin, AlertCircle, Zap } from 'lucide-react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { format, addDays, isSameDay } from 'date-fns';
import { atHomeArtists, environmentChecklist } from '@/data/atHomeData';
import { toast } from 'sonner';
import PageFloatingFooter from '@/components/PageFloatingFooter';
import { cleanRouteStack } from '@/hooks/useFlutterBridge';

const timeSlots = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
  '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM',
];

const unavailableSlots = ['12:30 PM', '3:30 PM'];

type Step = 'datetime' | 'checklist' | 'summary';

const AtHomeBooking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const artist = atHomeArtists.find(a => a.id === id) || atHomeArtists[0];

  const cartFromState: Record<string, number> = location.state?.cart || {};
  const cartServices = Object.entries(cartFromState).map(([sId, qty]) => {
    const svc = artist.services.find(s => s.id === sId);
    return svc ? { ...svc, qty } : null;
  }).filter(Boolean) as (typeof artist.services[0] & { qty: number })[];

  const cartTotal = cartServices.reduce((t, s) => t + s.price * s.qty, 0);
  const travelFee = artist.travelFee;
  const tax = Math.round((cartTotal + travelFee) * 0.18);
  const grandTotal = cartTotal + travelFee + tax;

  const [step, setStep] = useState<Step>('datetime');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const dates = Array.from({ length: 14 }, (_, i) => addDays(new Date(), i));
  const allChecked = environmentChecklist.every(item => checkedItems[item.id]);

  const toggleCheck = (itemId: string) => {
    setCheckedItems(prev => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  const handleConfirm = () => {
    setBookingSuccess(true);
    toast.success('At-home booking confirmed! 🎉');
    cleanRouteStack('/at-home-booking/');
    setTimeout(() => navigate('/bookings'), 2000);
  };

  if (bookingSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center animate-fade-in-up" style={{ animationDuration: '500ms' }}>
          <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4">
            <Check size={40} className="text-success" />
          </div>
          <h2 className="font-heading font-bold text-xl text-foreground">Booking Confirmed!</h2>
          <p className="text-sm text-muted-foreground font-body mt-2">
            {artist.name} • {format(selectedDate, 'MMM d, yyyy')} • {selectedTime}
          </p>
          <p className="text-[11px] text-muted-foreground font-body mt-1">At your home • Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{
        paddingBottom:
          step === 'summary'
            ? 'calc(148px + var(--inset-bottom))'
            : 'calc(132px + var(--inset-bottom))',
      }}
    >
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/90 backdrop-blur-md border-b border-border/50 px-4 pb-3" style={{ paddingTop: 'calc(var(--inset-top) + 12px)' }}>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (step === 'datetime') window.appBack?.();
              else if (step === 'checklist') setStep('datetime');
              else setStep('checklist');
            }}
            className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center min-h-[44px] min-w-[44px]"
          >
            <ArrowLeft size={18} className="text-foreground" />
          </button>
          <div>
            <h1 className="font-heading font-semibold text-base text-foreground">Book At Home</h1>
            <p className="text-[11px] font-body text-muted-foreground">{artist.name}</p>
          </div>
        </div>
        {/* Step indicator */}
        <div className="flex items-center gap-2 mt-3">
          {(['datetime', 'checklist', 'summary'] as Step[]).map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-heading font-semibold transition-colors ${
                step === s ? 'bg-primary text-primary-foreground' :
                (['datetime', 'checklist', 'summary'].indexOf(step) > i) ? 'bg-success text-success-foreground' :
                'bg-secondary text-muted-foreground'
              }`}>
                {(['datetime', 'checklist', 'summary'].indexOf(step) > i) ? <Check size={14} /> : i + 1}
              </div>
              {i < 2 && <div className={`flex-1 h-0.5 rounded-full ${
                (['datetime', 'checklist', 'summary'].indexOf(step) > i) ? 'bg-success' : 'bg-border'
              }`} />}
            </div>
          ))}
        </div>
      </header>

      {/* Step 1: Date & Time */}
      {step === 'datetime' && (
        <div className="animate-fade-in-up" style={{ animationDuration: '300ms' }}>
          <div className="px-4 pt-4">
            <h3 className="font-heading font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
              <CalendarIcon size={16} className="text-primary" /> Select Date
            </h3>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
              {dates.map(date => {
                const isSelected = isSameDay(date, selectedDate);
                const isToday = isSameDay(date, new Date());
                return (
                  <button
                    key={date.toISOString()}
                    onClick={() => setSelectedDate(date)}
                    className={`flex flex-col items-center gap-1 py-2 px-3 rounded-2xl flex-shrink-0 min-w-[56px] transition-[background-color,color,transform,box-shadow] duration-200 ${
                      isSelected ? 'bg-primary text-primary-foreground shadow-md scale-105' : 'bg-card border border-border text-foreground'
                    }`}
                  >
                    <span className={`text-[10px] font-body ${isSelected ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                      {format(date, 'EEE')}
                    </span>
                    <span className="font-heading font-semibold text-base">{format(date, 'd')}</span>
                    <span className={`text-[10px] font-body ${isSelected ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                      {format(date, 'MMM')}
                    </span>
                    {isToday && (
                      <span className={`text-[8px] font-body font-medium ${isSelected ? 'text-primary-foreground' : 'text-primary'}`}>Today</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="px-4 pt-5">
            <h3 className="font-heading font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
              <Clock size={16} className="text-primary" /> Available Slots
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {timeSlots.map(slot => {
                const isUnavailable = unavailableSlots.includes(slot);
                const isSelected = selectedTime === slot;
                return (
                  <button
                    key={slot}
                    disabled={isUnavailable}
                    onClick={() => setSelectedTime(slot)}
                    className={`py-2.5 px-2 rounded-xl text-xs font-body font-medium transition-[background-color,color,transform,box-shadow] duration-200 ${
                      isUnavailable ? 'bg-muted text-muted-foreground/40 cursor-not-allowed' :
                      isSelected ? 'bg-primary text-primary-foreground shadow-md' :
                      'bg-card border border-border text-foreground active:scale-95'
                    }`}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Environment Checklist */}
      {step === 'checklist' && (
        <div className="animate-fade-in-up px-4 pt-4" style={{ animationDuration: '300ms' }}>
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle size={16} className="text-accent" />
            <h3 className="font-heading font-semibold text-sm text-foreground">Environment Checklist</h3>
          </div>
          <p className="text-[12px] font-body text-muted-foreground mb-4">
            Please confirm these requirements for the best at-home service experience.
          </p>

          <div className="space-y-2.5">
            {environmentChecklist.map((item, i) => (
              <button
                key={item.id}
                onClick={() => toggleCheck(item.id)}
                className={`w-full flex items-start gap-3 p-3.5 rounded-2xl transition-[background-color,border-color] duration-200 text-left ${
                  checkedItems[item.id] ? 'bg-success/8 border-2 border-success/30' : 'bg-card border border-border'
                }`}
                style={{ animation: `fade-in-up 0.3s ease-out ${i * 60}ms both` }}
              >
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                  checkedItems[item.id] ? 'bg-success text-success-foreground' : 'bg-secondary border border-border'
                }`}>
                  {checkedItems[item.id] && <Check size={14} />}
                </div>
                <div>
                  <span className="font-heading font-medium text-[13px] text-foreground">{item.label}</span>
                  <p className="text-[11px] font-body text-muted-foreground mt-0.5">{item.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Summary */}
      {step === 'summary' && (
        <div className="animate-fade-in-up px-4 pt-4 space-y-3" style={{ animationDuration: '300ms' }}>
          {/* Artist card */}
          <div className="bg-card rounded-2xl p-3 card-shadow border border-border flex items-center gap-3">
            <div className="w-14 h-14 rounded-full overflow-hidden ring-1 ring-border">
              <img src={artist.avatar} alt={artist.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <h4 className="font-heading font-semibold text-sm text-foreground">{artist.name}</h4>
              <p className="text-[11px] font-body text-muted-foreground">{artist.specialty}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <MapPin size={10} className="text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground">Coming to your home</span>
              </div>
            </div>
          </div>

          {/* Date & Time */}
          <div className="bg-card rounded-2xl p-3 card-shadow border border-border">
            <h4 className="text-xs font-heading font-semibold text-muted-foreground mb-2">DATE & TIME</h4>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-sm font-body text-foreground">
                <CalendarIcon size={14} className="text-primary" />
                {format(selectedDate, 'EEEE, MMM d')}
              </div>
              <div className="flex items-center gap-1.5 text-sm font-body text-foreground">
                <Clock size={14} className="text-primary" />
                {selectedTime}
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="bg-card rounded-2xl p-3 card-shadow border border-border">
            <h4 className="text-xs font-heading font-semibold text-muted-foreground mb-2">SERVICES</h4>
            <div className="space-y-2">
              {cartServices.map(svc => (
                <div key={svc.id} className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-body text-foreground">{svc.name}</span>
                    <span className="text-[10px] text-muted-foreground ml-2">x{svc.qty}</span>
                  </div>
                  <span className="text-sm font-heading font-semibold text-foreground">₹{svc.price * svc.qty}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Price Breakdown with travel fee */}
          <div className="bg-card rounded-2xl p-3 card-shadow border border-border">
            <h4 className="text-xs font-heading font-semibold text-muted-foreground mb-2">PRICE BREAKDOWN</h4>
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm font-body">
                <span className="text-muted-foreground">Services Subtotal</span>
                <span className="text-foreground">₹{cartTotal}</span>
              </div>
              <div className="flex justify-between text-sm font-body">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Zap size={12} className="text-accent" /> Travel Fee ({artist.distance})
                </span>
                <span className="text-foreground">₹{travelFee}</span>
              </div>
              <div className="flex justify-between text-sm font-body">
                <span className="text-muted-foreground">Tax (18% GST)</span>
                <span className="text-foreground">₹{tax}</span>
              </div>
              <div className="border-t border-border pt-1.5 flex justify-between text-sm font-heading font-semibold">
                <span className="text-foreground">Total</span>
                <span className="text-primary">₹{grandTotal}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Bottom CTA */}
      <PageFloatingFooter>
        <div
          className="pointer-events-auto absolute bottom-0 left-0 right-0 border-t border-border bg-card/95 px-5 pt-3.5 z-50"
          style={{
            boxShadow: 'var(--shadow-bottom-bar)',
            paddingBottom: 'calc(var(--inset-bottom) + 14px)',
          }}
        >
          <div className="max-w-lg mx-auto">
            {step === 'datetime' && (
              <button
                disabled={!selectedTime}
                onClick={() => setStep('checklist')}
                className={`w-full font-heading font-semibold text-[14px] py-3.5 rounded-2xl min-h-[48px] transition-[background-color,color,transform] duration-200 ${
                  selectedTime ? 'bg-primary text-primary-foreground active:scale-[0.97]' : 'bg-muted text-muted-foreground cursor-not-allowed'
                }`}
              >
                Continue
              </button>
            )}
            {step === 'checklist' && (
              <button
                disabled={!allChecked}
                onClick={() => setStep('summary')}
                className={`w-full font-heading font-semibold text-[14px] py-3.5 rounded-2xl min-h-[48px] transition-[background-color,color,transform] duration-200 ${
                  allChecked ? 'bg-primary text-primary-foreground active:scale-[0.97]' : 'bg-muted text-muted-foreground cursor-not-allowed'
                }`}
              >
                {allChecked ? 'Continue to Summary' : `Complete Checklist (${Object.values(checkedItems).filter(Boolean).length}/${environmentChecklist.length})`}
              </button>
            )}
            {step === 'summary' && (
              <button
                onClick={handleConfirm}
                className="w-full bg-primary text-primary-foreground font-heading font-semibold text-[14px] py-3.5 rounded-2xl active:scale-[0.97] transition-transform min-h-[48px]"
              >
                Confirm Booking • ₹{grandTotal}
              </button>
            )}
          </div>
        </div>
      </PageFloatingFooter>
    </div>
  );
};

export default AtHomeBooking;
