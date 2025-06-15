
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { TrendingUp, Brain, Calculator, Target, RefreshCw, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { AIPortfolioInsights } from './AIPortfolioInsights';
import { FinancialCalculator } from './FinancialCalculator';

interface PortfolioData {
  totalValue: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
  holdings: any[];
  assetAllocation: any[];
  riskMetrics: {
    volatility: number;
    sharpeRatio: number;
    beta: number;
    maxDrawdown: number;
  };
  performanceHistory: any[];
  holdingsCount: number;
}

export const PortfolioAnalytics = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [addingSampleData, setAddingSampleData] = useState(false);

  useEffect(() => {
    if (user) {
      fetchPortfolioAnalytics();
    } else {
      setPortfolioData(null);
      setLoading(false);
    }
  }, [user]);

  const fetchPortfolioAnalytics = async () => {
    if (!user) {
      console.log('No user available for portfolio analytics');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('Fetching portfolio analytics for user:', user?.id);
      
      const { data, error } = await supabase.functions.invoke('portfolio-analytics', {
        body: { userId: user?.id }
      });

      console.log('Portfolio analytics response:', { data, error });

      if (error) {
        console.error('Portfolio analytics error:', error);
        throw error;
      }
      
      const validatedData = {
        totalValue: data?.totalValue ?? 0,
        totalGainLoss: data?.totalGainLoss ?? 0,
        totalGainLossPercent: data?.totalGainLossPercent ?? 0,
        holdings: Array.isArray(data?.holdings) ? data.holdings : [],
        assetAllocation: Array.isArray(data?.assetAllocation) ? data.assetAllocation : [],
        riskMetrics: data?.riskMetrics ?? {
          volatility: 0,
          sharpeRatio: 0,
          beta: 0,
          maxDrawdown: 0
        },
        performanceHistory: Array.isArray(data?.performanceHistory) ? data.performanceHistory : [],
        holdingsCount: Array.isArray(data?.holdings) ? data.holdings.length : 0
      };
      
      setPortfolioData(validatedData);
    } catch (error) {
      console.error('Error fetching portfolio analytics:', error);
      toast({
        title: "Error",
        description: "Failed to fetch portfolio analytics. Using default values.",
        variant: "destructive"
      });
      
      setPortfolioData({
        totalValue: 0,
        totalGainLoss: 0,
        totalGainLossPercent: 0,
        holdings: [],
        assetAllocation: [],
        riskMetrics: {
          volatility: 0,
          sharpeRatio: 0,
          beta: 0,
          maxDrawdown: 0
        },
        performanceHistory: [],
        holdingsCount: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const addSampleData = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "Please log in to add sample data.",
        variant: "destructive"
      });
      return;
    }

    try {
      setAddingSampleData(true);
      console.log('Adding sample data for user:', user?.id);
      
      const { data, error } = await supabase.functions.invoke('add-sample-data', {
        body: { userId: user?.id }
      });

      console.log('Add sample data response:', { data, error });

      if (error) {
        console.error('Add sample data error:', error);
        throw error;
      }
      
      toast({
        title: "Success",
        description: `Sample portfolio data added successfully! Added ${data?.holdingsCount || 0} holdings.`,
      });
      
      await fetchPortfolioAnalytics();
    } catch (error) {
      console.error('Error adding sample data:', error);
      toast({
        title: "Error",
        description: "Failed to add sample data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setAddingSampleData(false);
    }
  };

  if (!user) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Analytics</CardTitle>
            <CardDescription>Please log in to view your portfolio analytics</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">You need to be logged in to access portfolio analytics.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const safePortfolioData = portfolioData ?? {
    totalValue: 0,
    totalGainLoss: 0,
    totalGainLossPercent: 0,
    holdings: [],
    assetAllocation: [],
    riskMetrics: { volatility: 0, sharpeRatio: 0, beta: 0, maxDrawdown: 0 },
    performanceHistory: [],
    holdingsCount: 0
  };

  const hasHoldings = Array.isArray(safePortfolioData.holdings) && safePortfolioData.holdings.length > 0;
  const holdingsCount = safePortfolioData.holdingsCount ?? safePortfolioData.holdings?.length ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Portfolio Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Advanced analytics powered by AI and real-time data processing
          </p>
        </div>
        <div className="flex gap-2">
          {!hasHoldings && (
            <Button 
              onClick={addSampleData} 
              disabled={addingSampleData}
              variant="outline"
            >
              <Plus className={`w-4 h-4 mr-2 ${addingSampleData ? 'animate-spin' : ''}`} />
              {addingSampleData ? 'Adding...' : 'Add Sample Data'}
            </Button>
          )}
          <Button onClick={fetchPortfolioAnalytics} disabled={loading} variant="outline">
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
        </div>
      </div>

      {!hasHoldings ? (
        <Card>
          <CardHeader>
            <CardTitle>No Portfolio Data</CardTitle>
            <CardDescription>
              Get started by adding some sample portfolio data to see AI analytics in action
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Add sample portfolio data including Indian stocks (Reliance, TCS, Infosys) and crypto (Bitcoin, Ethereum) 
              to experience the full power of AI-driven portfolio analysis.
            </p>
            <Button onClick={addSampleData} disabled={addingSampleData}>
              <Plus className={`w-4 h-4 mr-2 ${addingSampleData ? 'animate-spin' : ''}`} />
              {addingSampleData ? 'Adding Sample Data...' : 'Add Sample Portfolio Data'}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
            <TabsTrigger value="calculations">Calculators</TabsTrigger>
            <TabsTrigger value="risk-analysis">Risk Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Value</p>
                    <p className="text-3xl font-bold">₹{(safePortfolioData.totalValue || 0).toLocaleString()}</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Gain/Loss</p>
                    <p className={`text-3xl font-bold ${(safePortfolioData.totalGainLoss || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {(safePortfolioData.totalGainLoss || 0) >= 0 ? '+' : ''}₹{(safePortfolioData.totalGainLoss || 0).toLocaleString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Performance</p>
                    <p className={`text-3xl font-bold flex items-center justify-center ${(safePortfolioData.totalGainLossPercent || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {(safePortfolioData.totalGainLossPercent || 0) >= 0 ? <TrendingUp className="w-6 h-6 mr-2" /> : <TrendingUp className="w-6 h-6 mr-2 rotate-180" />}
                      {(safePortfolioData.totalGainLossPercent || 0).toFixed(2)}%
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {safePortfolioData.performanceHistory.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Performance History</CardTitle>
                  <CardDescription>Portfolio value over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={safePortfolioData.performanceHistory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        name="Portfolio Value"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {Array.isArray(safePortfolioData.assetAllocation) && safePortfolioData.assetAllocation.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Asset Allocation</CardTitle>
                  <CardDescription>Portfolio distribution by asset type</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={safePortfolioData.assetAllocation}
                        dataKey="percentage"
                        nameKey="type"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        label={({ type, percentage }) => `${type}: ${percentage.toFixed(1)}%`}
                      >
                        {safePortfolioData.assetAllocation.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={index === 0 ? '#3b82f6' : '#10b981'} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="ai-insights">
            <AIPortfolioInsights />
          </TabsContent>

          <TabsContent value="calculations">
            <FinancialCalculator />
          </TabsContent>

          <TabsContent value="risk-analysis">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  Risk Analysis
                </CardTitle>
                <CardDescription>
                  Portfolio risk metrics and analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Volatility</p>
                        <p className="text-2xl font-bold">{(safePortfolioData.riskMetrics.volatility || 0).toFixed(2)}%</p>
                        <p className="text-xs text-gray-500">Price volatility</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Sharpe Ratio</p>
                        <p className="text-2xl font-bold">{(safePortfolioData.riskMetrics.sharpeRatio || 0).toFixed(2)}</p>
                        <p className="text-xs text-gray-500">Risk-adjusted return</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Beta</p>
                        <p className="text-2xl font-bold">{(safePortfolioData.riskMetrics.beta || 0).toFixed(2)}</p>
                        <p className="text-xs text-gray-500">Market correlation</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Max Drawdown</p>
                        <p className="text-2xl font-bold text-red-600">{(safePortfolioData.riskMetrics.maxDrawdown || 0).toFixed(2)}%</p>
                        <p className="text-xs text-gray-500">Worst decline</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};
