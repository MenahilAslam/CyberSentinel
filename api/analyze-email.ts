import { generateContentWithRetry } from './_gemini';
import { setCorsHeaders, parseRequestBody } from './_utils';
import { Type } from '@google/genai';

export default async function handler(req: any, res: any) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  try {
    const body = await parseRequestBody(req);
    const { emailText } = body || {};

    if (!emailText || typeof emailText !== 'string') {
      return res.status(400).json({ error: 'Valid emailText content is required.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(200).json({
        isDemo: true,
        message: 'No GEMINI_API_KEY detected in Vercel environment. Using local heuristic evaluation.',
      });
    }

    try {
      const response = await generateContentWithRetry(
        {
          contents: `You are a Principal Email Security Specialist and Anti-Phishing Architect.
Analyze the following email body or raw headers for phishing, scams, and malware distribution indicators:

EMAIL CONTENT:
"""
${emailText.slice(0, 4000)}
"""

Evaluate for:
1. Phishing & credential harvesting.
2. Business Email Compromise (BEC), CEO fraud, or payroll updates.
3. Coercive urgency, panic triggers, or psychological pressure.
4. Header spoofing (mismatched From vs Reply-To) if headers are provided.
5. Suspicious links, attachment lures, or fake invoice notices.

Return a JSON object strictly matching the schema.`,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                riskScore: {
                  type: Type.NUMBER,
                  description: 'Risk score from 0 (completely legitimate) to 100 (severe threat/BEC).',
                },
                riskLevel: {
                  type: Type.STRING,
                  description: 'Must be one of: safe, low, suspicious, dangerous, critical.',
                },
                threatType: {
                  type: Type.STRING,
                  description: 'Primary threat classification, e.g. Business Email Compromise (BEC), Credential Harvester, Tech Support Scam, Invoice Fraud, Benign.',
                },
                summary: {
                  type: Type.STRING,
                  description: 'Short threat verdict title.',
                },
                flags: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      description: { type: Type.STRING },
                      severity: { type: Type.STRING, description: 'safe, low, suspicious, dangerous, critical' },
                    },
                    required: ['title', 'description', 'severity'],
                  },
                },
                explanation: {
                  type: Type.STRING,
                  description: 'Detailed threat breakdown and social engineering mechanics.',
                },
                recommendations: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: ['riskScore', 'riskLevel', 'threatType', 'summary', 'flags', 'explanation', 'recommendations'],
            },
          },
        },
        'gemini-3.6-flash'
      );

      const text = response.text;
      if (!text) {
        throw new Error('Empty response from Gemini AI model.');
      }

      const parsedData = JSON.parse(text);
      return res.status(200).json(parsedData);
    } catch (aiErr) {
      console.warn('Gemini API failed in analyze-email (triggering heuristic fallback):', aiErr);
      return res.status(200).json({
        isDemo: true,
        message: 'AI service temporarily unavailable. Using local heuristic evaluation.',
      });
    }
  } catch (error: any) {
    console.error('Email Analyzer API Error:', error);
    return res.status(500).json({
      error: 'Failed to analyze email.',
      details: error?.message || String(error),
    });
  }
}
