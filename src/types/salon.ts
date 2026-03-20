export interface Salon {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviewCount: number;
  address: string;
  distance: string;
  startingPrice: number;
  isOpen: boolean;
  tags: string[];
  offer?: string;
  bookingsThisWeek?: number;
  tagline?: string;
}

export interface Service {
  id: string;
  name: string;
  duration: string;
  price: number;
  originalPrice?: number;
  category: 'men' | 'women' | 'packages';
}

export interface Artist {
  id: string;
  name: string;
  avatar: string;
  specialty: string;
}

export interface Review {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  text: string;
  service: string;
  date: string;
  artistId?: string;
  helpful: number;
  hasPhoto?: boolean;
}

export interface Booking {
  id: string;
  salonName: string;
  salonImage: string;
  services: string[];
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  totalPrice: number;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  gender?: 'male' | 'female' | 'all';
}
