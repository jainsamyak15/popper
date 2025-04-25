'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useWallet } from '@/hooks/use-wallet';
import { ConnectWalletButton } from '@/components/wallet/connect-wallet-button';
import { toast } from 'sonner';

interface PredictionFormProps {
  market: any;
}

export function PredictionForm({ market }: PredictionFormProps) {
  const { isConnected, balance } = useWallet();
  const [prediction, setPrediction] = useState<'yes' | 'no'>('yes');
  const [amount, setAmount] = useState<number>(10);
  const [potentialWinnings, setPotentialWinnings] = useState<number>(
    prediction === 'yes' 
      ? amount / market.yesPrice 
      : amount / (1 - market.yesPrice)
  );
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate transaction
    toast.success(`Your ${prediction.toUpperCase()} prediction has been placed!`);
  };
  
  const handlePredictionChange = (value: 'yes' | 'no') => {
    setPrediction(value);
    // Recalculate potential winnings
    setPotentialWinnings(
      value === 'yes' 
        ? amount / market.yesPrice 
        : amount / (1 - market.yesPrice)
    );
  };
  
  const handleAmountChange = (value: number) => {
    setAmount(value);
    // Recalculate potential winnings
    setPotentialWinnings(
      prediction === 'yes' 
        ? value / market.yesPrice 
        : value / (1 - market.yesPrice)
    );
  };
  
  const formatXLM = (value: number) => {
    return value.toFixed(2);
  };
  
  if (!isConnected) {
    return (
      <div className="text-center">
        <p className="text-muted-foreground mb-4">Connect your wallet to make predictions</p>
        <ConnectWalletButton />
      </div>
    );
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-6">
        <h4 className="text-sm font-medium mb-3">I predict this will be:</h4>
        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant={prediction === 'yes' ? 'default' : 'outline'}
            onClick={() => handlePredictionChange('yes')}
            className={prediction === 'yes' ? 'bg-chart-3 hover:bg-chart-3/90' : ''}
          >
            <Check className="h-4 w-4 mr-2" />
            YES ({Math.round(market.yesPrice * 100)}%)
          </Button>
          <Button
            type="button"
            variant={prediction === 'no' ? 'default' : 'outline'}
            onClick={() => handlePredictionChange('no')}
            className={prediction === 'no' ? 'bg-destructive hover:bg-destructive/90' : ''}
          >
            <X className="h-4 w-4 mr-2" />
            NO ({Math.round((1 - market.yesPrice) * 100)}%)
          </Button>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between mb-3">
          <h4 className="text-sm font-medium">Amount (XLM)</h4>
          <span className="text-sm text-muted-foreground">
            Balance: {formatXLM(balance)} XLM
          </span>
        </div>
        
        <Slider
          defaultValue={[10]}
          max={Math.min(balance, 1000)}
          step={1}
          value={[amount]}
          onValueChange={(values) => handleAmountChange(values[0])}
          className="mb-4"
        />
        
        <div className="flex justify-between gap-3">
          {[10, 25, 50, 100].map((value) => (
            <Button
              key={value}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleAmountChange(value)}
              disabled={value > balance}
              className="flex-1"
            >
              {value} XLM
            </Button>
          ))}
        </div>
      </div>
      
      <div className="p-4 bg-muted/30 rounded-lg mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-sm text-muted-foreground">Amount</span>
          <span className="text-sm font-medium">{formatXLM(amount)} XLM</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-sm text-muted-foreground">Odds</span>
          <span className="text-sm font-medium">
            {prediction === 'yes'
              ? `${Math.round(market.yesPrice * 100)}%`
              : `${Math.round((1 - market.yesPrice) * 100)}%`}
          </span>
        </div>
        <div className="flex justify-between pt-2 border-t">
          <span className="text-sm font-medium">Potential Winnings</span>
          <span className="text-sm font-bold text-chart-3">
            {formatXLM(potentialWinnings)} XLM
          </span>
        </div>
      </div>
      
      <Button type="submit" className="w-full">
        Place Prediction
      </Button>
    </form>
  );
}