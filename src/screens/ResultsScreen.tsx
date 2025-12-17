/**
 * Results Screen
 * Displays bill analysis results with color-coded flags
 */

import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Card, Chip, FAB} from 'react-native-paper';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {BillAnalysisResult, ProcedureAnalysis} from '../types/bill.types';
import {ProcedureCard} from '../components/ProcedureCard';

type RootStackParamList = {
  Results: {analysisResult: BillAnalysisResult};
  ProcedureDetail: {analysis: ProcedureAnalysis};
  Report: {analysisResult: BillAnalysisResult};
};

type ResultsScreenRouteProp = RouteProp<RootStackParamList, 'Results'>;
type ResultsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Results'
>;

type FilterType = 'all' | 'red' | 'yellow' | 'green';

export const ResultsScreen: React.FC = () => {
  const route = useRoute<ResultsScreenRouteProp>();
  const navigation = useNavigation<ResultsScreenNavigationProp>();
  const {analysisResult} = route.params;
  const [filter, setFilter] = useState<FilterType>('all');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const filteredProcedures = analysisResult.procedures.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'red') return item.comparison.flag === '🔴';
    if (filter === 'yellow') return item.comparison.flag === '🟡';
    if (filter === 'green') return item.comparison.flag === '🟢';
    return true;
  });

  // Sort procedures: red flags first, then yellow, then green
  const sortedProcedures = [...filteredProcedures].sort((a, b) => {
    const order = {'🔴': 0, '🟡': 1, '🟢': 2};
    return (
      order[a.comparison.flag] - order[b.comparison.flag] ||
      b.procedure.chargeAmount - a.procedure.chargeAmount
    );
  });

  const handleProcedurePress = (analysis: ProcedureAnalysis) => {
    navigation.navigate('ProcedureDetail', {analysis});
  };

  const handleViewReport = () => {
    navigation.navigate('Report', {analysisResult});
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleViewReport}>
            <Text style={styles.reportButton}>View Full Report</Text>
          </TouchableOpacity>
        </View>

        {/* Provider Info */}
        <Card style={styles.providerCard}>
          <Card.Content>
            <Text style={styles.providerName}>
              {analysisResult.extractedData.provider.name}
            </Text>
            <Text style={styles.providerLocation}>
              {analysisResult.extractedData.provider.city},{' '}
              {analysisResult.extractedData.provider.state}
            </Text>
            <Text style={styles.dateOfService}>
              Date of Service: {analysisResult.extractedData.dateOfService}
            </Text>
          </Card.Content>
        </Card>

        {/* Alert Banner if red flags exist */}
        {analysisResult.summary.redFlags > 0 && (
          <Card style={styles.alertCard}>
            <Card.Content>
              <Text style={styles.alertTitle}>
                ⚠️ We found {analysisResult.summary.redFlags} charge(s) that
                may be significantly overpriced
              </Text>
              <Text style={styles.alertAmount}>
                Potential overcharges: {formatCurrency(analysisResult.summary.potentialOvercharges)}
              </Text>
            </Card.Content>
          </Card>
        )}

        {/* Summary Card */}
        <Card style={styles.summaryCard}>
          <Card.Content>
            <Text style={styles.summaryTitle}>Summary</Text>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Total Charges</Text>
                <Text style={styles.summaryValue}>
                  {formatCurrency(analysisResult.summary.totalCharges)}
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Items Analyzed</Text>
                <Text style={styles.summaryValue}>
                  {analysisResult.summary.totalItems}
                </Text>
              </View>
            </View>

            <View style={styles.flagSummary}>
              <View style={styles.flagItem}>
                <Text style={styles.flagEmoji}>🔴</Text>
                <Text style={styles.flagCount}>
                  {analysisResult.summary.redFlags} overpriced
                </Text>
              </View>
              <View style={styles.flagItem}>
                <Text style={styles.flagEmoji}>🟡</Text>
                <Text style={styles.flagCount}>
                  {analysisResult.summary.yellowFlags} elevated
                </Text>
              </View>
              <View style={styles.flagItem}>
                <Text style={styles.flagEmoji}>🟢</Text>
                <Text style={styles.flagCount}>
                  {analysisResult.summary.greenFlags} fair
                </Text>
              </View>
            </View>

            <View style={styles.priceRange}>
              <Text style={styles.priceRangeLabel}>Estimated Fair Price Range:</Text>
              <Text style={styles.priceRangeValue}>
                {formatCurrency(analysisResult.summary.estimatedFairPriceRange.low)} -{' '}
                {formatCurrency(analysisResult.summary.estimatedFairPriceRange.high)}
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* Filter Chips */}
        <View style={styles.filterContainer}>
          <Chip
            selected={filter === 'all'}
            onPress={() => setFilter('all')}
            style={styles.filterChip}>
            All Items
          </Chip>
          <Chip
            selected={filter === 'red'}
            onPress={() => setFilter('red')}
            style={[styles.filterChip, filter === 'red' && styles.filterChipSelected]}
            textStyle={filter === 'red' ? styles.filterChipTextSelected : undefined}>
            🔴 Overpriced
          </Chip>
          <Chip
            selected={filter === 'yellow'}
            onPress={() => setFilter('yellow')}
            style={styles.filterChip}>
            🟡 Elevated
          </Chip>
          <Chip
            selected={filter === 'green'}
            onPress={() => setFilter('green')}
            style={styles.filterChip}>
            🟢 Fair Prices
          </Chip>
        </View>

        {/* Procedures List */}
        <Text style={styles.proceduresTitle}>Procedures</Text>
        <FlatList
          data={sortedProcedures}
          renderItem={({item}) => (
            <ProcedureCard
              analysis={item}
              onPress={() => handleProcedurePress(item)}
            />
          )}
          keyExtractor={(item, index) =>
            item.procedure.cptCode || `procedure-${index}`
          }
          scrollEnabled={false}
        />
      </ScrollView>

      {/* Floating Action Button */}
      <FAB
        icon="file-document-outline"
        label="View Full Report"
        style={styles.fab}
        onPress={handleViewReport}
      />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  backButton: {
    fontSize: 16,
    color: '#2196F3',
  },
  reportButton: {
    fontSize: 16,
    color: '#2196F3',
    fontWeight: '600',
  },
  providerCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
  },
  providerName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  providerLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  dateOfService: {
    fontSize: 14,
    color: '#666',
  },
  alertCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#FFEBEE',
    elevation: 2,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#C62828',
    marginBottom: 8,
  },
  alertAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#C62828',
  },
  summaryCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  flagSummary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  flagItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flagEmoji: {
    fontSize: 24,
    marginRight: 8,
  },
  flagCount: {
    fontSize: 14,
    color: '#666',
  },
  priceRange: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  priceRangeLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  priceRangeValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2196F3',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 8,
  },
  filterChip: {
    marginRight: 8,
  },
  filterChipSelected: {
    backgroundColor: '#2196F3',
  },
  filterChipTextSelected: {
    color: '#fff',
  },
  proceduresTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#2196F3',
  },
});

