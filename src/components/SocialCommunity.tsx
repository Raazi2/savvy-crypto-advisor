
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Users, MessageCircle, ThumbsUp, Share2, TrendingUp, Award, Calendar, Search } from "lucide-react";

const discussions = [
  {
    id: 1,
    title: "NVDA Earnings Analysis - What's Next?",
    author: "TechTrader_99",
    avatar: "TT",
    time: "2 hours ago",
    replies: 24,
    likes: 87,
    category: "Stocks",
    preview: "Just analyzed NVDA's latest earnings. Revenue beat expectations but guidance seems conservative..."
  },
  {
    id: 2,
    title: "Bitcoin Support Level at $42K - Hold or Sell?",
    author: "CryptoMaster",
    avatar: "CM",
    time: "4 hours ago",
    replies: 31,
    likes: 156,
    category: "Crypto",
    preview: "BTC is testing crucial support. Technical analysis suggests this could be a good entry point..."
  },
  {
    id: 3,
    title: "Fed Rate Decision Impact on Small Caps",
    author: "MacroInvestor",
    avatar: "MI",
    time: "6 hours ago",
    replies: 18,
    likes: 42,
    category: "Economics",
    preview: "Small cap stocks historically outperform in rate cutting cycles. Here's my analysis..."
  }
];

const topTraders = [
  {
    name: "Alex Chen",
    username: "@alexchen_trades",
    followers: "12.5K",
    returns: "+24.7%",
    verified: true,
    avatar: "AC"
  },
  {
    name: "Sarah Williams",
    username: "@sarahwilliams",
    followers: "8.9K",
    returns: "+18.3%",
    verified: true,
    avatar: "SW"
  },
  {
    name: "Mike Rodriguez",
    username: "@mikero_crypto",
    followers: "15.2K",
    returns: "+31.2%",
    verified: false,
    avatar: "MR"
  }
];

const upcomingEvents = [
  {
    title: "Weekly Market Outlook",
    host: "Pro Traders Community",
    date: "Dec 16, 2024",
    time: "2:00 PM EST",
    attendees: 1247
  },
  {
    title: "Crypto Trading Strategies Workshop",
    host: "CryptoExperts",
    date: "Dec 18, 2024",
    time: "7:00 PM EST",
    attendees: 892
  },
  {
    title: "Options Trading Masterclass",
    host: "Options Academy",
    date: "Dec 20, 2024",
    time: "1:00 PM EST",
    attendees: 2156
  }
];

export const SocialCommunity = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Social & Community</h2>
          <p className="text-slate-600 dark:text-slate-400">Connect with fellow traders and share insights</p>
        </div>
        <div className="flex space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input placeholder="Search discussions..." className="pl-10 w-64" />
          </div>
          <Button>New Post</Button>
        </div>
      </div>

      <Tabs defaultValue="feed" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="feed">Feed</TabsTrigger>
          <TabsTrigger value="traders">Top Traders</TabsTrigger>
          <TabsTrigger value="groups">Groups</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        <TabsContent value="feed" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Share Your Thoughts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea placeholder="What's on your mind? Share a trade idea, market insight, or ask a question..." className="min-h-24" />
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <Badge variant="outline">Stock</Badge>
                    <Badge variant="outline">Crypto</Badge>
                    <Badge variant="outline">Analysis</Badge>
                  </div>
                  <Button>Post</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {discussions.map((discussion) => (
                <Card key={discussion.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start space-x-3">
                      <Avatar>
                        <AvatarFallback>{discussion.avatar}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold">{discussion.author}</h3>
                          <span className="text-sm text-slate-500">{discussion.time}</span>
                          <Badge variant="outline" className="text-xs">{discussion.category}</Badge>
                        </div>
                        <CardTitle className="text-lg mt-2">{discussion.title}</CardTitle>
                        <CardDescription className="mt-1">{discussion.preview}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-6">
                      <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                        <ThumbsUp className="w-4 h-4" />
                        <span>{discussion.likes}</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                        <MessageCircle className="w-4 h-4" />
                        <span>{discussion.replies}</span>
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Share2 className="w-4 h-4" />
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
                    {['#NVDA_Earnings', '#Bitcoin_Support', '#Fed_Decision', '#AI_Stocks', '#Market_Outlook'].map((topic, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded">
                        <span className="text-sm font-medium">{topic}</span>
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Community Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Active Members</span>
                      <span className="font-semibold">24,891</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Online Now</span>
                      <span className="font-semibold text-green-600">1,234</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Posts Today</span>
                      <span className="font-semibold">342</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Your Rank</span>
                      <span className="font-semibold text-blue-600">#156</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="traders" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topTraders.map((trader, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="text-lg">{trader.avatar}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold">{trader.name}</h3>
                        {trader.verified && <Award className="w-4 h-4 text-blue-600" />}
                      </div>
                      <p className="text-sm text-slate-500">{trader.username}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Followers</span>
                      <span className="font-semibold">{trader.followers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Returns (YTD)</span>
                      <span className="font-semibold text-green-600">{trader.returns}</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4" variant="outline">Follow</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="groups" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { name: "Crypto Traders United", members: "12.5K", description: "Discuss cryptocurrency trading strategies and market analysis", category: "Crypto" },
              { name: "Stock Fundamental Analysis", members: "8.9K", description: "Deep dive into company financials and value investing", category: "Stocks" },
              { name: "Day Trading Strategies", members: "15.2K", description: "Short-term trading techniques and scalping methods", category: "Trading" },
              { name: "Options Trading Academy", members: "6.7K", description: "Learn advanced options strategies and risk management", category: "Options" }
            ].map((group, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{group.name}</CardTitle>
                      <CardDescription>{group.description}</CardDescription>
                    </div>
                    <Badge variant="outline">{group.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-slate-500" />
                      <span className="text-sm text-slate-500">{group.members} members</span>
                    </div>
                    <Button size="sm">Join Group</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          <div className="space-y-4">
            {upcomingEvents.map((event, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{event.title}</CardTitle>
                      <CardDescription>Hosted by {event.host}</CardDescription>
                    </div>
                    <Button size="sm">Register</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-6 text-sm text-slate-600 dark:text-slate-400">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{event.date} at {event.time}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{event.attendees} registered</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Leaderboard</CardTitle>
              <CardDescription>Top performers this month based on verified returns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { rank: 1, name: "Alexandra Kim", returns: "+45.2%", badge: "🥇" },
                  { rank: 2, name: "David Chen", returns: "+38.7%", badge: "🥈" },
                  { rank: 3, name: "Emma Rodriguez", returns: "+34.1%", badge: "🥉" },
                  { rank: 4, name: "Michael Brown", returns: "+29.8%", badge: "" },
                  { rank: 5, name: "Lisa Wong", returns: "+27.3%", badge: "" },
                  { rank: 6, name: "You", returns: "+24.5%", badge: "", highlight: true }
                ].map((trader, index) => (
                  <div key={index} className={`flex items-center justify-between p-4 rounded-lg ${trader.highlight ? 'bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800' : 'bg-slate-50 dark:bg-slate-800'}`}>
                    <div className="flex items-center space-x-4">
                      <span className="text-lg font-bold w-8">{trader.badge || `#${trader.rank}`}</span>
                      <span className="font-semibold">{trader.name}</span>
                    </div>
                    <span className="font-bold text-green-600">{trader.returns}</span>
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
