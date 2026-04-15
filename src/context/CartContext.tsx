import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CartItem, MenuItem } from '../types';

interface CartContextType {
  items: CartItem[];
  totalAmount: number;
  itemCount: number;
  restaurantId: string | null;
  restaurantName: string | null;
  addItem: (menuItem: MenuItem, restaurantId: string, restaurantName: string) => boolean;
  removeItem: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, delta: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [restaurantName, setRestaurantName] = useState<string | null>(null);

  const totalAmount = items.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const clearCart = () => {
    setItems([]);
    setRestaurantId(null);
    setRestaurantName(null);
  };

  const addItem = (menuItem: MenuItem, resId: string, resName: string) => {
    if (restaurantId && restaurantId !== resId) {
      return false; // Indica que pertenece a otro restaurante
    }

    if (!restaurantId) {
      setRestaurantId(resId);
      setRestaurantName(resName);
    }

    setItems(current => {
      const existing = current.find(i => i.menuItem.id === menuItem.id);
      if (existing) {
        return current.map(i => 
          i.menuItem.id === menuItem.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...current, { menuItem, quantity: 1, restaurantId: resId, restaurantName: resName }];
    });
    return true;
  };

  const removeItem = (menuItemId: string) => {
    setItems(current => {
      const updated = current.filter(i => i.menuItem.id !== menuItemId);
      if (updated.length === 0) {
        setRestaurantId(null);
        setRestaurantName(null);
      }
      return updated;
    });
  };

  const updateQuantity = (menuItemId: string, delta: number) => {
    setItems(current => {
      const updated = current.map(i => {
        if (i.menuItem.id === menuItemId) {
          const newQ = i.quantity + delta;
          return { ...i, quantity: newQ > 0 ? newQ : 0 };
        }
        return i;
      }).filter(i => i.quantity > 0);
      
      if (updated.length === 0) {
        setRestaurantId(null);
        setRestaurantName(null);
      }
      return updated;
    });
  };

  return (
    <CartContext.Provider value={{
      items, totalAmount, itemCount, restaurantId, restaurantName,
      addItem, removeItem, updateQuantity, clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
