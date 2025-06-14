
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Calculator, TrendingUp, PiggyBank, Target, DollarSign } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const FinancialCalculator = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  // Form states for different calculators
  const [compoundForm, setCompoundForm] = useState({
    principal: '',
    rate: '',
    time: '',
    frequency: '1'
  });

  const [sipForm, setSipForm] = useState({
    monthlyInvestment: '',
    expectedReturn: '',
    timePeriod: ''
  });

  const [retirementForm, setRetirementForm] = useState({
    currentAge: '',
    retirementAge: '',
    currentSavings: '',
    monthlyContribution: '',
    expectedReturn: '',
    inflationRate: ''
  });

  const performCalculation = async (calculationType: string, params: any) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('financial-calculations', {
        body: { calculationType, params }
      });

      if (error) throw error;
      setResults(data.result);
    } catch (error) {
      console.error('Calculation error:', error);
      toast({
        title: "Calculation Error",
        description: "Failed to perform calculation. Please check your inputs.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCompoundInterest = () => {
    const params = {
      principal: parseFloat(compoundForm.principal),
      rate: parseFloat(compoundForm.rate) / 100,
      time: parseInt(compoundForm.time),
      frequency: parseInt(compoundForm.frequency)
    };

    if (params.principal > 0 && params.rate > 0 && params.time > 0) {
      performCalculation('compound_interest', params);
    }
  };

  const handleSIPCalculation = () => {
    const params = {
      monthlyInvestment: parseFloat(sipForm.monthlyInvestment),
      expectedReturn: parseFloat(sipForm.expectedReturn) / 100,
      timePeriod: parseInt(sipForm.timePeriod)
    };

    if (params.monthlyInvestment > 0 && params.expectedReturn > 0 && params.timePeriod > 0) {
      performCalculation('sip_returns', params);
    }
  };

  const handleRetirementPlanning = () => {
    const params = {
      currentAge: parseInt(retirementForm.currentAge),
      retirementAge: parseInt(retirementForm.retirementAge),
      currentSavings: parseFloat(retirementForm.currentSavings),
      monthlyContribution: parseFloat(retirementForm.monthlyContribution),
      expectedReturn: parseFloat(retirementForm.expectedReturn) / 100,
      inflationRate: parseFloat(retirementForm.inflationRate) / 100
    };

    if (params.currentAge > 0 && params.retirementAge > params.currentAge && 
        params.expectedReturn > 0) {
      performCalculation('retirement_planning', params);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calculator className="w-5 h-5 mr-2" />
            Advanced Financial Calculator
          </CardTitle>
          <CardDescription>
            Powerful financial calculations with real-time processing
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="compound" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="compound">Compound Interest</TabsTrigger>
          <TabsTrigger value="sip">SIP Calculator</TabsTrigger>
          <TabsTrigger value="retirement">Retirement Planning</TabsTrigger>
        </TabsList>

        <TabsContent value="compound">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Compound Interest Calculator
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="principal">Principal Amount ($)</Label>
                    <Input
                      id="principal"
                      type="number"
                      value={compoundForm.principal}
                      onChange={(e) => setCompoundForm(prev => ({ ...prev, principal: e.target.value }))}
                      placeholder="10000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="rate">Annual Interest Rate (%)</Label>
                    <Input
                      id="rate"
                      type="number"
                      step="0.01"
                      value={compoundForm.rate}
                      onChange={(e) => setCompoundForm(prev => ({ ...prev, rate: e.target.value }))}
                      placeholder="8.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="time">Time Period (years)</Label>
                    <Input
                      id="time"
                      type="number"
                      value={compoundForm.time}
                      onChange={(e) => setCompoundForm(prev => ({ ...prev, time: e.target.value }))}
                      placeholder="10"
                    />
                  </div>
                  <div>
                    <Label htmlFor="frequency">Compounding Frequency</Label>
                    <Select value={compoundForm.frequency} onValueChange={(value) => 
                      setCompoundForm(prev => ({ ...prev, frequency: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Annually</SelectItem>
                        <SelectItem value="2">Semi-annually</SelectItem>
                        <SelectItem value="4">Quarterly</SelectItem>
                        <SelectItem value="12">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleCompoundInterest} disabled={loading} className="w-full">
                    Calculate Compound Interest
                  </Button>
                </div>

                {results && results.finalAmount && (
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <h3 className="font-semibold text-green-800 dark:text-green-200">Results</h3>
                      <div className="mt-2 space-y-2">
                        <p><span className="font-medium">Final Amount:</span> ${results.finalAmount.toLocaleString(undefined, {maximumFractionDigits: 2})}</p>
                        <p><span className="font-medium">Total Interest:</span> ${results.totalInterest.toLocaleString(undefined, {maximumFractionDigits: 2})}</p>
                      </div>
                    </div>
                    
                    {results.yearlyBreakdown && (
                      <div>
                        <h4 className="font-medium mb-2">Growth Over Time</h4>
                        <ResponsiveContainer width="100%" height={200}>
                          <LineChart data={results.yearlyBreakdown}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="year" />
                            <YAxis />
                            <Tooltip formatter={(value) => [`$${value?.toLocaleString()}`, '']} />
                            <Line type="monotone" dataKey="amount" stroke="#22c55e" strokeWidth={2} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sip">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PiggyBank className="w-5 h-5 mr-2" />
                SIP Returns Calculator
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="monthlyInvestment">Monthly Investment ($)</Label>
                    <Input
                      id="monthlyInvestment"
                      type="number"
                      value={sipForm.monthlyInvestment}
                      onChange={(e) => setSipForm(prev => ({ ...prev, monthlyInvestment: e.target.value }))}
                      placeholder="500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="expectedReturn">Expected Annual Return (%)</Label>
                    <Input
                      id="expectedReturn"
                      type="number"
                      step="0.01"
                      value={sipForm.expectedReturn}
                      onChange={(e) => setSipForm(prev => ({ ...prev, expectedReturn: e.target.value }))}
                      placeholder="12"
                    />
                  </div>
                  <div>
                    <Label htmlFor="timePeriod">Investment Period (years)</Label>
                    <Input
                      id="timePeriod"
                      type="number"
                      value={sipForm.timePeriod}
                      onChange={(e) => setSipForm(prev => ({ ...prev, timePeriod: e.target.value }))}
                      placeholder="15"
                    />
                  </div>
                  <Button onClick={handleSIPCalculation} disabled={loading} className="w-full">
                    Calculate SIP Returns
                  </Button>
                </div>

                {results && results.futureValue && (
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <h3 className="font-semibold text-blue-800 dark:text-blue-200">SIP Results</h3>
                      <div className="mt-2 space-y-2">
                        <p><span className="font-medium">Total Invested:</span> ${results.totalInvested.toLocaleString()}</p>
                        <p><span className="font-medium">Future Value:</span> ${results.futureValue.toLocaleString(undefined, {maximumFractionDigits: 2})}</p>
                        <p><span className="font-medium">Total Gains:</span> ${results.totalGains.toLocaleString(undefined, {maximumFractionDigits: 2})}</p>
                      </div>
                    </div>

                    {results.monthlyBreakdown && (
                      <div>
                        <h4 className="font-medium mb-2">SIP Growth Projection</h4>
                        <ResponsiveContainer width="100%" height={200}>
                          <BarChart data={results.monthlyBreakdown}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="year" />
                            <YAxis />
                            <Tooltip formatter={(value) => [`$${value?.toLocaleString()}`, '']} />
                            <Bar dataKey="invested" fill="#3b82f6" name="Invested" />
                            <Bar dataKey="value" fill="#22c55e" name="Value" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="retirement">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Retirement Planning Calculator
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="currentAge">Current Age</Label>
                      <Input
                        id="currentAge"
                        type="number"
                        value={retirementForm.currentAge}
                        onChange={(e) => setRetirementForm(prev => ({ ...prev, currentAge: e.target.value }))}
                        placeholder="30"
                      />
                    </div>
                    <div>
                      <Label htmlFor="retirementAge">Retirement Age</Label>
                      <Input
                        id="retirementAge"
                        type="number"
                        value={retirementForm.retirementAge}
                        onChange={(e) => setRetirementForm(prev => ({ ...prev, retirementAge: e.target.value }))}
                        placeholder="60"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="currentSavings">Current Savings ($)</Label>
                    <Input
                      id="currentSavings"
                      type="number"
                      value={retirementForm.currentSavings}
                      onChange={(e) => setRetirementForm(prev => ({ ...prev, currentSavings: e.target.value }))}
                      placeholder="50000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="monthlyContribution">Monthly Contribution ($)</Label>
                    <Input
                      id="monthlyContribution"
                      type="number"
                      value={retirementForm.monthlyContribution}
                      onChange={(e) => setRetirementForm(prev => ({ ...prev, monthlyContribution: e.target.value }))}
                      placeholder="1000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="expectedReturn">Expected Annual Return (%)</Label>
                    <Input
                      id="expectedReturn"
                      type="number"
                      step="0.01"
                      value={retirementForm.expectedReturn}
                      onChange={(e) => setRetirementForm(prev => ({ ...prev, expectedReturn: e.target.value }))}
                      placeholder="10"
                    />
                  </div>
                  <div>
                    <Label htmlFor="inflationRate">Inflation Rate (%)</Label>
                    <Input
                      id="inflationRate"
                      type="number"
                      step="0.01"
                      value={retirementForm.inflationRate}
                      onChange={(e) => setRetirementForm(prev => ({ ...prev, inflationRate: e.target.value }))}
                      placeholder="3"
                    />
                  </div>
                  <Button onClick={handleRetirementPlanning} disabled={loading} className="w-full">
                    Plan My Retirement
                  </Button>
                </div>

                {results && results.totalRetirementCorpus && (
                  <div className="space-y-4">
                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <h3 className="font-semibold text-purple-800 dark:text-purple-200">Retirement Plan</h3>
                      <div className="mt-2 space-y-2">
                        <p><span className="font-medium">Years to Retirement:</span> {results.yearsToRetirement}</p>
                        <p><span className="font-medium">Retirement Corpus:</span> ${results.totalRetirementCorpus.toLocaleString(undefined, {maximumFractionDigits: 2})}</p>
                        <p><span className="font-medium">Inflation Adjusted:</span> ${results.inflationAdjustedCorpus.toLocaleString(undefined, {maximumFractionDigits: 2})}</p>
                        <p><span className="font-medium">Monthly Income (4% rule):</span> ${results.monthlyIncomeAt4Percent.toLocaleString(undefined, {maximumFractionDigits: 2})}</p>
                      </div>
                    </div>

                    {results.breakdown && (
                      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <h4 className="font-medium mb-2">Breakdown</h4>
                        <div className="space-y-1 text-sm">
                          <p>From Current Savings: ${results.breakdown.fromCurrentSavings.toLocaleString(undefined, {maximumFractionDigits: 2})}</p>
                          <p>From Monthly Contributions: ${results.breakdown.fromMonthlyContributions.toLocaleString(undefined, {maximumFractionDigits: 2})}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
