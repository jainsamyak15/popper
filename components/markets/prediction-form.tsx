'use client';

import { useState, useEffect } from 'react';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useWallet } from '@/hooks/use-wallet';
import { ConnectWalletButton } from '@/components/wallet/connect-wallet-button';
import { toast } from 'sonner';
import { useMarket } from '@/hooks/use-market';

interface PredictionFormProps {
  market: any;
}

export function PredictionForm({ market }: PredictionFormProps) {
  const { isConnected, balance } = useWallet();
  const { placePrediction, predicting } = useMarket(market.id);
  const [prediction, setPrediction] = useState<'yes' | 'no'>('yes');
  const [amount, setAmount] = useState<number>(10);
  const [potentialWinnings, setPotentialWinnings] = useState<number>(0);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      setPotentialWinnings(
        prediction === 'yes'
          ? amount / market.yesPrice
          : amount / (1 - market.yesPrice)
      );
    }
  }, [hydrated, prediction, amount, market.yesPrice]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      if (balance < amount) {
        toast.error('Insufficient balance');
        return;
      }
  
      // Call the `placePrediction` function and wait for the transaction to complete
      const response = await placePrediction(prediction === 'yes', amount.toString());
  
      // If the transaction is successful, show the success toast
      toast.success('Prediction placed successfully');
    } catch (error) {
      console.error('Error placing prediction:', error);
      toast.error('Failed to place prediction');
    }
  };

  const handlePredictionChange = (value: 'yes' | 'no') => {
    setPrediction(value);
    if (hydrated) {
      setPotentialWinnings(
        value === 'yes'
          ? amount / market.yesPrice
          : amount / (1 - market.yesPrice)
      );
    }
  };

  const handleAmountChange = (value: number) => {
    setAmount(value);
    if (hydrated) {
      setPotentialWinnings(
        prediction === 'yes'
          ? value / market.yesPrice
          : value / (1 - market.yesPrice)
      );
    }
  };

  const formatXLM = (value: number) => value.toFixed(2);

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
            disabled={predicting}
          >
            <Check className="h-4 w-4 mr-2" />
            YES ({Math.round(market.yesPrice * 100)}%)
          </Button>
          <Button
            type="button"
            variant={prediction === 'no' ? 'default' : 'outline'}
            onClick={() => handlePredictionChange('no')}
            className={prediction === 'no' ? 'bg-destructive hover:bg-destructive/90' : ''}
            disabled={predicting}
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
          disabled={predicting}
        />
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

      <Button
        type="submit"
        className="w-full"
        disabled={predicting || balance < amount}
      >
        {predicting ? 'Placing Prediction...' : 'Place Prediction'}
      </Button>
    </form>
  );
}