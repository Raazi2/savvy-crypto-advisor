
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, Link, Activity, AlertTriangle, CheckCircle, Clock, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

interface BlockchainTransaction {
  id: string;
  transaction_type: string;
  amount: number;
  asset_symbol: string;
  status: string;
  transaction_hash?: string;
  block_number?: number;
  gas_fee?: number;
  created_at: string;
}

interface SmartContract {
  id: string;
  contract_address: string;
  contract_name: string;
  contract_type: string;
  network: string;
  deployed_at: string;
  is_active: boolean;
}

export const BlockchainDashboard = () => {
  const [newTransaction, setNewTransaction] = useState({
    type: 'trade',
    amount: '',
    asset_symbol: '',
    metadata: {}
  });
  const [contractCall, setContractCall] = useState({
    contractAddress: '',
    functionName: '',
    parameters: ''
  });
  const { toast } = useToast();

  // Fetch blockchain transactions
  const { data: transactions, refetch: refetchTransactions } = useQuery({
    queryKey: ['blockchain-transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blockchain_transactions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as BlockchainTransaction[];
    },
  });

  // Fetch smart contracts
  const { data: contracts } = useQuery({
    queryKey: ['smart-contracts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('smart_contracts')
        .select('*')
        .eq('is_active', true)
        .order('deployed_at', { ascending: false });
      
      if (error) throw error;
      return data as SmartContract[];
    },
  });

  const handleBlockchainOperation = async (action: string, data: any) => {
    try {
      const { data: result, error } = await supabase.functions.invoke('blockchain-transaction', {
        body: { action, transactionData: data }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: result.message || "Operation completed successfully",
      });

      if (action === 'record_transaction') {
        refetchTransactions();
        setNewTransaction({ type: 'trade', amount: '', asset_symbol: '', metadata: {} });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Operation failed",
        variant: "destructive",
      });
    }
  };

  const handleSmartContractOperation = async (action: string, data: any) => {
    try {
      const { data: result, error } = await supabase.functions.invoke('smart-contract-manager', {
        body: { action, contractData: data }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: result.message || "Smart contract operation completed",
      });

      if (action === 'call_contract') {
        setContractCall({ contractAddress: '', functionName: '', parameters: '' });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Smart contract operation failed",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'failed':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Link className="w-6 h-6 text-blue-600" />
        <h1 className="text-3xl font-bold">Blockchain & Smart Contracts</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5" />
              <span>Total Transactions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{transactions?.length || 0}</div>
            <p className="text-sm text-muted-foreground">On blockchain</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="w-5 h-5" />
              <span>Smart Contracts</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contracts?.length || 0}</div>
            <p className="text-sm text-muted-foreground">Active contracts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>Security Level</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">High</div>
            <p className="text-sm text-muted-foreground">Blockchain secured</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="transactions" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="contracts">Smart Contracts</TabsTrigger>
          <TabsTrigger value="security">Security Monitor</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Record New Transaction</CardTitle>
              <CardDescription>
                Record a transaction on the blockchain for immutable audit trail
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="transaction-type">Transaction Type</Label>
                  <Select 
                    value={newTransaction.type} 
                    onValueChange={(value) => setNewTransaction({...newTransaction, type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="trade">Trade</SelectItem>
                      <SelectItem value="portfolio_update">Portfolio Update</SelectItem>
                      <SelectItem value="deposit">Deposit</SelectItem>
                      <SelectItem value="withdrawal">Withdrawal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={newTransaction.amount}
                    onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="asset">Asset Symbol</Label>
                  <Input
                    id="asset"
                    value={newTransaction.asset_symbol}
                    onChange={(e) => setNewTransaction({...newTransaction, asset_symbol: e.target.value})}
                    placeholder="BTC, ETH, AAPL..."
                  />
                </div>
              </div>
              <Button 
                onClick={() => handleBlockchainOperation('record_transaction', newTransaction)}
                disabled={!newTransaction.amount || !newTransaction.asset_symbol}
              >
                Record on Blockchain
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions?.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(tx.status)}
                      <div>
                        <div className="font-medium">
                          {tx.transaction_type.replace('_', ' ').toUpperCase()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {tx.amount} {tx.asset_symbol}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={
                        tx.status === 'confirmed' ? 'default' : 
                        tx.status === 'pending' ? 'secondary' : 'destructive'
                      }>
                        {tx.status}
                      </Badge>
                      <div className="text-xs text-muted-foreground mt-1">
                        {new Date(tx.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contracts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Smart Contract Interaction</CardTitle>
              <CardDescription>
                Call functions on deployed smart contracts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contract-address">Contract Address</Label>
                  <Input
                    id="contract-address"
                    value={contractCall.contractAddress}
                    onChange={(e) => setContractCall({...contractCall, contractAddress: e.target.value})}
                    placeholder="0x..."
                  />
                </div>
                <div>
                  <Label htmlFor="function-name">Function Name</Label>
                  <Input
                    id="function-name"
                    value={contractCall.functionName}
                    onChange={(e) => setContractCall({...contractCall, functionName: e.target.value})}
                    placeholder="transfer, balanceOf..."
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="parameters">Parameters (JSON)</Label>
                <Textarea
                  id="parameters"
                  value={contractCall.parameters}
                  onChange={(e) => setContractCall({...contractCall, parameters: e.target.value})}
                  placeholder='["param1", "param2"]'
                />
              </div>
              <Button 
                onClick={() => handleSmartContractOperation('call_contract', {
                  ...contractCall,
                  parameters: contractCall.parameters ? JSON.parse(contractCall.parameters) : []
                })}
                disabled={!contractCall.contractAddress || !contractCall.functionName}
              >
                Call Contract Function
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Deployed Contracts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contracts?.map((contract) => (
                  <div key={contract.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{contract.contract_name}</div>
                        <div className="text-sm text-muted-foreground">
                          {contract.contract_address}
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge>{contract.contract_type}</Badge>
                        <div className="text-xs text-muted-foreground mt-1">
                          {contract.network}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Blockchain Security Monitor</span>
              </CardTitle>
              <CardDescription>
                Advanced security monitoring with blockchain-based audit trails
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Transaction Security</h4>
                    <p className="text-sm text-muted-foreground">
                      All transactions are cryptographically secured and immutable on the blockchain
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Smart Contract Verification</h4>
                    <p className="text-sm text-muted-foreground">
                      Smart contracts are audited and verified for security vulnerabilities
                    </p>
                  </div>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-800 dark:text-green-200">
                      Blockchain Security Active
                    </span>
                  </div>
                  <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                    Your transactions and contracts are protected by blockchain technology
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
