/**
 * Express Server for Medical Bill Scanner API
 * Handles bill analysis requests and Medicare rate lookups
 */

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const {analyzeBillWithGPT4V} = require('./services/gpt4vService');
const {getMedicareRate, comparePrice} = require('./services/medicareService');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer for image uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({status: 'ok', timestamp: new Date().toISOString()});
});

// Analyze bill endpoint
app.post('/api/scan/analyze', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({error: 'No image file provided'});
    }

    // Convert buffer to base64
    const base64Image = req.file.buffer.toString('base64');
    const imageUri = `data:${req.file.mimetype};base64,${base64Image}`;

    // Extract bill data using GPT-4V
    const extractedData = await analyzeBillWithGPT4V(imageUri);

    // For full analysis, you would also call the comparison service here
    // For now, just return the extracted data
    res.json({
      success: true,
      data: extractedData,
    });
  } catch (error) {
    console.error('Bill analysis error:', error);
    res.status(500).json({
      error: 'Failed to analyze bill',
      message: error.message,
    });
  }
});

// Get Medicare rate endpoint
app.get('/api/rates/medicare', async (req, res) => {
  try {
    const {cptCode, locality, state} = req.query;

    if (!cptCode || !locality || !state) {
      return res.status(400).json({
        error: 'Missing required parameters: cptCode, locality, state',
      });
    }

    const rate = await getMedicareRate(cptCode, locality, state);

    if (!rate) {
      return res.status(404).json({error: 'Rate not found'});
    }

    res.json(rate);
  } catch (error) {
    console.error('Medicare rate lookup error:', error);
    res.status(500).json({
      error: 'Failed to fetch Medicare rate',
      message: error.message,
    });
  }
});

// Get private insurance rate range (Fair Health)
app.get('/api/rates/fair-health', async (req, res) => {
  try {
    const {cptCode, zipCode} = req.query;

    if (!cptCode || !zipCode) {
      return res.status(400).json({
        error: 'Missing required parameters: cptCode, zipCode',
      });
    }

    // In production, this would query Fair Health API or database
    // For MVP, return mock data or null
    res.json({
      cptCode,
      zipCode,
      percentile50: null,
      percentile80: null,
      percentile95: null,
      note: 'Private insurance rates not available in MVP',
    });
  } catch (error) {
    console.error('Private insurance rate lookup error:', error);
    res.status(500).json({
      error: 'Failed to fetch private insurance rates',
      message: error.message,
    });
  }
});

// Get Medicare localities by state
app.get('/api/localities', (req, res) => {
  try {
    const {state} = req.query;

    if (!state) {
      return res.status(400).json({error: 'Missing required parameter: state'});
    }

    // Import localities constant
    const {MEDICARE_LOCALITIES} = require('./constants/medicareLocalities');
    const localities = MEDICARE_LOCALITIES[state.toUpperCase()];

    if (!localities) {
      return res.status(404).json({error: 'State not found'});
    }

    res.json(localities);
  } catch (error) {
    console.error('Locality lookup error:', error);
    res.status(500).json({
      error: 'Failed to fetch localities',
      message: error.message,
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Medical Bill Scanner API server running on port ${PORT}`);
});

module.exports = app;

