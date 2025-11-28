import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Plus, Edit, Shield, ArrowLeft } from 'lucide-react';
import { useAgent } from '@/hooks/useAgent';

const BankDetails = () => {
  const navigate = useNavigate();
  const { agent } = useAgent();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="space-y-8">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/dashboard')}
              className="flex items-center w-fit"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>

          {/* Hero Section */}
          <div className="text-center space-y-4 py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <CreditCard className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight">Bank Account Details</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Manage your bank account information for secure commission payments
            </p>
          </div>

          {/* Primary Bank Account */}
          <Card className="shadow-lg border-0 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-xl">
                <span>Primary Bank Account</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800 font-medium">
                  ✓ Verified
                </Badge>
              </CardTitle>
              <CardDescription className="text-base">
                This account will be used for all commission payments
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="accountHolder">Account Holder Name</Label>
              <Input id="accountHolder" value="Phoenix Travelopedia" readOnly />
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

               {/* <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="outline" className="flex-1">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Details
                </Button>
                <Button variant="outline" className="flex-1">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Another Account
                </Button>
              </div> */}
            </CardContent>
          </Card>

          {/* Security Information */}
          <Card className="shadow-lg border-0 bg-card/50 backdrop-blur">
            <CardHeader>
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-3">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl">Security Information</CardTitle>
              <CardDescription className="text-base">Account security and verification status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-8">
              <div className="grid gap-4">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100/50 rounded-lg border border-green-200/50">
                  <div>
                    <div className="font-medium">Two-Factor Authentication</div>
                    <div className="text-sm text-muted-foreground">Extra security for account changes</div>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800 font-medium">✓ Enabled</Badge>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100/50 rounded-lg border border-green-200/50">
                  <div>
                    <div className="font-medium">Bank Verification</div>
                    <div className="text-sm text-muted-foreground">Account verified with micro deposits</div>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800 font-medium">✓ Verified</Badge>
                </div>

                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100/50 rounded-lg border border-green-200/50">
                  <div>
                    <div className="font-medium">KYC Status</div>
                    <div className="text-sm text-muted-foreground">Know Your Customer verification</div>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800 font-medium">✓ Completed</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Schedule */}
          {/* <Card className="shadow-lg border-0 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-xl">Payment Schedule</CardTitle>
              <CardDescription className="text-base">Commission payment information and schedule</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
                  <div className="font-medium text-primary">Payment Frequency</div>
                  <div className="text-muted-foreground">Monthly (1st of every month)</div>
                </div>
                <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
                  <div className="font-medium text-primary">Minimum Payout</div>
                  <div className="text-muted-foreground">₹1,000</div>
                </div>
                <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
                  <div className="font-medium text-primary">Processing Time</div>
                  <div className="text-muted-foreground">3-5 business days</div>
                </div>
                <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
                  <div className="font-medium text-primary">Last Payment</div>
                  <div className="text-muted-foreground">₹2,850 on Dec 1, 2024</div>
                </div>
              </div>
            </CardContent>
          </Card> */}
        </div>
      </div>
    </div>
  );
};

export default BankDetails;
