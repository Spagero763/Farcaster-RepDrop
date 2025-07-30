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
import axios from 'axios';

const VerifyCastSummarizationInputSchema = z.object({
  castHash: z.string().describe('The hash of the Farcaster cast to verify.'),
  neynarApiKey: z.string().describe('The API key for Neynar.'),
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

const castVerificationPrompt = ai.definePrompt({
  name: 'castVerificationPrompt',
  input: {schema: VerifyCastSummarizationInputSchema},
  output: {schema: z.object({isValid: z.boolean(), summary: z.string()})},
  prompt: `You are a Farcaster cast verifier. You must determine whether a given cast hash corresponds to a valid cast, and provide a short summary of the cast's content.

  Cast Hash: {{{castHash}}}
  Neynar API Key: {{{neynarApiKey}}}
  
  Respond with JSON object that contains whether the cast is valid, and a short summary. Return valid JSON.
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
      const res = await axios.get(`https://api.neynar.com/v2/farcaster/cast?identifier=${input.castHash}&type=hash`, {
        headers: { 'api_key': input.neynarApiKey },
      });

      const isValid = !!res.data.cast;

      if (isValid) {
        const {output} = await castVerificationPrompt(input);

        return {
          isValid: output?.isValid ?? false,
          summary: output?.summary ?? 'No summary available.',
          progress: 'Generated cast verification summary.'
        };
      } else {
        return {
          isValid: false,
          summary: 'Invalid cast hash.',
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
