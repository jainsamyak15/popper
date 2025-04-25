import { Client } from 'twitter-api-sdk';

export class TwitterAPI {
  private static client = new Client(process.env.TWITTER_BEARER_TOKEN!);

  static async getTrends() {
    try {
      const response = await this.client.tweets.tweetsRecentSearch({
        query: 'is:trending -is:retweet lang:en',
        'tweet.fields': ['public_metrics', 'created_at'],
        max_results: 100,
      });

      return response.data?.map((tweet) => ({
        id: tweet.id,
        text: tweet.text,
        metrics: tweet.public_metrics,
        created_at: tweet.created_at,
      }));
    } catch (error) {
      console.error('Error fetching Twitter trends:', error);
      throw error;
    }
  }
}