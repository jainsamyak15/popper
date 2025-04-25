'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ConnectWalletButton } from '@/components/wallet/connect-wallet-button';
import { useWallet } from '@/hooks/use-wallet';
import { ArrowRight, TrendingUp, Brain, Shield } from 'lucide-react';

export function HeroSection() {
  const { isConnected } = useWallet();
  const [domLoaded, setDomLoaded] = useState(false);

  useEffect(() => {
    setDomLoaded(true);
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0 opacity-30">
        <div className="absolute inset-0 animated-gradient"></div>
        <div className="absolute inset-0 backdrop-blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-4xl mx-auto text-center"
        >
          <motion.h1 
            variants={item}
            className="text-4xl md:text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-chart-1"
          >
            Predict. Earn. Influence.
          </motion.h1>
          
          <motion.p 
            variants={item}
            className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto"
          >
            On-chain prediction markets powered by AI resolution. Earn from your opinions on politics, sports, crypto, and more.
          </motion.p>
          
          <motion.div variants={item} className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            {domLoaded && (
              <>
                {isConnected ? (
                  <Button asChild size="lg">
                    <Link href="/markets">
                      Explore Markets <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                ) : (
                  <ConnectWalletButton size="lg" />
                )}
                <Button variant="outline" size="lg" asChild>
                  <Link href="/about">
                    Learn More
                  </Link>
                </Button>
              </>
            )}
          </motion.div>
          
          <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="glassmorphism p-6 rounded-xl">
              <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Decentralized Markets</h3>
              <p className="text-muted-foreground text-sm">
                Trade on Stellar blockchain with full transparency and low fees.
              </p>
            </div>
            
            <div className="glassmorphism p-6 rounded-xl">
              <div className="bg-secondary/10 p-3 rounded-full w-fit mb-4">
                <Brain className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">AI-Powered Resolution</h3>
              <p className="text-muted-foreground text-sm">
                Markets resolved by AI consensus using multiple verified sources.
              </p>
            </div>
            
            <div className="glassmorphism p-6 rounded-xl">
              <div className="bg-accent/10 p-3 rounded-full w-fit mb-4">
                <Shield className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Secure & Trustless</h3>
              <p className="text-muted-foreground text-sm">
                Your funds and predictions are secured by cryptographic proof.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}