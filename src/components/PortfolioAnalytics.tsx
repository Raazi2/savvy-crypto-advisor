
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart, 
  BarChart3, 
  Shield, 
  RefreshCw,
  AlertTriangle,
  Target,
  Zap
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { LineChart, Line, AreaChart, Area, PieChart as RechartsPieChart, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface Holding {
  id: string;
  symbol: string;
  asset_type: string;
  quantity: number;
  avg_cost: number;
  current_price: number;
  current_value: number;
  gain_loss: number;
  gain_loss_percent: number;
}

interface AssetAllocation {
  type: string;
  value: number;
  percentage: number;
}

interface RiskMetrics {
  volatility: number;
  sharpeRatio: number;
  beta: number;
  maxDrawdown: number;
}

interface PerformanceData {
  date: string;
  value: number;
  change: number;
}

interface PortfolioData {
  totalValue: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
  holdings: Holding[];
  assetAllocation: AssetAllocation[];
  riskMetrics: RiskMetrics;
  performanceHistory: PerformanceData[];
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

export const PortfolioAnalytics = () => {
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchPortfolioAnalytics = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('portfolio-analytics', {
        body: { userId: user.id }
      });

      if (error) {
        console.error('Error fetching portfolio analytics:', error);
        toast({
          title: "Error",
          description: "Failed to fetch portfolio analytics",
          variant: "destructive",
        });
        return;
      }

      setPortfolioData(data);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to load portfolio data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolioAnalytics();
  }, [user]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercent = (percent: number) => {
    return `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Portfolio Analytics</h1>
            <p className="text-slate-400">Comprehensive analysis of your investment portfolio</p>
          </div>
          <RefreshCw className="w-6 h-6 animate-spin text-blue-400" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="backdrop-blur-xl bg-white/10 border border-white/20 animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-white/20 rounded mb-2"></div>
                <div className="h-8 bg-white/20 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!portfolioData) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <Card className="backdrop-blur-xl bg-white/10 border border-white/20">
          <CardContent className="p-12 text-center">
            <PieChart className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Portfolio Data</h3>
            <p className="text-slate-400 mb-4">Start building your portfolio to see analytics</p>
            <Button onClick={fetchPortfolioAnalytics} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getRiskLevel = (volatility: number) => {
    if (volatility < 10) return { level: 'Low', color: 'bg-green-500', textColor: 'text-green-400' };
    if (volatility < 20) return { level: 'Medium', color: 'bg-yellow-500', textColor: 'text-yellow-400' };
    return { level: 'High', color: 'bg-red-500', textColor: 'text-red-400' };
  };

  const riskLevel = getRiskLevel(portfolioData.riskMetrics.volatility);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Portfolio Analytics</h1>
          <p className="text-slate-400">Comprehensive analysis of your investment portfolio</p>
        </div>
        <Button onClick={fetchPortfolioAnalytics} variant="outline" className="bg-white/5 border-white/20">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="backdrop-blur-xl bg-white/10 border border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">Total Portfolio Value</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(portfolioData.totalValue)}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-white/10 border border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">Total Gain/Loss</p>
                <p className={`text-2xl font-bold ${portfolioData.totalGainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {formatCurrency(portfolioData.totalGainLoss)}
                </p>
                <p className={`text-sm ${portfolioData.totalGainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {formatPercent(portfolioData.totalGainLossPercent)}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${portfolioData.totalGainLoss >= 0 ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                {portfolioData.totalGainLoss >= 0 ? 
                  <TrendingUp className="w-6 h-6 text-green-400" /> : 
                  <TrendingDown className="w-6 h-6 text-red-400" />
                }
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-white/10 border border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">Risk Level</p>
                <p className={`text-2xl font-bold ${riskLevel.textColor}`}>{riskLevel.level}</p>
                <p className="text-sm text-slate-400">Volatility: {portfolioData.riskMetrics.volatility.toFixed(1)}%</p>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${riskLevel.color}/20`}>
                <Shield className="w-6 h-6" style={{ color: riskLevel.textColor.replace('text-', '') + '400' }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-white/10 border border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">Sharpe Ratio</p>
                <p className="text-2xl font-bold text-white">{portfolioData.riskMetrics.sharpeRatio.toFixed(2)}</p>
                <p className="text-sm text-slate-400">Risk-adjusted return</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Target className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid grid-cols-4 h-12 bg-white/10 border border-white/20">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="holdings">Holdings</TabsTrigger>
          <TabsTrigger value="allocation">Allocation</TabsTrigger>
          <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Chart */}
            <Card className="backdrop-blur-xl bg-white/10 border border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <BarChart3 className="w-5 h-5" />
                  Portfolio Performance (30 Days)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={portfolioData.performanceHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="date" stroke="rgba(255,255,255,0.6)" />
                    <YAxis stroke="rgba(255,255,255,0.6)" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.2)' }}
                      labelStyle={{ color: 'white' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#3B82F6" 
                      fill="url(#colorValue)" 
                      strokeWidth={2}
                    />
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Asset Allocation Pie Chart */}
            <Card className="backdrop-blur-xl bg-white/10 border border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <PieChart className="w-5 h-5" />
                  Asset Allocation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={portfolioData.assetAllocation}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ type, percentage }) => `${type}: ${percentage.toFixed(1)}%`}
                    >
                      {portfolioData.assetAllocation.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.2)' }}
                      formatter={(value: number) => [formatCurrency(value), 'Value']}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="holdings" className="space-y-6">
          <Card className="backdrop-blur-xl bg-white/10 border border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Individual Holdings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {portfolioData.holdings.map((holding) => (
                  <div key={holding.id} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {holding.symbol.slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{holding.symbol}</h3>
                        <p className="text-sm text-slate-400 capitalize">{holding.asset_type}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-semibold text-white">{formatCurrency(holding.current_value)}</p>
                      <p className={`text-sm ${holding.gain_loss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {formatPercent(holding.gain_loss_percent)}
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-sm text-slate-400">Qty: {holding.quantity}</p>
                      <p className="text-sm text-slate-400">Avg: {formatCurrency(holding.avg_cost)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="allocation" className="space-y-6">
          <Card className="backdrop-blur-xl bg-white/10 border border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Asset Allocation Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {portfolioData.assetAllocation.map((asset, index) => (
                  <div key={asset.type} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        ></div>
                        <span className="text-white font-medium capitalize">{asset.type}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-semibold">{formatCurrency(asset.value)}</p>
                        <p className="text-sm text-slate-400">{asset.percentage.toFixed(1)}%</p>
                      </div>
                    </div>
                    <Progress value={asset.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="backdrop-blur-xl bg-white/10 border border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <AlertTriangle className="w-5 h-5" />
                  Risk Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Volatility</span>
                  <span className="text-white font-semibold">{portfolioData.riskMetrics.volatility.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Sharpe Ratio</span>
                  <span className="text-white font-semibold">{portfolioData.riskMetrics.sharpeRatio.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Beta</span>
                  <span className="text-white font-semibold">{portfolioData.riskMetrics.beta.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Max Drawdown</span>
                  <span className="text-red-400 font-semibold">{portfolioData.riskMetrics.maxDrawdown.toFixed(2)}%</span>
                </div>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-xl bg-white/10 border border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Zap className="w-5 h-5" />
                  Risk Assessment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <h4 className="font-semibold text-blue-400 mb-2">Portfolio Risk Level</h4>
                  <Badge className={`${riskLevel.color} text-white`}>
                    {riskLevel.level} Risk
                  </Badge>
                  <p className="text-sm text-slate-400 mt-2">
                    Based on volatility and historical performance metrics.
                  </p>
                </div>
                
                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                  <h4 className="font-semibold text-green-400 mb-2">Recommendations</h4>
                  <ul className="text-sm text-slate-400 space-y-1">
                    <li>• Consider diversifying across more asset classes</li>
                    <li>• Monitor volatility levels regularly</li>
                    <li>• Review risk tolerance periodically</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
