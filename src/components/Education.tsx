
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, BookOpen, Play, CheckCircle, Clock, Award, TrendingUp } from "lucide-react";

const courses = [
  {
    title: "Stock Market Fundamentals",
    description: "Learn the basics of stock market investing and fundamental analysis",
    duration: "4 hours",
    level: "Beginner",
    progress: 75,
    modules: 8,
    completed: 6,
    category: "Stocks"
  },
  {
    title: "Cryptocurrency Trading Strategies",
    description: "Master crypto trading techniques and risk management",
    duration: "6 hours",
    level: "Intermediate",
    progress: 40,
    modules: 12,
    completed: 5,
    category: "Crypto"
  },
  {
    title: "Technical Analysis Mastery",
    description: "Advanced chart patterns and technical indicators",
    duration: "8 hours",
    level: "Advanced",
    progress: 20,
    modules: 15,
    completed: 3,
    category: "Analysis"
  },
  {
    title: "Portfolio Management",
    description: "Build and manage diversified investment portfolios",
    duration: "5 hours",
    level: "Intermediate",
    progress: 90,
    modules: 10,
    completed: 9,
    category: "Portfolio"
  }
];

const tutorials = [
  {
    title: "How to Read Financial Statements",
    duration: "15 min",
    type: "Video",
    views: "12.5K",
    rating: 4.8
  },
  {
    title: "Understanding Market Volatility",
    duration: "20 min",
    type: "Article",
    views: "8.2K",
    rating: 4.6
  },
  {
    title: "Options Trading Basics",
    duration: "25 min",
    type: "Video",
    views: "15.7K",
    rating: 4.9
  },
  {
    title: "Risk Management Strategies",
    duration: "18 min",
    type: "Interactive",
    views: "9.8K",
    rating: 4.7
  }
];

const achievements = [
  { name: "First Investment", icon: "🎯", earned: true, date: "Nov 15, 2024" },
  { name: "Portfolio Builder", icon: "💼", earned: true, date: "Nov 20, 2024" },
  { name: "Risk Manager", icon: "🛡️", earned: false, date: null },
  { name: "Trading Expert", icon: "📈", earned: false, date: null },
  { name: "Crypto Pioneer", icon: "₿", earned: true, date: "Dec 1, 2024" },
  { name: "Market Analyst", icon: "🔍", earned: false, date: null }
];

export const Education = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Education Center</h2>
          <p className="text-slate-600 dark:text-slate-400">Enhance your trading knowledge and skills</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-sm text-slate-600 dark:text-slate-400">Learning Streak</div>
            <div className="text-2xl font-bold text-orange-600">7 days</div>
          </div>
          <Award className="w-8 h-8 text-orange-600" />
        </div>
      </div>

      <Tabs defaultValue="courses" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="tutorials">Quick Learn</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="library">Library</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {courses.map((course, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg mb-2">{course.title}</CardTitle>
                      <CardDescription>{course.description}</CardDescription>
                    </div>
                    <Badge variant={course.level === 'Beginner' ? 'secondary' : course.level === 'Intermediate' ? 'default' : 'destructive'}>
                      {course.level}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {course.duration}
                      </span>
                      <span className="flex items-center">
                        <BookOpen className="w-4 h-4 mr-1" />
                        {course.modules} modules
                      </span>
                      <Badge variant="outline">{course.category}</Badge>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Progress</span>
                        <span>{course.completed}/{course.modules} completed</span>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                    </div>
                    
                    <Button className="w-full" variant={course.progress > 0 ? "default" : "outline"}>
                      <Play className="w-4 h-4 mr-2" />
                      {course.progress > 0 ? 'Continue Learning' : 'Start Course'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tutorials" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tutorials.map((tutorial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-lg">{tutorial.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4 text-sm text-slate-600 dark:text-slate-400">
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {tutorial.duration}
                      </span>
                      <Badge variant="outline">{tutorial.type}</Badge>
                      <span>{tutorial.views} views</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-semibold mr-1">★ {tutorial.rating}</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    <Play className="w-4 h-4 mr-2" />
                    Start Tutorial
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Featured Tutorial Series</CardTitle>
              <CardDescription>Complete beginner's guide to trading</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  "Setting up your first brokerage account",
                  "Understanding market orders vs limit orders",
                  "Reading stock charts and candlestick patterns",
                  "Building your first portfolio"
                ].map((lesson, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-800 rounded">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="flex-1">{lesson}</span>
                    <Button size="sm" variant="ghost">
                      <Play className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement, index) => (
              <Card key={index} className={`${achievement.earned ? 'border-green-200 bg-green-50 dark:bg-green-950' : 'border-slate-200'}`}>
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-3">{achievement.icon}</div>
                  <h3 className="font-semibold mb-2">{achievement.name}</h3>
                  {achievement.earned ? (
                    <div>
                      <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
                      <p className="text-sm text-green-600">Earned on {achievement.date}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500">Not earned yet</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Your Learning Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">23</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Courses Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">87</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Hours Learned</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">5</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Certificates Earned</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">92%</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Completion Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="library" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Trading Glossary
                </CardTitle>
                <CardDescription>Essential trading terms and definitions</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">Browse Terms</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Market Calculators
                </CardTitle>
                <CardDescription>Tools for profit/loss and risk calculations</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">Open Calculator</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <GraduationCap className="w-5 h-5 mr-2" />
                  Study Guides
                </CardTitle>
                <CardDescription>Downloadable PDFs and cheat sheets</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">Download Guides</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
