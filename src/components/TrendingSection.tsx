import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../constants/colors';
import { Restaurant } from '../types';

interface TrendingSectionProps {
  restaurants: Restaurant[];
  onPress: (id: string) => void;
}

const TrendingSection = ({ restaurants, onPress }: TrendingSectionProps) => {
  const trendingRestaurants = restaurants.filter(r => r.trending);

  if (trendingRestaurants.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="flame" size={20} color={COLORS.primary} style={{marginRight: 6}} />
        <Text style={styles.title}>En Tendencia Ahora</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {trendingRestaurants.map(restaurant => (
          <TouchableOpacity 
            key={restaurant.id} 
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => onPress(restaurant.id)}
          >
            <View style={styles.emojiContainer}>
              <Ionicons name={restaurant.icon} size={20} color={COLORS.primary} />
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.name} numberOfLines={1}>{restaurant.name}</Text>
              <View style={styles.waitRow}>
                <Ionicons name="time-outline" size={12} color={COLORS.darkGray} style={{marginRight: 4}} />
                <Text style={styles.waitText}>{restaurant.estimatedWaitMinutes} min</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  header: {
    paddingHorizontal: 16,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.black,
  },
  scroll: {
    paddingHorizontal: 16,
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    width: 200,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.trending,
    shadowColor: COLORS.trending,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
  },
  emojiContainer: {
    width: 40,
    height: 40,
    backgroundColor: COLORS.veryLightGray,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 4,
  },
  waitRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  waitText: {
    fontSize: 12,
    color: COLORS.darkGray,
  },
});

export default TrendingSection;
