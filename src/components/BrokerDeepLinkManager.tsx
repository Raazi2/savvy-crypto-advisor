
import { useSettings } from '@/hooks/useSettings';
import { useToast } from '@/hooks/use-toast';

interface BrokerDeepLink {
  id: string;
  name: string;
  mobileScheme: string;
  webUrl: string;
  orderTemplate: string;
  watchlistTemplate: string;
  portfolioTemplate: string;
}

interface StockData {
  symbol: string;
  price: number;
  exchange?: string;
}

const BROKER_DEEP_LINKS: BrokerDeepLink[] = [
  {
    id: 'zerodha',
    name: 'Zerodha Kite',
    mobileScheme: 'kite://',
    webUrl: 'https://kite.zerodha.com',
    orderTemplate: 'kite://orders/buy?tradingsymbol={symbol}&exchange={exchange}&quantity={quantity}&price={price}',
    watchlistTemplate: 'kite://watchlist/add?symbol={symbol}',
    portfolioTemplate: 'kite://portfolio'
  },
  {
    id: 'angelone',
    name: 'Angel One',
    mobileScheme: 'angelone://',
    webUrl: 'https://trade.angelone.in',
    orderTemplate: 'angelone://trade?symbol={symbol}&quantity={quantity}&action=buy&price={price}',
    watchlistTemplate: 'angelone://watchlist?symbol={symbol}',
    portfolioTemplate: 'angelone://portfolio'
  },
  {
    id: 'upstox',
    name: 'Upstox Pro',
    mobileScheme: 'upstox://',
    webUrl: 'https://pro.upstox.com',
    orderTemplate: 'upstox://trade?symbol={symbol}&quantity={quantity}&side=buy&price={price}',
    watchlistTemplate: 'upstox://watchlist?symbol={symbol}',
    portfolioTemplate: 'upstox://portfolio'
  },
  {
    id: 'groww',
    name: 'Groww',
    mobileScheme: 'groww://',
    webUrl: 'https://groww.in',
    orderTemplate: 'groww://stocks/{symbol}?action=buy&quantity={quantity}',
    watchlistTemplate: 'groww://stocks/{symbol}?action=watchlist',
    portfolioTemplate: 'groww://portfolio'
  },
  {
    id: 'icici',
    name: 'ICICI Direct',
    mobileScheme: 'icicidirect://',
    webUrl: 'https://secure.icicidirect.com',
    orderTemplate: 'icicidirect://trade?symbol={symbol}&quantity={quantity}&action=buy',
    watchlistTemplate: 'icicidirect://watchlist?symbol={symbol}',
    portfolioTemplate: 'icicidirect://portfolio'
  }
];

export const useBrokerDeepLink = () => {
  const { settings } = useSettings();
  const { toast } = useToast();

  const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  };

  const getBrokerConfig = (brokerId?: string): BrokerDeepLink | null => {
    const targetId = brokerId || settings.preferences.defaultBroker;
    return BROKER_DEEP_LINKS.find(broker => broker.id === targetId) || BROKER_DEEP_LINKS[0];
  };

  const generateDeepLink = (
    action: 'order' | 'watchlist' | 'portfolio',
    stock?: StockData,
    options?: {
      quantity?: number;
      price?: number;
      brokerId?: string;
    }
  ): string => {
    const broker = getBrokerConfig(options?.brokerId);
    if (!broker) return '';

    const params = {
      symbol: stock?.symbol || '',
      exchange: stock?.exchange || 'NSE',
      quantity: options?.quantity || 1,
      price: options?.price || stock?.price || 0
    };

    let template = '';
    switch (action) {
      case 'order':
        template = broker.orderTemplate;
        break;
      case 'watchlist':
        template = broker.watchlistTemplate;
        break;
      case 'portfolio':
        template = broker.portfolioTemplate;
        break;
    }

    // Replace placeholders
    return template.replace(/\{(\w+)\}/g, (match, key) => {
      return params[key as keyof typeof params]?.toString() || '';
    });
  };

  const generateWebLink = (
    action: 'order' | 'watchlist' | 'portfolio',
    stock?: StockData,
    options?: {
      brokerId?: string;
    }
  ): string => {
    const broker = getBrokerConfig(options?.brokerId);
    if (!broker) return '';

    switch (action) {
      case 'order':
        return `${broker.webUrl}/trade?symbol=${stock?.symbol || ''}`;
      case 'watchlist':
        return `${broker.webUrl}/watchlist?symbol=${stock?.symbol || ''}`;
      case 'portfolio':
        return `${broker.webUrl}/portfolio`;
      default:
        return broker.webUrl;
    }
  };

  const openBrokerApp = async (
    action: 'order' | 'watchlist' | 'portfolio',
    stock?: StockData,
    options?: {
      quantity?: number;
      price?: number;
      brokerId?: string;
      fallbackToWeb?: boolean;
    }
  ) => {
    try {
      const broker = getBrokerConfig(options?.brokerId);
      if (!broker) {
        throw new Error('Broker not found');
      }

      const mobile = isMobile();
      const fallbackToWeb = options?.fallbackToWeb !== false;

      if (mobile) {
        // Try deep link first
        const deepLink = generateDeepLink(action, stock, options);
        
        // Create a hidden link and click it
        const link = document.createElement('a');
        link.href = deepLink;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Fallback to web after delay if deep link fails
        if (fallbackToWeb) {
          setTimeout(() => {
            const webLink = generateWebLink(action, stock, options);
            window.open(webLink, '_blank');
          }, 2500);
        }
      } else {
        // Desktop: open web version directly
        const webLink = generateWebLink(action, stock, options);
        window.open(webLink, '_blank');
      }

      // Analytics tracking
      console.log(`Broker redirect: ${broker.name} - ${action}`, {
        stock: stock?.symbol,
        mobile,
        deepLink: mobile ? generateDeepLink(action, stock, options) : null,
        webLink: generateWebLink(action, stock, options)
      });

      toast({
        title: `Opening ${broker.name}`,
        description: mobile 
          ? `Trying to open ${broker.name} app, falling back to web if needed`
          : `Opening ${broker.name} web platform`,
      });

    } catch (error) {
      console.error('Error opening broker app:', error);
      toast({
        title: "Error",
        description: "Failed to open broker application",
        variant: "destructive"
      });
    }
  };

  const trackBrokerInteraction = (
    brokerId: string,
    action: string,
    stockSymbol?: string
  ) => {
    // This would typically send data to analytics service
    console.log('Broker interaction tracked:', {
      brokerId,
      action,
      stockSymbol,
      timestamp: new Date().toISOString(),
      userId: 'current-user-id' // Replace with actual user ID
    });
  };

  return {
    openBrokerApp,
    generateDeepLink,
    generateWebLink,
    getBrokerConfig,
    trackBrokerInteraction,
    isMobile: isMobile()
  };
};

export const BrokerDeepLinkManager = () => {
  // This is a utility component, doesn't render anything
  return null;
};
