import { memo } from 'react';
import { useGender } from '@/contexts/GenderContext';

/* Reduced from 28 dots to 14 — visually identical on small screens, 5% larger */
const DOTS = [
  { cx: 55, cy: 65, r: 1.9 }, { cx: 195, cy: 110, r: 1.4 },
  { cx: 310, cy: 180, r: 1.1 }, { cx: 140, cy: 250, r: 1.9 },
  { cx: 350, cy: 330, r: 1.4 }, { cx: 80, cy: 420, r: 1.6 },
  { cx: 250, cy: 480, r: 1.2 }, { cx: 180, cy: 560, r: 1.7 },
  { cx: 320, cy: 620, r: 1.4 }, { cx: 60, cy: 700, r: 1.6 },
  { cx: 230, cy: 760, r: 1.1 }, { cx: 370, cy: 820, r: 1.4 },
  { cx: 45, cy: 530, r: 1.4 }, { cx: 200, cy: 380, r: 1.6 },
];

/* Reduced from 18 sparkles to 8, 5% larger scale */
const SPARKLES = [
  { x: 145, y: 95, s: 0.37 }, { x: 310, y: 280, s: 0.58 },
  { x: 230, y: 430, s: 0.42 }, { x: 350, y: 550, s: 0.37 },
  { x: 100, y: 620, s: 0.53 }, { x: 270, y: 700, s: 0.37 },
  { x: 300, y: 400, s: 0.47 }, { x: 120, y: 500, s: 0.42 },
];

const SparklesSVG = memo(() => (
  <>
    {DOTS.map((s, i) => (
      <circle
        key={`d-${i}`}
        cx={s.cx}
        cy={s.cy}
        r={s.r}
        fill="#fff"
        className="bg-dot"
        style={{
          opacity: 0.45 + (i % 3) * 0.12,
          animationDuration: `${3 + i * 0.5}s`,
          animationDelay: `${i * 0.2}s`,
        }}
      />
    ))}
    {SPARKLES.map((sp, i) => (
      <g
        key={`s-${i}`}
        transform={`translate(${sp.x}, ${sp.y}) scale(${sp.s})`}
        className="bg-sparkle"
        style={{
          animationDuration: `${2.5 + i * 0.6}s`,
          animationDelay: `${i * 0.3}s`,
        }}
      >
        <path d="M12 0L14 10L24 12L14 14L12 24L10 14L0 12L10 10L12 0Z" fill="#fff" opacity="0.7" />
      </g>
    ))}
  </>
));
SparklesSVG.displayName = 'SparklesSVG';

const BackgroundSVG = memo(({ id, top, mid, bottom }: { id: string; top: string; mid: string; bottom: string }) => (
  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id={`${id}-grad`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={top} />
        <stop offset="50%" stopColor={mid} />
        <stop offset="100%" stopColor={bottom} />
      </linearGradient>
    </defs>
    <rect width="400" height="900" fill={`url(#${id}-grad)`} />
    <SparklesSVG />
  </svg>
));
BackgroundSVG.displayName = 'BackgroundSVG';

const GenderBackground = () => {
  const { gender } = useGender();
  return (
    <div className="absolute inset-0" style={{ contain: 'strict' }}>
      <div
        className="absolute inset-0"
        style={{
          opacity: gender === 'female' ? 1 : 0,
          transition: 'opacity 0.4s ease',
          willChange: 'opacity',
        }}
      >
        <BackgroundSVG id="fem" top="#FECCF2" mid="#DABDF8" bottom="#FDCBF0" />
      </div>
      <div
        className="absolute inset-0"
        style={{
          opacity: gender === 'male' ? 1 : 0,
          transition: 'opacity 0.4s ease',
          willChange: 'opacity',
        }}
      >
        <BackgroundSVG id="male" top="#C7E3FE" mid="#BDD1F8" bottom="#C7E3FE" />
      </div>
    </div>
  );
};

export default GenderBackground;
