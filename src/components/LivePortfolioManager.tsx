
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, RefreshCw, Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import { useMetaMask } from '@/hooks/useMetaMask';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Holding {
  id?: string;
  symbol: string;
  name: string;
  quantity: number;
  average_price: number;
  current_price: number;
  asset_type: 'stock' | 'crypto';
}

interface LivePriceData {
  [symbol: string]: {
    price: number;
    change: number;
    changePercent: number;
  };
}

export const LivePortfolioManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const metaMask = useMetaMask();
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [livePrices, setLivePrices] = useState<LivePriceData>({});
  const [isLoading, setIsLoading] = useState(false);
  const [newHolding, setNewHolding] = useState<Partial<Holding>>({
    symbol: '',
    name: '',
    quantity: 0,
    average_price: 0,
    asset_type: 'stock'
  });

  useEffect(() => {
    if (user) {
      fetchHoldings();
    }
  }, [user]);

  useEffect(() => {
    if (holdings.length > 0) {
      fetchLivePrices();
      const interval = setInterval(fetchLivePrices, 30000); // Update every 30 seconds
      return () => clearInterval(interval);
    }
  }, [holdings]);

  const fetchHoldings = async () => {
    try {
      const { data, error } = await supabase
        .from('portfolio_holdings')
        .select('*')
        .eq('user_id', user?.id);

      if (error) throw error;
      setHoldings(data || []);
    } catch (error) {
      console.error('Error fetching holdings:', error);
      toast({
        title: "Error",
        description: "Failed to fetch portfolio holdings",
        variant: "destructive",
      });
    }
  };

  const fetchLivePrices = async () => {
    if (holdings.length === 0) return;

    try {
      setIsLoading(true);
      const symbols = holdings.map(h => h.symbol);
      
      // Fetch live prices for stocks and crypto
      const priceData: LivePriceData = {};
      
      for (const holding of holdings) {
        if (holding.asset_type === 'stock') {
          // Mock live stock price (in real app, use Alpha Vantage or similar)
          const mockPrice = holding.average_price * (0.95 + Math.random() * 0.1);
          const change = mockPrice - holding.average_price;
          const changePercent = (change / holding.average_price) * 100;
          
          priceData[holding.symbol] = {
            price: mockPrice,
            change,
            changePercent
          };
        } else if (holding.asset_type === 'crypto') {
          // Mock crypto price (in real app, use CoinGecko or similar)
          const mockPrice = holding.average_price * (0.9 + Math.random() * 0.2);
          const change = mockPrice - holding.average_price;
          const changePercent = (change / holding.average_price) * 100;
          
          priceData[holding.symbol] = {
            price: mockPrice,
            change,
            changePercent
          };
        }
      }
      
      setLivePrices(priceData);
    } catch (error) {
      console.error('Error fetching live prices:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addHolding = async () => {
    if (!newHolding.symbol || !newHolding.name || !newHolding.quantity || !newHolding.average_price) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('portfolio_holdings')
        .insert({
          user_id: user?.id,
          symbol: newHolding.symbol.toUpperCase(),
          name: newHolding.name,
          quantity: newHolding.quantity,
          average_price: newHolding.average_price,
          current_price: newHolding.average_price,
          asset_type: newHolding.asset_type
        })
        .select()
        .single();

      if (error) throw error;

      setHoldings(prev => [...prev, data]);
      setNewHolding({
        symbol: '',
        name: '',
        quantity: 0,
        average_price: 0,
        asset_type: 'stock'
      });

      toast({
        title: "Holding Added",
        description: `${newHolding.symbol} has been added to your portfolio`,
      });
    } catch (error) {
      console.error('Error adding holding:', error);
      toast({
        title: "Error",
        description: "Failed to add holding",
        variant: "destructive",
      });
    }
  };

  const removeHolding = async (id: string) => {
    try {
      const { error } = await supabase
        .from('portfolio_holdings')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setHoldings(prev => prev.filter(h => h.id !== id));
      toast({
        title: "Holding Removed",
        description: "Holding has been removed from your portfolio",
      });
    } catch (error) {
      console.error('Error removing holding:', error);
      toast({
        title: "Error",
        description: "Failed to remove holding",
        variant: "destructive",
      });
    }
  };

  const getNetworkName = (chainId: string | null) => {
    switch (chainId) {
      case '0x1': return 'Ethereum Mainnet';
      case '0x89': return 'Polygon';
      case '0x38': return 'BSC';
      default: return 'Unknown Network';
    }
  };

  const totalPortfolioValue = holdings.reduce((total, holding) => {
    const currentPrice = livePrices[holding.symbol]?.price || holding.current_price;
    return total + (currentPrice * holding.quantity);
  }, 0);

  const totalCost = holdings.reduce((total, holding) => {
    return total + (holding.average_price * holding.quantity);
  }, 0);

  const totalGainLoss = totalPortfolioValue - totalCost;
  const totalGainLossPercent = totalCost > 0 ? (totalGainLoss / totalCost) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Wallet Connection Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Wallet className="w-5 h-5 mr-2" />
            Wallet Connection
          </CardTitle>
          <CardDescription>
            Connect your MetaMask wallet to sync crypto holdings
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!metaMask.isConnected ? (
            <Button 
              onClick={metaMask.connect} 
              disabled={metaMask.isLoading}
              className="w-full sm:w-auto"
            >
              {metaMask.isLoading ? 'Connecting...' : 'Connect MetaMask'}
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">
                    {metaMask.account?.slice(0, 6)}...{metaMask.account?.slice(-4)}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {getNetworkName(metaMask.chainId)}
                  </p>
                </div>
                <Badge variant="default" className="bg-green-500">
                  Connected
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span>ETH Balance: {metaMask.balance} ETH</span>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={metaMask.refreshBalance}
                  >
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={metaMask.disconnect}
                  >
                    Disconnect
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Portfolio Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Overview</CardTitle>
          <CardDescription>Real-time portfolio performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Value</p>
              <p className="text-2xl font-bold">₹{totalPortfolioValue.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Gain/Loss</p>
              <p className={`text-2xl font-bold ${totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {totalGainLoss >= 0 ? '+' : ''}₹{totalGainLoss.toFixed(2)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">Percentage</p>
              <p className={`text-2xl font-bold flex items-center justify-center ${totalGainLossPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {totalGainLossPercent >= 0 ? <TrendingUp className="w-5 h-5 mr-1" /> : <TrendingDown className="w-5 h-5 mr-1" />}
                {totalGainLossPercent.toFixed(2)}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="holdings" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="holdings">Holdings</TabsTrigger>
          <TabsTrigger value="add">Add Holding</TabsTrigger>
        </TabsList>

        <TabsContent value="holdings" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Current Holdings</CardTitle>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={fetchLivePrices}
                disabled={isLoading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh Prices
              </Button>
            </CardHeader>
            <CardContent>
              {holdings.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Symbol</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Avg Price</TableHead>
                      <TableHead>Current Price</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>P&L</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {holdings.map((holding) => {
                      const livePrice = livePrices[holding.symbol];
                      const currentPrice = livePrice?.price || holding.current_price;
                      const currentValue = currentPrice * holding.quantity;
                      const gainLoss = currentValue - (holding.average_price * holding.quantity);
                      const gainLossPercent = ((currentPrice - holding.average_price) / holding.average_price) * 100;

                      return (
                        <TableRow key={holding.id}>
                          <TableCell className="font-medium">{holding.symbol}</TableCell>
                          <TableCell>{holding.name}</TableCell>
                          <TableCell>
                            <Badge variant={holding.asset_type === 'stock' ? 'default' : 'secondary'}>
                              {holding.asset_type}
                            </Badge>
                          </TableCell>
                          <TableCell>{holding.quantity}</TableCell>
                          <TableCell>₹{holding.average_price.toFixed(2)}</TableCell>
                          <TableCell className={livePrice ? (livePrice.changePercent >= 0 ? 'text-green-600' : 'text-red-600') : ''}>
                            ₹{currentPrice.toFixed(2)}
                            {livePrice && (
                              <div className="text-xs">
                                {livePrice.changePercent >= 0 ? '+' : ''}{livePrice.changePercent.toFixed(2)}%
                              </div>
                            )}
                          </TableCell>
                          <TableCell>₹{currentValue.toLocaleString()}</TableCell>
                          <TableCell className={gainLoss >= 0 ? 'text-green-600' : 'text-red-600'}>
                            {gainLoss >= 0 ? '+' : ''}₹{gainLoss.toFixed(2)}
                            <div className="text-xs">
                              ({gainLossPercent.toFixed(2)}%)
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => removeHolding(holding.id!)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No holdings yet. Add your first holding to get started!
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="add" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Plus className="w-5 h-5 mr-2" />
                Add New Holding
              </CardTitle>
              <CardDescription>
                Add stocks or crypto to track in your portfolio
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="symbol">Symbol</Label>
                  <Input
                    id="symbol"
                    placeholder="e.g., AAPL, BTC"
                    value={newHolding.symbol}
                    onChange={(e) => setNewHolding(prev => ({ ...prev, symbol: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Apple Inc., Bitcoin"
                    value={newHolding.name}
                    onChange={(e) => setNewHolding(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="asset_type">Asset Type</Label>
                  <Select 
                    value={newHolding.asset_type} 
                    onValueChange={(value: 'stock' | 'crypto') => setNewHolding(prev => ({ ...prev, asset_type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stock">Stock</SelectItem>
                      <SelectItem value="crypto">Cryptocurrency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    step="0.01"
                    placeholder="0"
                    value={newHolding.quantity || ''}
                    onChange={(e) => setNewHolding(prev => ({ ...prev, quantity: parseFloat(e.target.value) || 0 }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="average_price">Average Price (₹)</Label>
                  <Input
                    id="average_price"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={newHolding.average_price || ''}
                    onChange={(e) => setNewHolding(prev => ({ ...prev, average_price: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
              </div>

              <Button onClick={addHolding} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Holding
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
