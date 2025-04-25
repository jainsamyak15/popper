import yahooFinance from 'yahoo-finance2';

export class YahooFinanceAPI {
  static async getQuote(symbol: string) {
    try {
      const quote = await yahooFinance.quote(symbol);
      return quote;
    } catch (error) {
      console.error('Error fetching Yahoo Finance data:', error);
      throw error;
    }
  }

  static async getHistoricalData(symbol: string, period = '1mo') {
    try {
      const data = await yahooFinance.historical(symbol, {
        period1: '2024-01-01',
        period2: new Date().toISOString().split('T')[0],
        interval: '1d',
      });
      return data;
    } catch (error) {
      console.error('Error fetching historical data:', error);
      throw error;
    }
  }
}