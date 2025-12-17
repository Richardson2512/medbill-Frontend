/**
 * Medicare Rate Service
 * Handles fetching and comparing prices against Medicare rates
 */

import {
  MedicareRate,
  PriceComparisonParams,
  PriceComparison,
} from '../types/medicare.types';
import {getLocalityName, getMedicareLocality} from '../constants/medicareLocalities';
import {getCPTCodeInfo} from '../constants/cptCodes';

// This would normally come from your backend API
const API_BASE_URL = process.env.API_BASE_URL || 'https://api.yourdomain.com';

/**
 * Fetch Medicare rate for a CPT code and locality
 * In production, this would call your backend API
 */
export async function getMedicareRate(
  cptCode: string,
  locality: string,
  stateCode: string,
): Promise<MedicareRate | null> {
  try {
    // For MVP, we'll use mock data
    // In production, this would fetch from your database/API
    const response = await fetch(
      `${API_BASE_URL}/api/rates/medicare?cptCode=${cptCode}&locality=${locality}&state=${stateCode}`,
    );

    if (!response.ok) {
      // Fallback to mock data for MVP
      return getMockMedicareRate(cptCode, locality, stateCode);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching Medicare rate:', error);
    // Fallback to mock data for MVP
    return getMockMedicareRate(cptCode, locality, stateCode);
  }
}

/**
 * Get private insurance rate range (Fair Health or similar)
 */
export async function getPrivateInsuranceRange(
  cptCode: string,
  zipCode?: string,
): Promise<{low: number; high: number} | null> {
  try {
    if (!zipCode) {
      return null;
    }

    const response = await fetch(
      `${API_BASE_URL}/api/rates/fair-health?cptCode=${cptCode}&zipCode=${zipCode}`,
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return {
      low: data.percentile50 || 0,
      high: data.percentile80 || 0,
    };
  } catch (error) {
    console.error('Error fetching private insurance rates:', error);
    return null;
  }
}

/**
 * Compare charged price against Medicare and determine flag status
 */
export async function comparePrice(
  params: PriceComparisonParams,
): Promise<PriceComparison> {
  const {cptCode, chargedAmount, locality, zipCode, stateCode} = params;

  // Get Medicare rate
  const medicareRate = await getMedicareRate(
    cptCode,
    locality,
    stateCode || '',
  );

  if (!medicareRate || !medicareRate.nonFacilityRate) {
    return {
      flag: '🟡',
      status: 'Elevated Price',
      explanation: 'Unable to find standard Medicare rate for comparison.',
      chargedAmount,
      medicareRate: 0,
      medicareLocality: locality,
      percentageOfMedicare: 0,
      source: {
        name: 'Medicare Physician Fee Schedule',
        year: new Date().getFullYear().toString(),
        locality: getLocalityName(stateCode || '', locality),
        reference: `CPT-${cptCode}-UNKNOWN`,
        url: 'https://www.cms.gov/medicare/payment/fee-schedules/physician',
      },
    };
  }

  // Use non-facility rate (typical for office visits and procedures)
  const medicareAmount = medicareRate.nonFacilityRate || medicareRate.facilityRate || 0;

  // Get private insurance range if available
  const privateRange = zipCode
    ? await getPrivateInsuranceRange(cptCode, zipCode)
    : null;

  // Calculate percentage of Medicare
  const percentageOfMedicare =
    medicareAmount > 0 ? (chargedAmount / medicareAmount) * 100 : 0;

  // Determine flag based on percentage
  let flag: '🟢' | '🟡' | '🔴';
  let status: 'Fair Price' | 'Elevated Price' | 'Significantly Overpriced';
  let explanation: string;

  if (percentageOfMedicare <= 150) {
    flag = '🟢';
    status = 'Fair Price';
    explanation =
      'This charge is within reasonable range compared to Medicare rates. Most private insurance plans pay 120-200% of Medicare rates.';
  } else if (percentageOfMedicare <= 250) {
    flag = '🟡';
    status = 'Elevated Price';
    explanation =
      'This charge is higher than typical but may be justified based on facility type, complexity, or regional factors. Consider requesting an itemized bill or billing review.';
  } else {
    flag = '🔴';
    status = 'Significantly Overpriced';
    explanation =
      'This charge is substantially higher than standard Medicare rates and significantly above typical private insurance payments. This may warrant investigation, negotiation, or dispute. You may want to request a billing review or contact the provider for clarification.';
  }

  return {
    flag,
    status,
    explanation,
    chargedAmount,
    medicareRate: medicareAmount,
    medicareLocality: locality,
    percentageOfMedicare: Math.round(percentageOfMedicare),
    privateInsuranceRange: privateRange,
    source: {
      name: 'Medicare Physician Fee Schedule',
      year: medicareRate.year.toString(),
      locality: medicareRate.localityName,
      reference: `CMS-MPFS-${medicareRate.year}-${cptCode}-${locality}`,
      url: 'https://www.cms.gov/medicare/payment/fee-schedules/physician',
      lastUpdated: medicareRate.effectiveDate,
    },
  };
}

/**
 * Mock Medicare rate for MVP development
 * In production, this would be replaced with actual database queries
 */
function getMockMedicareRate(
  cptCode: string,
  locality: string,
  stateCode: string,
): MedicareRate | null {
  // Mock rates based on common CPT codes
  // These are approximate values and should be replaced with actual CMS data
  const mockRates: Record<string, {facility: number; nonFacility: number}> = {
    '99213': {facility: 85, nonFacility: 110},
    '99214': {facility: 120, nonFacility: 140},
    '99215': {facility: 175, nonFacility: 200},
    '80053': {facility: 15, nonFacility: 25},
    '85027': {facility: 12, nonFacility: 18},
    '70450': {facility: 250, nonFacility: 280},
    '72141': {facility: 500, nonFacility: 550},
    '71020': {facility: 45, nonFacility: 65},
    '99284': {facility: 300, nonFacility: 320},
    '99285': {facility: 450, nonFacility: 500},
  };

  const rates = mockRates[cptCode];
  if (!rates) {
    return null;
  }

  const cptInfo = getCPTCodeInfo(cptCode);

  return {
    cptCode,
    description: cptInfo?.description || `CPT Code ${cptCode}`,
    facilityRate: rates.facility,
    nonFacilityRate: rates.nonFacility,
    locality,
    localityName: getLocalityName(stateCode, locality),
    year: new Date().getFullYear(),
    effectiveDate: new Date().toISOString().split('T')[0],
    sourceUrl: 'https://www.cms.gov/medicare/payment/fee-schedules/physician',
  };
}

