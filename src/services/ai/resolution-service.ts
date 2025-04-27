import { OpenAI } from 'openai';
import { PrismCrew } from '../../../agent/agentic-prism/src/prism_crew';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export class ResolutionService {
  static async resolveMarket(marketId: string, marketData: any) {
    try {
      // Initialize PrismCrew
      const crew = new PrismCrew();
      
      // Create task for market resolution
      const task = {
        input_statement: marketData.title,
      };

      // Run the crew analysis
      const result = await crew.crew().kickoff(task);

      // Parse crew results
      const outcome = result.includes('VERDICT: TRUE');
      const confidenceMatch = result.match(/CONFIDENCE: (\d+)%/);
      const confidence = confidenceMatch ? parseInt(confidenceMatch[1]) / 100 : 0;

      // Additional verification with GPT-4
      const gptVerification = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a market resolution expert. Verify the AI crew analysis and provide a final verdict.',
          },
          {
            role: 'user',
            content: `Market: ${marketData.title}\nCrew Analysis: ${result}`,
          },
        ],
      });

      return {
        outcome,
        confidence,
        crewAnalysis: result,
        verification: gptVerification.choices[0].message?.content,
      };
    } catch (error) {
      console.error('Error resolving market:', error);
      throw new Error('Failed to resolve market');
    }
  }
}