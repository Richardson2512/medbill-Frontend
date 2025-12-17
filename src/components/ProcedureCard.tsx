/**
 * Procedure Card Component
 * Displays procedure information with flag and price comparison
 */

import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {Card} from 'react-native-paper';
import {ProcedureAnalysis} from '../types/bill.types';
import {FlagBadge} from './FlagBadge';

interface ProcedureCardProps {
  analysis: ProcedureAnalysis;
  onPress: () => void;
}

export const ProcedureCard: React.FC<ProcedureCardProps> = ({
  analysis,
  onPress,
}) => {
  const {procedure, comparison} = analysis;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getPercentageColor = (percentage: number) => {
    if (percentage <= 150) return '#4CAF50'; // Green
    if (percentage <= 250) return '#FF9800'; // Orange
    return '#F44336'; // Red
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.content}>
            <View style={styles.flagContainer}>
              <FlagBadge comparison={comparison} size="large" />
            </View>

            <View style={styles.infoContainer}>
              <Text style={styles.procedureName} numberOfLines={2}>
                {procedure.description}
              </Text>

              {procedure.cptCode && (
                <Text style={styles.cptCode}>CPT: {procedure.cptCode}</Text>
              )}

              <View style={styles.priceRow}>
                <Text style={styles.chargedAmount}>
                  {formatCurrency(procedure.chargeAmount)}
                </Text>
                {comparison.medicareRate > 0 && (
                  <View style={styles.comparisonContainer}>
                    <Text style={styles.medicareRate}>
                      Medicare: {formatCurrency(comparison.medicareRate)}
                    </Text>
                    <View
                      style={[
                        styles.percentageBadge,
                        {
                          backgroundColor: getPercentageColor(
                            comparison.percentageOfMedicare,
                          ),
                        },
                      ]}>
                      <Text style={styles.percentageText}>
                        {comparison.percentageOfMedicare}%
                      </Text>
                    </View>
                  </View>
                )}
              </View>

              <Text style={styles.statusText}>{comparison.status}</Text>
            </View>

            <View style={styles.chevronContainer}>
              <Text style={styles.chevron}>›</Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 6,
    marginHorizontal: 16,
    elevation: 2,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flagContainer: {
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
  },
  procedureName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  cptCode: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  chargedAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginRight: 12,
  },
  comparisonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  medicareRate: {
    fontSize: 12,
    color: '#666',
    marginRight: 8,
  },
  percentageBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  percentageText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  statusText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  chevronContainer: {
    marginLeft: 8,
  },
  chevron: {
    fontSize: 24,
    color: '#999',
  },
});

