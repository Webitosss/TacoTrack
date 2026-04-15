import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import COLORS from '../constants/colors';
import { Restaurant } from '../types';
import SaturationBar from './SaturationBar';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onPress: () => void;
}

const RestaurantCard = ({ restaurant, onPress }: RestaurantCardProps) => {
  const saturationRatio = restaurant.currentOrders / restaurant.maxCapacity;

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={onPress}>
      <View style={styles.imageContainer}>
        <Text style={styles.imageEmoji}>{restaurant.emoji}</Text>
        {restaurant.isPromo && (
          <View style={styles.promoBadge}>
            <Text style={styles.promoText}>{restaurant.promoText}</Text>
          </View>
        )}
        <TouchableOpacity style={styles.heartButton} activeOpacity={0.7}>
          <Text style={styles.heartEmoji}>
            {restaurant.isFavorite ? '❤️' : '🤍'}
          </Text>
        </TouchableOpacity>
        {restaurant.trending && (
          <View style={styles.trendingBadge}>
            <Text style={styles.trendingText}>🔥 Trending</Text>
          </View>
        )}
      </View>
      <View style={styles.detailsContainer}>
        <View style={styles.titleRow}>
          <Text style={styles.restaurantName}>{restaurant.name}</Text>
        </View>
        
        <SaturationBar level={restaurant.saturationLevel} ratio={saturationRatio} />
        
        <View style={styles.ratingRow}>
          <Text style={styles.star}>⭐</Text>
          <Text style={styles.rating}>{restaurant.rating}</Text>
          <Text style={styles.reviewCount}>({restaurant.reviewCount})</Text>
          <Text style={styles.dot}> · </Text>
          <Text style={styles.priceRange}>{restaurant.priceRange}</Text>
        </View>
        <Text style={styles.infoText}>
          🕐 {restaurant.estimatedWaitMinutes} min · 📍 {restaurant.distance} · {restaurant.deliveryFee}
        </Text>
        <Text style={styles.tags}>{restaurant.tags.join(' · ')}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderColor: COLORS.cardBorder,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  imageContainer: {
    height: 140,
    backgroundColor: COLORS.veryLightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageEmoji: {
    fontSize: 55,
  },
  promoBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: COLORS.green,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  promoText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '700',
  },
  trendingBadge: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    backgroundColor: COLORS.trending,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  trendingText: {
    color: COLORS.black,
    fontSize: 12,
    fontWeight: '700',
  },
  heartButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heartEmoji: {
    fontSize: 18,
  },
  detailsContainer: {
    padding: 14,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  restaurantName: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.black,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    marginTop: 4,
  },
  star: {
    fontSize: 13,
  },
  rating: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.black,
    marginLeft: 3,
  },
  reviewCount: {
    fontSize: 13,
    color: COLORS.mediumGray,
    marginLeft: 2,
  },
  dot: {
    fontSize: 13,
    color: COLORS.mediumGray,
  },
  priceRange: {
    fontSize: 13,
    color: COLORS.mediumGray,
  },
  infoText: {
    fontSize: 13,
    color: COLORS.darkGray,
    marginBottom: 6,
  },
  tags: {
    fontSize: 12,
    color: COLORS.mediumGray,
  },
});

export default RestaurantCard;
