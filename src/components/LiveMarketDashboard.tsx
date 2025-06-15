
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, TrendingDown, Wifi, WifiOff, RefreshCw, Activity } from 'lucide-react';
import { useWebSocketMarketData } from '@/hooks/useWebSocketMarketData';

const INDIAN_STOCKS = ['RELIANCE', 'TCS', 'INFY', 'HDFCBANK', 'ICICIBANK', 'SBIN', 'BHARTIARTL', 'ITC'];
const US_STOCKS = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'NVDA', 'META', 'NFLX'];

export const LiveMarketDashboard = () => {
  const [activeTab, setActiveTab] = useState('indian');
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);

  const {
    marketData: indianData,
    connectionStatus: indianStatus,
    connect: connectIndian,
    disconnect: disconnectIndian,
    isConnected: isIndianConnected
  } = useWebSocketMarketData({
    symbols: activeTab === 'indian' ? INDIAN_STOCKS : [],
    exchange: 'NSE',
    autoConnect: true
  });

  const {
    marketData: usData,
    connectionStatus: usStatus,
    connect: connectUS,
    disconnect: disconnectUS,
    isConnected: isUSConnected
  } = useWebSocketMarketData({
    symbols: activeTab === 'us' ? US_STOCKS : [],
    exchange: 'NASDAQ',
    autoConnect: true
  });

  const currentData = activeTab === 'indian' ? indianData : usData;
  const currentStatus = activeTab === 'indian' ? indianStatus : usStatus;
  const isConnected = activeTab === 'indian' ? isIndianConnected : isUSConnected;

  const formatPrice = (price: number) => {
    return activeTab === 'indian' 
      ? `₹${price.toFixed(2)}` 
      : `$${price.toFixed(2)}`;
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(1)}M`;
    } else if (volume >= 1000) {
      return `${(volume / 1000).toFixed(1)}K`;
    }
    return volume.toString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-600';
      case 'connecting': return 'text-yellow-600';
      case 'disconnected': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const selectedStock = selectedSymbol ? currentData[selectedSymbol] : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <Activity className="w-8 h-8 mr-2" />
            Live Market Data
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Real-time stock prices via WebSocket feeds
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            {isConnected ? (
              <Wifi className="w-5 h-5 text-green-600" />
            ) : (
              <WifiOff className="w-5 h-5 text-red-600" />
            )}
            <span className={`text-sm font-medium ${getStatusColor(currentStatus)}`}>
              {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
            </span>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (activeTab === 'indian') {
                disconnectIndian();
                setTimeout(connectIndian, 100);
              } else {
                disconnectUS();
                setTimeout(connectUS, 100);
              }
            }}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reconnect
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="indian">Indian Stocks (NSE)</TabsTrigger>
          <TabsTrigger value="us">US Stocks (NASDAQ)</TabsTrigger>
        </TabsList>

        <TabsContent value="indian" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Stock List */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>NSE Live Prices</CardTitle>
                <CardDescription>Real-time prices from National Stock Exchange</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Symbol</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Change</TableHead>
                      <TableHead>Volume</TableHead>
                      <TableHead>Updated</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {INDIAN_STOCKS.map(symbol => {
                      const data = indianData[symbol];
                      return (
                        <TableRow 
                          key={symbol}
                          className={`cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 ${
                            selectedSymbol === symbol ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                          }`}
                          onClick={() => setSelectedSymbol(symbol)}
                        >
                          <TableCell className="font-medium">{symbol}</TableCell>
                          <TableCell>
                            {data ? formatPrice(data.price) : '-'}
                          </TableCell>
                          <TableCell>
                            {data ? (
                              <div className={`flex items-center ${
                                data.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {data.changePercent >= 0 ? (
                                  <TrendingUp className="w-3 h-3 mr-1" />
                                ) : (
                                  <TrendingDown className="w-3 h-3 mr-1" />
                                )}
                                {data.changePercent.toFixed(2)}%
                              </div>
                            ) : '-'}
                          </TableCell>
                          <TableCell>
                            {data ? formatVolume(data.volume) : '-'}
                          </TableCell>
                          <TableCell className="text-xs text-gray-500">
                            {data ? new Date(data.timestamp).toLocaleTimeString() : '-'}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Market Depth */}
            <Card>
              <CardHeader>
                <CardTitle>Market Depth</CardTitle>
                <CardDescription>
                  {selectedSymbol ? `Bid/Ask for ${selectedSymbol}` : 'Select a stock to view market depth'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedStock?.marketDepth ? (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Asks (Sellers)</h4>
                      <div className="space-y-1">
                        {selectedStock.marketDepth.asks.slice(0, 5).map((ask, index) => (
                          <div key={index} className="flex justify-between text-xs">
                            <span className="text-red-600">{formatPrice(ask.price)}</span>
                            <span className="text-gray-500">{ask.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="border-t pt-2">
                      <div className="flex justify-between text-sm font-medium">
                        <span>Current Price</span>
                        <span>{formatPrice(selectedStock.price)}</span>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Bids (Buyers)</h4>
                      <div className="space-y-1">
                        {selectedStock.marketDepth.bids.slice(0, 5).map((bid, index) => (
                          <div key={index} className="flex justify-between text-xs">
                            <span className="text-green-600">{formatPrice(bid.price)}</span>
                            <span className="text-gray-500">{bid.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Select a stock to view market depth
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="us" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* US Stock List */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>NASDAQ Live Prices</CardTitle>
                <CardDescription>Real-time prices from US markets</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Symbol</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Change</TableHead>
                      <TableHead>Volume</TableHead>
                      <TableHead>Updated</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {US_STOCKS.map(symbol => {
                      const data = usData[symbol];
                      return (
                        <TableRow 
                          key={symbol}
                          className={`cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 ${
                            selectedSymbol === symbol ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                          }`}
                          onClick={() => setSelectedSymbol(symbol)}
                        >
                          <TableCell className="font-medium">{symbol}</TableCell>
                          <TableCell>
                            {data ? formatPrice(data.price) : '-'}
                          </TableCell>
                          <TableCell>
                            {data ? (
                              <div className={`flex items-center ${
                                data.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {data.changePercent >= 0 ? (
                                  <TrendingUp className="w-3 h-3 mr-1" />
                                ) : (
                                  <TrendingDown className="w-3 h-3 mr-1" />
                                )}
                                {data.changePercent.toFixed(2)}%
                              </div>
                            ) : '-'}
                          </TableCell>
                          <TableCell>
                            {data ? formatVolume(data.volume) : '-'}
                          </TableCell>
                          <TableCell className="text-xs text-gray-500">
                            {data ? new Date(data.timestamp).toLocaleTimeString() : '-'}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Market Depth for US */}
            <Card>
              <CardHeader>
                <CardTitle>Level II Data</CardTitle>
                <CardDescription>
                  {selectedSymbol ? `Market depth for ${selectedSymbol}` : 'Select a stock to view Level II data'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedStock?.marketDepth ? (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Asks (Sellers)</h4>
                      <div className="space-y-1">
                        {selectedStock.marketDepth.asks.slice(0, 5).map((ask, index) => (
                          <div key={index} className="flex justify-between text-xs">
                            <span className="text-red-600">{formatPrice(ask.price)}</span>
                            <span className="text-gray-500">{ask.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="border-t pt-2">
                      <div className="flex justify-between text-sm font-medium">
                        <span>Current Price</span>
                        <span>{formatPrice(selectedStock.price)}</span>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Bids (Buyers)</h4>
                      <div className="space-y-1">
                        {selectedStock.marketDepth.bids.slice(0, 5).map((bid, index) => (
                          <div key={index} className="flex justify-between text-xs">
                            <span className="text-green-600">{formatPrice(bid.price)}</span>
                            <span className="text-gray-500">{bid.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Select a stock to view Level II data
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
