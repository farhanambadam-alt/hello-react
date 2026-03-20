import { MapPin, Search, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';

interface LocationPickerDrawerProps {
  open: boolean;
  onClose: () => void;
}

const cities = [
  { name: 'Bangalore', areas: ['Koramangala', 'Indiranagar', 'HSR Layout', 'Whitefield', 'JP Nagar'] },
  { name: 'Mumbai', areas: ['Bandra', 'Andheri', 'Juhu', 'Powai'] },
  { name: 'Delhi', areas: ['Connaught Place', 'Hauz Khas', 'Saket'] },
  { name: 'Hyderabad', areas: ['Banjara Hills', 'Jubilee Hills', 'Madhapur'] },
];

const LocationPickerDrawer = ({ open, onClose }: LocationPickerDrawerProps) => {
  const [search, setSearch] = useState('');

  const filtered = cities.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.areas.some((a) => a.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <Drawer open={open} onOpenChange={(o) => !o && onClose()}>
      <DrawerContent className="max-h-[80vh]">
        <DrawerHeader className="text-center pb-2">
          <DrawerTitle className="font-heading text-lg">Select Location</DrawerTitle>
        </DrawerHeader>
        <div className="px-5 pb-6">
          {/* Search */}
          <div className="flex items-center gap-2.5 bg-secondary border border-border rounded-2xl px-4 py-3 mb-4">
            <Search size={16} className="text-muted-foreground flex-shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search city or area..."
              className="flex-1 bg-transparent text-[14px] font-body text-foreground placeholder:text-muted-foreground outline-none"
            />
          </div>

          {/* Use current location */}
          <button className="w-full flex items-center gap-3 p-3 mb-4 rounded-2xl bg-primary/5 border border-primary/15 active:scale-[0.98] transition-transform min-h-[48px]">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <MapPin size={18} className="text-primary" />
            </div>
            <span className="font-heading font-semibold text-[14px] text-primary">Use Current Location</span>
          </button>

          {/* City list */}
          <div className="space-y-2">
            {filtered.map((city) => (
              <button
                key={city.name}
                onClick={onClose}
                className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-card border border-border active:scale-[0.98] transition-transform min-h-[48px]"
              >
                <MapPin size={16} className="text-muted-foreground flex-shrink-0" />
                <div className="flex-1 text-left">
                  <p className="font-heading font-medium text-[14px] text-foreground">{city.name}</p>
                  <p className="text-[11px] font-body text-muted-foreground mt-0.5">{city.areas.join(', ')}</p>
                </div>
                <ChevronRight size={16} className="text-muted-foreground" />
              </button>
            ))}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default LocationPickerDrawer;
