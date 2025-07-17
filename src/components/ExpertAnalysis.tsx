import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Star, TrendingUp, Eye, Heart, MessageCircle, Search, Filter, Crown } from 'lucide-react';

interface Expert {
  id: string;
  name: string;
  title: string;
  specialization: string[];
  rating: number;
  followers: number;
  successRate: number;
  totalRecommendations: number;
  premium: boolean;
  verified: boolean;
}

interface Analysis {
  id: string;
  expertId: string;
  expertName: string;
  title: string;
  summary: string;
  recommendation: 'buy' | 'sell' | 'hold';
  targetPrice?: number;
  currentPrice: number;
  symbol: string;
  publishedDate: string;
  likes: number;
  comments: number;
  views: number;
  premium: boolean;
  accuracy: number;
}

export const ExpertAnalysis = () => {
  const [experts] = useState<Expert[]>([
    {
      id: '1',
      name: 'Dr. Rakesh Sharma',
      title: 'Senior Investment Analyst',
      specialization: ['Technology', 'Healthcare', 'Growth Stocks'],
      rating: 4.8,
      followers: 12500,
      successRate: 78,
      totalRecommendations: 245,
      premium: true,
      verified: true
    },
    {
      id: '2',
      name: 'Priya Mehta',
      title: 'Crypto Strategy Expert',
      specialization: ['Cryptocurrency', 'DeFi', 'Blockchain'],
      rating: 4.6,
      followers: 8900,
      successRate: 65,
      totalRecommendations: 189,
      premium: false,
      verified: true
    },
    {
      id: '3',
      name: 'Amit Kumar',
      title: 'Value Investment Specialist',
      specialization: ['Value Investing', 'Banking', 'Energy'],
      rating: 4.9,
      followers: 15600,
      successRate: 82,
      totalRecommendations: 312,
      premium: true,
      verified: true
    }
  ]);

  const [analyses] = useState<Analysis[]>([
    {
      id: '1',
      expertId: '1',
      expertName: 'Dr. Rakesh Sharma',
      title: 'TCS: Strong Q3 Results Signal Continued Growth',
      summary: 'TCS reported excellent Q3 numbers with 15% YoY revenue growth. Digital transformation deals continue to drive momentum...',
      recommendation: 'buy',
      targetPrice: 4200,
      currentPrice: 3850,
      symbol: 'TCS',
      publishedDate: '2024-01-20',
      likes: 156,
      comments: 23,
      views: 1240,
      premium: false,
      accuracy: 85
    },
    {
      id: '2',
      expertId: '2',
      expertName: 'Priya Mehta',
      title: 'Bitcoin Analysis: Institutional Adoption Driving Growth',
      summary: 'Recent ETF approvals and institutional adoption suggest Bitcoin could reach new highs. Technical indicators show...',
      recommendation: 'buy',
      targetPrice: 55000,
      currentPrice: 48500,
      symbol: 'BTC-USD',
      publishedDate: '2024-01-19',
      likes: 89,
      comments: 45,
      views: 890,
      premium: true,
      accuracy: 72
    },
    {
      id: '3',
      expertId: '3',
      expertName: 'Amit Kumar',
      title: 'HDFC Bank: Attractive Valuation Post Correction',
      summary: 'Recent correction in HDFC Bank stock presents an attractive entry point for long-term investors. Strong fundamentals...',
      recommendation: 'buy',
      targetPrice: 1750,
      currentPrice: 1580,
      symbol: 'HDFCBANK',
      publishedDate: '2024-01-18',
      likes: 234,
      comments: 67,
      views: 1890,
      premium: false,
      accuracy: 89
    }
  ]);

  const [followedExperts, setFollowedExperts] = useState<string[]>(['1', '3']);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecialization, setFilterSpecialization] = useState('all');

  const getRecommendationColor = (recommendation: Analysis['recommendation']) => {
    switch (recommendation) {
      case 'buy': return 'bg-green-500';
      case 'sell': return 'bg-red-500';
      case 'hold': return 'bg-yellow-500';
    }
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 80) return 'text-green-500';
    if (accuracy >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const toggleFollow = (expertId: string) => {
    setFollowedExperts(prev => 
      prev.includes(expertId) 
        ? prev.filter(id => id !== expertId)
        : [...prev, expertId]
    );
  };

  const filteredExperts = experts.filter(expert => {
    const matchesSearch = expert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expert.specialization.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterSpecialization === 'all' || 
                         expert.specialization.some(spec => spec.toLowerCase().includes(filterSpecialization.toLowerCase()));
    return matchesSearch && matchesFilter;
  });

  const filteredAnalyses = analyses.filter(analysis => {
    const matchesSearch = analysis.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         analysis.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         analysis.expertName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Expert Analysis
          </h1>
          <p className="text-muted-foreground">
            Follow top analysts and get premium investment insights
          </p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Following</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{followedExperts.length}</div>
            <p className="text-xs text-muted-foreground">
              Expert analysts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Analysis</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              This week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Accuracy</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">78%</div>
            <p className="text-xs text-muted-foreground">
              Followed experts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Premium Access</CardTitle>
            <Crown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">
              Premium reports
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex space-x-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search experts or analysis..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="w-48">
          <select 
            className="w-full p-2 border rounded-md"
            value={filterSpecialization}
            onChange={(e) => setFilterSpecialization(e.target.value)}
          >
            <option value="all">All Specializations</option>
            <option value="technology">Technology</option>
            <option value="crypto">Cryptocurrency</option>
            <option value="banking">Banking</option>
            <option value="healthcare">Healthcare</option>
            <option value="energy">Energy</option>
          </select>
        </div>
      </div>

      <Tabs defaultValue="analysis" className="space-y-4">
        <TabsList>
          <TabsTrigger value="analysis">Latest Analysis</TabsTrigger>
          <TabsTrigger value="experts">Expert Profiles</TabsTrigger>
          <TabsTrigger value="following">Following</TabsTrigger>
          <TabsTrigger value="premium">Premium</TabsTrigger>
        </TabsList>

        <TabsContent value="analysis" className="space-y-4">
          <div className="space-y-4">
            {filteredAnalyses.map((analysis) => (
              <Card key={analysis.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{analysis.expertName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{analysis.expertName}</p>
                          <p className="text-xs text-muted-foreground">{new Date(analysis.publishedDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <CardTitle className="text-lg">{analysis.title}</CardTitle>
                      <CardDescription className="mt-2">{analysis.summary}</CardDescription>
                    </div>
                    <div className="flex flex-col items-end space-y-2 ml-4">
                      <Badge className={getRecommendationColor(analysis.recommendation)}>
                        {analysis.recommendation.toUpperCase()}
                      </Badge>
                      {analysis.premium && (
                        <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                          Premium
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Symbol</p>
                      <p className="font-semibold">{analysis.symbol}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Current Price</p>
                      <p className="font-semibold">₹{analysis.currentPrice}</p>
                    </div>
                    {analysis.targetPrice && (
                      <div>
                        <p className="text-sm text-muted-foreground">Target Price</p>
                        <p className="font-semibold text-green-500">₹{analysis.targetPrice}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-muted-foreground">Accuracy</p>
                      <p className={`font-semibold ${getAccuracyColor(analysis.accuracy)}`}>
                        {analysis.accuracy}%
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Heart className="h-4 w-4" />
                        <span>{analysis.likes}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="h-4 w-4" />
                        <span>{analysis.comments}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye className="h-4 w-4" />
                        <span>{analysis.views}</span>
                      </div>
                    </div>
                    <div className="space-x-2">
                      <Button variant="outline" size="sm">
                        Read Full Analysis
                      </Button>
                      <Button size="sm">
                        Follow Expert
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="experts" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredExperts.map((expert) => (
              <Card key={expert.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback>{expert.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center space-x-2">
                          <CardTitle className="text-lg">{expert.name}</CardTitle>
                          {expert.verified && (
                            <Badge variant="outline" className="text-blue-500 border-blue-500">
                              Verified
                            </Badge>
                          )}
                          {expert.premium && (
                            <Crown className="h-4 w-4 text-yellow-500" />
                          )}
                        </div>
                        <CardDescription>{expert.title}</CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Specialization</p>
                    <div className="flex flex-wrap gap-1">
                      {expert.specialization.map((spec, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Rating</p>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <p className="font-semibold">{expert.rating}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Followers</p>
                      <p className="font-semibold">{expert.followers.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Success Rate</p>
                      <p className={`font-semibold ${getAccuracyColor(expert.successRate)}`}>
                        {expert.successRate}%
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Reports</p>
                      <p className="font-semibold">{expert.totalRecommendations}</p>
                    </div>
                  </div>

                  <Button 
                    className="w-full"
                    variant={followedExperts.includes(expert.id) ? "outline" : "default"}
                    onClick={() => toggleFollow(expert.id)}
                  >
                    {followedExperts.includes(expert.id) ? 'Following' : 'Follow'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="following" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {experts
              .filter(expert => followedExperts.includes(expert.id))
              .map((expert) => (
                <Card key={expert.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback>{expert.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{expert.name}</CardTitle>
                        <CardDescription>{expert.title}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Success Rate</p>
                        <p className={`font-semibold ${getAccuracyColor(expert.successRate)}`}>
                          {expert.successRate}%
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">New Reports</p>
                        <p className="font-semibold text-blue-500">3</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" className="flex-1">
                        View Latest
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => toggleFollow(expert.id)}
                      >
                        Unfollow
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="premium" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Premium Analysis Access</CardTitle>
              <CardDescription>
                Get exclusive insights from top-rated analysts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <Crown className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Exclusive Reports</h3>
                  <p className="text-sm text-muted-foreground">
                    Access detailed analysis reports from verified experts
                  </p>
                </div>
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Early Access</h3>
                  <p className="text-sm text-muted-foreground">
                    Get recommendations before they go public
                  </p>
                </div>
                <div className="text-center">
                  <MessageCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Direct Chat</h3>
                  <p className="text-sm text-muted-foreground">
                    Ask questions directly to expert analysts
                  </p>
                </div>
              </div>
              
              <div className="text-center">
                <Button size="lg">
                  Upgrade to Premium - ₹999/month
                </Button>
                <p className="text-sm text-muted-foreground mt-2">
                  7-day free trial • Cancel anytime
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Premium Analysis Preview</h3>
            {analyses
              .filter(analysis => analysis.premium)
              .map((analysis) => (
                <Card key={analysis.id} className="opacity-75">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{analysis.title}</CardTitle>
                        <CardDescription className="mt-2">
                          {analysis.summary.substring(0, 100)}...
                        </CardDescription>
                      </div>
                      <Badge className="bg-yellow-500">Premium</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <Crown className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        This premium analysis is available to subscribers only
                      </p>
                      <Button className="mt-2" size="sm">
                        Unlock with Premium
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};