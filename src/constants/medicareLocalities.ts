/**
 * Medicare Locality Codes by State
 * Based on CMS Medicare Physician Fee Schedule localities
 */

export interface MedicareLocality {
  stateCode: string;
  localityCode: string;
  localityName: string;
}

export const MEDICARE_LOCALITIES: Record<string, Record<string, string>> = {
  AL: {
    '01': 'Birmingham',
    '99': 'Rest of Alabama',
  },
  AK: {
    '01': 'Anchorage',
    '99': 'Rest of Alaska',
  },
  AZ: {
    '01': 'Phoenix',
    '02': 'Tucson',
    '99': 'Rest of Arizona',
  },
  AR: {
    '01': 'Little Rock',
    '99': 'Rest of Arkansas',
  },
  CA: {
    '01': 'Los Angeles',
    '02': 'Sacramento',
    '03': 'San Diego',
    '04': 'San Francisco',
    '05': 'Rest of California',
    '06': 'Santa Barbara',
    '07': 'Alameda/Contra Costa',
    '08': 'Fresno',
    '09': 'Marin/Napa/Solano',
    '10': 'Orange County',
    '11': 'Riverside/San Bernardino',
    '12': 'Santa Clara',
    '13': 'Ventura',
    '14': 'Stockton',
  },
  CO: {
    '01': 'Denver',
    '99': 'Rest of Colorado',
  },
  CT: {
    '01': 'Hartford',
    '99': 'Rest of Connecticut',
  },
  DE: {
    '99': 'State of Delaware',
  },
  FL: {
    '01': 'Miami',
    '02': 'Tampa',
    '03': 'Jacksonville',
    '04': 'Orlando',
    '99': 'Rest of Florida',
  },
  GA: {
    '01': 'Atlanta-Sandy Springs-Marietta',
    '99': 'Rest of Georgia',
  },
  HI: {
    '01': 'Honolulu',
    '99': 'Rest of Hawaii',
  },
  ID: {
    '01': 'Boise',
    '99': 'Rest of Idaho',
  },
  IL: {
    '01': 'Chicago',
    '02': 'East St. Louis',
    '03': 'Peoria',
    '99': 'Rest of Illinois',
  },
  IN: {
    '01': 'Indianapolis',
    '99': 'Rest of Indiana',
  },
  IA: {
    '01': 'Des Moines',
    '99': 'Rest of Iowa',
  },
  KS: {
    '01': 'Kansas City',
    '02': 'Topeka',
    '99': 'Rest of Kansas',
  },
  KY: {
    '01': 'Louisville',
    '99': 'Rest of Kentucky',
  },
  LA: {
    '01': 'New Orleans',
    '02': 'Baton Rouge',
    '99': 'Rest of Louisiana',
  },
  ME: {
    '01': 'Portland',
    '99': 'Rest of Maine',
  },
  MD: {
    '01': 'Baltimore',
    '02': 'Washington, DC Metro',
    '99': 'Rest of Maryland',
  },
  MA: {
    '01': 'Boston',
    '99': 'Rest of Massachusetts',
  },
  MI: {
    '01': 'Detroit',
    '02': 'Grand Rapids',
    '99': 'Rest of Michigan',
  },
  MN: {
    '01': 'Minneapolis-St. Paul',
    '99': 'Rest of Minnesota',
  },
  MS: {
    '01': 'Jackson',
    '99': 'Rest of Mississippi',
  },
  MO: {
    '01': 'Kansas City',
    '02': 'St. Louis',
    '99': 'Rest of Missouri',
  },
  MT: {
    '99': 'State of Montana',
  },
  NE: {
    '01': 'Omaha',
    '99': 'Rest of Nebraska',
  },
  NV: {
    '01': 'Las Vegas',
    '99': 'Rest of Nevada',
  },
  NH: {
    '99': 'State of New Hampshire',
  },
  NJ: {
    '01': 'Northern New Jersey',
    '02': 'Rest of New Jersey',
  },
  NM: {
    '01': 'Albuquerque',
    '99': 'Rest of New Mexico',
  },
  NY: {
    '01': 'Manhattan',
    '02': 'Queens',
    '03': 'Bronx',
    '04': 'Brooklyn',
    '05': 'Staten Island',
    '06': 'Poughkeepsie',
    '07': 'Rochester',
    '08': 'Albany',
    '09': 'Buffalo',
    '10': 'Syracuse',
    '99': 'Rest of New York',
  },
  NC: {
    '01': 'Charlotte',
    '02': 'Raleigh',
    '99': 'Rest of North Carolina',
  },
  ND: {
    '99': 'State of North Dakota',
  },
  OH: {
    '01': 'Cleveland',
    '02': 'Cincinnati',
    '03': 'Columbus',
    '99': 'Rest of Ohio',
  },
  OK: {
    '01': 'Oklahoma City',
    '99': 'Rest of Oklahoma',
  },
  OR: {
    '01': 'Portland',
    '99': 'Rest of Oregon',
  },
  PA: {
    '01': 'Philadelphia',
    '02': 'Pittsburgh',
    '99': 'Rest of Pennsylvania',
  },
  RI: {
    '99': 'State of Rhode Island',
  },
  SC: {
    '01': 'Columbia',
    '99': 'Rest of South Carolina',
  },
  SD: {
    '99': 'State of South Dakota',
  },
  TN: {
    '01': 'Memphis',
    '02': 'Nashville',
    '99': 'Rest of Tennessee',
  },
  TX: {
    '01': 'Dallas',
    '02': 'Houston',
    '03': 'Austin',
    '04': 'San Antonio',
    '05': 'Fort Worth',
    '99': 'Rest of Texas',
  },
  UT: {
    '01': 'Salt Lake City',
    '99': 'Rest of Utah',
  },
  VT: {
    '99': 'State of Vermont',
  },
  VA: {
    '01': 'Richmond',
    '02': 'Norfolk',
    '03': 'Washington, DC Metro',
    '99': 'Rest of Virginia',
  },
  WA: {
    '01': 'Seattle',
    '99': 'Rest of Washington',
  },
  WV: {
    '01': 'Charleston',
    '99': 'Rest of West Virginia',
  },
  WI: {
    '01': 'Milwaukee',
    '99': 'Rest of Wisconsin',
  },
  WY: {
    '99': 'State of Wyoming',
  },
  DC: {
    '01': 'Washington, DC',
  },
  PR: {
    '99': 'Puerto Rico',
  },
};

/**
 * Get Medicare locality code for a state and city
 */
export function getMedicareLocality(
  stateCode: string,
  cityOrZip?: string,
): string {
  const stateLocalities = MEDICARE_LOCALITIES[stateCode.toUpperCase()];
  if (!stateLocalities) {
    return '99'; // Default to "Rest of State"
  }

  // For MVP, default to locality '01' for major cities, '99' for rest
  // In production, this would use zip code mapping or city name matching
  if (cityOrZip && stateLocalities['01']) {
    // Simple check - in production, use proper zip code database
    return '01';
  }

  return '99'; // Default to rest of state
}

/**
 * Get full locality name
 */
export function getLocalityName(stateCode: string, localityCode: string): string {
  const stateLocalities = MEDICARE_LOCALITIES[stateCode.toUpperCase()];
  if (!stateLocalities) {
    return `${stateCode} - Unknown Locality`;
  }

  return stateLocalities[localityCode] || stateLocalities['99'] || 'Unknown';
}

