import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useOrders } from '../../src/context/OrderContext';
import COLORS from '../../src/constants/colors';
import { Order } from '../../src/types';

export default function OrdersScreen() {
  const { orders } = useOrders();
  const router = useRouter();

  if (orders.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyEmoji}>📋</Text>
        <Text style={styles.emptyTitle}>Aún no tienes pedidos</Text>
        <Text style={styles.emptyDesc}>Explora y pide unos ricos tacos!</Text>
      </View>
    );
  }

  const renderOrder = ({ item }: { item: Order }) => {
    const isCompleted = item.status === 'delivered';
    const statusText = {
      preparing: '👨‍🍳 Preparando...',
      on_the_way: '🛵 En camino',
      delivered: '✅ Entregado'
    };

    return (
      <TouchableOpacity 
        style={[styles.card, isCompleted && styles.cardCompleted]} 
        activeOpacity={0.8}
        onPress={() => router.push(`/order-tracking/${item.id}`)}
      >
        <View style={styles.header}>
          <Text style={styles.restaurantName}>🌮 {item.restaurantName}</Text>
          <Text style={[styles.status, isCompleted ? styles.statusCompleted : styles.statusActive]}>
            {statusText[item.status]}
          </Text>
        </View>
        <Text style={styles.detailsText}>
          {item.items.reduce((acc, curr) => acc + curr.quantity, 0)} items · ${item.total.toFixed(2)}
        </Text>
        <Text style={styles.dateText}>
          {item.createdAt.toLocaleDateString()} {item.createdAt.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} 
          {isCompleted ? '' : ` · Llega a las ${item.estimatedDelivery}`}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis Pedidos</Text>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={renderOrder}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.white },
  emptyEmoji: { fontSize: 70, opacity: 0.5, marginBottom: 20 },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.black, marginBottom: 10 },
  emptyDesc: { fontSize: 15, color: COLORS.mediumGray },
  
  container: { flex: 1, backgroundColor: COLORS.veryLightGray, paddingTop: 60 },
  title: { fontSize: 28, fontWeight: 'bold', color: COLORS.black, paddingHorizontal: 20, marginBottom: 10 },
  list: { padding: 20 },
  
  card: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardCompleted: {
    borderLeftColor: COLORS.green,
    opacity: 0.8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.black,
  },
  status: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  statusActive: {
    color: COLORS.primary,
  },
  statusCompleted: {
    color: COLORS.green,
  },
  detailsText: {
    fontSize: 14,
    color: COLORS.darkGray,
    marginBottom: 4,
  },
  dateText: {
    fontSize: 12,
    color: COLORS.mediumGray,
  }
});
