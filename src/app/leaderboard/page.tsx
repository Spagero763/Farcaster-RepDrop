'use client';

import { useReadContract } from 'wagmi';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '@/lib/contract';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Award } from 'lucide-react';

type Claimer = {
  claimer: `0x${string}`;
  reputation: bigint;
};

export default function LeaderboardPage() {
  const { data: leaders, isLoading, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getAllClaimers',
  });

  const sortedLeaders = (leaders as Claimer[] | undefined)?.slice().sort((a, b) => {
    if (a.reputation > b.reputation) return -1;
    if (a.reputation < b.reputation) return 1;
    return 0;
  });

  const truncateAddress = (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`;

  return (
    <div className="container py-10">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Award className="h-8 w-8 text-primary" />
            <div>
                <CardTitle className="text-2xl">Leaderboard</CardTitle>
                <CardDescription>Top reputation holders in the Farcaster ecosystem.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Rank</TableHead>
                  <TableHead>Claimer</TableHead>
                  <TableHead className="text-right">Reputation</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-10" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-5 w-20 ml-auto" /></TableCell>
                  </TableRow>
                ))}
                {error && (
                    <TableRow>
                        <TableCell colSpan={3} className="text-center text-destructive">
                            Failed to load leaderboard data.
                        </TableCell>
                    </TableRow>
                )}
                {sortedLeaders && sortedLeaders.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={3} className="text-center text-muted-foreground">
                            No one has claimed any reputation yet. Be the first!
                        </TableCell>
                    </TableRow>
                )}
                {sortedLeaders?.map((entry, index) => (
                  <TableRow key={entry.claimer}>
                    <TableCell className="font-medium">#{index + 1}</TableCell>
                    <TableCell className="font-mono text-sm">{truncateAddress(entry.claimer)}</TableCell>
                    <TableCell className="text-right font-bold text-primary">{entry.reputation.toString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
