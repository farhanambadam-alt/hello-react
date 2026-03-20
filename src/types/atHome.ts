export interface AtHomeArtist {
  id: string;
  name: string;
  avatar: string;
  specialty: string;
  rating: number;
  reviewCount: number;
  yearsExp: number;
  onTimePercent: number;
  distance: string;
  distanceKm: number;
  travelFee: number;
  minimumBooking: number;
  isAvailable: boolean;
  workPhotos: string[];
  services: AtHomeService[];
  beforeAfterPhotos: BeforeAfterPhoto[];
  videoThumbnail: string;
}

export interface AtHomeService {
  id: string;
  name: string;
  description: string;
  duration: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: 'bridal' | 'hair' | 'skin' | 'nails' | 'packages';
}

export interface BeforeAfterPhoto {
  id: string;
  before: string;
  after: string;
  service: string;
}

export interface AtHomeReview {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  text: string;
  service: string;
  date: string;
  helpful: number;
  beforePhoto?: string;
  afterPhoto?: string;
}

export interface EnvironmentCheck {
  id: string;
  label: string;
  description: string;
}
