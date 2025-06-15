
interface NotificationOptions {
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  persistent?: boolean;
  actions?: Array<{
    label: string;
    action: () => void;
  }>;
}

class NotificationService {
  private settings: any = null;

  setSettings(settings: any) {
    this.settings = settings;
  }

  async sendNotification(type: string, options: NotificationOptions) {
    if (!this.settings?.isNotificationEnabled(type)) {
      return;
    }

    // Browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(options.title, {
        body: options.message,
        icon: '/favicon.ico'
      });
    }

    // Toast notification
    const { toast } = await import('@/hooks/use-toast');
    toast({
      title: options.title,
      description: options.message,
      variant: options.type === 'error' ? 'destructive' : 'default'
    });

    // Log to console for debugging
    console.log(`[${type.toUpperCase()}] ${options.title}: ${options.message}`);
  }

  async requestPermission() {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }

  // Specific notification methods
  async priceAlert(symbol: string, price: number, targetPrice: number, currency: string = 'USD') {
    const currencySymbol = currency === 'INR' ? '₹' : '$';
    await this.sendNotification('priceAlerts', {
      title: 'Price Alert',
      message: `${symbol} has reached ${currencySymbol}${price} (target: ${currencySymbol}${targetPrice})`,
      type: 'info'
    });
  }

  async securityAlert(message: string) {
    await this.sendNotification('securityAlerts', {
      title: 'Security Alert',
      message,
      type: 'warning'
    });
  }

  async portfolioUpdate(change: number, value: number, currency: string = 'USD') {
    const currencySymbol = currency === 'INR' ? '₹' : '$';
    await this.sendNotification('portfolioUpdates', {
      title: 'Portfolio Update',
      message: `Your portfolio ${change >= 0 ? 'gained' : 'lost'} ${Math.abs(change)}% today. Current value: ${currencySymbol}${value.toLocaleString()}`,
      type: change >= 0 ? 'success' : 'warning'
    });
  }

  async tradeConfirmation(type: string, symbol: string, quantity: number, price: number, currency: string = 'USD') {
    const currencySymbol = currency === 'INR' ? '₹' : '$';
    await this.sendNotification('tradeConfirmations', {
      title: 'Trade Executed',
      message: `${type} order for ${quantity} shares of ${symbol} at ${currencySymbol}${price} has been filled`,
      type: 'success'
    });
  }

  async marketNews(headline: string) {
    await this.sendNotification('marketNews', {
      title: 'Market News',
      message: headline,
      type: 'info'
    });
  }

  // Indian-specific notifications
  async sipReminder(amount: number, fundName: string) {
    await this.sendNotification('portfolioUpdates', {
      title: 'SIP Reminder',
      message: `Your SIP of ₹${amount} for ${fundName} is due tomorrow`,
      type: 'info'
    });
  }

  async taxSavingAlert(remainingAmount: number) {
    await this.sendNotification('educationalContent', {
      title: 'Tax Saving Alert',
      message: `You can still save ₹${remainingAmount} in taxes under Section 80C this financial year`,
      type: 'info'
    });
  }

  async ppfMaturityAlert(amount: number, daysLeft: number) {
    await this.sendNotification('portfolioUpdates', {
      title: 'PPF Maturity Alert',
      message: `Your PPF worth ₹${amount.toLocaleString()} will mature in ${daysLeft} days`,
      type: 'info'
    });
  }

  async indianMarketAlert(message: string) {
    await this.sendNotification('marketNews', {
      title: 'Indian Market Alert',
      message,
      type: 'info'
    });
  }
}

export const notificationService = new NotificationService();
