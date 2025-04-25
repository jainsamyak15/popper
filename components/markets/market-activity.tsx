'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { generateMarketActivity } from '@/lib/mocks/activity-data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { truncateAddress } from '@/lib/utils/format-utils';

interface MarketActivityProps {
  marketId: string;
}

export function MarketActivity({ marketId }: MarketActivityProps) {
  const [activity, setActivity] = useState<any[]>([]);
  
  useEffect(() => {
    setActivity(generateMarketActivity(marketId));
  }, [marketId]);

  return (
    <div>
      <h3 className="text-xl font-semibold mb-6">Market Activity</h3>
      
      <div className="space-y-4">
        {activity.length > 0 ? (
          activity.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/20"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={`https://api.dicebear.com/7.x/identicon/svg?seed=${item.address}`} />
                  <AvatarFallback>{item.address.substring(0, 2)}</AvatarFallback>
                </Avatar>
                
                <div>
                  <div className="flex items-center">
                    <span className="font-medium text-sm">{truncateAddress(item.address)}</span>
                    <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-muted">
                      {item.prediction === 'yes' ? 'YES' : 'NO'}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(item.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="flex items-center justify-end">
                  <span className="font-medium">{item.amount.toFixed(2)} XLM</span>
                  {item.priceChange > 0 ? (
                    <ArrowUp className="h-3 w-3 ml-1 text-chart-3" />
                  ) : (
                    <ArrowDown className="h-3 w-3 ml-1 text-destructive" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {item.priceChange > 0 ? '+' : ''}{(item.priceChange * 100).toFixed(2)}%
                </p>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No activity yet</p>
          </div>
        )}
      </div>
    </div>
  );
}