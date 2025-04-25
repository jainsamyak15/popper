import { Configuration, OpenAIApi } from 'openai';
import { CrewAI } from 'crewai-js';
import { ExaSearchAPI } from './exa-search';
import { YahooFinanceAPI } from './yahoo-finance';
import { TwitterAPI } from './twitter-api';
import { GoogleTrendsAPI } from './google-trends';

// Initialize OpenAI
const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  })
);

// Initialize CrewAI
const crew = new CrewAI({
  agents: [
    {
      name: 'DataCollector',
      role: 'Collects and verifies data from multiple sources',
      goal: 'Gather accurate and reliable information from various sources',
      tools: [ExaSearchAPI, YahooFinanceAPI],
    },
    {
      name: 'MarketAnalyst',
      role: 'Analyzes market data and trends',
      goal: 'Analyze market data and provide accurate predictions',
      tools: [YahooFinanceAPI],
    },
    {
      name: 'TrendAnalyzer',
      role: 'Analyzes social media trends and news',
      goal: 'Identify trending topics and potential market opportunities',
      tools: [TwitterAPI, GoogleTrendsAPI],
    },
  ],
});

export class AIService {
  static async resolveMarket(marketId: string, marketData: any) {
    const task = crew.createTask({
      description: `Analyze and resolve the prediction market: ${marketData.title}`,
      expected_output: 'Boolean resolution (true/false) with confidence score',
    });

    // Collect data from multiple sources
    const dataCollector = crew.getAgent('DataCollector');
    const marketAnalyst = crew.getAgent('MarketAnalyst');
    
    const [searchResults, financialData] = await Promise.all([
      dataCollector.execute('searchRelevantData', { query: marketData.title }),
      dataCollector.execute('getFinancialData', { query: marketData.title }),
    ]);

    // Get Exa's analysis
    const exaAnalysis = await ExaSearchAPI.analyze(marketData.title);

    // Analyze collected data
    const analysis = await marketAnalyst.execute('analyzeMarketData', {
      searchResults,
      financialData,
      marketData,
      exaAnalysis,
    });

    // Use GPT-4 for final verification
    const gptVerification = await openai.createChatCompletion({
      model: 'gpt-4',
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

    // Combine all signals for final resolution
    const resolution = {
      outcome: analysis.confidence > 0.8,
      confidence: analysis.confidence,
      sources: analysis.sources,
      verification: gptVerification.data.choices[0].message?.content,
    };

    return resolution;
  }

  static async generateMarkets() {
    const trendAnalyzer = crew.getAgent('TrendAnalyzer');
    const marketAnalyst = crew.getAgent('MarketAnalyst');

    // Get trending topics
    const [twitterTrends, googleTrends] = await Promise.all([
      trendAnalyzer.execute('getTwitterTrends'),
      trendAnalyzer.execute('getGoogleTrends'),
    ]);

    // Analyze trends and generate market opportunities
    const marketOpportunities = await marketAnalyst.execute('analyzeMarketOpportunities', {
      twitterTrends,
      googleTrends,
    });

    // Use GPT-4 to refine market descriptions
    const refinedMarkets = await Promise.all(
      marketOpportunities.map(async (market) => {
        const completion = await openai.createChatCompletion({
          model: 'gpt-4',
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
          description: completion.data.choices[0].message?.content,
        };
      })
    );

    return refinedMarkets;
  }
}