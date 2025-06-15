
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calculator, FileText, TrendingUp, PiggyBank, Receipt, AlertCircle, CheckCircle, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Deduction {
  id: string;
  category: string;
  description: string;
  amount: number;
  date: string;
  receipt?: boolean;
}

interface TaxBracket {
  min: number;
  max: number;
  rate: number;
}

const TAX_BRACKETS_2024: TaxBracket[] = [
  { min: 0, max: 11000, rate: 10 },
  { min: 11000, max: 44725, rate: 12 },
  { min: 44725, max: 95375, rate: 22 },
  { min: 95375, max: 182050, rate: 24 },
  { min: 182050, max: 231250, rate: 32 },
  { min: 231250, max: 578125, rate: 35 },
  { min: 578125, max: Infinity, rate: 37 }
];

const DEDUCTION_CATEGORIES = [
  'Home Office',
  'Medical Expenses',
  'Charitable Donations',
  'Business Expenses',
  'Education',
  'State & Local Taxes',
  'Mortgage Interest',
  'Other'
];

const TAX_STRATEGIES = [
  {
    title: 'Maximize 401(k) Contributions',
    description: 'Contribute up to $23,000 for 2024 ($30,500 if 50+)',
    potential_savings: 'Up to $8,280 tax savings',
    difficulty: 'Easy',
    category: 'Retirement'
  },
  {
    title: 'Tax-Loss Harvesting',
    description: 'Offset capital gains with investment losses',
    potential_savings: 'Up to $3,000 annually',
    difficulty: 'Medium',
    category: 'Investment'
  },
  {
    title: 'HSA Contributions',
    description: 'Triple tax advantage - deductible, growth, withdrawals',
    potential_savings: 'Up to $1,300 tax savings',
    difficulty: 'Easy',
    category: 'Health'
  },
  {
    title: 'Bunch Itemized Deductions',
    description: 'Group deductions in alternating years',
    potential_savings: '10-30% more deductions',
    difficulty: 'Medium',
    category: 'Strategy'
  }
];

export const TaxPlanningDashboard: React.FC = () => {
  const { toast } = useToast();
  const [income, setIncome] = useState<string>('');
  const [filingStatus, setFilingStatus] = useState<string>('single');
  const [deductions, setDeductions] = useState<Deduction[]>([]);
  const [newDeduction, setNewDeduction] = useState({
    category: '',
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0]
  });

  const calculateTax = (taxableIncome: number): number => {
    let tax = 0;
    let remainingIncome = taxableIncome;

    for (const bracket of TAX_BRACKETS_2024) {
      const taxableAtThisBracket = Math.min(remainingIncome, bracket.max - bracket.min);
      if (taxableAtThisBracket <= 0) break;
      
      tax += taxableAtThisBracket * (bracket.rate / 100);
      remainingIncome -= taxableAtThisBracket;
    }

    return tax;
  };

  const standardDeduction = filingStatus === 'married' ? 29200 : 14600;
  const totalDeductions = deductions.reduce((sum, deduction) => sum + deduction.amount, 0);
  const itemizedDeductions = totalDeductions;
  const finalDeduction = Math.max(standardDeduction, itemizedDeductions);
  const taxableIncome = Math.max(0, parseFloat(income || '0') - finalDeduction);
  const estimatedTax = calculateTax(taxableIncome);
  const effectiveRate = parseFloat(income || '0') > 0 ? (estimatedTax / parseFloat(income || '0')) * 100 : 0;

  const addDeduction = () => {
    if (!newDeduction.category || !newDeduction.description || !newDeduction.amount) {
      toast({
        title: "Missing Information",
        description: "Please fill in all deduction fields",
        variant: "destructive"
      });
      return;
    }

    const deduction: Deduction = {
      id: Date.now().toString(),
      category: newDeduction.category,
      description: newDeduction.description,
      amount: parseFloat(newDeduction.amount),
      date: newDeduction.date,
      receipt: false
    };

    setDeductions([...deductions, deduction]);
    setNewDeduction({
      category: '',
      description: '',
      amount: '',
      date: new Date().toISOString().split('T')[0]
    });

    toast({
      title: "Deduction Added",
      description: `Added ${deduction.description} for $${deduction.amount.toFixed(2)}`
    });
  };

  const removeDeduction = (id: string) => {
    setDeductions(deductions.filter(d => d.id !== id));
    toast({
      title: "Deduction Removed",
      description: "Deduction has been deleted"
    });
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tax Planning Dashboard</h1>
          <p className="text-muted-foreground">Optimize your tax strategy and track deductions</p>
        </div>
        <Badge variant="outline" className="px-3 py-1">
          Tax Year 2024
        </Badge>
      </div>

      <Tabs defaultValue="calculator" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="calculator">
            <Calculator className="w-4 h-4 mr-2" />
            Tax Calculator
          </TabsTrigger>
          <TabsTrigger value="deductions">
            <Receipt className="w-4 h-4 mr-2" />
            Deductions Tracker
          </TabsTrigger>
          <TabsTrigger value="strategies">
            <TrendingUp className="w-4 h-4 mr-2" />
            Tax Strategies
          </TabsTrigger>
          <TabsTrigger value="planning">
            <PiggyBank className="w-4 h-4 mr-2" />
            Year-End Planning
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calculator" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Section */}
            <Card>
              <CardHeader>
                <CardTitle>Income & Filing Information</CardTitle>
                <CardDescription>Enter your income details for tax calculation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="income">Annual Gross Income</Label>
                  <Input
                    id="income"
                    type="number"
                    placeholder="Enter your annual income"
                    value={income}
                    onChange={(e) => setIncome(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="filing-status">Filing Status</Label>
                  <Select value={filingStatus} onValueChange={setFilingStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single</SelectItem>
                      <SelectItem value="married">Married Filing Jointly</SelectItem>
                      <SelectItem value="married-separate">Married Filing Separately</SelectItem>
                      <SelectItem value="head">Head of Household</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-4 border-t">
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div>Standard Deduction: {formatCurrency(standardDeduction)}</div>
                    <div>Itemized Deductions: {formatCurrency(itemizedDeductions)}</div>
                    <div className="font-medium">
                      Using: {finalDeduction > standardDeduction ? 'Itemized' : 'Standard'} Deduction
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Results Section */}
            <Card>
              <CardHeader>
                <CardTitle>Tax Calculation Results</CardTitle>
                <CardDescription>Your estimated federal tax liability</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <span className="text-sm font-medium">Gross Income</span>
                    <span className="font-bold">{formatCurrency(parseFloat(income || '0'))}</span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <span className="text-sm font-medium">Total Deductions</span>
                    <span className="font-bold">-{formatCurrency(finalDeduction)}</span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <span className="text-sm font-medium">Taxable Income</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">
                      {formatCurrency(taxableIncome)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <span className="text-sm font-medium">Estimated Federal Tax</span>
                    <span className="font-bold text-red-600 dark:text-red-400">
                      {formatCurrency(estimatedTax)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <span className="text-sm font-medium">After-Tax Income</span>
                    <span className="font-bold text-green-600 dark:text-green-400">
                      {formatCurrency(parseFloat(income || '0') - estimatedTax)}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{effectiveRate.toFixed(1)}%</div>
                    <div className="text-sm text-muted-foreground">Effective Tax Rate</div>
                  </div>
                  <Progress value={effectiveRate} className="mt-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="deductions" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Add Deduction Form */}
            <Card>
              <CardHeader>
                <CardTitle>Add New Deduction</CardTitle>
                <CardDescription>Track your tax-deductible expenses</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={newDeduction.category} onValueChange={(value) => 
                    setNewDeduction(prev => ({ ...prev, category: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {DEDUCTION_CATEGORIES.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder="Enter description"
                    value={newDeduction.description}
                    onChange={(e) => setNewDeduction(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={newDeduction.amount}
                    onChange={(e) => setNewDeduction(prev => ({ ...prev, amount: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newDeduction.date}
                    onChange={(e) => setNewDeduction(prev => ({ ...prev, date: e.target.value }))}
                  />
                </div>

                <Button onClick={addDeduction} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Deduction
                </Button>
              </CardContent>
            </Card>

            {/* Deductions Summary */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Deductions Summary</CardTitle>
                <CardDescription>
                  Total tracked deductions: {formatCurrency(totalDeductions)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {deductions.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Category</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {deductions.map((deduction) => (
                          <TableRow key={deduction.id}>
                            <TableCell>
                              <Badge variant="outline">{deduction.category}</Badge>
                            </TableCell>
                            <TableCell>{deduction.description}</TableCell>
                            <TableCell className="font-medium">
                              {formatCurrency(deduction.amount)}
                            </TableCell>
                            <TableCell>{new Date(deduction.date).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => removeDeduction(deduction.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Receipt className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No deductions tracked yet</p>
                    <p className="text-sm">Add your first deduction to get started</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="strategies" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tax Optimization Strategies</CardTitle>
              <CardDescription>Proven strategies to reduce your tax burden</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {TAX_STRATEGIES.map((strategy, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold">{strategy.title}</h3>
                      <Badge variant={strategy.difficulty === 'Easy' ? 'default' : 'secondary'}>
                        {strategy.difficulty}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{strategy.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-green-600">
                        {strategy.potential_savings}
                      </span>
                      <Badge variant="outline">{strategy.category}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="planning" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Year-End Checklist</CardTitle>
                <CardDescription>Important tasks before December 31st</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    'Review and maximize retirement contributions',
                    'Harvest tax losses from investments',
                    'Pay estimated taxes if required',
                    'Bunch charitable contributions',
                    'Review HSA and FSA contributions',
                    'Consider Roth IRA conversions'
                  ].map((task, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">{task}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tax Calendar</CardTitle>
                <CardDescription>Important dates and deadlines</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2 bg-red-50 dark:bg-red-900/20 rounded">
                    <span className="text-sm font-medium">Tax Day</span>
                    <span className="text-sm">April 15, 2025</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                    <span className="text-sm font-medium">Q4 Estimated Tax</span>
                    <span className="text-sm">January 15, 2025</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                    <span className="text-sm font-medium">IRA Contribution Deadline</span>
                    <span className="text-sm">April 15, 2025</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-green-50 dark:bg-green-900/20 rounded">
                    <span className="text-sm font-medium">HSA Contribution Deadline</span>
                    <span className="text-sm">April 15, 2025</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
