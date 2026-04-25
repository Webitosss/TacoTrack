import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../constants/colors';
import { Restaurant } from '../types';
import RestaurantCard from './RestaurantCard';

interface RestaurantListProps {
  restaurants: Restaurant[];
  onRestaurantPress: (id: string) => void;
}

const RestaurantList = ({ restaurants, onRestaurantPress }: RestaurantListProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.titleWrapper}>
          <Text style={styles.sectionTitle}>Taquerías cerca de ti</Text>
          <Ionicons name="restaurant" size={20} color={COLORS.primary} style={{marginLeft: 8}} />
        </View>
        <TouchableOpacity>
          <Text style={styles.seeAll}>Ver todo</Text>
        </TouchableOpacity>
      </View>
      {restaurants.map((restaurant) => (
        <RestaurantCard 
          key={restaurant.id} 
          restaurant={restaurant} 
          onPress={() => onRestaurantPress(restaurant.id)} 
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.black,
  },
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAll: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
});

export default RestaurantList;
