
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Home, MessageSquare, Wallet, Shield, Settings, Moon, Sun, Menu, X, LogOut, User, BarChart3, Newspaper, GraduationCap, Users, Bell, TrendingUp, PieChart, Filter, Lightbulb, Target, Calculator, PlayCircle, ChevronDown } from "lucide-react";
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
import LoanCalculator from "@/components/LoanCalculator";
import PaperTrading from "@/components/PaperTrading";

const Index = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
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

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setIsMobileMenuOpen(false);
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
                  Fintech Advisor AI
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  AI-Powered Trading & Analytics Platform
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Real-time status indicator */}
              <div className="hidden md:flex items-center space-x-2 px-3 py-2 rounded-lg bg-green-100 dark:bg-green-900/20">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-600 dark:text-green-400">Live Data</span>
              </div>

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
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          {/* Compact Navigation with Dropdowns */}
          <div className="mb-8">
            <div className={`flex flex-wrap gap-2 ${isMobileMenuOpen ? 'flex' : 'hidden'} md:flex`}>
              {/* Primary Tabs */}
              <TabsList className="h-12 items-center justify-center rounded-2xl bg-white/60 dark:bg-slate-900/60 p-1 border border-slate-200 dark:border-slate-800 backdrop-blur-xl shadow-lg">
                <TabsTrigger value="home" className="inline-flex items-center justify-center whitespace-nowrap rounded-xl px-3 py-2 text-xs font-medium transition-all">
                  <Home className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">Dashboard</span>
                </TabsTrigger>
                <TabsTrigger value="chat" className="inline-flex items-center justify-center whitespace-nowrap rounded-xl px-3 py-2 text-xs font-medium transition-all">
                  <MessageSquare className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">AI Chat</span>
                </TabsTrigger>
                <TabsTrigger value="wallet" className="inline-flex items-center justify-center whitespace-nowrap rounded-xl px-3 py-2 text-xs font-medium transition-all">
                  <Wallet className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">Portfolio</span>
                </TabsTrigger>
              </TabsList>

              {/* Analytics Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-12 rounded-2xl bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 backdrop-blur-xl">
                    <BarChart3 className="w-4 h-4 mr-1" />
                    <span className="hidden sm:inline">Analytics</span>
                    <ChevronDown className="w-3 h-3 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                  <DropdownMenuLabel>Analytics & Reports</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleTabChange("portfolio-analytics")}>
                    <PieChart className="w-4 h-4 mr-2" />
                    Portfolio Analytics
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleTabChange("analytics")}>
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Reports
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleTabChange("screener")}>
                    <Filter className="w-4 h-4 mr-2" />
                    Market Screener
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Trading Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-12 rounded-2xl bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 backdrop-blur-xl">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span className="hidden sm:inline">Trading</span>
                    <ChevronDown className="w-3 h-3 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                  <DropdownMenuLabel>Trading & Markets</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleTabChange("trading")}>
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Live Trading
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleTabChange("paper-trading")}>
                    <PlayCircle className="w-4 h-4 mr-2" />
                    Paper Trading
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Planning Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-12 rounded-2xl bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 backdrop-blur-xl">
                    <Target className="w-4 h-4 mr-1" />
                    <span className="hidden sm:inline">Planning</span>
                    <ChevronDown className="w-3 h-3 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                  <DropdownMenuLabel>Financial Planning</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleTabChange("goal-planning")}>
                    <Target className="w-4 h-4 mr-2" />
                    Goal Planning
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleTabChange("investment-ideas")}>
                    <Lightbulb className="w-4 h-4 mr-2" />
                    Investment Ideas
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleTabChange("loan-calculator")}>
                    <Calculator className="w-4 h-4 mr-2" />
                    Loan Calculator
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Research Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-12 rounded-2xl bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 backdrop-blur-xl">
                    <Newspaper className="w-4 h-4 mr-1" />
                    <span className="hidden sm:inline">Research</span>
                    <ChevronDown className="w-3 h-3 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                  <DropdownMenuLabel>Research & Learning</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleTabChange("news")}>
                    <Newspaper className="w-4 h-4 mr-2" />
                    News & Research
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleTabChange("education")}>
                    <GraduationCap className="w-4 h-4 mr-2" />
                    Education
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* More Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-12 rounded-2xl bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 backdrop-blur-xl">
                    <Settings className="w-4 h-4 mr-1" />
                    <span className="hidden sm:inline">More</span>
                    <ChevronDown className="w-3 h-3 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                  <DropdownMenuLabel>Community & Settings</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleTabChange("social")}>
                    <Users className="w-4 h-4 mr-2" />
                    Social Community
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleTabChange("notifications")}>
                    <Bell className="w-4 h-4 mr-2" />
                    Notifications
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleTabChange("security")}>
                    <Shield className="w-4 h-4 mr-2" />
                    Security Center
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleTabChange("settings")}>
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Tab Contents */}
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

          <TabsContent value="loan-calculator" className="space-y-6 mt-6">
            <LoanCalculator />
          </TabsContent>

          <TabsContent value="paper-trading" className="space-y-6 mt-6">
            <PaperTrading />
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
