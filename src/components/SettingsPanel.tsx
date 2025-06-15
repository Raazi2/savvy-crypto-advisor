
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Settings, Key, Bell, Palette, Globe, Save, Eye, EyeOff, Check, X, AlertTriangle, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useSettings } from "@/hooks/useSettings";

interface ApiKeyStatus {
  valid: boolean;
  testing: boolean;
  error?: string;
}

export const SettingsPanel = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { settings, updateSettings, saveSettings: saveSettingsToContext } = useSettings();
  const [loading, setLoading] = useState(false);
  const [showApiKeys, setShowApiKeys] = useState({
    openrouter: false,
    alphavantage: false,
    etherscan: false
  });
  
  const [apiKeyStatus, setApiKeyStatus] = useState<Record<string, ApiKeyStatus>>({
    openrouter: { valid: false, testing: false },
    alphavantage: { valid: false, testing: false },
    etherscan: { valid: false, testing: false }
  });

  // Load settings on component mount
  useEffect(() => {
    loadSettings();
  }, [user]);

  const loadSettings = async () => {
    if (!user) return;

    try {
      // Load from Supabase user metadata and localStorage
      const storedSettings = localStorage.getItem(`settings_${user.id}`);
      if (storedSettings) {
        const parsed = JSON.parse(storedSettings);
        
        // Validate stored API keys
        if (parsed.apiKeys) {
          Object.keys(parsed.apiKeys).forEach(service => {
            if (parsed.apiKeys[service]) {
              validateApiKey(service, parsed.apiKeys[service]);
            }
          });
        }
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const validateApiKey = async (service: string, apiKey: string) => {
    if (!apiKey.trim()) return;

    setApiKeyStatus(prev => ({
      ...prev,
      [service]: { valid: false, testing: true }
    }));

    try {
      let isValid = false;
      let errorMessage = '';

      switch (service) {
        case 'openrouter':
          const openrouterResponse = await fetch('https://openrouter.ai/api/v1/models', {
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json'
            }
          });
          isValid = openrouterResponse.ok;
          if (!isValid) errorMessage = 'Invalid OpenRouter API key';
          break;

        case 'alphavantage':
          const alphaResponse = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=AAPL&apikey=${apiKey}`);
          const alphaData = await alphaResponse.json();
          isValid = !alphaData['Error Message'] && !alphaData['Note'];
          if (!isValid) errorMessage = alphaData['Error Message'] || 'Invalid Alpha Vantage API key';
          break;

        case 'etherscan':
          const etherscanResponse = await fetch(`https://api.etherscan.io/api?module=stats&action=ethsupply&apikey=${apiKey}`);
          const etherscanData = await etherscanResponse.json();
          isValid = etherscanData.status === '1';
          if (!isValid) errorMessage = 'Invalid Etherscan API key';
          break;
      }

      setApiKeyStatus(prev => ({
        ...prev,
        [service]: { valid: isValid, testing: false, error: errorMessage }
      }));

    } catch (error) {
      setApiKeyStatus(prev => ({
        ...prev,
        [service]: { valid: false, testing: false, error: 'Network error during validation' }
      }));
    }
  };

  const handleApiKeyChange = (service: string, value: string) => {
    updateSettings({
      apiKeys: {
        ...settings.apiKeys,
        [service]: value
      }
    });

    // Debounce validation
    if (value.length > 10) {
      setTimeout(() => validateApiKey(service, value), 1000);
    }
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    updateSettings({
      notifications: {
        ...settings.notifications,
        [key]: value
      }
    });
  };

  const handlePreferenceChange = (key: string, value: string) => {
    updateSettings({
      preferences: {
        ...settings.preferences,
        [key]: value
      }
    });

    // Apply theme immediately
    if (key === 'theme') {
      if (value === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  const handlePrivacyChange = (key: string, value: boolean) => {
    updateSettings({
      privacy: {
        ...settings.privacy,
        [key]: value
      }
    });
  };

  const saveSettings = async () => {
    if (!user) return;

    setLoading(true);
    try {
      await saveSettingsToContext();

      toast({
        title: "Settings Saved",
        description: "Your preferences have been saved successfully.",
      });

    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const resetSettings = () => {
    if (window.confirm('Are you sure you want to reset all settings to default?')) {
      localStorage.removeItem(`settings_${user?.id}`);
      localStorage.removeItem(`api_keys_${user?.id}`);
      window.location.reload();
    }
  };

  const exportSettings = () => {
    const exportData = {
      ...settings,
      apiKeys: {} // Don't export API keys for security
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fintech-settings.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        // Merge with existing settings
        Object.keys(imported).forEach(key => {
          if (key !== 'apiKeys') {
            updateSettings({ [key]: imported[key] });
          }
        });
        toast({
          title: "Settings Imported",
          description: "Settings have been imported successfully.",
        });
      } catch (error) {
        toast({
          title: "Import Error",
          description: "Failed to import settings file.",
          variant: "destructive"
        });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Settings & Configuration
        </h2>
        <p className="text-lg opacity-80">
          Customize your fintech experience and manage integrations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* API Keys */}
        <Card className="backdrop-blur-xl bg-white/10 border border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="w-5 h-5" />
              API Keys Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {Object.entries(settings.apiKeys).map(([service, value]) => (
              <div key={service}>
                <Label htmlFor={`${service}-key`} className="text-sm font-medium mb-2 block">
                  {service === 'openrouter' && 'OpenRouter API Key'}
                  {service === 'alphavantage' && 'Alpha Vantage API Key'}
                  {service === 'etherscan' && 'Etherscan API Key'}
                  <Badge className="ml-2 bg-blue-500/20 text-blue-400">
                    {service === 'openrouter' && 'AI Chat'}
                    {service === 'alphavantage' && 'Stock Data'}
                    {service === 'etherscan' && 'Blockchain'}
                  </Badge>
                  {apiKeyStatus[service]?.valid && (
                    <Badge className="ml-2 bg-green-500/20 text-green-400">
                      <Check className="w-3 h-3 mr-1" />
                      Valid
                    </Badge>
                  )}
                  {apiKeyStatus[service]?.error && (
                    <Badge className="ml-2 bg-red-500/20 text-red-400">
                      <X className="w-3 h-3 mr-1" />
                      Invalid
                    </Badge>
                  )}
                </Label>
                <div className="relative">
                  <Input
                    id={`${service}-key`}
                    type={showApiKeys[service as keyof typeof showApiKeys] ? "text" : "password"}
                    placeholder={`Your ${service} API key...`}
                    value={value}
                    onChange={(e) => handleApiKeyChange(service, e.target.value)}
                    className="bg-white/5 border-white/20 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowApiKeys(prev => ({
                      ...prev,
                      [service]: !prev[service as keyof typeof showApiKeys]
                    }))}
                  >
                    {showApiKeys[service as keyof typeof showApiKeys] ? 
                      <EyeOff className="w-4 h-4" /> : 
                      <Eye className="w-4 h-4" />
                    }
                  </Button>
                </div>
                {apiKeyStatus[service]?.testing && (
                  <p className="text-xs text-yellow-400 mt-1">Validating...</p>
                )}
                {apiKeyStatus[service]?.error && (
                  <p className="text-xs text-red-400 mt-1">{apiKeyStatus[service].error}</p>
                )}
              </div>
            ))}

            <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-yellow-400 mb-1">Security Notice</h4>
                  <p className="text-sm opacity-80">
                    API keys are encrypted and stored securely. For production use, consider using environment variables.
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
          <CardContent className="space-y-4">
            {Object.entries(settings.notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </Label>
                  <p className="text-xs opacity-60">
                    {key === 'priceAlerts' && 'Get notified about significant price changes'}
                    {key === 'securityAlerts' && 'Receive updates about new scams and threats'}
                    {key === 'marketNews' && 'Stay updated with market analysis and news'}
                    {key === 'portfolioUpdates' && 'Daily portfolio performance summaries'}
                    {key === 'tradeConfirmations' && 'Confirmations for executed trades'}
                    {key === 'educationalContent' && 'New courses and learning materials'}
                    {key === 'socialUpdates' && 'New followers and community interactions'}
                  </p>
                </div>
                <Switch
                  checked={value}
                  onCheckedChange={(checked) => handleNotificationChange(key, checked)}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Trading Preferences */}
        <Card className="backdrop-blur-xl bg-white/10 border border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Trading Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">Default Broker</Label>
              <Select 
                value={settings.preferences.defaultBroker} 
                onValueChange={(value) => handlePreferenceChange('defaultBroker', value)}
              >
                <SelectTrigger className="bg-white/5 border-white/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="zerodha">Zerodha - ₹20 per order</SelectItem>
                  <SelectItem value="angelone">Angel One - ₹20 per order</SelectItem>
                  <SelectItem value="upstox">Upstox - ₹20 per order</SelectItem>
                  <SelectItem value="groww">Groww - ₹20 per order</SelectItem>
                  <SelectItem value="icici">ICICI Direct - ₹25 per order</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs opacity-60 mt-1">
                Your preferred broker for quick trade redirects
              </p>
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">Risk Tolerance</Label>
              <Select 
                value={settings.preferences.riskTolerance || 'moderate'} 
                onValueChange={(value) => handlePreferenceChange('riskTolerance', value)}
              >
                <SelectTrigger className="bg-white/5 border-white/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="conservative">Conservative</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="aggressive">Aggressive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">Investment Goals</Label>
              <Select 
                value={settings.preferences.investmentGoals || 'growth'} 
                onValueChange={(value) => handlePreferenceChange('investmentGoals', value)}
              >
                <SelectTrigger className="bg-white/5 border-white/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income Generation</SelectItem>
                  <SelectItem value="growth">Capital Growth</SelectItem>
                  <SelectItem value="balanced">Balanced</SelectItem>
                  <SelectItem value="speculation">Speculation</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Display Preferences */}
        <Card className="backdrop-blur-xl bg-white/10 border border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Display Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">Default Currency</Label>
                <Select 
                  value={settings.preferences.defaultCurrency} 
                  onValueChange={(value) => handlePreferenceChange('defaultCurrency', value)}
                >
                  <SelectTrigger className="bg-white/5 border-white/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD - US Dollar</SelectItem>
                    <SelectItem value="INR">INR - Indian Rupee</SelectItem>
                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                    <SelectItem value="GBP">GBP - British Pound</SelectItem>
                    <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                    <SelectItem value="BTC">BTC - Bitcoin</SelectItem>
                    <SelectItem value="ETH">ETH - Ethereum</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Theme</Label>
                <Select 
                  value={settings.preferences.theme} 
                  onValueChange={(value) => handlePreferenceChange('theme', value)}
                >
                  <SelectTrigger className="bg-white/5 border-white/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="auto">Auto</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Refresh Interval</Label>
                <Select 
                  value={settings.preferences.refreshInterval} 
                  onValueChange={(value) => handlePreferenceChange('refreshInterval', value)}
                >
                  <SelectTrigger className="bg-white/5 border-white/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 seconds</SelectItem>
                    <SelectItem value="30">30 seconds</SelectItem>
                    <SelectItem value="60">1 minute</SelectItem>
                    <SelectItem value="300">5 minutes</SelectItem>
                    <SelectItem value="900">15 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Language</Label>
                <Select 
                  value={settings.preferences.language} 
                  onValueChange={(value) => handlePreferenceChange('language', value)}
                >
                  <SelectTrigger className="bg-white/5 border-white/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                    <SelectItem value="ja">日本語</SelectItem>
                    <SelectItem value="zh">中文</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card className="backdrop-blur-xl bg-white/10 border border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Privacy & Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(settings.privacy).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </Label>
                  <p className="text-xs opacity-60">
                    {key === 'sharePortfolio' && 'Allow others to view your portfolio performance'}
                    {key === 'showOnlineStatus' && 'Show when you\'re online to other users'}
                    {key === 'allowDataCollection' && 'Help improve the platform with usage analytics'}
                    {key === 'marketingEmails' && 'Receive promotional emails and product updates'}
                  </p>
                </div>
                <Switch
                  checked={value}
                  onCheckedChange={(checked) => handlePrivacyChange(key, checked)}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* System Information */}
      <Card className="backdrop-blur-xl bg-white/10 border border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            System Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Application</h4>
              <ul className="text-sm opacity-80 space-y-1">
                <li>Version: 2.0.0</li>
                <li>Build: {new Date().toISOString().split('T')[0]}</li>
                <li>Environment: Production</li>
                <li>User ID: {user?.id?.slice(0, 8)}...</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Connected Services</h4>
              <ul className="text-sm opacity-80 space-y-1">
                <li className="flex items-center gap-2">
                  {apiKeyStatus.openrouter?.valid ? 
                    <Check className="w-3 h-3 text-green-400" /> : 
                    <X className="w-3 h-3 text-red-400" />
                  }
                  OpenRouter API
                </li>
                <li className="flex items-center gap-2">
                  {apiKeyStatus.alphavantage?.valid ? 
                    <Check className="w-3 h-3 text-green-400" /> : 
                    <X className="w-3 h-3 text-red-400" />
                  }
                  Alpha Vantage API
                </li>
                <li className="flex items-center gap-2">
                  {apiKeyStatus.etherscan?.valid ? 
                    <Check className="w-3 h-3 text-green-400" /> : 
                    <X className="w-3 h-3 text-red-400" />
                  }
                  Etherscan API
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Browser Info</h4>
              <ul className="text-sm opacity-80 space-y-1">
                <li>Timezone: {settings.preferences.timezone}</li>
                <li>Language: {navigator.language}</li>
                <li>Platform: {navigator.platform}</li>
                <li>Online: {navigator.onLine ? 'Yes' : 'No'}</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-center gap-4">
        <Button 
          onClick={saveSettings}
          disabled={loading}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-8"
        >
          <Save className="w-4 h-4 mr-2" />
          {loading ? 'Saving...' : 'Save All Settings'}
        </Button>

        <Button 
          variant="outline" 
          onClick={exportSettings}
          className="border-white/20 hover:bg-white/10"
        >
          Export Settings
        </Button>

        <div className="relative">
          <input
            type="file"
            accept=".json"
            onChange={importSettings}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <Button 
            variant="outline"
            className="border-white/20 hover:bg-white/10"
          >
            Import Settings
          </Button>
        </div>

        <Button 
          variant="destructive" 
          onClick={resetSettings}
          className="bg-red-500/20 hover:bg-red-500/30 border-red-500/20"
        >
          Reset to Default
        </Button>
      </div>
    </div>
  );
};
