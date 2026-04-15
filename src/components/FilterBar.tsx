import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import COLORS from '../constants/colors';

export type FilterOption = 'fastest' | 'popular' | 'low_saturation' | 'free_delivery';

interface FilterBarProps {
  onFilterChange: (filter: FilterOption | null) => void;
}

const FilterBar = ({ onFilterChange }: FilterBarProps) => {
  const [activeFilter, setActiveFilter] = useState<FilterOption | null>(null);

  const filters: { id: FilterOption; label: string; icon: string }[] = [
    { id: 'fastest', label: 'Más Rápida', icon: '⚡' },
    { id: 'popular', label: 'Más Popular', icon: '🔥' },
    { id: 'low_saturation', label: 'Baja Demanda', icon: '✅' },
    { id: 'free_delivery', label: 'Envío Gratis', icon: '🛵' },
  ];

  const handlePress = (id: FilterOption) => {
    const newFilter = activeFilter === id ? null : id;
    setActiveFilter(newFilter);
    onFilterChange(newFilter);
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {filters.map(filter => (
          <TouchableOpacity
            key={filter.id}
            style={[
              styles.chip,
              activeFilter === filter.id && styles.chipActive
            ]}
            onPress={() => handlePress(filter.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.icon}>{filter.icon}</Text>
            <Text style={[
              styles.label,
              activeFilter === filter.id && styles.labelActive
            ]}>
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  scroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primaryDark,
  },
  icon: {
    fontSize: 14,
    marginRight: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.darkGray,
  },
  labelActive: {
    color: COLORS.white,
  },
});

export default FilterBar;
