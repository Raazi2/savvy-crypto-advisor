
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, DollarSign, BarChart3, PieChart, Calculator } from 'lucide-react';

interface FundamentalMetrics {
  marketCap: number;
  peRatio: number;
  pegRatio: number;
  priceToBook: number;
  priceToSales: number;
  dividendYield: number;
  eps: number;
  revenue: number;
  revenueGrowth: number;
  profitMargin: number;
  roe: number;
  debtToEquity: number;
  currentRatio: number;
  quickRatio: number;
  bookValue: number;
  beta: number;
  analystRating: 'Strong Buy' | 'Buy' | 'Hold' | 'Sell' | 'Strong Sell';
  analystTarget: number;
  institutionalOwnership: number;
}

interface FundamentalAnalysisProps {
  symbol: string;
  currentPrice: number;
  companyName: string;
}

export const FundamentalAnalysis: React.FC<FundamentalAnalysisProps> = ({ 
  symbol, 
  currentPrice, 
  companyName 
}) => {
  const [metrics, setMetrics] = useState<FundamentalMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateFundamentalData();
  }, [symbol]);

  const generateFundamentalData = () => {
    setLoading(true);
    
    // Generate mock fundamental data (in real app, fetch from financial APIs)
    const marketCap = (50 + Math.random() * 2000) * 1000000000; // $50B - $2T
    const eps = 2 + Math.random() * 8; // $2-10 EPS
    const peRatio = currentPrice / eps;
    
    const mockMetrics: FundamentalMetrics = {
      marketCap,
      peRatio,
      pegRatio: 0.5 + Math.random() * 2, // 0.5-2.5
      priceToBook: 1 + Math.random() * 5, // 1-6
      priceToSales: 1 + Math.random() * 10, // 1-11
      dividendYield: Math.random() * 5, // 0-5%
      eps,
      revenue: marketCap * (0.2 + Math.random() * 0.8), // Revenue estimate
      revenueGrowth: -10 + Math.random() * 40, // -10% to 30% growth
      profitMargin: 5 + Math.random() * 25, // 5-30%
      roe: 5 + Math.random() * 25, // 5-30%
      debtToEquity: Math.random() * 2, // 0-2
      currentRatio: 1 + Math.random() * 2, // 1-3
      quickRatio: 0.5 + Math.random() * 1.5, // 0.5-2
      bookValue: currentPrice * (0.3 + Math.random() * 1.4), // Book value estimate
      beta: 0.5 + Math.random() * 2, // 0.5-2.5 beta
      analystRating: ['Strong Buy', 'Buy', 'Hold', 'Sell', 'Strong Sell'][Math.floor(Math.random() * 5)] as any,
      analystTarget: currentPrice * (0.9 + Math.random() * 0.4), // ±20% target
      institutionalOwnership: 30 + Math.random() * 60 // 30-90%
    };
    
    setMetrics(mockMetrics);
    setLoading(false);
  };

  const formatCurrency = (value: number, isLarge = false): string => {
    if (isLarge) {
      if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
      if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
      if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'Strong Buy': return 'bg-green-100 text-green-800 border-green-300';
      case 'Buy': return 'bg-green-50 text-green-700 border-green-200';
      case 'Hold': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Sell': return 'bg-red-50 text-red-700 border-red-200';
      case 'Strong Sell': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getMetricHealth = (metric: string, value: number): { color: string, status: string } => {
    switch (metric) {
      case 'pe':
        if (value < 15) return { color: 'text-green-600', status: 'Undervalued' };
        if (value > 25) return { color: 'text-red-600', status: 'Overvalued' };
        return { color: 'text-yellow-600', status: 'Fair Value' };
      case 'roe':
        if (value > 15) return { color: 'text-green-600', status: 'Excellent' };
        if (value < 10) return { color: 'text-red-600', status: 'Poor' };
        return { color: 'text-yellow-600', status: 'Good' };
      case 'debtToEquity':
        if (value < 0.5) return { color: 'text-green-600', status: 'Low Risk' };
        if (value > 1.5) return { color: 'text-red-600', status: 'High Risk' };
        return { color: 'text-yellow-600', status: 'Moderate' };
      default:
        return { color: 'text-gray-600', status: 'N/A' };
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calculator className="w-5 h-5 mr-2" />
            Fundamental Analysis - {symbol}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="p-4 border rounded-lg animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-16"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!metrics) return null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Calculator className="w-5 h-5 mr-2" />
              Fundamental Analysis - {companyName}
            </div>
            <Badge className={getRatingColor(metrics.analystRating)}>
              {metrics.analystRating}
            </Badge>
          </CardTitle>
          <CardDescription>
            Financial metrics and valuation analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Key Metrics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="p-4 border rounded-lg text-center">
              <div className="text-sm text-gray-600">Market Cap</div>
              <div className="text-xl font-bold">{formatCurrency(metrics.marketCap, true)}</div>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <div className="text-sm text-gray-600">P/E Ratio</div>
              <div className="text-xl font-bold">{metrics.peRatio.toFixed(2)}</div>
              <div className={`text-xs ${getMetricHealth('pe', metrics.peRatio).color}`}>
                {getMetricHealth('pe', metrics.peRatio).status}
              </div>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <div className="text-sm text-gray-600">EPS</div>
              <div className="text-xl font-bold">{formatCurrency(metrics.eps)}</div>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <div className="text-sm text-gray-600">Analyst Target</div>
              <div className="text-xl font-bold">{formatCurrency(metrics.analystTarget)}</div>
              <div className={`text-xs flex items-center justify-center ${
                metrics.analystTarget > currentPrice ? 'text-green-600' : 'text-red-600'
              }`}>
                {metrics.analystTarget > currentPrice ? (
                  <TrendingUp className="w-3 h-3 mr-1" />
                ) : (
                  <TrendingDown className="w-3 h-3 mr-1" />
                )}
                {((metrics.analystTarget - currentPrice) / currentPrice * 100).toFixed(1)}%
              </div>
            </div>
          </div>

          {/* Detailed Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Valuation Metrics */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center">
                <DollarSign className="w-4 h-4 mr-2" />
                Valuation Metrics
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>P/E Ratio:</span>
                  <span className="font-medium">{metrics.peRatio.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>PEG Ratio:</span>
                  <span className="font-medium">{metrics.pegRatio.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Price to Book:</span>
                  <span className="font-medium">{metrics.priceToBook.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Price to Sales:</span>
                  <span className="font-medium">{metrics.priceToSales.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Book Value:</span>
                  <span className="font-medium">{formatCurrency(metrics.bookValue)}</span>
                </div>
              </div>
            </div>

            {/* Profitability Metrics */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center">
                <BarChart3 className="w-4 h-4 mr-2" />
                Profitability
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Revenue Growth:</span>
                    <span className={`font-medium ${metrics.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {metrics.revenueGrowth >= 0 ? '+' : ''}{metrics.revenueGrowth.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={Math.max(0, Math.min(100, metrics.revenueGrowth + 50))} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Profit Margin:</span>
                    <span className="font-medium">{metrics.profitMargin.toFixed(1)}%</span>
                  </div>
                  <Progress value={metrics.profitMargin} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span>ROE:</span>
                    <span className={`font-medium ${getMetricHealth('roe', metrics.roe).color}`}>
                      {metrics.roe.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={metrics.roe} className="h-2" />
                </div>
                <div className="flex justify-between">
                  <span>Dividend Yield:</span>
                  <span className="font-medium">{metrics.dividendYield.toFixed(2)}%</span>
                </div>
              </div>
            </div>

            {/* Financial Health */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center">
                <PieChart className="w-4 h-4 mr-2" />
                Financial Health
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Debt to Equity:</span>
                    <span className={`font-medium ${getMetricHealth('debtToEquity', metrics.debtToEquity).color}`}>
                      {metrics.debtToEquity.toFixed(2)}
                    </span>
                  </div>
                  <div className={`text-xs ${getMetricHealth('debtToEquity', metrics.debtToEquity).color}`}>
                    {getMetricHealth('debtToEquity', metrics.debtToEquity).status}
                  </div>
                </div>
                <div className="flex justify-between">
                  <span>Current Ratio:</span>
                  <span className="font-medium">{metrics.currentRatio.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Quick Ratio:</span>
                  <span className="font-medium">{metrics.quickRatio.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Beta:</span>
                  <span className="font-medium">{metrics.beta.toFixed(2)}</span>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Institutional Own:</span>
                    <span className="font-medium">{metrics.institutionalOwnership.toFixed(1)}%</span>
                  </div>
                  <Progress value={metrics.institutionalOwnership} className="h-2" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
