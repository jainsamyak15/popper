'use client';

import { motion } from 'framer-motion';
import { 
  Wallet, 
  Users, 
  LucideBarChart4, 
  TrendingUp
} from 'lucide-react';
import CountUp from '@/components/ui/count-up';

export function StatsSection() {
  const stats = [
    {
      icon: <LucideBarChart4 className="h-6 w-6" />,
      value: 1248,
      label: "Total Markets",
      suffix: "+"
    },
    {
      icon: <Wallet className="h-6 w-6" />,
      value: 35897,
      label: "XLM Volume",
      prefix: "$"
    },
    {
      icon: <Users className="h-6 w-6" />,
      value: 1570,
      label: "Active Users",
      suffix: "+"
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      value: 94,
      label: "Resolution Accuracy",
      suffix: "%"
    }
  ];

  return (
    <section className="py-16 border-t">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Platform Statistics</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Real-time metrics of our growing prediction market platform.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="glassmorphism p-6 rounded-xl text-center"
            >
              <div className="bg-primary/10 p-3 rounded-full w-fit mx-auto mb-4">
                {stat.icon}
              </div>
              <div className="text-3xl font-bold mb-2">
                {stat.prefix}<CountUp end={stat.value} duration={2.5} />{stat.suffix}
              </div>
              <div className="text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}