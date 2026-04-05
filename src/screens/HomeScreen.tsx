import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import COLORS from '../constants/colors';
import { restaurants } from '../data/mockData';
import Header from '../components/Header';
import PromoBanner from '../components/PromoBanner';
import Categories from '../components/Categories';
import RestaurantList from '../components/RestaurantList';
import BottomNavBar from '../components/BottomNavBar';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Header />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <PromoBanner />
        <Categories />
        <RestaurantList restaurants={restaurants} />
        <View style={{ height: 90 }} />
      </ScrollView>
      <BottomNavBar />
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
