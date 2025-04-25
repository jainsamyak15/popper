'use client';

import { useState } from 'react';
import { AIService } from '@/services/ai';
import { StellarService } from '@/services/stellar';
import { toast } from 'sonner';

export function useResolution() {
  const [resolving, setResolving] = useState(false);

  const resolveMarket = async (marketId: string, marketData: any) => {
    try {
      setResolving(true);

      // Get AI resolution
      const resolution = await AIService.resolveMarket(marketId, marketData);

      // Submit resolution to blockchain
      await StellarService.resolveMarket(
        Number(marketId),
        resolution.outcome
      );

      toast.success('Market resolved successfully');
      return resolution;
    } catch (error) {
      console.error('Error resolving market:', error);
      toast.error('Failed to resolve market');
      throw error;
    } finally {
      setResolving(false);
    }
  };

  return {
    resolving,
    resolveMarket,
  };
}