import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Wallet, Target, Award, BookOpen, BarChart3, DollarSign, Activity, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface PaperTrade {
  id: string;
  symbol: string;
  name: string;
  type: 'buy' | 'sell';
  quantity: number;
  price: number;
  timestamp: Date;
  totalValue: number;
}

interface PaperHolding {
  symbol: string;
  name: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  totalValue: number;
  gainLoss: number;
  gainLossPercent: number;
}

interface LearningMetric {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  points: number;
}

interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  high: number;
  low: number;
  open: number;
}

const PaperTrading = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const [virtualBalance, setVirtualBalance] = useState(100000);
  const [paperHoldings, setPaperHoldings] = useState<PaperHolding[]>([]);
  const [recentTrades, setRecentTrades] = useState<PaperTrade[]>([]);
  const [tradeForm, setTradeForm] = useState({
    symbol: '',
    quantity: '',
    orderType: 'market'
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch real-time market data
  const { data: marketData, isLoading: isLoadingMarket, refetch: refetchMarket } = useQuery({
    queryKey: ['market-data'],
    queryFn: async () => {
      console.log('Fetching market data...');
      const { data, error } = await supabase.functions.invoke('realtime-market-data', {
        body: { symbols: ['AAPL', 'TSLA', 'NVDA', 'MSFT', 'GOOGL', 'AMZN', 'META', 'NFLX'] }
      });
      
      if (error) {
        console.error('Error fetching market data:', error);
        throw error;
      }
      
      console.log('Market data received:', data);
      return data;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Load user's paper trading data
  const { data: userTradingData } = useQuery({
    queryKey: ['paper-trading', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('paper_trades')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching paper trading data:', error);
        return null;
      }
      
      return data;
    },
    enabled: !!user?.id,
  });

  // Save paper trade mutation
  const saveTradeMutation = useMutation({
    mutationFn: async (trade: Omit<PaperTrade, 'id'>) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('paper_trades')
        .insert([{
          user_id: user.id,
          symbol: trade.symbol,
          name: trade.name,
          type: trade.type,
          quantity: trade.quantity,
          price: trade.price,
          total_value: trade.totalValue,
          created_at: new Date().toISOString()
        }]);
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['paper-trading', user?.id] });
      toast({
        title: "Trade Saved",
        description: "Your paper trade has been recorded successfully",
      });
    },
  });

  const [learningMetrics] = useState<LearningMetric[]>([
    {
      id: '1',
      title: 'First Trade',
      description: 'Execute your first paper trade',
      completed: recentTrades.length > 0,
      points: 100
    },
    {
      id: '2',
      title: 'Portfolio Diversification',
      description: 'Hold 5 different stocks',
      completed: paperHoldings.length >= 5,
      points: 250
    },
    {
      id: '3',
      title: 'Risk Management',
      description: 'Set stop-loss orders',
      completed: false,
      points: 200
    },
    {
      id: '4',
      title: 'Profitable Week',
      description: 'Achieve positive returns for 7 days',
      completed: false,
      points: 300
    }
  ]);

  // Update holdings with real-time prices
  useEffect(() => {
    if (marketData?.stocks && paperHoldings.length > 0) {
      const updatedHoldings = paperHoldings.map(holding => {
        const stockData = marketData.stocks.find((stock: StockData) => stock.symbol === holding.symbol);
        if (stockData) {
          const currentPrice = stockData.price;
          const totalValue = holding.quantity * currentPrice;
          const gainLoss = totalValue - (holding.quantity * holding.avgPrice);
          const gainLossPercent = ((currentPrice - holding.avgPrice) / holding.avgPrice) * 100;
          
          return {
            ...holding,
            currentPrice,
            totalValue,
            gainLoss,
            gainLossPercent
          };
        }
        return holding;
      });
      
      setPaperHoldings(updatedHoldings);
    }
  }, [marketData]);

  const getCurrentPrice = (symbol: string): number => {
    if (marketData?.stocks) {
      const stock = marketData.stocks.find((s: StockData) => s.symbol === symbol);
      return stock?.price || 0;
    }
    return 150 + Math.random() * 100; // Fallback mock price
  };

  const getStockName = (symbol: string): string => {
    if (marketData?.stocks) {
      const stock = marketData.stocks.find((s: StockData) => s.symbol === symbol);
      return stock?.name || `${symbol} Inc.`;
    }
    return `${symbol} Inc.`;
  };

  const handleTrade = (type: 'buy' | 'sell') => {
    if (!tradeForm.symbol || !tradeForm.quantity) {
      toast({
        title: "Invalid Trade",
        description: "Please enter symbol and quantity",
        variant: "destructive"
      });
      return;
    }

    const quantity = parseInt(tradeForm.quantity);
    const currentPrice = getCurrentPrice(tradeForm.symbol.toUpperCase());
    const totalValue = quantity * currentPrice;

    if (type === 'buy' && totalValue > virtualBalance) {
      toast({
        title: "Insufficient Balance",
        description: "Not enough virtual balance for this trade",
        variant: "destructive"
      });
      return;
    }

    // Check if selling more than owned
    if (type === 'sell') {
      const existingHolding = paperHoldings.find(h => h.symbol === tradeForm.symbol.toUpperCase());
      if (!existingHolding || existingHolding.quantity < quantity) {
        toast({
          title: "Insufficient Holdings",
          description: "You don't have enough shares to sell",
          variant: "destructive"
        });
        return;
      }
    }

    const newTrade: PaperTrade = {
      id: Date.now().toString(),
      symbol: tradeForm.symbol.toUpperCase(),
      name: getStockName(tradeForm.symbol.toUpperCase()),
      type,
      quantity,
      price: currentPrice,
      timestamp: new Date(),
      totalValue
    };

    // Save to database
    saveTradeMutation.mutate(newTrade);

    setRecentTrades(prev => [newTrade, ...prev.slice(0, 9)]);

    if (type === 'buy') {
      setVirtualBalance(prev => prev - totalValue);
      
      // Update holdings
      const existingHolding = paperHoldings.find(h => h.symbol === newTrade.symbol);
      if (existingHolding) {
        setPaperHoldings(prev => prev.map(holding =>
          holding.symbol === newTrade.symbol
            ? {
                ...holding,
                quantity: holding.quantity + quantity,
                avgPrice: ((holding.avgPrice * holding.quantity) + totalValue) / (holding.quantity + quantity),
                totalValue: (holding.quantity + quantity) * currentPrice,
                currentPrice
              }
            : holding
        ));
      } else {
        setPaperHoldings(prev => [...prev, {
          symbol: newTrade.symbol,
          name: newTrade.name,
          quantity,
          avgPrice: currentPrice,
          currentPrice: currentPrice,
          totalValue,
          gainLoss: 0,
          gainLossPercent: 0
        }]);
      }
    } else {
      setVirtualBalance(prev => prev + totalValue);
      
      // Update holdings for sell
      setPaperHoldings(prev => prev.map(holding =>
        holding.symbol === newTrade.symbol
          ? {
              ...holding,
              quantity: Math.max(0, holding.quantity - quantity),
              totalValue: Math.max(0, holding.quantity - quantity) * currentPrice,
              currentPrice
            }
          : holding
      ).filter(holding => holding.quantity > 0));
    }

    setTradeForm({ symbol: '', quantity: '', orderType: 'market' });
    
    toast({
      title: "Trade Executed",
      description: `${type.toUpperCase()} ${quantity} shares of ${newTrade.symbol} at ₹${currentPrice.toFixed(2)}`,
    });
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetchMarket();
    setIsRefreshing(false);
    toast({
      title: "Data Refreshed",
      description: "Market data has been updated",
    });
  };

  const performanceData = [
    { date: '2024-01-01', value: 100000 },
    { date: '2024-01-02', value: 101200 },
    { date: '2024-01-03', value: 99800 },
    { date: '2024-01-04', value: 102500 },
    { date: '2024-01-05', value: 101800 },
    { date: '2024-01-06', value: 103200 },
    { date: '2024-01-07', value: 102900 }
  ];

  const totalPortfolioValue = virtualBalance + paperHoldings.reduce((sum, holding) => sum + holding.totalValue, 0);
  const totalGainLoss = totalPortfolioValue - 100000;
  const totalGainLossPercent = (totalGainLoss / 100000) * 100;

  const allocationData = paperHoldings.map((holding, index) => ({
    name: holding.symbol,
    value: holding.totalValue,
    color: ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00'][index % 5]
  }));

  const completedPoints = learningMetrics.filter(m => m.completed).reduce((sum, m) => sum + m.points, 0);
  const totalPoints = learningMetrics.reduce((sum, m) => sum + m.points, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Paper Trading
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Practice trading with virtual money and real market prices
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Button 
            onClick={handleRefresh} 
            disabled={isRefreshing}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <div className="text-right">
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              ₹{totalPortfolioValue.toLocaleString()}
            </div>
            <div className={`text-sm flex items-center ${totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {totalGainLoss >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
              ₹{Math.abs(totalGainLoss).toLocaleString()} ({totalGainLossPercent.toFixed(2)}%)
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Virtual Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{virtualBalance.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Available for trading</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{paperHoldings.reduce((sum, h) => sum + h.totalValue, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Invested amount</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Holdings</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{paperHoldings.length}</div>
            <p className="text-xs text-muted-foreground">Different stocks</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Learning Points</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedPoints}</div>
            <p className="text-xs text-muted-foreground">of {totalPoints} points</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="trade" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="trade">Trade</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="learning">Learning</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="trade" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Trading Panel */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="w-5 h-5 mr-2" />
                  Place Order
                </CardTitle>
                <CardDescription>
                  Execute virtual trades with real market prices
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="symbol">Stock Symbol</Label>
                  <Input
                    id="symbol"
                    placeholder="e.g., AAPL, TSLA"
                    value={tradeForm.symbol}
                    onChange={(e) => setTradeForm(prev => ({ ...prev, symbol: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    placeholder="Number of shares"
                    value={tradeForm.quantity}
                    onChange={(e) => setTradeForm(prev => ({ ...prev, quantity: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="orderType">Order Type</Label>
                  <Select value={tradeForm.orderType} onValueChange={(value) => setTradeForm(prev => ({ ...prev, orderType: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="market">Market Order</SelectItem>
                      <SelectItem value="limit">Limit Order</SelectItem>
                      <SelectItem value="stop">Stop Order</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {tradeForm.symbol && (
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Current Price</div>
                    <div className="text-lg font-bold">₹{getCurrentPrice(tradeForm.symbol.toUpperCase()).toFixed(2)}</div>
                  </div>
                )}

                <div className="flex space-x-2 pt-4">
                  <Button 
                    onClick={() => handleTrade('buy')} 
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    disabled={saveTradeMutation.isPending}
                  >
                    BUY
                  </Button>
                  <Button 
                    onClick={() => handleTrade('sell')} 
                    variant="destructive" 
                    className="flex-1"
                    disabled={saveTradeMutation.isPending}
                  >
                    SELL
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Market Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Live Market Data</CardTitle>
                <CardDescription>Real-time stock prices</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingMarket ? (
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="animate-pulse bg-gray-200 dark:bg-gray-700 h-16 rounded"></div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {marketData?.stocks?.slice(0, 5).map((stock: StockData) => (
                      <div key={stock.symbol} className="flex items-center justify-between p-3 rounded-lg border">
                        <div>
                          <div className="font-medium">{stock.symbol}</div>
                          <div className="text-sm text-gray-500">{stock.name}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">₹{stock.price.toFixed(2)}</div>
                          <div className={`text-sm ${stock.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="portfolio" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Holdings Table */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Current Holdings</CardTitle>
                  <CardDescription>Your paper trading portfolio</CardDescription>
                </CardHeader>
                <CardContent>
                  {paperHoldings.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Symbol</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Avg Price</TableHead>
                          <TableHead>Current</TableHead>
                          <TableHead>Value</TableHead>
                          <TableHead>P&L</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paperHoldings.map((holding) => (
                          <TableRow key={holding.symbol}>
                            <TableCell className="font-medium">{holding.symbol}</TableCell>
                            <TableCell>{holding.quantity}</TableCell>
                            <TableCell>₹{holding.avgPrice.toFixed(2)}</TableCell>
                            <TableCell>₹{holding.currentPrice.toFixed(2)}</TableCell>
                            <TableCell>₹{holding.totalValue.toLocaleString()}</TableCell>
                            <TableCell>
                              <span className={holding.gainLoss >= 0 ? 'text-green-600' : 'text-red-600'}>
                                ₹{holding.gainLoss.toFixed(2)} ({holding.gainLossPercent.toFixed(2)}%)
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No holdings yet. Start by making your first trade!
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Portfolio Allocation */}
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Allocation</CardTitle>
              </CardHeader>
              <CardContent>
                {allocationData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={allocationData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {allocationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Value']} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    No data to display
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Performance</CardTitle>
              <CardDescription>Track your paper trading progress over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Portfolio Value']} />
                  <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="learning" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="w-5 h-5 mr-2" />
                Learning Metrics
              </CardTitle>
              <CardDescription>
                Complete challenges to improve your trading skills
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm text-gray-500">{completedPoints}/{totalPoints} points</span>
                </div>
                <Progress value={(completedPoints / totalPoints) * 100} className="w-full" />
              </div>

              <div className="space-y-4 mt-6">
                {learningMetrics.map((metric) => (
                  <div key={metric.id} className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        metric.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                      }`}>
                        {metric.completed ? '✓' : '○'}
                      </div>
                      <div>
                        <div className="font-medium">{metric.title}</div>
                        <div className="text-sm text-gray-500">{metric.description}</div>
                      </div>
                    </div>
                    <Badge variant={metric.completed ? "default" : "secondary"}>
                      {metric.points} pts
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Trade History</CardTitle>
              <CardDescription>Your recent paper trading activity</CardDescription>
            </CardHeader>
            <CardContent>
              {recentTrades.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Symbol</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentTrades.map((trade) => (
                      <TableRow key={trade.id}>
                        <TableCell>{trade.timestamp.toLocaleDateString()}</TableCell>
                        <TableCell className="font-medium">{trade.symbol}</TableCell>
                        <TableCell>
                          <Badge variant={trade.type === 'buy' ? 'default' : 'destructive'}>
                            {trade.type.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>{trade.quantity}</TableCell>
                        <TableCell>₹{trade.price.toFixed(2)}</TableCell>
                        <TableCell>₹{trade.totalValue.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No trades yet. Start trading to see your history!
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PaperTrading;
