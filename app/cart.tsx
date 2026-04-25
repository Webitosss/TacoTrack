import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCart } from '../src/context/CartContext';
import { useDemand } from '../src/context/DemandContext';
import { useOrders } from '../src/context/OrderContext';
import COLORS from '../src/constants/colors';

export default function CartScreen() {
  const { items, totalAmount, restaurantId, restaurantName, updateQuantity, clearCart } = useCart();
  const { getRestaurantById } = useDemand();
  const { placeOrder } = useOrders();
  const router = useRouter();

  const restaurant = restaurantId ? getRestaurantById(restaurantId) : null;
  const deliveryFee = restaurant?.deliveryFee === 'Envío gratis' ? 0 : parseInt(restaurant?.deliveryFee.replace('$', '') || '0');
  const total = totalAmount + deliveryFee;

  const handleCheckout = () => {
    if (!restaurantId || !restaurantName) return;
    
    // Crear la orden
    const estimatedWait = restaurant?.estimatedWaitMinutes || 20;
    const orderId = placeOrder(restaurantId, restaurantName, items, total, estimatedWait);
    
    Alert.alert(
      'Pedido Confirmado 🎉',
      `Tu pedido de ${restaurantName} se está preparando.`,
      [{ text: 'Ver estado', onPress: () => {
        clearCart();
        router.replace(`/order-tracking/${orderId}`);
      }}]
    );
  };

  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="close" size={24} color={COLORS.black} />
          </TouchableOpacity>
          <Text style={styles.title}>Tu Carrito</Text>
        </View>
        <View style={styles.emptyContent}>
          <Ionicons name="cart-outline" size={80} color={COLORS.mediumGray} style={styles.emptyIcon} />
          <Text style={styles.emptyTitle}>El carrito está vacío</Text>
          <Text style={styles.emptyDesc}>Agrega unos ricos tacos para continuar con tu pedido.</Text>
          <TouchableOpacity style={styles.returnBtn} onPress={() => router.back()}>
            <Text style={styles.returnBtnText}>Ver taquerías</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="close" size={24} color={COLORS.black} />
        </TouchableOpacity>
        <Text style={styles.title}>Tu Carrito</Text>
        <TouchableOpacity onPress={clearCart}>
          <Text style={styles.clearText}>Vaciar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.restaurantName}>Pedido de {restaurantName}</Text>
        {restaurant && (
          <View style={styles.waitBadge}>
            <Text style={styles.waitText}>
              Llegará de {restaurant.estimatedWaitMinutes} a {restaurant.estimatedWaitMinutes + 10} min
            </Text>
          </View>
        )}

        <View style={styles.itemsList}>
          {items.map((item) => (
            <View key={item.menuItem.id} style={styles.cartItem}>
              <View style={styles.qtyContainer}>
                <Text style={styles.qtyText}>{item.quantity}x</Text>
              </View>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.menuItem.name}</Text>
                <Text style={styles.itemPrice}>${(item.menuItem.price * item.quantity).toFixed(2)}</Text>
              </View>
              <View style={styles.controls}>
                <TouchableOpacity style={styles.ctrlBtn} onPress={() => updateQuantity(item.menuItem.id, -1)}>
                  <Text style={styles.ctrlText}>-</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.ctrlBtn} onPress={() => updateQuantity(item.menuItem.id, 1)}>
                  <Text style={styles.ctrlText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.summaryContainer}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>${totalAmount.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Envío</Text>
            <Text style={styles.summaryValue}>{deliveryFee === 0 ? 'Gratis' : `$${deliveryFee.toFixed(2)}`}</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total a pagar</Text>
            <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout}>
          <Text style={styles.checkoutBtnText}>Confirmar Pedido • ${total.toFixed(2)}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1, backgroundColor: COLORS.white, paddingTop: 50,
  },
  emptyContent: {
    flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 30,
  },
  emptyIcon: { opacity: 0.5, marginBottom: 20 },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.black, marginBottom: 10 },
  emptyDesc: { fontSize: 15, color: COLORS.mediumGray, textAlign: 'center', marginBottom: 30 },
  returnBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 30, paddingVertical: 14, borderRadius: 25 },
  returnBtnText: { color: COLORS.white, fontWeight: 'bold', fontSize: 16 },
  
  container: {
    flex: 1, backgroundColor: COLORS.veryLightGray, paddingTop: 50,
  },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 15, backgroundColor: COLORS.veryLightGray,
  },
  backBtn: { width: 40, height: 40, backgroundColor: COLORS.white, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 18, fontWeight: 'bold' },
  clearText: { color: COLORS.primary, fontWeight: '600' },
  scroll: { flex: 1, paddingHorizontal: 20 },
  restaurantName: { fontSize: 18, fontWeight: 'bold', color: COLORS.black, marginTop: 10 },
  waitBadge: { backgroundColor: COLORS.white, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, alignSelf: 'flex-start', marginTop: 8, marginBottom: 20, borderWidth: 1, borderColor: COLORS.lightGray },
  waitText: { fontSize: 13, color: COLORS.darkGray, fontWeight: '500' },
  itemsList: { backgroundColor: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 20 },
  cartItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.veryLightGray },
  qtyContainer: { backgroundColor: COLORS.veryLightGray, width: 32, height: 32, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  qtyText: { fontSize: 14, fontWeight: 'bold', color: COLORS.primary },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 15, fontWeight: '600', color: COLORS.black, marginBottom: 4 },
  itemPrice: { fontSize: 14, color: COLORS.mediumGray },
  controls: { flexDirection: 'row', alignItems: 'center' },
  ctrlBtn: { backgroundColor: COLORS.veryLightGray, width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginLeft: 8 },
  ctrlText: { fontSize: 18, color: COLORS.darkGray, fontWeight: 'bold' },
  summaryContainer: { backgroundColor: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 40 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  summaryLabel: { fontSize: 15, color: COLORS.mediumGray },
  summaryValue: { fontSize: 15, color: COLORS.black, fontWeight: '500' },
  totalRow: { borderTopWidth: 1, borderTopColor: COLORS.lightGray, paddingTop: 12, marginTop: 4, marginBottom: 0 },
  totalLabel: { fontSize: 16, fontWeight: 'bold', color: COLORS.black },
  totalValue: { fontSize: 18, fontWeight: 'bold', color: COLORS.primary },
  footer: { backgroundColor: COLORS.white, padding: 20, paddingBottom: 30, borderTopWidth: 1, borderTopColor: COLORS.lightGray },
  checkoutBtn: { backgroundColor: COLORS.primary, borderRadius: 16, paddingVertical: 18, alignItems: 'center' },
  checkoutBtnText: { color: COLORS.white, fontSize: 16, fontWeight: 'bold' },
});
