'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MarketGrid } from '@/components/markets/market-grid';
import { marketsMock } from '@/lib/mocks/markets';

export function FeaturedMarkets() {
  const [featuredMarkets, setFeaturedMarkets] = useState<any[]>([]);
  
  useEffect(() => {
    // Simulating featured markets (mock data)
    const featured = marketsMock
      .filter(market => market.featured)
      .slice(0, 6);
    setFeaturedMarkets(featured);
  }, []);

  return (
    <section className="py-16 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Featured Markets</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore our most popular and interesting prediction markets chosen by our community.
          </p>
        </motion.div>
        
        <MarketGrid markets={featuredMarkets} />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button asChild>
            <Link href="/markets">
              View All Markets <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}