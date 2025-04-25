'use client';

import { motion } from 'framer-motion';
import { Brain, Database, FileText, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';

interface MarketResolutionInfoProps {
  market: any;
}

export function MarketResolutionInfo({ market }: MarketResolutionInfoProps) {
  const resolutionSteps = [
    {
      title: "Data Collection",
      icon: <Database className="h-5 w-5" />,
      description: "AI agents gather information from Brave Search API, Yahoo Finance, and other verified sources.",
      status: "complete",
      progress: 100,
    },
    {
      title: "Source Verification",
      icon: <FileText className="h-5 w-5" />,
      description: "AI agents verify and validate data sources to ensure accuracy and reliability.",
      status: "complete",
      progress: 100,
    },
    {
      title: "AI Analysis",
      icon: <Brain className="h-5 w-5" />,
      description: "Multiple AI agents independently analyze data and provide their assessments.",
      status: "in-progress",
      progress: 65,
    },
    {
      title: "Consensus Building",
      icon: <Brain className="h-5 w-5" />,
      description: "The consensus bundler agent aggregates AI findings to determine the final outcome.",
      status: "pending",
      progress: 0,
    }
  ];

  return (
    <div>
      <h3 className="text-xl font-semibold mb-6">Resolution Process</h3>
      
      <div className="bg-muted/20 p-4 rounded-lg mb-6 flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium mb-1">AI Resolution in Progress</p>
          <p className="text-xs text-muted-foreground">
            This market will be resolved using our AI resolution system that combines
            multiple AI agents and verified data sources to ensure accurate outcomes.
            Resolution will occur after the market closes on {new Date(market.closingDate).toLocaleDateString()}.
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
    </div>
  );
}