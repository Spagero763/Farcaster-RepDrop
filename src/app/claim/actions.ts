
'use server';

import { z } from 'zod';
import { verifyCastSummarization } from '@/ai/flows/verify-cast-summarization';

const formSchema = z.object({
  castHash: z.string().startsWith('0x', { message: 'Hash must start with 0x' }).min(10, { message: 'Hash seems too short' }),
});
export type FormValues = z.infer<typeof formSchema>;


type VerificationResult = {
  isValid: boolean;
  summary: string;
};

// Server action to securely verify the cast
export async function verifyAction(data: FormValues): Promise<VerificationResult> {
  try {
    return await verifyCastSummarization({ castHash: data.castHash });
  } catch (error) {
    console.error('Verification failed:', error);
    return { isValid: false, summary: 'An unexpected error occurred during verification.' };
  }
}
