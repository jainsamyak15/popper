'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MarketCard } from '@/components/markets/market-card';
import { marketsMock } from '@/lib/mocks/markets';

export function TrendingMarkets() {
  const [visibleMarkets, setVisibleMarkets] = useState<any[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Get trending markets (mock data)
    const trending = marketsMock
      .sort((a, b) => b.volume - a.volume)
      .slice(0, 8);
    setVisibleMarkets(trending);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const { current: container } = containerRef;
      const scrollAmount = container.clientWidth * 0.75;
      
      if (direction === 'left') {
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  return (
    <section className="py-16 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl font-bold"
          >
            Trending Markets
          </motion.h2>
          
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => scroll('left')}
              className="hidden md:flex"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => scroll('right')}
              className="hidden md:flex"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/markets">View All</Link>
            </Button>
          </div>
        </div>
        
        <div 
          ref={containerRef}
          className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4"
        >
          {visibleMarkets.map((market, index) => (
            <motion.div
              key={market.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="min-w-[280px] sm:min-w-[320px] flex-shrink-0"
            >
              <MarketCard market={market} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}