
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Settings as SettingsIcon, Shield, Bell, Globe, CreditCard, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useSettings } from '@/hooks/useSettings';
import { useToast } from '@/hooks/use-toast';

export const Settings = () => {
  const { user } = useAuth();
  const { settings, updateSettings } = useSettings();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      // Settings are automatically saved via useSettings hook
      toast({
        title: "Settings Saved",
        description: "Your preferences have been updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <SettingsIcon className="w-8 h-8 mr-2" />
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your account preferences and security settings
          </p>
        </div>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="banking">Banking</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                General Settings
              </CardTitle>
              <CardDescription>
                Configure your basic preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="currency">Default Currency</Label>
                <Select 
                  value={settings?.preferences?.defaultCurrency || 'USD'}
                  onValueChange={(value) => 
                    updateSettings({
                      preferences: { 
                        ...settings?.preferences, 
                        defaultCurrency: value 
                      }
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="INR">INR (₹)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="theme">Theme</Label>
                <Select 
                  value={settings?.preferences?.theme || 'system'}
                  onValueChange={(value) => 
                    updateSettings({
                      preferences: { 
                        ...settings?.preferences, 
                        theme: value 
                      }
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleSaveSettings} disabled={loading}>
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Manage your account security
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <Switch 
                  checked={settings?.security?.twoFactorEnabled || false}
                  onCheckedChange={(checked) => 
                    updateSettings({
                      security: { 
                        ...settings?.security, 
                        twoFactorEnabled: checked 
                      }
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Login Notifications</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Get notified of new login attempts
                  </p>
                </div>
                <Switch 
                  checked={settings?.security?.loginNotifications || false}
                  onCheckedChange={(checked) => 
                    updateSettings({
                      security: { 
                        ...settings?.security, 
                        loginNotifications: checked 
                      }
                    })
                  }
                />
              </div>

              <Button onClick={handleSaveSettings} disabled={loading}>
                Save Security Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                Notification Settings
              </CardTitle>
              <CardDescription>
                Configure how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Price Alerts</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Get notified when stocks reach target prices
                  </p>
                </div>
                <Switch 
                  checked={settings?.notifications?.priceAlerts || false}
                  onCheckedChange={(checked) => 
                    updateSettings({
                      notifications: { 
                        ...settings?.notifications, 
                        priceAlerts: checked 
                      }
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Trade Confirmations</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Get notified when trades are executed
                  </p>
                </div>
                <Switch 
                  checked={settings?.notifications?.tradeConfirmations || false}
                  onCheckedChange={(checked) => 
                    updateSettings({
                      notifications: { 
                        ...settings?.notifications, 
                        tradeConfirmations: checked 
                      }
                    })
                  }
                />
              </div>

              <Button onClick={handleSaveSettings} disabled={loading}>
                Save Notification Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="banking">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Banking & Payments
              </CardTitle>
              <CardDescription>
                Manage your payment methods and banking preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <CreditCard className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Banking Integration
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Full banking integration will be available here
                </p>
                <Badge variant="secondary">Coming Soon</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
