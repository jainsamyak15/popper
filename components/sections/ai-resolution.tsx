'use client';

import { motion } from 'framer-motion';
import { Brain, Search, Server, Lock, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function AIResolution() {
  const features = [
    {
      icon: <Brain className="h-6 w-6 text-primary" />,
      title: "CrewAI + GPT-4o-mini",
      description: "Multiple AI agents collaborate to analyze and resolve markets with high accuracy."
    },
    {
      icon: <Search className="h-6 w-6 text-primary" />,
      title: "Data Verification",
      description: "AI agents verify information from Brave Search API, Yahoo Finance, and other trusted sources."
    },
    {
      icon: <Server className="h-6 w-6 text-primary" />,
      title: "Consensus Bundling",
      description: "A consensus bundler agent aggregates AI findings to ensure accurate market resolution."
    },
    {
      icon: <Lock className="h-6 w-6 text-primary" />,
      title: "Transparent Process",
      description: "All AI resolution data and methodology is transparent and verifiable on-chain."
    }
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute inset-0 animated-gradient"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-6">AI-Powered Market Resolution</h2>
            <p className="text-muted-foreground text-lg mb-8">
              Our advanced AI resolution system ensures fair, accurate, and transparent market outcomes
              without relying on centralized oracles or human intervention.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="glassmorphism p-5 rounded-xl"
                >
                  <div className="bg-primary/10 p-2 rounded-full w-fit mb-3">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </div>
            
            <Button asChild variant="outline">
              <Link href="/about">
                Learn more about our AI resolution <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="hidden lg:block"
          >
            <div className="relative glassmorphism p-8 rounded-xl">
              <div className="mb-4 font-semibold text-xl">AI Resolution Process</div>
              
              <div className="space-y-4">
                <div className="bg-muted/30 p-4 rounded-xl">
                  <div className="flex items-center gap-3 mb-2 text-sm">
                    <Brain className="h-4 w-4 text-primary" />
                    <span className="font-medium">AI Agent 1 Analysis</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Analyzing multiple news sources... Found 8 relevant articles confirming outcome A with 94% confidence.
                  </p>
                </div>
                
                <div className="bg-muted/30 p-4 rounded-xl">
                  <div className="flex items-center gap-3 mb-2 text-sm">
                    <Brain className="h-4 w-4 text-primary" />
                    <span className="font-medium">AI Agent 2 Analysis</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Searching financial data... Market indicators and official statements support outcome A with 91% confidence.
                  </p>
                </div>
                
                <div className="bg-muted/30 p-4 rounded-xl">
                  <div className="flex items-center gap-3 mb-2 text-sm">
                    <Brain className="h-4 w-4 text-primary" />
                    <span className="font-medium">AI Agent 3 Analysis</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Checking verified social media... Found confirming statements from 3 official accounts supporting outcome A with 96% confidence.
                  </p>
                </div>
                
                <div className="bg-primary/10 p-4 rounded-xl">
                  <div className="flex items-center gap-3 mb-2 text-sm">
                    <Server className="h-4 w-4 text-primary" />
                    <span className="font-medium">Consensus Bundler</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Consensus achieved: Outcome A confirmed with 94% aggregate confidence. Market resolved as "YES".
                  </p>
                </div>
              </div>
              
              <div className="float animate-float absolute -right-8 -top-8 opacity-40 blur-sm">
                <Brain className="h-20 w-20 text-primary" />
              </div>
              <div className="float animate-float absolute -left-8 -bottom-8 opacity-40 blur-sm delay-1000">
                <Server className="h-20 w-20 text-primary" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}