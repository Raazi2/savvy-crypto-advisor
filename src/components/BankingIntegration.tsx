
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CreditCard, Banknote, IndianRupee, ArrowUpRight, ArrowDownLeft, Plus, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountType: 'savings' | 'current';
  ifscCode: string;
  balance: number;
  isLinked: boolean;
  isPrimary: boolean;
}

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'transfer';
  amount: number;
  description: string;
  status: 'pending' | 'completed' | 'failed';
  timestamp: string;
  method: 'upi' | 'netbanking' | 'card' | 'wire';
}

export const BankingIntegration = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [newAccount, setNewAccount] = useState({
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    accountType: 'savings' as 'savings' | 'current'
  });
  const [transferForm, setTransferForm] = useState({
    amount: '',
    toAccount: '',
    description: '',
    method: 'upi' as 'upi' | 'netbanking' | 'card'
  });

  useEffect(() => {
    fetchBankingData();
  }, []);

  const fetchBankingData = async () => {
    setLoading(true);
    try {
      // Mock data - in real app, fetch from API
      setBankAccounts([
        {
          id: '1',
          bankName: 'HDFC Bank',
          accountNumber: '****1234',
          accountType: 'savings',
          ifscCode: 'HDFC0000001',
          balance: 125000,
          isLinked: true,
          isPrimary: true
        },
        {
          id: '2',
          bankName: 'ICICI Bank',
          accountNumber: '****5678',
          accountType: 'current',
          ifscCode: 'ICIC0000001',
          balance: 75000,
          isLinked: true,
          isPrimary: false
        }
      ]);

      setTransactions([
        {
          id: '1',
          type: 'deposit',
          amount: 50000,
          description: 'Funds added via UPI',
          status: 'completed',
          timestamp: '2024-06-15T10:30:00Z',
          method: 'upi'
        },
        {
          id: '2',
          type: 'withdrawal',
          amount: 25000,
          description: 'Stock purchase - RELIANCE',
          status: 'completed',
          timestamp: '2024-06-15T09:15:00Z',
          method: 'netbanking'
        },
        {
          id: '3',
          type: 'deposit',
          amount: 100000,
          description: 'Salary credit',
          status: 'pending',
          timestamp: '2024-06-15T08:00:00Z',
          method: 'wire'
        }
      ]);
    } catch (error) {
      console.error('Error fetching banking data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch banking data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddBankAccount = async () => {
    if (!newAccount.bankName || !newAccount.accountNumber || !newAccount.ifscCode) {
      toast({
        title: "Invalid Details",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      // In real app, this would call an API to verify and add the account
      const account: BankAccount = {
        id: Math.random().toString(36).substr(2, 9),
        bankName: newAccount.bankName,
        accountNumber: `****${newAccount.accountNumber.slice(-4)}`,
        accountType: newAccount.accountType,
        ifscCode: newAccount.ifscCode,
        balance: 0,
        isLinked: false,
        isPrimary: false
      };

      setBankAccounts(prev => [...prev, account]);
      setShowAddAccount(false);
      setNewAccount({
        bankName: '',
        accountNumber: '',
        ifscCode: '',
        accountType: 'savings'
      });

      toast({
        title: "Account Added",
        description: "Bank account verification is in progress",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add bank account",
        variant: "destructive"
      });
    }
  };

  const handleFundTransfer = async () => {
    if (!transferForm.amount || !transferForm.toAccount) {
      toast({
        title: "Invalid Transfer",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      // In real app, this would initiate the actual transfer
      const transaction: Transaction = {
        id: Math.random().toString(36).substr(2, 9),
        type: 'transfer',
        amount: parseFloat(transferForm.amount),
        description: transferForm.description || 'Fund transfer',
        status: 'pending',
        timestamp: new Date().toISOString(),
        method: transferForm.method
      };

      setTransactions(prev => [transaction, ...prev]);
      setTransferForm({
        amount: '',
        toAccount: '',
        description: '',
        method: 'upi'
      });

      toast({
        title: "Transfer Initiated",
        description: `₹${transferForm.amount} transfer is being processed`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to initiate transfer",
        variant: "destructive"
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const totalBalance = bankAccounts.reduce((sum, account) => sum + account.balance, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <Banknote className="w-8 h-8 mr-2" />
            Banking & Payments
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your bank accounts, payments, and fund transfers
          </p>
        </div>
      </div>

      {/* Balance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalBalance)}</div>
            <p className="text-xs text-muted-foreground">
              Across all linked accounts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Linked Accounts</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bankAccounts.filter(acc => acc.isLinked).length}</div>
            <p className="text-xs text-muted-foreground">
              Active bank accounts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Transactions</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{transactions.length}</div>
            <p className="text-xs text-muted-foreground">
              Payment activities
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="accounts" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="accounts">Bank Accounts</TabsTrigger>
          <TabsTrigger value="transfer">Fund Transfer</TabsTrigger>
          <TabsTrigger value="upi">UPI Payments</TabsTrigger>
          <TabsTrigger value="history">Transaction History</TabsTrigger>
        </TabsList>

        <TabsContent value="accounts">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Linked Bank Accounts</CardTitle>
                <Button 
                  onClick={() => setShowAddAccount(true)}
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Account
                </Button>
              </div>
              <CardDescription>
                Manage your linked bank accounts for seamless transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {showAddAccount && (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="text-lg">Add New Bank Account</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="bankName">Bank Name</Label>
                        <Select 
                          value={newAccount.bankName}
                          onValueChange={(value) => setNewAccount(prev => ({ ...prev, bankName: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select bank" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="HDFC Bank">HDFC Bank</SelectItem>
                            <SelectItem value="ICICI Bank">ICICI Bank</SelectItem>
                            <SelectItem value="SBI">State Bank of India</SelectItem>
                            <SelectItem value="Axis Bank">Axis Bank</SelectItem>
                            <SelectItem value="Kotak Bank">Kotak Mahindra Bank</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="accountType">Account Type</Label>
                        <Select 
                          value={newAccount.accountType}
                          onValueChange={(value: 'savings' | 'current') => 
                            setNewAccount(prev => ({ ...prev, accountType: value }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="savings">Savings Account</SelectItem>
                            <SelectItem value="current">Current Account</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="accountNumber">Account Number</Label>
                        <Input
                          type="text"
                          value={newAccount.accountNumber}
                          onChange={(e) => setNewAccount(prev => ({ ...prev, accountNumber: e.target.value }))}
                          placeholder="Enter account number"
                        />
                      </div>

                      <div>
                        <Label htmlFor="ifscCode">IFSC Code</Label>
                        <Input
                          type="text"
                          value={newAccount.ifscCode}
                          onChange={(e) => setNewAccount(prev => ({ ...prev, ifscCode: e.target.value.toUpperCase() }))}
                          placeholder="Enter IFSC code"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={handleAddBankAccount}>
                        Add Account
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setShowAddAccount(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-4">
                {bankAccounts.map((account) => (
                  <Card key={account.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                          <CreditCard className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">{account.bankName}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {account.accountNumber} • {account.accountType.toUpperCase()}
                          </p>
                          <p className="text-xs text-gray-500">{account.ifscCode}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">{formatCurrency(account.balance)}</div>
                        <div className="flex items-center gap-2">
                          {account.isPrimary && (
                            <Badge variant="default" className="text-xs">Primary</Badge>
                          )}
                          <Badge 
                            variant={account.isLinked ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {account.isLinked ? 'Linked' : 'Pending'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transfer">
          <Card>
            <CardHeader>
              <CardTitle>Fund Transfer</CardTitle>
              <CardDescription>
                Transfer funds between accounts or to trading wallet
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="amount">Amount (₹)</Label>
                  <Input
                    type="number"
                    value={transferForm.amount}
                    onChange={(e) => setTransferForm(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder="Enter amount"
                  />
                </div>

                <div>
                  <Label htmlFor="toAccount">To Account</Label>
                  <Select 
                    value={transferForm.toAccount}
                    onValueChange={(value) => setTransferForm(prev => ({ ...prev, toAccount: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select destination" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="trading">Trading Wallet</SelectItem>
                      <SelectItem value="savings">Savings Account</SelectItem>
                      <SelectItem value="external">External Account</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="method">Payment Method</Label>
                  <Select 
                    value={transferForm.method}
                    onValueChange={(value: 'upi' | 'netbanking' | 'card') => 
                      setTransferForm(prev => ({ ...prev, method: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="upi">UPI</SelectItem>
                      <SelectItem value="netbanking">Net Banking</SelectItem>
                      <SelectItem value="card">Debit Card</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Input
                    type="text"
                    value={transferForm.description}
                    onChange={(e) => setTransferForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Transfer purpose"
                  />
                </div>
              </div>

              <Button onClick={handleFundTransfer} className="w-full">
                Initiate Transfer
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upi">
          <Card>
            <CardHeader>
              <CardTitle>UPI Payments</CardTitle>
              <CardDescription>
                Quick payments using UPI (Unified Payments Interface)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <IndianRupee className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  UPI Integration
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Quick UPI payments and QR code scanning will be available here
                </p>
                <Badge variant="secondary">Coming Soon</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>
                View all your payment and transfer activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        <div className="flex items-center">
                          {transaction.type === 'deposit' ? (
                            <ArrowDownLeft className="w-4 h-4 text-green-600 mr-2" />
                          ) : (
                            <ArrowUpRight className="w-4 h-4 text-red-600 mr-2" />
                          )}
                          {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                        </div>
                      </TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell className={
                        transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'
                      }>
                        {transaction.type === 'deposit' ? '+' : '-'}
                        {formatCurrency(transaction.amount)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {transaction.method.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {getStatusIcon(transaction.status)}
                          <span className="ml-2 text-sm capitalize">{transaction.status}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(transaction.timestamp).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
