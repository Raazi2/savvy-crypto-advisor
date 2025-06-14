
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, TrendingDown, DollarSign, Target, Clock, BarChart3, Activity, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
}

interface MarketData {
  index: string;
  value: string;
  change: string;
  changePercent: string;
}

const positions = [
  { symbol: "AAPL", shares: 100, avgPrice: 175.50, currentPrice: 185.43, pnl: +993.00, pnlPercent: +5.66 },
  { symbol: "TSLA", shares: 50, avgPrice: 255.30, currentPrice: 245.67, pnl: -481.50, pnlPercent: -3.77 },
  { symbol: "NVDA", shares: 25, avgPrice: 420.75, currentPrice: 485.23, pnl: +1612.00, pnlPercent: +15.33 }
];

const recentTrades = [
  { symbol: "AAPL", type: "BUY", shares: 50, price: 182.50, time: "10:30 AM", status: "Filled" },
  { symbol: "TSLA", type: "SELL", shares: 25, price: 248.75, time: "09:45 AM", status: "Filled" },
  { symbol: "NVDA", type: "BUY", shares: 10, price: 478.25, time: "09:15 AM", status: "Filled" },
  { symbol: "MSFT", type: "BUY", shares: 30, price: 362.80, time: "Yesterday", status: "Filled" }
];

export const Trading = () => {
  const [watchlist, setWatchlist] = useState<StockData[]>([]);
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [symbol, setSymbol] = useState("");
  const [orderType, setOrderType] = useState("market");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchAllData();
    // Refresh data every 30 seconds
    const interval = setInterval(fetchAllData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchAllData = async () => {
    setRefreshing(true);
    try {
      await Promise.all([fetchWatchlist(), fetchMarketOverview()]);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch market data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchWatchlist = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('get-watchlist');
      
      if (error) throw error;
      
      setWatchlist(data || []);
    } catch (error) {
      console.error('Error fetching watchlist:', error);
    }
  };

  const fetchMarketOverview = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('get-market-overview');
      
      if (error) throw error;
      
      setMarketData(data || []);
    } catch (error) {
      console.error('Error fetching market overview:', error);
    }
  };

  const fetchStockData = async (stockSymbol: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('get-stock-data', {
        body: { symbol: stockSymbol }
      });
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error fetching stock data:', error);
      toast({
        title: "Error",
        description: `Failed to fetch data for ${stockSymbol}`,
        variant: "destructive",
      });
      return null;
    }
  };

  const handleQuickTrade = async (stockSymbol: string, action: 'buy' | 'sell') => {
    const stockData = await fetchStockData(stockSymbol);
    if (stockData) {
      toast({
        title: `${action.toUpperCase()} Order`,
        description: `Ready to ${action} ${stockSymbol} at $${stockData.price.toFixed(2)}`,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Trading Dashboard</h2>
          <p className="text-slate-600 dark:text-slate-400">Execute trades and monitor your positions</p>
        </div>
        <div className="flex space-x-2">
          <Badge variant="outline" className="text-green-600">Market Open</Badge>
          <Badge variant="outline">NYSE: 9:30 AM - 4:00 PM EST</Badge>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchAllData}
            disabled={refreshing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Market Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {loading ? (
          // Loading skeleton
          [...Array(4)].map((_, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="animate-pulse">
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
                  <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded mb-1"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          marketData.map((market, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{market.index}</p>
                    <p className="text-lg font-bold">{market.value}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-semibold ${market.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                      {market.change}
                    </p>
                    <p className={`text-xs ${market.changePercent.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                      {market.changePercent}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Tabs defaultValue="trade" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="trade">Trade</TabsTrigger>
          <TabsTrigger value="positions">Positions</TabsTrigger>
          <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="trade" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Place Order</CardTitle>
                  <CardDescription>Buy or sell stocks and crypto</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Symbol</label>
                    <Input 
                      placeholder="Enter symbol (e.g., AAPL)" 
                      value={symbol}
                      onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="default" className="bg-green-600 hover:bg-green-700">
                      BUY
                    </Button>
                    <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">
                      SELL
                    </Button>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Order Type</label>
                    <Select value={orderType} onValueChange={setOrderType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Market Order" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="market">Market Order</SelectItem>
                        <SelectItem value="limit">Limit Order</SelectItem>
                        <SelectItem value="stop">Stop Order</SelectItem>
                        <SelectItem value="stop-limit">Stop-Limit Order</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Quantity</label>
                    <Input 
                      type="number" 
                      placeholder="Number of shares" 
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Price</label>
                    <Input 
                      type="number" 
                      placeholder="Limit price (optional)" 
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Estimated Cost</span>
                      <span className="font-semibold">
                        ${quantity && price ? (parseFloat(quantity) * parseFloat(price)).toFixed(2) : '0.00'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm mb-4">
                      <span>Buying Power</span>
                      <span className="font-semibold text-green-600">$25,480.50</span>
                    </div>
                    <Button className="w-full">Review Order</Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Trade</CardTitle>
                  <CardDescription>Popular stocks with live prices</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="animate-pulse p-4 border rounded-lg">
                          <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
                          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
                          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded"></div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {watchlist.slice(0, 4).map((stock, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                          <div>
                            <div className="font-semibold">{stock.symbol}</div>
                            <div className="text-sm text-slate-600 dark:text-slate-400">{stock.name}</div>
                            <div className="text-lg font-bold">${stock.price.toFixed(2)}</div>
                            <div className={`text-sm ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                            </div>
                          </div>
                          <div className="flex flex-col space-y-2">
                            <Button 
                              size="sm" 
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleQuickTrade(stock.symbol, 'buy')}
                            >
                              Buy
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleQuickTrade(stock.symbol, 'sell')}
                            >
                              Sell
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="positions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Current Positions</CardTitle>
              <CardDescription>Your active stock and crypto holdings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {positions.map((position, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div>
                        <div className="font-semibold text-lg">{position.symbol}</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          {position.shares} shares @ ${position.avgPrice.toFixed(2)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">${position.currentPrice.toFixed(2)}</div>
                      <div className={`text-sm font-semibold ${position.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {position.pnl >= 0 ? '+' : ''}${position.pnl.toFixed(2)} ({position.pnlPercent >= 0 ? '+' : ''}{position.pnlPercent.toFixed(2)}%)
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">Add</Button>
                      <Button size="sm" variant="outline" className="text-red-600">Sell</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="watchlist" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Watchlist</CardTitle>
                  <CardDescription>Stocks you're tracking with live prices</CardDescription>
                </div>
                <Button>Add Symbol</Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse p-4 border rounded-lg">
                      <div className="flex justify-between">
                        <div className="space-y-2">
                          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-16"></div>
                          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-24"></div>
                        </div>
                        <div className="space-y-2">
                          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-20"></div>
                          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-16"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {watchlist.map((stock, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div>
                          <div className="font-semibold">{stock.symbol}</div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">{stock.name}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-sm text-slate-600 dark:text-slate-400">Vol: {stock.volume}</div>
                        <div className="text-right">
                          <div className="font-bold">${stock.price.toFixed(2)}</div>
                          <div className={`text-sm ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleQuickTrade(stock.symbol, 'buy')}
                          >
                            Buy
                          </Button>
                          <Button size="sm" variant="outline">Chart</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Open Orders</CardTitle>
              <CardDescription>Pending and working orders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Target className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 dark:text-slate-400">No open orders</p>
                <p className="text-sm text-slate-500">Your pending orders will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Trade History</CardTitle>
              <CardDescription>Your recent trading activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentTrades.map((trade, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Badge variant={trade.type === 'BUY' ? 'default' : 'destructive'}>
                        {trade.type}
                      </Badge>
                      <div>
                        <div className="font-semibold">{trade.symbol}</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          {trade.shares} shares @ ${trade.price.toFixed(2)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-slate-600 dark:text-slate-400">{trade.time}</div>
                      <Badge variant="outline" className="text-green-600">{trade.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
