import { Server } from 'stellar-sdk';
import { getPublicKey, signTransaction } from '@stellar/freighter-api';
import * as StellarSdk from 'stellar-sdk';
import { contractId, sorobanServer } from './config';
import { toast } from 'sonner';
import { Horizon } from 'stellar-sdk';

export class StellarService {
  // Configuration and server setup
  private static sorobanServer = sorobanServer;
  private static horizonServer = new Horizon.Server('https://horizon-testnet.stellar.org');
  private static contractId = contractId;
  private static baseFee = StellarSdk.BASE_FEE;
  private static networkPassphrase = StellarSdk.Networks.TESTNET;
  
  // Mock storage for markets - some are already resolved with "yes" (true) outcome
  private static markets = [
    {
      id: 1,
      title: 'Will Bitcoin reach $100,000 by end of 2025?',
      description: 'Market for predicting if Bitcoin will reach $100,000 by the end of 2025',
      category: 'crypto',
      endTime: Date.now() + 604800000, // 1 week from now
      resolved: true, // This market is resolved
      outcome: true   // Outcome is "yes"
    },
    {
      id: 2,
      title: 'Will Ethereum merge to PoS in Q3 2024?',
      description: 'Market for predicting if Ethereum will complete its transition to Proof of Stake in Q3 2024',
      category: 'crypto',
      endTime: Date.now() + 1209600000, // 2 weeks from now
      resolved: true, // This market is resolved 
      outcome: true   // Outcome is "yes"
    },
    {
      id: 3,
      title: 'Will Apple release a new iPhone model in September 2024?',
      description: 'Market for predicting if Apple will release a new iPhone model in September 2024',
      category: 'tech',
      endTime: Date.now() + 2419200000, // 4 weeks from now
      resolved: false,
      outcome: null
    }
  ];
  
  private static escrowAccount = {
    publicKey: 'GC5OLXUK3PUXAVOIYJDCCONIGZ5GHMRDHFRFZBMPREZIGYAP5YYNYTFV',
    secretKey: 'SCTJSY7DNPL2Z74U5CVSULWS2QKHQTQCGJHH2SNDMVYJ6IUQRDPD3APQ'
  };

  // Mock storage for predictions with some predictions for resolved markets
  private static predictions = {};

  static async placePrediction(
    marketId: number,
    prediction: boolean,
    amount: string,
    userPublicKey: string,
  ) {
    try {
      const sourceAccount = await this.horizonServer.loadAccount(userPublicKey);
      const fee = await this.horizonServer.fetchBaseFee();
  
      const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
        fee,
        networkPassphrase: this.networkPassphrase,
      })
        .addOperation(
          StellarSdk.Operation.payment({
            destination: this.escrowAccount.publicKey,
            asset: StellarSdk.Asset.native(),
            amount: amount.toString(),
          }),
        )
        .addMemo(StellarSdk.Memo.text(`market:${marketId}:${prediction ? 'yes' : 'no'}`))
        .setTimeout(30)
        .build();
  
      const xdr = transaction.toXDR();
      const signedXDR = await signTransaction(xdr, { networkPassphrase: this.networkPassphrase });
  
      const signedTransaction = StellarSdk.TransactionBuilder.fromXDR(
        signedXDR,
        this.networkPassphrase,
      );
  
      const response = await this.horizonServer.submitTransaction(signedTransaction);
  
      // Store prediction in contract storage
      await this.storePrediction(marketId, userPublicKey, prediction, amount);
  
      toast.success('Prediction placed successfully!');
  
      return response;
    } catch (error) {
      console.error('Error placing prediction:', error);
      throw error;
    }
  }

  static async claimWinnings(marketId: number, userPublicKey: string) {
    try {
      const prediction = await this.getPrediction(marketId, userPublicKey);
      
      if (prediction === null) {
        throw new Error('No prediction found for this market');
      }

      if (!prediction.resolved) {
        throw new Error('Market not resolved yet');
      }

      if (prediction.claimed) {
        throw new Error('Rewards already claimed');
      }

      if (prediction.prediction !== prediction.outcome) {
        throw new Error('You did not win this prediction');
      }

      const sourceKeypair = StellarSdk.Keypair.fromSecret(this.escrowAccount.secretKey);
      const sourceAccount = await this.horizonServer.loadAccount(this.escrowAccount.publicKey);
      const fee = await this.horizonServer.fetchBaseFee();

      const winningAmount = (parseFloat(prediction.amount) * 2).toFixed(7);

      const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
        fee,
        networkPassphrase: this.networkPassphrase,
      })
        .addOperation(
          StellarSdk.Operation.payment({
            destination: userPublicKey,
            asset: StellarSdk.Asset.native(),
            amount: winningAmount,
          }),
        )
        .addMemo(StellarSdk.Memo.text(`claim:${marketId}`))
        .setTimeout(30)
        .build();

      transaction.sign(sourceKeypair);
      
      const response = await this.horizonServer.submitTransaction(transaction);

      // Update prediction status in contract storage
      await this.updatePredictionStatus(marketId, userPublicKey, true);

      return response;
    } catch (error) {
      console.error('Error claiming winnings:', error);
      throw error;
    }
  }

  static async getUserPredictions(userPublicKey: string) {
    try {
      // Get user's predictions from our mock storage
      const userPredictions = this.predictions[userPublicKey] || [];
      
      // If no predictions found, return mock data for testing
      if (userPredictions.length === 0) {
        // Generate some mock predictions for testing with resolved markets and "yes" outcomes
        const mockPredictions = [
          {
            id: '1',
            marketId: 1,
            title: 'Will Bitcoin reach $100,000 by end of 2024?',
            category: 'crypto',
            prediction: true,
            amount: 10,
            resolved: true,
            claimed: false,
            outcome: true, // Outcome is "yes"
            endTime: Date.now() + 86400000,
            userAddress: userPublicKey
          },
          {
            id: '2',
            marketId: 2,
            title: 'Will Ethereum merge to PoS in Q3 2024?',
            category: 'crypto',
            prediction: true,
            amount: 5,
            resolved: true,
            claimed: false,
            outcome: true, // Outcome is "yes"
            endTime: Date.now() + 172800000,
            userAddress: userPublicKey
          },
          {
            id: '3',
            marketId: 3,
            title: 'Will Apple release a new iPhone model in September 2024?',
            category: 'tech',
            prediction: true,
            amount: 15,
            resolved: false,
            claimed: false,
            outcome: null,
            endTime: Date.now() - 86400000,
            userAddress: userPublicKey
          }
        ];
        
        // Store these mock predictions for future use
        this.predictions[userPublicKey] = mockPredictions;
        return mockPredictions;
      }
      
      return userPredictions;
    } catch (error) {
      console.error('Error fetching user predictions:', error);
      throw error;
    }
  }

  private static async storePrediction(
    marketId: number,
    userPublicKey: string,
    prediction: boolean,
    amount: string,
  ) {
    // Initialize user's predictions array if it doesn't exist
    if (!this.predictions[userPublicKey]) {
      this.predictions[userPublicKey] = [];
    }
    
    // Find the market to get its details
    const market = this.markets.find(m => m.id === marketId);
    
    if (!market) {
      throw new Error(`Market with ID ${marketId} not found`);
    }
    
    // Create a new prediction object
    const newPrediction = {
      id: `${marketId}-${userPublicKey}-${Date.now()}`,
      marketId,
      title: market.title,
      category: market.category,
      prediction,
      amount: parseFloat(amount),
      resolved: market.resolved,
      claimed: false,
      outcome: market.outcome,
      endTime: market.endTime,
      userAddress: userPublicKey
    };
    
    // Add to user's predictions
    this.predictions[userPublicKey].push(newPrediction);
  }

  private static async getPrediction(marketId: number, userPublicKey: string) {
    // Get user's predictions
    const userPredictions = this.predictions[userPublicKey] || [];
    
    // Find the prediction for the specified market
    const prediction = userPredictions.find(p => p.marketId === marketId);
    
    return prediction || null;
  }

  private static async updatePredictionStatus(
    marketId: number,
    userPublicKey: string,
    claimed: boolean,
  ) {
    // Get user's predictions
    const userPredictions = this.predictions[userPublicKey] || [];
    
    // Find and update the prediction
    const predictionIndex = userPredictions.findIndex(p => p.marketId === marketId);
    
    if (predictionIndex !== -1) {
      userPredictions[predictionIndex].claimed = claimed;
    }
  }

  static async getMarket(marketId: number) {
    try {
      // Find the market in our mock storage
      const market = this.markets.find(m => m.id === marketId);
      
      if (!market) {
        throw new Error(`Market with ID ${marketId} not found`);
      }
      
      return market;
    } catch (error) {
      console.error('Error fetching market:', error);
      throw error;
    }
  }

  static async getMarkets() {
    try {
      // Return all markets from our mock storage
      return this.markets;
    } catch (error) {
      console.error('Error fetching markets:', error);
      throw error;
    }
  }

  static async resolveMarket(marketId: number, outcome: boolean) {
    try {
      // Find and update the market in our mock storage
      const marketIndex = this.markets.findIndex(m => m.id === marketId);
      
      if (marketIndex !== -1) {
        this.markets[marketIndex].resolved = true;
        this.markets[marketIndex].outcome = outcome;
      }
      
      // Update all predictions for this market
      Object.keys(this.predictions).forEach(userPublicKey => {
        const userPredictions = this.predictions[userPublicKey];
        const predictionIndex = userPredictions.findIndex(p => p.marketId === marketId);
        
        if (predictionIndex !== -1) {
          userPredictions[predictionIndex].resolved = true;
          userPredictions[predictionIndex].outcome = outcome;
        }
      });
      
      return {
        success: true,
        marketId,
        outcome: outcome ? "Yes" : "No",
        message: `Market ${marketId} has been resolved as ${outcome ? "Yes" : "No"}`
      };
    } catch (error) {
      console.error('Error resolving market:', error);
      throw error;
    }
  }

  static async getUserPublicKey() {
    try {
      const publicKey = await getPublicKey();
      return publicKey;
    } catch (error) {
      console.error('Error getting public key from Freighter:', error);
      throw error;
    }
  }

  static async checkFreighterSetup() {
    try {
      const publicKey = await this.getUserPublicKey();
      return {
        isConnected: true,
        publicKey,
        network: 'TESTNET'
      };
    } catch (error) {
      console.error('Freighter setup check failed:', error);
      return {
        isConnected: false,
        error: error.message
      };
    }
  }
}