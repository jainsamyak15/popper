// /app/markets/[id]/client.tsx (Client Component)
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShareIcon, Clock, AlertCircle, ChevronRight, BarChart4 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { MarketChart } from '@/components/markets/market-chart';
import { PredictionForm } from '@/components/markets/prediction-form';
import { MarketActivity } from '@/components/markets/market-activity';
import { formatTimeRemaining } from '@/lib/utils/date-utils';
import { marketsMock } from '@/lib/mocks/markets';
import { MarketResolutionInfo } from '@/components/markets/market-resolution-info';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Define the props interface for the client component
interface MarketPageClientProps {
  initialMarket: any; // Replace 'any' with your market type
  id: string;
}

export default function MarketPageClient({ initialMarket, id }: MarketPageClientProps) {
  const [market, setMarket] = useState<any>(initialMarket);
  const [isLoading, setIsLoading] = useState(!initialMarket);
  const [timeRemaining, setTimeRemaining] = useState('');
  
  // Only fetch if we don't have initial data
  useEffect(() => {
    if (!initialMarket) {
      // Simulate fetching market data
      setTimeout(() => {
        const foundMarket = marketsMock.find(m => m.id === id);
        if (foundMarket) {
          setMarket(foundMarket);
        }
        setIsLoading(false);
      }, 1000);
    }
  }, [id, initialMarket]);

  useEffect(() => {
    if (market) {
      const interval = setInterval(() => {
        setTimeRemaining(formatTimeRemaining(market.closingDate));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [market]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[50vh]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-48 bg-muted rounded mb-4"></div>
          <div className="h-4 w-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (!market) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Market not found</h1>
        <p className="text-muted-foreground">The market you are looking for does not exist or has been removed.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-center text-sm text-muted-foreground mb-4">
          <span>Markets</span>
          <ChevronRight className="h-4 w-4 mx-1" />
          <span>{market.category}</span>
          <ChevronRight className="h-4 w-4 mx-1" />
          <span className="text-foreground">{market.title}</span>
        </div>
        
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{market.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>{timeRemaining} left</span>
              </div>
              <div className="flex items-center">
                <BarChart4 className="h-4 w-4 mr-1" />
                <span>${market.volume.toLocaleString()} volume</span>
              </div>
              <div className="flex items-center gap-1">
                <Avatar className="h-5 w-5">
                  <AvatarImage src={`https://api.dicebear.com/7.x/bottts/svg?seed=${market.id}`} />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
                <span>AI Resolved</span>
              </div>
            </div>
          </div>
          
          <Button variant="outline" size="sm">
            <ShareIcon className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="p-6 rounded-xl glassmorphism mb-8">
            <MarketChart marketId={market.id} yesPrice={market.yesPrice} />
          </div>

          <Tabs defaultValue="details" className="mb-8">
            <TabsList className="w-full grid grid-cols-3 mb-4">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="resolution">Resolution</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="p-6 rounded-xl glassmorphism">
              <h3 className="text-xl font-semibold mb-4">Market Details</h3>
              <p className="mb-4">{market.description}</p>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-1">Resolution Criteria</h4>
                  <p className="text-sm text-muted-foreground">{market.resolutionCriteria}</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-1">Closing Date</h4>
                  <p className="text-sm text-muted-foreground">{new Date(market.closingDate).toLocaleString()}</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="resolution" className="p-6 rounded-xl glassmorphism">
              <MarketResolutionInfo market={market} />
            </TabsContent>
            
            <TabsContent value="activity" className="p-6 rounded-xl glassmorphism">
              <MarketActivity marketId={market.id} />
            </TabsContent>
          </Tabs>
        </div>
        
        <div>
          <div className="p-6 rounded-xl glassmorphism mb-8 sticky top-20">
            <h3 className="text-xl font-semibold mb-6">Make a Prediction</h3>
            <PredictionForm market={market} />
            
            <Separator className="my-6" />
            
            <div className="bg-muted/20 rounded-lg p-4 text-sm">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <p>
                  This market will be resolved by our AI resolution system based on
                  consensus from multiple AI agents using verified data sources.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}