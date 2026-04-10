import OpenAI from 'openai';

/**
 * Singleton OpenAI client reused by API routes.
 * Using server-side only keeps the API key secure.
 */
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});
