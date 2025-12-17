# Medical Bill Scanner Mobile App

AI-powered mobile application for scanning and analyzing US medical bills. Compare charges against Medicare rates and identify potential overcharges.

## Features

- 📸 **Document Scanning**: Capture medical bills using your phone camera
- 🤖 **AI-Powered OCR**: GPT-4V extracts all procedures, CPT codes, and charges
- 💰 **Price Comparison**: Compare charges against Medicare Physician Fee Schedule rates
- 🚩 **Color-Coded Flags**: 
  - 🟢 Green: Fair price (≤150% of Medicare)
  - 🟡 Yellow: Elevated price (150-250% of Medicare)
  - 🔴 Red: Significantly overpriced (>250% of Medicare)
- 📊 **Detailed Reports**: Full breakdown with source attribution and recommendations

## Tech Stack

### Mobile App (React Native)
- React Native 0.73+
- TypeScript
- React Navigation
- React Native Paper (UI components)
- React Native Vision Camera
- React Query + Zustand
- OpenAI GPT-4V API

### Backend API (Node.js)
- Express.js
- PostgreSQL (for Medicare rates database)
- Redis (for caching)
- OpenAI GPT-4V API

## Project Structure

```
medical-bill-scanner/
├── src/
│   ├── screens/          # Screen components
│   ├── components/       # Reusable UI components
│   ├── services/         # API services (GPT-4V, Medicare)
│   ├── hooks/            # Custom React hooks
│   ├── navigation/       # Navigation configuration
│   ├── types/            # TypeScript type definitions
│   └── constants/        # Constants (CPT codes, Medicare localities)
├── api/                  # Backend API server
│   ├── routes/           # API routes
│   ├── controllers/      # Route controllers
│   └── services/         # Business logic
└── docs/                 # Documentation
```

## Setup Instructions

### Prerequisites

- Node.js >= 18
- React Native development environment (see [React Native docs](https://reactnative.dev/docs/environment-setup))
- iOS: Xcode and CocoaPods
- Android: Android Studio and Android SDK
- OpenAI API key

### Mobile App Setup

1. Install dependencies:
```bash
npm install
# or
yarn install
```

2. iOS setup:
```bash
cd ios && pod install && cd ..
```

3. Configure environment variables:
```bash
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY
```

4. Run the app:
```bash
# iOS
npm run ios

# Android
npm run android
```

### Backend API Setup

1. Navigate to API directory:
```bash
cd api
npm install
```

2. Configure environment variables:
```bash
cp ../.env.example .env
# Edit .env with your configuration
```

3. Start the server:
```bash
npm run dev  # Development mode with nodemon
# or
npm start    # Production mode
```

## API Endpoints

- `POST /api/scan/analyze` - Analyze medical bill image
- `GET /api/rates/medicare?cptCode={code}&locality={locality}&state={state}` - Get Medicare rate
- `GET /api/rates/fair-health?cptCode={code}&zipCode={zip}` - Get private insurance rates
- `GET /api/localities?state={state}` - Get Medicare localities for a state

## Medicare Rate Comparison Logic

- **🟢 Green Flag**: Price ≤ 150% of Medicare rate (reasonable)
- **🟡 Yellow Flag**: Price 150-250% of Medicare rate (elevated)
- **🔴 Red Flag**: Price > 250% of Medicare rate (significantly overpriced)

Note: Private insurance typically pays 120-200% of Medicare rates, so charges above 250% are considered excessive.

## Development Phases

### Phase 1: MVP ✅
- React Native app setup
- Camera integration
- GPT-4V bill parsing
- Basic Medicare rate comparison (top 100 CPT codes)
- Color-coded flag system

### Phase 2: Enhanced Analysis (Planned)
- Comprehensive Medicare locality database (all states)
- Fair Health data integration
- Full CPT code library (1000+ codes)
- Detailed source attribution
- PDF report generation

### Phase 3: UX Polish (Planned)
- User accounts (optional)
- Scan history with local storage
- Dispute letter templates
- Patient rights educational content

## HIPAA Compliance

This app processes Protected Health Information (PHI). Ensure:

- Images are deleted immediately after processing
- Extracted data is encrypted at rest
- Secure API communication (TLS 1.3)
- HIPAA-compliant hosting (if storing PHI)
- Business Associate Agreements with third-party services

## Cost Estimates (MVP)

- OpenAI GPT-4V API: ~$0.01-0.03 per bill scan
- Server hosting: ~$50-100/month
- Database hosting: ~$25-50/month
- Total: ~$100-200/month + API usage

## License

[Add your license here]

## Support

For issues and questions, please open an issue on GitHub.

