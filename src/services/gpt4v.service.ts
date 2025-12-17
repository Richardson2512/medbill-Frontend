/**
 * GPT-4V Service for Medical Bill OCR and Data Extraction
 */

import {ExtractedBillData} from '../types/bill.types';
import {convertImageToBase64} from '../utils/imageProcessing';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

/**
 * Extract bill information from image using GPT-4V
 */
export async function analyzeBillWithGPT4V(
  imageUri: string,
): Promise<ExtractedBillData> {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured');
  }

  try {
    // Convert image to base64
    const base64Image = await convertImageToBase64(imageUri);

    // Prepare the prompt for GPT-4V
    const extractionPrompt = `Extract all information from this US medical bill in JSON format. Be precise with CPT codes and amounts. Return ONLY valid JSON, no additional text.

Required JSON structure:
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
  "dateOfService": "YYYY-MM-DD",
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

Important Instructions:
1. Extract exact CPT codes (5-digit codes like 99214, 80053, etc.). If no CPT code is visible, leave it empty.
2. Extract all procedure/service line items with their charges.
3. Extract diagnostic codes (ICD-10) if present.
4. Capture provider name, address (especially state), and date of service.
5. Extract all monetary amounts accurately.
6. If any field is not available, use empty string for text fields and 0 for numbers.
7. Return ONLY the JSON object, no markdown formatting or code blocks.`;

    // Call OpenAI GPT-4V API
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
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
                  url: `data:image/jpeg;base64,${base64Image}`,
                  detail: 'high',
                },
              },
              {
                type: 'text',
                text: extractionPrompt,
              },
            ],
          },
        ],
        max_tokens: 4096,
        temperature: 0.1, // Low temperature for consistent extraction
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `OpenAI API error: ${errorData.error?.message || response.statusText}`,
      );
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No response from GPT-4V');
    }

    // Parse JSON response (handle markdown code blocks if present)
    let jsonContent = content.trim();
    
    // Remove markdown code blocks if present
    if (jsonContent.startsWith('```')) {
      jsonContent = jsonContent.replace(/^```(?:json)?\n/, '').replace(/\n```$/, '');
    }

    const extractedData: ExtractedBillData = JSON.parse(jsonContent);

    // Validate required fields
    if (!extractedData.provider || !extractedData.procedures) {
      throw new Error('Incomplete bill data extracted');
    }

    return extractedData;
  } catch (error) {
    console.error('GPT-4V analysis error:', error);
    if (error instanceof SyntaxError) {
      throw new Error('Failed to parse bill data. Please try scanning again.');
    }
    throw error;
  }
}

/**
 * Validate extracted bill data
 */
export function validateExtractedBillData(
  data: ExtractedBillData,
): {valid: boolean; errors: string[]} {
  const errors: string[] = [];

  if (!data.provider?.name) {
    errors.push('Provider name is required');
  }

  if (!data.provider?.state) {
    errors.push('Provider state is required for rate comparison');
  }

  if (!data.procedures || data.procedures.length === 0) {
    errors.push('At least one procedure is required');
  }

  if (!data.dateOfService) {
    errors.push('Date of service is required');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
