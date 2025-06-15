
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

interface PortfolioSummary {
  totalValue: number;
  dayChange: number;
  dayChangePercent: number;
  holdings: number;
}

export const PortfolioAnalytics = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [portfolioData, setPortfolioData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [addingSampleData, setAddingSampleData] = useState(false);

  useEffect(() => {
    if (user) {
      fetchPortfolioAnalytics();
    }
  }, [user]);

  const fetchPortfolioAnalytics = async () => {
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
      
      // Ensure we have a valid data structure
      const validatedData = {
        totalValue: data?.totalValue || 0,
        totalGainLoss: data?.totalGainLoss || 0,
        totalGainLossPercent: data?.totalGainLossPercent || 0,
        holdings: data?.holdings || [],
        assetAllocation: data?.assetAllocation || [],
        riskMetrics: data?.riskMetrics || {
          volatility: 0,
          sharpeRatio: 0,
          beta: 0,
          maxDrawdown: 0
        },
        performanceHistory: data?.performanceHistory || [],
        holdingsCount: data?.holdings?.length || 0
      };
      
      setPortfolioData(validatedData);
    } catch (error) {
      console.error('Error fetching portfolio analytics:', error);
      toast({
        title: "Error",
        description: "Failed to fetch portfolio analytics. Using default values.",
        variant: "destructive"
      });
      
      // Set default empty data structure to prevent undefined errors
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
      
      // Refresh the analytics after adding sample data
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

  // Safe access to portfolio data with fallbacks
  const hasHoldings = portfolioData?.holdings?.length > 0;
  const holdingsCount = portfolioData?.holdingsCount || portfolioData?.holdings?.length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
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

          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Overview</CardTitle>
                <CardDescription>
                  Summary of your portfolio's performance and holdings ({holdingsCount} holdings)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Total Value</p>
                        <p className="text-2xl font-bold">₹{(portfolioData?.totalValue || 0).toLocaleString()}</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Total Gain/Loss</p>
                        <p className={`text-2xl font-bold ${(portfolioData?.totalGainLoss || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ₹{(portfolioData?.totalGainLoss || 0).toLocaleString()}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Asset Allocation</p>
                        {portfolioData?.assetAllocation?.length > 0 ? (
                          <ResponsiveContainer width="100%" height={150}>
                            <PieChart>
                              <Pie
                                data={portfolioData.assetAllocation}
                                dataKey="percentage"
                                nameKey="type"
                                cx="50%"
                                cy="50%"
                                outerRadius={50}
                                fill="#8884d8"
                                label
                              >
                                {portfolioData.assetAllocation.map((entry: any, index: number) => (
                                  <Cell key={`cell-${index}`} fill={`#${Math.floor(Math.random() * 16777215).toString(16)}`} />
                                ))}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        ) : (
                          <p className="text-sm text-gray-500 mt-4">No allocation data</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
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
                  Advanced Risk Analysis
                </CardTitle>
                <CardDescription>
                  AI-powered risk metrics and portfolio optimization
                </CardDescription>
              </CardHeader>
              <CardContent>
                {portfolioData?.riskMetrics && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Volatility</p>
                          <p className="text-2xl font-bold">{(portfolioData.riskMetrics.volatility || 0).toFixed(2)}%</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Sharpe Ratio</p>
                          <p className="text-2xl font-bold">{(portfolioData.riskMetrics.sharpeRatio || 0).toFixed(2)}</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Beta</p>
                          <p className="text-2xl font-bold">{(portfolioData.riskMetrics.beta || 0).toFixed(2)}</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Max Drawdown</p>
                          <p className="text-2xl font-bold text-red-600">{(portfolioData.riskMetrics.maxDrawdown || 0).toFixed(2)}%</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};
