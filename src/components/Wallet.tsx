import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Wallet, Plus, ArrowUpRight, ArrowDownLeft, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useWallet } from '@/hooks/useWallet';
import { formatDistanceToNow } from 'date-fns';

const WalletComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAddMoneyOpen, setIsAddMoneyOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const { balance, transactions, loading, addMoney } = useWallet();

  const handleAddMoney = async () => {
    const amountNumber = parseFloat(amount);
    if (amountNumber > 0) {
      const success = await addMoney(amountNumber);
      if (success) {
        setAmount('');
        setIsAddMoneyOpen(false);
      }
    }
  };

  const getTransactionIcon = (transaction: any) => {
    if (transaction.status === 'pending') return <Clock className="h-3 w-3" />;
    if (transaction.status === 'completed') return <CheckCircle className="h-3 w-3" />;
    return <XCircle className="h-3 w-3" />;
  };

  const getTransactionColor = (transaction: any) => {
    if (transaction.status === 'pending') return 'text-yellow-600';
    if (transaction.status === 'completed') {
      return transaction.transaction_type === 'credit' ? 'text-green-600' : 'text-red-600';
    }
    return 'text-red-600';
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            ₹${balance.toLocaleString()}
            <Wallet className="h-4 w-4 mr-2" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <Wallet className="h-4 w-4 mr-2" />
                Wallet Balance
              </span>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Active
              </Badge>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-baseline space-x-2">
              <div className="text-2xl font-bold">
                {loading ? '...' : `₹${balance.toLocaleString()}`}
              </div>
              <div className="text-xs text-muted-foreground">INR</div>
            </div>
            <p className="text-xs text-muted-foreground">
              Available for bookings
            </p>
            <div className="flex space-x-2">
              <Button 
                size="sm" 
                className="flex-1"
                onClick={() => setIsAddMoneyOpen(true)}
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Money
              </Button>
              <Button size="sm" variant="outline" className="flex-1" disabled>
                <ArrowUpRight className="h-3 w-3 mr-1" />
                Withdraw
              </Button>
            </div>
            
            {transactions.length > 0 && (
              <div className="pt-3 border-t border-border">
                <h4 className="text-sm font-medium mb-2">Recent Transactions</h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {transactions.slice(0, 3).map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        <span className={getTransactionColor(transaction)}>
                          {getTransactionIcon(transaction)}
                        </span>
                        <span className="text-muted-foreground truncate max-w-24">
                          {transaction.description}
                        </span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className={`font-medium ${getTransactionColor(transaction)}`}>
                          {transaction.transaction_type === 'credit' ? '+' : '-'}₹{transaction.amount}
                        </span>
                        <span className="text-muted-foreground text-[10px]">
                          {formatDistanceToNow(new Date(transaction.created_at), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Money Dialog */}
      <Dialog open={isAddMoneyOpen} onOpenChange={setIsAddMoneyOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Add Money to Wallet</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (₹)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="1"
                step="1"
              />
            </div>
            <div className="flex space-x-2">
              <Button 
                className="flex-1" 
                onClick={handleAddMoney}
                disabled={!amount || parseFloat(amount) <= 0}
              >
                Pay with Razorpay
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsAddMoneyOpen(false)}
              >
                Cancel
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Secure payment powered by Razorpay
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WalletComponent;
