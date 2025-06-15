
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  DollarSign, 
  Activity,
  RefreshCw,
  Star,
  Bell,
  Calculator
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { TechnicalAnalysis } from './TechnicalAnalysis';
import { FundamentalAnalysis } from './FundamentalAnalysis';
import { PriceAlerts } from './PriceAlerts';
import { BrokerageCalculator } from './BrokerageCalculator';

interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  high: number;
  low: number;
  marketCap: number;
}

interface Crypto {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  rank: number;
}

interface TradingProps {
  assetType?: 'stock' | 'crypto';
}

export const Trading: React.FC<TradingProps> = ({ assetType = 'stock' }) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<Stock | Crypto | null>(null);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [cryptos, setCryptos] = useState<Crypto[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchStockData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('realtime-market-data', {
        body: { 
          symbols: ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'NVDA', 'META', 'NFLX'], 
          includeOptions: false 
        }
      });

      if (error) throw error;

      const stockData: Stock[] = data.stocks.map((stock: any) => ({
        symbol: stock.symbol,
        name: stock.name,
        price: stock.price,
        change: stock.change,
        changePercent: stock.changePercent,
        volume: stock.volume,
        high: stock.high,
        low: stock.low,
        marketCap: stock.marketCap
      }));

      setStocks(stockData);
      if (!selectedAsset && stockData.length > 0) {
        setSelectedAsset(stockData[0]);
      }
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching stock data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch real-time stock data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCryptoData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('crypto-market-data', {
        body: { 
          symbols: ['bitcoin', 'ethereum', 'binancecoin', 'cardano', 'solana', 'polkadot'],
          limit: 6 
        }
      });

      if (error) throw error;

      const cryptoData: Crypto[] = data.cryptos.map((crypto: any) => ({
        symbol: crypto.symbol.toUpperCase(),
        name: crypto.name,
        price: crypto.price,
        change: crypto.change,
        changePercent: crypto.changePercent,
        volume: crypto.volume,
        marketCap: crypto.marketCap,
        rank: crypto.rank
      }));

      setCryptos(cryptoData);
      if (!selectedAsset && cryptoData.length > 0) {
        setSelectedAsset(cryptoData[0]);
      }
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching crypto data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch real-time crypto data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (assetType === 'crypto') {
      fetchCryptoData();
    } else {
      fetchStockData();
    }
  }, [assetType]);

  const filteredAssets = assetType === 'crypto' 
    ? cryptos.filter(crypto => 
        crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        crypto.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : stocks.filter(stock => 
        stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stock.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

  const refreshData = () => {
    if (assetType === 'crypto') {
      fetchCryptoData();
    } else {
      fetchStockData();
    }
  };

  if (loading && (stocks.length === 0 && cryptos.length === 0)) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <Card>
          <CardContent className="p-12 text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4 mx-auto"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4 mx-auto"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {assetType === 'crypto' ? 'Cryptocurrency Trading' : 'Stock Trading'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {assetType === 'crypto' 
              ? 'Trade cryptocurrencies with real-time market data' 
              : 'Trade stocks with real-time market data and advanced analysis'
            }
          </p>
          {lastUpdate && (
            <p className="text-sm text-gray-500 mt-1">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </p>
          )}
        </div>
        <Button onClick={refreshData} disabled={loading} variant="outline">
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Asset List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="w-5 h-5 mr-2" />
              {assetType === 'crypto' ? 'Cryptocurrencies' : 'Stocks'}
            </CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder={`Search ${assetType === 'crypto' ? 'cryptocurrencies' : 'stocks'}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-96 overflow-y-auto">
              {filteredAssets.map((asset) => (
                <div
                  key={asset.symbol}
                  className={`p-4 border-b cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 ${
                    selectedAsset?.symbol === asset.symbol ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                  onClick={() => setSelectedAsset(asset)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{asset.symbol}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{asset.name}</p>
                      {'rank' in asset && (
                        <p className="text-xs text-gray-500">Rank #{asset.rank}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-bold">
                        ${asset.price.toFixed(asset.price < 1 ? 6 : 2)}
                      </p>
                      <Badge variant={asset.changePercent >= 0 ? "default" : "destructive"}>
                        {asset.changePercent >= 0 ? '+' : ''}{asset.changePercent.toFixed(2)}%
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Trading Panel */}
        <div className="lg:col-span-2 space-y-6">
          {selectedAsset && (
            <>
              {/* Asset Overview */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl">{selectedAsset.symbol}</CardTitle>
                      <CardDescription>{selectedAsset.name}</CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Star className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Bell className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Current Price</p>
                      <p className="text-2xl font-bold">
                        ${selectedAsset.price.toFixed(selectedAsset.price < 1 ? 6 : 2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">24h Change</p>
                      <div className={`flex items-center ${
                        selectedAsset.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {selectedAsset.changePercent >= 0 ? 
                          <TrendingUp className="w-4 h-4 mr-1" /> : 
                          <TrendingDown className="w-4 h-4 mr-1" />
                        }
                        <span className="font-semibold">
                          {selectedAsset.changePercent >= 0 ? '+' : ''}{selectedAsset.changePercent.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Volume</p>
                      <p className="font-semibold">{selectedAsset.volume.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {assetType === 'crypto' ? 'Market Cap' : 'Market Cap'}
                      </p>
                      <p className="font-semibold">
                        ${(selectedAsset.marketCap / 1e9).toFixed(2)}B
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Analysis Tabs */}
              <Tabs defaultValue="technical" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="technical">Technical Analysis</TabsTrigger>
                  <TabsTrigger value="fundamental">Fundamental Analysis</TabsTrigger>
                  <TabsTrigger value="alerts">Price Alerts</TabsTrigger>
                  <TabsTrigger value="calculator">Brokerage</TabsTrigger>
                </TabsList>

                <TabsContent value="technical">
                  <TechnicalAnalysis 
                    symbol={selectedAsset.symbol} 
                    currentPrice={selectedAsset.price}
                  />
                </TabsContent>

                <TabsContent value="fundamental">
                  <FundamentalAnalysis 
                    symbol={selectedAsset.symbol}
                    currentPrice={selectedAsset.price}
                    companyName={selectedAsset.name}
                  />
                </TabsContent>

                <TabsContent value="alerts">
                  <PriceAlerts 
                    symbol={selectedAsset.symbol}
                    currentPrice={selectedAsset.price}
                    assetName={selectedAsset.name}
                  />
                </TabsContent>

                <TabsContent value="calculator">
                  <BrokerageCalculator 
                    symbol={selectedAsset.symbol}
                    currentPrice={selectedAsset.price}
                    assetType={assetType}
                  />
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
