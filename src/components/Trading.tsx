
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, TrendingDown, DollarSign, Target, Clock, BarChart3, Activity } from "lucide-react";

const watchlist = [
  { symbol: "AAPL", name: "Apple Inc.", price: 185.43, change: +2.34, changePercent: +1.28, volume: "45.2M" },
  { symbol: "TSLA", name: "Tesla Inc.", price: 245.67, change: -5.43, changePercent: -2.16, volume: "38.7M" },
  { symbol: "NVDA", name: "NVIDIA Corp.", price: 485.23, change: +12.56, changePercent: +2.66, volume: "52.1M" },
  { symbol: "MSFT", name: "Microsoft Corp.", price: 365.12, change: +3.78, changePercent: +1.05, volume: "29.8M" },
  { symbol: "BTC-USD", name: "Bitcoin", price: 42350.67, change: +1250.34, changePercent: +3.04, volume: "2.1B" }
];

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

const marketData = [
  { index: "S&P 500", value: "4,567.89", change: "+23.45", changePercent: "+0.51%" },
  { index: "NASDAQ", value: "14,234.56", change: "+87.32", changePercent: "+0.62%" },
  { index: "DOW", value: "35,678.12", change: "-12.34", changePercent: "-0.03%" },
  { index: "VIX", value: "18.45", change: "-1.23", changePercent: "-6.26%" }
];

export const Trading = () => {
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
        </div>
      </div>

      {/* Market Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {marketData.map((market, index) => (
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
        ))}
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
                    <Input placeholder="Enter symbol (e.g., AAPL)" />
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
                    <Select>
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
                    <Input type="number" placeholder="Number of shares" />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Price</label>
                    <Input type="number" placeholder="Limit price (optional)" />
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Estimated Cost</span>
                      <span className="font-semibold">$0.00</span>
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
                  <CardDescription>Popular stocks and trending symbols</CardDescription>
                </CardHeader>
                <CardContent>
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
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">Buy</Button>
                          <Button size="sm" variant="outline">Sell</Button>
                        </div>
                      </div>
                    ))}
                  </div>
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
                  <CardDescription>Stocks you're tracking</CardDescription>
                </div>
                <Button>Add Symbol</Button>
              </div>
            </CardHeader>
            <CardContent>
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
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">Buy</Button>
                        <Button size="sm" variant="outline">Chart</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
