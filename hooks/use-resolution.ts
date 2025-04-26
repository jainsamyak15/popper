import { useState } from 'react';
import { toast } from 'sonner';

export function useResolution() {
  const [resolving, setResolving] = useState(false);

  const resolveMarket = async (marketId: string, marketData: any) => {
    try {
      setResolving(true);

      const response = await fetch('/api/markets/resolve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ marketId, marketData }),
      });

      if (!response.ok) {
        throw new Error('Failed to resolve market');
      }

      const data = await response.json();
      toast.success('Market resolved successfully');
      return data;
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