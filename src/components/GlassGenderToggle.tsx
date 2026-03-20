import { memo } from 'react';
import { Scissors, Sparkles } from 'lucide-react';
import { useGender } from '@/contexts/GenderContext';

interface GlassGenderToggleProps {
  className?: string;
}

/**
 * Glassmorphic gender toggle with blue/pink active states.
 * Used on Index, AtHome, and Explore pages.
 */
const GlassGenderToggle = memo(({ className = '' }: GlassGenderToggleProps) => {
  const { gender, setGender } = useGender();

  return (
    <div
      className={`inline-flex rounded-[22px] p-1.5 ${className}`}
      style={{
        background: 'rgba(255,255,255,0.4)',
        border: '1px solid rgba(255,255,255,0.4)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <button
        onClick={() => setGender('male')}
        className="flex-1 flex items-center justify-center gap-2 py-3 px-7 rounded-[18px] font-heading font-bold text-[13px] transition-all duration-300 active:scale-95 min-h-[44px]"
        style={{
          background: gender === 'male' ? '#3b82f6' : 'transparent',
          color: gender === 'male' ? '#fff' : 'hsl(var(--muted-foreground))',
          boxShadow: gender === 'male' ? '0 4px 14px -3px rgba(59,130,246,0.45)' : 'none',
          transition: 'background 500ms ease, color 500ms ease, box-shadow 500ms ease',
        }}
        aria-pressed={gender === 'male'}
        aria-label="Men"
      >
        <Scissors size={14} />
        Men
      </button>
      <button
        onClick={() => setGender('female')}
        className="flex-1 flex items-center justify-center gap-2 py-3 px-7 rounded-[18px] font-heading font-bold text-[13px] transition-all duration-300 active:scale-95 min-h-[44px]"
        style={{
          background: gender === 'female' ? '#ec4899' : 'transparent',
          color: gender === 'female' ? '#fff' : 'hsl(var(--muted-foreground))',
          boxShadow: gender === 'female' ? '0 4px 14px -3px rgba(236,72,153,0.45)' : 'none',
          transition: 'background 500ms ease, color 500ms ease, box-shadow 500ms ease',
        }}
        aria-pressed={gender === 'female'}
        aria-label="Women"
      >
        <Sparkles size={14} />
        Women
      </button>
    </div>
  );
});

GlassGenderToggle.displayName = 'GlassGenderToggle';
export default GlassGenderToggle;
