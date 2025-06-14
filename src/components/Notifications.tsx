
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Bell, TrendingUp, TrendingDown, AlertTriangle, Info, CheckCircle, Settings, Trash2 } from "lucide-react";

const notifications = [
  {
    id: 1,
    type: "price_alert",
    title: "AAPL Price Alert",
    message: "Apple (AAPL) has reached your target price of $185.00",
    time: "2 minutes ago",
    read: false,
    priority: "high",
    icon: TrendingUp,
    color: "text-green-600"
  },
  {
    id: 2,
    type: "portfolio",
    title: "Portfolio Daily Summary",
    message: "Your portfolio gained +2.3% today ($2,456). Tesla was your top performer.",
    time: "1 hour ago",
    read: false,
    priority: "medium",
    icon: Info,
    color: "text-blue-600"
  },
  {
    id: 3,
    type: "security",
    title: "Security Alert",
    message: "New login detected from San Francisco, CA. Was this you?",
    time: "3 hours ago",
    read: true,
    priority: "high",
    icon: AlertTriangle,
    color: "text-red-600"
  },
  {
    id: 4,
    type: "trade",
    title: "Trade Executed",
    message: "Your limit order for 50 shares of MSFT at $365.00 has been filled.",
    time: "5 hours ago",
    read: true,
    priority: "medium",
    icon: CheckCircle,
    color: "text-green-600"
  },
  {
    id: 5,
    type: "market",
    title: "Market Update",
    message: "Federal Reserve announces interest rate decision at 2:00 PM EST today.",
    time: "6 hours ago",
    read: true,
    priority: "low",
    icon: Bell,
    color: "text-slate-600"
  }
];

const priceAlerts = [
  { symbol: "AAPL", condition: "Above $185.00", status: "Active", triggered: true },
  { symbol: "TSLA", condition: "Below $240.00", status: "Active", triggered: false },
  { symbol: "NVDA", condition: "Above $500.00", status: "Active", triggered: false },
  { symbol: "BTC", condition: "Above $45,000", status: "Paused", triggered: false }
];

const notificationSettings = [
  { category: "Price Alerts", description: "Get notified when your watched stocks hit target prices", enabled: true },
  { category: "Portfolio Updates", description: "Daily portfolio performance summaries", enabled: true },
  { category: "Trade Confirmations", description: "Confirmations for executed trades", enabled: true },
  { category: "Market News", description: "Breaking market news and updates", enabled: false },
  { category: "Security Alerts", description: "Login attempts and security warnings", enabled: true },
  { category: "Educational Content", description: "New courses and learning materials", enabled: false },
  { category: "Social Updates", description: "New followers and community interactions", enabled: true }
];

export const Notifications = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Notifications</h2>
          <p className="text-slate-600 dark:text-slate-400">Manage your alerts and notification preferences</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">Mark All Read</Button>
          <Button>
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All (2)</TabsTrigger>
          <TabsTrigger value="alerts">Price Alerts</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {notifications.map((notification) => (
            <Card key={notification.id} className={`${!notification.read ? 'border-blue-200 bg-blue-50/50 dark:bg-blue-950/20' : ''} hover:shadow-md transition-shadow`}>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className={`p-2 rounded-full bg-slate-100 dark:bg-slate-800 ${notification.color}`}>
                    <notification.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white">{notification.title}</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{notification.message}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className="text-xs text-slate-500">{notification.time}</span>
                          <Badge 
                            variant={notification.priority === 'high' ? 'destructive' : notification.priority === 'medium' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {notification.priority}
                          </Badge>
                          {!notification.read && <Badge variant="default" className="text-xs">New</Badge>}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Price Alerts</CardTitle>
                  <CardDescription>Manage your stock and crypto price alerts</CardDescription>
                </div>
                <Button>Add Alert</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {priceAlerts.map((alert, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="font-semibold">{alert.symbol}</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">{alert.condition}</div>
                      <Badge variant={alert.status === 'Active' ? 'default' : 'secondary'}>
                        {alert.status}
                      </Badge>
                      {alert.triggered && <Badge variant="destructive">Triggered</Badge>}
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="portfolio" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Notifications</CardTitle>
              <CardDescription>Alerts related to your portfolio performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notifications.filter(n => n.type === 'portfolio' || n.type === 'trade').map((notification) => (
                  <div key={notification.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                    <div className={`p-2 rounded-full bg-slate-100 dark:bg-slate-800 ${notification.color}`}>
                      <notification.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{notification.title}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{notification.message}</p>
                      <span className="text-xs text-slate-500">{notification.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Notifications</CardTitle>
              <CardDescription>Login attempts and security-related alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notifications.filter(n => n.type === 'security').map((notification) => (
                  <div key={notification.id} className="flex items-start space-x-4 p-4 border rounded-lg border-red-200 bg-red-50 dark:bg-red-950/20">
                    <div className="p-2 rounded-full bg-red-100 dark:bg-red-900 text-red-600">
                      <notification.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-red-900 dark:text-red-300">{notification.title}</h3>
                      <p className="text-sm text-red-700 dark:text-red-400">{notification.message}</p>
                      <span className="text-xs text-red-600">{notification.time}</span>
                    </div>
                    <Button size="sm" variant="outline">Review</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose which notifications you want to receive</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {notificationSettings.map((setting, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="font-semibold">{setting.category}</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">{setting.description}</div>
                    </div>
                    <Switch checked={setting.enabled} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Delivery Preferences</CardTitle>
              <CardDescription>How would you like to receive notifications?</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">Push Notifications</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">In-app notifications</div>
                  </div>
                  <Switch checked={true} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">Email Notifications</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Send to your email address</div>
                  </div>
                  <Switch checked={false} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">SMS Alerts</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Critical alerts via text message</div>
                  </div>
                  <Switch checked={true} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
