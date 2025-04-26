'use client';

import { motion } from 'framer-motion';
import { Brain, Database, FileText, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useResolution } from '@/hooks/use-resolution';
import { useWallet } from '@/hooks/use-wallet';

interface MarketResolutionInfoProps {
  market: any;
}

export function MarketResolutionInfo({ market }: MarketResolutionInfoProps) {
  const { resolving, resolveMarket } = useResolution();
  const { isConnected, address } = useWallet();

  const resolutionSteps = [
    {
      title: "Data Collection",
      icon: <Database className="h-5 w-5" />,
      description: "AI agents gather information from Brave Search API, Yahoo Finance, and other verified sources.",
      status: market.resolved ? "complete" : resolving ? "in-progress" : "pending",
      progress: market.resolved ? 100 : resolving ? 50 : 0,
    },
    {
      title: "Source Verification",
      icon: <FileText className="h-5 w-5" />,
      description: "AI agents verify and validate data sources to ensure accuracy and reliability.",
      status: market.resolved ? "complete" : "pending",
      progress: market.resolved ? 100 : 0,
    },
    {
      title: "AI Analysis",
      icon: <Brain className="h-5 w-5" />,
      description: "Multiple AI agents independently analyze data and provide their assessments.",
      status: market.resolved ? "complete" : "pending",
      progress: market.resolved ? 100 : 0,
    },
    {
      title: "Consensus Building",
      icon: <Brain className="h-5 w-5" />,
      description: "The consensus bundler agent aggregates AI findings to determine the final outcome.",
      status: market.resolved ? "complete" : "pending",
      progress: market.resolved ? 100 : 0,
    }
  ];

  const handleResolve = async () => {
    try {
      await resolveMarket(market.id, market);
    } catch (error) {
      console.error('Error resolving market:', error);
    }
  };

  const canResolve = isConnected && !market.resolved && new Date(market.closingDate) <= new Date();

  return (
    <div>
      <h3 className="text-xl font-semibold mb-6">Resolution Process</h3>
      
      <div className="bg-muted/20 p-4 rounded-lg mb-6 flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium mb-1">
            {market.resolved 
              ? 'Market has been resolved'
              : 'AI Resolution in Progress'}
          </p>
          <p className="text-xs text-muted-foreground">
            {market.resolved
              ? `This market was resolved as ${market.outcome ? 'YES' : 'NO'}`
              : `This market will be resolved using our AI resolution system that combines
                multiple AI agents and verified data sources to ensure accurate outcomes.
                Resolution will occur after the market closes on ${new Date(market.closingDate).toLocaleDateString()}.`
            }
          </p>
        </div>
      </div>
      
      <div className="space-y-4">
        {resolutionSteps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-full ${
                      step.status === 'complete' 
                        ? 'bg-chart-3/20' 
                        : step.status === 'in-progress' 
                          ? 'bg-secondary/20' 
                          : 'bg-muted/20'
                    }`}>
                      {step.icon}
                    </div>
                    <CardTitle className="text-base">{step.title}</CardTitle>
                  </div>
                  <div className="text-xs font-medium">
                    {step.status === 'complete' 
                      ? '✓ Complete' 
                      : step.status === 'in-progress' 
                        ? 'In Progress' 
                        : 'Pending'}
                  </div>
                </div>
                
                <CardDescription className="text-xs mt-1">
                  {step.description}
                </CardDescription>
                
                <Progress value={step.progress} className="h-1.5 mt-3" />
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {canResolve && (
        <div className="mt-6">
          <Button 
            onClick={handleResolve} 
            disabled={resolving}
            className="w-full"
          >
            {resolving ? 'Resolving...' : 'Resolve Market'}
          </Button>
        </div>
      )}
    </div>
  );
}