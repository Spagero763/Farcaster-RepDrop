import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { baseSepolia } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Farcaster RepDrop',
  projectId: 'a1d355be7b054238e5275045474f1d5f', // Replace with your WalletConnect Project ID
  chains: [baseSepolia],
  ssr: true,
});
