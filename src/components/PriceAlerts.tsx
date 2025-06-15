
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Bell, Plus, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PriceAlert {
  id: string;
  symbol: string;
  assetName: string;
  targetPrice: number;
  condition: 'above' | 'below';
  currentPrice: number;
  isActive: boolean;
  createdAt: Date;
}

interface PriceAlertsProps {
  symbol: string;
  currentPrice: number;
  assetName: string;
}

export const PriceAlerts: React.FC<PriceAlertsProps> = ({ symbol, currentPrice, assetName }) => {
  const { toast } = useToast();
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [newAlert, setNewAlert] = useState({
    targetPrice: '',
    condition: 'above' as 'above' | 'below'
  });

  // Load existing alerts on component mount
  useEffect(() => {
    loadAlerts();
  }, [symbol]);

  const loadAlerts = () => {
    // In a real app, this would load from API/database
    const savedAlerts = localStorage.getItem(`price-alerts-${symbol}`);
    if (savedAlerts) {
      setAlerts(JSON.parse(savedAlerts));
    }
  };

  const saveAlerts = (updatedAlerts: PriceAlert[]) => {
    localStorage.setItem(`price-alerts-${symbol}`, JSON.stringify(updatedAlerts));
    setAlerts(updatedAlerts);
  };

  const createAlert = () => {
    const targetPrice = parseFloat(newAlert.targetPrice);
    
    if (!targetPrice || targetPrice <= 0) {
      toast({
        title: "Invalid Price",
        description: "Please enter a valid target price",
        variant: "destructive"
      });
      return;
    }

    const alert: PriceAlert = {
      id: Date.now().toString(),
      symbol,
      assetName,
      targetPrice,
      condition: newAlert.condition,
      currentPrice,
      isActive: true,
      createdAt: new Date()
    };

    const updatedAlerts = [...alerts, alert];
    saveAlerts(updatedAlerts);
    
    setNewAlert({ targetPrice: '', condition: 'above' });
    
    toast({
      title: "Alert Created",
      description: `Price alert set for ${symbol} ${newAlert.condition} $${targetPrice.toFixed(2)}`,
    });
  };

  const deleteAlert = (id: string) => {
    const updatedAlerts = alerts.filter(alert => alert.id !== id);
    saveAlerts(updatedAlerts);
    
    toast({
      title: "Alert Deleted",
      description: "Price alert has been removed",
    });
  };

  const toggleAlert = (id: string) => {
    const updatedAlerts = alerts.map(alert => 
      alert.id === id ? { ...alert, isActive: !alert.isActive } : alert
    );
    saveAlerts(updatedAlerts);
  };

  const getAlertStatus = (alert: PriceAlert) => {
    const isTriggered = alert.condition === 'above' 
      ? currentPrice >= alert.targetPrice 
      : currentPrice <= alert.targetPrice;
    
    return isTriggered;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="w-5 h-5 mr-2" />
            Price Alerts for {symbol}
          </CardTitle>
          <CardDescription>
            Get notified when {assetName} reaches your target price
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Current Price Display */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg mb-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold">{assetName} ({symbol})</h3>
              <div className="text-3xl font-bold mt-2">
                ${currentPrice.toFixed(currentPrice < 1 ? 6 : 2)}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Current Price</p>
            </div>
          </div>

          {/* Create New Alert */}
          <div className="border rounded-lg p-4 mb-6">
            <h3 className="font-semibold mb-4 flex items-center">
              <Plus className="w-4 h-4 mr-2" />
              Create New Alert
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="condition">Condition</Label>
                <Select value={newAlert.condition} onValueChange={(value: 'above' | 'below') => 
                  setNewAlert(prev => ({ ...prev, condition: value }))
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="above">
                      <div className="flex items-center">
                        <TrendingUp className="w-4 h-4 mr-2 text-green-600" />
                        Above
                      </div>
                    </SelectItem>
                    <SelectItem value="below">
                      <div className="flex items-center">
                        <TrendingDown className="w-4 h-4 mr-2 text-red-600" />
                        Below
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="targetPrice">Target Price ($)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={newAlert.targetPrice}
                  onChange={(e) => setNewAlert(prev => ({ ...prev, targetPrice: e.target.value }))}
                  placeholder="Enter target price"
                />
              </div>

              <div className="flex items-end">
                <Button onClick={createAlert} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Alert
                </Button>
              </div>
            </div>
          </div>

          {/* Active Alerts */}
          {alerts.length > 0 ? (
            <div>
              <h3 className="font-semibold mb-4">Active Alerts ({alerts.filter(a => a.isActive).length})</h3>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Condition</TableHead>
                      <TableHead>Target Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {alerts.map((alert) => {
                      const isTriggered = getAlertStatus(alert);
                      
                      return (
                        <TableRow key={alert.id} className={!alert.isActive ? 'opacity-50' : ''}>
                          <TableCell>
                            <div className="flex items-center">
                              {alert.condition === 'above' ? (
                                <TrendingUp className="w-4 h-4 mr-2 text-green-600" />
                              ) : (
                                <TrendingDown className="w-4 h-4 mr-2 text-red-600" />
                              )}
                              {alert.condition === 'above' ? 'Above' : 'Below'}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            ${alert.targetPrice.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            {isTriggered ? (
                              <Badge variant="default" className="bg-green-100 text-green-800">
                                Triggered
                              </Badge>
                            ) : alert.isActive ? (
                              <Badge variant="outline">
                                Active
                              </Badge>
                            ) : (
                              <Badge variant="secondary">
                                Paused
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-sm text-gray-600">
                            {alert.createdAt.toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => toggleAlert(alert.id)}
                              >
                                {alert.isActive ? 'Pause' : 'Resume'}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => deleteAlert(alert.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No price alerts set for {symbol}</p>
              <p className="text-sm">Create your first alert above to get started</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
