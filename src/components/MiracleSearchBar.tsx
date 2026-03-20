import { useRef, useState, memo } from 'react';
import { Search } from 'lucide-react';
import { useGender } from '@/contexts/GenderContext';

interface MiracleSearchBarProps {
  onSearch?: (value: string) => void;
  onClick?: () => void;
  placeholder?: string;
  className?: string;
  asButton?: boolean;
  autoFocus?: boolean;
}

const THEME = {
  male: {
    beam: 'rgba(234,142,105,0.7)',
    beamMid: 'rgba(234,142,105,0.15)',
    glow: 'rgba(234,142,105,0.5)',
    textTint: '#fff7ed',
  },
  female: {
    beam: 'rgba(244,114,182,0.7)',
    beamMid: 'rgba(244,114,182,0.15)',
    glow: 'rgba(244,114,182,0.5)',
    textTint: '#fff1f2',
  },
};

const MiracleSearchBar = memo(({
  onSearch,
  onClick,
  placeholder = 'your perfect look...',
  className = '',
  asButton = false,
  autoFocus = false,
}: MiracleSearchBarProps) => {
  const { gender } = useGender();
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchValue, setSearchValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const t = gender === 'male' ? THEME.male : THEME.female;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    onSearch?.(e.target.value);
  };

  const Container = asButton ? 'button' : 'div';

  return (
    <div className={`miracle-search relative rounded-[32px] p-[1.5px] transition-all duration-500 ${className}`}
      style={{
        background: 'rgba(255,255,255,0.4)',
        border: '1px solid rgba(255,255,255,0.4)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <Container
        {...(asButton ? { onClick, type: 'button' as const, 'aria-label': 'Search salons and services' } : {})}
        onClick={asButton ? onClick : () => inputRef.current?.focus()}
        className="relative w-full flex items-center rounded-[32px] overflow-hidden cursor-pointer"
        style={{
          background: 'rgba(255,255,255,0.15)',
          height: '48px',
          outline: '0.5px solid rgba(255,255,255,0.2)',
        }}
      >
        {/* ── Left side: icon + "Find" ── */}
        <div className="flex items-center z-20 pl-5 flex-shrink-0">
          <Search size={16} className="text-foreground/60" />
          <span
            className="text-[16px] font-bold text-foreground/90 italic ml-2.5"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Find
          </span>
        </div>

        {/* ── Light Engine: Cursor + Beam ── */}
        <div className="relative flex items-center z-10 flex-shrink-0" style={{ width: 0 }}>
          {/* The Splitter (Cursor) — right-shifted shadow only */}
          <div
            className="flex-shrink-0 ml-2.5"
            style={{
              width: '4px',
              height: '28px',
              borderRadius: '2px',
              background: 'white',
              boxShadow: `2px 0 12px rgba(255,255,255,1), 10px 0 25px 4px ${t.beam}`,
              transition: 'box-shadow 500ms ease',
              position: 'relative',
              zIndex: 20,
            }}
          />

          {/* Beam Container — clipped to prevent ANY left bleed */}
          <div
            className="absolute"
            style={{
              left: '10px', /* ml-2.5 = 10px, aligns with cursor left edge */
              top: 0,
              bottom: 0,
              width: 'calc(100vw - 120px)',
              clipPath: 'inset(-100px -100px -100px 4px)', /* wall at cursor right edge */
              zIndex: 1,
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {/* The Geometric Wedge (Polygon clip-path) */}
            <div
              className="absolute inset-y-0 w-full"
              style={{
                left: '4px',
                background: `linear-gradient(to right, ${t.beam} 0%, ${t.beamMid} 45%, transparent 100%)`,
                clipPath: 'polygon(0 calc(50% - 14px), 100% calc(50% - 45px), 100% calc(50% + 45px), 0 calc(50% + 14px))',
                filter: 'blur(8px)',
                transition: 'background 500ms ease',
              }}
            />

            {/* Micro particles */}
            <div className="absolute inset-0">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full bg-white/50 animate-twinkle"
                  style={{
                    width: `${1.5 + Math.random() * 2}px`,
                    height: `${1.5 + Math.random() * 2}px`,
                    top: `${15 + Math.random() * 70}%`,
                    left: `${5 + Math.random() * 40}%`,
                    animationDelay: `${Math.random() * 3}s`,
                    animationDuration: `${2 + Math.random() * 3}s`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── Text layer: placeholder for asButton mode only ── */}
        {asButton && (
          <div
            className="absolute z-20"
            style={{
              left: '120px',
              top: 0,
              bottom: 0,
              right: '20px',
              display: 'flex',
              alignItems: 'center',
              pointerEvents: 'none',
            }}
          >
            <span
              className="text-[14px] italic whitespace-nowrap overflow-hidden text-ellipsis"
              style={{
                fontFamily: 'Georgia, serif',
                color: 'hsl(var(--muted-foreground))',
                opacity: 0.7,
                transition: 'color 500ms ease, opacity 300ms ease',
              }}
            >
              {placeholder}
            </span>
          </div>
        )}

        {/* ── Visible input with real caret ── */}
        {!asButton && (
          <input
            ref={(el) => {
              (inputRef as React.MutableRefObject<HTMLInputElement | null>).current = el;
              if (el && autoFocus) {
                requestAnimationFrame(() => el.focus());
              }
            }}
            type="text"
            value={searchValue}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="absolute z-30 bg-transparent outline-none border-none text-[14px] italic"
            style={{
              left: '120px',
              top: 0,
              bottom: 0,
              right: '20px',
              width: 'calc(100% - 140px)',
              height: '100%',
              color: 'hsl(var(--foreground))',
              fontFamily: 'Georgia, serif',
              caretColor: 'hsl(var(--foreground))',
              cursor: 'text',
            }}
            placeholder={placeholder}
            aria-label="Search"
          />
        )}
      </Container>
    </div>
  );
});

MiracleSearchBar.displayName = 'MiracleSearchBar';
export default MiracleSearchBar;
