import salon1 from '@/assets/salon-1.jpg';
import salon2 from '@/assets/salon-2.jpg';
import salon3 from '@/assets/salon-3.jpg';
import type { Salon, Service, Artist, Review, Booking, Category } from '@/types/salon';

export const categories: Category[] = [
  { id: 'm1', name: 'Haircut', image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=120&h=120&fit=crop', gender: 'male' },
  { id: 'm2', name: 'Beard Trim', image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=120&h=120&fit=crop', gender: 'male' },
  { id: 'm3', name: 'Hair Color', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=120&h=120&fit=crop', gender: 'male' },
  { id: 'm4', name: 'Facial', image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=120&h=120&fit=crop', gender: 'male' },
  { id: 'm5', name: 'Massage', image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=120&h=120&fit=crop', gender: 'male' },
  { id: 'm6', name: 'Spa', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbec6d?w=120&h=120&fit=crop', gender: 'male' },
  { id: 'f1', name: 'Hair Spa', image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=120&h=120&fit=crop', gender: 'female' },
  { id: 'f2', name: 'Bridal', image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=120&h=120&fit=crop', gender: 'female' },
  { id: 'f3', name: 'Manicure', image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=120&h=120&fit=crop', gender: 'female' },
  { id: 'f4', name: 'Pedicure', image: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=120&h=120&fit=crop', gender: 'female' },
  { id: 'f5', name: 'Skin Care', image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=120&h=120&fit=crop', gender: 'female' },
  { id: 'f6', name: 'Hair Color', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=120&h=120&fit=crop', gender: 'female' },
  { id: 'f7', name: 'Threading', image: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=120&h=120&fit=crop', gender: 'female' },
];

export const featuredSalons: Salon[] = [
  {
    id: '1',
    name: 'Luxe Hair Studio',
    image: salon1,
    rating: 4.8,
    reviewCount: 324,
    address: 'Koramangala, Bangalore',
    distance: '1.2 km',
    startingPrice: 499,
    isOpen: true,
    tags: ['Verified', 'AC', 'Trending'],
    offer: 'Flat 30% Off',
    bookingsThisWeek: 132,
    tagline: 'Where style meets luxury',
  },
  {
    id: '2',
    name: 'The Royal Salon',
    image: salon2,
    rating: 4.6,
    reviewCount: 218,
    address: 'Indiranagar, Bangalore',
    distance: '2.5 km',
    startingPrice: 399,
    isOpen: true,
    tags: ['Verified', 'AC'],
    offer: '20% Off First Visit',
    bookingsThisWeek: 98,
    tagline: 'Royalty in every strand',
  },
  {
    id: '3',
    name: 'Urban Glow',
    image: salon3,
    rating: 4.9,
    reviewCount: 456,
    address: 'HSR Layout, Bangalore',
    distance: '0.8 km',
    startingPrice: 599,
    isOpen: true,
    tags: ['Verified', 'AC', 'Premium'],
    offer: 'Buy 2 Get 1 Free',
    bookingsThisWeek: 187,
    tagline: 'Glow like never before',
  },
];

export const nearbySalons: Salon[] = [
  {
    id: '4',
    name: 'Bliss Beauty Lounge',
    image: 'https://images.unsplash.com/photo-1521590832167-7228fcaeb733?w=400&h=300&fit=crop',
    rating: 4.5,
    reviewCount: 156,
    address: 'JP Nagar',
    distance: '0.5 km',
    startingPrice: 299,
    isOpen: true,
    tags: ['Verified'],
  },
  {
    id: '5',
    name: 'Classy Cuts',
    image: 'https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=400&h=300&fit=crop',
    rating: 4.3,
    reviewCount: 89,
    address: 'BTM Layout',
    distance: '1.8 km',
    startingPrice: 249,
    isOpen: false,
    tags: ['AC'],
  },
  {
    id: '6',
    name: 'Shine Studio',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=300&fit=crop',
    rating: 4.7,
    reviewCount: 203,
    address: 'Whitefield',
    distance: '3.2 km',
    startingPrice: 449,
    isOpen: true,
    tags: ['Verified', 'Premium'],
  },
];

export const services: Service[] = [
  { id: '1', name: 'Haircut & Styling', duration: '45 min', price: 499, originalPrice: 699, category: 'men' },
  { id: '2', name: 'Beard Trim', duration: '20 min', price: 199, category: 'men' },
  { id: '3', name: 'Hair Color', duration: '90 min', price: 1499, originalPrice: 1999, category: 'men' },
  { id: '4', name: 'Facial', duration: '60 min', price: 899, originalPrice: 1199, category: 'men' },
  { id: '5', name: 'Hair Spa', duration: '45 min', price: 799, category: 'women' },
  { id: '6', name: 'Bridal Makeup', duration: '120 min', price: 4999, originalPrice: 6999, category: 'women' },
  { id: '7', name: 'Manicure & Pedicure', duration: '75 min', price: 999, category: 'women' },
  { id: '8', name: 'Threading', duration: '15 min', price: 99, category: 'women' },
  { id: '9', name: 'Groom Package', duration: '180 min', price: 2999, originalPrice: 4499, category: 'packages' },
  { id: '10', name: 'Bridal Package', duration: '240 min', price: 8999, originalPrice: 12999, category: 'packages' },
];

export const artists: Artist[] = [
  { id: '1', name: 'Priya S.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', specialty: 'Hair Stylist' },
  { id: '2', name: 'Rahul K.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', specialty: 'Colorist' },
  { id: '3', name: 'Anita M.', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop', specialty: 'Makeup Artist' },
  { id: '4', name: 'Vikram R.', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop', specialty: 'Barber' },
  { id: '5', name: 'Deepa L.', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop', specialty: 'Skin Care' },
  { id: '6', name: 'Karan T.', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', specialty: 'Hair Stylist' },
  { id: '7', name: 'Neha G.', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop', specialty: 'Nail Artist' },
  { id: '8', name: 'Arjun P.', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop', specialty: 'Colorist' },
];

export const reviews: Review[] = [
  { id: '1', userName: 'Sneha P.', userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=60&h=60&fit=crop', rating: 5, text: 'Amazing experience! Priya did an incredible job with my hair. The salon ambiance is top notch.', service: 'Hair Spa', date: '2 days ago', artistId: '1', helpful: 12 },
  { id: '2', userName: 'Amit V.', userAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=60&h=60&fit=crop', rating: 4, text: 'Great haircut by Vikram. Clean salon, good service. Slightly long wait though.', service: 'Haircut & Styling', date: '1 week ago', artistId: '4', helpful: 8, hasPhoto: true },
  { id: '3', userName: 'Meera K.', userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&h=60&fit=crop', rating: 5, text: 'Anita is the best makeup artist! My bridal look was absolutely stunning. Highly recommended!', service: 'Bridal Makeup', date: '3 days ago', artistId: '3', helpful: 24 },
  { id: '4', userName: 'Rohan S.', userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&h=60&fit=crop', rating: 4, text: 'Good color work by Rahul. Very professional and knowledgeable about trends.', service: 'Hair Color', date: '5 days ago', artistId: '2', helpful: 6 },
  { id: '5', userName: 'Kavya R.', userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=60&h=60&fit=crop', rating: 5, text: 'Wonderful service! Will definitely come back again.', service: 'Facial', date: '1 day ago', helpful: 3 },
  { id: '6', userName: 'Pooja M.', userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&h=60&fit=crop', rating: 5, text: 'Deepa is fantastic with facials. My skin has never looked better!', service: 'Skin Care', date: '4 days ago', artistId: '5', helpful: 15 },
  { id: '7', userName: 'Suresh N.', userAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=60&h=60&fit=crop', rating: 4, text: 'Karan gave me a great haircut. Very attentive to what I wanted.', service: 'Haircut & Styling', date: '6 days ago', artistId: '6', helpful: 9, hasPhoto: true },
  { id: '8', userName: 'Divya S.', userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&h=60&fit=crop', rating: 5, text: 'Neha did the most beautiful nail art! Absolutely loved it.', service: 'Manicure & Pedicure', date: '2 days ago', artistId: '7', helpful: 18 },
  { id: '9', userName: 'Rakesh V.', userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&h=60&fit=crop', rating: 4, text: 'Arjun knows his colors well. Perfect highlights every time.', service: 'Hair Color', date: '1 week ago', artistId: '8', helpful: 7 },
  { id: '10', userName: 'Sanya T.', userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=60&h=60&fit=crop', rating: 5, text: 'Best salon experience ever. Priya is a magician with hair!', service: 'Hair Spa', date: '3 days ago', artistId: '1', helpful: 22 },
];

export const bookings: Booking[] = [
  { id: '1', salonName: 'Luxe Hair Studio', salonImage: salon1, services: ['Haircut & Styling', 'Beard Trim'], date: 'Mar 5, 2026', time: '10:30 AM', status: 'upcoming', totalPrice: 698 },
  { id: '2', salonName: 'Urban Glow', salonImage: salon3, services: ['Hair Spa'], date: 'Feb 20, 2026', time: '2:00 PM', status: 'completed', totalPrice: 799 },
  { id: '3', salonName: 'The Royal Salon', salonImage: salon2, services: ['Facial', 'Hair Color'], date: 'Feb 10, 2026', time: '11:00 AM', status: 'cancelled', totalPrice: 2398 },
];
