import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { PiggyBank, TrendingUp, Calendar, Target, Calculator, PieChart } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface RetirementScenario {
  id: string;
  name: string;
  currentAge: number;
  retirementAge: number;
  currentSavings: number;
  monthlyContribution: number;
  expectedReturn: number;
  monthlyExpensesInRetirement: number;
  inflationRate: number;
}

export const RetirementPlanner = () => {
  const [scenarios, setScenarios] = useState<RetirementScenario[]>([
    {
      id: '1',
      name: 'Conservative Plan',
      currentAge: 30,
      retirementAge: 60,
      currentSavings: 500000,
      monthlyContribution: 25000,
      expectedReturn: 8,
      monthlyExpensesInRetirement: 50000,
      inflationRate: 6
    }
  ]);

  const [activeScenario, setActiveScenario] = useState(scenarios[0]);
  const [newScenario, setNewScenario] = useState<RetirementScenario>({
    id: '',
    name: '',
    currentAge: 30,
    retirementAge: 60,
    currentSavings: 0,
    monthlyContribution: 0,
    expectedReturn: 8,
    monthlyExpensesInRetirement: 0,
    inflationRate: 6
  });

  const calculateRetirementCorpus = (scenario: RetirementScenario) => {
    const yearsToRetirement = scenario.retirementAge - scenario.currentAge;
    const monthsToRetirement = yearsToRetirement * 12;
    const monthlyReturn = scenario.expectedReturn / 100 / 12;

    // Future value of current savings
    const futureValueCurrentSavings = scenario.currentSavings * Math.pow(1 + scenario.expectedReturn / 100, yearsToRetirement);

    // Future value of monthly contributions (annuity)
    const futureValueContributions = scenario.monthlyContribution * 
      ((Math.pow(1 + monthlyReturn, monthsToRetirement) - 1) / monthlyReturn);

    return futureValueCurrentSavings + futureValueContributions;
  };

  const calculateRequiredCorpus = (scenario: RetirementScenario) => {
    const yearsToRetirement = scenario.retirementAge - scenario.currentAge;
    const futureMonthlyExpenses = scenario.monthlyExpensesInRetirement * 
      Math.pow(1 + scenario.inflationRate / 100, yearsToRetirement);
    
    // Assuming 25 years of retirement, 4% withdrawal rate
    return futureMonthlyExpenses * 12 * 25;
  };

  const generateProjectionData = (scenario: RetirementScenario) => {
    const data = [];
    const yearsToRetirement = scenario.retirementAge - scenario.currentAge;
    
    for (let year = 0; year <= yearsToRetirement; year++) {
      const monthsElapsed = year * 12;
      const monthlyReturn = scenario.expectedReturn / 100 / 12;
      
      const currentSavingsGrowth = scenario.currentSavings * Math.pow(1 + scenario.expectedReturn / 100, year);
      const contributionsGrowth = monthsElapsed > 0 ? 
        scenario.monthlyContribution * ((Math.pow(1 + monthlyReturn, monthsElapsed) - 1) / monthlyReturn) : 0;
      
      data.push({
        year: scenario.currentAge + year,
        corpus: Math.round((currentSavingsGrowth + contributionsGrowth) / 100000),
        contribution: Math.round(contributionsGrowth / 100000),
        growth: Math.round(currentSavingsGrowth / 100000)
      });
    }
    
    return data;
  };

  const projectedCorpus = calculateRetirementCorpus(activeScenario);
  const requiredCorpus = calculateRequiredCorpus(activeScenario);
  const corpusGap = requiredCorpus - projectedCorpus;
  const projectionData = generateProjectionData(activeScenario);

  const addScenario = () => {
    const scenario: RetirementScenario = {
      ...newScenario,
      id: Date.now().toString(),
      name: newScenario.name || `Scenario ${scenarios.length + 1}`
    };
    
    setScenarios([...scenarios, scenario]);
    setNewScenario({
      id: '',
      name: '',
      currentAge: 30,
      retirementAge: 60,
      currentSavings: 0,
      monthlyContribution: 0,
      expectedReturn: 8,
      monthlyExpensesInRetirement: 0,
      inflationRate: 6
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Retirement Planner
          </h1>
          <p className="text-muted-foreground">
            Plan and track your retirement scenarios with detailed projections
          </p>
        </div>
      </div>

      <Tabs defaultValue="scenarios" className="space-y-4">
        <TabsList>
          <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
          <TabsTrigger value="projections">Projections</TabsTrigger>
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
        </TabsList>

        <TabsContent value="scenarios" className="space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Projected Corpus</CardTitle>
                <PiggyBank className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{(projectedCorpus / 10000000).toFixed(1)}Cr</div>
                <p className="text-xs text-muted-foreground">
                  At retirement age {activeScenario.retirementAge}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Required Corpus</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{(requiredCorpus / 10000000).toFixed(1)}Cr</div>
                <p className="text-xs text-muted-foreground">
                  For desired lifestyle
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Corpus Gap</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${corpusGap > 0 ? 'text-red-500' : 'text-green-500'}`}>
                  ₹{Math.abs(corpusGap / 10000000).toFixed(1)}Cr
                </div>
                <p className="text-xs text-muted-foreground">
                  {corpusGap > 0 ? 'Shortfall' : 'Surplus'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Years to Retirement</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeScenario.retirementAge - activeScenario.currentAge}</div>
                <p className="text-xs text-muted-foreground">
                  Years remaining
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Scenarios List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Current Scenarios</CardTitle>
                <CardDescription>Select and compare different retirement plans</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {scenarios.map((scenario) => (
                  <div 
                    key={scenario.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      activeScenario.id === scenario.id ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                    }`}
                    onClick={() => setActiveScenario(scenario)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{scenario.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Age {scenario.currentAge} → {scenario.retirementAge}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          ₹{scenario.monthlyContribution.toLocaleString()}/month
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">₹{(calculateRetirementCorpus(scenario) / 10000000).toFixed(1)}Cr</p>
                        <p className="text-xs text-muted-foreground">Projected</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Add New Scenario</CardTitle>
                <CardDescription>Create a new retirement planning scenario</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Scenario Name</Label>
                  <Input
                    id="name"
                    value={newScenario.name}
                    onChange={(e) => setNewScenario({...newScenario, name: e.target.value})}
                    placeholder="e.g., Aggressive Plan"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="currentAge">Current Age</Label>
                    <Input
                      id="currentAge"
                      type="number"
                      value={newScenario.currentAge}
                      onChange={(e) => setNewScenario({...newScenario, currentAge: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="retirementAge">Retirement Age</Label>
                    <Input
                      id="retirementAge"
                      type="number"
                      value={newScenario.retirementAge}
                      onChange={(e) => setNewScenario({...newScenario, retirementAge: parseInt(e.target.value) || 0})}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="currentSavings">Current Savings (₹)</Label>
                  <Input
                    id="currentSavings"
                    type="number"
                    value={newScenario.currentSavings}
                    onChange={(e) => setNewScenario({...newScenario, currentSavings: parseFloat(e.target.value) || 0})}
                  />
                </div>

                <div>
                  <Label htmlFor="monthlyContribution">Monthly Contribution (₹)</Label>
                  <Input
                    id="monthlyContribution"
                    type="number"
                    value={newScenario.monthlyContribution}
                    onChange={(e) => setNewScenario({...newScenario, monthlyContribution: parseFloat(e.target.value) || 0})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expectedReturn">Expected Return (%)</Label>
                    <Input
                      id="expectedReturn"
                      type="number"
                      step="0.1"
                      value={newScenario.expectedReturn}
                      onChange={(e) => setNewScenario({...newScenario, expectedReturn: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="inflationRate">Inflation Rate (%)</Label>
                    <Input
                      id="inflationRate"
                      type="number"
                      step="0.1"
                      value={newScenario.inflationRate}
                      onChange={(e) => setNewScenario({...newScenario, inflationRate: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="monthlyExpenses">Monthly Expenses in Retirement (₹)</Label>
                  <Input
                    id="monthlyExpenses"
                    type="number"
                    value={newScenario.monthlyExpensesInRetirement}
                    onChange={(e) => setNewScenario({...newScenario, monthlyExpensesInRetirement: parseFloat(e.target.value) || 0})}
                  />
                </div>

                <Button onClick={addScenario} className="w-full">
                  Add Scenario
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="projections" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Retirement Corpus Projection</CardTitle>
              <CardDescription>
                Projected growth for: {activeScenario.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={projectionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`₹${value}L`, 'Corpus']} />
                    <Line 
                      type="monotone" 
                      dataKey="corpus" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--primary))' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Corpus Breakdown</CardTitle>
              <CardDescription>
                Contribution vs Growth over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={projectionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="contribution" stackId="a" fill="hsl(var(--primary))" />
                    <Bar dataKey="growth" stackId="a" fill="hsl(var(--muted))" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calculator" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Retirement Calculator</CardTitle>
              <CardDescription>
                Calculate different retirement scenarios instantly
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Current Situation</h3>
                  <div>
                    <Label>Current Savings: ₹{activeScenario.currentSavings.toLocaleString()}</Label>
                    <Progress value={(activeScenario.currentSavings / 10000000) * 100} className="mt-2" />
                  </div>
                  <div>
                    <Label>Monthly Investment: ₹{activeScenario.monthlyContribution.toLocaleString()}</Label>
                  </div>
                  <div>
                    <Label>Expected Return: {activeScenario.expectedReturn}% p.a.</Label>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Retirement Goals</h3>
                  <div>
                    <Label>Retirement Age: {activeScenario.retirementAge} years</Label>
                  </div>
                  <div>
                    <Label>Years to Retirement: {activeScenario.retirementAge - activeScenario.currentAge}</Label>
                  </div>
                  <div>
                    <Label>Monthly Expenses: ₹{activeScenario.monthlyExpensesInRetirement.toLocaleString()}</Label>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Projections</h3>
                  <div>
                    <Label>Projected Corpus</Label>
                    <p className="text-2xl font-bold text-primary">₹{(projectedCorpus / 10000000).toFixed(2)}Cr</p>
                  </div>
                  <div>
                    <Label>Required Corpus</Label>
                    <p className="text-xl font-semibold">₹{(requiredCorpus / 10000000).toFixed(2)}Cr</p>
                  </div>
                  <div>
                    <Label className={corpusGap > 0 ? 'text-red-500' : 'text-green-500'}>
                      {corpusGap > 0 ? 'Shortfall' : 'Surplus'}: ₹{Math.abs(corpusGap / 10000000).toFixed(2)}Cr
                    </Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};