
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, TrendingUp, TrendingDown, DollarSign, PieChart, Calendar, Download, RefreshCw } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell, Pie } from "recharts";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface AnalyticsData {
  totalValue: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
  holdings: any[];
  assetAllocation: any[];
  performanceHistory: any[];
  riskMetrics: {
    volatility: number;
    sharpeRatio: number;
    beta: number;
    maxDrawdown: number;
  };
  bestPerformer?: {
    symbol: string;
    gainLossPercent: number;
  };
}

export const AnalyticsReports = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAnalyticsData();
    }
  }, [user]);

  const fetchAnalyticsData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('portfolio-analytics', {
        body: { userId: user.id }
      });

      if (error) throw error;

      // Process the data for analytics
      const processedData: AnalyticsData = {
        totalValue: data?.totalValue || 0,
        totalGainLoss: data?.totalGainLoss || 0,
        totalGainLossPercent: data?.totalGainLossPercent || 0,
        holdings: data?.holdings || [],
        assetAllocation: data?.assetAllocation || [],
        performanceHistory: data?.performanceHistory || [],
        riskMetrics: data?.riskMetrics || {
          volatility: 0,
          sharpeRatio: 0,
          beta: 1.0,
          maxDrawdown: 0
        }
      };

      // Find best performer
      if (processedData.holdings.length > 0) {
        const bestPerformer = processedData.holdings.reduce((best, holding) => {
          return (holding.gain_loss_percent > (best?.gain_loss_percent || -Infinity)) ? holding : best;
        }, null);
        
        if (bestPerformer) {
          processedData.bestPerformer = {
            symbol: bestPerformer.symbol,
            gainLossPercent: bestPerformer.gain_loss_percent
          };
        }
      }

      setAnalyticsData(processedData);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch analytics data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const exportReport = () => {
    if (!analyticsData) return;

    const reportData = {
      generatedAt: new Date().toISOString(),
      portfolioValue: analyticsData.totalValue,
      totalReturn: analyticsData.totalGainLossPercent,
      holdings: analyticsData.holdings.length,
      riskMetrics: analyticsData.riskMetrics
    };

    const dataStr = JSON.stringify(reportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `portfolio-report-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();

    toast({
      title: "Report Exported",
      description: "Portfolio report has been downloaded successfully"
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Analytics & Reports</h2>
            <p className="text-slate-600 dark:text-slate-400">Detailed performance analysis and insights</p>
          </div>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Analytics & Reports</h2>
            <p className="text-slate-600 dark:text-slate-400">No portfolio data available</p>
          </div>
          <Button onClick={fetchAnalyticsData}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Data
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Analytics & Reports</h2>
          <p className="text-slate-600 dark:text-slate-400">Detailed performance analysis and insights</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchAnalyticsData} variant="outline">
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={exportReport} className="bg-blue-600 hover:bg-blue-700">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="allocation">Allocation</TabsTrigger>
          <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Return</CardTitle>
                {analyticsData.totalGainLossPercent >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${analyticsData.totalGainLossPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {analyticsData.totalGainLossPercent >= 0 ? '+' : ''}{analyticsData.totalGainLossPercent.toFixed(2)}%
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {analyticsData.totalGainLoss >= 0 ? '+' : ''}₹{analyticsData.totalGainLoss.toLocaleString()} total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
                <DollarSign className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{analyticsData.totalValue.toLocaleString()}</div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {analyticsData.holdings.length} holdings
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Best Performer</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analyticsData.bestPerformer?.symbol || 'N/A'}
                </div>
                <p className={`text-xs ${(analyticsData.bestPerformer?.gainLossPercent || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {analyticsData.bestPerformer ? 
                    `${analyticsData.bestPerformer.gainLossPercent >= 0 ? '+' : ''}${analyticsData.bestPerformer.gainLossPercent.toFixed(2)}%` : 
                    'No data'
                  }
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sharpe Ratio</CardTitle>
                <BarChart3 className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.riskMetrics.sharpeRatio.toFixed(2)}</div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {analyticsData.riskMetrics.sharpeRatio > 1 ? 'Excellent' : 
                   analyticsData.riskMetrics.sharpeRatio > 0.5 ? 'Good' : 'Fair'} risk-adjusted return
                </p>
              </CardContent>
            </Card>
          </div>

          {analyticsData.performanceHistory.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Performance</CardTitle>
                <CardDescription>Historical performance overview</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analyticsData.performanceHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Portfolio Value']} />
                    <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          {analyticsData.holdings.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Holdings Performance</CardTitle>
                <CardDescription>Individual holding returns</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData.holdings}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="symbol" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${Number(value).toFixed(2)}%`, 'Return']} />
                    <Bar dataKey="gain_loss_percent" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="allocation" className="space-y-6">
          {analyticsData.assetAllocation.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Asset Allocation</CardTitle>
                <CardDescription>Current portfolio distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={analyticsData.assetAllocation}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="percentage"
                      nameKey="type"
                      label={({ type, percentage }) => `${type}: ${percentage.toFixed(1)}%`}
                    >
                      {analyticsData.assetAllocation.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? '#3b82f6' : '#10b981'} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  {analyticsData.assetAllocation.map((item) => (
                    <div key={item.type} className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.type === 'stock' ? '#3b82f6' : '#10b981' }}
                      ></div>
                      <span className="text-sm">{item.type}: {item.percentage.toFixed(1)}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="risk" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Risk Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Beta</span>
                  <span className="font-bold">{analyticsData.riskMetrics.beta.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Sharpe Ratio</span>
                  <span className={`font-bold ${analyticsData.riskMetrics.sharpeRatio > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {analyticsData.riskMetrics.sharpeRatio.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Volatility</span>
                  <span className="font-bold">{analyticsData.riskMetrics.volatility.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Max Drawdown</span>
                  <span className="font-bold text-red-600">{analyticsData.riskMetrics.maxDrawdown.toFixed(1)}%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-orange-600 mb-2">
                    {Math.min(10, Math.max(1, analyticsData.riskMetrics.volatility / 10)).toFixed(1)}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    {analyticsData.riskMetrics.volatility < 20 ? 'Low Risk' : 
                     analyticsData.riskMetrics.volatility < 50 ? 'Moderate Risk' : 'High Risk'}
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mt-4">
                    <div 
                      className="bg-orange-600 h-2 rounded-full" 
                      style={{ width: `${Math.min(100, analyticsData.riskMetrics.volatility)}%` }}
                    ></div>
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
