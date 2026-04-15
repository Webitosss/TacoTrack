import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import COLORS from '../constants/colors';

interface OrderTimelineProps {
  status: 'preparing' | 'on_the_way' | 'delivered';
}

const OrderTimeline = ({ status }: OrderTimelineProps) => {
  const steps = [
    { key: 'preparing', label: 'Preparando tu pedido', icon: '👨‍🍳' },
    { key: 'on_the_way', label: 'En camino (GPS simulado)', icon: '🛵' },
    { key: 'delivered', label: '¡Entregado!', icon: '✅' },
  ];

  const getStepStatus = (stepKey: string, currentIndex: number, myIndex: number) => {
    if (myIndex < currentIndex) return 'completed';
    if (myIndex === currentIndex) return 'active';
    return 'pending';
  };

  const currentIndex = steps.findIndex(s => s.key === status);

  return (
    <View style={styles.container}>
      {steps.map((step, index) => {
        const state = getStepStatus(step.key, currentIndex, index);
        
        return (
          <View key={step.key} style={styles.stepRow}>
            <View style={styles.iconCol}>
              <View style={[
                styles.iconBubble,
                state === 'completed' && styles.bubbleCompleted,
                state === 'active' && styles.bubbleActive,
              ]}>
                <Text style={styles.iconText}>{state === 'pending' ? '⏳' : step.icon}</Text>
              </View>
              {index < steps.length - 1 && (
                <View style={[styles.line, state === 'completed' && styles.lineCompleted]} />
              )}
            </View>
            <View style={styles.textCol}>
              <Text style={[
                styles.stepLabel,
                state === 'completed' && styles.labelCompleted,
                state === 'active' && styles.labelActive,
              ]}>
                {step.label}
              </Text>
              {state === 'active' && (
                <Text style={styles.subLabel}>Este estado se actualizará automáticamente en unos segundos para la demo.</Text>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  stepRow: {
    flexDirection: 'row',
  },
  iconCol: {
    alignItems: 'center',
    marginRight: 16,
  },
  iconBubble: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.veryLightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bubbleCompleted: {
    backgroundColor: COLORS.primary,
  },
  bubbleActive: {
    backgroundColor: COLORS.trending,
    borderWidth: 2,
    borderColor: COLORS.primaryDark,
  },
  iconText: {
    fontSize: 20,
  },
  line: {
    width: 2,
    height: 40,
    backgroundColor: COLORS.lightGray,
    marginVertical: 4,
  },
  lineCompleted: {
    backgroundColor: COLORS.primary,
  },
  textCol: {
    flex: 1,
    paddingTop: 10,
  },
  stepLabel: {
    fontSize: 16,
    color: COLORS.darkGray,
    fontWeight: '500',
  },
  labelCompleted: {
    color: COLORS.black,
    textDecorationLine: 'line-through',
  },
  labelActive: {
    color: COLORS.black,
    fontWeight: 'bold',
  },
  subLabel: {
    fontSize: 12,
    color: COLORS.mediumGray,
    marginTop: 4,
  }
});

export default OrderTimeline;
