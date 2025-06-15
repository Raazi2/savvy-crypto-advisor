import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TrendingUp, TrendingDown, IndianRupee, Calculator, Target, PiggyBank, RefreshCw } from 'lucide-react';
import { indianMarketService } from '@/services/indianMarketService';

type MarketStatus = 'OPEN' | 'CLOSED' | 'PRE_OPEN';

interface MarketStatusInfo {
  status: MarketStatus;
  nextSession: string;
}

export const IndianMarketDashboard = () => {
  const [stocks, setStocks] = useState([]);
  const [marketStatus, setMarketStatus] = useState<MarketStatusInfo>({ 
    status: 'CLOSED' as MarketStatus, 
    nextSession: '' 
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // SIP Calculator state
  const [sipParams, setSipParams] = useState({
    monthlyAmount: 5000,
    annualReturn: 12,
    years: 10
  });
  const [sipResult, setSipResult] = useState(null);
  
  // PPF Calculator state
  const [ppfParams, setPpfParams] = useState({
    yearlyContribution: 100000,
    years: 15
  });
  const [ppfResult, setPpfResult] = useState(null);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      setRefreshing(true);
      const [stockData, status] = await Promise.all([
        indianMarketService.getIndianStocks(),
        Promise.resolve(indianMarketService.getMarketStatus())
      ]);
      setStocks(stockData);
      setMarketStatus(status);
    } catch (error) {
      console.error('Error fetching Indian market data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const calculateSIP = () => {
    const result = indianMarketService.calculateSIP(
      sipParams.monthlyAmount,
      sipParams.annualReturn,
      sipParams.years
    );
    setSipResult(result);
  };

  const calculatePPF = () => {
    const result = indianMarketService.calculatePPF(
      ppfParams.yearlyContribution,
      ppfParams.years
    );
    setPpfResult(result);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-32"></div>
              </CardHeader>
              <CardContent>
                <div className="h-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Market Status */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <IndianRupee className="w-8 h-8 mr-2" />
            Indian Stock Market
          </h1>
          <p className="text-gray-600 dark:text-gray-400 flex items-center mt-2">
            <Badge 
              variant={marketStatus.status === 'OPEN' ? 'default' : 'secondary'}
              className={marketStatus.status === 'OPEN' ? 'bg-green-500' : ''}
            >
              {marketStatus.status === 'OPEN' ? '🟢 Market Open' : 
               marketStatus.status === 'PRE_OPEN' ? '🟡 Pre-Open' : '🔴 Market Closed'}
            </Badge>
            <span className="ml-2">{marketStatus.nextSession}</span>
          </p>
        </div>
        <Button 
          onClick={fetchData} 
          disabled={refreshing}
          variant="outline"
          size="sm"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <Tabs defaultValue="nse-stocks" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="nse-stocks">NSE Stocks</TabsTrigger>
          <TabsTrigger value="sip-calculator">SIP Calculator</TabsTrigger>
          <TabsTrigger value="ppf-calculator">PPF Calculator</TabsTrigger>
          <TabsTrigger value="tax-planning">Tax Planning</TabsTrigger>
        </TabsList>

        <TabsContent value="nse-stocks">
          <Card>
            <CardHeader>
              <CardTitle>NSE Top Stocks</CardTitle>
              <CardDescription>
                Live prices from National Stock Exchange (NSE)
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
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stocks.map((stock) => (
                    <TableRow key={stock.symbol}>
                      <TableCell className="font-medium">{stock.symbol}</TableCell>
                      <TableCell>{stock.name}</TableCell>
                      <TableCell>{indianMarketService.formatIndianCurrency(stock.price)}</TableCell>
                      <TableCell>
                        <div className={`flex items-center ${
                          stock.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {stock.changePercent >= 0 ? (
                            <TrendingUp className="w-3 h-3 mr-1" />
                          ) : (
                            <TrendingDown className="w-3 h-3 mr-1" />
                          )}
                          {stock.changePercent.toFixed(2)}%
                        </div>
                      </TableCell>
                      <TableCell>{stock.volume.toLocaleString('en-IN')}</TableCell>
                      <TableCell>{indianMarketService.formatIndianNumber(stock.marketCap)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sip-calculator">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calculator className="w-5 h-5 mr-2" />
                  SIP Calculator
                </CardTitle>
                <CardDescription>
                  Calculate returns for Systematic Investment Plan
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="monthly-amount">Monthly Investment (₹)</Label>
                  <Input
                    id="monthly-amount"
                    type="number"
                    value={sipParams.monthlyAmount}
                    onChange={(e) => setSipParams(prev => ({ ...prev, monthlyAmount: parseInt(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="annual-return">Expected Annual Return (%)</Label>
                  <Input
                    id="annual-return"
                    type="number"
                    value={sipParams.annualReturn}
                    onChange={(e) => setSipParams(prev => ({ ...prev, annualReturn: parseFloat(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="years">Investment Period (Years)</Label>
                  <Input
                    id="years"
                    type="number"
                    value={sipParams.years}
                    onChange={(e) => setSipParams(prev => ({ ...prev, years: parseInt(e.target.value) }))}
                  />
                </div>
                <Button onClick={calculateSIP} className="w-full">
                  Calculate SIP Returns
                </Button>
              </CardContent>
            </Card>

            {sipResult && (
              <Card>
                <CardHeader>
                  <CardTitle>SIP Calculation Results</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Investment</p>
                    <p className="text-2xl font-bold">{indianMarketService.formatIndianCurrency(sipResult.totalInvestment)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Expected Returns</p>
                    <p className="text-2xl font-bold text-green-600">{indianMarketService.formatIndianCurrency(sipResult.expectedReturns)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Maturity Value</p>
                    <p className="text-3xl font-bold text-blue-600">{indianMarketService.formatIndianCurrency(sipResult.totalValue)}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="ppf-calculator">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PiggyBank className="w-5 h-5 mr-2" />
                  PPF Calculator
                </CardTitle>
                <CardDescription>
                  Calculate Public Provident Fund returns (Current rate: 7.1%)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="yearly-contribution">Yearly Contribution (₹)</Label>
                  <Input
                    id="yearly-contribution"
                    type="number"
                    value={ppfParams.yearlyContribution}
                    onChange={(e) => setPpfParams(prev => ({ ...prev, yearlyContribution: parseInt(e.target.value) }))}
                    max={150000}
                  />
                  <p className="text-xs text-gray-500 mt-1">Maximum limit: ₹1,50,000 per year</p>
                </div>
                <div>
                  <Label htmlFor="ppf-years">Investment Period (Years)</Label>
                  <Input
                    id="ppf-years"
                    type="number"
                    value={ppfParams.years}
                    onChange={(e) => setPpfParams(prev => ({ ...prev, years: parseInt(e.target.value) }))}
                    min={15}
                  />
                  <p className="text-xs text-gray-500 mt-1">Minimum lock-in: 15 years</p>
                </div>
                <Button onClick={calculatePPF} className="w-full">
                  Calculate PPF Returns
                </Button>
              </CardContent>
            </Card>

            {ppfResult && (
              <Card>
                <CardHeader>
                  <CardTitle>PPF Calculation Results</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Contribution</p>
                    <p className="text-2xl font-bold">{indianMarketService.formatIndianCurrency(ppfResult.totalContribution)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Interest Earned</p>
                    <p className="text-2xl font-bold text-green-600">{indianMarketService.formatIndianCurrency(ppfResult.interest)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Maturity Amount</p>
                    <p className="text-3xl font-bold text-blue-600">{indianMarketService.formatIndianCurrency(ppfResult.maturityAmount)}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="tax-planning">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  Tax Saving Options
                </CardTitle>
                <CardDescription>
                  Popular tax-saving instruments under different sections
                </CardDescription>
              </CardHeader>
              <CardContent>
                {indianMarketService.getTaxSavingOptions().map((section) => (
                  <div key={section.section} className="mb-6">
                    <h4 className="font-semibold mb-2">
                      Section {section.section} - Limit: {indianMarketService.formatIndianCurrency(section.limit)}
                    </h4>
                    <div className="space-y-2">
                      {section.options.map((option) => (
                        <Badge key={option} variant="outline" className="mr-2 mb-2">
                          {option}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>ELSS Mutual Funds</CardTitle>
                <CardDescription>
                  Equity Linked Savings Scheme - Best for 80C
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <h5 className="font-semibold text-green-800 dark:text-green-300">Benefits:</h5>
                    <ul className="text-sm text-green-700 dark:text-green-400 mt-2 space-y-1">
                      <li>• Tax deduction up to ₹1,50,000</li>
                      <li>• Potential for higher returns</li>
                      <li>• Shortest lock-in period (3 years)</li>
                      <li>• Equity exposure with tax benefits</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h5 className="font-semibold text-blue-800 dark:text-blue-300">Popular ELSS Funds:</h5>
                    <ul className="text-sm text-blue-700 dark:text-blue-400 mt-2 space-y-1">
                      <li>• Axis Long Term Equity Fund</li>
                      <li>• Mirae Asset Tax Saver Fund</li>
                      <li>• DSP Tax Saver Fund</li>
                      <li>• HDFC TaxSaver Fund</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
