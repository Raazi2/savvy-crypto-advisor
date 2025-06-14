
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Activity, RefreshCw, Zap, BarChart3 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  volatility: number;
  sentimentScore: number;
  technicalIndicators: {
    rsi: number;
    macd: number;
    sma_20: number;
    sma_50: number;
  };
}

interface MarketOverview {
  totalStocks: number;
  avgChangePercent: number;
  avgVolatility: number;
  avgSentiment: number;
  topGainers: StockData[];
  topLosers: StockData[];
  mostVolatile: StockData[];
}

export const RealTimeMarketDashboard = () => {
  const { toast } = useToast();
  const [marketData, setMarketData] = useState<StockData[]>([]);
  const [marketOverview, setMarketOverview] = useState<MarketOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchMarketData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('realtime-market-data', {
        body: { symbols: [], includeOptions: false }
      });

      if (error) throw error;

      setMarketData(data.stocks);
      setMarketOverview(data.marketOverview);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching market data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch real-time market data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketData();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchMarketData, 30000);
    return () => clearInterval(interval);
  }, []);

  const getSentimentColor = (score: number) => {
    if (score > 70) return 'text-green-600';
    if (score > 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSentimentLabel = (score: number) => {
    if (score > 70) return 'Bullish';
    if (score > 40) return 'Neutral';
    return 'Bearish';
  };

  if (loading && !marketData.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            Real-Time Market Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Real-Time Market Dashboard
            </div>
            <div className="flex items-center space-x-2">
              {lastUpdate && (
                <span className="text-sm text-gray-500">
                  Last update: {lastUpdate.toLocaleTimeString()}
                </span>
              )}
              <Button onClick={fetchMarketData} disabled={loading} variant="outline" size="sm">
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </CardTitle>
          <CardDescription>
            Live market data with AI-powered sentiment analysis
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Market Overview */}
      {marketOverview && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Market Change</p>
                  <p className={`text-lg font-bold ${
                    marketOverview.avgChangePercent >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {marketOverview.avgChangePercent >= 0 ? '+' : ''}{marketOverview.avgChangePercent.toFixed(2)}%
                  </p>
                </div>
                {marketOverview.avgChangePercent >= 0 ? (
                  <TrendingUp className="w-6 h-6 text-green-600" />
                ) : (
                  <TrendingDown className="w-6 h-6 text-red-600" />
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Volatility</p>
                  <p className="text-lg font-bold">{marketOverview.avgVolatility.toFixed(2)}%</p>
                </div>
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Market Sentiment</p>
                  <p className={`text-lg font-bold ${getSentimentColor(marketOverview.avgSentiment)}`}>
                    {getSentimentLabel(marketOverview.avgSentiment)}
                  </p>
                </div>
                <Zap className={`w-6 h-6 ${getSentimentColor(marketOverview.avgSentiment)}`} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Stocks</p>
                  <p className="text-lg font-bold">{marketOverview.totalStocks}</p>
                </div>
                <Activity className="w-6 h-6 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Top Movers */}
      {marketOverview && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-green-600">Top Gainers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {marketOverview.topGainers.map((stock) => (
                  <div key={stock.symbol} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{stock.symbol}</p>
                      <p className="text-sm text-gray-600">${stock.price.toFixed(2)}</p>
                    </div>
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      +{stock.changePercent.toFixed(2)}%
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">Top Losers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {marketOverview.topLosers.map((stock) => (
                  <div key={stock.symbol} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{stock.symbol}</p>
                      <p className="text-sm text-gray-600">${stock.price.toFixed(2)}</p>
                    </div>
                    <Badge variant="destructive">
                      {stock.changePercent.toFixed(2)}%
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-blue-600">Most Volatile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {marketOverview.mostVolatile.map((stock) => (
                  <div key={stock.symbol} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{stock.symbol}</p>
                      <p className="text-sm text-gray-600">${stock.price.toFixed(2)}</p>
                    </div>
                    <Badge variant="secondary">
                      {stock.volatility.toFixed(2)}%
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Detailed Stock Data */}
      <Card>
        <CardHeader>
          <CardTitle>Live Stock Data</CardTitle>
          <CardDescription>
            Real-time prices with technical indicators and sentiment analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Symbol</th>
                  <th className="text-left p-2">Price</th>
                  <th className="text-left p-2">Change</th>
                  <th className="text-left p-2">Volume</th>
                  <th className="text-left p-2">RSI</th>
                  <th className="text-left p-2">Sentiment</th>
                </tr>
              </thead>
              <tbody>
                {marketData.map((stock) => (
                  <tr key={stock.symbol} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="p-2">
                      <div>
                        <p className="font-medium">{stock.symbol}</p>
                        <p className="text-sm text-gray-600">{stock.name}</p>
                      </div>
                    </td>
                    <td className="p-2 font-bold">${stock.price.toFixed(2)}</td>
                    <td className="p-2">
                      <Badge variant={stock.changePercent >= 0 ? "default" : "destructive"}>
                        {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                      </Badge>
                    </td>
                    <td className="p-2">{stock.volume.toLocaleString()}</td>
                    <td className="p-2">
                      <span className={`font-medium ${
                        stock.technicalIndicators.rsi > 70 ? 'text-red-600' :
                        stock.technicalIndicators.rsi < 30 ? 'text-green-600' : 'text-gray-600'
                      }`}>
                        {stock.technicalIndicators.rsi.toFixed(1)}
                      </span>
                    </td>
                    <td className="p-2">
                      <span className={getSentimentColor(stock.sentimentScore)}>
                        {getSentimentLabel(stock.sentimentScore)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
