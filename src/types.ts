// Modelo de una taquería
export interface Restaurant {
  id: string;
  name: string;
  icon: any;
  rating: number;
  reviewCount: number;
  deliveryTime: string;          // rango base, e.g. "15-25"
  deliveryFee: string;
  distance: string;
  priceRange: string;
  tags: string[];
  isPromo: boolean;
  promoText: string | null;
  isFavorite: boolean;
  // --- Nuevos campos de demanda en tiempo real ---
  currentOrders: number;         // pedidos activos ahora
  maxCapacity: number;           // capacidad máxima simultánea
  saturationLevel: 'low' | 'medium' | 'high' | 'critical';
  estimatedWaitMinutes: number;  // tiempo de espera real calculado
  trending: boolean;             // si está en tendencia
  ordersLastHour: number;        // pedidos en la última hora
}

// Un taco del menú
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: any;
  category: string;
  isPopular: boolean;
  isAvailable: boolean;
}

// Item en el carrito
export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  restaurantId: string;
  restaurantName: string;
}

// Un pedido realizado
export interface Order {
  id: string;
  restaurantId: string;
  restaurantName: string;
  items: CartItem[];
  total: number;
  status: 'preparing' | 'on_the_way' | 'delivered';
  estimatedDelivery: string;
  createdAt: Date;
}
