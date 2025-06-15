
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Star, ExternalLink, Award, TrendingUp, Shield, Users } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';

interface BrokerFeatures {
  id: string;
  name: string;
  logo: string;
  brokerage: {
    equity: string;
    intraday: string;
    futures: string;
    options: string;
  };
  features: string[];
  rating: number;
  userCount: string;
  pros: string[];
  cons: string[];
  referralCode?: string;
  signupBonus?: string;
  websiteUrl: string;
  appStoreUrl?: string;
  playStoreUrl?: string;
  tradingTypes: string[];
  research: boolean;
  tradingPlatform: string[];
  customerSupport: string;
  marginFunding: boolean;
  ipoAccess: boolean;
  mutualFunds: boolean;
  bonds: boolean;
  commodities: boolean;
  forex: boolean;
}

const BROKER_DATA: BrokerFeatures[] = [
  {
    id: 'zerodha',
    name: 'Zerodha',
    logo: '🟢',
    brokerage: {
      equity: 'Free',
      intraday: '₹20',
      futures: '₹20',
      options: '₹20'
    },
    features: ['Free delivery', 'Advanced charts', 'Kite API', 'Low brokerage', 'Educational content'],
    rating: 4.2,
    userCount: '1.3 Cr+',
    pros: ['No delivery charges', 'Best trading platform', 'Educational resources', 'API access'],
    cons: ['Basic research', 'Limited customer support', 'No advisory services'],
    referralCode: 'FINTECH2024',
    signupBonus: '₹200 cashback',
    websiteUrl: 'https://zerodha.com',
    appStoreUrl: 'https://apps.apple.com/in/app/kite-by-zerodha/id1449453802',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.zerodha.kite3',
    tradingTypes: ['Equity', 'F&O', 'Commodity', 'Currency'],
    research: false,
    tradingPlatform: ['Kite Web', 'Kite Mobile', 'Pi'],
    customerSupport: 'Limited',
    marginFunding: true,
    ipoAccess: true,
    mutualFunds: true,
    bonds: true,
    commodities: true,
    forex: true
  },
  {
    id: 'angelone',
    name: 'Angel One',
    logo: '😇',
    brokerage: {
      equity: 'Free',
      intraday: '₹20',
      futures: '₹20',
      options: '₹20'
    },
    features: ['Free delivery', '4x margin', 'Research reports', 'Smart API', 'ARQ AI'],
    rating: 4.0,
    userCount: '2 Cr+',
    pros: ['Strong research', 'High margin funding', 'AI recommendations', 'Good customer support'],
    cons: ['Higher charges for premium features', 'App can be slow', 'Complex interface'],
    referralCode: 'ANGEL2024',
    signupBonus: '₹500 brokerage credit',
    websiteUrl: 'https://angelone.in',
    tradingTypes: ['Equity', 'F&O', 'Commodity', 'Currency', 'IPO'],
    research: true,
    tradingPlatform: ['Angel One Web', 'Angel One Mobile'],
    customerSupport: 'Good',
    marginFunding: true,
    ipoAccess: true,
    mutualFunds: true,
    bonds: true,
    commodities: true,
    forex: true
  },
  {
    id: 'upstox',
    name: 'Upstox',
    logo: '⬆️',
    brokerage: {
      equity: 'Free',
      intraday: '₹20',
      futures: '₹20',
      options: '₹20'
    },
    features: ['Free delivery', '0.05% intraday', 'Mobile first', 'Pro Web platform'],
    rating: 3.8,
    userCount: '1 Cr+',
    pros: ['Mobile-friendly', 'Fast execution', 'Good charting', 'Competitive pricing'],
    cons: ['Limited research', 'Basic features', 'Customer service issues'],
    referralCode: 'UPSTOX2024',
    websiteUrl: 'https://upstox.com',
    tradingTypes: ['Equity', 'F&O', 'Currency'],
    research: false,
    tradingPlatform: ['Upstox Pro Web', 'Upstox Pro Mobile'],
    customerSupport: 'Average',
    marginFunding: true,
    ipoAccess: true,
    mutualFunds: false,
    bonds: false,
    commodities: false,
    forex: false
  },
  {
    id: 'groww',
    name: 'Groww',
    logo: '🌱',
    brokerage: {
      equity: 'Free',
      intraday: '₹20',
      futures: '₹20',
      options: '₹20'
    },
    features: ['Free delivery', 'Simple UI', 'Mutual funds', 'US stocks', 'Educational content'],
    rating: 4.1,
    userCount: '5 Cr+',
    pros: ['User-friendly', 'Great for beginners', 'MF and stocks together', 'US market access'],
    cons: ['Limited advanced features', 'Basic charting', 'No commodities'],
    referralCode: 'GROWW2024',
    signupBonus: '₹100 cashback',
    websiteUrl: 'https://groww.in',
    tradingTypes: ['Equity', 'F&O', 'Mutual Funds', 'US Stocks'],
    research: true,
    tradingPlatform: ['Groww Web', 'Groww Mobile'],
    customerSupport: 'Good',
    marginFunding: false,
    ipoAccess: true,
    mutualFunds: true,
    bonds: false,
    commodities: false,
    forex: false
  },
  {
    id: 'icici',
    name: 'ICICI Direct',
    logo: '🏦',
    brokerage: {
      equity: '0.55%',
      intraday: '0.05%',
      futures: '₹25',
      options: '₹25'
    },
    features: ['Research reports', 'IPO access', 'Banking integration', 'Advisory services'],
    rating: 3.9,
    userCount: '50L+',
    pros: ['Excellent research', 'Banking integration', 'Premium advisory', 'Full-service broker'],
    cons: ['Higher brokerage', 'Complex platform', 'Expensive for small traders'],
    websiteUrl: 'https://icicidirect.com',
    tradingTypes: ['Equity', 'F&O', 'Commodity', 'Currency', 'Mutual Funds'],
    research: true,
    tradingPlatform: ['ICICI Direct Web', 'ICICI Direct Mobile'],
    customerSupport: 'Excellent',
    marginFunding: true,
    ipoAccess: true,
    mutualFunds: true,
    bonds: true,
    commodities: true,
    forex: true
  }
];

export const BrokerComparison = () => {
  const { settings, updateSettings } = useSettings();

  const handleSetAsDefault = (brokerId: string) => {
    updateSettings({
      preferences: {
        ...settings.preferences,
        defaultBroker: brokerId
      }
    });
  };

  const calculateScore = (broker: BrokerFeatures) => {
    let score = 0;
    
    // Rating contributes 30%
    score += (broker.rating / 5) * 30;
    
    // Features count contributes 25%
    score += (broker.features.length / 8) * 25;
    
    // Research capability contributes 20%
    score += broker.research ? 20 : 0;
    
    // Brokerage cost contributes 25% (lower is better)
    const avgCost = broker.brokerage.equity === 'Free' ? 0 : 
                   broker.brokerage.intraday === '₹20' ? 20 : 30;
    score += (1 - avgCost / 50) * 25;
    
    return Math.round(score);
  };

  const getBestBrokerFor = (type: string) => {
    switch (type) {
      case 'beginners':
        return BROKER_DATA.find(b => b.id === 'groww');
      case 'active-traders':
        return BROKER_DATA.find(b => b.id === 'zerodha');
      case 'research':
        return BROKER_DATA.find(b => b.id === 'icici');
      case 'low-cost':
        return BROKER_DATA.find(b => b.id === 'upstox');
      default:
        return BROKER_DATA[0];
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Broker Comparison</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Compare brokers, find the best fit for your trading style, and earn rewards through referrals
        </p>
      </div>

      {/* Best Picks */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Best for Beginners', type: 'beginners', icon: Users },
          { title: 'Best for Active Traders', type: 'active-traders', icon: TrendingUp },
          { title: 'Best Research', type: 'research', icon: Award },
          { title: 'Lowest Cost', type: 'low-cost', icon: Shield }
        ].map((category) => {
          const broker = getBestBrokerFor(category.type);
          if (!broker) return null;
          
          return (
            <Card key={category.type} className="border-2 border-blue-200 dark:border-blue-800">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <category.icon className="w-5 h-5 text-blue-600" />
                  <Badge variant="outline" className="text-xs">Best Pick</Badge>
                </div>
                <CardTitle className="text-sm">{category.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-xl">{broker.logo}</span>
                  <div>
                    <p className="font-semibold text-sm">{broker.name}</p>
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs">{broker.rating}</span>
                    </div>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  className="w-full"
                  onClick={() => handleSetAsDefault(broker.id)}
                >
                  Set as Default
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Detailed Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {BROKER_DATA.map((broker) => {
          const score = calculateScore(broker);
          const isDefault = settings.preferences.defaultBroker === broker.id;
          
          return (
            <Card key={broker.id} className={`relative ${isDefault ? 'ring-2 ring-blue-500' : ''}`}>
              {isDefault && (
                <Badge className="absolute -top-2 left-4 bg-blue-600 text-white">
                  Default Broker
                </Badge>
              )}
              
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{broker.logo}</span>
                    <div>
                      <h3 className="font-bold text-lg">{broker.name}</h3>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{broker.rating}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {broker.userCount} users
                        </Badge>
                      </div>
                    </div>
                  </div>
                  {broker.signupBonus && (
                    <Badge className="bg-green-600 text-white text-xs">
                      {broker.signupBonus}
                    </Badge>
                  )}
                </div>
                
                {/* Overall Score */}
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Overall Score</span>
                    <span className="text-sm font-bold">{score}/100</span>
                  </div>
                  <Progress value={score} className="h-2" />
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Brokerage */}
                <div>
                  <h4 className="font-semibold text-sm mb-2">Brokerage Charges</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>Delivery: <span className="font-medium text-green-600">{broker.brokerage.equity}</span></div>
                    <div>Intraday: <span className="font-medium">{broker.brokerage.intraday}</span></div>
                    <div>Futures: <span className="font-medium">{broker.brokerage.futures}</span></div>
                    <div>Options: <span className="font-medium">{broker.brokerage.options}</span></div>
                  </div>
                </div>

                {/* Trading Types */}
                <div>
                  <h4 className="font-semibold text-sm mb-2">Trading Segments</h4>
                  <div className="flex flex-wrap gap-1">
                    {broker.tradingTypes.map((type) => (
                      <Badge key={type} variant="outline" className="text-xs">
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Key Features */}
                <div>
                  <h4 className="font-semibold text-sm mb-2">Key Features</h4>
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    <div className="flex items-center space-x-1">
                      <span className={broker.research ? 'text-green-600' : 'text-red-600'}>
                        {broker.research ? '✓' : '✗'}
                      </span>
                      <span>Research</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className={broker.marginFunding ? 'text-green-600' : 'text-red-600'}>
                        {broker.marginFunding ? '✓' : '✗'}
                      </span>
                      <span>Margin</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className={broker.ipoAccess ? 'text-green-600' : 'text-red-600'}>
                        {broker.ipoAccess ? '✓' : '✗'}
                      </span>
                      <span>IPO</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className={broker.mutualFunds ? 'text-green-600' : 'text-red-600'}>
                        {broker.mutualFunds ? '✓' : '✗'}
                      </span>
                      <span>MF</span>
                    </div>
                  </div>
                </div>

                {/* Pros & Cons */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-sm mb-2 text-green-600">Pros</h4>
                    <ul className="text-xs space-y-1">
                      {broker.pros.slice(0, 3).map((pro, index) => (
                        <li key={index} className="flex items-start space-x-1">
                          <span className="text-green-600">+</span>
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-2 text-red-600">Cons</h4>
                    <ul className="text-xs space-y-1">
                      {broker.cons.slice(0, 3).map((con, index) => (
                        <li key={index} className="flex items-start space-x-1">
                          <span className="text-red-600">-</span>
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2 pt-4 border-t">
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => window.open(broker.websiteUrl, '_blank')}
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Open Account
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleSetAsDefault(broker.id)}
                      disabled={isDefault}
                    >
                      {isDefault ? 'Default' : 'Set Default'}
                    </Button>
                  </div>
                  
                  {broker.referralCode && (
                    <div className="text-center">
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Use code: <span className="font-mono font-bold text-blue-600">{broker.referralCode}</span>
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Referral Tracking Info */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Award className="w-5 h-5 mr-2" />
            Referral Rewards Program
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">₹200-500</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Cashback per signup</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">15-30%</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Commission sharing</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">Monthly</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Payout frequency</p>
            </div>
          </div>
          <p className="text-sm text-center mt-4 text-gray-600 dark:text-gray-400">
            Earn rewards when users sign up through your referral links. Track your earnings in the dashboard.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
