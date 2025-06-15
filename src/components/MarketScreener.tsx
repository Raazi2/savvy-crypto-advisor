import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { 
  Search, 
  Filter, 
  TrendingUp, 
  TrendingDown,
  Star,
  Save,
  RefreshCw,
  BarChart3,
  Activity,
  DollarSign
} from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  volatility: number;
  sentimentScore: number;
  technicalIndicators: {
    rsi: number;
    macd: number;
    sma_20: number;
    sma_50: number;
  };
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
  volatility: number;
  totalSupply: number;
  circulatingSupply: number;
}

interface FilterState {
  sector: string;
  priceMin: number;
  priceMax: number;
  marketCap: string;
  volume: number;
  changeMin: number;
  changeMax: number;
  rsiMin: number;
  rsiMax: number;
}

interface CryptoFilterState {
  priceMin: number;
  priceMax: number;
  marketCapRank: string;
  volume: number;
  changeMin: number;
  changeMax: number;
  volatilityMin: number;
  volatilityMax: number;
}

export const MarketScreener = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [cryptoSearchTerm, setCryptoSearchTerm] = useState("");
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [cryptos, setCryptos] = useState<Crypto[]>([]);
  const [filteredStocks, setFilteredStocks] = useState<Stock[]>([]);
  const [filteredCryptos, setFilteredCryptos] = useState<Crypto[]>([]);
  const [loading, setLoading] = useState(true);
  const [cryptoLoading, setCryptoLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [cryptoLastUpdate, setCryptoLastUpdate] = useState<Date | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    sector: "all",
    priceMin: 0,
    priceMax: 10000,
    marketCap: "all",
    volume: 0,
    changeMin: -100,
    changeMax: 100,
    rsiMin: 0,
    rsiMax: 100,
  });
  const [cryptoFilters, setCryptoFilters] = useState<CryptoFilterState>({
    priceMin: 0,
    priceMax: 100000,
    marketCapRank: "all",
    volume: 0,
    changeMin: -100,
    changeMax: 100,
    volatilityMin: 0,
    volatilityMax: 100,
  });
  const [sortBy, setSortBy] = useState<string>("changePercent");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [cryptoSortBy, setCryptoSortBy] = useState<string>("marketCap");
  const [cryptoSortOrder, setCryptoSortOrder] = useState<"asc" | "desc">("desc");

  const fetchMarketData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('realtime-market-data', {
        body: { 
          symbols: ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'NVDA', 'META', 'NFLX', 'JPM', 'V', 'UNH', 'JNJ', 'XOM', 'BAC', 'PG', 'HD', 'CVX', 'ABBV', 'PFE', 'KO'], 
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
        marketCap: stock.marketCap,
        volatility: stock.volatility,
        sentimentScore: stock.sentimentScore,
        technicalIndicators: stock.technicalIndicators
      }));

      setStocks(stockData);
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

  const fetchCryptoData = async () => {
    try {
      setCryptoLoading(true);
      const { data, error } = await supabase.functions.invoke('crypto-market-data', {
        body: { 
          symbols: ['bitcoin', 'ethereum', 'binancecoin', 'cardano', 'solana', 'polkadot', 'dogecoin', 'avalanche-2', 'chainlink', 'polygon', 'uniswap', 'litecoin', 'bitcoin-cash', 'algorand', 'stellar', 'vechain', 'tron', 'eos', 'monero', 'aave'],
          limit: 20 
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
        rank: crypto.rank,
        volatility: crypto.volatility,
        totalSupply: crypto.totalSupply,
        circulatingSupply: crypto.circulatingSupply
      }));

      setCryptos(cryptoData);
      setCryptoLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching crypto data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch real-time crypto data",
        variant: "destructive"
      });
    } finally {
      setCryptoLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketData();
    fetchCryptoData();
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchMarketData();
      fetchCryptoData();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    applyFilters();
  }, [stocks, searchTerm, filters, sortBy, sortOrder]);

  useEffect(() => {
    applyCryptoFilters();
  }, [cryptos, cryptoSearchTerm, cryptoFilters, cryptoSortBy, cryptoSortOrder]);

  const applyFilters = () => {
    let filtered = [...stocks];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter((stock) =>
        stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stock.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Price filter
    filtered = filtered.filter(
      (stock) => stock.price >= filters.priceMin && stock.price <= filters.priceMax
    );

    // Market Cap filter
    if (filters.marketCap !== "all") {
      filtered = filtered.filter((stock) => {
        if (filters.marketCap === "large") {
          return stock.marketCap > 10000000000;
        } else if (filters.marketCap === "mid") {
          return stock.marketCap >= 2000000000 && stock.marketCap <= 10000000000;
        } else {
          return stock.marketCap < 2000000000;
        }
      });
    }

    // Volume filter
    filtered = filtered.filter((stock) => stock.volume >= filters.volume);

    // Change % filter
    filtered = filtered.filter(
      (stock) => stock.changePercent >= filters.changeMin && stock.changePercent <= filters.changeMax
    );

    // RSI filter
    filtered = filtered.filter(
      (stock) => stock.technicalIndicators.rsi >= filters.rsiMin && stock.technicalIndicators.rsi <= filters.rsiMax
    );

    // Sorting
    filtered.sort((a, b) => {
      let aValue: number, bValue: number;
      
      switch (sortBy) {
        case "price":
          aValue = a.price;
          bValue = b.price;
          break;
        case "changePercent":
          aValue = a.changePercent;
          bValue = b.changePercent;
          break;
        case "volume":
          aValue = a.volume;
          bValue = b.volume;
          break;
        case "marketCap":
          aValue = a.marketCap;
          bValue = b.marketCap;
          break;
        case "rsi":
          aValue = a.technicalIndicators.rsi;
          bValue = b.technicalIndicators.rsi;
          break;
        case "volatility":
          aValue = a.volatility;
          bValue = b.volatility;
          break;
        default:
          aValue = a.changePercent;
          bValue = b.changePercent;
      }
      
      return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
    });

    setFilteredStocks(filtered);
  };

  const applyCryptoFilters = () => {
    let filtered = [...cryptos];

    // Search filter
    if (cryptoSearchTerm) {
      filtered = filtered.filter((crypto) =>
        crypto.symbol.toLowerCase().includes(cryptoSearchTerm.toLowerCase()) ||
        crypto.name.toLowerCase().includes(cryptoSearchTerm.toLowerCase())
      );
    }

    // Price filter
    filtered = filtered.filter(
      (crypto) => crypto.price >= cryptoFilters.priceMin && crypto.price <= cryptoFilters.priceMax
    );

    // Market Cap Rank filter
    if (cryptoFilters.marketCapRank !== "all") {
      filtered = filtered.filter((crypto) => {
        if (cryptoFilters.marketCapRank === "top10") {
          return crypto.rank <= 10;
        } else if (cryptoFilters.marketCapRank === "top50") {
          return crypto.rank <= 50;
        } else if (cryptoFilters.marketCapRank === "top100") {
          return crypto.rank <= 100;
        }
        return true;
      });
    }

    // Volume filter
    filtered = filtered.filter((crypto) => crypto.volume >= cryptoFilters.volume);

    // Change % filter
    filtered = filtered.filter(
      (crypto) => crypto.changePercent >= cryptoFilters.changeMin && crypto.changePercent <= cryptoFilters.changeMax
    );

    // Volatility filter
    filtered = filtered.filter(
      (crypto) => crypto.volatility >= cryptoFilters.volatilityMin && crypto.volatility <= cryptoFilters.volatilityMax
    );

    // Sorting
    filtered.sort((a, b) => {
      let aValue: number, bValue: number;
      
      switch (cryptoSortBy) {
        case "price":
          aValue = a.price;
          bValue = b.price;
          break;
        case "changePercent":
          aValue = a.changePercent;
          bValue = b.changePercent;
          break;
        case "volume":
          aValue = a.volume;
          bValue = b.volume;
          break;
        case "marketCap":
          aValue = a.marketCap;
          bValue = b.marketCap;
          break;
        case "rank":
          aValue = a.rank;
          bValue = b.rank;
          break;
        case "volatility":
          aValue = a.volatility;
          bValue = b.volatility;
          break;
        default:
          aValue = a.marketCap;
          bValue = b.marketCap;
      }
      
      return cryptoSortOrder === "asc" ? aValue - bValue : bValue - aValue;
    });

    setFilteredCryptos(filtered);
  };

  const resetFilters = () => {
    setFilters({
      sector: "all",
      priceMin: 0,
      priceMax: 10000,
      marketCap: "all",
      volume: 0,
      changeMin: -100,
      changeMax: 100,
      rsiMin: 0,
      rsiMax: 100,
    });
    setSearchTerm("");
    setSortBy("changePercent");
    setSortOrder("desc");
  };

  const resetCryptoFilters = () => {
    setCryptoFilters({
      priceMin: 0,
      priceMax: 100000,
      marketCapRank: "all",
      volume: 0,
      changeMin: -100,
      changeMax: 100,
      volatilityMin: 0,
      volatilityMax: 100,
    });
    setCryptoSearchTerm("");
    setCryptoSortBy("marketCap");
    setCryptoSortOrder("desc");
  };

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

  if (loading && stocks.length === 0) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <Card className="backdrop-blur-xl bg-white/10 border border-white/20">
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
          <h1 className="text-3xl font-bold text-white mb-2">Market Screener</h1>
          <p className="text-slate-400">Live market data with advanced screening tools</p>
          {lastUpdate && (
            <p className="text-sm text-slate-500 mt-1">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </p>
          )}
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" className="bg-white/5 border-white/20" onClick={resetFilters}>
            Reset Filters
          </Button>
          <Button onClick={() => { fetchMarketData(); fetchCryptoData(); }} disabled={loading || cryptoLoading} variant="outline" className="bg-white/5 border-white/20">
            <RefreshCw className={`w-4 h-4 mr-2 ${(loading || cryptoLoading) ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs defaultValue="screener" className="space-y-6">
        <TabsList className="grid grid-cols-2 h-12 bg-white/10 border border-white/20">
          <TabsTrigger value="screener">Stock Screener</TabsTrigger>
          <TabsTrigger value="crypto">Crypto Screener</TabsTrigger>
        </TabsList>

        <TabsContent value="screener" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Stock Filters Panel */}
            <Card className="backdrop-blur-xl bg-white/10 border border-white/20 lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Filter className="w-5 h-5" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Search Symbol</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="e.g., AAPL, MSFT"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-white/5 border-white/20"
                    />
                  </div>
                </div>

                {/* Price Range */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Price Range ($)</Label>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Min"
                      type="number"
                      value={filters.priceMin}
                      onChange={(e) => setFilters({...filters, priceMin: Number(e.target.value)})}
                      className="bg-white/5 border-white/20"
                    />
                    <Input
                      placeholder="Max"
                      type="number"
                      value={filters.priceMax}
                      onChange={(e) => setFilters({...filters, priceMax: Number(e.target.value)})}
                      className="bg-white/5 border-white/20"
                    />
                  </div>
                </div>

                {/* Change % Range */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Change % Range</Label>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Min %"
                      type="number"
                      value={filters.changeMin}
                      onChange={(e) => setFilters({...filters, changeMin: Number(e.target.value)})}
                      className="bg-white/5 border-white/20"
                    />
                    <Input
                      placeholder="Max %"
                      type="number"
                      value={filters.changeMax}
                      onChange={(e) => setFilters({...filters, changeMax: Number(e.target.value)})}
                      className="bg-white/5 border-white/20"
                    />
                  </div>
                </div>

                {/* Market Cap */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Market Cap</Label>
                  <Select value={filters.marketCap} onValueChange={(value) => setFilters({...filters, marketCap: value})}>
                    <SelectTrigger className="bg-white/5 border-white/20">
                      <SelectValue placeholder="All Caps" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Caps</SelectItem>
                      <SelectItem value="large">Large Cap (&gt; $10B)</SelectItem>
                      <SelectItem value="mid">Mid Cap ($2B - $10B)</SelectItem>
                      <SelectItem value="small">Small Cap (&lt; $2B)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Volume */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Min Volume</Label>
                  <Input
                    placeholder="e.g., 1000000"
                    type="number"
                    value={filters.volume}
                    onChange={(e) => setFilters({...filters, volume: Number(e.target.value)})}
                    className="bg-white/5 border-white/20"
                  />
                </div>

                {/* RSI Range */}
                <div className="space-y-2">
                  <Label className="text-slate-300">RSI Range</Label>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Min"
                      type="number"
                      value={filters.rsiMin}
                      onChange={(e) => setFilters({...filters, rsiMin: Number(e.target.value)})}
                      className="bg-white/5 border-white/20"
                    />
                    <Input
                      placeholder="Max"
                      type="number"
                      value={filters.rsiMax}
                      onChange={(e) => setFilters({...filters, rsiMax: Number(e.target.value)})}
                      className="bg-white/5 border-white/20"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stock Results Panel */}
            <div className="lg:col-span-3 space-y-6">
              {/* Results Header */}
              <Card className="backdrop-blur-xl bg-white/10 border border-white/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {filteredStocks.length} stocks found
                      </h3>
                      <p className="text-sm text-slate-400">
                        Real-time data from live market feeds
                      </p>
                      {lastUpdate && (
                        <p className="text-xs text-slate-500 mt-1">
                          Last updated: {lastUpdate.toLocaleTimeString()}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Label className="text-slate-300">Sort by:</Label>
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-40 bg-white/5 border-white/20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="changePercent">% Change</SelectItem>
                          <SelectItem value="price">Price</SelectItem>
                          <SelectItem value="volume">Volume</SelectItem>
                          <SelectItem value="marketCap">Market Cap</SelectItem>
                          <SelectItem value="rsi">RSI</SelectItem>
                          <SelectItem value="volatility">Volatility</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                        className="bg-white/5 border-white/20"
                      >
                        {sortOrder === "asc" ? "↑" : "↓"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Stock Results */}
              <div className="grid gap-4">
                {filteredStocks.map((stock) => (
                  <Card key={stock.symbol} className="backdrop-blur-xl bg-white/10 border border-white/20 hover:bg-white/15 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                            <span className="text-white font-semibold">
                              {stock.symbol.slice(0, 2)}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-white">{stock.symbol}</h3>
                            <p className="text-sm text-slate-400">{stock.name}</p>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-2xl font-bold text-white">
                            ${stock.price.toFixed(2)}
                          </p>
                          <div className={`flex items-center space-x-1 ${
                            stock.changePercent >= 0 ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {stock.changePercent >= 0 ? 
                              <TrendingUp className="w-4 h-4" /> : 
                              <TrendingDown className="w-4 h-4" />
                            }
                            <span className="font-medium">
                              {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                            </span>
                          </div>
                        </div>

                        <div className="text-right text-sm text-slate-400 space-y-1">
                          <p>Vol: {(stock.volume / 1000000).toFixed(1)}M</p>
                          <p>RSI: {stock.technicalIndicators.rsi.toFixed(1)}</p>
                          <p>Vol: {stock.volatility.toFixed(1)}%</p>
                        </div>

                        <div className="text-center">
                          <p className="text-sm text-slate-400 mb-1">Sentiment</p>
                          <Badge variant="outline" className={getSentimentColor(stock.sentimentScore)}>
                            {getSentimentLabel(stock.sentimentScore)}
                          </Badge>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline" className="bg-white/5 border-white/20">
                            <BarChart3 className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="bg-white/5 border-white/20">
                            <Star className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredStocks.length === 0 && !loading && (
                <Card className="backdrop-blur-xl bg-white/10 border border-white/20">
                  <CardContent className="p-12 text-center">
                    <Activity className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No stocks match your criteria</h3>
                    <p className="text-slate-400 mb-4">Try adjusting your filters to see more results</p>
                    <Button onClick={resetFilters} variant="outline" className="bg-white/5 border-white/20">
                      Reset Filters
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="crypto" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Crypto Filters Panel */}
            <Card className="backdrop-blur-xl bg-white/10 border border-white/20 lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Filter className="w-5 h-5" />
                  Crypto Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Search Symbol</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="e.g., BTC, ETH"
                      value={cryptoSearchTerm}
                      onChange={(e) => setCryptoSearchTerm(e.target.value)}
                      className="pl-10 bg-white/5 border-white/20"
                    />
                  </div>
                </div>

                {/* Price Range */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Price Range ($)</Label>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Min"
                      type="number"
                      value={cryptoFilters.priceMin}
                      onChange={(e) => setCryptoFilters({...cryptoFilters, priceMin: Number(e.target.value)})}
                      className="bg-white/5 border-white/20"
                    />
                    <Input
                      placeholder="Max"
                      type="number"
                      value={cryptoFilters.priceMax}
                      onChange={(e) => setCryptoFilters({...cryptoFilters, priceMax: Number(e.target.value)})}
                      className="bg-white/5 border-white/20"
                    />
                  </div>
                </div>

                {/* Change % Range */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Change % Range</Label>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Min %"
                      type="number"
                      value={cryptoFilters.changeMin}
                      onChange={(e) => setCryptoFilters({...cryptoFilters, changeMin: Number(e.target.value)})}
                      className="bg-white/5 border-white/20"
                    />
                    <Input
                      placeholder="Max %"
                      type="number"
                      value={cryptoFilters.changeMax}
                      onChange={(e) => setCryptoFilters({...cryptoFilters, changeMax: Number(e.target.value)})}
                      className="bg-white/5 border-white/20"
                    />
                  </div>
                </div>

                {/* Market Cap Rank */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Market Cap Rank</Label>
                  <Select value={cryptoFilters.marketCapRank} onValueChange={(value) => setCryptoFilters({...cryptoFilters, marketCapRank: value})}>
                    <SelectTrigger className="bg-white/5 border-white/20">
                      <SelectValue placeholder="All Ranks" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Ranks</SelectItem>
                      <SelectItem value="top10">Top 10</SelectItem>
                      <SelectItem value="top50">Top 50</SelectItem>
                      <SelectItem value="top100">Top 100</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Volume */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Min Volume</Label>
                  <Input
                    placeholder="e.g., 1000000"
                    type="number"
                    value={cryptoFilters.volume}
                    onChange={(e) => setCryptoFilters({...cryptoFilters, volume: Number(e.target.value)})}
                    className="bg-white/5 border-white/20"
                  />
                </div>

                {/* Volatility Range */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Volatility Range (%)</Label>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Min"
                      type="number"
                      value={cryptoFilters.volatilityMin}
                      onChange={(e) => setCryptoFilters({...cryptoFilters, volatilityMin: Number(e.target.value)})}
                      className="bg-white/5 border-white/20"
                    />
                    <Input
                      placeholder="Max"
                      type="number"
                      value={cryptoFilters.volatilityMax}
                      onChange={(e) => setCryptoFilters({...cryptoFilters, volatilityMax: Number(e.target.value)})}
                      className="bg-white/5 border-white/20"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Crypto Results Panel */}
            <div className="lg:col-span-3 space-y-6">
              {/* Results Header */}
              <Card className="backdrop-blur-xl bg-white/10 border border-white/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {filteredCryptos.length} cryptocurrencies found
                      </h3>
                      <p className="text-sm text-slate-400">
                        Real-time data from cryptocurrency markets
                      </p>
                      {cryptoLastUpdate && (
                        <p className="text-xs text-slate-500 mt-1">
                          Last updated: {cryptoLastUpdate.toLocaleTimeString()}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Label className="text-slate-300">Sort by:</Label>
                      <Select value={cryptoSortBy} onValueChange={setCryptoSortBy}>
                        <SelectTrigger className="w-40 bg-white/5 border-white/20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="marketCap">Market Cap</SelectItem>
                          <SelectItem value="price">Price</SelectItem>
                          <SelectItem value="changePercent">% Change</SelectItem>
                          <SelectItem value="volume">Volume</SelectItem>
                          <SelectItem value="rank">Rank</SelectItem>
                          <SelectItem value="volatility">Volatility</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCryptoSortOrder(cryptoSortOrder === "asc" ? "desc" : "asc")}
                        className="bg-white/5 border-white/20"
                      >
                        {cryptoSortOrder === "asc" ? "↑" : "↓"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Crypto Results */}
              <div className="grid gap-4">
                {cryptoLoading ? (
                  <Card className="backdrop-blur-xl bg-white/10 border border-white/20">
                    <CardContent className="p-12 text-center">
                      <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-3/4 mb-4 mx-auto"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4 mx-auto"></div>
                        <div className="h-20 bg-gray-200 rounded"></div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  filteredCryptos.map((crypto) => (
                    <Card key={crypto.symbol} className="backdrop-blur-xl bg-white/10 border border-white/20 hover:bg-white/15 transition-colors">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-yellow-600 flex items-center justify-center">
                              <span className="text-white font-semibold">
                                {crypto.symbol.slice(0, 2)}
                              </span>
                            </div>
                            <div>
                              <h3 className="font-semibold text-white">{crypto.symbol}</h3>
                              <p className="text-sm text-slate-400">{crypto.name}</p>
                              <p className="text-xs text-slate-500">Rank #{crypto.rank}</p>
                            </div>
                          </div>

                          <div className="text-right">
                            <p className="text-2xl font-bold text-white">
                              ${crypto.price.toFixed(crypto.price < 1 ? 6 : 2)}
                            </p>
                            <div className={`flex items-center space-x-1 ${
                              crypto.changePercent >= 0 ? 'text-green-400' : 'text-red-400'
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

                          <div className="text-right text-sm text-slate-400 space-y-1">
                            <p>MCap: {formatNumber(crypto.marketCap)}</p>
                            <p>Vol: {formatVolume(crypto.volume)}</p>
                            <p>Vol: {crypto.volatility.toFixed(1)}%</p>
                          </div>

                          <div className="text-center">
                            <p className="text-sm text-slate-400 mb-1">Supply</p>
                            <p className="text-xs text-slate-300">
                              {formatVolume(crypto.circulatingSupply)}
                            </p>
                            <p className="text-xs text-slate-500">
                              / {formatVolume(crypto.totalSupply)}
                            </p>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="outline" className="bg-white/5 border-white/20">
                              <BarChart3 className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="bg-white/5 border-white/20">
                              <Star className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>

              {filteredCryptos.length === 0 && !cryptoLoading && (
                <Card className="backdrop-blur-xl bg-white/10 border border-white/20">
                  <CardContent className="p-12 text-center">
                    <Activity className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No cryptocurrencies match your criteria</h3>
                    <p className="text-slate-400 mb-4">Try adjusting your filters to see more results</p>
                    <Button onClick={resetCryptoFilters} variant="outline" className="bg-white/5 border-white/20">
                      Reset Filters
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
