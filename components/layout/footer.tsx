'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Github, Twitter, Disc as Discord } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t py-12 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center mb-4">
              <motion.div 
                whileHover={{ scale: 1.05 }} 
                className="mr-2 rounded-full bg-primary p-1.5"
              >
                <div className="h-6 w-6 rounded-full bg-background flex items-center justify-center">
                  <span className="text-primary font-bold">P</span>
                </div>
              </motion.div>
              <span className="font-bold text-xl">Probo Onchain</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              On-chain prediction markets on Stellar blockchain, powered by AI resolution.
            </p>
            <div className="flex space-x-4">
              <motion.a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                whileHover={{ y: -2 }}
                className="text-muted-foreground hover:text-primary"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </motion.a>
              <motion.a 
                href="https://discord.com" 
                target="_blank" 
                rel="noopener noreferrer"
                whileHover={{ y: -2 }}
                className="text-muted-foreground hover:text-primary"
              >
                <Discord className="h-5 w-5" />
                <span className="sr-only">Discord</span>
              </motion.a>
              <motion.a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                whileHover={{ y: -2 }}
                className="text-muted-foreground hover:text-primary"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </motion.a>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-4">Markets</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/markets?category=politics" className="text-sm text-muted-foreground hover:text-primary">
                  Politics
                </Link>
              </li>
              <li>
                <Link href="/markets?category=sports" className="text-sm text-muted-foreground hover:text-primary">
                  Sports
                </Link>
              </li>
              <li>
                <Link href="/markets?category=crypto" className="text-sm text-muted-foreground hover:text-primary">
                  Crypto
                </Link>
              </li>
              <li>
                <Link href="/markets?category=entertainment" className="text-sm text-muted-foreground hover:text-primary">
                  Entertainment
                </Link>
              </li>
              <li>
                <Link href="/markets?category=science" className="text-sm text-muted-foreground hover:text-primary">
                  Science & Tech
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-primary">
                  About
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-muted-foreground hover:text-primary">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/docs" className="text-sm text-muted-foreground hover:text-primary">
                  Docs
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-muted-foreground hover:text-primary">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-sm text-muted-foreground hover:text-primary">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="text-sm text-muted-foreground hover:text-primary">
                  Risk Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <Separator className="my-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} Probo Onchain. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground mt-2 md:mt-0">
            Built on <span className="text-primary">Stellar</span>
          </p>
        </div>
      </div>
    </footer>
  );
}