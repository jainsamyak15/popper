'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useWallet } from '@/hooks/use-wallet';
import { StellarService } from '@/src/services/stellar';
import { ConnectWalletButton } from '@/components/wallet/connect-wallet-button';
import { PredictionCard } from '@/components/about/prediction-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AboutPage() {
  const { isConnected, address } = useWallet();
  const [predictions, setPredictions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isConnected && address) {
      fetchUserPredictions();
    }
  }, [isConnected, address]);

  const fetchUserPredictions = async () => {
    try {
      setLoading(true);
      const userPredictions = await StellarService.getUserPredictions(address!);
      setPredictions(userPredictions);
    } catch (error) {
      toast.error('Failed to load predictions');
      toast.error('Failed to load predictions');
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-lg"
        >
          <h1 className="text-3xl font-bold mb-4">Connect Your Wallet</h1>
          <p className="text-muted-foreground mb-8">
            Connect your wallet to view your prediction history and claim rewards.
          </p>
          <ConnectWalletButton />
        </motion.div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[60vh]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-48 bg-muted rounded mb-4"></div>
          <div className="h-4 w-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Your Predictions</h1>
        <p className="text-muted-foreground">
          View your prediction history and claim rewards for resolved markets.
        </p>
      </motion.div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="w-full max-w-md mb-8">
          <TabsTrigger value="active" className="flex-1">Active</TabsTrigger>
          <TabsTrigger value="resolved" className="flex-1">Resolved</TabsTrigger>
          <TabsTrigger value="claimed" className="flex-1">Claimed</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {predictions
            .filter(p => !p.resolved)
            .map(prediction => (
                <PredictionCard
                key={prediction.id}
                prediction={prediction}
                onClaim={fetchUserPredictions}
                />
            ))}
        </div>
        </TabsContent>

        <TabsContent value="resolved">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {predictions
            .filter(p => p.resolved && !p.claimed)
            .map(prediction => (
                <PredictionCard
                key={prediction.id}
                prediction={prediction}
                onClaim={fetchUserPredictions}
                />
            ))}
        </div>
        </TabsContent>

        <TabsContent value="claimed">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {predictions
            .filter(p => p.claimed)
            .map(prediction => (
                <PredictionCard
                key={prediction.id}
                prediction={prediction}
                onClaim={fetchUserPredictions}
                />
            ))}
        </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}