import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import COLORS from '../constants/colors';
import { bottomNavItems } from '../data/mockData';

const BottomNavBar = () => {
  return (
    <View style={styles.container}>
      {bottomNavItems.map((item) => (
        <TouchableOpacity key={item.id} style={styles.navItem} activeOpacity={0.7}>
          <Text style={[styles.navEmoji, item.active && styles.activeEmoji]}>
            {item.emoji}
          </Text>
          <Text style={[styles.navLabel, item.active && styles.activeLabel]}>
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 28 : 10,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navEmoji: {
    fontSize: 22,
    opacity: 0.5,
  },
  activeEmoji: {
    opacity: 1,
  },
  navLabel: {
    fontSize: 11,
    color: COLORS.mediumGray,
    marginTop: 2,
    fontWeight: '500',
  },
  activeLabel: {
    color: COLORS.primary,
    fontWeight: '700',
  },
});

export default BottomNavBar;
