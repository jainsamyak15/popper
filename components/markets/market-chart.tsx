'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { generateMarketChartData } from '@/lib/mocks/chart-data';

interface MarketChartProps {
  marketId: string;
  yesPrice: number;
}

export function MarketChart({ marketId, yesPrice }: MarketChartProps) {
  const [data, setData] = useState<any[]>([]);
  const [timeRange, setTimeRange] = useState('7d');
  
  useEffect(() => {
    setData(generateMarketChartData(yesPrice, timeRange));
  }, [marketId, yesPrice, timeRange]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">Price History</h3>
        <Tabs defaultValue="7d" onValueChange={setTimeRange}>
          <TabsList>
            <TabsTrigger value="24h">24h</TabsTrigger>
            <TabsTrigger value="7d">7d</TabsTrigger>
            <TabsTrigger value="30d">30d</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="h-[300px] w-full"
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 10,
              left: 0,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground) / 0.2)" />
            <XAxis 
              dataKey="date" 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12}
              tickFormatter={(value) => {
                const date = new Date(value);
                return timeRange === '24h' 
                  ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  : date.toLocaleDateString([], { month: 'short', day: 'numeric' });
              }}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12} 
              tickFormatter={(value) => `${Math.round(value * 100)}%`}
              domain={[0, 1]}
              ticks={[0, 0.25, 0.5, 0.75, 1]}
            />
            <Tooltip 
              formatter={(value: number) => [`${Math.round(value * 100)}%`, 'Probability']}
              labelFormatter={(label) => {
                const date = new Date(label);
                return date.toLocaleString();
              }}
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                borderColor: 'hsl(var(--border))',
                color: 'hsl(var(--foreground))',
                borderRadius: 'var(--radius)',
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="yes" 
              stroke="hsl(var(--chart-3))" 
              strokeWidth={2} 
              dot={false}
              activeDot={{ r: 6 }}
              name="Yes"
            />
            <Line 
              type="monotone" 
              dataKey="no" 
              stroke="hsl(var(--destructive))" 
              strokeWidth={2} 
              dot={false}
              activeDot={{ r: 6 }}
              name="No"
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}