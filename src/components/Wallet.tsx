import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Wallet, Plus, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const WalletComponent = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Wallet className="h-4 w-4 mr-2" />
          Wallet
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
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
            <div className="text-2xl font-bold">₹12,450</div>
            <div className="text-xs text-muted-foreground">INR</div>
          </div>
          <p className="text-xs text-muted-foreground">
            Available for bookings
          </p>
          <div className="flex space-x-2">
            <Button size="sm" className="flex-1">
              <Plus className="h-3 w-3 mr-1" />
              Add Money
            </Button>
            <Button size="sm" variant="outline" className="flex-1">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              Withdraw
            </Button>
          </div>
          <div className="pt-3 border-t border-border">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Last transaction</span>
              <span className="flex items-center text-green-600">
                <ArrowDownLeft className="h-3 w-3 mr-1" />
                +₹2,500
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WalletComponent;