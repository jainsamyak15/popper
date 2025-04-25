'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Clock, Users, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { formatTimeRemaining } from '@/lib/utils/date-utils';

interface MarketCardProps {
  market: any;
}

export function MarketCard({ market }: MarketCardProps) {
  return (
    <Link href={`/markets/${market.id}`} className="block h-full">
      <motion.div
        whileHover={{ y: -5 }}
        transition={{ duration: 0.2 }}
        className="h-full"
      >
        <Card className="h-full overflow-hidden glassmorphism border-primary/10 hover:border-primary/50 transition-colors">
          <CardContent className="p-6">
            <div className="flex justify-between items-start gap-2 mb-3">
              <div className={`pill pill-${market.category}`}>
                {market.category}
              </div>
              <div className="text-sm flex items-center text-muted-foreground">
                <Clock className="h-3.5 w-3.5 mr-1" />
                <span>{formatTimeRemaining(market.closingDate)}</span>
              </div>
            </div>
            
            <h3 className="font-semibold text-lg mb-3 line-clamp-2">
              {market.title}
            </h3>
            
            <div className="flex justify-between mt-4">
              <div className="text-sm flex flex-col">
                <span className="text-muted-foreground">Current Odds</span>
                <div className="flex mt-1 gap-2">
                  <span className="pill pill-yes">{Math.round(market.yesPrice * 100)}%</span>
                  <span className="pill pill-no">{Math.round((1 - market.yesPrice) * 100)}%</span>
                </div>
              </div>
              
              <div className="text-sm flex flex-col items-end">
                <span className="text-muted-foreground">Volume</span>
                <span className="font-medium">${market.volume.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="px-6 py-4 border-t flex justify-between text-muted-foreground text-xs">
            <div className="flex items-center">
              <Users className="h-3 w-3 mr-1" />
              <span>{market.participants} traders</span>
            </div>
            <div className="flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              <span>{market.trades} trades</span>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </Link>
  );
}