/**
 * Flag Badge Component
 * Displays color-coded flag (🟢/🟡/🔴) with status
 */

import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {PriceComparison} from '../types/bill.types';

interface FlagBadgeProps {
  comparison: PriceComparison;
  size?: 'small' | 'medium' | 'large';
}

export const FlagBadge: React.FC<FlagBadgeProps> = ({
  comparison,
  size = 'medium',
}) => {
  const flagSize = size === 'small' ? 20 : size === 'large' ? 48 : 32;

  return (
    <View style={styles.container}>
      <Text style={[styles.flag, {fontSize: flagSize}]}>
        {comparison.flag}
      </Text>
      <Text style={[styles.status, size === 'small' && styles.statusSmall]}>
        {comparison.status}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  flag: {
    marginBottom: 4,
  },
  status: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  statusSmall: {
    fontSize: 10,
  },
});

