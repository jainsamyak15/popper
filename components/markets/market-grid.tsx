'use client';

import { motion } from 'framer-motion';
import { MarketCard } from '@/components/markets/market-card';

interface MarketGridProps {
  markets: any[];
}

export function MarketGrid({ markets }: MarketGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {markets.map((market, index) => (
        <motion.div
          key={market.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <MarketCard market={market} />
        </motion.div>
      ))}
      
      {markets.length === 0 && (
        <div className="col-span-full text-center py-12">
          <p className="text-muted-foreground">No markets found</p>
        </div>
      )}
    </div>
  );
}