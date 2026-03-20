import { memo } from 'react';
import { Scissors, Sparkles } from 'lucide-react';
import { useGender } from '@/contexts/GenderContext';

type Variant = 'pill' | 'segmented';

interface GenderToggleProps {
  variant?: Variant;
  className?: string;
}

/**
 * Unified gender toggle used across Home, SalonDetail, and AtHome pages.
 * - "pill": rounded-pill style (Home, AtHome)
 * - "segmented": segmented control with icons (SalonDetail services tab)
 */
const GenderToggle = memo(({ variant = 'pill', className = '' }: GenderToggleProps) => {
  const { gender, setGender } = useGender();

  if (variant === 'segmented') {
    return (
      <div className={`flex bg-secondary rounded-xl p-1 border border-border ${className}`}>
        <button
          onClick={() => setGender('male')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[13px] font-heading font-semibold transition-colors duration-300 min-h-[44px] ${
            gender === 'male' ? 'btn-themed shadow-sm' : 'text-muted-foreground'
          }`}
          aria-pressed={gender === 'male'}
          aria-label="Men's services"
        >
          <Scissors size={14} />
          Men
        </button>
        <button
          onClick={() => setGender('female')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[13px] font-heading font-semibold transition-colors duration-300 min-h-[44px] ${
            gender === 'female' ? 'btn-themed shadow-sm' : 'text-muted-foreground'
          }`}
          aria-pressed={gender === 'female'}
          aria-label="Women's services"
        >
          <Sparkles size={14} />
          Women
        </button>
      </div>
    );
  }

  // Default: pill toggle with themed sliding indicator
  return (
    <div className={`inline-flex bg-secondary border border-border rounded-xl p-1 relative ${className}`}>
      <div
        className="absolute top-1 bottom-1 rounded-lg transition-all duration-300 ease-out"
        style={{
          width: 'calc(50% - 4px)',
          transform: gender === 'male' ? 'translateX(0)' : 'translateX(calc(100% + 4px))',
          background: 'var(--btn-gradient)',
          boxShadow: 'var(--btn-shadow)',
        }}
        aria-hidden="true"
      />
      <button
        onClick={() => setGender('male')}
        className={`relative z-10 flex items-center justify-center gap-2 px-7 py-2.5 text-[13px] font-heading font-semibold rounded-lg transition-colors duration-200 min-h-[44px] ${
          gender === 'male' ? 'text-white' : 'text-muted-foreground'
        }`}
        aria-pressed={gender === 'male'}
        aria-label="Men"
      >
        <Scissors size={14} />
        Men
      </button>
      <button
        onClick={() => setGender('female')}
        className={`relative z-10 flex items-center justify-center gap-2 px-7 py-2.5 text-[13px] font-heading font-semibold rounded-lg transition-colors duration-200 min-h-[44px] ${
          gender === 'female' ? 'text-white' : 'text-muted-foreground'
        }`}
        aria-pressed={gender === 'female'}
        aria-label="Women"
      >
        <Sparkles size={14} />
        Women
      </button>
    </div>
  );
});
GenderToggle.displayName = 'GenderToggle';

export default GenderToggle;
