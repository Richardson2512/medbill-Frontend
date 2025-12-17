/**
 * Procedure Detail Screen
 * Shows detailed price comparison and source attribution
 */

import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Card} from 'react-native-paper';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {ProcedureAnalysis} from '../types/bill.types';
import {FlagBadge} from '../components/FlagBadge';

type RootStackParamList = {
  ProcedureDetail: {analysis: ProcedureAnalysis};
};

type ProcedureDetailScreenRouteProp = RouteProp<
  RootStackParamList,
  'ProcedureDetail'
>;
type ProcedureDetailScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ProcedureDetail'
>;

export const ProcedureDetailScreen: React.FC = () => {
  const route = useRoute<ProcedureDetailScreenRouteProp>();
  const navigation = useNavigation<ProcedureDetailScreenNavigationProp>();
  const {analysis} = route.params;
  const {procedure, comparison, recommendations} = analysis;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const handleSourceLink = () => {
    if (comparison.source.url) {
      Linking.openURL(comparison.source.url);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
        </View>

        {/* Procedure Name */}
        <Card style={styles.procedureCard}>
          <Card.Content>
            <Text style={styles.procedureName}>{procedure.description}</Text>
            {procedure.cptCode && (
              <View style={styles.cptBadge}>
                <Text style={styles.cptLabel}>CPT Code: {procedure.cptCode}</Text>
              </View>
            )}
          </Card.Content>
        </Card>

        {/* Flag Status */}
        <Card style={styles.flagCard}>
          <Card.Content>
            <View style={styles.flagContainer}>
              <FlagBadge comparison={comparison} size="large" />
            </View>
            <Text style={styles.explanation}>{comparison.explanation}</Text>
          </Card.Content>
        </Card>

        {/* Price Breakdown */}
        <Card style={styles.priceCard}>
          <Card.Content>
            <Text style={styles.cardTitle}>Price Breakdown</Text>

            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>You were charged:</Text>
              <Text style={styles.chargedAmount}>
                {formatCurrency(comparison.chargedAmount)}
              </Text>
            </View>

            {comparison.medicareRate > 0 && (
              <>
                <View style={styles.divider} />

                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>Medicare pays:</Text>
                  <Text style={styles.medicareAmount}>
                    {formatCurrency(comparison.medicareRate)}
                  </Text>
                </View>

                {comparison.privateInsuranceRange && (
                  <View style={styles.priceRow}>
                    <Text style={styles.priceLabel}>Typical insurance pays:</Text>
                    <Text style={styles.insuranceAmount}>
                      {formatCurrency(comparison.privateInsuranceRange.low)} -{' '}
                      {formatCurrency(comparison.privateInsuranceRange.high)}
                    </Text>
                  </View>
                )}

                <View style={styles.divider} />

                <View style={styles.percentageContainer}>
                  <Text style={styles.percentageLabel}>
                    Your charge is{' '}
                    <Text style={styles.percentageValue}>
                      {comparison.percentageOfMedicare}%
                    </Text>{' '}
                    of Medicare rate
                  </Text>
                </View>
              </>
            )}
          </Card.Content>
        </Card>

        {/* Source Information */}
        <Card style={styles.sourceCard}>
          <Card.Content>
            <Text style={styles.cardTitle}>📋 Price Comparison Source</Text>
            <Text style={styles.sourceName}>{comparison.source.name}</Text>
            <Text style={styles.sourceDetail}>
              Locality: {comparison.source.locality}
            </Text>
            {comparison.source.year && (
              <Text style={styles.sourceDetail}>
                Year: {comparison.source.year}
              </Text>
            )}
            {comparison.source.reference && (
              <Text style={styles.sourceDetail}>
                Reference: {comparison.source.reference}
              </Text>
            )}
            {comparison.source.lastUpdated && (
              <Text style={styles.sourceDetail}>
                Last Updated: {comparison.source.lastUpdated}
              </Text>
            )}
            {comparison.source.url && (
              <TouchableOpacity
                style={styles.sourceLink}
                onPress={handleSourceLink}>
                <Text style={styles.sourceLinkText}>
                  View CMS Documentation →
                </Text>
              </TouchableOpacity>
            )}
          </Card.Content>
        </Card>

        {/* What This Means */}
        <Card style={styles.infoCard}>
          <Card.Content>
            <Text style={styles.cardTitle}>What This Means</Text>
            <Text style={styles.infoText}>
              For {procedure.description}, Medicare pays providers{' '}
              {formatCurrency(comparison.medicareRate)} in your area. Most
              private insurance plans pay 120-200% of Medicare rates. You were
              charged {comparison.percentageOfMedicare}% of Medicare, which is{' '}
              {comparison.flag === '🔴'
                ? 'significantly higher than standard rates'
                : comparison.flag === '🟡'
                ? 'elevated but may be justified'
                : 'within reasonable range'}
              .
            </Text>
          </Card.Content>
        </Card>

        {/* Recommendations */}
        {recommendations && recommendations.length > 0 && (
          <Card style={styles.recommendationsCard}>
            <Card.Content>
              <Text style={styles.cardTitle}>What You Can Do</Text>
              {recommendations.map((rec, index) => (
                <View key={index} style={styles.recommendationItem}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.recommendationText}>{rec}</Text>
                </View>
              ))}
            </Card.Content>
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 16,
  },
  backButton: {
    fontSize: 16,
    color: '#2196F3',
  },
  procedureCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
  },
  procedureName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  cptBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  cptLabel: {
    fontSize: 14,
    color: '#1976D2',
    fontWeight: '600',
  },
  flagCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
  },
  flagContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  explanation: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    textAlign: 'center',
  },
  priceCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  priceLabel: {
    fontSize: 16,
    color: '#666',
  },
  chargedAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  medicareAmount: {
    fontSize: 20,
    fontWeight: '600',
    color: '#4CAF50',
  },
  insuranceAmount: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2196F3',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 16,
  },
  percentageContainer: {
    backgroundColor: '#FFF3E0',
    padding: 16,
    borderRadius: 8,
  },
  percentageLabel: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  percentageValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FF6F00',
  },
  sourceCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
    backgroundColor: '#F5F5F5',
  },
  sourceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  sourceDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  sourceLink: {
    marginTop: 12,
  },
  sourceLinkText: {
    fontSize: 14,
    color: '#2196F3',
    fontWeight: '600',
  },
  infoCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
  },
  infoText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  recommendationsCard: {
    marginHorizontal: 16,
    marginBottom: 32,
    elevation: 2,
    backgroundColor: '#E8F5E9',
  },
  recommendationItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  bullet: {
    fontSize: 18,
    color: '#4CAF50',
    marginRight: 12,
    fontWeight: '700',
  },
  recommendationText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
});

