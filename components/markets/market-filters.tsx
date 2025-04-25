'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface MarketFiltersProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function MarketFilters({ selectedCategory, onCategoryChange }: MarketFiltersProps) {
  const categories = [
    { id: 'all', name: 'All Markets' },
    { id: 'politics', name: 'Politics' },
    { id: 'sports', name: 'Sports' },
    { id: 'crypto', name: 'Crypto' },
    { id: 'entertainment', name: 'Entertainment' },
    { id: 'science', name: 'Science & Tech' },
  ];
  
  return (
    <div className="bg-muted/20 p-6 rounded-xl glassmorphism">

      <div className="mb-4">
        <h3 className="font-medium mb-3">Categories</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => onCategoryChange(category.id)}
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>
      
      <Separator className="my-4" />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <h3 className="font-medium mb-3">Resolution</h3>
          <div className="space-y-2">
            <div className="flex items-center">
              <input type="checkbox" id="ai-resolution" className="mr-2" />
              <label htmlFor="ai-resolution" className="text-sm">AI Resolution</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="human-resolution" className="mr-2" />
              <label htmlFor="human-resolution" className="text-sm">Human Resolution</label>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="font-medium mb-3">Status</h3>
          <div className="space-y-2">
            <div className="flex items-center">
              <input type="checkbox" id="open" className="mr-2" />
              <label htmlFor="open" className="text-sm">Open</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="closing-soon" className="mr-2" />
              <label htmlFor="closing-soon" className="text-sm">Closing Soon</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="resolved" className="mr-2" />
              <label htmlFor="resolved" className="text-sm">Resolved</label>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="font-medium mb-3">Volume</h3>
          <div className="space-y-2">
            <div className="flex items-center">
              <input type="checkbox" id="high-volume" className="mr-2" />
              <label htmlFor="high-volume" className="text-sm">High Volume (&gt;$1000)</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="medium-volume" className="mr-2" />
              <label htmlFor="medium-volume" className="text-sm">Medium Volume ($100-$1000)</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="low-volume" className="mr-2" />
              <label htmlFor="low-volume" className="text-sm">Low Volume (&lt;$100)</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}