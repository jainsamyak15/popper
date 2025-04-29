'use client';

import { motion } from 'framer-motion';
import { Check, X, Clock, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatTimeRemaining } from '@/lib/utils/date-utils';
import { StellarService } from '@/src/services/stellar';
import { useState } from 'react';
import { toast } from 'sonner';

interface PredictionCardProps {
  prediction: {
    title: string;
    category: string;
    endTime: number;
    prediction: boolean;
    amount: number;
    resolved: boolean;
    outcome: boolean;
    claimed: boolean;
    marketId: number;
    userAddress: string;
  };
  onClaim: () => void;
}

export function PredictionCard({ prediction, onClaim }: PredictionCardProps) {
  const [claiming, setClaiming] = useState(false);

  const handleClaim = async () => {
    try {
      setClaiming(true);
      await StellarService.claimWinnings(prediction.marketId, prediction.userAddress);
      toast.success('Rewards claimed successfully!');
      onClaim();
    } catch (error) {
      console.error('Error claiming rewards:', error);
      toast.error('Failed to claim rewards');
    } finally {
      setClaiming(false);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="h-full overflow-hidden glassmorphism">
        <CardContent className="p-6">
          <div className="flex justify-between items-start gap-2 mb-3">
            <Badge variant={prediction.category === 'crypto' ? 'default' : 'secondary'}>
              {prediction.category}
            </Badge>
            <div className="text-sm flex items-center text-muted-foreground">
              <Clock className="h-3.5 w-3.5 mr-1" />
              <span>{formatTimeRemaining(new Date(prediction.endTime).toISOString())}</span>
            </div>
          </div>
          
          <h3 className="font-semibold text-lg mb-3 line-clamp-2">
            {prediction.title}
          </h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="text-sm">
                <span className="text-muted-foreground">Your Prediction:</span>
                <div className="flex items-center mt-1">
                  <Badge variant={prediction.prediction ? 'default' : 'destructive'}>
                    {prediction.prediction ? (
                      <><Check className="h-3 w-3 mr-1" /> YES</>
                    ) : (
                      <><X className="h-3 w-3 mr-1" /> NO</>
                    )}
                  </Badge>
                </div>
              </div>
              
              <div className="text-right">
                <span className="text-sm text-muted-foreground">Amount:</span>
                <div className="font-medium mt-1">{prediction.amount} XLM</div>
              </div>
            </div>

            {prediction.resolved && (
              <div className="flex justify-between items-center pt-4 border-t">
                <div className="text-sm">
                  <span className="text-muted-foreground">Outcome:</span>
                  <div className="flex items-center mt-1">
                    <Badge variant={prediction.outcome ? 'default' : 'destructive'}>
                      {prediction.outcome ? 'YES' : 'NO'}
                    </Badge>
                  </div>
                </div>
                
                <div className="text-right">
                  <span className="text-sm text-muted-foreground">Potential Reward:</span>
                  <div className={`font-medium mt-1 flex items-center ${
                    prediction.outcome === prediction.prediction ? 'text-chart-3' : 'text-destructive'
                  }`}>
                    {prediction.outcome === prediction.prediction ? (
                      <>
                        <ArrowUpRight className="h-3 w-3 mr-1" />
                        +{(prediction.amount * 2).toFixed(2)} XLM
                      </>
                    ) : (
                      <>
                        <ArrowDownRight className="h-3 w-3 mr-1" />
                        -{prediction.amount} XLM
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {prediction.resolved && !prediction.claimed && prediction.outcome === prediction.prediction && (
              <Button
                className="w-full mt-4"
                onClick={handleClaim}
                disabled={claiming}
              >
                {claiming ? 'Claiming...' : 'Claim Rewards'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}