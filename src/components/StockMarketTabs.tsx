
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Globe, IndianRupee, Bitcoin, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { IndianMarketDashboard } from './IndianMarketDashboard';
import { Trading } from './Trading';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CryptoData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  rank: number;
}

export const StockMarketTabs = () => {
  const { toast } = useToast();
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [cryptoLoading, setCryptoLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchCryptoData = async () => {
    try {
      setCryptoLoading(true);
      const { data, error } = await supabase.functions.invoke('crypto-market-data', {
        body: { 
          symbols: ['bitcoin', 'ethereum', 'binancecoin', 'cardano', 'solana', 'polkadot'],
          limit: 6 
        }
      });

      if (error) throw error;

      const cryptos: CryptoData[] = data.cryptos.map((crypto: any) => ({
        symbol: crypto.symbol.toUpperCase(),
        name: crypto.name,
        price: crypto.price,
        change: crypto.change,
        changePercent: crypto.changePercent,
        volume: crypto.volume,
        marketCap: crypto.marketCap,
        rank: crypto.rank
      }));

      setCryptoData(cryptos);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching crypto data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch cryptocurrency data",
        variant: "destructive"
      });
    } finally {
      setCryptoLoading(false);
    }
  };

  useEffect(() => {
    fetchCryptoData();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchCryptoData, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };

  const formatVolume = (vol: number) => {
    if (vol >= 1e9) return `${(vol / 1e9).toFixed(2)}B`;
    if (vol >= 1e6) return `${(vol / 1e6).toFixed(2)}M`;
    if (vol >= 1e3) return `${(vol / 1e3).toFixed(2)}K`;
    return vol.toString();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Global Markets
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Trade across global markets with real-time data
          </p>
        </div>
      </div>

      <Tabs defaultValue="indian-market" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="indian-market" className="flex items-center">
            <IndianRupee className="w-4 h-4 mr-2" />
            Indian Market
          </TabsTrigger>
          <TabsTrigger value="us-market" className="flex items-center">
            <Globe className="w-4 h-4 mr-2" />
            US Market
          </TabsTrigger>
          <TabsTrigger value="crypto" className="flex items-center">
            <Bitcoin className="w-4 h-4 mr-2" />
            Cryptocurrency
          </TabsTrigger>
          <TabsTrigger value="commodities" className="flex items-center">
            <TrendingUp className="w-4 h-4 mr-2" />
            Commodities
          </TabsTrigger>
        </TabsList>

        <TabsContent value="indian-market">
          <IndianMarketDashboard />
        </TabsContent>

        <TabsContent value="us-market">
          <Trading />
        </TabsContent>

        <TabsContent value="crypto">
          <div className="space-y-6">
            {/* Crypto Trading Component */}
            <Trading assetType="crypto" />
            
            {/* Popular Cryptocurrencies Overview */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Bitcoin className="w-5 h-5 mr-2" />
                    <div>
                      <CardTitle>Popular Cryptocurrencies</CardTitle>
                      <CardDescription>
                        Real-time prices and market data
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {lastUpdate && (
                      <span className="text-sm text-gray-500">
                        Updated: {lastUpdate.toLocaleTimeString()}
                      </span>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={fetchCryptoData}
                      disabled={cryptoLoading}
                    >
                      <RefreshCw className={`w-4 h-4 ${cryptoLoading ? 'animate-spin' : ''}`} />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {cryptoLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                      <Card key={i} className="animate-pulse">
                        <CardContent className="p-4">
                          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                          <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
                          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {cryptoData.map((crypto) => (
                      <Card key={crypto.symbol} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-400 to-yellow-500 flex items-center justify-center">
                                <span className="text-white font-semibold text-sm">
                                  {crypto.symbol.slice(0, 2)}
                                </span>
                              </div>
                              <div>
                                <h3 className="font-semibold text-lg">{crypto.symbol}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{crypto.name}</p>
                              </div>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              #{crypto.rank}
                            </Badge>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-2xl font-bold">
                                ${crypto.price.toFixed(crypto.price < 1 ? 6 : 2)}
                              </span>
                              <div className={`flex items-center space-x-1 ${
                                crypto.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {crypto.changePercent >= 0 ? 
                                  <TrendingUp className="w-4 h-4" /> : 
                                  <TrendingDown className="w-4 h-4" />
                                }
                                <span className="font-medium">
                                  {crypto.changePercent >= 0 ? '+' : ''}{crypto.changePercent.toFixed(2)}%
                                </span>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <div>
                                <span className="block text-xs">Market Cap</span>
                                <span className="font-medium">{formatNumber(crypto.marketCap)}</span>
                              </div>
                              <div>
                                <span className="block text-xs">24h Volume</span>
                                <span className="font-medium">{formatVolume(crypto.volume)}</span>
                              </div>
                            </div>
                            
                            <div className="flex space-x-2 mt-3">
                              <Button size="sm" className="flex-1">
                                Trade {crypto.symbol}
                              </Button>
                              <Button size="sm" variant="outline">
                                Details
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="commodities">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Commodities Market
              </CardTitle>
              <CardDescription>
                Track precious metals and commodity prices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { symbol: 'GOLD', name: 'Gold', price: 62500, change: 0.5, unit: '₹/10g' },
                  { symbol: 'SILVER', name: 'Silver', price: 75000, change: -0.8, unit: '₹/kg' },
                  { symbol: 'CRUDE', name: 'Crude Oil', price: 6800, change: 1.2, unit: '₹/barrel' },
                  { symbol: 'COPPER', name: 'Copper', price: 720, change: -0.3, unit: '₹/kg' },
                  { symbol: 'ZINC', name: 'Zinc', price: 240, change: 0.7, unit: '₹/kg' },
                  { symbol: 'NICKEL', name: 'Nickel', price: 1850, change: -1.1, unit: '₹/kg' }
                ].map((commodity) => (
                  <Card key={commodity.symbol}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{commodity.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{commodity.unit}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">₹{commodity.price.toLocaleString()}</p>
                          <Badge variant={commodity.change >= 0 ? "default" : "destructive"}>
                            {commodity.change >= 0 ? '+' : ''}{commodity.change}%
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
