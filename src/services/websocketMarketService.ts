
interface MarketDataSubscription {
  symbol: string;
  exchange: 'NSE' | 'BSE' | 'NASDAQ' | 'NYSE';
  callback: (data: LiveMarketData) => void;
}

interface LiveMarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  high: number;
  low: number;
  open: number;
  timestamp: string;
  bid?: number;
  ask?: number;
  marketDepth?: {
    bids: Array<{ price: number; quantity: number }>;
    asks: Array<{ price: number; quantity: number }>;
  };
}

class WebSocketMarketService {
  private ws: WebSocket | null = null;
  private subscriptions: Map<string, MarketDataSubscription[]> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private isConnected = false;
  private heartbeatInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.connect();
  }

  private connect() {
    try {
      // In production, this would be your actual WebSocket endpoint
      // For demo, we'll simulate with a mock WebSocket that provides real-looking data
      this.ws = new WebSocket('wss://echo.websocket.org/');
      
      this.ws.onopen = () => {
        console.log('WebSocket connected for market data');
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.startHeartbeat();
        this.resubscribeAll();
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleMarketData(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.isConnected = false;
        this.stopHeartbeat();
        this.handleReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
      this.handleReconnect();
    }
  }

  private startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'ping' }));
      }
    }, 30000); // Send heartbeat every 30 seconds
  }

  private stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.connect();
      }, this.reconnectDelay * this.reconnectAttempts);
    }
  }

  private resubscribeAll() {
    // Resubscribe to all symbols after reconnection
    for (const [symbol, subscriptions] of this.subscriptions) {
      if (subscriptions.length > 0) {
        this.sendSubscription(symbol, subscriptions[0].exchange);
      }
    }
  }

  private sendSubscription(symbol: string, exchange: string) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const message = {
        type: 'subscribe',
        symbol,
        exchange,
        timestamp: Date.now()
      };
      this.ws.send(JSON.stringify(message));
    }
  }

  private handleMarketData(data: any) {
    // Since we're using a demo WebSocket, we'll generate realistic market data
    const symbol = data.symbol || 'DEMO';
    const subscriptions = this.subscriptions.get(symbol) || [];
    
    if (subscriptions.length > 0) {
      const marketData: LiveMarketData = this.generateRealisticMarketData(symbol);
      
      subscriptions.forEach(sub => {
        sub.callback(marketData);
      });
    }
  }

  private generateRealisticMarketData(symbol: string): LiveMarketData {
    // Generate realistic market data for demo purposes
    const basePrice = this.getBasePriceForSymbol(symbol);
    const volatility = 0.02; // 2% volatility
    const priceChange = (Math.random() - 0.5) * volatility * basePrice;
    const currentPrice = basePrice + priceChange;
    
    return {
      symbol,
      price: currentPrice,
      change: priceChange,
      changePercent: (priceChange / basePrice) * 100,
      volume: Math.floor(Math.random() * 1000000) + 100000,
      high: currentPrice * (1 + Math.random() * 0.03),
      low: currentPrice * (1 - Math.random() * 0.03),
      open: basePrice,
      timestamp: new Date().toISOString(),
      bid: currentPrice - 0.05,
      ask: currentPrice + 0.05,
      marketDepth: {
        bids: Array.from({ length: 5 }, (_, i) => ({
          price: currentPrice - (i + 1) * 0.1,
          quantity: Math.floor(Math.random() * 1000) + 100
        })),
        asks: Array.from({ length: 5 }, (_, i) => ({
          price: currentPrice + (i + 1) * 0.1,
          quantity: Math.floor(Math.random() * 1000) + 100
        }))
      }
    };
  }

  private getBasePriceForSymbol(symbol: string): number {
    const basePrices: Record<string, number> = {
      'RELIANCE': 2500,
      'TCS': 3800,
      'INFY': 1650,
      'HDFCBANK': 1580,
      'ICICIBANK': 950,
      'SBIN': 580,
      'BHARTIARTL': 920,
      'ITC': 420,
      'HINDUNILVR': 2650,
      'KOTAKBANK': 1750,
      'AAPL': 175,
      'MSFT': 380,
      'GOOGL': 138,
      'AMZN': 145,
      'TSLA': 242,
      'NVDA': 875,
      'META': 487,
      'NFLX': 445
    };
    
    return basePrices[symbol] || 100 + Math.random() * 500;
  }

  subscribe(symbol: string, exchange: 'NSE' | 'BSE' | 'NASDAQ' | 'NYSE', callback: (data: LiveMarketData) => void) {
    const subscription: MarketDataSubscription = { symbol, exchange, callback };
    
    if (!this.subscriptions.has(symbol)) {
      this.subscriptions.set(symbol, []);
    }
    
    this.subscriptions.get(symbol)!.push(subscription);
    
    // Send subscription to WebSocket if connected
    if (this.isConnected) {
      this.sendSubscription(symbol, exchange);
    }
    
    // Return unsubscribe function
    return () => {
      const subs = this.subscriptions.get(symbol);
      if (subs) {
        const index = subs.indexOf(subscription);
        if (index > -1) {
          subs.splice(index, 1);
          
          // If no more subscriptions for this symbol, unsubscribe from WebSocket
          if (subs.length === 0) {
            this.subscriptions.delete(symbol);
            if (this.ws && this.ws.readyState === WebSocket.OPEN) {
              this.ws.send(JSON.stringify({
                type: 'unsubscribe',
                symbol,
                exchange
              }));
            }
          }
        }
      }
    };
  }

  disconnect() {
    this.stopHeartbeat();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.subscriptions.clear();
    this.isConnected = false;
  }

  isWebSocketConnected(): boolean {
    return this.isConnected;
  }

  getConnectionStatus(): 'connected' | 'connecting' | 'disconnected' {
    if (this.isConnected) return 'connected';
    if (this.ws && this.ws.readyState === WebSocket.CONNECTING) return 'connecting';
    return 'disconnected';
  }
}

export default WebSocketMarketService;
export type { LiveMarketData, MarketDataSubscription };
