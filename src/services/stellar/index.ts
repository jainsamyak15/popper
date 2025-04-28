import { Server } from 'stellar-sdk';
import { getPublicKey, signTransaction } from '@stellar/freighter-api';
import * as StellarSdk from 'stellar-sdk';
import { contractId, sorobanServer } from './config';
import { Horizon } from 'stellar-sdk';

export class StellarService {
  private static sorobanServer = sorobanServer;
  private static horizonServer = new Horizon.Server('https://horizon-testnet.stellar.org');
  private static contractId = contractId;
  private static baseFee = StellarSdk.BASE_FEE;
  private static networkPassphrase = 'Test SDF Network ; September 2015'; // Correct Test Network passphrase
  private static escrowAccount = 'GC5OLXUK3PUXAVOIYJDCCONIGZ5GHMRDHFRFZBMPREZIGYAP5YYNYTFV';

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
        networkPassphrase: this.networkPassphrase, // Use the correct Test Network passphrase
      })
        .addOperation(
          StellarSdk.Operation.payment({
            destination: this.escrowAccount,
            asset: StellarSdk.Asset.native(),
            amount: amount.toString(),
          }),
        )
        .addMemo(StellarSdk.Memo.text(`market:${marketId}:${prediction ? 'yes' : 'no'}`))
        .setTimeout(30)
        .build();

      const xdr = transaction.toXDR();
      const signedXDR = await signTransaction(xdr);
      const signedTransaction = StellarSdk.TransactionBuilder.fromXDR(
        signedXDR,
        this.networkPassphrase, // Use the correct Test Network passphrase
      );

      const response = await this.horizonServer.submitTransaction(signedTransaction);

      const predictions = this.getPredictions();
      predictions[marketId] = {
        prediction,
        amount: parseFloat(amount),
        timestamp: Date.now(),
        txHash: response.hash,
      };
      localStorage.setItem('predictions', JSON.stringify(predictions));

      return response;
    } catch (error) {
      console.error('Error placing prediction:', error);
      throw error;
    }
  }

  static async claimWinnings(marketId: number, userPublicKey: string) {
    try {
      const predictions = this.getPredictions();
      const prediction = predictions[marketId];

      if (!prediction) {
        throw new Error('No prediction found for this market');
      }

      const sourceAccount = await this.horizonServer.loadAccount(this.escrowAccount);
      const fee = await this.horizonServer.fetchBaseFee();

      const winningAmount = (prediction.amount * 2).toFixed(7);

      const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
        fee,
        networkPassphrase: this.networkPassphrase, // Use the correct Test Network passphrase
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

      const xdr = transaction.toXDR();
      const signedXDR = await signTransaction(xdr);
      const signedTransaction = StellarSdk.TransactionBuilder.fromXDR(
        signedXDR,
        this.networkPassphrase, // Use the correct Test Network passphrase
      );

      const response = await this.horizonServer.submitTransaction(signedTransaction);

      delete predictions[marketId];
      localStorage.setItem('predictions', JSON.stringify(predictions));

      return response;
    } catch (error) {
      console.error('Error claiming winnings:', error);
      throw error;
    }
  }

  private static getPredictions(): Record<string, any> {
    return JSON.parse(localStorage.getItem('predictions') || '{}');
  }

  static async getMarkets() {
    const predictions = this.getPredictions();
    
    return [
      {
        id: 1,
        title: 'Will Bitcoin exceed $100,000 before the end of 2025?',
        description: 'This market will resolve to YES if the price of Bitcoin (BTC) exceeds $100,000 USD on any major exchange before December 31, 2025, 23:59:59 UTC.',
        category: 'crypto',
        yesPool: 1000,
        noPool: 800,
        endTime: new Date('2025-12-31').getTime(),
        resolved: false,
        outcome: null,
        userPrediction: predictions[1] || null,
      },
      // Add more mock markets as needed
    ];
  }
}