import Exa from 'exa-js';
import dotenv from 'dotenv';

dotenv.config();

// Ensure API key is available
const exaApiKey = process.env.EXA_API_KEY;
if (!exaApiKey) {
  console.warn('Warning: EXA_API_KEY not found in environment variables');
}

const exa = new Exa(exaApiKey);

export class ExaSearchAPI {
  static async search(query: string) {
    try {
      const results = await exa.search(query, {
        useAutoprompt: true,
        numResults: 10,
      });

      return results.results.map((item) => ({
        title: item.title,
        content: item.text,
        url: item.url,
        score: item.relevanceScore,
      }));
    } catch (error) {
      console.error('Error fetching data from Exa:', error);
      throw error;
    }
  }

  static async analyze(query: string) {
    try {
      const result = await exa.analyze(query, {
        type: 'market_analysis',
      });

      return {
        sentiment: result.sentiment,
        confidence: result.confidence,
        entities: result.entities,
        summary: result.summary,
      };
    } catch (error) {
      console.error('Error analyzing with Exa:', error);
      throw error;
    }
  }
}