
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, TrendingDown, IndianRupee, Search, Filter, Star, Calculator, Calendar, PiggyBank } from 'lucide-react';
import { mutualFundService } from '@/services/mutualFundService';

export const MutualFundDashboard = () => {
  const [funds, setFunds] = useState([]);
  const [sipInvestments, setSipInvestments] = useState([]);
  const [amcs, setAmcs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedAMC, setSelectedAMC] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // SIP Calculator state
  const [sipCalc, setSipCalc] = useState({
    monthlyAmount: 5000,
    expectedReturn: 12,
    years: 10
  });
  const [sipProjection, setSipProjection] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [fundsData, sipData, amcData] = await Promise.all([
        mutualFundService.getMutualFunds(),
        mutualFundService.getSIPInvestments(),
        mutualFundService.getAMCs()
      ]);
      setFunds(fundsData);
      setSipInvestments(sipData);
      setAmcs(amcData);
    } catch (error) {
      console.error('Error fetching mutual fund data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredFunds = funds.filter(fund => {
    const matchesCategory = selectedCategory === 'All' || fund.category === selectedCategory;
    const matchesAMC = selectedAMC === 'All' || fund.amc === selectedAMC;
    const matchesSearch = fund.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         fund.amc.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesAMC && matchesSearch;
  });

  const calculateSIP = () => {
    const result = mutualFundService.calculateSIPProjection(
      sipCalc.monthlyAmount,
      sipCalc.expectedReturn,
      sipCalc.years
    );
    setSipProjection(result);
  };

  const totalSIPValue = sipInvestments.reduce((sum, sip) => sum + sip.currentValue, 0);
  const totalSIPInvested = sipInvestments.reduce((sum, sip) => sum + sip.totalInvested, 0);
  const totalSIPReturns = totalSIPValue - totalSIPInvested;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-32"></div>
              </CardHeader>
              <CardContent>
                <div className="h-16 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <PiggyBank className="w-8 h-8 mr-2" />
            Mutual Funds
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track, analyze and invest in Indian mutual funds
          </p>
        </div>
      </div>

      <Tabs defaultValue="my-sips" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="my-sips">My SIPs</TabsTrigger>
          <TabsTrigger value="explore-funds">Explore Funds</TabsTrigger>
          <TabsTrigger value="sip-calculator">SIP Calculator</TabsTrigger>
          <TabsTrigger value="amc-analysis">AMC Analysis</TabsTrigger>
          <TabsTrigger value="top-performers">Top Performers</TabsTrigger>
        </TabsList>

        <TabsContent value="my-sips">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Total SIP Value</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-600">
                  {mutualFundService.formatCurrency(totalSIPValue)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Invested: {mutualFundService.formatCurrency(totalSIPInvested)}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Total Returns</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-blue-600">
                  {mutualFundService.formatCurrency(totalSIPReturns)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {((totalSIPReturns / totalSIPInvested) * 100).toFixed(2)}% gain
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Active SIPs</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {sipInvestments.filter(sip => sip.status === 'Active').length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Monthly: {mutualFundService.formatCurrency(
                    sipInvestments.reduce((sum, sip) => sum + sip.monthlyAmount, 0)
                  )}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Your SIP Investments</CardTitle>
              <CardDescription>Track your systematic investment plans</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fund Name</TableHead>
                    <TableHead>Monthly SIP</TableHead>
                    <TableHead>Invested</TableHead>
                    <TableHead>Current Value</TableHead>
                    <TableHead>Returns</TableHead>
                    <TableHead>XIRR</TableHead>
                    <TableHead>Next SIP</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sipInvestments.map((sip) => (
                    <TableRow key={sip.id}>
                      <TableCell className="font-medium">{sip.fundName}</TableCell>
                      <TableCell>{mutualFundService.formatCurrency(sip.monthlyAmount)}</TableCell>
                      <TableCell>{mutualFundService.formatCurrency(sip.totalInvested)}</TableCell>
                      <TableCell>{mutualFundService.formatCurrency(sip.currentValue)}</TableCell>
                      <TableCell>
                        <div className="flex items-center text-green-600">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          {mutualFundService.formatCurrency(sip.absoluteReturn)}
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold text-blue-600">
                        {sip.xirr.toFixed(2)}%
                      </TableCell>
                      <TableCell>{new Date(sip.nextSipDate).toLocaleDateString('en-IN')}</TableCell>
                      <TableCell>
                        <Badge variant={sip.status === 'Active' ? 'default' : 'secondary'}>
                          {sip.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="explore-funds">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Search className="w-5 h-5 mr-2" />
                  Search & Filter Funds
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="search">Search Funds</Label>
                    <Input
                      id="search"
                      placeholder="Fund name or AMC..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All Categories</SelectItem>
                        <SelectItem value="Equity">Equity</SelectItem>
                        <SelectItem value="Debt">Debt</SelectItem>
                        <SelectItem value="Hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="amc">AMC</Label>
                    <Select value={selectedAMC} onValueChange={setSelectedAMC}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All AMCs</SelectItem>
                        {amcs.map((amc) => (
                          <SelectItem key={amc.id} value={amc.shortName}>
                            {amc.shortName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button onClick={fetchData} className="w-full">
                      <Filter className="w-4 h-4 mr-2" />
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mutual Funds ({filteredFunds.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fund Name</TableHead>
                      <TableHead>AMC</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>NAV</TableHead>
                      <TableHead>1Y Return</TableHead>
                      <TableHead>3Y Return</TableHead>
                      <TableHead>Risk</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Min SIP</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFunds.slice(0, 20).map((fund) => (
                      <TableRow key={fund.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{fund.name}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {fund.subCategory}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{fund.amc}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{fund.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-semibold">₹{fund.nav.toFixed(2)}</p>
                            <div className={`flex items-center text-sm ${
                              fund.navChangePercent >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {fund.navChangePercent >= 0 ? (
                                <TrendingUp className="w-3 h-3 mr-1" />
                              ) : (
                                <TrendingDown className="w-3 h-3 mr-1" />
                              )}
                              {fund.navChangePercent.toFixed(2)}%
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold text-blue-600">
                          {fund.returns1Year.toFixed(1)}%
                        </TableCell>
                        <TableCell className="font-semibold text-green-600">
                          {fund.returns3Year.toFixed(1)}%
                        </TableCell>
                        <TableCell>
                          <span className={mutualFundService.getRiskColor(fund.riskLevel)}>
                            {fund.riskLevel}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-500 mr-1" />
                            {fund.rating}/5
                          </div>
                        </TableCell>
                        <TableCell>₹{fund.sipMinAmount}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
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
                  Calculate future value of your SIP investments
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="sip-amount">Monthly SIP Amount (₹)</Label>
                  <Input
                    id="sip-amount"
                    type="number"
                    value={sipCalc.monthlyAmount}
                    onChange={(e) => setSipCalc(prev => ({ ...prev, monthlyAmount: parseInt(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="expected-return">Expected Annual Return (%)</Label>
                  <Input
                    id="expected-return"
                    type="number"
                    value={sipCalc.expectedReturn}
                    onChange={(e) => setSipCalc(prev => ({ ...prev, expectedReturn: parseFloat(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="investment-years">Investment Period (Years)</Label>
                  <Input
                    id="investment-years"
                    type="number"
                    value={sipCalc.years}
                    onChange={(e) => setSipCalc(prev => ({ ...prev, years: parseInt(e.target.value) }))}
                  />
                </div>
                <Button onClick={calculateSIP} className="w-full">
                  Calculate SIP Returns
                </Button>
              </CardContent>
            </Card>

            {sipProjection && (
              <Card>
                <CardHeader>
                  <CardTitle>SIP Projection Results</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Investment</p>
                    <p className="text-2xl font-bold">
                      {mutualFundService.formatCurrency(sipProjection.totalInvestment)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Expected Returns</p>
                    <p className="text-2xl font-bold text-green-600">
                      {mutualFundService.formatCurrency(sipProjection.expectedReturns)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Maturity Value</p>
                    <p className="text-3xl font-bold text-blue-600">
                      {mutualFundService.formatCurrency(sipProjection.totalValue)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="amc-analysis">
          <Card>
            <CardHeader>
              <CardTitle>Asset Management Companies (AMCs)</CardTitle>
              <CardDescription>
                Compare performance across different fund houses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {amcs.map((amc) => (
                  <Card key={amc.id}>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <h3 className="font-semibold text-lg">{amc.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {amc.shortName}
                        </p>
                        <div className="space-y-2">
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Total AUM</p>
                            <p className="font-bold text-lg">
                              {mutualFundService.formatCurrency(amc.totalAUM)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Total Funds</p>
                            <p className="font-semibold">{amc.fundCount}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="top-performers">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Funds</CardTitle>
              <CardDescription>
                Best performing mutual funds based on returns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {funds.sort((a, b) => b.returns1Year - a.returns1Year).slice(0, 10).map((fund, index) => (
                  <div key={fund.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                          {index + 1}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold">{fund.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {fund.amc} • {fund.subCategory}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600 text-lg">
                        {fund.returns1Year.toFixed(1)}%
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">1Y Return</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
