
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calculator, TrendingUp, Award, ExternalLink } from 'lucide-react';
import { useBrokerDeepLink } from '@/components/BrokerDeepLinkManager';

interface BrokerageStructure {
  id: string;
  name: string;
  equity: {
    delivery: string;
    intraday: string;
    futures: string;
    options: string;
  };
  charges: {
    stt: number; // %
    transactionCharges: number; // %
    gst: number; // %
    sebiCharges: number; // per crore
    dpCharges: number; // per transaction
  };
  minimumBrokerage: {
    equity: number;
    futures: number;
    options: number;
  };
  specialOffers?: string[];
}

const BROKER_CHARGES: BrokerageStructure[] = [
  {
    id: 'zerodha',
    name: 'Zerodha',
    equity: {
      delivery: 'Free',
      intraday: '0.03% or ₹20 (whichever is lower)',
      futures: '0.03% or ₹20 (whichever is lower)',
      options: '₹20 per executed order'
    },
    charges: {
      stt: 0.1,
      transactionCharges: 0.00325,
      gst: 18,
      sebiCharges: 10,
      dpCharges: 15.93
    },
    minimumBrokerage: {
      equity: 0,
      futures: 20,
      options: 20
    },
    specialOffers: ['Free delivery trading', 'Advanced charting tools', 'API access']
  },
  {
    id: 'angelone',
    name: 'Angel One',
    equity: {
      delivery: 'Free',
      intraday: '0.25% or ₹20 (whichever is lower)',
      futures: '0.25% or ₹20 (whichever is lower)',
      options: '₹20 per executed order'
    },
    charges: {
      stt: 0.1,
      transactionCharges: 0.00325,
      gst: 18,
      sebiCharges: 10,
      dpCharges: 18.5
    },
    minimumBrokerage: {
      equity: 0,
      futures: 20,
      options: 20
    },
    specialOffers: ['4X margin funding', 'Free research reports', 'Smart API']
  },
  {
    id: 'upstox',
    name: 'Upstox',
    equity: {
      delivery: 'Free',
      intraday: '0.05% or ₹20 (whichever is lower)',
      futures: '0.05% or ₹20 (whichever is lower)',
      options: '₹20 per executed order'
    },
    charges: {
      stt: 0.1,
      transactionCharges: 0.00325,
      gst: 18,
      sebiCharges: 10,
      dpCharges: 15.93
    },
    minimumBrokerage: {
      equity: 0,
      futures: 20,
      options: 20
    },
    specialOffers: ['Mobile-first platform', 'Pro web terminal', 'Developer APIs']
  },
  {
    id: 'groww',
    name: 'Groww',
    equity: {
      delivery: 'Free',
      intraday: '0.05% or ₹20 (whichever is lower)',
      futures: '0.05% or ₹20 (whichever is lower)',
      options: '₹20 per executed order'
    },
    charges: {
      stt: 0.1,
      transactionCharges: 0.00325,
      gst: 18,
      sebiCharges: 10,
      dpCharges: 20
    },
    minimumBrokerage: {
      equity: 0,
      futures: 20,
      options: 20
    },
    specialOffers: ['Simple interface', 'Mutual fund platform', 'IPO applications']
  },
  {
    id: 'icici',
    name: 'ICICI Direct',
    equity: {
      delivery: '0.55% (min ₹25)',
      intraday: '0.05% (min ₹25)',
      futures: '0.05% (min ₹25)',
      options: '₹100 per lot or 2.5% of premium'
    },
    charges: {
      stt: 0.1,
      transactionCharges: 0.00325,
      gst: 18,
      sebiCharges: 10,
      dpCharges: 25
    },
    minimumBrokerage: {
      equity: 25,
      futures: 25,
      options: 100
    },
    specialOffers: ['Bank integration', 'Research reports', 'IPO financing']
  }
];

interface CalculationResult {
  brokerage: number;
  stt: number;
  transactionCharges: number;
  gst: number;
  sebiCharges: number;
  dpCharges: number;
  totalCharges: number;
  netAmount: number;
}

interface BrokerageCalculatorProps {
  symbol: string;
  currentPrice: number;
  assetType: 'stock' | 'crypto';
}

export const BrokerageCalculator: React.FC<BrokerageCalculatorProps> = ({ symbol, currentPrice, assetType }) => {
  const { openBrokerApp } = useBrokerDeepLink();
  const [tradeDetails, setTradeDetails] = useState({
    tradeType: 'delivery',
    quantity: '',
    price: currentPrice.toString(),
    selectedBroker: 'zerodha'
  });
  const [calculations, setCalculations] = useState<Record<string, CalculationResult>>({});
  const [bestBroker, setBestBroker] = useState<string>('');

  // Update price when currentPrice prop changes
  useEffect(() => {
    setTradeDetails(prev => ({ ...prev, price: currentPrice.toString() }));
  }, [currentPrice]);

  useEffect(() => {
    if (tradeDetails.quantity && tradeDetails.price) {
      calculateAllBrokers();
    }
  }, [tradeDetails]);

  const calculateBrokerage = (broker: BrokerageStructure, quantity: number, price: number, tradeType: string): CalculationResult => {
    const turnover = quantity * price;
    
    // Calculate brokerage
    let brokerage = 0;
    if (tradeType === 'delivery' && broker.equity.delivery === 'Free') {
      brokerage = 0;
    } else if (tradeType === 'intraday') {
      const percentage = broker.id === 'zerodha' ? 0.03 : 
                        broker.id === 'angelone' ? 0.25 :
                        broker.id === 'upstox' || broker.id === 'groww' ? 0.05 : 0.05;
      brokerage = Math.min((turnover * percentage) / 100, broker.minimumBrokerage.futures);
    } else if (tradeType === 'options') {
      brokerage = broker.minimumBrokerage.options;
    }

    // Calculate other charges (only for stocks, not crypto)
    const stt = assetType === 'stock' ? (turnover * broker.charges.stt) / 100 : 0;
    const transactionCharges = assetType === 'stock' ? (turnover * broker.charges.transactionCharges) / 100 : 0;
    const sebiCharges = assetType === 'stock' ? (turnover * broker.charges.sebiCharges) / 10000000 : 0; // per crore
    const gstOnBrokerage = (brokerage * broker.charges.gst) / 100;
    const gstOnCharges = (transactionCharges * broker.charges.gst) / 100;
    const dpCharges = (tradeType === 'delivery' && assetType === 'stock') ? broker.charges.dpCharges : 0;

    const totalCharges = brokerage + stt + transactionCharges + sebiCharges + gstOnBrokerage + gstOnCharges + dpCharges;
    const netAmount = turnover - totalCharges;

    return {
      brokerage: brokerage + gstOnBrokerage,
      stt,
      transactionCharges: transactionCharges + gstOnCharges,
      gst: gstOnBrokerage + gstOnCharges,
      sebiCharges,
      dpCharges,
      totalCharges,
      netAmount
    };
  };

  const calculateAllBrokers = () => {
    const quantity = parseInt(tradeDetails.quantity);
    const price = parseFloat(tradeDetails.price);
    
    if (!quantity || !price) return;

    const results: Record<string, CalculationResult> = {};
    let lowestCharges = Infinity;
    let bestBrokerId = '';

    BROKER_CHARGES.forEach(broker => {
      const result = calculateBrokerage(broker, quantity, price, tradeDetails.tradeType);
      results[broker.id] = result;
      
      if (result.totalCharges < lowestCharges) {
        lowestCharges = result.totalCharges;
        bestBrokerId = broker.id;
      }
    });

    setCalculations(results);
    setBestBroker(bestBrokerId);
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const handleOpenBroker = (brokerId: string) => {
    const stock = {
      symbol: symbol,
      price: parseFloat(tradeDetails.price || '0'),
    };
    
    openBrokerApp('order', stock, {
      quantity: parseInt(tradeDetails.quantity || '1'),
      brokerId
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calculator className="w-5 h-5 mr-2" />
            {assetType === 'crypto' ? 'Crypto Trading' : 'Brokerage'} Calculator - {symbol}
          </CardTitle>
          <CardDescription>
            Compare exact trading costs across different {assetType === 'crypto' ? 'crypto exchanges' : 'brokers'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <Label htmlFor="tradeType">Trade Type</Label>
              <Select value={tradeDetails.tradeType} onValueChange={(value) => 
                setTradeDetails(prev => ({ ...prev, tradeType: value }))
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="delivery">{assetType === 'crypto' ? 'Spot' : 'Delivery'}</SelectItem>
                  <SelectItem value="intraday">{assetType === 'crypto' ? 'Margin' : 'Intraday'}</SelectItem>
                  {assetType === 'stock' && <SelectItem value="options">Options</SelectItem>}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                type="number"
                value={tradeDetails.quantity}
                onChange={(e) => setTradeDetails(prev => ({ ...prev, quantity: e.target.value }))}
                placeholder="Enter quantity"
              />
            </div>

            <div>
              <Label htmlFor="price">Price per {assetType === 'crypto' ? 'Coin' : 'Share'} ({assetType === 'crypto' ? '$' : '₹'})</Label>
              <Input
                type="number"
                step="0.01"
                value={tradeDetails.price}
                onChange={(e) => setTradeDetails(prev => ({ ...prev, price: e.target.value }))}
                placeholder="Enter price"
              />
            </div>

            <div className="flex items-end">
              <Button onClick={calculateAllBrokers} className="w-full">
                Calculate Costs
              </Button>
            </div>
          </div>

          {Object.keys(calculations).length > 0 && (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 border rounded-lg">
                  <div className="text-sm text-gray-600">Total Investment</div>
                  <div className="text-2xl font-bold">
                    {assetType === 'crypto' ? '$' : '₹'}{(parseInt(tradeDetails.quantity || '0') * parseFloat(tradeDetails.price || '0')).toFixed(2)}
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="text-sm text-gray-600">Best {assetType === 'crypto' ? 'Exchange' : 'Broker'}</div>
                  <div className="text-lg font-bold flex items-center">
                    <Award className="w-4 h-4 mr-2 text-yellow-500" />
                    {BROKER_CHARGES.find(b => b.id === bestBroker)?.name}
                  </div>
                  <div className="text-sm text-green-600">
                    Lowest cost: {bestBroker && formatCurrency(calculations[bestBroker]?.totalCharges || 0)}
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="text-sm text-gray-600">Max Savings</div>
                  <div className="text-lg font-bold text-green-600">
                    {bestBroker && calculations[bestBroker] && (
                      formatCurrency(
                        Math.max(...Object.values(calculations).map(c => c.totalCharges)) - 
                        calculations[bestBroker].totalCharges
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Detailed Comparison Table */}
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{assetType === 'crypto' ? 'Exchange' : 'Broker'}</TableHead>
                      <TableHead>Brokerage</TableHead>
                      {assetType === 'stock' && (
                        <>
                          <TableHead>STT</TableHead>
                          <TableHead>Transaction Charges</TableHead>
                          <TableHead>DP Charges</TableHead>
                        </>
                      )}
                      <TableHead>Total Charges</TableHead>
                      <TableHead>Net Amount</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {BROKER_CHARGES.map((broker) => {
                      const calc = calculations[broker.id];
                      if (!calc) return null;

                      return (
                        <TableRow key={broker.id} className={bestBroker === broker.id ? 'bg-green-50 dark:bg-green-900/20' : ''}>
                          <TableCell>
                            <div className="flex items-center">
                              <div>
                                <div className="font-medium">{broker.name}</div>
                                {bestBroker === broker.id && (
                                  <Badge variant="default" className="mt-1">
                                    <Award className="w-3 h-3 mr-1" />
                                    Best Option
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{formatCurrency(calc.brokerage)}</TableCell>
                          {assetType === 'stock' && (
                            <>
                              <TableCell>{formatCurrency(calc.stt)}</TableCell>
                              <TableCell>{formatCurrency(calc.transactionCharges)}</TableCell>
                              <TableCell>{formatCurrency(calc.dpCharges)}</TableCell>
                            </>
                          )}
                          <TableCell className="font-bold">
                            {formatCurrency(calc.totalCharges)}
                          </TableCell>
                          <TableCell className="font-bold text-green-600">
                            {formatCurrency(calc.netAmount)}
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleOpenBroker(broker.id)}
                            >
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Trade
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Special Offers */}
              <div className="mt-6">
                <h3 className="font-semibold mb-4 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Special Offers & Features
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {BROKER_CHARGES.map((broker) => (
                    <div key={broker.id} className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">{broker.name}</h4>
                      <ul className="space-y-1">
                        {broker.specialOffers?.map((offer, index) => (
                          <li key={index} className="text-sm text-gray-600 dark:text-gray-400">
                            • {offer}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
