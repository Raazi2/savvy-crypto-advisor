import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Activity, DollarSign, BarChart3, RefreshCw, Globe, ExternalLink, ShoppingCart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useSettings } from '@/hooks/useSettings';

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

interface Order {
  id: string;
  symbol: string;
  type: 'buy' | 'sell';
  quantity: number;
  price: number;
  status: 'pending' | 'executed' | 'cancelled';
  timestamp: string;
}

interface Broker {
  id: string;
  name: string;
  logo: string;
  deepLinkTemplate: string;
  webLinkTemplate: string;
  brokerage: string;
  features: string[];
}

const INDIAN_BROKERS: Broker[] = [
  {
    id: 'zerodha',
    name: 'Zerodha',
    logo: '🟢',
    deepLinkTemplate: 'kite://orders/buy?tradingsymbol={symbol}&exchange=NSE&quantity={quantity}',
    webLinkTemplate: 'https://kite.zerodha.com/?symbol={symbol}',
    brokerage: '₹20 per order',
    features: ['Free delivery', 'Advanced charts', 'Kite API']
  },
  {
    id: 'angelone',
    name: 'Angel One',
    logo: '😇',
    deepLinkTemplate: 'angelone://trade?symbol={symbol}&quantity={quantity}&action=buy',
    webLinkTemplate: 'https://trade.angelone.in/trade?symbol={symbol}',
    brokerage: '₹20 per order',
    features: ['Free delivery', '4x margin', 'Research reports']
  },
  {
    id: 'upstox',
    name: 'Upstox',
    logo: '⬆️',
    deepLinkTemplate: 'upstox://trade?symbol={symbol}&quantity={quantity}',
    webLinkTemplate: 'https://pro.upstox.com/trade?symbol={symbol}',
    brokerage: '₹20 per order',
    features: ['Free delivery', '0.05% intraday', 'Mobile first']
  },
  {
    id: 'groww',
    name: 'Groww',
    logo: '🌱',
    deepLinkTemplate: 'groww://stocks/{symbol}',
    webLinkTemplate: 'https://groww.in/stocks/{symbol}',
    brokerage: '₹20 per order',
    features: ['Free delivery', 'Simple UI', 'Mutual funds']
  },
  {
    id: 'icici',
    name: 'ICICI Direct',
    logo: '🏦',
    deepLinkTemplate: 'icicidirect://trade?symbol={symbol}',
    webLinkTemplate: 'https://secure.icicidirect.com/trading/equity/stock_detail.aspx?Symbol={symbol}',
    brokerage: '₹25 per order',
    features: ['Research reports', 'IPO access', 'Banking integration']
  }
];

export const Trading = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { settings } = useSettings();
  const [selectedStock, setSelectedStock] = useState<StockData | null>(null);
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderForm, setOrderForm] = useState({
    symbol: '',
    type: 'buy' as 'buy' | 'sell',
    quantity: '',
    price: '',
    orderType: 'market' as 'market' | 'limit'
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [usdToInr, setUsdToInr] = useState(83.12);
  const [showBrokerComparison, setShowBrokerComparison] = useState(false);

  useEffect(() => {
    fetchTradingData();
    // Refresh data every 10 seconds for real-time trading
    const interval = setInterval(fetchTradingData, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchTradingData = async () => {
    try {
      setRefreshing(true);
      
      // Fetch US market data
      const usStocks = [
        { symbol: 'AAPL', name: 'Apple Inc', price: 175.43, change: 2.15, changePercent: 1.24 },
        { symbol: 'MSFT', name: 'Microsoft Corporation', price: 378.85, change: -1.23, changePercent: -0.32 },
        { symbol: 'GOOGL', name: 'Alphabet Inc', price: 138.21, change: 0.85, changePercent: 0.62 },
        { symbol: 'AMZN', name: 'Amazon.com Inc', price: 145.32, change: -2.18, changePercent: -1.48 },
        { symbol: 'TSLA', name: 'Tesla Inc', price: 242.64, change: 5.42, changePercent: 2.28 },
        { symbol: 'NVDA', name: 'NVIDIA Corporation', price: 875.28, change: 15.63, changePercent: 1.82 },
        { symbol: 'META', name: 'Meta Platforms Inc', price: 487.89, change: -3.45, changePercent: -0.70 },
        { symbol: 'NFLX', name: 'Netflix Inc', price: 445.67, change: 8.23, changePercent: 1.88 }
      ];

      const enhancedStocks = usStocks.map((stock) => ({
        ...stock,
        volume: Math.floor(Math.random() * 10000000) + 1000000,
        high: stock.price * (1 + Math.random() * 0.05),
        low: stock.price * (1 - Math.random() * 0.05),
        open: stock.price * (1 + (Math.random() - 0.5) * 0.02)
      }));

      setStockData(enhancedStocks);
      
      if (!selectedStock && enhancedStocks.length > 0) {
        setSelectedStock(enhancedStocks[0]);
      }

      // Mock orders data (in real app, fetch from database)
      setOrders([
        {
          id: '1',
          symbol: 'AAPL',
          type: 'buy',
          quantity: 10,
          price: 175.43,
          status: 'executed',
          timestamp: '2024-06-14T10:30:00Z'
        },
        {
          id: '2',
          symbol: 'TSLA',
          type: 'sell',
          quantity: 5,
          price: 242.64,
          status: 'pending',
          timestamp: '2024-06-14T11:15:00Z'
        }
      ]);

    } catch (error) {
      console.error('Error fetching trading data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch trading data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const formatCurrency = (amount: number, showInr: boolean = false): string => {
    const currency = settings?.preferences?.defaultCurrency || 'USD';
    
    if (currency === 'INR' || showInr) {
      const inrAmount = amount * usdToInr;
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2
      }).format(inrAmount);
    }
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to place orders",
        variant: "destructive"
      });
      return;
    }

    if (!orderForm.symbol || !orderForm.quantity) {
      toast({
        title: "Invalid Order",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      // In a real app, this would call an API to place the order
      const newOrder: Order = {
        id: Math.random().toString(36).substr(2, 9),
        symbol: orderForm.symbol,
        type: orderForm.type,
        quantity: parseInt(orderForm.quantity),
        price: orderForm.orderType === 'market' ? (selectedStock?.price || 0) : parseFloat(orderForm.price),
        status: 'pending',
        timestamp: new Date().toISOString()
      };

      setOrders(prev => [newOrder, ...prev]);
      
      toast({
        title: "Order Placed",
        description: `${orderForm.type.toUpperCase()} order for ${orderForm.quantity} shares of ${orderForm.symbol} placed successfully`,
      });

      // Reset form
      setOrderForm({
        symbol: '',
        type: 'buy',
        quantity: '',
        price: '',
        orderType: 'market'
      });

    } catch (error) {
      console.error('Error placing order:', error);
      toast({
        title: "Error",
        description: "Failed to place order",
        variant: "destructive"
      });
    }
  };

  const handleBrokerRedirect = (broker: Broker, stock: StockData, quantity: number = 1) => {
    try {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      // Try deep link first on mobile
      if (isMobile) {
        const deepLink = broker.deepLinkTemplate
          .replace('{symbol}', stock.symbol)
          .replace('{quantity}', quantity.toString());
        
        // Try to open the app
        const link = document.createElement('a');
        link.href = deepLink;
        link.click();
        
        // Fallback to web after a delay
        setTimeout(() => {
          const webLink = broker.webLinkTemplate.replace('{symbol}', stock.symbol);
          window.open(webLink, '_blank');
        }, 2000);
      } else {
        // Open web version directly on desktop
        const webLink = broker.webLinkTemplate.replace('{symbol}', stock.symbol);
        window.open(webLink, '_blank');
      }

      // Track the redirect for analytics
      console.log(`Redirected to ${broker.name} for ${stock.symbol}`);
      
      toast({
        title: "Redirecting to Broker",
        description: `Opening ${broker.name} to trade ${stock.symbol}`,
      });

    } catch (error) {
      console.error('Error redirecting to broker:', error);
      toast({
        title: "Redirect Failed",
        description: "Unable to open broker application",
        variant: "destructive"
      });
    }
  };

  const getPreferredBroker = (): Broker => {
    const preferredBrokerId = settings?.preferences?.defaultBroker || 'zerodha';
    return INDIAN_BROKERS.find(broker => broker.id === preferredBrokerId) || INDIAN_BROKERS[0];
  };

  const chartData = selectedStock ? [
    { time: '09:30', price: selectedStock.open },
    { time: '10:00', price: selectedStock.open * 1.02 },
    { time: '11:00', price: selectedStock.open * 0.98 },
    { time: '12:00', price: selectedStock.price },
    { time: '13:00', price: selectedStock.price * 1.01 },
    { time: '14:00', price: selectedStock.price * 0.99 },
    { time: '16:00', price: selectedStock.price },
  ] : [];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-32"></div>
              </CardHeader>
              <CardContent>
                <div className="h-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <Globe className="w-8 h-8 mr-2" />
            US Stock Market
          </h1>
          <p className="text-gray-600 dark:text-gray-400 flex items-center">
            Real-time trading with live market data • USD to INR: ₹{usdToInr}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            onClick={() => setShowBrokerComparison(!showBrokerComparison)}
            variant="outline"
            size="sm"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Compare Brokers
          </Button>
          <Button 
            onClick={fetchTradingData} 
            disabled={refreshing}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Broker Comparison Panel */}
      {showBrokerComparison && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ShoppingCart className="w-5 h-5 mr-2" />
              Broker Comparison
            </CardTitle>
            <CardDescription>
              Choose your preferred broker for executing trades
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {INDIAN_BROKERS.map((broker) => (
                <div key={broker.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{broker.logo}</span>
                      <h3 className="font-semibold">{broker.name}</h3>
                    </div>
                    <Badge variant="outline">{broker.brokerage}</Badge>
                  </div>
                  <div className="space-y-2 mb-4">
                    {broker.features.map((feature, index) => (
                      <div key={index} className="text-sm text-gray-600 dark:text-gray-400">
                        • {feature}
                      </div>
                    ))}
                  </div>
                  {selectedStock && (
                    <Button 
                      onClick={() => handleBrokerRedirect(broker, selectedStock, 1)}
                      className="w-full"
                      size="sm"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Trade on {broker.name}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stock List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              US Stocks
            </CardTitle>
            <CardDescription>
              Live NYSE & NASDAQ prices
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-96 overflow-y-auto">
              {stockData.map((stock) => (
                <div
                  key={stock.symbol}
                  className={`p-4 border-b cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                    selectedStock?.symbol === stock.symbol ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                  onClick={() => setSelectedStock(stock)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{stock.symbol}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {stock.name}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{formatCurrency(stock.price)}</div>
                      <div className="text-xs text-gray-500">{formatCurrency(stock.price, true)}</div>
                      <div className={`text-sm flex items-center ${
                        stock.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stock.changePercent >= 0 ? (
                          <TrendingUp className="w-3 h-3 mr-1" />
                        ) : (
                          <TrendingDown className="w-3 h-3 mr-1" />
                        )}
                        {stock.changePercent?.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Stock Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                {selectedStock?.symbol} - {selectedStock?.name}
              </div>
              <Badge variant={selectedStock && selectedStock.changePercent >= 0 ? "default" : "destructive"}>
                {selectedStock?.changePercent >= 0 ? '+' : ''}{selectedStock?.changePercent?.toFixed(2)}%
              </Badge>
            </CardTitle>
            <CardDescription>
              Intraday price movement (Eastern Time)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedStock && (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Current Price</p>
                    <p className="text-lg font-bold">{formatCurrency(selectedStock.price)}</p>
                    <p className="text-xs text-gray-500">{formatCurrency(selectedStock.price, true)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Day High</p>
                    <p className="text-lg font-bold text-green-600">{formatCurrency(selectedStock.high)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Day Low</p>
                    <p className="text-lg font-bold text-red-600">{formatCurrency(selectedStock.low)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Volume</p>
                    <p className="text-lg font-bold">{selectedStock.volume.toLocaleString()}</p>
                  </div>
                </div>

                {/* Quick Buy Buttons */}
                <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-lg">
                  <h3 className="font-semibold mb-3 flex items-center">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Quick Trade on Your Broker
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      onClick={() => handleBrokerRedirect(getPreferredBroker(), selectedStock, 1)}
                      className="bg-green-600 hover:bg-green-700"
                      size="sm"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Buy 1 Share
                    </Button>
                    <Button 
                      onClick={() => handleBrokerRedirect(getPreferredBroker(), selectedStock, 5)}
                      variant="outline"
                      size="sm"
                    >
                      Buy 5 Shares
                    </Button>
                    <Button 
                      onClick={() => handleBrokerRedirect(getPreferredBroker(), selectedStock, 10)}
                      variant="outline"
                      size="sm"
                    >
                      Buy 10 Shares
                    </Button>
                    <Button 
                      onClick={() => setShowBrokerComparison(true)}
                      variant="ghost"
                      size="sm"
                    >
                      Choose Broker
                    </Button>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                    Redirects to {getPreferredBroker().name} • Change in Settings
                  </p>
                </div>

                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis domain={['dataMin - 5', 'dataMax + 5']} />
                    <Tooltip formatter={(value) => [`$${value}`, 'Price']} />
                    <Line 
                      type="monotone" 
                      dataKey="price" 
                      stroke={selectedStock.changePercent >= 0 ? "#22c55e" : "#ef4444"}
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="place-order" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="place-order">Place Order</TabsTrigger>
          <TabsTrigger value="order-history">Order History</TabsTrigger>
        </TabsList>

        <TabsContent value="place-order">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                Place US Stock Order
              </CardTitle>
              <CardDescription>
                Place buy or sell orders for US stocks (NYSE & NASDAQ)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="symbol">Stock Symbol</Label>
                  <Select value={orderForm.symbol} onValueChange={(value) => 
                    setOrderForm(prev => ({ ...prev, symbol: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select stock" />
                    </SelectTrigger>
                    <SelectContent>
                      {stockData.map((stock) => (
                        <SelectItem key={stock.symbol} value={stock.symbol}>
                          {stock.symbol} - ${stock.price.toFixed(2)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="type">Order Type</Label>
                  <Select value={orderForm.type} onValueChange={(value: 'buy' | 'sell') => 
                    setOrderForm(prev => ({ ...prev, type: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="buy">Buy</SelectItem>
                      <SelectItem value="sell">Sell</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    type="number"
                    value={orderForm.quantity}
                    onChange={(e) => setOrderForm(prev => ({ ...prev, quantity: e.target.value }))}
                    placeholder="Enter quantity"
                  />
                </div>

                <div>
                  <Label htmlFor="orderType">Price Type</Label>
                  <Select value={orderForm.orderType} onValueChange={(value: 'market' | 'limit') => 
                    setOrderForm(prev => ({ ...prev, orderType: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="market">Market Price</SelectItem>
                      <SelectItem value="limit">Limit Price</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {orderForm.orderType === 'limit' && (
                  <div>
                    <Label htmlFor="price">Limit Price ($)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={orderForm.price}
                      onChange={(e) => setOrderForm(prev => ({ ...prev, price: e.target.value }))}
                      placeholder="Enter price in USD"
                    />
                  </div>
                )}
              </div>

              <Button 
                onClick={handlePlaceOrder} 
                className="w-full mt-6"
                variant={orderForm.type === 'buy' ? 'default' : 'destructive'}
              >
                Place {orderForm.type.toUpperCase()} Order
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="order-history">
          <Card>
            <CardHeader>
              <CardTitle>Order History</CardTitle>
              <CardDescription>
                Your recent US stock trading orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Symbol</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price (USD)</TableHead>
                    <TableHead>Price (INR)</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.symbol}</TableCell>
                      <TableCell>
                        <Badge variant={order.type === 'buy' ? 'default' : 'destructive'}>
                          {order.type.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>{order.quantity}</TableCell>
                      <TableCell>${order.price.toFixed(2)}</TableCell>
                      <TableCell>₹{(order.price * usdToInr).toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            order.status === 'executed' ? 'default' : 
                            order.status === 'pending' ? 'secondary' : 'destructive'
                          }
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(order.timestamp).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
