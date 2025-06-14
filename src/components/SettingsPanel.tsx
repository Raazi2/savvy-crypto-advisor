
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Settings, Key, Bell, Palette, Globe, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const SettingsPanel = () => {
  const [apiKeys, setApiKeys] = useState({
    openrouter: '',
    alphavantage: '',
    etherscan: ''
  });
  const [notifications, setNotifications] = useState({
    priceAlerts: true,
    securityAlerts: true,
    marketNews: false
  });
  const [preferences, setPreferences] = useState({
    defaultCurrency: 'USD',
    theme: 'dark',
    refreshInterval: '60'
  });
  const { toast } = useToast();

  const handleSaveSettings = () => {
    // Save settings to localStorage or backend
    localStorage.setItem('fintechSettings', JSON.stringify({
      apiKeys,
      notifications,
      preferences
    }));
    
    toast({
      title: "Settings Saved",
      description: "Your preferences have been saved successfully.",
    });
  };

  const handleApiKeyChange = (service: string, value: string) => {
    setApiKeys(prev => ({
      ...prev,
      [service]: value
    }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Settings & Configuration
        </h2>
        <p className="text-lg opacity-80">
          Customize your fintech experience and manage API integrations.
        </p>
      </div>

      {/* API Keys */}
      <Card className="backdrop-blur-xl bg-white/10 border border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            API Keys Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="openrouter-key" className="text-sm font-medium mb-2 block">
                OpenRouter API Key
                <Badge className="ml-2 bg-blue-500/20 text-blue-400">AI Chat</Badge>
              </Label>
              <Input
                id="openrouter-key"
                type="password"
                placeholder="sk-or-..."
                value={apiKeys.openrouter}
                onChange={(e) => handleApiKeyChange('openrouter', e.target.value)}
                className="bg-white/5 border-white/20"
              />
              <p className="text-xs opacity-60 mt-1">
                Required for AI chat functionality. Get your key from{' '}
                <a href="https://openrouter.ai" className="text-blue-400 hover:underline">
                  openrouter.ai
                </a>
              </p>
            </div>

            <div>
              <Label htmlFor="alphavantage-key" className="text-sm font-medium mb-2 block">
                Alpha Vantage API Key
                <Badge className="ml-2 bg-green-500/20 text-green-400">Stock Data</Badge>
              </Label>
              <Input
                id="alphavantage-key"
                type="password"
                placeholder="Your Alpha Vantage key..."
                value={apiKeys.alphavantage}
                onChange={(e) => handleApiKeyChange('alphavantage', e.target.value)}
                className="bg-white/5 border-white/20"
              />
              <p className="text-xs opacity-60 mt-1">
                Required for stock market data. Get your free key from{' '}
                <a href="https://www.alphavantage.co" className="text-blue-400 hover:underline">
                  alphavantage.co
                </a>
              </p>
            </div>

            <div>
              <Label htmlFor="etherscan-key" className="text-sm font-medium mb-2 block">
                Etherscan API Key
                <Badge className="ml-2 bg-purple-500/20 text-purple-400">Blockchain</Badge>
              </Label>
              <Input
                id="etherscan-key"
                type="password"
                placeholder="Your Etherscan key..."
                value={apiKeys.etherscan}
                onChange={(e) => handleApiKeyChange('etherscan', e.target.value)}
                className="bg-white/5 border-white/20"
              />
              <p className="text-xs opacity-60 mt-1">
                Required for wallet analysis. Get your free key from{' '}
                <a href="https://etherscan.io/apis" className="text-blue-400 hover:underline">
                  etherscan.io/apis
                </a>
              </p>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-black text-sm font-bold">!</span>
              </div>
              <div>
                <h4 className="font-bold text-yellow-400 mb-1">Security Notice</h4>
                <p className="text-sm opacity-80">
                  API keys are stored locally in your browser. For production use, consider using secure backend storage.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="backdrop-blur-xl bg-white/10 border border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Price Alerts</Label>
                <p className="text-xs opacity-60">Get notified about significant price changes</p>
              </div>
              <Switch
                checked={notifications.priceAlerts}
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({ ...prev, priceAlerts: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Security Alerts</Label>
                <p className="text-xs opacity-60">Receive updates about new scams and threats</p>
              </div>
              <Switch
                checked={notifications.securityAlerts}
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({ ...prev, securityAlerts: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Market News</Label>
                <p className="text-xs opacity-60">Stay updated with market analysis and news</p>
              </div>
              <Switch
                checked={notifications.marketNews}
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({ ...prev, marketNews: checked }))
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card className="backdrop-blur-xl bg-white/10 border border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Display Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="text-sm font-medium mb-2 block">Default Currency</Label>
              <Select 
                value={preferences.defaultCurrency} 
                onValueChange={(value) => 
                  setPreferences(prev => ({ ...prev, defaultCurrency: value }))
                }
              >
                <SelectTrigger className="bg-white/5 border-white/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD - US Dollar</SelectItem>
                  <SelectItem value="EUR">EUR - Euro</SelectItem>
                  <SelectItem value="GBP">GBP - British Pound</SelectItem>
                  <SelectItem value="BTC">BTC - Bitcoin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">Data Refresh Interval</Label>
              <Select 
                value={preferences.refreshInterval} 
                onValueChange={(value) => 
                  setPreferences(prev => ({ ...prev, refreshInterval: value }))
                }
              >
                <SelectTrigger className="bg-white/5 border-white/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 seconds</SelectItem>
                  <SelectItem value="60">1 minute</SelectItem>
                  <SelectItem value="300">5 minutes</SelectItem>
                  <SelectItem value="900">15 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* About */}
      <Card className="backdrop-blur-xl bg-white/10 border border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            About This App
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Features</h4>
              <ul className="text-sm opacity-80 space-y-1">
                <li>• Real-time crypto & stock data</li>
                <li>• AI-powered financial advice</li>
                <li>• Blockchain wallet analysis</li>
                <li>• Cybersecurity monitoring</li>
                <li>• Multi-model AI chat</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Data Sources</h4>
              <ul className="text-sm opacity-80 space-y-1">
                <li>• CoinGecko API (Crypto prices)</li>
                <li>• Alpha Vantage (Stock data)</li>
                <li>• Etherscan (Blockchain data)</li>
                <li>• OpenRouter (AI models)</li>
                <li>• CryptoScamDB (Security alerts)</li>
              </ul>
            </div>
          </div>

          <div className="pt-4 border-t border-white/20">
            <p className="text-sm opacity-60 text-center">
              Built with ❤️ using Lovable.dev • Version 1.0.0 • Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-center">
        <Button 
          onClick={handleSaveSettings}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-8"
        >
          <Save className="w-4 h-4 mr-2" />
          Save All Settings
        </Button>
      </div>
    </div>
  );
};
