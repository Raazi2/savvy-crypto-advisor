
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import { TrendingUp, TrendingDown, Activity, BarChart3, Target, AlertTriangle } from 'lucide-react';

interface TechnicalIndicators {
  rsi: number;
  macd: number;
  signal: number;
  sma20: number;
  sma50: number;
  bollinger: {
    upper: number;
    middle: number;
    lower: number;
  };
  volume: number;
  recommendation: 'BUY' | 'SELL' | 'HOLD';
}

interface ChartData {
  time: string;
  price: number;
  volume: number;
  high: number;
  low: number;
  open: number;
  sma20: number;
  sma50: number;
  rsi: number;
}

interface TechnicalAnalysisProps {
  symbol: string;
  currentPrice: number;
}

export const TechnicalAnalysis: React.FC<TechnicalAnalysisProps> = ({ symbol, currentPrice }) => {
  const [indicators, setIndicators] = useState<TechnicalIndicators | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '3M' | '1Y'>('1M');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateTechnicalData();
  }, [symbol, timeframe]);

  const generateTechnicalData = () => {
    setLoading(true);
    
    // Generate mock technical data (in real app, fetch from API)
    const periods = timeframe === '1D' ? 24 : timeframe === '1W' ? 7 : timeframe === '1M' ? 30 : timeframe === '3M' ? 90 : 365;
    const data: ChartData[] = [];
    
    for (let i = 0; i < periods; i++) {
      const basePrice = currentPrice * (1 + (Math.random() - 0.5) * 0.2);
      const volatility = 0.02;
      const price = basePrice * (1 + (Math.random() - 0.5) * volatility);
      
      data.push({
        time: timeframe === '1D' ? `${i}:00` : `Day ${i + 1}`,
        price: price,
        volume: Math.floor(Math.random() * 1000000) + 100000,
        high: price * (1 + Math.random() * 0.05),
        low: price * (1 - Math.random() * 0.05),
        open: price * (1 + (Math.random() - 0.5) * 0.02),
        sma20: price * (1 + (Math.random() - 0.5) * 0.01),
        sma50: price * (1 + (Math.random() - 0.5) * 0.02),
        rsi: 30 + Math.random() * 40 // RSI between 30-70
      });
    }
    
    setChartData(data);
    
    // Generate technical indicators
    const rsi = 45 + Math.random() * 20; // 45-65 range
    const macd = (Math.random() - 0.5) * 2;
    const signal = macd * (0.8 + Math.random() * 0.4);
    
    const recommendation: 'BUY' | 'SELL' | 'HOLD' = 
      rsi > 60 && macd > signal ? 'BUY' : 
      rsi < 40 && macd < signal ? 'SELL' : 'HOLD';
    
    setIndicators({
      rsi,
      macd,
      signal,
      sma20: currentPrice * (1 + (Math.random() - 0.5) * 0.02),
      sma50: currentPrice * (1 + (Math.random() - 0.5) * 0.05),
      bollinger: {
        upper: currentPrice * 1.05,
        middle: currentPrice,
        lower: currentPrice * 0.95
      },
      volume: Math.floor(Math.random() * 5000000) + 1000000,
      recommendation
    });
    
    setLoading(false);
  };

  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case 'BUY': return 'bg-green-100 text-green-800 border-green-300';
      case 'SELL': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    }
  };

  const getRSISignal = (rsi: number) => {
    if (rsi > 70) return { signal: 'Overbought', color: 'text-red-600' };
    if (rsi < 30) return { signal: 'Oversold', color: 'text-green-600' };
    return { signal: 'Neutral', color: 'text-gray-600' };
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Technical Analysis - {symbol}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-100 animate-pulse rounded"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Technical Analysis - {symbol}
            </div>
            {indicators && (
              <Badge className={getRecommendationColor(indicators.recommendation)}>
                {indicators.recommendation}
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            Advanced technical indicators and chart patterns
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Timeframe Selector */}
          <div className="flex space-x-2 mb-6">
            {(['1D', '1W', '1M', '3M', '1Y'] as const).map((tf) => (
              <Button
                key={tf}
                variant={timeframe === tf ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeframe(tf)}
              >
                {tf}
              </Button>
            ))}
          </div>

          <Tabs defaultValue="price" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="price">Price Chart</TabsTrigger>
              <TabsTrigger value="volume">Volume</TabsTrigger>
              <TabsTrigger value="rsi">RSI</TabsTrigger>
              <TabsTrigger value="indicators">All Indicators</TabsTrigger>
            </TabsList>

            <TabsContent value="price">
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis domain={['dataMin - 5', 'dataMax + 5']} />
                  <Tooltip formatter={(value, name) => [`$${Number(value).toFixed(2)}`, name]} />
                  <Line type="monotone" dataKey="price" stroke="#2563eb" strokeWidth={2} name="Price" />
                  <Line type="monotone" dataKey="sma20" stroke="#f59e0b" strokeWidth={1} strokeDasharray="5 5" name="SMA 20" />
                  <Line type="monotone" dataKey="sma50" stroke="#ef4444" strokeWidth={1} strokeDasharray="5 5" name="SMA 50" />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>

            <TabsContent value="volume">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip formatter={(value) => [Number(value).toLocaleString(), 'Volume']} />
                  <Bar dataKey="volume" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>

            <TabsContent value="rsi">
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip formatter={(value) => [Number(value).toFixed(2), 'RSI']} />
                  <Area type="monotone" dataKey="rsi" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                  {/* RSI Reference Lines */}
                  <Line y={70} stroke="#ef4444" strokeDasharray="3 3" />
                  <Line y={30} stroke="#22c55e" strokeDasharray="3 3" />
                </AreaChart>
              </ResponsiveContainer>
            </TabsContent>

            <TabsContent value="indicators">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {indicators && (
                  <>
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold mb-2 flex items-center">
                        <Activity className="w-4 h-4 mr-2" />
                        RSI (14)
                      </h3>
                      <div className="text-2xl font-bold">{indicators.rsi.toFixed(2)}</div>
                      <div className={`text-sm ${getRSISignal(indicators.rsi).color}`}>
                        {getRSISignal(indicators.rsi).signal}
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold mb-2">MACD</h3>
                      <div className="text-2xl font-bold">{indicators.macd.toFixed(3)}</div>
                      <div className="text-sm text-gray-600">
                        Signal: {indicators.signal.toFixed(3)}
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold mb-2">Moving Averages</h3>
                      <div className="space-y-1">
                        <div>SMA 20: ${indicators.sma20.toFixed(2)}</div>
                        <div>SMA 50: ${indicators.sma50.toFixed(2)}</div>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold mb-2">Bollinger Bands</h3>
                      <div className="space-y-1 text-sm">
                        <div>Upper: ${indicators.bollinger.upper.toFixed(2)}</div>
                        <div>Middle: ${indicators.bollinger.middle.toFixed(2)}</div>
                        <div>Lower: ${indicators.bollinger.lower.toFixed(2)}</div>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold mb-2">Volume</h3>
                      <div className="text-lg font-bold">
                        {indicators.volume.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">Average Daily</div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold mb-2 flex items-center">
                        <Target className="w-4 h-4 mr-2" />
                        Recommendation
                      </h3>
                      <Badge className={getRecommendationColor(indicators.recommendation)}>
                        {indicators.recommendation}
                      </Badge>
                    </div>
                  </>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
