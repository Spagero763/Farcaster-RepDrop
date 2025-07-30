import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Award, Share2 } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 md:py-20">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-headline font-bold tracking-tight sm:text-5xl md:text-6xl text-primary">
          Farcaster RepDrop
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-muted-foreground md:text-xl">
          Claim your onchain reputation by verifying a Farcaster cast. Turn your social capital into verifiable credentials.
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/claim">Start Claiming</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/leaderboard">View Leaderboard</Link>
          </Button>
        </div>
      </div>

      <div className="mt-16 grid gap-8 md:grid-cols-3">
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Share2 className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Submit Your Cast</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Provide a valid Farcaster cast hash to begin the verification process.
            </CardDescription>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Verify & Claim</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              We'll verify your cast's authenticity. Once confirmed, you can claim your reputation onchain.
            </CardDescription>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Award className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Climb the Ranks</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              View your new onchain reputation and see how you stack up on the global leaderboard.
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
