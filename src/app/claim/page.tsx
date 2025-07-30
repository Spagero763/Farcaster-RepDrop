'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '@/lib/contract';
import { verifyCastSummarization } from '@/ai/flows/verify-cast-summarization';

const formSchema = z.object({
  castHash: z.string().startsWith('0x', { message: 'Hash must start with 0x' }).min(10, { message: 'Hash seems too short' }),
});
type FormValues = z.infer<typeof formSchema>;

type VerificationResult = {
  isValid: boolean;
  summary: string;
};

// Server action to securely verify the cast
async function verifyAction(data: FormValues): Promise<VerificationResult> {
  'use server';
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

export default function ClaimPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { isConnected, address } = useAccount();
  const { data: hash, writeContract, isPending: isClaiming, error: claimError } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'verifying' | 'verified' | 'failed'>('idle');
  const [verificationSummary, setVerificationSummary] = useState('');

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { castHash: '' },
  });

  const handleVerify: SubmitHandler<FormValues> = async (data) => {
    setVerificationStatus('verifying');
    const result = await verifyAction(data);
    if (result.isValid) {
      setVerificationStatus('verified');
      setVerificationSummary(result.summary);
      toast({
        title: "Cast Verified!",
        description: "You can now claim your reputation.",
        variant: 'default',
      });
    } else {
      setVerificationStatus('failed');
      setVerificationSummary(result.summary || 'Invalid or non-existent cast hash.');
      form.setError('castHash', { type: 'manual', message: result.summary || 'Invalid cast.' });
    }
  };

  const handleClaim = () => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'claimReputation',
    });
  };

  if (isConfirmed) {
    router.push('/success');
  }

  if (claimError) {
    toast({
      title: "Claiming Error",
      description: claimError.message.includes('already claimed') ? "You have already claimed your reputation." : "An error occurred during the claim process.",
      variant: 'destructive',
    });
  }

  if (!isConnected) {
    return (
      <div className="container py-10 text-center">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Connect Your Wallet</CardTitle>
            <CardDescription>Please connect your wallet to continue.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-10 flex justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Claim Your Reputation</CardTitle>
          <CardDescription>Enter your Farcaster cast hash to verify your social activity and claim your onchain rep.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleVerify)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="castHash"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cast Hash</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. 0x..."
                        {...field}
                        disabled={verificationStatus === 'verified' || verificationStatus === 'verifying'}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {verificationStatus === 'verified' && (
                <div className="p-3 rounded-md bg-secondary text-secondary-foreground flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Cast Summary</h4>
                    <p className="text-sm text-muted-foreground">{verificationSummary}</p>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              {verificationStatus !== 'verified' ? (
                <Button type="submit" disabled={verificationStatus === 'verifying'} className="w-full">
                  {verificationStatus === 'verifying' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Verify Cast
                </Button>
              ) : (
                <Button onClick={handleClaim} disabled={isClaiming || isConfirming} className="w-full">
                  {(isClaiming || isConfirming) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isClaiming ? 'Claiming...' : isConfirming ? 'Confirming...' : 'Claim Reputation'}
                </Button>
              )}
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
