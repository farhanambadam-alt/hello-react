import { featuredSalons, nearbySalons } from '@/data/mockData';

/**
 * Hook placeholder for salon data fetching.
 * Currently returns mock data synchronously.
 * Will be replaced with real API calls via useSWR/react-query.
 */
export const useSalons = () => {
  return {
    featuredSalons,
    nearbySalons,
    allSalons: [...featuredSalons, ...nearbySalons],
    isLoading: false,
    error: null,
  };
};

export const useSalonById = (id: string | undefined) => {
  const salon = [...featuredSalons, ...nearbySalons].find((s) => s.id === id);
  return {
    salon: salon ?? null,
    isLoading: false,
    error: salon ? null : 'Salon not found',
  };
};
