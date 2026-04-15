import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import COLORS from '../constants/colors';
import { MenuItem } from '../types';
import { useCart } from '../context/CartContext';

interface MenuItemCardProps {
  item: MenuItem;
  restaurantId: string;
  restaurantName: string;
}

const MenuItemCard = ({ item, restaurantId, restaurantName }: MenuItemCardProps) => {
  const { items, addItem, updateQuantity, clearCart } = useCart();
  const cartItem = items.find(i => i.menuItem.id === item.id);

  const handleAdd = () => {
    const success = addItem(item, restaurantId, restaurantName);
    if (!success) {
      Alert.alert(
        'Cambio de taquería',
        'Tu carrito tiene pedidos de otra taquería. ¿Deseas vaciarlo para pedir aquí?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { 
            text: 'Vaciar y agregar', 
            style: 'destructive',
            onPress: () => {
              clearCart();
              addItem(item, restaurantId, restaurantName);
            }
          }
        ]
      );
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.info}>
        <View style={styles.titleRow}>
          <Text style={styles.name}>{item.name}</Text>
          {item.isPopular && <Text style={styles.popularBadge}>⭐ Popular</Text>}
        </View>
        <Text style={styles.desc} numberOfLines={2}>{item.description}</Text>
        <Text style={styles.price}>${item.price.toFixed(2)}</Text>
      </View>
      <View style={styles.actionArea}>
        <View style={styles.emojiContainer}>
          <Text style={styles.emoji}>{item.emoji}</Text>
        </View>
        
        {cartItem ? (
          <View style={styles.counter}>
            <TouchableOpacity 
              style={styles.circleBtn} 
              onPress={() => updateQuantity(item.id, -1)}
            >
              <Text style={styles.btnText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.qtyText}>{cartItem.quantity}</Text>
            <TouchableOpacity 
              style={styles.circleBtn} 
              onPress={() => updateQuantity(item.id, 1)}
            >
              <Text style={styles.btnText}>+</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
            <Text style={styles.addBtnText}>Agregar</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  info: {
    flex: 1,
    paddingRight: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.black,
  },
  popularBadge: {
    fontSize: 10,
    backgroundColor: COLORS.veryLightGray,
    color: COLORS.darkGray,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
    overflow: 'hidden',
  },
  desc: {
    fontSize: 13,
    color: COLORS.mediumGray,
    marginBottom: 8,
  },
  price: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.primary,
  },
  actionArea: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  emojiContainer: {
    width: 60,
    height: 60,
    backgroundColor: COLORS.veryLightGray,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  emoji: {
    fontSize: 30,
  },
  addBtn: {
    backgroundColor: COLORS.veryLightGray,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  addBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
  },
  counter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  circleBtn: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  qtyText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '700',
    marginHorizontal: 8,
  }
});

export default MenuItemCard;
