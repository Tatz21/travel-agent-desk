import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet, Plus, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const WalletComponent = () => {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center">
          <Wallet className="h-4 w-4 mr-2" />
          Wallet Balance
        </CardTitle>
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          Active
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline space-x-2">
          <div className="text-2xl font-bold">₹12,450</div>
          <div className="text-xs text-muted-foreground">INR</div>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Available for bookings
        </p>
        <div className="flex space-x-2 mt-4">
          <Button size="sm" className="flex-1">
            <Plus className="h-3 w-3 mr-1" />
            Add Money
          </Button>
          <Button size="sm" variant="outline" className="flex-1">
            <ArrowUpRight className="h-3 w-3 mr-1" />
            Withdraw
          </Button>
        </div>
        <div className="mt-3 pt-3 border-t border-border">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Last transaction</span>
            <span className="flex items-center text-green-600">
              <ArrowDownLeft className="h-3 w-3 mr-1" />
              +₹2,500
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletComponent;