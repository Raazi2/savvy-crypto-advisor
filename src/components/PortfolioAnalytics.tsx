
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, BarChart3, PieChart as PieChartIcon, Activity, RefreshCw, Download } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Holding {
  symbol: string;
  quantity: number;
  avg_cost: number;
  current_price: number;
  current_value: number;
  gain_loss: number;
  gain_loss_percent: number;
  asset_type: string;
}

interface PortfolioData {
  totalValue: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
  holdings: Holding[];
  assetAllocation: Array<{
    type: string;
    value: number;
    percentage: number;
  }>;
  riskMetrics: {
    volatility: number;
    sharpeRatio: number;
    beta: number;
    maxDrawdown: number;
  };
  performanceHistory: Array<{
    date: string;
    value: number;
    change: number;
  }>;
}

export const PortfolioAnalytics = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user) {
      fetchPortfolioData();
      // Refresh every 60 seconds
      const interval = setInterval(fetchPortfolioData, 60000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchPortfolioData = async () => {
    if (!user) return;

    try {
      setRefreshing(true);
      
      const { data, error } = await supabase.functions.invoke('portfolio-analytics', {
        body: { userId: user.id }
      });

      if (error) {
        console.error('Error fetching portfolio data:', error);
        toast({
          title: "Error",
          description: "Failed to fetch portfolio data",
          variant: "destructive"
        });
        return;
      }

      setPortfolioData(data);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to fetch portfolio data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-32 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <h3 className="text-lg font-medium mb-2">Authentication Required</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Please log in to view your portfolio analytics
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!portfolioData) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <h3 className="text-lg font-medium mb-2">No Portfolio Data</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Start investing to see your portfolio analytics
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Portfolio Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Comprehensive analysis of your investment portfolio
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={fetchPortfolioData} 
            disabled={refreshing}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center">
              <DollarSign className="w-4 h-4 mr-2" />
              Total Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{portfolioData.totalValue.toLocaleString()}
            </div>
            <div className={`text-sm flex items-center ${
              portfolioData.totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {portfolioData.totalGainLoss >= 0 ? (
                <TrendingUp className="w-3 h-3 mr-1" />
              ) : (
                <TrendingDown className="w-3 h-3 mr-1" />
              )}
              ₹{Math.abs(portfolioData.totalGainLoss).toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center">
              <TrendingUp className="w-4 h-4 mr-2" />
              Total Return
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${
              portfolioData.totalGainLossPercent >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {portfolioData.totalGainLossPercent >= 0 ? '+' : ''}{portfolioData.totalGainLossPercent.toFixed(2)}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              All time return
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center">
              <BarChart3 className="w-4 h-4 mr-2" />
              Holdings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {portfolioData.holdings.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Active positions
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center">
              <Activity className="w-4 h-4 mr-2" />
              Volatility
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {portfolioData.riskMetrics.volatility.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Risk level
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="holdings">Holdings</TabsTrigger>
          <TabsTrigger value="allocation">Allocation</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Portfolio Performance
                </CardTitle>
                <CardDescription>
                  Value over time (Last 30 days)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={portfolioData.performanceHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`₹${value?.toLocaleString()}`, 'Value']} />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#0088FE" 
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Asset Allocation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChartIcon className="w-5 h-5 mr-2" />
                  Asset Allocation
                </CardTitle>
                <CardDescription>
                  Portfolio distribution by asset type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={portfolioData.assetAllocation}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ type, percentage }) => `${type}: ${percentage.toFixed(1)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {portfolioData.assetAllocation.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`₹${value?.toLocaleString()}`, '']} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Risk Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Risk Metrics</CardTitle>
              <CardDescription>
                Portfolio risk analysis and performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Volatility</h4>
                  <div className="text-2xl font-bold mb-1">
                    {portfolioData.riskMetrics.volatility.toFixed(1)}%
                  </div>
                  <Progress value={Math.min(portfolioData.riskMetrics.volatility, 100)} className="h-2" />
                </div>
                <div>
                  <h4 className="font-medium mb-2">Sharpe Ratio</h4>
                  <div className="text-2xl font-bold mb-1">
                    {portfolioData.riskMetrics.sharpeRatio.toFixed(2)}
                  </div>
                  <Progress value={Math.min(portfolioData.riskMetrics.sharpeRatio * 50, 100)} className="h-2" />
                </div>
                <div>
                  <h4 className="font-medium mb-2">Beta</h4>
                  <div className="text-2xl font-bold mb-1">
                    {portfolioData.riskMetrics.beta.toFixed(2)}
                  </div>
                  <Progress value={Math.min(portfolioData.riskMetrics.beta * 100, 100)} className="h-2" />
                </div>
                <div>
                  <h4 className="font-medium mb-2">Max Drawdown</h4>
                  <div className="text-2xl font-bold mb-1 text-red-600">
                    {portfolioData.riskMetrics.maxDrawdown.toFixed(1)}%
                  </div>
                  <Progress value={Math.abs(portfolioData.riskMetrics.maxDrawdown)} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="holdings">
          <Card>
            <CardHeader>
              <CardTitle>Current Holdings</CardTitle>
              <CardDescription>
                Detailed view of all your portfolio positions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Symbol</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Avg Cost</TableHead>
                    <TableHead>Current Price</TableHead>
                    <TableHead>Current Value</TableHead>
                    <TableHead>Gain/Loss</TableHead>
                    <TableHead>Return %</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {portfolioData.holdings.map((holding, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {holding.symbol}
                        <Badge variant="outline" className="ml-2">
                          {holding.asset_type}
                        </Badge>
                      </TableCell>
                      <TableCell>{holding.quantity}</TableCell>
                      <TableCell>₹{holding.avg_cost.toFixed(2)}</TableCell>
                      <TableCell>₹{holding.current_price.toFixed(2)}</TableCell>
                      <TableCell>₹{holding.current_value.toLocaleString()}</TableCell>
                      <TableCell className={holding.gain_loss >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {holding.gain_loss >= 0 ? '+' : ''}₹{holding.gain_loss.toFixed(2)}
                      </TableCell>
                      <TableCell className={holding.gain_loss_percent >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {holding.gain_loss_percent >= 0 ? '+' : ''}{holding.gain_loss_percent.toFixed(2)}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="allocation">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Asset Allocation</CardTitle>
                <CardDescription>
                  Distribution by asset type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={portfolioData.assetAllocation}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`₹${value?.toLocaleString()}`, 'Value']} />
                    <Bar dataKey="value" fill="#0088FE" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Allocation Summary</CardTitle>
                <CardDescription>
                  Percentage breakdown
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {portfolioData.assetAllocation.map((allocation, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div 
                        className="w-4 h-4 rounded mr-3"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      ></div>
                      <span className="font-medium">{allocation.type}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">₹{allocation.value.toLocaleString()}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {allocation.percentage.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Performance History</CardTitle>
              <CardDescription>
                Daily portfolio value changes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={portfolioData.performanceHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'value' ? `₹${value?.toLocaleString()}` : `₹${value}`,
                      name === 'value' ? 'Portfolio Value' : 'Daily Change'
                    ]} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#0088FE" 
                    strokeWidth={2}
                    name="value"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="change" 
                    stroke="#82ca9d" 
                    strokeWidth={2}
                    name="change"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
