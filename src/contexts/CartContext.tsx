import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { services } from '@/data/mockData';
import type { Salon } from '@/types/salon';

interface CartItem {
  serviceId: string;
  quantity: number;
}

interface CartContextType {
  salon: Salon | null;
  items: CartItem[];
  cartCount: number;
  cartTotal: number;
  addToCart: (serviceId: string, salon: Salon) => void;
  removeFromCart: (serviceId: string) => void;
  clearCart: () => void;
  /** Returns true if added, false if switch modal should show */
  tryAddToCart: (serviceId: string, salon: Salon) => boolean;
  /** Pending add info when switch modal is open */
  pendingAdd: { serviceId: string; salon: Salon } | null;
  confirmSwitch: () => void;
  cancelSwitch: () => void;
  showSwitchModal: boolean;
}

const CartContext = createContext<CartContextType>({
  salon: null,
  items: [],
  cartCount: 0,
  cartTotal: 0,
  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
  tryAddToCart: () => true,
  pendingAdd: null,
  confirmSwitch: () => {},
  cancelSwitch: () => {},
  showSwitchModal: false,
});

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [salon, setSalon] = useState<Salon | null>(null);
  const [items, setItems] = useState<CartItem[]>([]);
  const [pendingAdd, setPendingAdd] = useState<{ serviceId: string; salon: Salon } | null>(null);
  const [showSwitchModal, setShowSwitchModal] = useState(false);

  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = items.reduce((total, item) => {
    const svc = services.find((s) => s.id === item.serviceId);
    return total + (svc?.price || 0) * item.quantity;
  }, 0);

  const addToCart = useCallback((serviceId: string, newSalon: Salon) => {
    setSalon(newSalon);
    setItems((prev) => {
      const existing = prev.find((i) => i.serviceId === serviceId);
      if (existing) {
        return prev.map((i) =>
          i.serviceId === serviceId ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { serviceId, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((serviceId: string) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.serviceId === serviceId);
      if (!existing) return prev;
      if (existing.quantity > 1) {
        return prev.map((i) =>
          i.serviceId === serviceId ? { ...i, quantity: i.quantity - 1 } : i
        );
      }
      const next = prev.filter((i) => i.serviceId !== serviceId);
      if (next.length === 0) setSalon(null);
      return next;
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setSalon(null);
  }, []);

  const tryAddToCart = useCallback(
    (serviceId: string, newSalon: Salon): boolean => {
      if (!salon || salon.id === newSalon.id) {
        addToCart(serviceId, newSalon);
        return true;
      }
      // Different salon — show switch modal
      setPendingAdd({ serviceId, salon: newSalon });
      setShowSwitchModal(true);
      return false;
    },
    [salon, addToCart]
  );

  const confirmSwitch = useCallback(() => {
    if (pendingAdd) {
      setItems([{ serviceId: pendingAdd.serviceId, quantity: 1 }]);
      setSalon(pendingAdd.salon);
    }
    setPendingAdd(null);
    setShowSwitchModal(false);
  }, [pendingAdd]);

  const cancelSwitch = useCallback(() => {
    setPendingAdd(null);
    setShowSwitchModal(false);
  }, []);

  return (
    <CartContext.Provider
      value={{
        salon,
        items,
        cartCount,
        cartTotal,
        addToCart,
        removeFromCart,
        clearCart,
        tryAddToCart,
        pendingAdd,
        confirmSwitch,
        cancelSwitch,
        showSwitchModal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
