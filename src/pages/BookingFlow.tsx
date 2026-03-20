import { useState, useEffect } from 'react';
import { ArrowLeft, Check, Calendar as CalendarIcon, Clock, User, Sparkles, ChevronRight } from 'lucide-react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { format, addDays, isSameDay } from 'date-fns';
import { featuredSalons, nearbySalons, services, artists } from '@/data/mockData';
import { toast } from 'sonner';
import PageFloatingFooter from '@/components/PageFloatingFooter';
import { cleanRouteStack } from '@/hooks/useFlutterBridge';

const timeSlots = [
  '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '1:00 PM', '2:00 PM', '2:30 PM',
  '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM',
  '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM',
];

const peakSlots = ['10:30 AM', '11:00 AM', '6:00 PM', '6:30 PM', '7:00 PM'];
const unavailableSlots = ['1:00 PM', '3:30 PM'];

type Step = 'datetime' | 'barber' | 'summary';

const BookingFlow = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const salon = [...featuredSalons, ...nearbySalons].find((s) => s.id === id) || featuredSalons[0];

  const cartFromState: Record<string, number> = location.state?.cart || {};
  const cartServices = Object.entries(cartFromState).map(([sId, qty]) => {
    const svc = services.find((s) => s.id === sId);
    return svc ? { ...svc, qty } : null;
  }).filter(Boolean) as (typeof services[0] & { qty: number })[];

  const cartTotal = cartServices.reduce((t, s) => t + s.price * s.qty, 0);

  const [step, setStep] = useState<Step>('datetime');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedBarber, setSelectedBarber] = useState<string | null>(null);
  const [autoAssign, setAutoAssign] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Generate next 14 days
  const dates = Array.from({ length: 14 }, (_, i) => addDays(new Date(), i));
  const weekendDays = dates.filter(d => d.getDay() === 0 || d.getDay() === 6);

  const canProceedToBarber = selectedDate && selectedTime;
  const canProceedToSummary = selectedBarber || autoAssign;

  const handleConfirmBooking = () => {
    setBookingSuccess(true);
    toast.success('Booking confirmed! 🎉');
    // Remove booking flow from nav stack so back won't revisit it
    cleanRouteStack('/booking/');
    setTimeout(() => navigate('/bookings', { replace: true }), 2000);
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
            {salon.name} • {format(selectedDate, 'MMM d, yyyy')} • {selectedTime}
          </p>
          <p className="text-xs text-muted-foreground font-body mt-1">Redirecting to bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen md:max-w-5xl md:mx-auto"
      style={{
        paddingBottom:
          step === 'summary'
            ? 'calc(156px + var(--inset-bottom))'
            : 'calc(132px + var(--inset-bottom))',
      }}
    >
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/90 backdrop-blur-md border-b border-border/50 px-4 pb-3" style={{ paddingTop: 'calc(var(--inset-top) + 12px)' }}>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (step === 'datetime') window.appBack?.();
              else if (step === 'barber') setStep('datetime');
              else setStep('barber');
            }}
            className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center"
          >
            <ArrowLeft size={18} className="text-foreground" />
          </button>
          <div>
            <h1 className="font-heading font-semibold text-base text-foreground">Book Appointment</h1>
            <p className="text-[11px] font-body text-muted-foreground">{salon.name}</p>
          </div>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mt-3">
          {(['datetime', 'barber', 'summary'] as Step[]).map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-heading font-semibold transition-colors ${
                step === s ? 'bg-primary text-primary-foreground' :
                (['datetime', 'barber', 'summary'].indexOf(step) > i) ? 'bg-success text-success-foreground' :
                'bg-secondary text-muted-foreground'
              }`}>
                {(['datetime', 'barber', 'summary'].indexOf(step) > i) ? <Check size={14} /> : i + 1}
              </div>
              {i < 2 && <div className={`flex-1 h-0.5 rounded-full ${
                (['datetime', 'barber', 'summary'].indexOf(step) > i) ? 'bg-success' : 'bg-border'
              }`} />}
            </div>
          ))}
        </div>
      </header>

      {/* Step 1: Date & Time */}
      {step === 'datetime' && (
        <div className="animate-fade-in-up" style={{ animationDuration: '300ms' }}>
          {/* Date Selector */}
          <div className="px-4 pt-4">
            <h3 className="font-heading font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
              <CalendarIcon size={16} className="text-primary" /> Select Date
            </h3>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
              {dates.map((date) => {
                const isSelected = isSameDay(date, selectedDate);
                const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                const isToday = isSameDay(date, new Date());
                return (
                  <button
                    key={date.toISOString()}
                    onClick={() => setSelectedDate(date)}
                    className={`flex flex-col items-center gap-1 py-2 px-3 rounded-2xl flex-shrink-0 min-w-[56px] transition-all duration-200 ${
                      isSelected
                        ? 'bg-primary text-primary-foreground shadow-md scale-105'
                        : 'bg-card border border-border text-foreground'
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
                      <span className={`text-[8px] font-body font-medium ${isSelected ? 'text-primary-foreground' : 'text-primary'}`}>
                        Today
                      </span>
                    )}
                    {isWeekend && !isToday && (
                      <span className={`text-[8px] font-body ${isSelected ? 'text-primary-foreground/70' : 'text-accent'}`}>
                        Almost full
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Slots */}
          <div className="px-4 pt-5">
            <h3 className="font-heading font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
              <Clock size={16} className="text-primary" /> Available Slots
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {timeSlots.map((slot) => {
                const isPeak = peakSlots.includes(slot);
                const isUnavailable = unavailableSlots.includes(slot);
                const isSelected = selectedTime === slot;
                return (
                  <button
                    key={slot}
                    disabled={isUnavailable}
                    onClick={() => setSelectedTime(slot)}
                    className={`relative py-2.5 px-2 rounded-xl text-xs font-body font-medium transition-all duration-200 ${
                      isUnavailable
                        ? 'bg-muted text-muted-foreground/40 cursor-not-allowed'
                        : isSelected
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'bg-card border border-border text-foreground active:scale-95'
                    }`}
                  >
                    {slot}
                    {isPeak && !isUnavailable && (
                      <span className={`absolute -top-1 -right-1 text-[7px] font-heading font-semibold px-1 py-0.5 rounded-full ${
                        isSelected ? 'bg-accent text-accent-foreground' : 'bg-accent/20 text-accent'
                      }`}>
                        Peak
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Barber Selection */}
      {step === 'barber' && (
        <div className="animate-fade-in-up" style={{ animationDuration: '300ms' }}>
          <div className="px-4 pt-4">
            <h3 className="font-heading font-semibold text-sm text-foreground mb-1 flex items-center gap-2">
              <User size={16} className="text-primary" /> Choose Hair Specialist
            </h3>
            <p className="text-xs text-muted-foreground font-body mb-4">Select your preferred stylist or let us assign the best available</p>

            {/* Auto-assign option */}
            <button
              onClick={() => { setAutoAssign(true); setSelectedBarber(null); }}
              className={`w-full flex items-center gap-3 p-3 rounded-2xl mb-3 transition-all duration-200 ${
                autoAssign
                  ? 'bg-primary/10 border-2 border-primary'
                  : 'bg-card border border-border'
              }`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                autoAssign ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
              }`}>
                <Sparkles size={20} />
              </div>
              <div className="text-left flex-1">
                <p className="font-heading font-medium text-sm text-foreground">Any Specialist</p>
                <p className="text-[11px] font-body text-muted-foreground">We'll assign the best available stylist</p>
              </div>
              {autoAssign && <Check size={18} className="text-primary" />}
            </button>

            {/* Barber Cards */}
            <div className="space-y-2">
              {artists.map((artist) => {
                const isSelected = selectedBarber === artist.id;
                return (
                  <button
                    key={artist.id}
                    onClick={() => { setSelectedBarber(artist.id); setAutoAssign(false); }}
                    className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all duration-200 ${
                      isSelected
                        ? 'bg-primary/10 border-2 border-primary'
                        : 'bg-card border border-border'
                    }`}
                  >
                    <div className={`w-14 h-14 rounded-full overflow-hidden border-2 ${
                      isSelected ? 'border-primary' : 'border-transparent'
                    }`}>
                      <img src={artist.avatar} alt={artist.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-heading font-medium text-sm text-foreground">{artist.name}</p>
                      <p className="text-[11px] font-body text-muted-foreground">{artist.specialty}</p>
                      <span className="text-[10px] font-body font-medium text-success bg-success/10 px-2 py-0.5 rounded-full inline-block mt-1">
                        Available
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-accent">
                      ⭐ 4.{5 + parseInt(artist.id)}
                    </div>
                    {isSelected && <Check size={18} className="text-primary" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Summary */}
      {step === 'summary' && (
        <div className="animate-fade-in-up" style={{ animationDuration: '300ms' }}>
          <div className="px-4 pt-4 space-y-4">
            {/* Salon Card */}
            <div className="bg-card rounded-2xl p-3 card-shadow flex items-center gap-3">
              <img src={salon.image} alt={salon.name} className="w-16 h-16 rounded-xl object-cover" />
              <div>
                <h4 className="font-heading font-semibold text-sm text-foreground">{salon.name}</h4>
                <p className="text-[11px] font-body text-muted-foreground">{salon.address}</p>
              </div>
            </div>

            {/* Barber */}
            <div className="bg-card rounded-2xl p-3 card-shadow">
              <h4 className="text-xs font-heading font-semibold text-muted-foreground mb-2">SPECIALIST</h4>
              {autoAssign ? (
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Sparkles size={16} className="text-primary" />
                  </div>
                  <span className="text-sm font-body text-foreground">Auto-assigned (Best Available)</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <img src={artists.find(a => a.id === selectedBarber)?.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <span className="text-sm font-heading font-medium text-foreground">{artists.find(a => a.id === selectedBarber)?.name}</span>
                    <p className="text-[11px] font-body text-muted-foreground">{artists.find(a => a.id === selectedBarber)?.specialty}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Date & Time */}
            <div className="bg-card rounded-2xl p-3 card-shadow">
              <h4 className="text-xs font-heading font-semibold text-muted-foreground mb-2">DATE & TIME</h4>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-sm font-body text-foreground">
                  <CalendarIcon size={14} className="text-primary" />
                  {format(selectedDate, 'EEEE, MMM d, yyyy')}
                </div>
                <div className="flex items-center gap-1.5 text-sm font-body text-foreground">
                  <Clock size={14} className="text-primary" />
                  {selectedTime}
                </div>
              </div>
            </div>

            {/* Services */}
            <div className="bg-card rounded-2xl p-3 card-shadow">
              <h4 className="text-xs font-heading font-semibold text-muted-foreground mb-2">SERVICES</h4>
              <div className="space-y-2">
                {cartServices.map((svc) => (
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

            {/* Coupon */}
            <details className="bg-card rounded-2xl card-shadow">
              <summary className="px-3 py-3 cursor-pointer text-sm font-heading font-medium text-primary flex items-center gap-2">
                🎟️ Apply Coupon Code
                <ChevronRight size={14} className="ml-auto" />
              </summary>
              <div className="px-3 pb-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    className="flex-1 bg-secondary rounded-xl px-3 py-2 text-sm font-body text-foreground placeholder:text-muted-foreground outline-none"
                  />
                  <button className="bg-primary text-primary-foreground text-sm font-heading font-medium px-4 py-2 rounded-xl">
                    Apply
                  </button>
                </div>
              </div>
            </details>

            {/* Price Breakdown */}
            <div className="bg-card rounded-2xl p-3 card-shadow">
              <h4 className="text-xs font-heading font-semibold text-muted-foreground mb-2">PRICE BREAKDOWN</h4>
              <div className="space-y-1.5">
                <div className="flex justify-between text-sm font-body">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">₹{cartTotal}</span>
                </div>
                <div className="flex justify-between text-sm font-body">
                  <span className="text-muted-foreground">Tax (18% GST)</span>
                  <span className="text-foreground">₹{Math.round(cartTotal * 0.18)}</span>
                </div>
                <div className="border-t border-border pt-1.5 flex justify-between text-sm font-heading font-semibold">
                  <span className="text-foreground">Total</span>
                  <span className="text-primary">₹{cartTotal + Math.round(cartTotal * 0.18)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Bottom CTA */}
      <PageFloatingFooter>
        <div
          className="pointer-events-auto absolute bottom-0 left-0 right-0 border-t border-border bg-card px-4 pt-3 z-50"
          style={{
            boxShadow: 'var(--shadow-bottom-bar)',
            paddingBottom: 'calc(var(--inset-bottom) + 12px)',
          }}
        >
          <div className="max-w-lg mx-auto">
            {step === 'datetime' && (
              <button
                disabled={!canProceedToBarber}
                onClick={() => setStep('barber')}
                className={`w-full py-3.5 rounded-2xl font-heading font-semibold text-sm transition-all duration-200 ${
                  canProceedToBarber
                    ? 'bg-primary text-primary-foreground active:scale-[0.98]'
                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                }`}
              >
                Choose Specialist →
              </button>
            )}
            {step === 'barber' && (
              <button
                disabled={!canProceedToSummary}
                onClick={() => setStep('summary')}
                className={`w-full py-3.5 rounded-2xl font-heading font-semibold text-sm transition-all duration-200 ${
                  canProceedToSummary
                    ? 'bg-primary text-primary-foreground active:scale-[0.98]'
                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                }`}
              >
                Review Booking →
              </button>
            )}
            {step === 'summary' && (
              <div className="flex gap-3">
                <button
                  onClick={handleConfirmBooking}
                  className="flex-1 py-3.5 rounded-2xl font-heading font-semibold text-sm bg-primary text-primary-foreground active:scale-[0.98] transition-transform"
                >
                  Pay & Confirm • ₹{cartTotal + Math.round(cartTotal * 0.18)}
                </button>
                <button
                  onClick={handleConfirmBooking}
                  className="py-3.5 px-4 rounded-2xl font-heading font-medium text-sm border-2 border-primary text-primary active:scale-[0.98] transition-transform"
                >
                  Pay at Salon
                </button>
              </div>
            )}
          </div>
        </div>
      </PageFloatingFooter>
    </div>
  );
};

export default BookingFlow;
