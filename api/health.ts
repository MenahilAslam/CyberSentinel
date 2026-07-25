import { setCorsHeaders } from './_utils';

export default async function handler(req: any, res: any) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const hasKey = Boolean(process.env.GEMINI_API_KEY);
  res.setHeader('Content-Type', 'application/json');
  return res.status(200).json({
    status: 'ok',
    service: 'CyberSentinel AI API',
    model: 'gemini-3.6-flash',
    hasKey,
    timestamp: new Date().toISOString(),
  });
}
