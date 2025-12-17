/**
 * Bill Analysis Service
 * Orchestrates the full bill analysis workflow
 */

import {ExtractedBillData, BillAnalysisResult, ProcedureAnalysis} from '../types/bill.types';
import {PriceComparisonParams} from '../types/medicare.types';
import {analyzeBillWithGPT4V, validateExtractedBillData} from './gpt4v.service';
import {comparePrice} from './medicare.service';
import {getMedicareLocality} from '../constants/medicareLocalities';

/**
 * Process a bill image and generate complete analysis
 */
export async function analyzeMedicalBill(
  imageUri: string,
): Promise<BillAnalysisResult> {
  // Step 1: Extract bill data using GPT-4V
  const extractedData = await analyzeBillWithGPT4V(imageUri);

  // Step 2: Validate extracted data
  const validation = validateExtractedBillData(extractedData);
  if (!validation.valid) {
    throw new Error(`Invalid bill data: ${validation.errors.join(', ')}`);
  }

  // Step 3: Determine Medicare locality
  const stateCode = extractedData.provider.state.toUpperCase();
  const localityCode = getMedicareLocality(
    stateCode,
    extractedData.provider.city || extractedData.provider.zip,
  );

  // Step 4: Compare each procedure against Medicare rates
  const procedureAnalyses: ProcedureAnalysis[] = [];

  for (const procedure of extractedData.procedures) {
    if (!procedure.cptCode) {
      // Skip procedures without CPT codes (can't compare)
      procedureAnalyses.push({
        procedure,
        comparison: {
          flag: '🟡',
          status: 'Elevated Price',
          explanation:
            'Unable to compare - CPT code not found on bill. Request an itemized bill with CPT codes for accurate pricing analysis.',
          chargedAmount: procedure.chargeAmount,
          medicareRate: 0,
          medicareLocality: localityCode,
          percentageOfMedicare: 0,
          source: {
            name: 'N/A - CPT Code Missing',
            year: new Date().getFullYear().toString(),
            locality: 'N/A',
            reference: 'N/A',
          },
        },
      });
      continue;
    }

    // Compare price
    const comparisonParams: PriceComparisonParams = {
      cptCode: procedure.cptCode,
      chargedAmount: procedure.chargeAmount,
      locality: localityCode,
      zipCode: extractedData.provider.zip,
      stateCode,
    };

    const comparison = await comparePrice(comparisonParams);

    procedureAnalyses.push({
      procedure,
      comparison,
      recommendations: generateRecommendations(comparison),
    });
  }

  // Step 5: Generate summary
  const summary = generateSummary(extractedData, procedureAnalyses);

  // Step 6: Return complete analysis
  return {
    extractedData,
    procedures: procedureAnalyses,
    summary,
    generatedAt: new Date().toISOString(),
  };
}

/**
 * Generate recommendations based on comparison
 */
function generateRecommendations(
  comparison: PriceComparison,
): string[] {
  const recommendations: string[] = [];

  if (comparison.flag === '🔴') {
    recommendations.push('Request an itemized bill with CPT codes');
    recommendations.push('Ask the billing department for a billing review');
    recommendations.push('Contact patient financial services for assistance');
    recommendations.push('Consider filing an appeal with your insurance if applicable');
    recommendations.push('Request information about financial assistance programs');
  } else if (comparison.flag === '🟡') {
    recommendations.push('Request clarification on the billing charges');
    recommendations.push('Ask if there are any discounts or payment plans available');
  } else {
    recommendations.push('This charge appears to be within reasonable range');
  }

  return recommendations;
}

/**
 * Generate summary statistics
 */
function generateSummary(
  extractedData: ExtractedBillData,
  procedures: ProcedureAnalysis[],
): BillAnalysisResult['summary'] {
  let redFlags = 0;
  let yellowFlags = 0;
  let greenFlags = 0;
  let potentialOvercharges = 0;

  const fairPriceLow: number[] = [];
  const fairPriceHigh: number[] = [];

  for (const analysis of procedures) {
    const {comparison, procedure} = analysis;

    if (comparison.flag === '🔴') {
      redFlags++;
      // Estimate overcharge as amount above 200% of Medicare
      const reasonableMax = comparison.medicareRate * 2;
      if (procedure.chargeAmount > reasonableMax) {
        potentialOvercharges += procedure.chargeAmount - reasonableMax;
      }
    } else if (comparison.flag === '🟡') {
      yellowFlags++;
    } else {
      greenFlags++;
    }

    // Estimate fair price range
    if (comparison.medicareRate > 0) {
      fairPriceLow.push(comparison.medicareRate * 1.2); // 120% of Medicare
      fairPriceHigh.push(
        comparison.privateInsuranceRange?.high ||
          comparison.medicareRate * 2, // 200% of Medicare
      );
    }
  }

  const estimatedFairPriceLow =
    fairPriceLow.length > 0
      ? Math.round(fairPriceLow.reduce((a, b) => a + b, 0))
      : 0;
  const estimatedFairPriceHigh =
    fairPriceHigh.length > 0
      ? Math.round(fairPriceHigh.reduce((a, b) => a + b, 0))
      : 0;

  return {
    totalCharges: extractedData.totalCharges,
    totalItems: procedures.length,
    redFlags,
    yellowFlags,
    greenFlags,
    estimatedFairPriceRange: {
      low: estimatedFairPriceLow,
      high: estimatedFairPriceHigh,
    },
    potentialOvercharges: Math.round(potentialOvercharges),
  };
}

