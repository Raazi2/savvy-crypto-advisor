
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown, DollarSign, TrendingUp, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CryptoData {
  id: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  symbol: string;
}

export const DashboardHome = () => {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchCryptoData();
    const interval = setInterval(fetchCryptoData, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const fetchCryptoData = async () => {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1'
      );
      const data = await response.json();
      setCryptoData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching crypto data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch crypto data. Please try again.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1e12) return `$${(marketCap / 1e12).toFixed(2)}T`;
    if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(2)}B`;
    if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(2)}M`;
    return `$${marketCap.toLocaleString()}`;
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center py-8">
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Welcome to Your Financial Hub
        </h2>
        <p className="text-lg opacity-80 max-w-2xl mx-auto">
          Track real-time crypto markets, get AI-powered insights, and manage your portfolio with advanced security features.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="backdrop-blur-xl bg-white/10 border border-white/20 hover:bg-white/15 transition-all duration-300">
          <CardContent className="p-6 text-center">
            <DollarSign className="w-8 h-8 mx-auto mb-2 text-green-400" />
            <h3 className="text-2xl font-bold text-green-400">Live Data</h3>
            <p className="text-sm opacity-80">Real-time market updates</p>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-white/10 border border-white/20 hover:bg-white/15 transition-all duration-300">
          <CardContent className="p-6 text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-blue-400" />
            <h3 className="text-2xl font-bold text-blue-400">AI Insights</h3>
            <p className="text-sm opacity-80">Powered by multiple LLMs</p>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-white/10 border border-white/20 hover:bg-white/15 transition-all duration-300">
          <CardContent className="p-6 text-center">
            <Clock className="w-8 h-8 mx-auto mb-2 text-purple-400" />
            <h3 className="text-2xl font-bold text-purple-400">24/7 Access</h3>
            <p className="text-sm opacity-80">Always available</p>
          </CardContent>
        </Card>
      </div>

      {/* Live Crypto Market */}
      <Card className="backdrop-blur-xl bg-white/10 border border-white/20">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-bold">Live Crypto Market</CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={fetchCryptoData}
            className="hover:bg-white/10"
          >
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full"></div>
                    <div className="space-y-1">
                      <div className="w-20 h-4 bg-white/20 rounded"></div>
                      <div className="w-12 h-3 bg-white/20 rounded"></div>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="w-16 h-4 bg-white/20 rounded ml-auto"></div>
                    <div className="w-12 h-3 bg-white/20 rounded ml-auto"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {cryptoData.map((coin) => (
                <div 
                  key={coin.id} 
                  className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold">
                      {coin.symbol.toUpperCase().slice(0, 2)}
                    </div>
                    <div>
                      <h4 className="font-semibold">{coin.name}</h4>
                      <p className="text-sm opacity-60 uppercase">{coin.symbol}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-bold">{formatPrice(coin.current_price)}</p>
                    <div className="flex items-center gap-1">
                      {coin.price_change_percentage_24h >= 0 ? (
                        <ArrowUp className="w-3 h-3 text-green-400" />
                      ) : (
                        <ArrowDown className="w-3 h-3 text-red-400" />
                      )}
                      <span 
                        className={`text-sm ${
                          coin.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}
                      >
                        {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                      </span>
                    </div>
                  </div>
                  
                  <Badge variant="secondary" className="ml-4 bg-white/10">
                    {formatMarketCap(coin.market_cap)}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="backdrop-blur-xl bg-white/10 border border-white/20 hover:bg-white/15 transition-all duration-300">
          <CardContent className="p-6">
            <h3 className="font-bold mb-2">AI Financial Advisor</h3>
            <p className="text-sm opacity-80 mb-4">
              Get personalized investment advice and market insights from our AI assistant.
            </p>
            <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
              Start Chat
            </Button>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-white/10 border border-white/20 hover:bg-white/15 transition-all duration-300">
          <CardContent className="p-6">
            <h3 className="font-bold mb-2">Connect Wallet</h3>
            <p className="text-sm opacity-80 mb-4">
              View your blockchain wallet balance and transaction history securely.
            </p>
            <Button variant="outline" className="w-full border-white/20 hover:bg-white/10">
              View Wallet
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
