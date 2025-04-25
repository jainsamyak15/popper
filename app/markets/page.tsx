'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { MarketGrid } from '@/components/markets/market-grid';
import { MarketFilters } from '@/components/markets/market-filters';
import { Button } from '@/components/ui/button';
import { marketsMock } from '@/lib/mocks/markets';

export default function MarketsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const filteredMarkets = marketsMock.filter(market => {
    const matchesSearch = market.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || market.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Prediction Markets</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Explore markets and earn from your opinions on politics, sports, crypto, and more.
        </p>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search markets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button 
          variant="outline" 
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="md:w-auto w-full"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      {filtersOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-8"
        >
          <MarketFilters 
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </motion.div>
      )}

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Results ({filteredMarkets.length})</h2>
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
          <select className="bg-transparent border-none text-muted-foreground focus:outline-none">
            <option value="trending">Trending</option>
            <option value="newest">Newest</option>
            <option value="closing-soon">Closing Soon</option>
            <option value="volume">Volume</option>
          </select>
        </div>
      </div>

      <MarketGrid markets={filteredMarkets} />
    </div>
  );
}