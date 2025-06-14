import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
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

interface Stock {
  symbol: string;
  name: string;
  sector: string;
  price: number;
  change: number;
  volume: number;
  marketCap: number;
  pe: number;
  rsi: number;
}

interface FilterState {
  sector: string;
  priceMin: number;
  priceMax: number;
  marketCap: string;
  volume: number;
  peMin: number;
  peMax: number;
}

const MOCK_STOCKS: Stock[] = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    sector: "Technology",
    price: 175.96,
    change: 0.34,
    volume: 56478923,
    marketCap: 2820000000000,
    pe: 28.26,
    rsi: 62.5
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corp.",
    sector: "Technology",
    price: 429.26,
    change: 0.87,
    volume: 30456789,
    marketCap: 3190000000000,
    pe: 38.45,
    rsi: 70.1
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    sector: "Technology",
    price: 178.44,
    change: -0.12,
    volume: 23987654,
    marketCap: 1870000000000,
    pe: 25.67,
    rsi: 58.9
  },
  {
    symbol: "AMZN",
    name: "Amazon.com Inc.",
    sector: "Consumer",
    price: 185.25,
    change: 1.23,
    volume: 41234567,
    marketCap: 1900000000000,
    pe: 95.23,
    rsi: 65.4
  },
  {
    symbol: "TSLA",
    name: "Tesla Inc.",
    sector: "Consumer",
    price: 256.78,
    change: -2.34,
    volume: 45678901,
    marketCap: 810000000000,
    pe: 67.89,
    rsi: 45.6
  },
  {
    symbol: "JPM",
    name: "JPMorgan Chase & Co.",
    sector: "Finance",
    price: 198.54,
    change: 0.56,
    volume: 15678902,
    marketCap: 480000000000,
    pe: 12.45,
    rsi: 55.2
  },
  {
    symbol: "JNJ",
    name: "Johnson & Johnson",
    sector: "Healthcare",
    price: 165.23,
    change: 0.23,
    volume: 7890123,
    marketCap: 430000000000,
    pe: 27.89,
    rsi: 48.9
  },
  {
    symbol: "V",
    name: "Visa Inc.",
    sector: "Finance",
    price: 275.87,
    change: 0.78,
    volume: 8901234,
    marketCap: 570000000000,
    pe: 40.56,
    rsi: 61.3
  },
  {
    symbol: "UNH",
    name: "UnitedHealth Group",
    sector: "Healthcare",
    price: 523.45,
    change: -0.45,
    volume: 4561234,
    marketCap: 490000000000,
    pe: 22.34,
    rsi: 52.7
  },
  {
    symbol: "XOM",
    name: "Exxon Mobil Corp.",
    sector: "Energy",
    price: 112.34,
    change: 1.02,
    volume: 12345678,
    marketCap: 460000000000,
    pe: 14.78,
    rsi: 59.1
  }
];

export const MarketScreener = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [stocks, setStocks] = useState(MOCK_STOCKS);
  const [filteredStocks, setFilteredStocks] = useState(MOCK_STOCKS);
  const [filters, setFilters] = useState<FilterState>({
    sector: "all",
    priceMin: 0,
    priceMax: 1000,
    marketCap: "all",
    volume: 0,
    peMin: 0,
    peMax: 100,
  });
  const [sortBy, setSortBy] = useState<string>("price");

  useEffect(() => {
    applyFilters();
  }, [sortBy]);

  const applyFilters = () => {
    let newFilteredStocks = [...stocks];

    if (searchTerm) {
      newFilteredStocks = newFilteredStocks.filter((stock) =>
        stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stock.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.sector !== "all") {
      newFilteredStocks = newFilteredStocks.filter(
        (stock) => stock.sector === filters.sector
      );
    }

    newFilteredStocks = newFilteredStocks.filter(
      (stock) => stock.price >= filters.priceMin && stock.price <= filters.priceMax
    );

    if (filters.marketCap !== "all") {
      newFilteredStocks = newFilteredStocks.filter((stock) => {
        if (filters.marketCap === "large") {
          return stock.marketCap > 10000000000;
        } else if (filters.marketCap === "mid") {
          return stock.marketCap >= 2000000000 && stock.marketCap <= 10000000000;
        } else {
          return stock.marketCap < 2000000000;
        }
      });
    }

    newFilteredStocks = newFilteredStocks.filter((stock) => stock.volume >= filters.volume);

    newFilteredStocks = newFilteredStocks.filter(
      (stock) => stock.pe >= filters.peMin && stock.pe <= filters.peMax
    );

    // Sorting logic
    if (sortBy === "price") {
      newFilteredStocks.sort((a, b) => a.price - b.price);
    } else if (sortBy === "change") {
      newFilteredStocks.sort((a, b) => b.change - a.change);
    } else if (sortBy === "volume") {
      newFilteredStocks.sort((a, b) => b.volume - a.volume);
    } else if (sortBy === "marketCap") {
      newFilteredStocks.sort((a, b) => b.marketCap - a.marketCap);
    }

    setFilteredStocks(newFilteredStocks);
  };

  const handleRefresh = () => {
    setFilteredStocks(MOCK_STOCKS);
    setFilters({
      sector: "all",
      priceMin: 0,
      priceMax: 1000,
      marketCap: "all",
      volume: 0,
      peMin: 0,
      peMax: 100,
    });
    setSearchTerm("");
    setSortBy("price");
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Market Screener</h1>
          <p className="text-slate-400">Advanced screening tools for stocks and cryptocurrencies</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" className="bg-white/5 border-white/20">
            <Save className="w-4 h-4 mr-2" />
            Save Screen
          </Button>
          <Button onClick={handleRefresh} variant="outline" className="bg-white/5 border-white/20">
            <RefreshCw className="w-4 h-4 mr-2" />
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
            {/* Filters Panel */}
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

                {/* Sector Filter */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Sector</Label>
                  <Select value={filters.sector} onValueChange={(value) => setFilters({...filters, sector: value})}>
                    <SelectTrigger className="bg-white/5 border-white/20">
                      <SelectValue placeholder="All Sectors" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sectors</SelectItem>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="energy">Energy</SelectItem>
                      <SelectItem value="consumer">Consumer</SelectItem>
                    </SelectContent>
                  </Select>
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

                {/* P/E Ratio */}
                <div className="space-y-2">
                  <Label className="text-slate-300">P/E Ratio Range</Label>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Min"
                      type="number"
                      value={filters.peMin}
                      onChange={(e) => setFilters({...filters, peMin: Number(e.target.value)})}
                      className="bg-white/5 border-white/20"
                    />
                    <Input
                      placeholder="Max"
                      type="number"
                      value={filters.peMax}
                      onChange={(e) => setFilters({...filters, peMax: Number(e.target.value)})}
                      className="bg-white/5 border-white/20"
                    />
                  </div>
                </div>

                <Button onClick={applyFilters} className="w-full bg-blue-600 hover:bg-blue-700">
                  Apply Filters
                </Button>
              </CardContent>
            </Card>

            {/* Results Panel */}
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
                        Showing results based on your criteria
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Label className="text-slate-300">Sort by:</Label>
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-40 bg-white/5 border-white/20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="price">Price</SelectItem>
                          <SelectItem value="change">% Change</SelectItem>
                          <SelectItem value="volume">Volume</SelectItem>
                          <SelectItem value="marketCap">Market Cap</SelectItem>
                        </SelectContent>
                      </Select>
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
                            <Badge variant="outline" className="mt-1 text-xs">
                              {stock.sector}
                            </Badge>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-2xl font-bold text-white">
                            ${stock.price.toFixed(2)}
                          </p>
                          <div className={`flex items-center space-x-1 ${
                            stock.change >= 0 ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {stock.change >= 0 ? 
                              <TrendingUp className="w-4 h-4" /> : 
                              <TrendingDown className="w-4 h-4" />
                            }
                            <span className="font-medium">
                              {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%
                            </span>
                          </div>
                        </div>

                        <div className="text-right text-sm text-slate-400">
                          <p>Volume: {(stock.volume / 1000000).toFixed(1)}M</p>
                          <p>P/E: {stock.pe.toFixed(1)}</p>
                          <p>RSI: {stock.rsi.toFixed(1)}</p>
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
            </div>
          </div>
        </TabsContent>

        <TabsContent value="crypto" className="space-y-6">
          <Card className="backdrop-blur-xl bg-white/10 border border-white/20">
            <CardContent className="p-12 text-center">
              <Activity className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Crypto Screener</h3>
              <p className="text-slate-400 mb-4">Advanced cryptocurrency screening coming soon</p>
              <Button variant="outline" className="bg-white/5 border-white/20">
                Request Early Access
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
