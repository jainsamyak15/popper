'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useWallet } from '@/hooks/use-wallet';
import { Button } from '@/components/ui/button';
import { Wallet } from 'lucide-react';

interface ConnectWalletButtonProps {
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function ConnectWalletButton({ size = 'default' }: ConnectWalletButtonProps) {
  const { connect, isLoading } = useWallet();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="wallet-btn"
    >
      <motion.div
        animate={{
          rotate: isHovered ? 360 : 0,
        }}
        transition={{ duration: 5, ease: "linear", repeat: Infinity }}
        className="wallet-btn-gradient"
      />
      
      <Button 
        onClick={connect} 
        disabled={isLoading}
        size={size}
        className="wallet-btn-content relative z-10"
      >
        <Wallet className="h-4 w-4 mr-2" />
        {isLoading ? 'Connecting...' : 'Connect Wallet'}
      </Button>
    </motion.div>
  );
}