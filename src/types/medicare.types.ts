/**
 * Type definitions for Medicare rate data structures
 */

export interface MedicareRate {
  id?: string;
  cptCode: string;
  description: string;
  facilityRate?: number;
  nonFacilityRate?: number;
  locality: string;
  localityName: string;
  year: number;
  effectiveDate: string;
  sourceUrl?: string;
}

export interface MedicareLocality {
  stateCode: string;
  localityCode: string;
  localityName: string;
}

export interface PrivateInsuranceRate {
  id?: string;
  cptCode: string;
  zipCode: string;
  percentile50: number; // Median
  percentile80: number;
  percentile95: number;
  year: number;
  source: string;
}

export interface CPTCodeInfo {
  code: string;
  description: string;
  category?: string;
  longDescription?: string;
}

export interface PriceComparisonParams {
  cptCode: string;
  chargedAmount: number;
  locality: string;
  zipCode?: string;
  stateCode?: string;
}

