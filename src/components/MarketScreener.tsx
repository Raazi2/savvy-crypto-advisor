
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, Save, TrendingUp, TrendingDown, RefreshCw, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  peRatio?: number;
  sector: string;
  rsi?: number;
  macd?: number;
  sma50?: number;
  sma200?: number;
}

interface ScreenerFilters {
  minPrice: string;
  maxPrice: string;
  minVolume: string;
  maxVolume: string;
  minMarketCap: string;
  maxMarketCap: string;
  minPE: string;
  maxPE: string;
  sector: string;
  minRSI: string;
  maxRSI: string;
  priceAboveSMA50: boolean;
  priceAboveSMA200: boolean;
  goldenCross: boolean;
}

const sectors = [
  "All Sectors",
  "Technology",
  "Healthcare",
  "Financial Services",
  "Consumer Cyclical",
  "Communication Services",
  "Industrials",
  "Consumer Defensive",
  "Energy",
  "Utilities",
  "Real Estate",
  "Materials",
  "Basic Materials"
];

const mockStocks: StockData[] = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 185.43,
    change: -2.75,
    changePercent: -1.46,
    volume: 50240000,
    marketCap: 2850000000000,
    peRatio: 28.5,
    sector: "Technology",
    rsi: 45.2,
    macd: 1.2,
    sma50: 180.25,
    sma200: 175.80
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    price: 362.80,
    change: 4.25,
    changePercent: 1.18,
    volume: 28450000,
    marketCap: 2700000000000,
    peRatio: 32.1,
    sector: "Technology",
    rsi: 62.8,
    macd: 2.1,
    sma50: 355.40,
    sma200: 340.15
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    price: 138.21,
    change: 2.15,
    changePercent: 1.58,
    volume: 31200000,
    marketCap: 1750000000000,
    peRatio: 25.7,
    sector: "Communication Services",
    rsi: 58.4,
    macd: 0.8,
    sma50: 135.60,
    sma200: 130.25
  },
  {
    symbol: "TSLA",
    name: "Tesla, Inc.",
    price: 245.67,
    change: -8.90,
    changePercent: -3.50,
    volume: 89340000,
    marketCap: 780000000000,
    peRatio: 65.2,
    sector: "Consumer Cyclical",
    rsi: 35.1,
    macd: -1.5,
    sma50: 255.30,
    sma200: 240.75
  },
  {
    symbol: "NVDA",
    name: "NVIDIA Corporation",
    price: 485.23,
    change: 12.45,
    changePercent: 2.63,
    volume: 45670000,
    marketCap: 1200000000000,
    peRatio: 45.8,
    sector: "Technology",
    rsi: 71.2,
    macd: 3.2,
    sma50: 470.15,
    sma200: 420.80
  },
  {
    symbol: "JPM",
    name: "JPMorgan Chase & Co.",
    price: 148.52,
    change: 1.85,
    changePercent: 1.26,
    volume: 12340000,
    marketCap: 435000000000,
    peRatio: 12.4,
    sector: "Financial Services",
    rsi: 52.8,
    macd: 0.5,
    sma50: 145.30,
    sma200: 140.60
  }
];

export const MarketScreener = () => {
  const [filteredStocks, setFilteredStocks] = useState<StockData[]>(mockStocks);
  const [filters, setFilters] = useState<ScreenerFilters>({
    minPrice: "",
    maxPrice: "",
    minVolume: "",
    maxVolume: "",
    minMarketCap: "",
    maxMarketCap: "",
    minPE: "",
    maxPE: "",
    sector: "All Sectors",
    minRSI: "",
    maxRSI: "",
    priceAboveSMA50: false,
    priceAboveSMA200: false,
    goldenCross: false
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [savedScreens, setSavedScreens] = useState<string[]>([]);
  const [screenName, setScreenName] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    applyFilters();
  }, [filters, searchTerm]);

  const applyFilters = () => {
    let filtered = mockStocks;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(stock => 
        stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stock.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Price filters
    if (filters.minPrice) {
      filtered = filtered.filter(stock => stock.price >= parseFloat(filters.minPrice));
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(stock => stock.price <= parseFloat(filters.maxPrice));
    }

    // Volume filters
    if (filters.minVolume) {
      filtered = filtered.filter(stock => stock.volume >= parseInt(filters.minVolume));
    }
    if (filters.maxVolume) {
      filtered = filtered.filter(stock => stock.volume <= parseInt(filters.maxVolume));
    }

    // Market Cap filters
    if (filters.minMarketCap) {
      filtered = filtered.filter(stock => stock.marketCap >= parseFloat(filters.minMarketCap) * 1000000000);
    }
    if (filters.maxMarketCap) {
      filtered = filtered.filter(stock => stock.marketCap <= parseFloat(filters.maxMarketCap) * 1000000000);
    }

    // P/E Ratio filters
    if (filters.minPE) {
      filtered = filtered.filter(stock => stock.peRatio && stock.peRatio >= parseFloat(filters.minPE));
    }
    if (filters.maxPE) {
      filtered = filtered.filter(stock => stock.peRatio && stock.peRatio <= parseFloat(filters.maxPE));
    }

    // Sector filter
    if (filters.sector && filters.sector !== "All Sectors") {
      filtered = filtered.filter(stock => stock.sector === filters.sector);
    }

    // RSI filters
    if (filters.minRSI) {
      filtered = filtered.filter(stock => stock.rsi && stock.rsi >= parseFloat(filters.minRSI));
    }
    if (filters.maxRSI) {
      filtered = filtered.filter(stock => stock.rsi && stock.rsi <= parseFloat(filters.maxRSI));
    }

    // Technical filters
    if (filters.priceAboveSMA50) {
      filtered = filtered.filter(stock => stock.sma50 && stock.price > stock.sma50);
    }
    if (filters.priceAboveSMA200) {
      filtered = filtered.filter(stock => stock.sma200 && stock.price > stock.sma200);
    }
    if (filters.goldenCross) {
      filtered = filtered.filter(stock => stock.sma50 && stock.sma200 && stock.sma50 > stock.sma200);
    }

    setFilteredStocks(filtered);
  };

  const clearFilters = () => {
    setFilters({
      minPrice: "",
      maxPrice: "",
      minVolume: "",
      maxVolume: "",
      minMarketCap: "",
      maxMarketCap: "",
      minPE: "",
      maxPE: "",
      sector: "All Sectors",
      minRSI: "",
      maxRSI: "",
      priceAboveSMA50: false,
      priceAboveSMA200: false,
      goldenCross: false
    });
    setSearchTerm("");
  };

  const saveScreen = () => {
    if (!screenName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a name for your screen",
        variant: "destructive",
      });
      return;
    }
    setSavedScreens([...savedScreens, screenName]);
    setScreenName("");
    toast({
      title: "Screen Saved",
      description: `Screen "${screenName}" has been saved successfully`,
    });
  };

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1000000000000) {
      return `$${(marketCap / 1000000000000).toFixed(2)}T`;
    } else if (marketCap >= 1000000000) {
      return `$${(marketCap / 1000000000).toFixed(2)}B`;
    } else if (marketCap >= 1000000) {
      return `$${(marketCap / 1000000).toFixed(2)}M`;
    }
    return `$${marketCap.toFixed(0)}`;
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(1)}M`;
    } else if (volume >= 1000) {
      return `${(volume / 1000).toFixed(1)}K`;
    }
    return volume.toString();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Market Screener</h2>
          <p className="text-slate-600 dark:text-slate-400">
            Discover stocks and crypto with advanced filtering and technical analysis
          </p>
        </div>
        <div className="flex space-x-2">
          <Badge variant="outline" className="text-green-600">
            {filteredStocks.length} Results
          </Badge>
          <Button variant="outline" onClick={() => applyFilters()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs defaultValue="screener" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="screener">Stock Screener</TabsTrigger>
          <TabsTrigger value="technical">Technical Analysis</TabsTrigger>
          <TabsTrigger value="saved">Saved Screens</TabsTrigger>
        </TabsList>

        <TabsContent value="screener" className="space-y-6">
          {/* Search and Basic Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Search className="w-5 h-5" />
                <span>Search & Filter</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <label className="text-sm font-medium">Search Symbol or Company</label>
                  <Input
                    placeholder="Enter symbol or company name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Sector</label>
                  <Select value={filters.sector} onValueChange={(value) => setFilters({...filters, sector: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select sector" />
                    </SelectTrigger>
                    <SelectContent>
                      {sectors.map((sector) => (
                        <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex space-x-2">
                  <Button onClick={clearFilters} variant="outline" className="flex-1">
                    Clear All
                  </Button>
                  <Button onClick={applyFilters} className="flex-1">
                    Apply
                  </Button>
                </div>
              </div>

              {/* Price and Volume Filters */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium">Min Price ($)</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={filters.minPrice}
                    onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Max Price ($)</label>
                  <Input
                    type="number"
                    placeholder="1000"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Min Volume</label>
                  <Input
                    type="number"
                    placeholder="100000"
                    value={filters.minVolume}
                    onChange={(e) => setFilters({...filters, minVolume: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Max Volume</label>
                  <Input
                    type="number"
                    placeholder="100000000"
                    value={filters.maxVolume}
                    onChange={(e) => setFilters({...filters, maxVolume: e.target.value})}
                  />
                </div>
              </div>

              {/* Market Cap and P/E Filters */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium">Min Market Cap (B)</label>
                  <Input
                    type="number"
                    placeholder="1"
                    value={filters.minMarketCap}
                    onChange={(e) => setFilters({...filters, minMarketCap: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Max Market Cap (B)</label>
                  <Input
                    type="number"
                    placeholder="3000"
                    value={filters.maxMarketCap}
                    onChange={(e) => setFilters({...filters, maxMarketCap: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Min P/E Ratio</label>
                  <Input
                    type="number"
                    placeholder="5"
                    value={filters.minPE}
                    onChange={(e) => setFilters({...filters, minPE: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Max P/E Ratio</label>
                  <Input
                    type="number"
                    placeholder="50"
                    value={filters.maxPE}
                    onChange={(e) => setFilters({...filters, maxPE: e.target.value})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Table */}
          <Card>
            <CardHeader>
              <CardTitle>Screening Results</CardTitle>
              <CardDescription>
                {filteredStocks.length} stocks match your criteria
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Symbol</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Change</TableHead>
                    <TableHead>Volume</TableHead>
                    <TableHead>Market Cap</TableHead>
                    <TableHead>P/E</TableHead>
                    <TableHead>Sector</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStocks.map((stock) => (
                    <TableRow key={stock.symbol} className="hover:bg-slate-50 dark:hover:bg-slate-800">
                      <TableCell className="font-semibold">{stock.symbol}</TableCell>
                      <TableCell>{stock.name}</TableCell>
                      <TableCell className="font-semibold">${stock.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <div className={`flex items-center ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {stock.change >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                          {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                        </div>
                      </TableCell>
                      <TableCell>{formatVolume(stock.volume)}</TableCell>
                      <TableCell>{formatMarketCap(stock.marketCap)}</TableCell>
                      <TableCell>{stock.peRatio?.toFixed(1) || 'N/A'}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{stock.sector}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="technical" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Technical Analysis Filters</CardTitle>
              <CardDescription>Filter stocks based on technical indicators</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Min RSI</label>
                  <Input
                    type="number"
                    placeholder="30"
                    value={filters.minRSI}
                    onChange={(e) => setFilters({...filters, minRSI: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Max RSI</label>
                  <Input
                    type="number"
                    placeholder="70"
                    value={filters.maxRSI}
                    onChange={(e) => setFilters({...filters, maxRSI: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters.priceAboveSMA50}
                    onChange={(e) => setFilters({...filters, priceAboveSMA50: e.target.checked})}
                    className="rounded"
                  />
                  <span>Price above 50-day SMA</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters.priceAboveSMA200}
                    onChange={(e) => setFilters({...filters, priceAboveSMA200: e.target.checked})}
                    className="rounded"
                  />
                  <span>Price above 200-day SMA</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters.goldenCross}
                    onChange={(e) => setFilters({...filters, goldenCross: e.target.checked})}
                    className="rounded"
                  />
                  <span>Golden Cross (50-SMA > 200-SMA)</span>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Technical Results */}
          <Card>
            <CardHeader>
              <CardTitle>Technical Analysis Results</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Symbol</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>RSI</TableHead>
                    <TableHead>MACD</TableHead>
                    <TableHead>50-SMA</TableHead>
                    <TableHead>200-SMA</TableHead>
                    <TableHead>Signals</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStocks.map((stock) => (
                    <TableRow key={stock.symbol}>
                      <TableCell className="font-semibold">{stock.symbol}</TableCell>
                      <TableCell>${stock.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant={stock.rsi && stock.rsi > 70 ? 'destructive' : stock.rsi && stock.rsi < 30 ? 'default' : 'outline'}>
                          {stock.rsi?.toFixed(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className={stock.macd && stock.macd > 0 ? 'text-green-600' : 'text-red-600'}>
                        {stock.macd?.toFixed(2)}
                      </TableCell>
                      <TableCell>${stock.sma50?.toFixed(2)}</TableCell>
                      <TableCell>${stock.sma200?.toFixed(2)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          {stock.sma50 && stock.price > stock.sma50 && (
                            <Badge variant="default" className="text-xs">Above 50-SMA</Badge>
                          )}
                          {stock.sma50 && stock.sma200 && stock.sma50 > stock.sma200 && (
                            <Badge variant="default" className="text-xs bg-yellow-500">Golden Cross</Badge>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="saved" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Save Current Screen</CardTitle>
              <CardDescription>Save your current filter configuration for later use</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2">
                <Input
                  placeholder="Enter screen name"
                  value={screenName}
                  onChange={(e) => setScreenName(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={saveScreen}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Screen
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Saved Screens</CardTitle>
              <CardDescription>Your previously saved screening configurations</CardDescription>
            </CardHeader>
            <CardContent>
              {savedScreens.length === 0 ? (
                <div className="text-center py-8">
                  <Star className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600 dark:text-slate-400">No saved screens yet</p>
                  <p className="text-sm text-slate-500">Save your favorite screening criteria to access them quickly</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {savedScreens.map((screen, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="font-medium">{screen}</span>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">Load</Button>
                        <Button size="sm" variant="outline" className="text-red-600">Delete</Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
