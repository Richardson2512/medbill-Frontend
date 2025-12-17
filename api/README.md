# Medical Bill Scanner API

Backend API server for the Medical Bill Scanner mobile app.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp ../.env.example .env
# Edit .env with your configuration
```

3. Start the server:
```bash
npm run dev  # Development mode
npm start    # Production mode
```

## API Endpoints

### POST /api/scan/analyze
Analyze a medical bill image using GPT-4V.

**Request:**
- Content-Type: multipart/form-data
- Body: `image` (file)

**Response:**
```json
{
  "success": true,
  "data": {
    "provider": {...},
    "procedures": [...],
    ...
  }
}
```

### GET /api/rates/medicare
Get Medicare rate for a CPT code and locality.

**Query Parameters:**
- `cptCode` (required): CPT code (e.g., "99214")
- `locality` (required): Medicare locality code (e.g., "01")
- `state` (required): State code (e.g., "CA")

**Response:**
```json
{
  "cptCode": "99214",
  "description": "Office visit, established patient, moderate complexity",
  "facilityRate": 120,
  "nonFacilityRate": 140,
  "locality": "01",
  "localityName": "Los Angeles",
  "year": 2025,
  "effectiveDate": "2025-01-01"
}
```

### GET /api/rates/fair-health
Get private insurance rate range (Fair Health database).

**Query Parameters:**
- `cptCode` (required): CPT code
- `zipCode` (required): ZIP code

### GET /api/localities
Get Medicare localities for a state.

**Query Parameters:**
- `state` (required): State code (e.g., "CA")

## Environment Variables

- `OPENAI_API_KEY`: Your OpenAI API key
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment (development/production)

