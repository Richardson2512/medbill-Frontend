/**
 * Home Screen
 * Main entry point with scan button and quick stats
 */

import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Button, Card} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

type RootStackParamList = {
  Home: undefined;
  Camera: undefined;
  Results: {analysisResult: any};
  History: undefined;
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  // TODO: Get stats from store/API
  const stats = {
    billsScanned: 0,
    potentialOvercharges: 0,
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Medical Bill Scanner</Text>
          <Text style={styles.subtitle}>Understand Your Medical Bills</Text>
        </View>

        <Card style={styles.statsCard}>
          <Card.Content>
            <Text style={styles.statsTitle}>Your Stats</Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{stats.billsScanned}</Text>
                <Text style={styles.statLabel}>Bills Scanned</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  ${stats.potentialOvercharges.toLocaleString()}
                </Text>
                <Text style={styles.statLabel}>Potential Overcharges</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        <View style={styles.actionsContainer}>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('Camera')}
            style={styles.primaryButton}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}>
            Scan Medical Bill
          </Button>

          <Button
            mode="outlined"
            onPress={() => navigation.navigate('History')}
            style={styles.secondaryButton}
            contentStyle={styles.buttonContent}>
            View Past Scans
          </Button>
        </View>

        <Card style={styles.infoCard}>
          <Card.Content>
            <Text style={styles.infoTitle}>How It Works</Text>
            <Text style={styles.infoText}>
              1. Take a photo of your medical bill{'\n'}
              2. AI extracts all procedures and charges{'\n'}
              3. Compare prices against Medicare rates{'\n'}
              4. Get a detailed report with recommendations
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.rightsCard}>
          <Card.Content>
            <Text style={styles.rightsTitle}>Know Your Rights</Text>
            <Text style={styles.rightsText}>
              As a patient, you have the right to understand your medical
              bills, request itemized statements, and dispute charges. This app
              helps you identify potential overcharges.
            </Text>
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  statsCard: {
    marginBottom: 24,
    elevation: 2,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2196F3',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  actionsContainer: {
    marginBottom: 24,
  },
  primaryButton: {
    marginBottom: 12,
    paddingVertical: 4,
  },
  secondaryButton: {
    paddingVertical: 4,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  infoCard: {
    marginBottom: 16,
    elevation: 1,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
  rightsCard: {
    marginBottom: 16,
    elevation: 1,
    backgroundColor: '#E3F2FD',
  },
  rightsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1976D2',
    marginBottom: 12,
  },
  rightsText: {
    fontSize: 14,
    color: '#424242',
    lineHeight: 22,
  },
});

