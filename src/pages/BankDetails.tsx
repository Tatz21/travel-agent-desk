import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Plus, Edit, Shield } from 'lucide-react';
import { useAgent } from '@/hooks/useAgent';

const BankDetails = () => {
  const { agent } = useAgent();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Bank Account Details</h1>
        <p className="text-muted-foreground">Manage your bank account information for commission payments</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <CreditCard className="h-5 w-5 mr-2" />
              Primary Bank Account
            </span>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Verified
            </Badge>
          </CardTitle>
          <CardDescription>
            This account will be used for commission payments
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="accountHolder">Account Holder Name</Label>
              <Input id="accountHolder" value={agent?.contact_person || ''} readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bankName">Bank Name</Label>
              <Input id="bankName" value="State Bank of India" readOnly />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input id="accountNumber" value="****-****-****-1234" readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ifscCode">IFSC Code</Label>
              <Input id="ifscCode" value="SBIN0001234" readOnly />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="accountType">Account Type</Label>
              <Input id="accountType" value="Current Account" readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="branchName">Branch Name</Label>
              <Input id="branchName" value="Main Branch, Mumbai" readOnly />
            </div>
          </div>

          <div className="flex space-x-2">
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit Details
            </Button>
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Another Account
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Security Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div>
                <div className="font-medium">Two-Factor Authentication</div>
                <div className="text-sm text-muted-foreground">Extra security for account changes</div>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">Enabled</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div>
                <div className="font-medium">Bank Verification</div>
                <div className="text-sm text-muted-foreground">Account verified with micro deposits</div>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">Verified</Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div>
                <div className="font-medium">KYC Status</div>
                <div className="text-sm text-muted-foreground">Know Your Customer verification</div>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">Completed</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment Schedule</CardTitle>
          <CardDescription>Commission payment information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-sm font-medium">Payment Frequency</div>
              <div className="text-sm text-muted-foreground">Monthly (1st of every month)</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Minimum Payout</div>
              <div className="text-sm text-muted-foreground">₹1,000</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Processing Time</div>
              <div className="text-sm text-muted-foreground">3-5 business days</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Last Payment</div>
              <div className="text-sm text-muted-foreground">₹2,850 on Dec 1, 2024</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BankDetails;