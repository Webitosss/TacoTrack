import React from 'react';
import { View, Text, TextInput, StyleSheet, Platform, StatusBar } from 'react-native';
import COLORS from '../constants/colors';

const Header = () => {
  return (
    <View style={styles.container}>
      <View style={styles.locationRow}>
        <Text style={styles.locationIcon}>📍</Text>
        <View style={styles.locationTextContainer}>
          <Text style={styles.deliverLabel}>Entregar en</Text>
          <Text style={styles.address}>Av. Insurgentes Sur 1234 ▾</Text>
        </View>
      </View>
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          placeholder="Buscar tacos, taquerías..."
          placeholderTextColor={COLORS.mediumGray}
          style={styles.searchInput}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    paddingTop: Platform.OS === 'ios' ? 50 : (StatusBar.currentHeight || 0) + 10,
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  locationTextContainer: {
    flex: 1,
  },
  deliverLabel: {
    fontSize: 12,
    color: COLORS.mediumGray,
  },
  address: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.black,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.veryLightGray,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: COLORS.black,
  },
});

export default Header;
