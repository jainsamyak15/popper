import { Server } from 'stellar-sdk';
import { Contract } from 'soroban-client';
import { contractId, networkPassphrase, sorobanServer } from './config';

export class StellarService {
  private static contractId = 'CDRS7Q7KSH4KUUUBKLL2IYD4HQKNSIBVQ7BJCKC5RKPKUAVNP6D7G6QW';
  private static contract = new Contract(this.contractId);
  private static server = new Server('https://horizon-testnet.stellar.org');

  static async createMarket(
    title: string,
    description: string,
    category: string,
    endTime: number,
  ) {
    try {
      const result = await this.contract.call(
        'create_market',
        title,
        description,
        category,
        endTime,
      );

      return result;
    } catch (error) {
      console.error('Error creating market:', error);
      throw error;
    }
  }

  static async placePrediction(
    marketId: number,
    prediction: boolean,
    amount: string,
    userPublicKey: string,
  ) {
    try {
      const result = await this.contract.call(
        'place_prediction',
        marketId,
        prediction,
        amount,
      );

      return result;
    } catch (error) {
      console.error('Error placing prediction:', error);
      throw error;
    }
  }

  static async resolveMarket(marketId: number, outcome: boolean) {
    try {
      const result = await this.contract.call(
        'resolve_market',
        marketId,
        outcome,
      );

      return result;
    } catch (error) {
      console.error('Error resolving market:', error);
      throw error;
    }
  }

  static async claimWinnings(marketId: number, userPublicKey: string) {
    try {
      const result = await this.contract.call(
        'claim_winnings',
        marketId,
      );

      return result;
    } catch (error) {
      console.error('Error claiming winnings:', error);
      throw error;
    }
  }

  static async getMarket(marketId: number) {
    try {
      const result = await this.contract.call(
        'get_market',
        marketId,
      );

      return result;
    } catch (error) {
      console.error('Error getting market:', error);
      throw error;
    }
  }

  static async getMarkets() {
    try {
      const count = await this.contract.call('get_market_count');
      const markets = [];

      for (let i = 1; i <= count; i++) {
        const market = await this.getMarket(i);
        markets.push(market);
      }

      return markets;
    } catch (error) {
      console.error('Error getting markets:', error);
      throw error;
    }
  }
}