import { Stack } from 'expo-router';
import { DemandProvider } from '../src/context/DemandContext';
import { CartProvider } from '../src/context/CartContext';
import { OrderProvider } from '../src/context/OrderContext';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <DemandProvider>
      <CartProvider>
        <OrderProvider>
          <StatusBar style="dark" />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="restaurant/[id]" options={{ presentation: 'card' }} />
            <Stack.Screen name="cart" options={{ presentation: 'modal' }} />
            <Stack.Screen name="order-tracking/[id]" options={{ presentation: 'modal' }} />
          </Stack>
        </OrderProvider>
      </CartProvider>
    </DemandProvider>
  );
}
