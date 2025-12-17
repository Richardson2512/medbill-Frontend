/**
 * Common CPT Codes Library
 * Top 100 most common medical procedures for MVP
 */

export interface CPTCode {
  code: string;
  description: string;
  category: string;
  longDescription?: string;
}

export const COMMON_CPT_CODES: Record<string, CPTCode> = {
  // Office Visits
  '99213': {
    code: '99213',
    description: 'Office visit, established patient, low complexity',
    category: 'Office/Outpatient Visit',
    longDescription: 'Office or other outpatient visit for the evaluation and management of an established patient',
  },
  '99214': {
    code: '99214',
    description: 'Office visit, established patient, moderate complexity',
    category: 'Office/Outpatient Visit',
    longDescription: 'Office or other outpatient visit for the evaluation and management of an established patient',
  },
  '99215': {
    code: '99215',
    description: 'Office visit, established patient, high complexity',
    category: 'Office/Outpatient Visit',
  },
  '99203': {
    code: '99203',
    description: 'Office visit, new patient, low complexity',
    category: 'Office/Outpatient Visit',
  },
  '99204': {
    code: '99204',
    description: 'Office visit, new patient, moderate complexity',
    category: 'Office/Outpatient Visit',
  },
  '99205': {
    code: '99205',
    description: 'Office visit, new patient, high complexity',
    category: 'Office/Outpatient Visit',
  },

  // Emergency Department
  '99284': {
    code: '99284',
    description: 'Emergency department visit, moderate severity',
    category: 'Emergency Department',
  },
  '99285': {
    code: '99285',
    description: 'Emergency department visit, high severity',
    category: 'Emergency Department',
  },

  // Lab Tests
  '80053': {
    code: '80053',
    description: 'Comprehensive metabolic panel',
    category: 'Laboratory',
  },
  '85027': {
    code: '85027',
    description: 'Complete blood count (CBC) with automated differential',
    category: 'Laboratory',
  },
  '80061': {
    code: '80061',
    description: 'Lipid panel',
    category: 'Laboratory',
  },
  '81001': {
    code: '81001',
    description: 'Urinalysis, automated',
    category: 'Laboratory',
  },
  '85610': {
    code: '85610',
    description: 'Prothrombin time (PT)',
    category: 'Laboratory',
  },

  // Radiology
  '70450': {
    code: '70450',
    description: 'CT head without contrast',
    category: 'Radiology',
  },
  '72141': {
    code: '72141',
    description: 'MRI lumbar spine without contrast',
    category: 'Radiology',
  },
  '71020': {
    code: '71020',
    description: 'Chest X-ray, 2 views',
    category: 'Radiology',
  },
  '76700': {
    code: '76700',
    description: 'Ultrasound, abdominal, complete',
    category: 'Radiology',
  },
  '73060': {
    code: '73060',
    description: 'X-ray, knee, 3 views',
    category: 'Radiology',
  },

  // Procedures
  '12001': {
    code: '12001',
    description: 'Simple repair of superficial wounds, face/ears/eyelids',
    category: 'Surgery',
  },
  '36415': {
    code: '36415',
    description: 'Routine venipuncture for collection of specimen',
    category: 'Surgery',
  },
  '93000': {
    code: '93000',
    description: 'Electrocardiogram, routine ECG with at least 12 leads',
    category: 'Cardiology',
  },
  '45378': {
    code: '45378',
    description: 'Colonoscopy, flexible, diagnostic',
    category: 'Gastroenterology',
  },
  '29881': {
    code: '29881',
    description: 'Knee arthroscopy, surgical, with meniscectomy',
    category: 'Orthopedic Surgery',
  },
};

/**
 * Get CPT code information
 */
export function getCPTCodeInfo(code: string): CPTCode | undefined {
  return COMMON_CPT_CODES[code];
}

/**
 * Search CPT codes by description
 */
export function searchCPTCodes(searchTerm: string): CPTCode[] {
  const term = searchTerm.toLowerCase();
  return Object.values(COMMON_CPT_CODES).filter(
    cpt =>
      cpt.code.toLowerCase().includes(term) ||
      cpt.description.toLowerCase().includes(term) ||
      cpt.category.toLowerCase().includes(term),
  );
}

