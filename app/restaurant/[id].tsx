import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useDemand } from '../../src/context/DemandContext';
import { getMenuForRestaurant } from '../../src/data/mockData';
import COLORS from '../../src/constants/colors';
import SaturationBar from '../../src/components/SaturationBar';
import MenuItemCard from '../../src/components/MenuItemCard';
import CartBadge from '../../src/components/CartBadge';

export default function RestaurantDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getRestaurantById } = useDemand();
  
  const restaurant = getRestaurantById(id);
  const menu = useMemo(() => getMenuForRestaurant(id), [id]);

  if (!restaurant) {
    return (
      <View style={styles.centerContainer}>
        <Text>Taquería no encontrada</Text>
      </View>
    );
  }

  const saturationRatio = restaurant.currentOrders / restaurant.maxCapacity;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backIcon}>⬅️</Text>
        </TouchableOpacity>
        <Text style={styles.title} numberOfLines={1}>{restaurant.name}</Text>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Banner with Restaurant Info */}
        <View style={styles.hero}>
          <Text style={styles.heroEmoji}>{restaurant.emoji}</Text>
          {restaurant.trending && (
            <View style={styles.trendingBadge}>
              <Text style={styles.trendingText}>🔥 Trending</Text>
            </View>
          )}
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.row}>
            <Text style={styles.waitText}>
              <Text style={styles.waitNumber}>{restaurant.estimatedWaitMinutes}</Text> min
            </Text>
            <View style={styles.ratingBox}>
              <Text style={styles.ratingText}>⭐ {restaurant.rating}</Text>
            </View>
          </View>
          <Text style={styles.subtext}>{restaurant.distance} · {restaurant.deliveryFee}</Text>
          
          <View style={styles.saturationWrapper}>
            <SaturationBar level={restaurant.saturationLevel} ratio={saturationRatio} />
          </View>
        </View>

        <View style={styles.menuHeader}>
          <Text style={styles.menuTitle}>Menú</Text>
        </View>
        
        {menu.map((item) => (
          <MenuItemCard 
            key={item.id} 
            item={item} 
            restaurantId={restaurant.id} 
            restaurantName={restaurant.name} 
          />
        ))}
      </ScrollView>

      {/* Flotating Cart Badge */}
      <CartBadge />
    </View>
  );
}

const styles = StyleSheet.create({
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.white },
  container: { flex: 1, paddingTop: 50, backgroundColor: COLORS.white },
  scrollContent: { paddingBottom: 100 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, paddingHorizontal: 20 },
  backButton: { marginRight: 16, padding: 8, backgroundColor: COLORS.white, borderRadius: 20, shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  backIcon: { fontSize: 18 },
  title: { fontSize: 22, fontWeight: 'bold', color: COLORS.black, flex: 1 },
  hero: { height: 160, backgroundColor: COLORS.veryLightGray, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  heroEmoji: { fontSize: 75 },
  trendingBadge: { position: 'absolute', bottom: 16, backgroundColor: COLORS.trending, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  trendingText: { fontWeight: 'bold', fontSize: 13, color: COLORS.black },
  statsContainer: { padding: 20, borderBottomWidth: 8, borderBottomColor: COLORS.veryLightGray },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  waitText: { fontSize: 16, color: COLORS.darkGray },
  waitNumber: { fontSize: 24, fontWeight: 'bold', color: COLORS.black },
  ratingBox: { backgroundColor: COLORS.veryLightGray, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  ratingText: { fontWeight: '700', fontSize: 14 },
  subtext: { fontSize: 14, color: COLORS.mediumGray, marginBottom: 14 },
  saturationWrapper: { backgroundColor: COLORS.white, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 12, borderWidth: 1, borderColor: COLORS.lightGray },
  menuHeader: { padding: 20, paddingBottom: 10 },
  menuTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.black },
});
