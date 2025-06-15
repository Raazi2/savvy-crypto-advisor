
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, CheckCircle, Loader2, ExternalLink, Shield, TrendingUp } from 'lucide-react';
import { useBroker } from '@/hooks/useBroker';

export const BrokerConnection = () => {
  const { isConnected, isConnecting, userProfile, connectZerodha, disconnect } = useBroker();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Broker Connection</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Connect your trading account to enable live trading and portfolio sync
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Connection Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Connection Status</span>
              {isConnected ? (
                <Badge variant="default" className="bg-green-100 text-green-800">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Connected
                </Badge>
              ) : (
                <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Not Connected
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isConnected && userProfile ? (
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">User ID</p>
                  <p className="font-medium">{userProfile.user_id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Name</p>
                  <p className="font-medium">{userProfile.user_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Broker</p>
                  <p className="font-medium">{userProfile.broker}</p>
                </div>
                <Separator />
                <Button onClick={disconnect} variant="outline" className="w-full">
                  Disconnect Account
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Broker Connected</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Connect your trading account to start live trading
                  </p>
                </div>
                
                <Button
                  onClick={connectZerodha}
                  disabled={isConnecting}
                  className="w-full"
                >
                  {isConnecting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Connect Zerodha Account
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Available Brokers */}
        <Card>
          <CardHeader>
            <CardTitle>Supported Brokers</CardTitle>
            <CardDescription>
              Choose from our supported broker partners
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium">Zerodha</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">India's largest broker</p>
                  </div>
                </div>
                <Badge variant="default">Available</Badge>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg opacity-50">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Upstox</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Low-cost trading</p>
                  </div>
                </div>
                <Badge variant="secondary">Coming Soon</Badge>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg opacity-50">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Angel One</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Full-service broker</p>
                  </div>
                </div>
                <Badge variant="secondary">Coming Soon</Badge>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-start space-x-2">
                <Shield className="w-4 h-4 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Secure Connection</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    All connections use OAuth 2.0 and are encrypted
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Features Enabled */}
      {isConnected && (
        <Card>
          <CardHeader>
            <CardTitle>Features Enabled</CardTitle>
            <CardDescription>
              With your broker connected, you can now access these features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm">Live Portfolio Sync</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm">Real Order Placement</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm">Live P&L Tracking</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm">Holdings Management</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm">Order History</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm">Real-time Quotes</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
