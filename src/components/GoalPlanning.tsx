
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Target, 
  Calculator, 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  PiggyBank,
  Briefcase,
  GraduationCap,
  Home,
  Heart,
  Plane,
  ArrowUpRight,
  ArrowDownRight,
  Info
} from "lucide-react";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface SIPCalculation {
  monthlyInvestment: number;
  expectedReturn: number;
  timePeriod: number;
  totalInvestment: number;
  futureValue: number;
  totalReturns: number;
  yearlyBreakdown: Array<{
    year: number;
    invested: number;
    value: number;
    returns: number;
  }>;
}

interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  category: string;
  monthlyContribution: number;
  progress: number;
}

export const GoalPlanning = () => {
  const [activeTab, setActiveTab] = useState("sip-calculator");
  const [sipInputs, setSipInputs] = useState({
    monthlyAmount: "",
    expectedReturn: "12",
    timePeriod: "",
    goalAmount: ""
  });
  const [sipResult, setSipResult] = useState<SIPCalculation | null>(null);
  const [retirementInputs, setRetirementInputs] = useState({
    currentAge: "",
    retirementAge: "60",
    currentSavings: "",
    monthlyExpenses: "",
    inflationRate: "6",
    expectedReturn: "12"
  });
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newGoal, setNewGoal] = useState({
    name: "",
    targetAmount: "",
    targetDate: "",
    category: "retirement",
    monthlyContribution: ""
  });
  const [marketData, setMarketData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const goalCategories = [
    { value: "retirement", label: "Retirement", icon: Briefcase, color: "bg-blue-500" },
    { value: "education", label: "Education", icon: GraduationCap, color: "bg-green-500" },
    { value: "home", label: "Home Purchase", icon: Home, color: "bg-purple-500" },
    { value: "health", label: "Health/Emergency", icon: Heart, color: "bg-red-500" },
    { value: "travel", label: "Travel", icon: Plane, color: "bg-yellow-500" },
    { value: "other", label: "Other", icon: Target, color: "bg-gray-500" }
  ];

  useEffect(() => {
    fetchGoals();
    fetchMarketData();
  }, [user]);

  const fetchGoals = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('financial_goals')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      setGoals(data || []);
    } catch (error) {
      console.error('Error fetching goals:', error);
    }
  };

  const fetchMarketData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('get-market-overview');
      
      if (error) throw error;
      setMarketData(data);
    } catch (error) {
      console.error('Error fetching market data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateSIP = () => {
    const monthly = parseFloat(sipInputs.monthlyAmount);
    const rate = parseFloat(sipInputs.expectedReturn) / 100 / 12;
    const months = parseFloat(sipInputs.timePeriod) * 12;

    if (!monthly || !rate || !months) return;

    const futureValue = monthly * (((Math.pow(1 + rate, months) - 1) / rate) * (1 + rate));
    const totalInvestment = monthly * months;
    const totalReturns = futureValue - totalInvestment;

    const yearlyBreakdown = [];
    for (let year = 1; year <= parseFloat(sipInputs.timePeriod); year++) {
      const monthsCompleted = year * 12;
      const invested = monthly * monthsCompleted;
      const value = monthly * (((Math.pow(1 + rate, monthsCompleted) - 1) / rate) * (1 + rate));
      yearlyBreakdown.push({
        year,
        invested,
        value,
        returns: value - invested
      });
    }

    setSipResult({
      monthlyInvestment: monthly,
      expectedReturn: parseFloat(sipInputs.expectedReturn),
      timePeriod: parseFloat(sipInputs.timePeriod),
      totalInvestment,
      futureValue,
      totalReturns,
      yearlyBreakdown
    });
  };

  const calculateRequiredSIP = () => {
    const goalAmount = parseFloat(sipInputs.goalAmount);
    const rate = parseFloat(sipInputs.expectedReturn) / 100 / 12;
    const months = parseFloat(sipInputs.timePeriod) * 12;

    if (!goalAmount || !rate || !months) return;

    const requiredMonthly = goalAmount / (((Math.pow(1 + rate, months) - 1) / rate) * (1 + rate));
    setSipInputs(prev => ({ ...prev, monthlyAmount: requiredMonthly.toFixed(0) }));
    calculateSIP();
  };

  const saveGoal = async () => {
    if (!user || !newGoal.name || !newGoal.targetAmount) return;

    try {
      const { error } = await supabase
        .from('financial_goals')
        .insert({
          user_id: user.id,
          name: newGoal.name,
          target_amount: parseFloat(newGoal.targetAmount),
          target_date: newGoal.targetDate,
          category: newGoal.category,
          monthly_contribution: parseFloat(newGoal.monthlyContribution) || 0,
          current_amount: 0
        });

      if (error) throw error;

      toast({
        title: "Goal Created",
        description: "Your financial goal has been saved successfully.",
      });

      setNewGoal({
        name: "",
        targetAmount: "",
        targetDate: "",
        category: "retirement",
        monthlyContribution: ""
      });

      fetchGoals();
    } catch (error) {
      console.error('Error saving goal:', error);
      toast({
        title: "Error",
        description: "Failed to save goal. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Goal Planning</h1>
          <p className="text-slate-600 dark:text-slate-400">Plan your financial future with smart calculators and goal tracking</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <TrendingUp className="w-3 h-3 mr-1" />
            Live Market Data
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sip-calculator">SIP Calculator</TabsTrigger>
          <TabsTrigger value="retirement">Retirement Planning</TabsTrigger>
          <TabsTrigger value="goals">Goal Tracker</TabsTrigger>
          <TabsTrigger value="insights">Market Insights</TabsTrigger>
        </TabsList>

        {/* SIP Calculator Tab */}
        <TabsContent value="sip-calculator" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calculator className="w-5 h-5" />
                  <span>SIP Calculator</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="monthly">Monthly Investment (₹)</Label>
                    <Input
                      id="monthly"
                      type="number"
                      placeholder="25000"
                      value={sipInputs.monthlyAmount}
                      onChange={(e) => setSipInputs(prev => ({ ...prev, monthlyAmount: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="return">Expected Return (%)</Label>
                    <Select value={sipInputs.expectedReturn} onValueChange={(value) => setSipInputs(prev => ({ ...prev, expectedReturn: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="8">8% (Conservative)</SelectItem>
                        <SelectItem value="10">10% (Moderate)</SelectItem>
                        <SelectItem value="12">12% (Aggressive)</SelectItem>
                        <SelectItem value="15">15% (High Risk)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="period">Time Period (Years)</Label>
                  <Input
                    id="period"
                    type="number"
                    placeholder="20"
                    value={sipInputs.timePeriod}
                    onChange={(e) => setSipInputs(prev => ({ ...prev, timePeriod: e.target.value }))}
                  />
                </div>

                <Separator />

                <div>
                  <Label htmlFor="goal">Goal Amount (₹) - Optional</Label>
                  <Input
                    id="goal"
                    type="number"
                    placeholder="1,00,00,000"
                    value={sipInputs.goalAmount}
                    onChange={(e) => setSipInputs(prev => ({ ...prev, goalAmount: e.target.value }))}
                  />
                </div>

                <div className="flex space-x-2">
                  <Button onClick={calculateSIP} className="flex-1">
                    Calculate SIP
                  </Button>
                  <Button onClick={calculateRequiredSIP} variant="outline" className="flex-1">
                    Calculate Required SIP
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Results Section */}
            {sipResult && (
              <Card>
                <CardHeader>
                  <CardTitle>SIP Results</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{formatCurrency(sipResult.totalInvestment)}</div>
                      <div className="text-sm text-blue-500">Total Investment</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{formatCurrency(sipResult.futureValue)}</div>
                      <div className="text-sm text-green-500">Future Value</div>
                    </div>
                  </div>
                  
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                    <div className="text-3xl font-bold text-purple-600">{formatCurrency(sipResult.totalReturns)}</div>
                    <div className="text-sm text-purple-500">Total Returns</div>
                    <div className="text-xs text-slate-500 mt-1">
                      {((sipResult.totalReturns / sipResult.totalInvestment) * 100).toFixed(1)}% gain
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Growth Chart */}
          {sipResult && (
            <Card>
              <CardHeader>
                <CardTitle>Investment Growth Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={sipResult.yearlyBreakdown}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis tickFormatter={(value) => `₹${(value / 100000).toFixed(1)}L`} />
                      <Tooltip formatter={(value: number) => [formatCurrency(value), ""]} />
                      <Area type="monotone" dataKey="invested" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                      <Area type="monotone" dataKey="returns" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.8} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Retirement Planning Tab */}
        <TabsContent value="retirement" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PiggyBank className="w-5 h-5" />
                <span>Retirement Planning</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="currentAge">Current Age</Label>
                  <Input
                    id="currentAge"
                    type="number"
                    placeholder="30"
                    value={retirementInputs.currentAge}
                    onChange={(e) => setRetirementInputs(prev => ({ ...prev, currentAge: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="retirementAge">Retirement Age</Label>
                  <Input
                    id="retirementAge"
                    type="number"
                    placeholder="60"
                    value={retirementInputs.retirementAge}
                    onChange={(e) => setRetirementInputs(prev => ({ ...prev, retirementAge: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="currentSavings">Current Savings (₹)</Label>
                  <Input
                    id="currentSavings"
                    type="number"
                    placeholder="5,00,000"
                    value={retirementInputs.currentSavings}
                    onChange={(e) => setRetirementInputs(prev => ({ ...prev, currentSavings: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="monthlyExpenses">Monthly Expenses (₹)</Label>
                  <Input
                    id="monthlyExpenses"
                    type="number"
                    placeholder="50,000"
                    value={retirementInputs.monthlyExpenses}
                    onChange={(e) => setRetirementInputs(prev => ({ ...prev, monthlyExpenses: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="inflationRate">Inflation Rate (%)</Label>
                  <Select value={retirementInputs.inflationRate} onValueChange={(value) => setRetirementInputs(prev => ({ ...prev, inflationRate: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="4">4% (Low)</SelectItem>
                      <SelectItem value="6">6% (Average)</SelectItem>
                      <SelectItem value="8">8% (High)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="expectedReturn">Expected Return (%)</Label>
                  <Select value={retirementInputs.expectedReturn} onValueChange={(value) => setRetirementInputs(prev => ({ ...prev, expectedReturn: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="8">8% (Conservative)</SelectItem>
                      <SelectItem value="10">10% (Moderate)</SelectItem>
                      <SelectItem value="12">12% (Aggressive)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button className="mt-4 w-full">Calculate Retirement Plan</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Goals Tab */}
        <TabsContent value="goals" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Create New Goal */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5" />
                  <span>Create New Goal</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="goalName">Goal Name</Label>
                  <Input
                    id="goalName"
                    placeholder="Dream Home"
                    value={newGoal.name}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={newGoal.category} onValueChange={(value) => setNewGoal(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {goalCategories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="targetAmount">Target Amount (₹)</Label>
                  <Input
                    id="targetAmount"
                    type="number"
                    placeholder="50,00,000"
                    value={newGoal.targetAmount}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, targetAmount: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="targetDate">Target Date</Label>
                  <Input
                    id="targetDate"
                    type="date"
                    value={newGoal.targetDate}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, targetDate: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="monthlyContribution">Monthly Contribution (₹)</Label>
                  <Input
                    id="monthlyContribution"
                    type="number"
                    placeholder="25,000"
                    value={newGoal.monthlyContribution}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, monthlyContribution: e.target.value }))}
                  />
                </div>

                <Button onClick={saveGoal} className="w-full">
                  Create Goal
                </Button>
              </CardContent>
            </Card>

            {/* Goals List */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-lg font-semibold">Your Financial Goals</h3>
              {goals.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Target className="w-12 h-12 text-slate-400 mb-4" />
                    <p className="text-slate-500">No goals created yet. Start by creating your first financial goal!</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {goals.map((goal) => {
                    const category = goalCategories.find(cat => cat.value === goal.category);
                    const IconComponent = category?.icon || Target;
                    const progress = (goal.currentAmount / goal.targetAmount) * 100;
                    
                    return (
                      <Card key={goal.id}>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <div className={`p-2 rounded-lg ${category?.color || 'bg-gray-500'}`}>
                                <IconComponent className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <h4 className="font-semibold">{goal.name}</h4>
                                <p className="text-sm text-slate-500">{category?.label}</p>
                              </div>
                            </div>
                            <Badge variant="outline">
                              {progress.toFixed(1)}% Complete
                            </Badge>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Current: {formatCurrency(goal.currentAmount)}</span>
                              <span>Target: {formatCurrency(goal.targetAmount)}</span>
                            </div>
                            <Progress value={progress} className="h-2" />
                            <div className="flex justify-between text-xs text-slate-500">
                              <span>Monthly: {formatCurrency(goal.monthlyContribution)}</span>
                              <span>Due: {new Date(goal.targetDate).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Market Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>Market Performance</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Nifty 50</span>
                      <div className="flex items-center space-x-1">
                        <span className="font-semibold">19,850.25</span>
                        <ArrowUpRight className="w-4 h-4 text-green-500" />
                        <span className="text-green-500 text-sm">+1.2%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Sensex</span>
                      <div className="flex items-center space-x-1">
                        <span className="font-semibold">66,795.14</span>
                        <ArrowUpRight className="w-4 h-4 text-green-500" />
                        <span className="text-green-500 text-sm">+0.8%</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>SIP Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Conservative</span>
                    <Badge variant="outline">8-10%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Moderate</span>
                    <Badge variant="outline">10-12%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Aggressive</span>
                    <Badge variant="outline">12-15%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Info className="w-5 h-5" />
                  <span>Planning Tips</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <p>• Start early to benefit from compounding</p>
                  <p>• Diversify across asset classes</p>
                  <p>• Review and rebalance annually</p>
                  <p>• Consider tax-saving investments</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
