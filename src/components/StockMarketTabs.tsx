
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Globe, IndianRupee, Bitcoin, TrendingUp } from 'lucide-react';
import { IndianMarketDashboard } from './IndianMarketDashboard';
import { Trading } from './Trading';

export const StockMarketTabs = () => {
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bitcoin className="w-5 h-5 mr-2" />
                Cryptocurrency Market
              </CardTitle>
              <CardDescription>
                Trade popular cryptocurrencies with real-time prices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { symbol: 'BTC', name: 'Bitcoin', price: 45000, change: 2.5 },
                  { symbol: 'ETH', name: 'Ethereum', price: 3200, change: -1.2 },
                  { symbol: 'BNB', name: 'Binance Coin', price: 320, change: 0.8 },
                  { symbol: 'ADA', name: 'Cardano', price: 0.52, change: 1.5 },
                  { symbol: 'SOL', name: 'Solana', price: 95, change: -2.1 },
                  { symbol: 'DOT', name: 'Polkadot', price: 7.2, change: 0.3 }
                ].map((crypto) => (
                  <Card key={crypto.symbol}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{crypto.symbol}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{crypto.name}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">${crypto.price.toLocaleString()}</p>
                          <Badge variant={crypto.change >= 0 ? "default" : "destructive"}>
                            {crypto.change >= 0 ? '+' : ''}{crypto.change}%
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
