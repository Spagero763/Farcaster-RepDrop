
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PartyPopper } from 'lucide-react';
import { useEffect, useState } from 'react';

// A simple confetti component
const ConfettiPiece = ({ style }: { style: React.CSSProperties }) => (
  <div className="absolute w-2 h-2 rounded-full" style={style} />
);

export default function SuccessPage() {
  const [confetti, setConfetti] = useState<React.CSSProperties[]>([]);

  useEffect(() => {
    const newConfetti: React.CSSProperties[] = [];
    const colors = ['#5163BA', '#BA518E', '#FFFFFF'];
    for (let i = 0; i < 100; i++) {
      newConfetti.push({
        backgroundColor: colors[Math.floor(Math.random() * colors.length)],
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * -50 - 50}vh`,
        transform: `rotate(${Math.random() * 360}deg)`,
        animation: `fall ${Math.random() * 2 + 3}s linear ${Math.random() * 2}s forwards`,
      });
    }
    setConfetti(newConfetti);
  }, []);

  return (
    <>
      <style jsx global>{`
        @keyframes fall {
          to {
            top: 150vh;
            transform: rotate(${Math.random() * 360 + 360}deg);
          }
        }
      `}</style>
      <div className="container relative overflow-hidden py-10 flex justify-center">
        {confetti.map((style, index) => <ConfettiPiece key={index} style={style} />)}
        <Card className="w-full max-w-md text-center z-10">
          <CardHeader className="items-center">
            <div className="p-4 bg-green-500/10 rounded-full">
                <PartyPopper className="h-12 w-12 text-green-500" />
            </div>
            <CardTitle className="text-2xl pt-4">Reputation Claimed!</CardTitle>
            <CardDescription>Congratulations, your onchain reputation is now live and verifiable by anyone.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Share your achievement and see how you rank among other Farcaster users.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-4">
            <Button asChild className="w-full">
              <Link href="/leaderboard">View Leaderboard</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/">Back to Home</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
