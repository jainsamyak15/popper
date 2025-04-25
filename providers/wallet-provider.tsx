'use client';

import React, { createContext, useState, useEffect } from 'react';
import { isConnected as freighterIsConnected, getPublicKey, signTransaction } from '@stellar/freighter-api';

interface WalletContextType {
  isConnected: boolean;
  isLoading: boolean;
  address: string | null;
  balance: number;
  connect: () => Promise<void>;
  disconnect: () => void;
  signTransaction: (xdr: string) => Promise<string>;
}

export const WalletContext = createContext<WalletContextType>({
  isConnected: false,
  isLoading: true,
  address: null,
  balance: 0,
  connect: async () => {},
  disconnect: () => {},
  signTransaction: async () => '',
});

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<number>(0);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const connected = await freighterIsConnected();
        
        if (connected) {
          const publicKey = await getPublicKey();
          setIsConnected(true);
          setAddress(publicKey);
          // In a real app, we'd fetch the actual balance from the Stellar network
          setBalance(Math.floor(Math.random() * 10000) / 100);
        }
      } catch (error) {
        console.error('Error checking Freighter connection:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkConnection();
  }, []);

  const connect = async () => {
    try {
      setIsLoading(true);
      const publicKey = await getPublicKey();
      setIsConnected(true);
      setAddress(publicKey);
      // In a real app, we'd fetch the actual balance from the Stellar network
      setBalance(Math.floor(Math.random() * 10000) / 100);
    } catch (error) {
      console.error('Error connecting to Freighter:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = () => {
    setIsConnected(false);
    setAddress(null);
    setBalance(0);
  };

  const sign = async (xdr: string): Promise<string> => {
    try {
      return await signTransaction(xdr);
    } catch (error) {
      console.error('Error signing transaction:', error);
      throw error;
    }
  };

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        isLoading,
        address,
        balance,
        connect,
        disconnect,
        signTransaction: sign,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}