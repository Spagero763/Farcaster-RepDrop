'use client';
import Link from 'next/link';
import { Target } from 'lucide-react';
import WalletConnect from './WalletConnect';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/claim', label: 'Claim' },
    { href: '/leaderboard', label: 'Leaderboard' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Target className="h-6 w-6 text-primary" />
            <span className="font-bold">RepDrop</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm lg:gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'transition-colors hover:text-foreground/80',
                  pathname === link.href ? 'text-foreground' : 'text-foreground/60'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
            <WalletConnect />
        </div>
      </div>
    </header>
  );
}
