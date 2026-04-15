import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Order, CartItem } from '../types';

interface OrderContextType {
  orders: Order[];
  placeOrder: (restaurantId: string, restaurantName: string, items: CartItem[], total: number, estimatedMinutes: number) => string;
  getOrderById: (id: string) => Order | undefined;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  // Efecto que progresa el estado de las órdenes para demostración.
  // Realiza el cambio más rápido que los minutos reales para la demo.
  useEffect(() => {
    const interval = setInterval(() => {
      setOrders(current => current.map(order => {
        if (order.status === 'delivered') return order;

        const timeElapsedSec = (new Date().getTime() - order.createdAt.getTime()) / 1000;
        
        if (order.status === 'preparing' && timeElapsedSec > 10) { // 10 segundos para preparar
          return { ...order, status: 'on_the_way' as const };
        } else if (order.status === 'on_the_way' && timeElapsedSec > 25) { // 25 segs = entregado
          return { ...order, status: 'delivered' as const };
        }

        return order;
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const placeOrder = (restaurantId: string, restaurantName: string, items: CartItem[], total: number, estimatedMinutes: number) => {
    const id = `ord-${Math.random().toString(36).substr(2, 9)}`;
    
    const d = new Date();
    d.setMinutes(d.getMinutes() + estimatedMinutes);
    const estimatedDeliveryTimeStr = `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;

    const newOrder: Order = {
      id,
      restaurantId,
      restaurantName,
      items,
      total,
      status: 'preparing',
      estimatedDelivery: estimatedDeliveryTimeStr,
      createdAt: new Date(),
    };

    setOrders(prev => [newOrder, ...prev]);
    return id;
  };

  const getOrderById = (id: string) => {
    return orders.find(o => o.id === id);
  };

  return (
    <OrderContext.Provider value={{ orders, placeOrder, getOrderById }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};
