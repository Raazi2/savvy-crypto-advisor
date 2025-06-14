
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Home, MessageSquare, Wallet, Shield, Settings, Moon, Sun } from "lucide-react";
import { DashboardHome } from "@/components/DashboardHome";
import { AIChat } from "@/components/AIChat";
import { WalletViewer } from "@/components/WalletViewer";
import { SecurityCenter } from "@/components/SecurityCenter";
import { SettingsPanel } from "@/components/SettingsPanel";

const Index = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`}>
      {/* Header */}
      <div className="backdrop-blur-xl bg-white/10 border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              <Wallet className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Live Fintech Advisor
            </h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="rounded-full hover:backdrop-blur-sm hover:bg-white/10"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="home" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-2">
            <TabsTrigger 
              value="home" 
              className="flex items-center gap-2 rounded-xl data-[state=active]:bg-white/20 data-[state=active]:backdrop-blur-sm"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </TabsTrigger>
            <TabsTrigger 
              value="chat"
              className="flex items-center gap-2 rounded-xl data-[state=active]:bg-white/20 data-[state=active]:backdrop-blur-sm"
            >
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Chat</span>
            </TabsTrigger>
            <TabsTrigger 
              value="wallet"
              className="flex items-center gap-2 rounded-xl data-[state=active]:bg-white/20 data-[state=active]:backdrop-blur-sm"
            >
              <Wallet className="w-4 h-4" />
              <span className="hidden sm:inline">Wallet</span>
            </TabsTrigger>
            <TabsTrigger 
              value="security"
              className="flex items-center gap-2 rounded-xl data-[state=active]:bg-white/20 data-[state=active]:backdrop-blur-sm"
            >
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger 
              value="settings"
              className="flex items-center gap-2 rounded-xl data-[state=active]:bg-white/20 data-[state=active]:backdrop-blur-sm"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="home" className="space-y-6">
            <DashboardHome />
          </TabsContent>

          <TabsContent value="chat" className="space-y-6">
            <AIChat />
          </TabsContent>

          <TabsContent value="wallet" className="space-y-6">
            <WalletViewer />
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <SecurityCenter />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <SettingsPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
