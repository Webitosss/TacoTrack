import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import COLORS from '../constants/colors';
import { Restaurant } from '../types';

interface SaturationBarProps {
  level: Restaurant['saturationLevel'];
  ratio: number; // 0 to 1
  style?: object;
}

const SaturationBar = ({ level, ratio, style }: SaturationBarProps) => {
  const getColor = () => {
    switch (level) {
      case 'low': return COLORS.saturationLow;
      case 'medium': return COLORS.saturationMedium;
      case 'high': return COLORS.saturationHigh;
      case 'critical': return COLORS.saturationCritical;
      default: return COLORS.saturationLow;
    }
  };

  const getLabel = () => {
    switch (level) {
      case 'low': return 'Baja demanda';
      case 'medium': return 'Moderada';
      case 'high': return 'Alta demanda';
      case 'critical': return 'Saturado';
      default: return 'Desconocida';
    }
  };

  const percentage = Math.min(Math.max(ratio * 100, 5), 100);

  return (
    <View style={[styles.container, style]}>
      <View style={styles.textRow}>
        <Text style={styles.label}>{getLabel()}</Text>
        <Text style={styles.ratioText}>{Math.round(percentage)}%</Text>
      </View>
      <View style={styles.barBackground}>
        <View 
          style={[
            styles.barFill, 
            { width: `${percentage}%`, backgroundColor: getColor() }
          ]} 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
  },
  textRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.darkGray,
  },
  ratioText: {
    fontSize: 10,
    color: COLORS.mediumGray,
  },
  barBackground: {
    height: 6,
    backgroundColor: COLORS.lightGray,
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
  },
});

export default SaturationBar;
