import { google } from 'google-trends-api';

export class GoogleTrendsAPI {
  static async getTrends() {
    try {
      const results = await google.realTimeTrends({
        geo: 'US',
        category: 'all',
      });

      return JSON.parse(results).storySummaries.trendingStories;
    } catch (error) {
      console.error('Error fetching Google Trends:', error);
      throw error;
    }
  }

  static async getRelatedQueries(keyword: string) {
    try {
      const results = await google.relatedQueries({
        keyword,
        startTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        endTime: new Date(),
      });

      return JSON.parse(results);
    } catch (error) {
      console.error('Error fetching related queries:', error);
      throw error;
    }
  }
}