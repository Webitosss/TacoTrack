import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useCart } from '../context/CartContext';
import COLORS from '../constants/colors';

const CartBadge = () => {
  const { itemCount, totalAmount } = useCart();
  const router = useRouter();

  if (itemCount === 0) return null;

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity 
        style={styles.container} 
        activeOpacity={0.9} 
        onPress={() => router.push('/cart')}
      >
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{itemCount}</Text>
        </View>
        <Text style={styles.viewCartText}>Ver carrito</Text>
        <Text style={styles.priceText}>${totalAmount.toFixed(2)}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    width: '100%',
    shadowColor: COLORS.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  countBadge: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 14,
  },
  viewCartText: {
    flex: 1,
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },
  priceText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default CartBadge;
