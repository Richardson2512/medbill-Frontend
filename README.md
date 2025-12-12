# Product Requirements Document: Medical Bill Scanner Mobile App (USA MVP)

## Product Overview
Build a mobile application (iOS & Android) for the US market that enables users to scan medical bills using their phone camera, receive instant AI-powered price analysis against Medicare and standard US medical rates, and get a detailed report with red/green flag indicators for each treatment cost.

## Core User Flow

### Primary Flow
1. User opens the mobile application
2. User taps "Scan Bill" button
3. Camera opens with bill scanning interface
4. User captures photo of medical bill
5. GPT-4V processes and extracts bill information
6. AI compares each treatment price against US standard rates
7. Results displayed with color-coded flags (🔴 Red = Overpriced, 🟢 Green = Fair price)
8. Final report shows comparison sources for each treatment

### Flow Duration
- Camera capture: Instant
- AI processing: 5-10 seconds
- Results display: Immediate after processing

## Feature Requirements

### 1. Camera/Scanner Interface
**Requirements:**
- Native camera integration with optimized settings for document capture
- Auto-focus on document edges
- Document edge detection with visual guides
- Brightness/contrast adjustment recommendations
- Flash toggle for low-light conditions
- Manual capture button
- Option to import from photo gallery
- Retake option before submitting

**UI Elements:**
- Viewfinder with document frame overlay
- "Capture" button (large, centered)
- "Use from Gallery" option
- Tips overlay: "Ensure bill is flat and well-lit"
- Preview screen after capture with "Use This Photo" or "Retake"

### 2. Bill Processing & Analysis

**AI Processing Steps (GPT-4V):**
1. **OCR & Data Extraction**
   - Extract healthcare provider name and location (hospital, clinic, physician practice)
   - Identify each service/procedure line item with CPT codes
   - Extract procedure names, quantities, and charges
   - Capture date of service and patient information
   - Extract diagnostic codes (ICD-10)
   - Identify insurance information if present
   - Extract total charges, adjustments, and patient responsibility

2. **Location Detection**
   - Identify state from bill address or user location
   - Load relevant Medicare locality rates
   - Consider regional cost variations

3. **Price Comparison**
   - Match each CPT code with Medicare Physician Fee Schedule rates
   - Compare facility charges with CMS Outpatient Prospective Payment System (OPPS)
   - Check drug prices against average wholesale price (AWP)
   - Calculate percentage difference from fair market rates
   - Assign flag status based on variance

4. **Source Attribution**
   - Link each comparison to specific CMS rate schedule
   - Include Medicare locality adjustment
   - Reference Fair Health Consumer database when applicable
   - Include reference date of pricing standard

**Processing Indicators:**
- Loading animation with status messages:
  - "Scanning bill..." (0-2 sec)
  - "Reading procedures..." (2-5 sec)
  - "Comparing prices..." (5-8 sec)
  - "Generating report..." (8-10 sec)

### 3. Results Display - Color-Coded Flags

**Flag Logic:**
- 🟢 **Green Flag**: Price is within Medicare rates or 100-150% of Medicare (reasonable)
- 🟡 **Yellow Flag**: Price is 150-250% of Medicare rates (elevated)
- 🔴 **Red Flag**: Price is 250%+ of Medicare rates (significantly overcharged)

**Note:** Medicare rates often represent the baseline; private insurance typically negotiates rates 120-200% of Medicare, so 250%+ is clearly excessive.

**Results Screen Layout:**

**Header Section:**
- Provider name and location
- Date of service
- Total charges
- Overall status badge (e.g., "4 items flagged as overpriced")

**Procedure List (Scrollable):**
Each procedure item shows:
- Flag emoji (🔴/🟡/🟢) prominently displayed
- Procedure/service name
- CPT code (if available)
- Price charged
- Fair market range
- Percentage difference
- "Tap for details" indicator

**Detail View (on tap):**
- Full procedure description
- CPT Code: XXXXX
- Your bill amount: $XXX
- Medicare rate: $XXX (with locality adjustment)
- Typical private insurance range: $XXX - $XXX
- Your charge is: XXX% of Medicare rate
- Source information with reference
- Explanation of why flagged
- What you can do about it

### 4. Final Report

**Report Components:**

**Summary Section:**
- Scan date and time
- Healthcare provider details
- Total items scanned: X
- Red flags: X items ($XXX potentially overcharged)
- Yellow flags: X items
- Green flags: X items
- Estimated fair price range: $XXX - $XXX
- Potential overcharges identified: $XXX

**Detailed Breakdown:**
Each procedure shows:
- Procedure name and CPT code
- Flag status with icon
- Price comparison table
- **Source citation** (most important):
  - "Based on: Medicare Physician Fee Schedule 2025, Locality: [City/State]"
  - "Reference: CMS Hospital Outpatient Prospective Payment System"
  - "Source: Fair Health Consumer Cost Lookup"
  - "Average Private Insurance: Fair Health Database 2025"
  - Include reference links where applicable

**What This Means:**
- Plain language explanation for each flag
- Your rights as a patient
- Steps to dispute or negotiate

**Actions Available:**
- Share report (PDF/image)
- Save to history
- Export for insurance appeal
- Get billing dispute templates
- Find patient advocates

### 5. Source Attribution System - US Healthcare

**Source Database:**
Maintain references to:
- **Medicare Physician Fee Schedule (MPFS)** - by locality
- **CMS Hospital Outpatient Prospective Payment System (OPPS)**
- **Average Wholesale Price (AWP)** for drugs
- **Fair Health Consumer** database for private insurance rates
- **State-specific balance billing laws**
- **Usual, Customary, and Reasonable (UCR)** rates by region

**Display Format for Sources:**
```
Procedure: Office Visit, Established Patient (15-29 min)
CPT Code: 99214
Billed Amount: $350
Medicare Rate: $138.43 (Atlanta, GA - Locality 01)
Typical Range: $175 - $250 (Private Insurance)
Your Charge: 253% of Medicare rate

Source: CMS Medicare Physician Fee Schedule 2025
Locality: Atlanta-Sandy Springs-Marietta, GA
Reference: MPFS-2025-Q1
Last Updated: January 1, 2025
View CMS Documentation: [Link]

Flag: 🔴 RED - Significantly above fair market rates
```

## Technical Architecture

### Mobile Framework
**React Native** (supports both iOS and Android)

**Key Libraries:**
- **Camera**: react-native-vision-camera
- **Image Handling**: react-native-image-picker, react-native-image-crop-picker
- **AI/OCR**: OpenAI GPT-4V API
- **Storage**: AsyncStorage for local data, SQLite for bill history
- **Navigation**: React Navigation
- **UI Components**: React Native Paper
- **State Management**: React Query + Zustand
- **PDF Generation**: react-native-pdf-lib
- **Network**: Axios for API calls

### AI Integration - GPT-4V

**OpenAI GPT-4V API Implementation:**
```javascript
const analyzeBillWithGPT4V = async (imageUri) => {
  // Convert image to base64
  const base64Image = await convertToBase64(imageUri);
  
  // Send to OpenAI GPT-4V API
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4-vision-preview',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            },
            {
              type: 'text',
              text: `Extract all information from this US medical bill in JSON format. Be precise with CPT codes and amounts:
              {
                "provider": {
                  "name": "",
                  "address": "",
                  "city": "",
                  "state": "",
                  "zip": "",
                  "npi": ""
                },
                "patient": {
                  "name": "",
                  "accountNumber": ""
                },
                "dateOfService": "",
                "procedures": [
                  {
                    "description": "",
                    "cptCode": "",
                    "icd10Code": "",
                    "quantity": 1,
                    "chargeAmount": 0,
                    "units": 1
                  }
                ],
                "totalCharges": 0,
                "insurancePayment": 0,
                "adjustments": 0,
                "patientResponsibility": 0
              }
              
              Important: Extract exact CPT codes (5-digit codes like 99214, 80053, etc.). If no CPT code is visible, extract the procedure description accurately.`
            }
          ]
        }
      ],
      max_tokens: 4096
    })
  });
  
  const data = await response.json();
  return JSON.parse(data.choices[0].message.content);
};
```

### Backend Services

**API Endpoints:**
- `POST /api/scan/analyze` - Process bill image with GPT-4V, return parsed data + analysis
- `GET /api/rates/medicare?cptCode={code}&locality={locality}` - Fetch Medicare rates
- `GET /api/rates/fair-health?cptCode={code}&zipCode={zip}` - Get private insurance estimates
- `GET /api/cpt/lookup?code={code}` - Get CPT code descriptions
- `POST /api/reports/save` - Save report to user history
- `GET /api/reports/history` - Retrieve past scans
- `GET /api/localities?state={state}` - Get Medicare locality codes

**Database Schema:**
```
MedicareRates:
- id
- cptCode
- description
- facilityRate
- nonFacilityRate
- locality
- year
- effectiveDate
- sourceUrl

PrivateInsuranceRates:
- id
- cptCode
- zipCode
- percentile50 (median)
- percentile80
- percentile95
- year
- source

UserScans:
- id
- userId
- scanDate
- providerName
- providerState
- procedures (JSON)
- totalCharges
- flagsSummary
- reportUrl
```

### US Healthcare Pricing Standards Database

**Data Sources to Integrate:**

1. **Medicare Rates (Primary Baseline):**
   - CMS Physician Fee Schedule (https://www.cms.gov/medicare/payment/fee-schedules/physician)
   - Update quarterly
   - Include geographic adjustment factors (GPCI)
   - Store by Medicare locality codes

2. **Hospital/Facility Rates:**
   - CMS Hospital Outpatient Prospective Payment System (OPPS)
   - Ambulatory Surgical Center (ASC) rates
   - Update annually

3. **Fair Market Estimates:**
   - Fair Health Consumer database (subscription service)
   - Healthcare Bluebook data
   - State-specific rate transparency databases

4. **Drug Pricing:**
   - Average Wholesale Price (AWP) from First Databank
   - Medicare Part B drug pricing
   - NDC (National Drug Codes) cross-reference

**Medicare Locality Mapping:**
```javascript
const MEDICARE_LOCALITIES = {
  'GA': {
    '01': 'Atlanta-Sandy Springs-Marietta',
    '99': 'Rest of Georgia'
  },
  'CA': {
    '03': 'Marin/Napa/Solano',
    '05': 'Rest of California',
    '18': 'Los Angeles',
    '26': 'Anaheim/Santa Ana'
  },
  // ... all states and localities
};
```

**Price Comparison Logic:**
```javascript
const comparePrice = async (procedure, chargedAmount, locality, zipCode) => {
  // 1. Get Medicare rate for locality
  const medicareRate = await getMedicareRate(procedure.cptCode, locality);
  
  if (!medicareRate) {
    return { flag: 'unknown', message: 'Unable to find standard rate' };
  }
  
  // 2. Get typical private insurance range (if available)
  const privateRange = await getPrivateInsuranceRange(procedure.cptCode, zipCode);
  
  // 3. Calculate percentage of Medicare
  const percentageOfMedicare = (chargedAmount / medicareRate.amount) * 100;
  
  // 4. Determine flag
  let flag, status, explanation;
  
  if (percentageOfMedicare <= 150) {
    flag = '🟢';
    status = 'Fair Price';
    explanation = 'This charge is within reasonable range for this procedure.';
  } else if (percentageOfMedicare <= 250) {
    flag = '🟡';
    status = 'Elevated Price';
    explanation = 'This charge is higher than typical but may be justified based on facility or complexity.';
  } else {
    flag = '🔴';
    status = 'Significantly Overpriced';
    explanation = 'This charge is substantially higher than standard rates and may warrant investigation or negotiation.';
  }
  
  return {
    flag,
    status,
    explanation,
    chargedAmount,
    medicareRate: medicareRate.amount,
    medicareLocality: locality,
    percentageOfMedicare: percentageOfMedicare.toFixed(0),
    privateInsuranceRange: privateRange ? {
      low: privateRange.percentile50,
      high: privateRange.percentile80
    } : null,
    source: {
      name: 'Medicare Physician Fee Schedule',
      year: '2025',
      locality: medicareRate.localityName,
      reference: `CMS-MPFS-2025-${procedure.cptCode}`,
      url: `https://www.cms.gov/medicare/payment/fee-schedules/physician`
    }
  };
};
```

## Screen-by-Screen Design

### 1. Home Screen
- App logo and tagline: "Understand Your Medical Bills"
- Large "Scan Medical Bill" button (primary action)
- "Past Scans" button (secondary)
- Quick stats: "X bills scanned, $Y potential overcharges found"
- Educational banner: "Know your rights as a patient"
- Link to "How it works"

### 2. Camera Screen
- Full-screen camera viewfinder
- Document frame overlay (guides for alignment)
- Capture button (bottom center, large)
- "Gallery" icon (bottom left)
- "Flash" toggle (top right)
- Back button (top left)
- Help tooltip: "Place entire bill in frame and ensure text is readable"

### 3. Preview Screen (after capture)
- Captured image preview (full screen)
- "Use This Photo" button (primary)
- "Retake" button (secondary)
- Image quality indicator
- Option to crop if needed
- "Make sure all charges are visible" reminder

### 4. Processing Screen
- Animated loading indicator (medical pulse animation)
- Progressive status messages:
  - "Reading your bill..."
  - "Identifying procedures..."
  - "Comparing with Medicare rates..."
  - "Preparing your report..."
- Progress bar
- Cancel option
- Estimated time: "Usually takes 5-10 seconds"

### 5. Results Screen

**Header:**
- Back button
- Provider name
- Date of service
- "View Full Report" (top right)

**Alert Banner (if red flags exist):**
- "⚠️ We found 4 charges that may be significantly overpriced"
- "Potential overcharges: $X,XXX"

**Summary Card:**
- Total charges: $X,XXX
- Items analyzed: X
- 🔴 Red flags: X items
- 🟡 Yellow flags: X items
- 🟢 Fair prices: X items
- Estimated fair range: $XXX - $X,XXX

**Procedure List:**
Scrollable list, sorted by flag severity (red first):
- Each card shows:
  - Flag emoji (large, left side)
  - Procedure name (bold)
  - CPT code (small, gray)
  - Billed: $XXX
  - Medicare rate: $XXX
  - Difference badge: "+XXX%"
  - Chevron for details

**Filter Options:**
- All Items
- 🔴 Overpriced Only
- 🟡 Elevated Only
- 🟢 Fair Prices

**Bottom Action Bar:**
- "View Full Report" button (primary)
- "Share" icon
- "Save" icon

### 6. Procedure Detail Screen

**Header:**
- Back arrow
- Procedure name
- CPT Code badge

**Flag Status Section:**
- Large flag emoji
- Status text
- Plain language explanation

**Price Breakdown Card:**
- You were charged: $XXX (large, bold)
- Medicare pays: $XXX
- Typical insurance pays: $XXX - $XXX
- Your charge is: XXX% of Medicare
- Visual bar chart comparison

**Source Information Box:**
```
📋 Price Comparison Source

Medicare Physician Fee Schedule 2025
Locality: [City, State Name]
CPT Code: XXXXX - [Description]
Last Updated: January 1, 2025

View CMS Documentation →
```

**What This Means:**
- "For [procedure name], Medicare pays providers $XXX in your area."
- "Most private insurance plans pay 120-200% of Medicare rates."
- "You were charged XXX%, which is [significantly higher/reasonable/fair]."

**What You Can Do:**
- "Request an itemized bill"
- "Ask for a billing review"
- "Contact patient billing department"
- "File an appeal with insurance" (if insured)
- "Request financial assistance"
- Copy dispute template →

**Similar Procedures** (if applicable):
- Related CPT codes and typical charges

### 7. Full Report Screen

**Report Header:**
- Provider information
- Date of service
- Report generated date

**Executive Summary:**
- Total charges
- Number of items
- Flag breakdown with counts
- Total potential overcharges
- Fair price range estimate

**Detailed Analysis:**
Expandable sections for each procedure with:
- Full comparison details
- Source citations
- Recommendations

**Your Rights Section:**
- "Balance Billing Protection" (if applicable)
- State-specific patient rights
- No Surprises Act information (for applicable scenarios)

**Take Action:**
- "Dispute Charges" templates
- "Request Financial Assistance" guide
- "Contact Patient Advocate" resources
- "Appeal to Insurance" checklist

**Export Options:**
- Download PDF
- Email to myself
- Share with patient advocate
- Share with insurance

### 8. History Screen
- List of past scans (chronological)
- Each item card shows:
  - Provider name
  - Date
  - Total charges
  - Flag summary (visual indicators)
  - Tap to view full report
- Search functionality
- Filter by date range
- Filter by provider
- Total savings identified across all scans

## US-Specific Features

### State Location Selection
- Auto-detect state from bill or GPS
- Manual state selector
- Impacts Medicare locality rates
- Affects state-specific patient rights information

### CPT Code Library
- Built-in CPT code lookup
- Common procedure descriptions
- Educational content about medical billing codes
- Link to CMS code descriptions

### Insurance Integration (Future)
- Scan insurance card
- Compare billed vs. insurance-allowed amounts
- Identify balance billing issues
- Generate EOB (Explanation of Benefits) comparison

### Patient Rights Education
- Federal No Surprises Act information
- State-specific balance billing laws
- Financial assistance programs
- How to negotiate medical bills
- When to dispute charges

### Dispute Templates
- Pre-written letter templates for:
  - Billing department inquiries
  - Insurance appeals
  - Request for itemized bill
  - Financial assistance applications
  - State attorney general complaints

## Performance Requirements
- App launch: < 2 seconds
- Camera ready: < 1 second
- Image capture: Instant
- GPT-4V processing: 5-10 seconds
- Results display: < 1 second after processing
- App size: < 50MB
- Works offline for viewing saved reports

## Privacy & Security (HIPAA Considerations)
- Images deleted immediately after processing (not stored)
- Extracted data encrypted at rest
- HIPAA-compliant data handling
- No PHI (Protected Health Information) stored on device beyond necessary
- Optional anonymous usage (no account required)
- Clear privacy policy regarding AI processing
- Option to delete all data
- Secure API communication (TLS 1.3)

## Development Phases

### Phase 1: MVP (Weeks 1-4)
**Core Functionality:**
- React Native app setup (iOS & Android)
- Camera integration with basic capture
- GPT-4V API integration for bill parsing
- Medicare rate database (top 100 common CPT codes)
- Basic price comparison algorithm
- Simple results screen with color flags
- One state support (e.g., California or Texas)

**Deliverables:**
- Working prototype
- GPT-4V parsing accuracy > 85%
- Basic color-coded flag system
- Comparison with Medicare rates

### Phase 2: Enhanced Analysis (Weeks 5-8)
- Comprehensive Medicare locality database (all states)
- Fair Health data integration (if budget allows)
- Full CPT code library (1000+ codes)
- Detailed source attribution
- PDF report generation
- Local storage of scan history
- Image quality improvements

### Phase 3: User Experience Polish (Weeks 9-12)
- User accounts (optional)
- Advanced filtering and search
- Dispute letter templates
- Patient rights educational content
- Multi-language support (Spanish)
- Performance optimization
- Beta testing program

### Phase 4: Launch Preparation (Weeks 13-16)
- Final QA testing
- App Store & Google Play submission
- Legal review (HIPAA compliance verification)
- Analytics integration
- Customer support system
- Marketing materials
- Soft launch with limited users

## Tech Stack Summary

**Frontend:**
- React Native 0.73+
- TypeScript
- React Navigation 6
- React Native Paper (UI)
- React Query (API state)
- Zustand (local state)
- React Native Vision Camera

**Backend/Services:**
- Node.js with Express
- PostgreSQL (Medicare rates, CPT codes)
- Redis (caching API responses)
- OpenAI GPT-4V API
- AWS S3 (temporary image storage, < 1 hour retention)
- AWS Lambda (serverless processing)

**APIs & Data:**
- OpenAI GPT-4V (bill parsing)
- CMS Medicare Physician Fee Schedule
- Fair Health API (optional, paid)
- Healthcare Bluebook (optional, paid)

**DevOps:**
- GitHub (version control)
- GitHub Actions (CI/CD)
- TestFlight (iOS beta)
- Google Play Beta (Android)
- Firebase Crashlytics
- Sentry (error monitoring)
- Mixpanel (analytics)

**Cost Estimation (MVP):**
- OpenAI GPT-4V API: ~$0.01-0.03 per bill scan
- Server costs: ~$50-100/month
- Database hosting: ~$25-50/month
- Fair Health API: Optional, $500-1000/month
- Total MVP: ~$100-200/month + GPT-4V usage

## Success Metrics (MVP)
- **Technical Metrics:**
  - Bill parsing accuracy: > 90%
  - CPT code extraction accuracy: > 85%
  - Processing time: < 10 seconds
  - App crash rate: < 0.1%
  
- **User Metrics:**
  - Scan completion rate: > 85%
  - Daily active users: Track growth
  - Scans per user: Average 2+ per month
  - User satisfaction: > 4.3 stars
  
- **Business Metrics:**
  - User acquisition cost
  - User retention (30-day)
  - Average overcharges identified per bill
  - Social shares per report

## Deliverables
1. **iOS Application** (Swift/React Native)
2. **Android Application** (Kotlin/React Native)
3. **Backend API** with documentation
4. **Admin Dashboard** for monitoring usage and accuracy
5. **Medicare Rate Database** (regularly updated)
6. **User Documentation** and help center
7. **Privacy Policy** and Terms of Service (HIPAA-compliant)
8. **Marketing Website** (landing page)

## MVP Launch Checklist
- [ ] App Store submission approved
- [ ] Google Play submission approved
- [ ] HIPAA compliance review complete
- [ ] Legal disclaimer finalized
- [ ] Privacy policy published
- [ ] GPT-4V API rate limits configured
- [ ] Error monitoring active
- [ ] Analytics tracking implemented
- [ ] Customer support system ready
- [ ] Beta tester feedback addressed
- [ ] Medicare data updated to current quarter
- [ ] Marketing materials ready
- [ ] Press kit prepared

## Future Enhancements (Post-MVP)
- **Insurance Integration:** Scan EOB, compare billed vs. allowed amounts
- **Price Negotiation Tools:** AI-generated negotiation scripts
- **Provider Directory:** Find providers with transparent pricing
- **Medical Bill Financing:** Connect with payment plan services
- **Prescription Cost Comparison:** Add Rx bill scanning
- **Health Savings:** Track total savings over time
- **Community Pricing:** Crowdsourced price data
- **Bill Pay Integration:** Pay directly through app
- **Provider Reviews:** Rate billing transparency
- **Financial Assistance Finder:** Match with assistance programs

## Regulatory Compliance Notes

**HIPAA Compliance:**
- Classify as Business Associate if storing PHI
- Implement required safeguards
- Business Associate Agreement with hosting provider
- Regular security audits
- Incident response plan

**No Surprises Act (Effective 2022):**
- Include information about balance billing protections
- Link to HHS resources
- Identify surprise billing scenarios

**State-Specific Laws:**
- California AB 72 (balance billing)
- New York Surprise Bill law
- Texas HB 2536
- Research all 50 states for launch

## Development Best Practices for Cursor

**Project Structure:**
```
medical-bill-scanner/
├── src/
│   ├── screens/
│   │   ├── HomeScreen.tsx
│   │   ├── CameraScreen.tsx
│   │   ├── ResultsScreen.tsx
│   │   └── ReportScreen.tsx
│   ├── components/
│   │   ├── ProcedureCard.tsx
│   │   ├── FlagBadge.tsx
│   │   └── PriceComparison.tsx
│   ├── services/
│   │   ├── gpt4v.service.ts
│   │   ├── medicare.service.ts
│   │   └── analysis.service.ts
│   ├── hooks/
│   │   ├── useCamera.ts
│   │   └── useBillAnalysis.ts
│   ├── utils/
│   │   ├── imageProcessing.ts
│   │   └── priceComparison.ts
│   ├── types/
│   │   ├── bill.types.ts
│   │   └── medicare.types.ts
│   └── constants/
│       ├── medicareLocalities.ts
│       └── cptCodes.ts
├── api/
│   ├── routes/
│   ├── controllers/
│   └── services/
└── assets/
```

**Code Quality:**
- TypeScript strict mode
- ESLint + Prettier
- Unit tests for pricing logic
- Integration tests for GPT-4V parsing
- E2E tests for critical flows
- Git hooks for pre-commit checks

**API Key Management:**
- Never commit API keys
- Use environment variables
- Separate dev/prod keys
- Implement rate limiting
- Monitor API costs daily

This PRD is optimized for the US market MVP with GPT-4V integration and can be used directly in Cursor for development guidance.
