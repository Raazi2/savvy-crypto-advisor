
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
import { TrendingUp, TrendingDown, Activity, DollarSign, BarChart3, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

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

export const Trading = () => {
  const { user } = useAuth();
  const { toast } = useToast();
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

  useEffect(() => {
    fetchTradingData();
    // Refresh data every 10 seconds for real-time trading
    const interval = setInterval(fetchTradingData, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchTradingData = async () => {
    try {
      setRefreshing(true);
      
      // Fetch market data
      const { data: marketData } = await supabase.functions.invoke('get-market-overview');
      if (marketData?.topStocks) {
        const enhancedStocks = marketData.topStocks.map((stock: any) => ({
          ...stock,
          name: getStockName(stock.symbol),
          volume: Math.floor(Math.random() * 1000000) + 100000,
          high: stock.price * (1 + Math.random() * 0.05),
          low: stock.price * (1 - Math.random() * 0.05),
          open: stock.price * (1 + (Math.random() - 0.5) * 0.02)
        }));
        setStockData(enhancedStocks);
        
        if (!selectedStock && enhancedStocks.length > 0) {
          setSelectedStock(enhancedStocks[0]);
        }
      }

      // Mock orders data (in real app, fetch from database)
      setOrders([
        {
          id: '1',
          symbol: 'RELIANCE',
          type: 'buy',
          quantity: 10,
          price: 2450.50,
          status: 'executed',
          timestamp: '2024-06-14T10:30:00Z'
        },
        {
          id: '2',
          symbol: 'TCS',
          type: 'sell',
          quantity: 5,
          price: 3650.75,
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

  const getStockName = (symbol: string): string => {
    const names: { [key: string]: string } = {
      'RELIANCE': 'Reliance Industries Ltd',
      'TCS': 'Tata Consultancy Services',
      'HDFCBANK': 'HDFC Bank Limited',
      'INFY': 'Infosys Limited',
      'HINDUNILVR': 'Hindustan Unilever Ltd',
      'ITC': 'ITC Limited',
      'SBIN': 'State Bank of India',
      'BHARTIARTL': 'Bharti Airtel Limited'
    };
    return names[symbol] || symbol;
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

  const chartData = selectedStock ? [
    { time: '09:15', price: selectedStock.open },
    { time: '10:00', price: selectedStock.open * 1.02 },
    { time: '11:00', price: selectedStock.open * 0.98 },
    { time: '12:00', price: selectedStock.price },
    { time: '13:00', price: selectedStock.price * 1.01 },
    { time: '14:00', price: selectedStock.price * 0.99 },
    { time: '15:30', price: selectedStock.price },
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Live Trading</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Real-time trading with live market data
          </p>
        </div>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stock List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Market Stocks
            </CardTitle>
            <CardDescription>
              Live stock prices - updates every 10 seconds
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
                      <div className="font-bold">₹{stock.price?.toFixed(2)}</div>
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
              Intraday price movement
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedStock && (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Current Price</p>
                    <p className="text-lg font-bold">₹{selectedStock.price.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Day High</p>
                    <p className="text-lg font-bold text-green-600">₹{selectedStock.high.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Day Low</p>
                    <p className="text-lg font-bold text-red-600">₹{selectedStock.low.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Volume</p>
                    <p className="text-lg font-bold">{selectedStock.volume.toLocaleString()}</p>
                  </div>
                </div>

                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis domain={['dataMin - 10', 'dataMax + 10']} />
                    <Tooltip formatter={(value) => [`₹${value}`, 'Price']} />
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
                Place Order
              </CardTitle>
              <CardDescription>
                Place buy or sell orders for stocks
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
                          {stock.symbol} - ₹{stock.price.toFixed(2)}
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
                    <Label htmlFor="price">Limit Price</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={orderForm.price}
                      onChange={(e) => setOrderForm(prev => ({ ...prev, price: e.target.value }))}
                      placeholder="Enter price"
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
                Your recent trading orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Symbol</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
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
                      <TableCell>₹{order.price.toFixed(2)}</TableCell>
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
