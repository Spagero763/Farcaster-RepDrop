import { abi } from './reputationABI';

export const CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x7C87ffda671ca892b03D875B03363216F6d95ccD') as `0x${string}`;
export const CONTRACT_ABI = abi;
