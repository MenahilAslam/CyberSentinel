import { GoogleGenAI, GenerateContentParameters, GenerateContentResponse } from '@google/genai';

export function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    return null;
  }
  try {
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
    return null;
  }
}

/**
 * Executes a Gemini generateContent call with fast 6s timeouts per model
 * and quick model fallbacks to guarantee responses within Vercel execution limits.
 */
export async function generateContentWithRetry(
  params: Omit<GenerateContentParameters, 'model'>,
  primaryModel: string = 'gemini-3.6-flash'
): Promise<GenerateContentResponse> {
  const ai = getGeminiClient();
  if (!ai) {
    throw new Error('GEMINI_API_KEY is not configured or client initialization failed.');
  }

  // Primary model and valid fallback candidate list according to @google/genai guidelines
  const modelsToTry = Array.from(
    new Set([primaryModel, 'gemini-3.6-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'])
  );

  let lastError: any = null;

  for (const model of modelsToTry) {
    let timerId: NodeJS.Timeout | null = null;
    try {
      const callPromise = ai.models.generateContent({
        ...params,
        model,
      });

      const timeoutPromise = new Promise<never>((_, reject) => {
        timerId = setTimeout(() => {
          reject(new Error(`Model [${model}] timeout (6s limit reached)`));
        }, 6000);
      });

      const response = await Promise.race([callPromise, timeoutPromise]);
      if (timerId) clearTimeout(timerId);
      if (response && response.text) {
        return response;
      }
    } catch (err: any) {
      if (timerId) clearTimeout(timerId);
      lastError = err;
      console.info(`Gemini attempt for [${model}] info:`, err?.message || err);
      // Fallback to next model candidate immediately
    }
  }

  throw lastError || new Error('All Gemini API model attempts failed or timed out.');
}
