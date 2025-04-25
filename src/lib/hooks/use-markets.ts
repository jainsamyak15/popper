'use strict';

import { useState, useEffect } from 'react';
import { AIService } from '@/services/ai';
import { StellarService } from '@/services/stellar';
import { toast } from 'sonner';

export function useMarkets() {
  const [markets, setMarkets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchMarkets();
  }, []);

  const fetchMarkets = async () => {
    try {
      setLoading(true);
      // Fetch markets from smart contract
      const data = await StellarService.getMarkets();
      setMarkets(data);
    } catch (error) {
      console.error('Error fetching markets:', error);
      toast.error('Failed to load markets');
    } finally {
      setLoading(false);
    }
  };

  const generateMarkets = async () => {
    try {
      setGenerating(true);
      // Generate new market opportunities using AI
      const opportunities = await AIService.generateMarkets();
      
      // Create markets on-chain
      for (const market of opportunities) {
        await StellarService.createMarket(
          market.title,
          market.description,
          market.category,
          market.endTime
        );
      }

      toast.success('New markets generated successfully');
      await fetchMarkets();
    } catch (error) {
      console.error('Error generating markets:', error);
      toast.error('Failed to generate markets');
    } finally {
      setGenerating(false);
    }
  };

  return {
    markets,
    loading,
    generating,
    generateMarkets,
    refreshMarkets: fetchMarkets,
  };
}