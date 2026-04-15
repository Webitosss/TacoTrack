import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
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
        <Text style={styles.title}>🔥 En Tendencia Ahora</Text>
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
              <Text style={styles.emoji}>{restaurant.emoji}</Text>
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.name} numberOfLines={1}>{restaurant.name}</Text>
              <Text style={styles.waitText}>🕑 {restaurant.estimatedWaitMinutes} min</Text>
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
  emoji: {
    fontSize: 20,
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
  waitText: {
    fontSize: 12,
    color: COLORS.darkGray,
  },
});

export default TrendingSection;
