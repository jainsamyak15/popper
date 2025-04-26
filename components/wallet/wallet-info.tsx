'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useWallet } from '@/hooks/use-wallet';
import { Button } from '@/components/ui/button';
import { 
  ChevronDown, 
  ExternalLink,
  Copy,
  LogOut
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { truncateAddress } from '@/lib/utils/format-utils';

export function WalletInfo() {
  const { address, balance, disconnect } = useWallet();
  const [isHovered, setIsHovered] = useState(false);
  
  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      toast.success('Address copied to clipboard');
    }
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
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
            className="wallet-btn-content relative z-10"
            variant="ghost"
          >
            <span>{truncateAddress(address)}</span>
            <ChevronDown className="h-4 w-4 ml-2" />
          </Button>
        </motion.div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 glassmorphism" align="end">
        <DropdownMenuLabel>My Wallet</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="px-2 py-2">
          <p className="text-muted-foreground text-xs mb-1">Balance</p>
          <p className="font-medium">{balance} XLM</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={copyAddress}>
          <Copy className="h-4 w-4 mr-2" />
          <span>Copy Address</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <ExternalLink className="h-4 w-4 mr-2" />
          <a 
            href={`https://stellar.expert/explorer/testnet/account/${address}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full"
          >
            View on Explorer
          </a>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={disconnect} className="text-destructive focus:text-destructive">
          <LogOut className="h-4 w-4 mr-2" />
          <span>Disconnect</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}