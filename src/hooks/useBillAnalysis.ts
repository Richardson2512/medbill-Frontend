/**
 * Custom hook for bill analysis
 */

import {useState} from 'react';
import {analyzeMedicalBill} from '../services/analysis.service';
import {BillAnalysisResult} from '../types/bill.types';

interface UseBillAnalysisReturn {
  analyzing: boolean;
  error: string | null;
  result: BillAnalysisResult | null;
  analyzeBill: (imageUri: string) => Promise<void>;
  reset: () => void;
}

export function useBillAnalysis(): UseBillAnalysisReturn {
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<BillAnalysisResult | null>(null);

  const analyzeBill = async (imageUri: string) => {
    setAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const analysisResult = await analyzeMedicalBill(imageUri);
      setResult(analysisResult);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to analyze bill';
      setError(errorMessage);
      console.error('Bill analysis error:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  const reset = () => {
    setAnalyzing(false);
    setError(null);
    setResult(null);
  };

  return {
    analyzing,
    error,
    result,
    analyzeBill,
    reset,
  };
}

