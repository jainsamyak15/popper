import { OpenAI } from 'openai';
import { Crew } from 'crewai-js';
import { ExaSearchAPI } from './exa-search';
import { YahooFinanceAPI } from './yahoo-finance';
import { TwitterAPI } from './twitter-api';
import { GoogleTrendsAPI } from './google-trends';
import dotenv from 'dotenv';

dotenv.config();

// Initialize OpenAI with the new SDK
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Check for API key
if (!process.env.OPENAI_API_KEY) {
  console.warn('Warning: OPENAI_API_KEY not found in environment variables');
}

// Initialize Crew with consistent configuration
const crew = new Crew({
  agents: [
    {
      name: 'DataCollector',
      role: 'Collects and verifies data from multiple sources',
      goal: 'Gather accurate and reliable information from various sources',
      tools: ['ExaSearchAPI', 'YahooFinanceAPI'],
      llm: {
        model: 'gpt-4-turbo',
        temperature: 0.3,
      },
    },
    {
      name: 'MarketAnalyst',
      role: 'Analyzes market data and trends',
      goal: 'Analyze market data and provide accurate predictions',
      tools: ['YahooFinanceAPI'],
      llm: {
        model: 'gpt-4-turbo',
        temperature: 0.2,
      },
    },
    {
      name: 'TrendAnalyzer',
      role: 'Analyzes social media trends and news',
      goal: 'Identify trending topics and potential market opportunities',
      tools: ['TwitterAPI', 'GoogleTrendsAPI'],
      llm: {
        model: 'gpt-4-turbo',
        temperature: 0.4,
      },
    },
  ],
});

export class ResolutionService {
  static async resolveMarket(marketId: string, marketData: any) {
    try {
      const taskDescription = `Analyze and resolve the prediction market: ${marketData.title}`;
      console.log('Task Description:', taskDescription);

      const dataCollector = crew.getAgent('DataCollector');
      const marketAnalyst = crew.getAgent('MarketAnalyst');

      const [searchResults, financialData] = await Promise.all([
        dataCollector.execute('searchRelevantData', { query: marketData.title }),
        dataCollector.execute('getFinancialData', { query: marketData.title }),
      ]);

      const exaAnalysis = await ExaSearchAPI.analyze(marketData.title);

      const analysis = await marketAnalyst.execute('analyzeMarketData', {
        searchResults,
        financialData,
        marketData,
        exaAnalysis,
      });

      const gptVerification = await openai.chat.completions.create({
        model: 'gpt-4-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a market resolution expert. Analyze the data and provide a final verdict.',
          },
          {
            role: 'user',
            content: `Market: ${marketData.title}\nAnalysis: ${JSON.stringify(analysis)}\nExa Analysis: ${JSON.stringify(exaAnalysis)}`,
          },
        ],
      });

      const responseMessage = gptVerification.choices[0].message?.content || '';

      return {
        outcome: analysis.confidence > 0.8,
        confidence: analysis.confidence,
        sources: analysis.sources,
        verification: responseMessage,
      };
    } catch (error) {
      console.error('Error resolving market:', error);
      throw new Error('Failed to resolve market.');
    }
  }

  static async generateMarkets() {
    try {
      const trendAnalyzer = crew.getAgent('TrendAnalyzer');
      const marketAnalyst = crew.getAgent('MarketAnalyst');

      const [twitterTrends, googleTrends] = await Promise.all([
        trendAnalyzer.execute('getTwitterTrends'),
        trendAnalyzer.execute('getGoogleTrends'),
      ]);

      const marketOpportunities = await marketAnalyst.execute('analyzeMarketOpportunities', {
        twitterTrends,
        googleTrends,
      });

      const refinedMarkets = await Promise.all(
        marketOpportunities.map(async (market: any) => {
          const completion = await openai.chat.completions.create({
            model: 'gpt-4-turbo',
            messages: [
              {
                role: 'system',
                content: 'Create a clear, concise prediction market description.',
              },
              {
                role: 'user',
                content: `Topic: ${market.topic}\nContext: ${market.context}`,
              },
            ],
          });

          return {
            ...market,
            description: completion.choices[0].message?.content || '',
          };
        })
      );

      return refinedMarkets;
    } catch (error) {
      console.error('Error generating markets:', error);
      throw new Error('Failed to generate market opportunities.');
    }
  }
}