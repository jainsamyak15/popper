'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Check, X, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { generateUserPositions } from '@/lib/mocks/positions-data';
import { formatTimeRemaining } from '@/lib/utils/date-utils';

export function UserPositions() {
  const [positionType, setPositionType] = useState('open');
  const [positions, setPositions] = useState<any[]>([]);
  
  useEffect(() => {
    setPositions(generateUserPositions(positionType));
  }, [positionType]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Your Positions</h2>
        <Tabs defaultValue="open" onValueChange={setPositionType}>
          <TabsList>
            <TabsTrigger value="open">Open</TabsTrigger>
            <TabsTrigger value="resolved">Resolved</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="space-y-4">
        {positions.map((position, index) => (
          <motion.div
            key={position.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={position.prediction === 'yes' ? 'default' : 'destructive'}>
                        {position.prediction === 'yes' ? (
                          <><Check className="h-3 w-3 mr-1" /> YES</>
                        ) : (
                          <><X className="h-3 w-3 mr-1" /> NO</>
                        )}
                      </Badge>
                      <Badge variant="outline">
                        {position.category}
                      </Badge>
                    </div>
                    
                    <Link href={`/markets/${position.marketId}`} className="text-lg font-medium hover:underline">
                      {position.marketTitle}
                    </Link>
                    
                    <div className="text-sm text-muted-foreground mt-1">
                      {positionType === 'open' ? (
                        <>Closes in {formatTimeRemaining(position.closingDate)}</>
                      ) : (
                        <>Resolved on {new Date(position.resolvedDate).toLocaleDateString()}</>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col md:items-end">
                    <div className="flex items-center gap-2">
                      <div className="text-sm text-muted-foreground">Amount:</div>
                      <div className="font-medium">{position.amount.toFixed(2)} XLM</div>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-1">
                      <div className="text-sm text-muted-foreground">
                        {positionType === 'open' ? 'Potential Profit:' : 'Profit:'}
                      </div>
                      <div className={`font-medium ${
                        positionType === 'resolved' 
                          ? (position.profit > 0 ? 'text-chart-3' : 'text-destructive')
                          : ''
                      }`}>
                        {position.profit > 0 ? '+' : ''}{position.profit.toFixed(2)} XLM
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/markets/${position.marketId}`}>
                          <ExternalLink className="h-3 w-3 mr-1" />
                          {positionType === 'open' ? 'View Market' : 'View Details'}
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
        
        {positions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No {positionType} positions found</p>
          </div>
        )}
      </div>
    </div>
  );
}