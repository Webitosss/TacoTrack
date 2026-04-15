# TacoTrack — Servicio de Pedidos a Domicilio con Monitoreo en Tiempo Real

## Contexto

El proyecto actual es una app Expo/React Native (recién migrada a TypeScript) con una única pantalla (`HomeScreen`) que muestra una lista estática de taquerías. No hay navegación, no hay tipado TS real, no hay lógica de pedidos ni monitoreo de demanda.

El objetivo es transformarla en un **servicio digital de pedidos a domicilio especializado en taquerías**, con:
- Navegación completa entre pantallas
- Menús de tacos por taquería con carrito de compras
- Monitoreo en tiempo real de demanda y saturación
- Tiempos estimados dinámicos de espera
- Filtros inteligentes: más rápida vs. más popular

## Decisiones de Diseño

> [!IMPORTANT]
> **Sin backend real**: Toda la lógica de "tiempo real" se simulará en el frontend con `setInterval` y datos mock que fluctúan. Esto permite tener un prototipo funcional completo sin infraestructura de servidor.

> [!IMPORTANT]
> **Navegación**: Se usará `expo-router` (file-based routing) o `@react-navigation/native` + `@react-navigation/native-stack`. **¿Cuál prefieres?** Si no tienes preferencia, usaré `@react-navigation/native-stack` por simplicidad y compatibilidad con Expo SDK 55.

> [!IMPORTANT]
> **Estado global**: Se usará React Context + `useReducer` para el carrito de compras y el estado de demanda en tiempo real. No se necesita Redux ni Zustand para este alcance.

---

## Propuestas de Cambio

### 1. Sistema de Tipos TypeScript

Crear interfaces y tipos centralizados para todo el modelo de datos de la aplicación.

#### [NEW] [types.ts](file:///c:/Users/bryan/OneDrive/Escritorio/TacoTrack/src/types.ts)

Definir todas las interfaces del dominio:

```typescript
// Modelo de una taquería
interface Restaurant {
  id: string;
  name: string;
  emoji: string;
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
interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  emoji: string;
  category: string;
  isPopular: boolean;
  isAvailable: boolean;
}

// Item en el carrito
interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  restaurantId: string;
  restaurantName: string;
}

// Un pedido realizado
interface Order {
  id: string;
  restaurantId: string;
  restaurantName: string;
  items: CartItem[];
  total: number;
  status: 'preparing' | 'on_the_way' | 'delivered';
  estimatedDelivery: string;
  createdAt: Date;
}
```

---

### 2. Datos Mock Enriquecidos

#### [MODIFY] [mockData.ts](file:///c:/Users/bryan/OneDrive/Escritorio/TacoTrack/src/data/mockData.ts)

- Agregar campos de demanda en tiempo real a cada restaurante (`currentOrders`, `maxCapacity`, `saturationLevel`, `estimatedWaitMinutes`, `trending`, `ordersLastHour`)
- Agregar un array `menuItems` por cada restaurante con tacos, precios y categorías
- Agregar una función de utilidad `getMenuForRestaurant(id: string): MenuItem[]`

---

### 3. Colores y Tema Expandidos

#### [MODIFY] [colors.ts](file:///c:/Users/bryan/OneDrive/Escritorio/TacoTrack/src/constants/colors.ts)

Agregar colores semánticos para los niveles de saturación:

| Nuevo color | Uso |
|---|---|
| `saturationLow` | Verde — poca demanda |
| `saturationMedium` | Amarillo — demanda moderada |
| `saturationHigh` | Naranja — alta demanda |
| `saturationCritical` | Rojo — saturada |
| `trending` | Gradiente dorado para "en tendencia" |
| `cardBorder` | Bordes sutiles para cards |

---

### 4. Dependencias Nuevas

```bash
npm install @react-navigation/native @react-navigation/native-stack react-native-screens react-native-safe-area-context
```

> [!NOTE]
> Todas estas librerías son compatibles con Expo SDK 55 y no requieren prebuild nativo.

---

### 5. Contextos de Estado Global

#### [NEW] [CartContext.tsx](file:///c:/Users/bryan/OneDrive/Escritorio/TacoTrack/src/context/CartContext.tsx)

- Provider + hook `useCart()`
- Acciones: `addItem`, `removeItem`, `updateQuantity`, `clearCart`
- Validación: no permitir items de múltiples restaurantes a la vez (o preguntar si desea vaciar)

#### [NEW] [DemandContext.tsx](file:///c:/Users/bryan/OneDrive/Escritorio/TacoTrack/src/context/DemandContext.tsx)

- Provider + hook `useDemand()`
- Ejecuta un `setInterval` cada 5-8 segundos que simula fluctuaciones de demanda:
  - `currentOrders` varía ±1-3
  - `estimatedWaitMinutes` se recalcula con: `baseTime + (currentOrders / maxCapacity) * 15`
  - `saturationLevel` se asigna según `currentOrders / maxCapacity`
  - `trending` se activa si `ordersLastHour > umbral`
- Expone `restaurants` con datos de demanda actualizados

#### [NEW] [OrderContext.tsx](file:///c:/Users/bryan/OneDrive/Escritorio/TacoTrack/src/context/OrderContext.tsx)

- Provider + hook `useOrders()`
- Acciones: `placeOrder`, `getOrders`
- Los pedidos se simulan progresando de `preparing` → `on_the_way` → `delivered` con timers

---

### 6. Navegación y Pantallas

#### [MODIFY] [App.tsx](file:///c:/Users/bryan/OneDrive/Escritorio/TacoTrack/App.tsx)

- Configurar `NavigationContainer` + `Stack.Navigator`
- Envolver todo en los Providers: `DemandProvider` > `CartProvider` > `OrderProvider`
- Pantallas del stack:
  - `Home` — pantalla principal (lista de taquerías)
  - `RestaurantDetail` — detalle de taquería + menú
  - `Cart` — carrito de compras
  - `OrderTracking` — seguimiento de pedido activo
  - `Orders` — historial de pedidos

#### [MODIFY] [HomeScreen.tsx](file:///c:/Users/bryan/OneDrive/Escritorio/TacoTrack/src/screens/HomeScreen.tsx)

Cambios:
- Consumir `useDemand()` para obtener restaurantes con datos en tiempo real
- Agregar barra de filtros: **"Más Rápida"** | **"Más Popular"** | **"Menor Saturación"**
- Agregar sección "🔥 En Tendencia Ahora" arriba de la lista principal
- Pasar `navigation` a `RestaurantCard` para navegar al detalle

#### [NEW] [RestaurantDetailScreen.tsx](file:///c:/Users/bryan/OneDrive/Escritorio/TacoTrack/src/screens/RestaurantDetailScreen.tsx)

- Header con info de la taquería + indicador de saturación grande
- Barra de demanda visual (progress bar coloreada según saturación)
- Estadísticas en tiempo real: pedidos activos, tiempo de espera, pedidos/hora
- Menú de tacos organizado por categoría (FlatList con SectionList o headers)
- Botón "+" para agregar al carrito con animación
- Botón flotante "Ver Carrito" con badge de cantidad

#### [NEW] [CartScreen.tsx](file:///c:/Users/bryan/OneDrive/Escritorio/TacoTrack/src/screens/CartScreen.tsx)

- Lista de items con controles de cantidad (+/-)
- Resumen: subtotal, envío, total
- Tiempo estimado de entrega (basado en `estimatedWaitMinutes` del restaurante)
- Botón "Confirmar Pedido"
- Vaciar carrito

#### [NEW] [OrderTrackingScreen.tsx](file:///c:/Users/bryan/OneDrive/Escritorio/TacoTrack/src/screens/OrderTrackingScreen.tsx)

- Timeline visual del estado: Preparando → En camino → Entregado
- Tiempo estimado restante (countdown)
- Info del restaurante y resumen del pedido
- Animaciones de progreso

#### [NEW] [OrdersScreen.tsx](file:///c:/Users/bryan/OneDrive/Escritorio/TacoTrack/src/screens/OrdersScreen.tsx)

- Historial de pedidos anteriores con estado
- Cards con resumen de cada pedido
- Accesible desde la bottom nav (tab "Pedidos")

---

### 7. Componentes Actualizados y Nuevos

#### [MODIFY] [RestaurantCard.tsx](file:///c:/Users/bryan/OneDrive/Escritorio/TacoTrack/src/components/RestaurantCard.tsx)

Agregar:
- **Indicador de saturación**: Barra de color + texto ("Baja demanda", "Alta demanda", etc.)
- **Tiempo de espera real**: Mostrar `estimatedWaitMinutes` en lugar del rango estático
- **Badge "🔥 Trending"** si está en tendencia
- **Pedidos activos**: Texto sutil "12 pedidos en curso"
- Props tipados con la interfaz `Restaurant`
- `onPress` para navegar al detalle

#### [MODIFY] [BottomNavBar.tsx](file:///c:/Users/bryan/OneDrive/Escritorio/TacoTrack/src/components/BottomNavBar.tsx)

- Recibir `navigation` como prop
- Navegar a las pantallas correspondientes al tocar cada tab
- Badge en "Pedidos" con número de pedidos activos (desde `useOrders()`)

#### [NEW] [SaturationBar.tsx](file:///c:/Users/bryan/OneDrive/Escritorio/TacoTrack/src/components/SaturationBar.tsx)

- Barra horizontal que muestra la saturación de una taquería
- Color dinámico: verde → amarillo → naranja → rojo
- Ancho animado proporcional a `currentOrders / maxCapacity`
- Texto: "Baja", "Moderada", "Alta", "Saturada"

#### [NEW] [FilterBar.tsx](file:///c:/Users/bryan/OneDrive/Escritorio/TacoTrack/src/components/FilterBar.tsx)

- Chips horizontales: "⚡ Más Rápida" | "🔥 Más Popular" | "✅ Menor Saturación" | "💰 Envío Gratis"
- Selección activa con color primario
- Emite callback `onFilterChange(filter: FilterType)`

#### [NEW] [TrendingSection.tsx](file:///c:/Users/bryan/OneDrive/Escritorio/TacoTrack/src/components/TrendingSection.tsx)

- Scroll horizontal con las taquerías marcadas como `trending`
- Cards compactas con nombre, emoji, tiempo de espera, y badge animado "🔥"
- Pulsación lleva al detalle

#### [NEW] [MenuItemCard.tsx](file:///c:/Users/bryan/OneDrive/Escritorio/TacoTrack/src/components/MenuItemCard.tsx)

- Card para un item del menú (taco)
- Muestra: emoji, nombre, descripción, precio, badge "Popular"
- Botón "+" para agregar al carrito
- Controles de cantidad si ya está en el carrito

#### [NEW] [OrderTimeline.tsx](file:///c:/Users/bryan/OneDrive/Escritorio/TacoTrack/src/components/OrderTimeline.tsx)

- Timeline vertical con 3 pasos: Preparando → En camino → Entregado
- Paso activo destacado con color y animación de pulso
- Muestra timestamp de cada paso completado

#### [NEW] [CartBadge.tsx](file:///c:/Users/bryan/OneDrive/Escritorio/TacoTrack/src/components/CartBadge.tsx)

- Botón flotante "Ver Carrito (3) — $150"
- Aparece cuando hay items en el carrito (animación slide-up)
- Se muestra en `RestaurantDetailScreen`

---

### 8. Tipar Componentes Existentes

Todos los componentes `.tsx` existentes que usan `any` implícito se tiparán con las interfaces de `types.ts`:
- `RestaurantCard`: props `{ restaurant: Restaurant; onPress: () => void }`
- `RestaurantList`: props `{ restaurants: Restaurant[]; onRestaurantPress: (id: string) => void }`
- `PromoBanner`: tipar `handleScroll` con `NativeSyntheticEvent<NativeScrollEvent>`
- `Header`: agregar prop `onSearchChange?: (text: string) => void`

---

## Estructura Final del Proyecto

```
src/
├── types.ts                          # Interfaces y tipos centralizados
├── constants/
│   └── colors.ts                     # Paleta expandida con colores de saturación
├── context/
│   ├── CartContext.tsx                # Estado global del carrito
│   ├── DemandContext.tsx              # Simulación de demanda en tiempo real
│   └── OrderContext.tsx               # Gestión de pedidos
├── data/
│   └── mockData.ts                   # Datos mock enriquecidos con menús y demanda
├── components/
│   ├── Header.tsx                    # [MOD] Tipado + callback de búsqueda
│   ├── PromoBanner.tsx               # [MOD] Tipado de eventos
│   ├── Categories.tsx                # [MOD] Tipado
│   ├── RestaurantCard.tsx            # [MOD] Indicador de saturación + trending
│   ├── RestaurantList.tsx            # [MOD] Props tipados + onPress
│   ├── BottomNavBar.tsx              # [MOD] Navegación real + badge de pedidos
│   ├── SaturationBar.tsx             # [NEW] Barra de saturación visual
│   ├── FilterBar.tsx                 # [NEW] Filtros inteligentes
│   ├── TrendingSection.tsx           # [NEW] Sección "En Tendencia"
│   ├── MenuItemCard.tsx              # [NEW] Card de taco del menú
│   ├── OrderTimeline.tsx             # [NEW] Timeline de estado de pedido
│   └── CartBadge.tsx                 # [NEW] Botón flotante del carrito
├── screens/
│   ├── HomeScreen.tsx                # [MOD] Filtros + trending + datos en tiempo real
│   ├── RestaurantDetailScreen.tsx    # [NEW] Detalle + menú + saturación
│   ├── CartScreen.tsx                # [NEW] Carrito de compras
│   ├── OrderTrackingScreen.tsx       # [NEW] Seguimiento de pedido
│   └── OrdersScreen.tsx              # [NEW] Historial de pedidos
```

---

## Open Questions

> [!IMPORTANT]
> **1. Navegación**: ¿Prefieres `@react-navigation/native-stack` (navegación clásica imperativa) o `expo-router` (file-based routing como Next.js)? Recomiendo la primera por ser más explícita y compatible directamente con tu setup actual.

> [!IMPORTANT]
> **2. Multi-restaurante en carrito**: ¿Quieres permitir items de diferentes restaurantes en el mismo carrito, o forzar un solo restaurante a la vez (como lo hace Uber Eats)?

> [!NOTE]
> **3. Alcance de la primera versión**: Este plan cubre TODAS las funcionalidades que mencionaste. Si prefieres ir por fases, puedo dividirlo en:
> - **Fase 1**: Tipado TS + navegación + demanda en tiempo real + filtros
> - **Fase 2**: Menú de tacos + carrito + confirmación de pedido
> - **Fase 3**: Seguimiento de pedido + historial

---

## Plan de Verificación

### Tests Automatizados
- `npx tsc --noEmit` para verificar que todo el tipado TypeScript compila sin errores
- `npx expo start --web` para verificar que la app se renderiza correctamente

### Verificación Manual
- Navegar entre todas las pantallas sin crashes
- Verificar que los datos de demanda fluctúan cada 5-8 segundos visualmente
- Agregar items al carrito y confirmar un pedido
- Verificar que los filtros reordenan la lista correctamente
- Verificar que el timeline de pedido progresa automáticamente
