import { Contract } from 'soroban-client';
import { SorobanRpc } from 'stellar-sdk';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function initializeContract() {
  try {
    const server = new SorobanRpc.Server(
      'https://soroban-testnet.stellar.org',
      { allowHttp: true }
    );

    const contract = new Contract(process.env.NEXT_PUBLIC_CONTRACT_ID!);
    
    // Initialize contract
    await contract.call('initialize');
    
    console.log('Contract initialized successfully!');
  } catch (error) {
    console.error('Error initializing contract:', error);
    throw error;
  }
}

initializeContract();