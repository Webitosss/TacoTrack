import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Restaurant } from '../types';
import { restaurants as initialRestaurants } from '../data/mockData';

interface DemandContextType {
  restaurants: Restaurant[];
  getRestaurantById: (id: string) => Restaurant | undefined;
}

const DemandContext = createContext<DemandContextType | undefined>(undefined);

export const DemandProvider = ({ children }: { children: ReactNode }) => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>(initialRestaurants);

  useEffect(() => {
    // Simula las fluctuaciones de demanda cada 8 segundos
    const intervalId = setInterval(() => {
      setRestaurants((current) => 
        current.map(restaurant => {
          // Fluctuación de -2 a +3 pedidos
          const fluctuation = Math.floor(Math.random() * 6) - 2;
          let newOrders = restaurant.currentOrders + fluctuation;
          
          if (newOrders < 0) newOrders = 0;
          if (newOrders > restaurant.maxCapacity) newOrders = restaurant.maxCapacity;

          // Recalcular nivel de saturación
          const saturationRatio = newOrders / restaurant.maxCapacity;
          let newLevel: Restaurant['saturationLevel'] = 'low';
          if (saturationRatio >= 0.85) newLevel = 'critical';
          else if (saturationRatio >= 0.6) newLevel = 'high';
          else if (saturationRatio >= 0.3) newLevel = 'medium';

          // Recalcular wait time
          const baseWaitTime = parseInt(restaurant.deliveryTime.split('-')[0]) || 15;
          const waitTimeVariance = Math.floor(saturationRatio * 30);
          const newWaitTime = baseWaitTime + waitTimeVariance;

          return {
            ...restaurant,
            currentOrders: newOrders,
            saturationLevel: newLevel,
            estimatedWaitMinutes: newWaitTime,
            // Cambiar trending ligeramente si hay gran demanda
            trending: restaurant.ordersLastHour > 40 || saturationRatio > 0.7
          };
        })
      );
    }, 8000);

    return () => clearInterval(intervalId);
  }, []);

  const getRestaurantById = (id: string) => {
    return restaurants.find((r) => r.id === id);
  };

  return (
    <DemandContext.Provider value={{ restaurants, getRestaurantById }}>
      {children}
    </DemandContext.Provider>
  );
};

export const useDemand = () => {
  const context = useContext(DemandContext);
  if (context === undefined) {
    throw new Error('useDemand must be used within a DemandProvider');
  }
  return context;
};
