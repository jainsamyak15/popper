import { SorobanRpc } from 'soroban-client';

export const networkPassphrase = 'Test SDF Future Network ; October 2022';
export const contractId = process.env.NEXT_PUBLIC_CONTRACT_ID as string;

export const sorobanServer = new SorobanRpc.Server(
  'https://soroban-testnet.stellar.org',
  { allowHttp: true }
);