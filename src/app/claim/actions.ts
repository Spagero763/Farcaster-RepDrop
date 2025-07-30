
'use server';

import { z } from 'zod';
import { verifyCastSummarization } from '@/ai/flows/verify-cast-summarization';

const formSchema = z.object({
  castHash: z.string().startsWith('0x', { message: 'Hash must start with 0x' }).min(10, { message: 'Hash seems too short' }),
});
export type FormValues = z.infer<typeof typeName>;


type VerificationResult = {
  isValid: boolean;
  summary: string;
};

// Server action to securely verify the cast
export async function verifyAction(data: FormValues): Promise<VerificationResult> {
  try {
    const neynarApiKey = process.env.NEYNAR_API_KEY;
    if (!neynarApiKey) {
      console.error('NEYNAR_API_KEY is not set in the environment.');
      return { isValid: false, summary: 'Server configuration error.' };
    }
    return await verifyCastSummarization({ castHash: data.castHash, neynarApiKey });
  } catch (error) {
    console.error('Verification failed:', error);
    return { isValid: false, summary: 'An unexpected error occurred during verification.' };
  }
}
