'use client';

import { motion } from 'framer-motion';
import { 
  Wallet, 
  Search, 
  TrendingUp, 
  LineChart, 
  Target, 
  Lightbulb,
  ArrowRight
} from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      icon: <Wallet className="h-6 w-6" />,
      title: "Connect Wallet",
      description: "Connect your Freighter wallet to access the Stellar blockchain."
    },
    {
      icon: <Search className="h-6 w-6" />,
      title: "Find Markets",
      description: "Browse prediction markets across politics, sports, crypto, and more."
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Make Predictions",
      description: "Buy shares in YES or NO outcomes based on your beliefs."
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: "AI Resolution",
      description: "Markets are resolved by AI consensus using verified data sources."
    },
    {
      icon: <LineChart className="h-6 w-6" />,
      title: "Collect Earnings",
      description: "If your prediction is correct, collect your earnings automatically."
    }
  ];

  return (
    <section className="py-20 bg-muted/20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A simple guide to getting started with Popper prediction markets.
          </p>
        </motion.div>
        
        <div className="relative">
          {/* Connecting line */}
          <div className="absolute left-1/2 top-12 bottom-0 w-0.5 bg-primary/30 -translate-x-1/2 hidden md:block"></div>
          
          <div className="flex flex-col space-y-12 relative">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col md:flex-row items-center md:items-start gap-6"
              >
                <div className={`md:w-1/2 flex ${index % 2 === 0 ? 'md:justify-end' : 'md:order-2'}`}>
                  <div className="glassmorphism p-6 rounded-xl max-w-sm">
                    <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                      {step.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
                
                <div className="relative flex items-center justify-center z-10 md:w-0">
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg">
                    {index + 1}
                  </div>
                </div>
                
                <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:order-2' : ''} hidden md:block`}></div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}