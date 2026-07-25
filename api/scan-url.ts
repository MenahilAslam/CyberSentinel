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
    const { url } = body || {};

    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'A valid url string is required.' });
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
          contents: `You are an expert Threat Intelligence Analyst specializing in Web Security and Phishing Detection.
Analyze the following target URL for cybersecurity threats:
URL: "${url}"

Inspect for:
1. Suspicious keywords and brand impersonation (paypal, bank, google, verify, login).
2. Domain tricks, typosquatting, IDN homograph attacks, sub-domain stacking.
3. Insecure protocols (HTTP vs HTTPS) or unusual ports.
4. TLD reputation (.xyz, .top, .click, .gq, .tk, .work, .zip).
5. Social engineering indicators in path or query strings.

Return a JSON object adhering strictly to the schema provided.`,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                riskScore: {
                  type: Type.NUMBER,
                  description: 'Risk score from 0 (completely safe) to 100 (confirmed malware/phishing).',
                },
                riskLevel: {
                  type: Type.STRING,
                  description: 'Must be one of: safe, low, suspicious, dangerous, critical.',
                },
                summary: {
                  type: Type.STRING,
                  description: 'Short high-level verdict title.',
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
                  description: 'Detailed threat intelligence explanation.',
                },
                recommendations: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: ['riskScore', 'riskLevel', 'summary', 'flags', 'explanation', 'recommendations'],
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
      console.warn('Gemini API failed in scan-url (triggering heuristic fallback):', aiErr);
      return res.status(200).json({
        isDemo: true,
        message: 'AI service temporarily unavailable. Using local heuristic evaluation.',
      });
    }
  } catch (error: any) {
    console.error('URL Scanner API Error:', error);
    return res.status(500).json({
      error: 'Failed to analyze URL.',
      details: error?.message || String(error),
    });
  }
}
