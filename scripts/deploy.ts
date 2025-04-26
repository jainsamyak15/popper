import { Contract } from 'soroban-client';
import { Soroban, xdr } from 'stellar-sdk';
import SorobanClient from 'stellar-sdk';
import * as fs from 'fs';
import * as path from 'path';

async function deployContract() {
  try {
    // Initialize Soroban RPC client
    const server = new SorobanClient(
      'https://soroban-testnet.stellar.org',
      { allowHttp: true }
    );

    // Read WASM file
    const wasmPath = path.join(__dirname, '../target/wasm32-unknown-unknown/release/prediction_market.wasm');
    const wasmCode = fs.readFileSync(wasmPath);
    
    // Deploy contract
    const { contractId } = await server.uploadContract(wasmCode);
    
    console.log('Contract deployed successfully!');
    console.log('Contract ID:', contractId);
    
    // Update .env.local with contract ID
    const envPath = path.join(__dirname, '../.env.local');
    const envContent = `
NEXT_PUBLIC_CONTRACT_ID=${contractId}
NEXT_PUBLIC_NETWORK=testnet
OPENAI_API_KEY=your_openai_key
EXA_API_KEY=your_exa_key
TWITTER_BEARER_TOKEN=your_twitter_token
`;
    
    fs.writeFileSync(envPath, envContent);
    console.log('Environment variables updated!');
    
    return contractId;
  } catch (error) {
    console.error('Error deploying contract:', error);
    throw error;
  }
}

deployContract();