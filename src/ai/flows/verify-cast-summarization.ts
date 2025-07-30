// src/ai/flows/verify-cast-summarization.ts
'use server';

/**
 * @fileOverview A Farcaster cast verifier and summarization AI agent.
 *
 * - verifyCastSummarization - A function that handles the cast verification and summarization process.
 * - VerifyCastSummarizationInput - The input type for the verifyCastSummarization function.
 * - VerifyCastSummarizationOutput - The return type for the verifyCastSummarization function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { config } from 'dotenv';

config({ path: '.env' });

const VerifyCastSummarizationInputSchema = z.object({
  castHash: z.string().describe('The hash of the Farcaster cast to verify.'),
});
export type VerifyCastSummarizationInput = z.infer<typeof VerifyCastSummarizationInputSchema>;

const VerifyCastSummarizationOutputSchema = z.object({
  isValid: z.boolean().describe('Whether the cast is valid or not.'),
  summary: z.string().describe('A short summary of the cast content.'),
  progress: z.string().describe('Progress of the flow execution')
});
export type VerifyCastSummarizationOutput = z.infer<typeof VerifyCastSummarizationOutputSchema>;

export async function verifyCastSummarization(input: VerifyCastSummarizationInput): Promise<VerifyCastSummarizationOutput> {
  return verifyCastSummarizationFlow(input);
}

const castSummarizationPrompt = ai.definePrompt({
    name: 'castSummarizationPrompt',
    input: {schema: z.object({ castText: z.string() })},
    output: {schema: z.object({ summary: z.string() })},
    prompt: `Summarize the following Farcaster cast content in a single, concise sentence.
    
    Cast Content: {{{castText}}}
    
    Respond with a JSON object that contains the summary.
    `,
});

const verifyCastSummarizationFlow = ai.defineFlow(
  {
    name: 'verifyCastSummarizationFlow',
    inputSchema: VerifyCastSummarizationInputSchema,
    outputSchema: VerifyCastSummarizationOutputSchema,
  },
  async input => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_NEYNAR_API_KEY;
      if (!apiKey) {
        throw new Error('NEYNAR_API_KEY is not set.');
      }

      const response = await fetch(`https://api.neynar.com/v2/farcaster/cast?identifier=${input.castHash}&type=hash`, {
        method: 'GET',
        headers: { 
          'api_key': apiKey,
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(`Request failed with status code ${response.status}: ${errorData.message}`);
      }
      
      const res = await response.json();
      const cast = res.cast;
      const isValid = !!cast;

      if (isValid) {
        const {output} = await castSummarizationPrompt({ castText: cast.text });

        return {
          isValid: true,
          summary: output?.summary ?? 'No summary available.',
          progress: 'Generated cast verification summary.'
        };
      } else {
        return {
          isValid: false,
          summary: 'Invalid cast hash or cast not found.',
          progress: 'Cast hash is invalid.'
        };
      }
    } catch (error: any) {
      console.error('Error verifying cast:', error.message);
      return {
        isValid: false,
        summary: `Error verifying cast: ${error.message}`,
        progress: 'An error occurred during cast verification.'
      };
    }
  }
);
