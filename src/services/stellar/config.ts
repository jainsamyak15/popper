import { Server } from 'soroban-client';

export const networkPassphrase = 'Test SDF Network ; September 2015';
export const contractId = process.env.NEXT_PUBLIC_CONTRACT_ID as string;

export const sorobanServer = new Server('https://soroban-testnet.stellar.org', {
  allowHttp: true,
});