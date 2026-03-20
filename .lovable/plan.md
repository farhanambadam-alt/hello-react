

## Add Jelly Animation to Active Stylist Avatar

### What
Apply a lightweight jello-bounce animation to the stylist avatar when it becomes the active selection — visually matching the `jelly-container` animation already used on the reviews card.

### How

**1. New keyframe in `src/index.css`** — `jelly-avatar`
- A smaller, faster variant of the existing `jelly` keyframe using only `scale()` transforms (GPU-composited, no layout/paint cost).
- Duration ~0.45s, subtler amplitude than the container version.

```css
@keyframes jelly-avatar {
  0%   { transform: scale(1); }
  20%  { transform: scale(1.15, 0.88); }
  40%  { transform: scale(0.92, 1.08); }
  55%  { transform: scale(1.05, 0.96); }
  70%  { transform: scale(0.98, 1.02); }
  85%  { transform: scale(1.01, 0.99); }
  100% { transform: scale(1); }
}
```

**2. `src/components/ReviewsSection.tsx`**
- Track a `jiggleAvatarId` state (`string | null`) that gets set on every artist tap.
- Clear it after ~450ms via `setTimeout`.
- Apply `style={{ animation: 'jelly-avatar 0.45s ease' }}` to the avatar `<div>` when its id matches `jiggleAvatarId` (or `'all'` for the ALL button).
- No filters, no blur, no box-shadow animations — pure transform only.

