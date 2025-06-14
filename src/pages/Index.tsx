import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Home, MessageSquare, Wallet, Shield, Settings, Moon, Sun, Menu, X, LogOut, User, BarChart3, Newspaper, GraduationCap, Users, Bell, TrendingUp, PieChart, Filter, Lightbulb, Target } from "lucide-react";
import { DashboardHome } from "@/components/DashboardHome";
import { AIChat } from "@/components/AIChat";
import { WalletViewer } from "@/components/WalletViewer";
import { SecurityCenter } from "@/components/SecurityCenter";
import { SettingsPanel } from "@/components/SettingsPanel";
import { AnalyticsReports } from "@/components/AnalyticsReports";
import { NewsResearch } from "@/components/NewsResearch";
import { Education } from "@/components/Education";
import { SocialCommunity } from "@/components/SocialCommunity";
import { Notifications } from "@/components/Notifications";
import { Trading } from "@/components/Trading";
import { PortfolioAnalytics } from "@/components/PortfolioAnalytics";
import { MarketScreener } from "@/components/MarketScreener";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { GoalPlanning } from "@/components/GoalPlanning";
import { InvestmentIdeas } from "@/components/InvestmentIdeas";

const Index = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-all duration-500">
      {/* Professional Header */}
      <div className="sticky top-0 z-50 border-b border-slate-200/50 dark:border-slate-800/50 backdrop-blur-xl bg-white/80 dark:bg-slate-950/80">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  Fintech Advisor
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Professional Trading Platform
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* User Info */}
              <div className="hidden md:flex items-center space-x-2 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800">
                <User className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {user?.email?.split('@')[0]}
                </span>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-red-600 hover:text-red-700"
              >
                <LogOut className="w-4 h-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="home" className="w-full">
          {/* Professional Tab Navigation */}
          <div className="mb-8">
            <TabsList className={`grid grid-cols-3 md:grid-cols-6 lg:grid-cols-14 h-12 items-center justify-center rounded-2xl bg-white/60 dark:bg-slate-900/60 p-1 border border-slate-200 dark:border-slate-800 backdrop-blur-xl shadow-lg ${isMobileMenuOpen ? 'flex' : 'hidden'} md:grid overflow-x-auto`}>
              <TabsTrigger value="home" className="inline-flex items-center justify-center whitespace-nowrap rounded-xl px-3 py-2 text-xs font-medium transition-all">
                <Home className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger value="portfolio-analytics" className="inline-flex items-center justify-center whitespace-nowrap rounded-xl px-3 py-2 text-xs font-medium transition-all">
                <PieChart className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Analytics</span>
              </TabsTrigger>
              <TabsTrigger value="goal-planning" className="inline-flex items-center justify-center whitespace-nowrap rounded-xl px-3 py-2 text-xs font-medium transition-all">
                <Target className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Goals</span>
              </TabsTrigger>
              <TabsTrigger value="investment-ideas" className="inline-flex items-center justify-center whitespace-nowrap rounded-xl px-3 py-2 text-xs font-medium transition-all">
                <Lightbulb className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Ideas</span>
              </TabsTrigger>
              <TabsTrigger value="chat" className="inline-flex items-center justify-center whitespace-nowrap rounded-xl px-3 py-2 text-xs font-medium transition-all">
                <MessageSquare className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">AI Chat</span>
              </TabsTrigger>
              <TabsTrigger value="wallet" className="inline-flex items-center justify-center whitespace-nowrap rounded-xl px-3 py-2 text-xs font-medium transition-all">
                <Wallet className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Portfolio</span>
              </TabsTrigger>
              <TabsTrigger value="trading" className="inline-flex items-center justify-center whitespace-nowrap rounded-xl px-3 py-2 text-xs font-medium transition-all">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Trading</span>
              </TabsTrigger>
              <TabsTrigger value="screener" className="inline-flex items-center justify-center whitespace-nowrap rounded-xl px-3 py-2 text-xs font-medium transition-all">
                <Filter className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Screener</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="inline-flex items-center justify-center whitespace-nowrap rounded-xl px-3 py-2 text-xs font-medium transition-all">
                <BarChart3 className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Reports</span>
              </TabsTrigger>
              <TabsTrigger value="news" className="inline-flex items-center justify-center whitespace-nowrap rounded-xl px-3 py-2 text-xs font-medium transition-all">
                <Newspaper className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">News</span>
              </TabsTrigger>
              <TabsTrigger value="education" className="inline-flex items-center justify-center whitespace-nowrap rounded-xl px-3 py-2 text-xs font-medium transition-all">
                <GraduationCap className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Education</span>
              </TabsTrigger>
              <TabsTrigger value="social" className="inline-flex items-center justify-center whitespace-nowrap rounded-xl px-3 py-2 text-xs font-medium transition-all">
                <Users className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Social</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="inline-flex items-center justify-center whitespace-nowrap rounded-xl px-3 py-2 text-xs font-medium transition-all">
                <Bell className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Alerts</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="inline-flex items-center justify-center whitespace-nowrap rounded-xl px-3 py-2 text-xs font-medium transition-all">
                <Shield className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Security</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="inline-flex items-center justify-center whitespace-nowrap rounded-xl px-3 py-2 text-xs font-medium transition-all">
                <Settings className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Settings</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="home" className="space-y-6 mt-6">
            <DashboardHome />
          </TabsContent>

          <TabsContent value="portfolio-analytics" className="space-y-6 mt-6">
            <PortfolioAnalytics />
          </TabsContent>

          <TabsContent value="goal-planning" className="space-y-6 mt-6">
            <GoalPlanning />
          </TabsContent>

          <TabsContent value="investment-ideas" className="space-y-6 mt-6">
            <InvestmentIdeas />
          </TabsContent>

          <TabsContent value="chat" className="space-y-6 mt-6">
            <AIChat />
          </TabsContent>

          <TabsContent value="wallet" className="space-y-6 mt-6">
            <WalletViewer />
          </TabsContent>

          <TabsContent value="trading" className="space-y-6 mt-6">
            <Trading />
          </TabsContent>

          <TabsContent value="screener" className="space-y-6 mt-6">
            <MarketScreener />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6 mt-6">
            <AnalyticsReports />
          </TabsContent>

          <TabsContent value="news" className="space-y-6 mt-6">
            <NewsResearch />
          </TabsContent>

          <TabsContent value="education" className="space-y-6 mt-6">
            <Education />
          </TabsContent>

          <TabsContent value="social" className="space-y-6 mt-6">
            <SocialCommunity />
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6 mt-6">
            <Notifications />
          </TabsContent>

          <TabsContent value="security" className="space-y-6 mt-6">
            <SecurityCenter />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6 mt-6">
            <SettingsPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
