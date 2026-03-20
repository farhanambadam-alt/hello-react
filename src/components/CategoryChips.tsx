import { memo } from 'react';
import type { Category } from '@/types/salon';

interface CategoryChipsProps {
  categories: Category[];
  selected: string | null;
  onSelect: (id: string) => void;
}

const CategoryChips = memo(({ categories, selected, onSelect }: CategoryChipsProps) => {
  return (
    <div className="flex gap-5 overflow-x-auto px-5 py-2 scrollbar-hide" style={{ contain: 'layout style' }}>
      {categories.map((cat) => {
        const isActive = selected === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className="flex flex-col items-center gap-2 flex-shrink-0"
          >
            <div
              className={`w-[62px] h-[62px] rounded-full overflow-hidden ${
                isActive
                  ? 'ring-2 ring-primary ring-offset-2 ring-offset-background scale-105'
                  : 'ring-1 ring-border'
              }`}
              style={{ transition: 'transform 0.2s ease, box-shadow 0.2s ease' }}
            >
              <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" loading="lazy" decoding="async" width={62} height={62} />
            </div>
            <span className={`text-[11px] font-heading font-medium whitespace-nowrap ${
              isActive ? 'text-primary' : 'text-muted-foreground'
            }`} style={{ transition: 'color 0.2s ease' }}>
              {cat.name}
            </span>
          </button>
        );
      })}
    </div>
  );
});
CategoryChips.displayName = 'CategoryChips';

export default CategoryChips;
