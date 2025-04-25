'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Award, 
  TrendingUp, 
  History,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserStats } from '@/components/portfolio/user-stats';
import { UserPositions } from '@/components/portfolio/user-positions';
import { TransactionHistory } from '@/components/portfolio/transaction-history';
import { useWallet } from '@/hooks/use-wallet';
import { ConnectWalletButton } from '@/components/wallet/connect-wallet-button';

export default function PortfolioPage() {
  const { isConnected, balance, address } = useWallet();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
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
            Connect your Freighter wallet to view your portfolio, positions, and transaction history.
          </p>
          <ConnectWalletButton />
        </motion.div>
      </div>
    );
  }

  if (isLoading) {
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
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Your Portfolio</h1>
        <p className="text-muted-foreground">
          View your positions, transaction history, and performance metrics.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-muted-foreground text-sm font-medium">Total Balance</div>
              <div className="p-2 bg-primary/10 rounded-full">
                <BarChart3 className="h-4 w-4 text-primary" />
              </div>
            </div>
            <div className="text-2xl font-bold mb-1">{balance} XLM</div>
            <div className="flex items-center text-xs text-chart-3">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              <span>+12.5% this week</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-muted-foreground text-sm font-medium">Total Profit</div>
              <div className="p-2 bg-chart-3/10 rounded-full">
                <TrendingUp className="h-4 w-4 text-chart-3" />
              </div>
            </div>
            <div className="text-2xl font-bold mb-1">+245.80 XLM</div>
            <div className="flex items-center text-xs text-chart-3">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              <span>+3.2% this week</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-muted-foreground text-sm font-medium">Open Positions</div>
              <div className="p-2 bg-secondary/10 rounded-full">
                <TrendingUp className="h-4 w-4 text-secondary" />
              </div>
            </div>
            <div className="text-2xl font-bold mb-1">12</div>
            <div className="flex items-center text-xs text-chart-3">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              <span>+2 new this week</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-muted-foreground text-sm font-medium">Success Rate</div>
              <div className="p-2 bg-accent/10 rounded-full">
                <Award className="h-4 w-4 text-accent" />
              </div>
            </div>
            <div className="text-2xl font-bold mb-1">78%</div>
            <div className="flex items-center text-xs text-destructive">
              <ArrowDownRight className="h-3 w-3 mr-1" />
              <span>-2.5% this week</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="positions" className="w-full">
        <TabsList className="w-full max-w-md mb-8">
          <TabsTrigger value="positions" className="flex-1">Positions</TabsTrigger>
          <TabsTrigger value="history" className="flex-1">History</TabsTrigger>
          <TabsTrigger value="stats" className="flex-1">Stats</TabsTrigger>
        </TabsList>
        
        <TabsContent value="positions" className="p-1">
          <UserPositions />
        </TabsContent>
        
        <TabsContent value="history" className="p-1">
          <TransactionHistory />
        </TabsContent>
        
        <TabsContent value="stats" className="p-1">
          <UserStats />
        </TabsContent>
      </Tabs>
    </div>
  );
}