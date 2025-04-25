'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ExternalLink, ArrowUpRight, ArrowDownRight, CheckCircle2, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { generateTransactionHistory } from '@/lib/mocks/transactions-data';

export function TransactionHistory() {
  const [transactions, setTransactions] = useState<any[]>([]);
  
  useEffect(() => {
    setTransactions(generateTransactionHistory());
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((transaction, index) => (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${
                    transaction.type === 'buy' 
                      ? 'bg-secondary/10' 
                      : transaction.type === 'sell' 
                        ? 'bg-destructive/10' 
                        : transaction.type === 'win'
                          ? 'bg-chart-3/10'
                          : 'bg-muted/10'
                  }`}>
                    {transaction.type === 'buy' && <ArrowUpRight className="h-4 w-4 text-secondary" />}
                    {transaction.type === 'sell' && <ArrowDownRight className="h-4 w-4 text-destructive" />}
                    {transaction.type === 'win' && <CheckCircle2 className="h-4 w-4 text-chart-3" />}
                    {transaction.type === 'loss' && <XCircle className="h-4 w-4 text-destructive" />}
                  </div>
                  
                  <div>
                    <div className="font-medium">{transaction.description}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(transaction.date).toLocaleString()}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`font-medium ${
                    transaction.type === 'win' 
                      ? 'text-chart-3' 
                      : transaction.type === 'loss' || transaction.type === 'buy'
                        ? 'text-destructive'
                        : ''
                  }`}>
                    {transaction.type === 'win' || transaction.type === 'sell' ? '+' : '-'}{transaction.amount.toFixed(2)} XLM
                  </div>
                  
                  {transaction.marketId && (
                    <Button variant="ghost" size="sm" asChild className="h-6 px-0">
                      <Link href={`/markets/${transaction.marketId}`}>
                        <ExternalLink className="h-3 w-3 mr-1" />
                        <span className="text-xs">View Market</span>
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
          
          {transactions.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No transactions found</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}