import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import COLORS from '../constants/colors';
import { useDemand } from '../context/DemandContext';
import Header from '../components/Header';
import PromoBanner from '../components/PromoBanner';
import Categories from '../components/Categories';
import RestaurantList from '../components/RestaurantList';
import FilterBar, { FilterOption } from '../components/FilterBar';
import TrendingSection from '../components/TrendingSection';

const HomeScreen = () => {
  const router = useRouter();
  const { restaurants } = useDemand();
  const [activeFilter, setActiveFilter] = useState<FilterOption | null>(null);

  const handleRestaurantPress = (id: string) => {
    router.push(`/restaurant/${id}`);
  };

  const getFilteredRestaurants = () => {
    let filtered = [...restaurants];
    
    switch (activeFilter) {
      case 'fastest':
        return filtered.sort((a, b) => a.estimatedWaitMinutes - b.estimatedWaitMinutes);
      case 'popular':
        return filtered.sort((a, b) => b.reviewCount - a.reviewCount);
      case 'low_saturation':
        // Asignamos pesos para ordenar
        const weight = { low: 1, medium: 2, high: 3, critical: 4 };
        return filtered.sort((a, b) => weight[a.saturationLevel] - weight[b.saturationLevel]);
      case 'free_delivery':
        return filtered.filter(r => r.deliveryFee === 'Envío gratis');
      default:
        return filtered;
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <PromoBanner />
        <FilterBar onFilterChange={setActiveFilter} />
        <TrendingSection restaurants={restaurants} onPress={handleRestaurantPress} />
        <Categories />
        <RestaurantList 
          restaurants={getFilteredRestaurants()} 
          onRestaurantPress={handleRestaurantPress} 
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
});

export default HomeScreen;
