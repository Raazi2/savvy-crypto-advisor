
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Newspaper, Search, TrendingUp, Clock, ExternalLink, Star } from "lucide-react";

const newsArticles = [
  {
    title: "Federal Reserve Signals Potential Rate Cut in Q4",
    source: "Financial Times",
    time: "2 hours ago",
    category: "Economics",
    summary: "Fed officials hint at possible interest rate reduction amid inflation concerns...",
    impact: "High",
    url: "#"
  },
  {
    title: "Tesla Stock Surges 8% on Strong Q3 Delivery Numbers",
    source: "Bloomberg",
    time: "4 hours ago",
    category: "Stocks",
    summary: "Electric vehicle maker beats analyst expectations with record deliveries...",
    impact: "Medium",
    url: "#"
  },
  {
    title: "Bitcoin Reaches New Monthly High Amid ETF Optimism",
    source: "CoinDesk",
    time: "6 hours ago",
    category: "Crypto",
    summary: "Cryptocurrency markets rally on increased institutional adoption...",
    impact: "Medium",
    url: "#"
  },
  {
    title: "Tech Sector Analysis: AI Stocks Continue Momentum",
    source: "Reuters",
    time: "8 hours ago",
    category: "Technology",
    summary: "Artificial intelligence companies show strong growth potential...",
    impact: "High",
    url: "#"
  }
];

const researchReports = [
  {
    title: "Q4 2024 Market Outlook",
    analyst: "Morgan Stanley",
    rating: "Buy",
    target: "$520",
    date: "Dec 13, 2024",
    summary: "Bullish outlook on technology sector with emphasis on AI and cloud computing..."
  },
  {
    title: "Energy Sector Deep Dive",
    analyst: "Goldman Sachs",
    rating: "Hold",
    target: "$85",
    date: "Dec 12, 2024",
    summary: "Mixed signals in energy markets with oil price volatility concerns..."
  },
  {
    title: "Emerging Markets Report",
    analyst: "JP Morgan",
    rating: "Buy",
    target: "$45",
    date: "Dec 11, 2024",
    summary: "Strong growth potential in Asian markets despite global headwinds..."
  }
];

const marketSentiment = [
  { metric: "Fear & Greed Index", value: 65, status: "Greed", color: "text-orange-600" },
  { metric: "VIX", value: 18.5, status: "Low Volatility", color: "text-green-600" },
  { metric: "Put/Call Ratio", value: 0.85, status: "Neutral", color: "text-blue-600" },
  { metric: "Bull/Bear Ratio", value: 2.3, status: "Bullish", color: "text-green-600" }
];

export const NewsResearch = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">News & Research</h2>
          <p className="text-slate-600 dark:text-slate-400">Stay informed with market news and expert analysis</p>
        </div>
        <div className="flex space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input placeholder="Search news..." className="pl-10 w-64" />
          </div>
        </div>
      </div>

      <Tabs defaultValue="news" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="news">Latest News</TabsTrigger>
          <TabsTrigger value="research">Research Reports</TabsTrigger>
          <TabsTrigger value="sentiment">Market Sentiment</TabsTrigger>
          <TabsTrigger value="watchlist">Watchlist News</TabsTrigger>
        </TabsList>

        <TabsContent value="news" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {newsArticles.map((article, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{article.title}</CardTitle>
                        <CardDescription className="text-sm">{article.summary}</CardDescription>
                      </div>
                      <Badge 
                        variant={article.impact === 'High' ? 'destructive' : article.impact === 'Medium' ? 'default' : 'secondary'}
                        className="ml-2"
                      >
                        {article.impact}
                      </Badge>
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
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Trending Topics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {['Federal Reserve', 'AI Stocks', 'Bitcoin ETF', 'Q4 Earnings', 'Tech Rally'].map((topic, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded">
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
                  <div className="space-y-2">
                    {[
                      { symbol: 'TSLA', change: '+8.2%', price: '$245.67' },
                      { symbol: 'NVDA', change: '+5.4%', price: '$485.23' },
                      { symbol: 'AAPL', change: '-2.1%', price: '$185.43' },
                      { symbol: 'MSFT', change: '+3.7%', price: '$365.12' }
                    ].map((stock, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="font-semibold">{stock.symbol}</span>
                        <div className="text-right">
                          <div className="text-sm">{stock.price}</div>
                          <div className={`text-xs ${stock.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                            {stock.change}
                          </div>
                        </div>
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
            {researchReports.map((report, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{report.title}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge variant={report.rating === 'Buy' ? 'default' : report.rating === 'Hold' ? 'secondary' : 'destructive'}>
                        {report.rating}
                      </Badge>
                      <Star className="w-4 h-4 text-yellow-500" />
                    </div>
                  </div>
                  <CardDescription>{report.analyst} • {report.date}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{report.summary}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold">Price Target: {report.target}</span>
                    <Button variant="outline" size="sm">Read Full Report</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sentiment" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {marketSentiment.map((item, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{item.metric}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold">{item.value}</span>
                    <span className={`font-semibold ${item.color}`}>{item.status}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Sentiment Analysis</CardTitle>
              <CardDescription>Overall market sentiment based on multiple indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">Bullish</div>
                <div className="text-sm text-slate-600 dark:text-slate-400 mb-4">Markets showing optimistic sentiment</div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4">
                  <div className="bg-green-600 h-4 rounded-full" style={{ width: '72%' }}></div>
                </div>
                <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 mt-2">
                  <span>Bearish</span>
                  <span>Neutral</span>
                  <span>Bullish</span>
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
                <p className="text-slate-600 dark:text-slate-400">Add stocks to your watchlist to see personalized news here</p>
                <Button className="mt-4">Add to Watchlist</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
