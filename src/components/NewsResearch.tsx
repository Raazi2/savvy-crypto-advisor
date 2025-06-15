
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Newspaper, Search, TrendingUp, Clock, ExternalLink, Star, Filter, Bookmark, Share2, ThumbsUp, Eye, RefreshCw, Calendar, AlertTriangle, BarChart3 } from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface NewsArticle {
  id: string;
  title: string;
  source: string;
  time: string;
  category: string;
  summary: string;
  impact: 'High' | 'Medium' | 'Low';
  url: string;
  imageUrl?: string;
  sentiment: 'Positive' | 'Negative' | 'Neutral';
  views: number;
  likes: number;
  bookmarked: boolean;
  trending: boolean;
}

interface ResearchReport {
  id: string;
  title: string;
  analyst: string;
  rating: 'Buy' | 'Hold' | 'Sell';
  target: string;
  date: string;
  summary: string;
  sector: string;
  confidence: number;
  priceTarget: number;
  currentPrice: number;
}

interface MarketAlert {
  id: string;
  type: 'BREAKOUT' | 'EARNINGS' | 'NEWS' | 'TECHNICAL';
  symbol: string;
  message: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  timestamp: string;
}

const categories = ['All', 'Economics', 'Stocks', 'Crypto', 'Technology', 'Energy', 'Healthcare', 'Finance'];
const sources = ['All Sources', 'Bloomberg', 'Reuters', 'Financial Times', 'CNBC', 'MarketWatch', 'Yahoo Finance'];
const timeFilters = ['All Time', 'Last Hour', 'Last 24 Hours', 'Last Week', 'Last Month'];

export const NewsResearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSource, setSelectedSource] = useState("All Sources");
  const [selectedTimeFilter, setSelectedTimeFilter] = useState("Last 24 Hours");
  const [showOnlyBookmarked, setShowOnlyBookmarked] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [sortBy, setSortBy] = useState("time");
  const { toast } = useToast();

  // Fetch live news data
  const { data: newsData, isLoading: newsLoading, refetch: refetchNews } = useQuery({
    queryKey: ['news', selectedCategory, selectedSource, selectedTimeFilter],
    queryFn: async () => {
      console.log('Fetching live news data...');
      
      // Simulate API call to news service
      const mockNews: NewsArticle[] = [
        {
          id: '1',
          title: 'Federal Reserve Signals Potential Rate Cut in Q4',
          source: 'Financial Times',
          time: '2 hours ago',
          category: 'Economics',
          summary: 'Fed officials hint at possible interest rate reduction amid inflation concerns and economic uncertainty...',
          impact: 'High',
          url: '#',
          imageUrl: '/placeholder.svg',
          sentiment: 'Positive',
          views: 15420,
          likes: 342,
          bookmarked: false,
          trending: true
        },
        {
          id: '2',
          title: 'Tesla Stock Surges 8% on Strong Q3 Delivery Numbers',
          source: 'Bloomberg',
          time: '4 hours ago',
          category: 'Stocks',
          summary: 'Electric vehicle maker beats analyst expectations with record deliveries, boosting investor confidence...',
          impact: 'Medium',
          url: '#',
          imageUrl: '/placeholder.svg',
          sentiment: 'Positive',
          views: 12300,
          likes: 287,
          bookmarked: true,
          trending: true
        },
        {
          id: '3',
          title: 'Bitcoin Reaches New Monthly High Amid ETF Optimism',
          source: 'CoinDesk',
          time: '6 hours ago',
          category: 'Crypto',
          summary: 'Cryptocurrency markets rally on increased institutional adoption and regulatory clarity...',
          impact: 'Medium',
          url: '#',
          sentiment: 'Positive',
          views: 9850,
          likes: 195,
          bookmarked: false,
          trending: false
        },
        {
          id: '4',
          title: 'Tech Sector Analysis: AI Stocks Continue Momentum',
          source: 'Reuters',
          time: '8 hours ago',
          category: 'Technology',
          summary: 'Artificial intelligence companies show strong growth potential with increasing enterprise adoption...',
          impact: 'High',
          url: '#',
          sentiment: 'Positive',
          views: 18200,
          likes: 423,
          bookmarked: false,
          trending: true
        },
        {
          id: '5',
          title: 'Energy Markets Face Volatility Amid Geopolitical Tensions',
          source: 'MarketWatch',
          time: '12 hours ago',
          category: 'Energy',
          summary: 'Oil prices fluctuate as global supply concerns meet weakening demand forecasts...',
          impact: 'High',
          url: '#',
          sentiment: 'Negative',
          views: 7650,
          likes: 156,
          bookmarked: false,
          trending: false
        }
      ];

      return mockNews;
    },
    refetchInterval: autoRefresh ? 300000 : false, // 5 minutes
  });

  // Fetch research reports
  const { data: researchData, isLoading: researchLoading } = useQuery({
    queryKey: ['research-reports'],
    queryFn: async () => {
      console.log('Fetching research reports...');
      
      const mockReports: ResearchReport[] = [
        {
          id: '1',
          title: 'Q4 2024 Market Outlook',
          analyst: 'Morgan Stanley',
          rating: 'Buy',
          target: '$520',
          date: 'Dec 13, 2024',
          summary: 'Bullish outlook on technology sector with emphasis on AI and cloud computing growth...',
          sector: 'Technology',
          confidence: 85,
          priceTarget: 520,
          currentPrice: 485
        },
        {
          id: '2',
          title: 'Energy Sector Deep Dive',
          analyst: 'Goldman Sachs',
          rating: 'Hold',
          target: '$85',
          date: 'Dec 12, 2024',
          summary: 'Mixed signals in energy markets with oil price volatility concerns offsetting renewable growth...',
          sector: 'Energy',
          confidence: 72,
          priceTarget: 85,
          currentPrice: 82
        },
        {
          id: '3',
          title: 'Emerging Markets Report',
          analyst: 'JP Morgan',
          rating: 'Buy',
          target: '$45',
          date: 'Dec 11, 2024',
          summary: 'Strong growth potential in Asian markets despite global headwinds and currency volatility...',
          sector: 'International',
          confidence: 78,
          priceTarget: 45,
          currentPrice: 41
        }
      ];

      return mockReports;
    },
  });

  // Fetch market alerts
  const { data: alertsData, isLoading: alertsLoading } = useQuery({
    queryKey: ['market-alerts'],
    queryFn: async () => {
      console.log('Fetching market alerts...');
      
      const mockAlerts: MarketAlert[] = [
        {
          id: '1',
          type: 'BREAKOUT',
          symbol: 'NVDA',
          message: 'NVIDIA breaks above $500 resistance level with high volume',
          severity: 'HIGH',
          timestamp: '15 minutes ago'
        },
        {
          id: '2',
          type: 'EARNINGS',
          symbol: 'AAPL',
          message: 'Apple earnings call scheduled for tomorrow at 5 PM EST',
          severity: 'MEDIUM',
          timestamp: '1 hour ago'
        },
        {
          id: '3',
          type: 'NEWS',
          symbol: 'TSLA',
          message: 'Tesla announces new battery technology breakthrough',
          severity: 'HIGH',
          timestamp: '2 hours ago'
        }
      ];

      return mockAlerts;
    },
    refetchInterval: 60000, // 1 minute
  });

  // Filter news based on search and filters
  const filteredNews = newsData?.filter(article => {
    if (searchTerm && !article.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !article.summary.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (selectedCategory !== 'All' && article.category !== selectedCategory) {
      return false;
    }
    if (selectedSource !== 'All Sources' && article.source !== selectedSource) {
      return false;
    }
    if (showOnlyBookmarked && !article.bookmarked) {
      return false;
    }
    return true;
  });

  // Sort news
  const sortedNews = filteredNews?.sort((a, b) => {
    switch (sortBy) {
      case 'views':
        return b.views - a.views;
      case 'likes':
        return b.likes - a.likes;
      case 'impact':
        const impactOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
        return impactOrder[b.impact] - impactOrder[a.impact];
      default:
        return 0; // Keep original order for time
    }
  });

  const handleBookmark = (articleId: string) => {
    // In a real app, this would update the database
    toast({
      title: "Bookmarked",
      description: "Article saved to your reading list",
    });
  };

  const handleLike = (articleId: string) => {
    // In a real app, this would update the database
    toast({
      title: "Liked",
      description: "Your feedback helps improve recommendations",
    });
  };

  const handleShare = (article: NewsArticle) => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.summary,
        url: article.url,
      });
    } else {
      navigator.clipboard.writeText(article.url);
      toast({
        title: "Link copied",
        description: "Article link copied to clipboard",
      });
    }
  };

  const marketSentiment = [
    { metric: "Fear & Greed Index", value: 65, status: "Greed", color: "text-orange-600", change: "+5" },
    { metric: "VIX", value: 18.5, status: "Low Volatility", color: "text-green-600", change: "-2.3" },
    { metric: "Put/Call Ratio", value: 0.85, status: "Neutral", color: "text-blue-600", change: "+0.05" },
    { metric: "Bull/Bear Ratio", value: 2.3, status: "Bullish", color: "text-green-600", change: "+0.2" }
  ];

  // Auto-refresh effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(() => {
        refetchNews();
      }, 300000); // 5 minutes
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh, refetchNews]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">News & Research</h2>
          <p className="text-slate-600 dark:text-slate-400">Stay informed with live market news and expert analysis</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetchNews()}
            className="flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </Button>
          <div className="flex items-center space-x-2">
            <Switch
              id="auto-refresh"
              checked={autoRefresh}
              onCheckedChange={setAutoRefresh}
            />
            <Label htmlFor="auto-refresh" className="text-sm">Auto-refresh</Label>
          </div>
        </div>
      </div>

      {/* Live Market Alerts */}
      <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950 dark:border-orange-800">
        <CardHeader>
          <CardTitle className="flex items-center text-orange-700 dark:text-orange-300">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Live Market Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {alertsData?.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border">
                <div className="flex items-center space-x-3">
                  <Badge variant={alert.severity === 'HIGH' ? 'destructive' : alert.severity === 'MEDIUM' ? 'default' : 'secondary'}>
                    {alert.type}
                  </Badge>
                  <span className="font-semibold">{alert.symbol}</span>
                  <span className="text-sm text-slate-600 dark:text-slate-400">{alert.message}</span>
                </div>
                <span className="text-xs text-slate-500">{alert.timestamp}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="news" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="news">Latest News</TabsTrigger>
          <TabsTrigger value="research">Research Reports</TabsTrigger>
          <TabsTrigger value="sentiment">Market Sentiment</TabsTrigger>
          <TabsTrigger value="watchlist">Watchlist News</TabsTrigger>
        </TabsList>

        <TabsContent value="news" className="space-y-6">
          {/* Advanced Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="w-5 h-5 mr-2" />
                Filters & Search
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder="Search news..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedSource} onValueChange={setSelectedSource}>
                  <SelectTrigger>
                    <SelectValue placeholder="Source" />
                  </SelectTrigger>
                  <SelectContent>
                    {sources.map((source) => (
                      <SelectItem key={source} value={source}>{source}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="time">Most Recent</SelectItem>
                    <SelectItem value="views">Most Viewed</SelectItem>
                    <SelectItem value="likes">Most Liked</SelectItem>
                    <SelectItem value="impact">High Impact</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-4 mt-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="bookmarked-only"
                    checked={showOnlyBookmarked}
                    onCheckedChange={setShowOnlyBookmarked}
                  />
                  <Label htmlFor="bookmarked-only" className="text-sm">Bookmarked only</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {newsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="animate-pulse">
                      <CardHeader>
                        <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full mt-2"></div>
                      </CardHeader>
                      <CardContent>
                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                sortedNews?.map((article) => (
                  <Card key={article.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                              {article.title}
                            </CardTitle>
                            {article.trending && (
                              <Badge variant="outline" className="text-red-500 border-red-500">
                                <TrendingUp className="w-3 h-3 mr-1" />
                                Trending
                              </Badge>
                            )}
                          </div>
                          <CardDescription className="text-sm">{article.summary}</CardDescription>
                        </div>
                        <div className="flex flex-col items-end space-y-2 ml-4">
                          <Badge 
                            variant={article.impact === 'High' ? 'destructive' : article.impact === 'Medium' ? 'default' : 'secondary'}
                          >
                            {article.impact}
                          </Badge>
                          <Badge 
                            variant="outline"
                            className={article.sentiment === 'Positive' ? 'text-green-600 border-green-600' : 
                                     article.sentiment === 'Negative' ? 'text-red-600 border-red-600' : 
                                     'text-gray-600 border-gray-600'}
                          >
                            {article.sentiment}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4 text-sm text-slate-600 dark:text-slate-400">
                          <span className="flex items-center">
                            <Newspaper className="w-4 h-4 mr-1" />
                            {article.source}
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {article.time}
                          </span>
                          <Badge variant="outline">{article.category}</Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-4 text-sm text-slate-500">
                            <span className="flex items-center">
                              <Eye className="w-4 h-4 mr-1" />
                              {article.views.toLocaleString()}
                            </span>
                            <span className="flex items-center">
                              <ThumbsUp className="w-4 h-4 mr-1" />
                              {article.likes}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleLike(article.id)}
                          >
                            <ThumbsUp className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleBookmark(article.id)}
                            className={article.bookmarked ? 'text-yellow-500' : ''}
                          >
                            <Bookmark className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleShare(article)}
                          >
                            <Share2 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Trending Topics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {['Federal Reserve', 'AI Stocks', 'Bitcoin ETF', 'Q4 Earnings', 'Tech Rally', 'Energy Crisis'].map((topic, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer">
                        <span className="text-sm">{topic}</span>
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Market Movers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { symbol: 'TSLA', change: '+8.2%', price: '$245.67', volume: '45.2M' },
                      { symbol: 'NVDA', change: '+5.4%', price: '$485.23', volume: '32.1M' },
                      { symbol: 'AAPL', change: '-2.1%', price: '$185.43', volume: '28.7M' },
                      { symbol: 'MSFT', change: '+3.7%', price: '$365.12', volume: '22.4M' }
                    ].map((stock, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <div>
                          <span className="font-semibold">{stock.symbol}</span>
                          <div className="text-xs text-slate-500">Vol: {stock.volume}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{stock.price}</div>
                          <div className={`text-xs ${stock.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                            {stock.change}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Economic Calendar</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {[
                      { event: 'Fed Meeting', time: 'Today 2:00 PM', impact: 'High' },
                      { event: 'GDP Report', time: 'Tomorrow 8:30 AM', impact: 'High' },
                      { event: 'CPI Data', time: 'Dec 15 8:30 AM', impact: 'Medium' },
                      { event: 'Retail Sales', time: 'Dec 16 10:00 AM', impact: 'Medium' }
                    ].map((event, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded">
                        <div>
                          <div className="text-sm font-medium">{event.event}</div>
                          <div className="text-xs text-slate-500 flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {event.time}
                          </div>
                        </div>
                        <Badge variant={event.impact === 'High' ? 'destructive' : 'default'}>
                          {event.impact}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="research" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {researchLoading ? (
              <div className="col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              researchData?.map((report) => (
                <Card key={report.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{report.title}</CardTitle>
                        <CardDescription>{report.analyst} • {report.date}</CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={report.rating === 'Buy' ? 'default' : report.rating === 'Hold' ? 'secondary' : 'destructive'}>
                          {report.rating}
                        </Badge>
                        <Star className="w-4 h-4 text-yellow-500" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{report.summary}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded">
                        <div className="text-sm text-slate-600 dark:text-slate-400">Price Target</div>
                        <div className="text-lg font-bold text-green-600">{report.target}</div>
                        <div className="text-xs text-slate-500">vs ${report.currentPrice} current</div>
                      </div>
                      <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded">
                        <div className="text-sm text-slate-600 dark:text-slate-400">Confidence</div>
                        <div className="text-lg font-bold">{report.confidence}%</div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mt-1">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${report.confidence}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <Badge variant="outline">{report.sector}</Badge>
                      <Button variant="outline" size="sm">Read Full Report</Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="sentiment" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {marketSentiment.map((item, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    {item.metric}
                    <Badge variant="outline" className="text-xs">
                      {item.change}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <span className="text-3xl font-bold">{item.value}</span>
                    <span className={`font-semibold text-lg ${item.color}`}>{item.status}</span>
                  </div>
                  <div className="mt-4">
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full ${
                          item.status.includes('Bullish') || item.status.includes('Greed') ? 'bg-green-600' :
                          item.status.includes('Bearish') || item.status.includes('Fear') ? 'bg-red-600' :
                          'bg-blue-600'
                        }`}
                        style={{ width: `${typeof item.value === 'number' ? (item.value / 100) * 100 : 50}%` }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Overall Market Sentiment Analysis
              </CardTitle>
              <CardDescription>Real-time sentiment based on multiple indicators and social media</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-5xl font-bold text-green-600 mb-2">Bullish</div>
                <div className="text-lg text-slate-600 dark:text-slate-400 mb-4">
                  Markets showing strong optimistic sentiment (72% confidence)
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-6 mb-4">
                  <div className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-6 rounded-full relative">
                    <div className="absolute right-7 top-0 bottom-0 w-1 bg-slate-800 rounded-full"></div>
                  </div>
                </div>
                <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                  <span>Extreme Fear</span>
                  <span>Neutral</span>
                  <span>Extreme Greed</span>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">+15%</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Positive News</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">68%</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Social Sentiment</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">85%</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Analyst Optimism</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="watchlist" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Watchlist News</CardTitle>
              <CardDescription>Latest news for your tracked stocks and crypto</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Newspaper className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Add stocks to your watchlist to see personalized news here
                </p>
                <Button className="mt-4">Add to Watchlist</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
