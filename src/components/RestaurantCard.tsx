import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import COLORS from '../constants/colors';

const RestaurantCard = ({ restaurant }) => {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.7}>
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
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.restaurantName}>{restaurant.name}</Text>
        <View style={styles.ratingRow}>
          <Text style={styles.star}>⭐</Text>
          <Text style={styles.rating}>{restaurant.rating}</Text>
          <Text style={styles.reviewCount}>({restaurant.reviewCount})</Text>
          <Text style={styles.dot}> · </Text>
          <Text style={styles.priceRange}>{restaurant.priceRange}</Text>
        </View>
        <Text style={styles.infoText}>
          🕐 {restaurant.deliveryTime} min · 📍 {restaurant.distance} · {restaurant.deliveryFee}
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  imageContainer: {
    height: 150,
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
  restaurantName: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.black,
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
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
