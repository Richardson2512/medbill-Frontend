/**
 * Type definitions for medical bill data structures
 */

export interface Provider {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  npi?: string; // National Provider Identifier
}

export interface Patient {
  name: string;
  accountNumber?: string;
  dateOfBirth?: string;
}

export interface Procedure {
  description: string;
  cptCode?: string; // Current Procedural Terminology code (5 digits)
  icd10Code?: string; // International Classification of Diseases code
  quantity: number;
  chargeAmount: number;
  units: number;
  dateOfService?: string;
}

export interface ExtractedBillData {
  provider: Provider;
  patient: Patient;
  dateOfService: string;
  procedures: Procedure[];
  totalCharges: number;
  insurancePayment?: number;
  adjustments?: number;
  patientResponsibility?: number;
  insuranceInfo?: {
    payerName?: string;
    policyNumber?: string;
  };
}

export interface PriceComparison {
  flag: '🟢' | '🟡' | '🔴';
  status: 'Fair Price' | 'Elevated Price' | 'Significantly Overpriced';
  explanation: string;
  chargedAmount: number;
  medicareRate: number;
  medicareLocality: string;
  percentageOfMedicare: number;
  privateInsuranceRange?: {
    low: number;
    high: number;
  };
  source: SourceInformation;
}

export interface SourceInformation {
  name: string;
  year: string;
  locality: string;
  reference: string;
  url?: string;
  lastUpdated?: string;
}

export interface ProcedureAnalysis {
  procedure: Procedure;
  comparison: PriceComparison;
  recommendations?: string[];
}

export interface BillAnalysisResult {
  extractedData: ExtractedBillData;
  procedures: ProcedureAnalysis[];
  summary: {
    totalCharges: number;
    totalItems: number;
    redFlags: number;
    yellowFlags: number;
    greenFlags: number;
    estimatedFairPriceRange: {
      low: number;
      high: number;
    };
    potentialOvercharges: number;
  };
  generatedAt: string;
}

export interface ScanHistoryItem {
  id: string;
  userId?: string;
  scanDate: string;
  providerName: string;
  providerState: string;
  totalCharges: number;
  flagsSummary: {
    red: number;
    yellow: number;
    green: number;
  };
  reportData?: BillAnalysisResult;
  createdAt: string;
}

