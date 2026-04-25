import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useOrders } from '../../src/context/OrderContext';
import COLORS from '../../src/constants/colors';
import OrderTimeline from '../../src/components/OrderTimeline';

export default function OrderTrackingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getOrderById } = useOrders();
  const router = useRouter();

  const order = getOrderById(id);

  if (!order) {
    return (
      <View style={styles.centerContainer}>
        <Text>Pedido no encontrado</Text>
        <TouchableOpacity style={styles.closeBtn} onPress={() => router.replace('/orders')}>
          <Text style={styles.closeBtnText}>Ir a mis pedidos</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={COLORS.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pedido {order.id.split('-')[1]}</Text>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        
        <View style={styles.heroSummary}>
          <Ionicons name="fast-food" size={60} color={COLORS.primary} style={styles.heroIcon} />
          <Text style={styles.restaurantName}>{order.restaurantName}</Text>
          <Text style={styles.etaText}>
            Llegada estimada: <Text style={styles.etaTime}>{order.estimatedDelivery}</Text>
          </Text>
        </View>

        <OrderTimeline status={order.status} />

        <View style={styles.itemsCard}>
          <Text style={styles.listTitle}>Resumen</Text>
          {order.items.map((item, idx) => (
            <View key={idx} style={styles.itemRow}>
              <Text style={styles.itemQty}>{item.quantity}x</Text>
              <Text style={styles.itemName}>{item.menuItem.name}</Text>
              <Text style={styles.itemPrice}>${(item.menuItem.price * item.quantity).toFixed(2)}</Text>
            </View>
          ))}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Pagado</Text>
            <Text style={styles.totalValue}>${order.total.toFixed(2)}</Text>
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.white },
  closeBtn: { marginTop: 20, backgroundColor: COLORS.primary, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
  closeBtnText: { color: COLORS.white, fontWeight: 'bold' },
  
  container: { flex: 1, backgroundColor: COLORS.veryLightGray, paddingTop: 50 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 15, backgroundColor: COLORS.veryLightGray },
  backBtn: { width: 40, height: 40, backgroundColor: COLORS.white, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.black },
  
  scroll: { flex: 1, paddingHorizontal: 20 },
  
  heroSummary: { alignItems: 'center', marginVertical: 30 },
  heroIcon: { marginBottom: 10 },
  restaurantName: { fontSize: 22, fontWeight: 'bold', color: COLORS.black, marginBottom: 6 },
  etaText: { fontSize: 16, color: COLORS.darkGray },
  etaTime: { fontWeight: 'bold', color: COLORS.primary, fontSize: 18 },
  
  itemsCard: { backgroundColor: COLORS.white, borderRadius: 16, padding: 20, marginVertical: 10, marginBottom: 40 },
  listTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.black, marginBottom: 16 },
  itemRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: COLORS.veryLightGray, paddingVertical: 8, alignItems: 'center' },
  itemQty: { fontWeight: 'bold', color: COLORS.primary, marginRight: 10, width: 25 },
  itemName: { flex: 1, fontSize: 15, color: COLORS.darkGray },
  itemPrice: { fontSize: 15, color: COLORS.black, fontWeight: '500' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: COLORS.lightGray },
  totalLabel: { fontSize: 18, fontWeight: 'bold', color: COLORS.black },
  totalValue: { fontSize: 18, fontWeight: 'bold', color: COLORS.primary },
});
