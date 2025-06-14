
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Wallet, Target, Bell, Activity } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface MarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

interface PortfolioSummary {
  totalValue: number;
  dayChange: number;
  dayChangePercent: number;
  holdings: number;
}

export const DashboardHome = () => {
  const { user } = useAuth();
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [portfolioSummary, setPortfolioSummary] = useState<PortfolioSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    // Refresh data every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      // Fetch market overview
      const { data: marketOverview } = await supabase.functions.invoke('get-market-overview');
      if (marketOverview) {
        setMarketData(marketOverview.topStocks || []);
      }

      // Fetch portfolio analytics if user is logged in
      if (user) {
        const { data: portfolioData } = await supabase.functions.invoke('portfolio-analytics', {
          body: { userId: user.id }
        });
        if (portfolioData) {
          setPortfolioSummary({
            totalValue: portfolioData.totalValue || 0,
            dayChange: portfolioData.totalGainLoss || 0,
            dayChangePercent: portfolioData.totalGainLossPercent || 0,
            holdings: portfolioData.holdings?.length || 0
          });
        }
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const performanceData = [
    { month: 'Jan', portfolio: 95000, market: 98000 },
    { month: 'Feb', portfolio: 97000, market: 96000 },
    { month: 'Mar', portfolio: 102000, market: 101000 },
    { month: 'Apr', portfolio: 105000, market: 103000 },
    { month: 'May', portfolio: 108000, market: 105000 },
    { month: 'Jun', portfolio: 112000, market: 107000 },
  ];

  const assetAllocation = [
    { name: 'Stocks', value: 65, color: '#0088FE' },
    { name: 'Bonds', value: 20, color: '#00C49F' },
    { name: 'ETFs', value: 10, color: '#FFBB28' },
    { name: 'Cash', value: 5, color: '#FF8042' },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
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

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back{user ? `, ${user.email?.split('@')[0]}` : ''}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Here's your financial overview for today
          </p>
        </div>
        <Button variant="outline" size="sm">
          <Bell className="w-4 h-4 mr-2" />
          Alerts
        </Button>
      </div>

      {/* Portfolio Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center">
              <Wallet className="w-4 h-4 mr-2" />
              Portfolio Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{portfolioSummary?.totalValue.toLocaleString() || '0'}
            </div>
            <div className={`text-sm flex items-center ${
              (portfolioSummary?.dayChangePercent || 0) >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {(portfolioSummary?.dayChangePercent || 0) >= 0 ? (
                <TrendingUp className="w-3 h-3 mr-1" />
              ) : (
                <TrendingDown className="w-3 h-3 mr-1" />
              )}
              {portfolioSummary?.dayChangePercent?.toFixed(2) || '0.00'}% today
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center">
              <TrendingUp className="w-4 h-4 mr-2" />
              Day's Gain/Loss
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${
              (portfolioSummary?.dayChange || 0) >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              ₹{portfolioSummary?.dayChange?.toLocaleString() || '0'}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Since last close
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
              {portfolioSummary?.holdings || 0}
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
              Market Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              Open
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              NSE & BSE
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Portfolio Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Portfolio Performance
            </CardTitle>
            <CardDescription>
              Portfolio vs Market benchmark over 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`₹${value?.toLocaleString()}`, '']} />
                <Line 
                  type="monotone" 
                  dataKey="portfolio" 
                  stroke="#0088FE" 
                  strokeWidth={2}
                  name="Portfolio"
                />
                <Line 
                  type="monotone" 
                  dataKey="market" 
                  stroke="#82ca9d" 
                  strokeWidth={2}
                  name="Market"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Asset Allocation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Asset Allocation
            </CardTitle>
            <CardDescription>
              Current portfolio distribution
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={assetAllocation}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {assetAllocation.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Market Movers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            Top Market Movers
          </CardTitle>
          <CardDescription>
            Live market data - updates every 30 seconds
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {marketData.slice(0, 8).map((stock, index) => (
              <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{stock.symbol}</h3>
                  <Badge variant={stock.changePercent >= 0 ? "default" : "destructive"}>
                    {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent?.toFixed(2)}%
                  </Badge>
                </div>
                <div className="text-lg font-bold">₹{stock.price?.toFixed(2) || 'N/A'}</div>
                <div className={`text-sm ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stock.change >= 0 ? '+' : ''}₹{stock.change?.toFixed(2) || '0.00'}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex flex-col">
              <DollarSign className="w-6 h-6 mb-2" />
              Buy Stocks
            </Button>
            <Button variant="outline" className="h-20 flex flex-col">
              <BarChart3 className="w-6 h-6 mb-2" />
              View Analytics
            </Button>
            <Button variant="outline" className="h-20 flex flex-col">
              <Target className="w-6 h-6 mb-2" />
              Set Goals
            </Button>
            <Button variant="outline" className="h-20 flex flex-col">
              <Activity className="w-6 h-6 mb-2" />
              Paper Trade
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
