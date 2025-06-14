
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  Brain, 
  Target, 
  Shield, 
  Zap, 
  Star,
  BarChart3,
  RefreshCw,
  Lightbulb,
  Award,
  AlertTriangle,
  DollarSign
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface InvestmentIdea {
  id: string;
  symbol: string;
  name: string;
  sector: string;
  currentPrice: number;
  targetPrice: number;
  potentialReturn: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  confidence: number;
  reason: string;
  timeHorizon: string;
  analyst: string;
  lastUpdated: string;
  keyMetrics: {
    pe: number;
    growth: number;
    dividend: number;
    beta: number;
  };
}

interface TrendingTheme {
  id: string;
  name: string;
  description: string;
  performance: number;
  stocks: string[];
  trend: 'up' | 'down';
  confidence: number;
}

const MOCK_INVESTMENT_IDEAS: InvestmentIdea[] = [
  {
    id: '1',
    symbol: 'AAPL',
    name: 'Apple Inc.',
    sector: 'Technology',
    currentPrice: 185.50,
    targetPrice: 210.00,
    potentialReturn: 13.2,
    riskLevel: 'Low',
    confidence: 85,
    reason: 'Strong iPhone 15 sales, growing services revenue, and AI integration opportunities',
    timeHorizon: '6-12 months',
    analyst: 'AI Portfolio Manager',
    lastUpdated: '2 hours ago',
    keyMetrics: { pe: 24.5, growth: 8.2, dividend: 0.5, beta: 1.2 }
  },
  {
    id: '2',
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    sector: 'Technology',
    currentPrice: 420.30,
    targetPrice: 520.00,
    potentialReturn: 23.7,
    riskLevel: 'Medium',
    confidence: 92,
    reason: 'AI boom driving data center demand, strong GPU market position',
    timeHorizon: '3-6 months',
    analyst: 'AI Portfolio Manager',
    lastUpdated: '1 hour ago',
    keyMetrics: { pe: 65.2, growth: 45.8, dividend: 0.1, beta: 1.8 }
  },
  {
    id: '3',
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    sector: 'Technology',
    currentPrice: 375.20,
    targetPrice: 420.00,
    potentialReturn: 11.9,
    riskLevel: 'Low',
    confidence: 78,
    reason: 'Azure cloud growth, Office 365 expansion, and Copilot AI integration',
    timeHorizon: '6-12 months',
    analyst: 'AI Portfolio Manager',
    lastUpdated: '3 hours ago',
    keyMetrics: { pe: 28.1, growth: 12.4, dividend: 0.7, beta: 0.9 }
  },
  {
    id: '4',
    symbol: 'TSM',
    name: 'Taiwan Semiconductor',
    sector: 'Technology',
    currentPrice: 95.40,
    targetPrice: 115.00,
    potentialReturn: 20.5,
    riskLevel: 'Medium',
    confidence: 82,
    reason: 'Essential for AI chip production, strong technological moat',
    timeHorizon: '6-12 months',
    analyst: 'AI Portfolio Manager',
    lastUpdated: '4 hours ago',
    keyMetrics: { pe: 18.7, growth: 15.2, dividend: 2.1, beta: 1.1 }
  }
];

const TRENDING_THEMES: TrendingTheme[] = [
  {
    id: '1',
    name: 'Artificial Intelligence',
    description: 'Companies leading AI development and implementation',
    performance: 28.5,
    stocks: ['NVDA', 'MSFT', 'GOOGL', 'META'],
    trend: 'up',
    confidence: 95
  },
  {
    id: '2',
    name: 'Clean Energy',
    description: 'Renewable energy and sustainable technology companies',
    performance: 15.2,
    stocks: ['TSLA', 'ENPH', 'SEDG', 'FSLR'],
    trend: 'up',
    confidence: 78
  },
  {
    id: '3',
    name: 'Cybersecurity',
    description: 'Digital security and data protection solutions',
    performance: 12.8,
    stocks: ['CRM', 'CRWD', 'ZS', 'OKTA'],
    trend: 'up',
    confidence: 85
  }
];

export const InvestmentIdeas = () => {
  const [ideas, setIdeas] = useState<InvestmentIdea[]>(MOCK_INVESTMENT_IDEAS);
  const [themes, setThemes] = useState<TrendingTheme[]>(TRENDING_THEMES);
  const [loading, setLoading] = useState(false);
  const [selectedRisk, setSelectedRisk] = useState<string>('all');
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const { user } = useAuth();
  const { toast } = useToast();

  const refreshIdeas = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Ideas Updated",
        description: "Investment ideas have been refreshed with latest market data",
      });
    }, 2000);
  };

  const filteredIdeas = ideas.filter(idea => {
    const riskMatch = selectedRisk === 'all' || idea.riskLevel.toLowerCase() === selectedRisk;
    const sectorMatch = selectedSector === 'all' || idea.sector.toLowerCase() === selectedSector;
    return riskMatch && sectorMatch;
  });

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'text-green-400 bg-green-500/20';
      case 'Medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'High': return 'text-red-400 bg-red-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Investment Ideas</h1>
          <p className="text-slate-400">AI-curated investment suggestions based on your portfolio and market analysis</p>
        </div>
        <Button 
          onClick={refreshIdeas} 
          disabled={loading}
          variant="outline" 
          className="bg-white/5 border-white/20"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Updating...' : 'Refresh Ideas'}
        </Button>
      </div>

      {/* AI Insights Banner */}
      <Card className="backdrop-blur-xl bg-gradient-to-r from-blue-500/20 to-purple-600/20 border border-blue-500/30">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-1">AI Market Analysis</h3>
              <p className="text-blue-200">
                Based on your current portfolio and risk profile, we've identified 
                <span className="font-semibold"> {filteredIdeas.length} high-confidence opportunities</span> 
                with an average potential return of 
                <span className="font-semibold"> {(filteredIdeas.reduce((sum, idea) => sum + idea.potentialReturn, 0) / filteredIdeas.length).toFixed(1)}%</span>
              </p>
            </div>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              <Zap className="w-3 h-3 mr-1" />
              Live Analysis
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="ideas" className="space-y-6">
        <TabsList className="grid grid-cols-3 h-12 bg-white/10 border border-white/20">
          <TabsTrigger value="ideas">Investment Ideas</TabsTrigger>
          <TabsTrigger value="themes">Trending Themes</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio Optimization</TabsTrigger>
        </TabsList>

        <TabsContent value="ideas" className="space-y-6">
          {/* Filters */}
          <Card className="backdrop-blur-xl bg-white/10 border border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <label className="text-sm text-slate-300">Risk Level:</label>
                    <select 
                      value={selectedRisk}
                      onChange={(e) => setSelectedRisk(e.target.value)}
                      className="bg-white/5 border border-white/20 rounded px-3 py-1 text-white text-sm"
                    >
                      <option value="all">All Levels</option>
                      <option value="low">Low Risk</option>
                      <option value="medium">Medium Risk</option>
                      <option value="high">High Risk</option>
                    </select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <label className="text-sm text-slate-300">Sector:</label>
                    <select 
                      value={selectedSector}
                      onChange={(e) => setSelectedSector(e.target.value)}
                      className="bg-white/5 border border-white/20 rounded px-3 py-1 text-white text-sm"
                    >
                      <option value="all">All Sectors</option>
                      <option value="technology">Technology</option>
                      <option value="healthcare">Healthcare</option>
                      <option value="finance">Finance</option>
                      <option value="energy">Energy</option>
                    </select>
                  </div>
                </div>
                <p className="text-sm text-slate-400">
                  Showing {filteredIdeas.length} of {ideas.length} ideas
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Investment Ideas Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredIdeas.map((idea) => (
              <Card key={idea.id} className="backdrop-blur-xl bg-white/10 border border-white/20 hover:bg-white/15 transition-colors">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {idea.symbol.slice(0, 2)}
                        </span>
                      </div>
                      <div>
                        <CardTitle className="text-white text-lg">{idea.symbol}</CardTitle>
                        <p className="text-sm text-slate-400">{idea.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getRiskColor(idea.riskLevel)}>
                        {idea.riskLevel} Risk
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Price and Target */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">Current Price</p>
                      <p className="text-xl font-bold text-white">${idea.currentPrice.toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-400">Target Price</p>
                      <p className="text-xl font-bold text-green-400">${idea.targetPrice.toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-400">Potential Return</p>
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="w-4 h-4 text-green-400" />
                        <p className="text-xl font-bold text-green-400">+{idea.potentialReturn.toFixed(1)}%</p>
                      </div>
                    </div>
                  </div>

                  {/* Confidence and Time Horizon */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">AI Confidence</span>
                      <span className="text-sm text-white font-medium">{idea.confidence}%</span>
                    </div>
                    <Progress value={idea.confidence} className="h-2" />
                  </div>

                  {/* Reason */}
                  <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                    <p className="text-sm text-slate-300">{idea.reason}</p>
                  </div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-xs text-slate-400">P/E</p>
                      <p className="text-sm font-semibold text-white">{idea.keyMetrics.pe}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-slate-400">Growth</p>
                      <p className="text-sm font-semibold text-white">{idea.keyMetrics.growth}%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-slate-400">Dividend</p>
                      <p className="text-sm font-semibold text-white">{idea.keyMetrics.dividend}%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-slate-400">Beta</p>
                      <p className="text-sm font-semibold text-white">{idea.keyMetrics.beta}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center space-x-2 text-xs text-slate-400">
                      <span>{idea.timeHorizon}</span>
                      <span>•</span>
                      <span>{idea.lastUpdated}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline" className="bg-white/5 border-white/20">
                        <BarChart3 className="w-4 h-4 mr-1" />
                        Analyze
                      </Button>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        <DollarSign className="w-4 h-4 mr-1" />
                        Trade
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="themes" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {themes.map((theme) => (
              <Card key={theme.id} className="backdrop-blur-xl bg-white/10 border border-white/20 hover:bg-white/15 transition-colors">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white">{theme.name}</CardTitle>
                    <div className="flex items-center space-x-1">
                      {theme.trend === 'up' ? 
                        <TrendingUp className="w-4 h-4 text-green-400" /> : 
                        <TrendingDown className="w-4 h-4 text-red-400" />
                      }
                      <span className={`font-semibold ${theme.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                        +{theme.performance}%
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-slate-400">{theme.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">Market Confidence</span>
                      <span className="text-sm text-white font-medium">{theme.confidence}%</span>
                    </div>
                    <Progress value={theme.confidence} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-slate-400">Top Stocks:</p>
                    <div className="flex flex-wrap gap-2">
                      {theme.stocks.map((stock) => (
                        <Badge key={stock} variant="outline" className="text-xs border-white/20">
                          {stock}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    <Lightbulb className="w-4 h-4 mr-2" />
                    Explore Theme
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="portfolio" className="space-y-6">
          <Card className="backdrop-blur-xl bg-white/10 border border-white/20">
            <CardContent className="p-12 text-center">
              <Target className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Portfolio Optimization</h3>
              <p className="text-slate-400 mb-4">Get personalized recommendations to optimize your portfolio allocation</p>
              <Button variant="outline" className="bg-white/5 border-white/20">
                <Award className="w-4 h-4 mr-2" />
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
