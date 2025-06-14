
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
import { TrendingUp, TrendingDown, Wallet, Target, Award, BookOpen, BarChart3, DollarSign, Activity } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

const PaperTrading = () => {
  const { toast } = useToast();
  const [virtualBalance, setVirtualBalance] = useState(100000);
  const [paperHoldings, setPaperHoldings] = useState<PaperHolding[]>([
    {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      quantity: 10,
      avgPrice: 150.00,
      currentPrice: 155.25,
      totalValue: 1552.50,
      gainLoss: 52.50,
      gainLossPercent: 3.50
    },
    {
      symbol: 'TSLA',
      name: 'Tesla Inc.',
      quantity: 5,
      avgPrice: 200.00,
      currentPrice: 195.80,
      totalValue: 979.00,
      gainLoss: -21.00,
      gainLossPercent: -2.10
    }
  ]);

  const [recentTrades, setRecentTrades] = useState<PaperTrade[]>([
    {
      id: '1',
      symbol: 'AAPL',
      name: 'Apple Inc.',
      type: 'buy',
      quantity: 10,
      price: 150.00,
      timestamp: new Date(Date.now() - 86400000),
      totalValue: 1500.00
    },
    {
      id: '2',
      symbol: 'TSLA',
      name: 'Tesla Inc.',
      type: 'buy',
      quantity: 5,
      price: 200.00,
      timestamp: new Date(Date.now() - 172800000),
      totalValue: 1000.00
    }
  ]);

  const [tradeForm, setTradeForm] = useState({
    symbol: '',
    quantity: '',
    orderType: 'market'
  });

  const [learningMetrics] = useState<LearningMetric[]>([
    {
      id: '1',
      title: 'First Trade',
      description: 'Execute your first paper trade',
      completed: true,
      points: 100
    },
    {
      id: '2',
      title: 'Portfolio Diversification',
      description: 'Hold 5 different stocks',
      completed: false,
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
    const mockPrice = 150 + Math.random() * 100; // Mock current price
    const totalValue = quantity * mockPrice;

    if (type === 'buy' && totalValue > virtualBalance) {
      toast({
        title: "Insufficient Balance",
        description: "Not enough virtual balance for this trade",
        variant: "destructive"
      });
      return;
    }

    const newTrade: PaperTrade = {
      id: Date.now().toString(),
      symbol: tradeForm.symbol.toUpperCase(),
      name: `${tradeForm.symbol.toUpperCase()} Corp`,
      type,
      quantity,
      price: mockPrice,
      timestamp: new Date(),
      totalValue
    };

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
                totalValue: (holding.quantity + quantity) * mockPrice,
                currentPrice: mockPrice
              }
            : holding
        ));
      } else {
        setPaperHoldings(prev => [...prev, {
          symbol: newTrade.symbol,
          name: newTrade.name,
          quantity,
          avgPrice: mockPrice,
          currentPrice: mockPrice,
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
              totalValue: Math.max(0, holding.quantity - quantity) * mockPrice
            }
          : holding
      ).filter(holding => holding.quantity > 0));
    }

    setTradeForm({ symbol: '', quantity: '', orderType: 'market' });
    
    toast({
      title: "Trade Executed",
      description: `${type.toUpperCase()} ${quantity} shares of ${newTrade.symbol} at ₹${mockPrice.toFixed(2)}`,
    });
  };

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

                <div className="flex space-x-2 pt-4">
                  <Button 
                    onClick={() => handleTrade('buy')} 
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    BUY
                  </Button>
                  <Button 
                    onClick={() => handleTrade('sell')} 
                    variant="destructive" 
                    className="flex-1"
                  >
                    SELL
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Market Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Market Overview</CardTitle>
                <CardDescription>Popular stocks for paper trading</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['AAPL', 'TSLA', 'NVDA', 'MSFT', 'GOOGL'].map((symbol, index) => (
                    <div key={symbol} className="flex items-center justify-between p-3 rounded-lg border">
                      <div>
                        <div className="font-medium">{symbol}</div>
                        <div className="text-sm text-gray-500">Technology</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">₹{(150 + index * 25).toFixed(2)}</div>
                        <div className={`text-sm ${index % 2 === 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {index % 2 === 0 ? '+' : '-'}{(Math.random() * 3).toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
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
