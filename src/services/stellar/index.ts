import { Server } from 'stellar-sdk';
import { getPublicKey, signTransaction } from '@stellar/freighter-api';
import * as StellarSdk from 'stellar-sdk';
import { contractId, sorobanServer } from './config';
import { toast } from 'sonner';
import { Horizon } from 'stellar-sdk';

export class StellarService {
  private static sorobanServer = sorobanServer;
  private static horizonServer = new Horizon.Server('https://horizon-testnet.stellar.org');
  private static contractId = contractId;
  private static baseFee = StellarSdk.BASE_FEE;
  private static networkPassphrase = StellarSdk.Networks.TESTNET;
  private static escrowAccount = {
    publicKey: 'GC5OLXUK3PUXAVOIYJDCCONIGZ5GHMRDHFRFZBMPREZIGYAP5YYNYTFV',
    secretKey: 'SCTJSY7DNPL2Z74U5CVSULWS2QKHQTQCGJHH2SNDMVYJ6IUQRDPD3APQ'
  };

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
    } catch (error: any) {
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

      if (!prediction.resolved || prediction.claimed) {
        throw new Error('Market not resolved or rewards already claimed');
      }

      const sourceKeypair = StellarSdk.Keypair.fromSecret(this.escrowAccount.secretKey);
      const sourceAccount = await this.horizonServer.loadAccount(this.escrowAccount.publicKey);
      const fee = await this.horizonServer.fetchBaseFee();

      const winningAmount = (prediction.amount * 2).toFixed(7);

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
      // Fetch user's predictions from contract storage or mock data
      const predictions = await this.sorobanServer.getEvents({
        filters: [
          { type: 'prediction', userPublicKey },
        ],
      });
  
      // Map predictions to the expected structure
      return predictions.events.map((event: any) => ({
        id: event.id,
        marketId: event.marketId,
        marketTitle: event.title,
        category: event.category,
        prediction: event.prediction ? 'yes' : 'no',
        amount: event.amount,
        resolved: event.resolved,
        claimed: event.claimed,
        outcome: event.outcome,
        endTime: event.endTime,
      }));
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
    // Store prediction in contract storage
    // Implementation depends on your contract structure
  }

  private static async getPrediction(marketId: number, userPublicKey: string): Promise<any | null> {
    // Fetch prediction from contract storage
    // Implementation depends on your contract structure
    return null; // Replace with actual implementation
  }

  private static async updatePredictionStatus(
    marketId: number,
    userPublicKey: string,
    claimed: boolean,
  ) {
    // Update prediction status in contract storage
    // Implementation depends on your contract structure
  }

  static async getMarket(marketId: number) {
    try {
      // Fetch market data from contract storage
      const market = await this.sorobanServer.getEvents({
        filters: [
          { type: 'market', marketId },
        ],
      });

      return market;
    } catch (error) {
      console.error('Error fetching market:', error);
      throw error;
    }
  }

  static async getMarkets() {
    try {
      // Fetch all markets from contract storage
      const markets = await this.sorobanServer.getEvents({
        filters: [
          { type: 'market' },
        ],
      });

      return markets;
    } catch (error) {
      console.error('Error fetching markets:', error);
      throw error;
    }
  }

  static async resolveMarket(marketId: number, outcome: boolean) {
    try {
      // Update market resolution in contract storage
      // Implementation depends on your contract structure
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