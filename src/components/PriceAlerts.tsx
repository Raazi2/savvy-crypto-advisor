
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertTriangle, Bell, BellOff, Plus, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSettings } from '@/hooks/useSettings';
import { notificationService } from '@/services/notificationService';

interface PriceAlert {
  id: string;
  symbol: string;
  companyName: string;
  alertType: 'above' | 'below' | 'change';
  targetPrice: number;
  currentPrice: number;
  changePercent?: number;
  isActive: boolean;
  createdAt: string;
  triggeredAt?: string;
}

interface NewAlertForm {
  symbol: string;
  alertType: 'above' | 'below' | 'change';
  targetPrice: string;
  changePercent: string;
}

interface PriceAlertsProps {
  availableStocks: Array<{
    symbol: string;
    name: string;
    price: number;
  }>;
}

export const PriceAlerts: React.FC<PriceAlertsProps> = ({ availableStocks }) => {
  const { toast } = useToast();
  const { settings } = useSettings();
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newAlert, setNewAlert] = useState<NewAlertForm>({
    symbol: '',
    alertType: 'above',
    targetPrice: '',
    changePercent: ''
  });

  useEffect(() => {
    // Load existing alerts from localStorage
    loadAlerts();
    
    // Set up notification service
    notificationService.setSettings(settings);
    
    // Request notification permission
    notificationService.requestPermission();
    
    // Check alerts every 30 seconds
    const interval = setInterval(checkAlerts, 30000);
    return () => clearInterval(interval);
  }, [settings]);

  const loadAlerts = () => {
    const stored = localStorage.getItem('priceAlerts');
    if (stored) {
      try {
        setAlerts(JSON.parse(stored));
      } catch (error) {
        console.error('Error loading alerts:', error);
      }
    }
  };

  const saveAlerts = (alertsToSave: PriceAlert[]) => {
    localStorage.setItem('priceAlerts', JSON.stringify(alertsToSave));
    setAlerts(alertsToSave);
  };

  const checkAlerts = () => {
    setAlerts(currentAlerts => {
      const updatedAlerts = currentAlerts.map(alert => {
        if (!alert.isActive || alert.triggeredAt) return alert;

        const stock = availableStocks.find(s => s.symbol === alert.symbol);
        if (!stock) return alert;

        let shouldTrigger = false;
        const currentPrice = stock.price;

        switch (alert.alertType) {
          case 'above':
            shouldTrigger = currentPrice >= alert.targetPrice;
            break;
          case 'below':
            shouldTrigger = currentPrice <= alert.targetPrice;
            break;
          case 'change':
            const changePercent = Math.abs((currentPrice - alert.currentPrice) / alert.currentPrice * 100);
            shouldTrigger = changePercent >= (alert.changePercent || 5);
            break;
        }

        if (shouldTrigger) {
          // Trigger notification
          notificationService.priceAlert(
            alert.symbol,
            currentPrice,
            alert.targetPrice,
            settings?.preferences?.defaultCurrency || 'USD'
          );

          return {
            ...alert,
            triggeredAt: new Date().toISOString(),
            isActive: false
          };
        }

        return { ...alert, currentPrice };
      });

      // Save updated alerts
      localStorage.setItem('priceAlerts', JSON.stringify(updatedAlerts));
      return updatedAlerts;
    });
  };

  const createAlert = () => {
    if (!newAlert.symbol || !newAlert.targetPrice) {
      toast({
        title: "Invalid Alert",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    const stock = availableStocks.find(s => s.symbol === newAlert.symbol);
    if (!stock) {
      toast({
        title: "Stock Not Found",
        description: "Selected stock is not available",
        variant: "destructive"
      });
      return;
    }

    const alert: PriceAlert = {
      id: Math.random().toString(36).substr(2, 9),
      symbol: newAlert.symbol,
      companyName: stock.name,
      alertType: newAlert.alertType,
      targetPrice: parseFloat(newAlert.targetPrice),
      currentPrice: stock.price,
      changePercent: newAlert.changePercent ? parseFloat(newAlert.changePercent) : undefined,
      isActive: true,
      createdAt: new Date().toISOString()
    };

    const updatedAlerts = [...alerts, alert];
    saveAlerts(updatedAlerts);

    toast({
      title: "Alert Created",
      description: `Price alert set for ${newAlert.symbol} at $${newAlert.targetPrice}`,
    });

    // Reset form
    setNewAlert({
      symbol: '',
      alertType: 'above',
      targetPrice: '',
      changePercent: ''
    });
    setIsDialogOpen(false);
  };

  const deleteAlert = (alertId: string) => {
    const updatedAlerts = alerts.filter(alert => alert.id !== alertId);
    saveAlerts(updatedAlerts);
    
    toast({
      title: "Alert Deleted",
      description: "Price alert has been removed",
    });
  };

  const toggleAlert = (alertId: string) => {
    const updatedAlerts = alerts.map(alert => 
      alert.id === alertId 
        ? { ...alert, isActive: !alert.isActive, triggeredAt: undefined }
        : alert
    );
    saveAlerts(updatedAlerts);
  };

  const getAlertIcon = (alertType: string) => {
    switch (alertType) {
      case 'above': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'below': return <TrendingDown className="w-4 h-4 text-red-600" />;
      case 'change': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const formatAlertCondition = (alert: PriceAlert) => {
    switch (alert.alertType) {
      case 'above':
        return `When price goes above $${alert.targetPrice}`;
      case 'below':
        return `When price goes below $${alert.targetPrice}`;
      case 'change':
        return `When price changes by ${alert.changePercent}%`;
      default:
        return 'Unknown condition';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Bell className="w-5 h-5 mr-2" />
            Price Alerts
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Alert
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Price Alert</DialogTitle>
                <DialogDescription>
                  Get notified when your stock reaches your target price
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="symbol">Stock Symbol</Label>
                  <Select value={newAlert.symbol} onValueChange={(value) => 
                    setNewAlert(prev => ({ ...prev, symbol: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select stock" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableStocks.map((stock) => (
                        <SelectItem key={stock.symbol} value={stock.symbol}>
                          {stock.symbol} - {stock.name} (${stock.price.toFixed(2)})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="alertType">Alert Type</Label>
                  <Select value={newAlert.alertType} onValueChange={(value: 'above' | 'below' | 'change') => 
                    setNewAlert(prev => ({ ...prev, alertType: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="above">Price Above</SelectItem>
                      <SelectItem value="below">Price Below</SelectItem>
                      <SelectItem value="change">Price Change %</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {newAlert.alertType !== 'change' ? (
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
                ) : (
                  <div>
                    <Label htmlFor="changePercent">Change Percentage (%)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={newAlert.changePercent}
                      onChange={(e) => setNewAlert(prev => ({ ...prev, changePercent: e.target.value }))}
                      placeholder="e.g., 5 for 5% change"
                    />
                  </div>
                )}

                <Button onClick={createAlert} className="w-full">
                  Create Alert
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
        <CardDescription>
          Manage your price alerts and notifications
        </CardDescription>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <div className="text-center py-8">
            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No alerts set</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Create your first price alert to get notified when stocks hit your target prices
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Stock</TableHead>
                <TableHead>Condition</TableHead>
                <TableHead>Current Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alerts.map((alert) => (
                <TableRow key={alert.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{alert.symbol}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {alert.companyName}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {getAlertIcon(alert.alertType)}
                      <span className="ml-2 text-sm">
                        {formatAlertCondition(alert)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    ${alert.currentPrice.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      alert.triggeredAt ? 'destructive' : 
                      alert.isActive ? 'default' : 'secondary'
                    }>
                      {alert.triggeredAt ? 'Triggered' : 
                       alert.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleAlert(alert.id)}
                        disabled={!!alert.triggeredAt}
                      >
                        {alert.isActive ? (
                          <BellOff className="w-4 h-4" />
                        ) : (
                          <Bell className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteAlert(alert.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
