
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, BookOpen, Play, CheckCircle, Clock, Award, TrendingUp, Star, Download, FileText, Calculator, Brain, Trophy, Target, Users, Video, Headphones, BookMarked, Zap, ChevronRight, Lock, Unlock } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  progress: number;
  modules: number;
  completed: number;
  category: string;
  instructor: string;
  rating: number;
  students: number;
  price: number;
  isEnrolled: boolean;
  thumbnail: string;
  videoUrl?: string;
  locked: boolean;
}

interface Tutorial {
  id: string;
  title: string;
  duration: string;
  type: 'Video' | 'Article' | 'Interactive' | 'Podcast';
  views: string;
  rating: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  author: string;
  publishedDate: string;
  tags: string[];
  completed: boolean;
  bookmarked: boolean;
}

interface Achievement {
  id: string;
  name: string;
  icon: string;
  earned: boolean;
  date: string | null;
  description: string;
  points: number;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
}

interface LearningPath {
  id: string;
  title: string;
  description: string;
  courses: string[];
  progress: number;
  estimatedTime: string;
  difficulty: string;
  completionReward: number;
}

export const Education = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isWatchingVideo, setIsWatchingVideo] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [learningStreak, setLearningStreak] = useState(7);
  const [totalPoints, setTotalPoints] = useState(2450);
  const [currentLevel, setCurrentLevel] = useState("Advanced Trader");
  const { toast } = useToast();

  useEffect(() => {
    loadEducationData();
  }, []);

  const loadEducationData = () => {
    // Mock data for live functionality
    const mockCourses: Course[] = [
      {
        id: '1',
        title: "Stock Market Fundamentals",
        description: "Master the basics of stock market investing, fundamental analysis, and portfolio building",
        duration: "6 hours",
        level: "Beginner",
        progress: 75,
        modules: 12,
        completed: 9,
        category: "Stocks",
        instructor: "Sarah Johnson",
        rating: 4.8,
        students: 15420,
        price: 0,
        isEnrolled: true,
        thumbnail: "/placeholder.svg",
        videoUrl: "https://example.com/video1",
        locked: false
      },
      {
        id: '2',
        title: "Advanced Options Trading",
        description: "Deep dive into options strategies, Greeks, and complex trading techniques",
        duration: "10 hours",
        level: "Advanced",
        progress: 40,
        modules: 18,
        completed: 7,
        category: "Options",
        instructor: "Michael Chen",
        rating: 4.9,
        students: 8750,
        price: 199,
        isEnrolled: true,
        thumbnail: "/placeholder.svg",
        videoUrl: "https://example.com/video2",
        locked: false
      },
      {
        id: '3',
        title: "Cryptocurrency Mastery",
        description: "Complete guide to crypto trading, DeFi, and blockchain technology",
        duration: "8 hours",
        level: "Intermediate",
        progress: 0,
        modules: 15,
        completed: 0,
        category: "Crypto",
        instructor: "Alex Rodriguez",
        rating: 4.7,
        students: 12300,
        price: 149,
        isEnrolled: false,
        thumbnail: "/placeholder.svg",
        locked: true
      },
      {
        id: '4',
        title: "Technical Analysis Pro",
        description: "Master chart patterns, indicators, and technical analysis strategies",
        duration: "12 hours",
        level: "Intermediate",
        progress: 90,
        modules: 20,
        completed: 18,
        category: "Analysis",
        instructor: "Emma Davis",
        rating: 4.8,
        students: 9890,
        price: 179,
        isEnrolled: true,
        thumbnail: "/placeholder.svg",
        locked: false
      }
    ];

    const mockTutorials: Tutorial[] = [
      {
        id: '1',
        title: "Reading Financial Statements Like a Pro",
        duration: "15 min",
        type: "Video",
        views: "25.3K",
        rating: 4.9,
        difficulty: "Medium",
        author: "Financial Expert",
        publishedDate: "2024-12-10",
        tags: ["Fundamentals", "Analysis", "Earnings"],
        completed: true,
        bookmarked: true
      },
      {
        id: '2',
        title: "Market Psychology and Sentiment Analysis",
        duration: "22 min",
        type: "Article",
        views: "18.7K",
        rating: 4.6,
        difficulty: "Hard",
        author: "Trading Psychologist",
        publishedDate: "2024-12-08",
        tags: ["Psychology", "Sentiment", "Trading"],
        completed: false,
        bookmarked: false
      },
      {
        id: '3',
        title: "Risk Management Interactive Workshop",
        duration: "35 min",
        type: "Interactive",
        views: "31.2K",
        rating: 4.8,
        difficulty: "Medium",
        author: "Risk Manager",
        publishedDate: "2024-12-05",
        tags: ["Risk", "Management", "Portfolio"],
        completed: true,
        bookmarked: true
      },
      {
        id: '4',
        title: "Crypto Trading Strategies Podcast",
        duration: "45 min",
        type: "Podcast",
        views: "12.8K",
        rating: 4.7,
        difficulty: "Easy",
        author: "Crypto Analyst",
        publishedDate: "2024-12-12",
        tags: ["Crypto", "Strategies", "DeFi"],
        completed: false,
        bookmarked: false
      }
    ];

    const mockAchievements: Achievement[] = [
      {
        id: '1',
        name: "First Steps",
        icon: "🎯",
        earned: true,
        date: "2024-11-15",
        description: "Complete your first course module",
        points: 50,
        rarity: "Common"
      },
      {
        id: '2',
        name: "Knowledge Seeker",
        icon: "📚",
        earned: true,
        date: "2024-11-20",
        description: "Complete 5 tutorials",
        points: 100,
        rarity: "Common"
      },
      {
        id: '3',
        name: "Trading Expert",
        icon: "📈",
        earned: true,
        date: "2024-12-01",
        description: "Master advanced trading concepts",
        points: 500,
        rarity: "Epic"
      },
      {
        id: '4',
        name: "Crypto Pioneer",
        icon: "₿",
        earned: false,
        date: null,
        description: "Complete cryptocurrency mastery course",
        points: 750,
        rarity: "Legendary"
      },
      {
        id: '5',
        name: "Streak Master",
        icon: "🔥",
        earned: true,
        date: "2024-12-13",
        description: "Maintain 30-day learning streak",
        points: 300,
        rarity: "Rare"
      },
      {
        id: '6',
        name: "Portfolio Pro",
        icon: "💼",
        earned: false,
        date: null,
        description: "Complete portfolio management specialization",
        points: 400,
        rarity: "Rare"
      }
    ];

    const mockLearningPaths: LearningPath[] = [
      {
        id: '1',
        title: "Complete Beginner to Trader",
        description: "Start from zero and become a confident trader",
        courses: ['1', '4', '2'],
        progress: 65,
        estimatedTime: "25 hours",
        difficulty: "Beginner to Advanced",
        completionReward: 1000
      },
      {
        id: '2',
        title: "Cryptocurrency Specialist",
        description: "Master the world of digital assets",
        courses: ['3'],
        progress: 0,
        estimatedTime: "12 hours",
        difficulty: "Intermediate",
        completionReward: 750
      }
    ];

    setCourses(mockCourses);
    setTutorials(mockTutorials);
    setAchievements(mockAchievements);
    setLearningPaths(mockLearningPaths);
  };

  const enrollInCourse = async (courseId: string) => {
    const updatedCourses = courses.map(course => 
      course.id === courseId 
        ? { ...course, isEnrolled: true, locked: false }
        : course
    );
    setCourses(updatedCourses);
    
    toast({
      title: "Enrolled Successfully!",
      description: "You can now access all course materials.",
    });
  };

  const startCourse = (course: Course) => {
    if (!course.isEnrolled && course.price > 0) {
      enrollInCourse(course.id);
      return;
    }
    
    setSelectedCourse(course);
    setIsWatchingVideo(true);
    
    toast({
      title: `Starting: ${course.title}`,
      description: "Let's continue your learning journey!",
    });
  };

  const completeTutorial = (tutorialId: string) => {
    const updatedTutorials = tutorials.map(tutorial => 
      tutorial.id === tutorialId 
        ? { ...tutorial, completed: true }
        : tutorial
    );
    setTutorials(updatedTutorials);
    
    // Add points and check for achievements
    setTotalPoints(prev => prev + 25);
    
    toast({
      title: "Tutorial Completed!",
      description: "+25 learning points earned",
    });
  };

  const toggleBookmark = (tutorialId: string) => {
    const updatedTutorials = tutorials.map(tutorial => 
      tutorial.id === tutorialId 
        ? { ...tutorial, bookmarked: !tutorial.bookmarked }
        : tutorial
    );
    setTutorials(updatedTutorials);
    
    const tutorial = tutorials.find(t => t.id === tutorialId);
    toast({
      title: tutorial?.bookmarked ? "Removed Bookmark" : "Bookmarked",
      description: tutorial?.bookmarked ? "Removed from your reading list" : "Added to your reading list",
    });
  };

  const updateCourseProgress = (courseId: string, newProgress: number) => {
    const updatedCourses = courses.map(course => 
      course.id === courseId 
        ? { 
            ...course, 
            progress: newProgress,
            completed: Math.floor((newProgress / 100) * course.modules)
          }
        : course
    );
    setCourses(updatedCourses);
    
    if (newProgress === 100) {
      setTotalPoints(prev => prev + 200);
      toast({
        title: "Course Completed! 🎉",
        description: "+200 learning points earned",
      });
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Common': return 'text-gray-600';
      case 'Rare': return 'text-blue-600';
      case 'Epic': return 'text-purple-600';
      case 'Legendary': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || course.category === selectedCategory;
    const matchesLevel = selectedLevel === "All" || course.level === selectedLevel;
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const earnedAchievements = achievements.filter(a => a.earned);
  const totalAchievements = achievements.length;

  return (
    <div className="space-y-6">
      {/* Enhanced Header with Stats */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Education Center</h2>
          <p className="text-slate-600 dark:text-slate-400">Master trading and investing with our comprehensive courses</p>
        </div>
        <div className="flex items-center space-x-6">
          <div className="text-center">
            <div className="text-sm text-slate-600 dark:text-slate-400">Learning Streak</div>
            <div className="text-2xl font-bold text-orange-600 flex items-center">
              🔥 {learningStreak} days
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-slate-600 dark:text-slate-400">Total Points</div>
            <div className="text-2xl font-bold text-blue-600">{totalPoints.toLocaleString()}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-slate-600 dark:text-slate-400">Level</div>
            <div className="text-lg font-bold text-purple-600">{currentLevel}</div>
          </div>
        </div>
      </div>

      {/* Video Player Modal */}
      {isWatchingVideo && selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <h3 className="text-lg font-semibold">{selectedCourse.title}</h3>
              <Button variant="ghost" onClick={() => setIsWatchingVideo(false)}>
                ✕
              </Button>
            </div>
            <div className="p-6">
              <div className="aspect-video bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center mb-4">
                <div className="text-center">
                  <Video className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600 dark:text-slate-400">Video content would load here</p>
                  <Button 
                    className="mt-4" 
                    onClick={() => updateCourseProgress(selectedCourse.id, Math.min(selectedCourse.progress + 10, 100))}
                  >
                    Mark as Watched (+10%)
                  </Button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Progress</div>
                  <Progress value={selectedCourse.progress} className="w-64" />
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  {selectedCourse.completed}/{selectedCourse.modules} modules completed
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Tabs defaultValue="courses" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="courses">My Courses</TabsTrigger>
          <TabsTrigger value="browse">Browse Courses</TabsTrigger>
          <TabsTrigger value="tutorials">Quick Learn</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="paths">Learning Paths</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {courses.filter(course => course.isEnrolled).map((course) => (
              <Card key={course.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{course.title}</CardTitle>
                      <CardDescription>{course.description}</CardDescription>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-slate-600 dark:text-slate-400">
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {course.duration}
                        </span>
                        <span className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {course.students.toLocaleString()}
                        </span>
                        <span className="flex items-center">
                          <Star className="w-4 h-4 mr-1 text-yellow-500" />
                          {course.rating}
                        </span>
                      </div>
                    </div>
                    <Badge variant={course.level === 'Beginner' ? 'secondary' : course.level === 'Intermediate' ? 'default' : 'destructive'}>
                      {course.level}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Progress</span>
                        <span>{course.completed}/{course.modules} modules ({course.progress}%)</span>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        className="flex-1" 
                        onClick={() => startCourse(course)}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        {course.progress > 0 ? 'Continue Learning' : 'Start Course'}
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="browse" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-4">
                <input
                  type="text"
                  placeholder="Search courses..."
                  className="flex-1 min-w-64 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                  className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="All">All Categories</option>
                  <option value="Stocks">Stocks</option>
                  <option value="Crypto">Crypto</option>
                  <option value="Options">Options</option>
                  <option value="Analysis">Analysis</option>
                </select>
                <select
                  className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg"
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                >
                  <option value="All">All Levels</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2 flex items-center">
                        {course.title}
                        {course.locked && <Lock className="w-4 h-4 ml-2 text-orange-500" />}
                      </CardTitle>
                      <CardDescription>{course.description}</CardDescription>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-slate-600 dark:text-slate-400">
                        <span>by {course.instructor}</span>
                        <span className="flex items-center">
                          <Star className="w-4 h-4 mr-1 text-yellow-500" />
                          {course.rating}
                        </span>
                        <span>{course.students.toLocaleString()} students</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={course.level === 'Beginner' ? 'secondary' : course.level === 'Intermediate' ? 'default' : 'destructive'}>
                        {course.level}
                      </Badge>
                      {course.price > 0 && (
                        <div className="text-lg font-bold text-green-600 mt-2">
                          ${course.price}
                        </div>
                      )}
                      {course.price === 0 && (
                        <div className="text-lg font-bold text-blue-600 mt-2">
                          FREE
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-slate-600 dark:text-slate-400">
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
                    <Button 
                      onClick={() => startCourse(course)}
                      disabled={course.locked}
                    >
                      {course.isEnrolled ? (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Continue
                        </>
                      ) : course.price > 0 ? (
                        `Enroll - $${course.price}`
                      ) : (
                        <>
                          <Unlock className="w-4 h-4 mr-2" />
                          Enroll Free
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tutorials" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tutorials.map((tutorial) => (
              <Card key={tutorial.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{tutorial.title}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleBookmark(tutorial.id)}
                        className={tutorial.bookmarked ? 'text-yellow-500' : ''}
                      >
                        <BookMarked className="w-4 h-4" />
                      </Button>
                      {tutorial.completed && (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      )}
                    </div>
                  </div>
                  <CardDescription>
                    by {tutorial.author} • {tutorial.publishedDate}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {tutorial.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex justify-between items-center text-sm text-slate-600 dark:text-slate-400">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {tutorial.duration}
                        </span>
                        <Badge variant="outline">
                          {tutorial.type === 'Video' && <Video className="w-3 h-3 mr-1" />}
                          {tutorial.type === 'Podcast' && <Headphones className="w-3 h-3 mr-1" />}
                          {tutorial.type === 'Article' && <FileText className="w-3 h-3 mr-1" />}
                          {tutorial.type === 'Interactive' && <Zap className="w-3 h-3 mr-1" />}
                          {tutorial.type}
                        </Badge>
                        <span>{tutorial.views} views</span>
                      </div>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 mr-1" />
                        <span className="font-semibold">{tutorial.rating}</span>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full" 
                      variant={tutorial.completed ? "outline" : "default"}
                      onClick={() => !tutorial.completed && completeTutorial(tutorial.id)}
                    >
                      {tutorial.completed ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Completed
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Start Tutorial
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Progress</CardTitle>
              <CardDescription>
                {earnedAchievements.length} of {totalAchievements} achievements unlocked
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={(earnedAchievements.length / totalAchievements) * 100} className="h-3" />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement) => (
              <Card 
                key={achievement.id} 
                className={`${achievement.earned 
                  ? 'border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800' 
                  : 'border-slate-200 opacity-60'
                } transition-all duration-300`}
              >
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-3">{achievement.icon}</div>
                  <h3 className="font-semibold mb-2">{achievement.name}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                    {achievement.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <Badge variant="outline" className={getRarityColor(achievement.rarity)}>
                      {achievement.rarity}
                    </Badge>
                    <span className="text-sm font-semibold text-blue-600">
                      {achievement.points} pts
                    </span>
                  </div>
                  {achievement.earned ? (
                    <div className="mt-3">
                      <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-1" />
                      <p className="text-xs text-green-600">Earned on {achievement.date}</p>
                    </div>
                  ) : (
                    <div className="mt-3">
                      <Lock className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                      <p className="text-xs text-slate-500">Not earned yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="paths" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {learningPaths.map((path) => (
              <Card key={path.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl">{path.title}</CardTitle>
                  <CardDescription>{path.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                      <span>Estimated Time: {path.estimatedTime}</span>
                      <span>Difficulty: {path.difficulty}</span>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Overall Progress</span>
                        <span>{path.progress}%</span>
                      </div>
                      <Progress value={path.progress} className="h-2" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                        <Trophy className="w-4 h-4 mr-1 text-yellow-500" />
                        <span>{path.completionReward} points reward</span>
                      </div>
                      <Button>
                        <Target className="w-4 h-4 mr-2" />
                        {path.progress > 0 ? 'Continue Path' : 'Start Path'}
                      </Button>
                    </div>
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
