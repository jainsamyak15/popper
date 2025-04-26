'use client';

import { useState, useEffect } from 'react';
import { StellarService } from '@/src/services/stellar';
import { useWallet } from '@/hooks/use-wallet';
import { toast } from 'sonner';

export function useMarket(marketId?: string) {
  const [market, setMarket] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [predicting, setPredicting] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const { address } = useWallet();

  useEffect(() => {
    if (marketId) {
      fetchMarketData();
    }
  }, [marketId]);

  const fetchMarketData = async () => {
    try {
      setLoading(true);
      // Fetch market data from smart contract
      const data = await StellarService.getMarket(Number(marketId));
      setMarket(data);
    } catch (error) {
      console.error('Error fetching market:', error);
      toast.error('Failed to load market data');
    } finally {
      setLoading(false);
    }
  };

  const placePrediction = async (prediction: boolean, amount: string) => {
    if (!marketId || !address) return;

    try {
      setPredicting(true);
      await StellarService.placePrediction(
        Number(marketId),
        prediction,
        amount,
        address
      );
      toast.success('Prediction placed successfully');
      await fetchMarketData();
    } catch (error) {
      console.error('Error placing prediction:', error);
      toast.error('Failed to place prediction');
    } finally {
      setPredicting(false);
    }
  };

  const claimWinnings = async () => {
    if (!marketId || !address) return;

    try {
      setClaiming(true);
      await StellarService.claimWinnings(Number(marketId), address);
      toast.success('Winnings claimed successfully');
      await fetchMarketData();
    } catch (error) {
      console.error('Error claiming winnings:', error);
      toast.error('Failed to claim winnings');
    } finally {
      setClaiming(false);
    }
  };

  return {
    market,
    loading,
    predicting,
    claiming,
    placePrediction,
    claimWinnings,
    refreshMarket: fetchMarketData,
  };
}