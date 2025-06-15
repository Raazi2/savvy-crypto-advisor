
interface ZerodhaConfig {
  apiKey: string;
  apiSecret: string;
  redirectUrl: string;
}

interface ZerodhaOrder {
  tradingsymbol: string;
  exchange: string;
  transaction_type: 'BUY' | 'SELL';
  quantity: number;
  product: 'MIS' | 'CNC' | 'NRML';
  order_type: 'MARKET' | 'LIMIT' | 'SL' | 'SL-M';
  price?: number;
  trigger_price?: number;
  validity: 'DAY' | 'IOC';
}

interface ZerodhaPosition {
  tradingsymbol: string;
  exchange: string;
  quantity: number;
  average_price: number;
  last_price: number;
  pnl: number;
  product: string;
}

interface ZerodhaHolding {
  tradingsymbol: string;
  exchange: string;
  quantity: number;
  average_price: number;
  last_price: number;
  pnl: number;
}

class ZerodhaService {
  private apiKey: string;
  private accessToken: string | null = null;
  private baseUrl = 'https://api.kite.trade';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  // Generate login URL for OAuth
  getLoginUrl(redirectUrl: string): string {
    const params = new URLSearchParams({
      api_key: this.apiKey,
      response_type: 'code',
      state: Math.random().toString(36).substring(7),
    });
    
    return `https://kite.zerodha.com/connect/login?${params.toString()}`;
  }

  // Exchange request token for access token
  async generateSession(requestToken: string, apiSecret: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/session/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          api_key: this.apiKey,
          request_token: requestToken,
          checksum: this.generateChecksum(this.apiKey + requestToken + apiSecret),
        }),
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        this.accessToken = data.data.access_token;
        localStorage.setItem('zerodha_access_token', this.accessToken);
      } else {
        throw new Error(data.message || 'Failed to generate session');
      }
    } catch (error) {
      console.error('Error generating session:', error);
      throw error;
    }
  }

  // Generate checksum for authentication
  private generateChecksum(data: string): string {
    // In a real implementation, use crypto library to generate SHA256 hash
    // For now, returning a placeholder
    return btoa(data);
  }

  // Get user profile
  async getProfile(): Promise<any> {
    return this.makeAuthenticatedRequest('/user/profile');
  }

  // Get holdings
  async getHoldings(): Promise<ZerodhaHolding[]> {
    const response = await this.makeAuthenticatedRequest('/portfolio/holdings');
    return response.data || [];
  }

  // Get positions
  async getPositions(): Promise<ZerodhaPosition[]> {
    const response = await this.makeAuthenticatedRequest('/portfolio/positions');
    return response.data?.net || [];
  }

  // Place order
  async placeOrder(order: ZerodhaOrder): Promise<string> {
    const response = await this.makeAuthenticatedRequest('/orders/regular', {
      method: 'POST',
      body: new URLSearchParams(order as any),
    });
    
    if (response.status === 'success') {
      return response.data.order_id;
    } else {
      throw new Error(response.message || 'Failed to place order');
    }
  }

  // Get orders
  async getOrders(): Promise<any[]> {
    const response = await this.makeAuthenticatedRequest('/orders');
    return response.data || [];
  }

  // Get order history
  async getOrderHistory(orderId: string): Promise<any[]> {
    const response = await this.makeAuthenticatedRequest(`/orders/${orderId}`);
    return response.data || [];
  }

  // Cancel order
  async cancelOrder(orderId: string): Promise<void> {
    await this.makeAuthenticatedRequest(`/orders/regular/${orderId}`, {
      method: 'DELETE',
    });
  }

  // Get LTP (Last Traded Price) for instruments
  async getLTP(instruments: string[]): Promise<Record<string, any>> {
    const response = await this.makeAuthenticatedRequest(`/quote/ltp?i=${instruments.join('&i=')}`);
    return response.data || {};
  }

  // Get quote for instruments
  async getQuote(instruments: string[]): Promise<Record<string, any>> {
    const response = await this.makeAuthenticatedRequest(`/quote?i=${instruments.join('&i=')}`);
    return response.data || {};
  }

  // Make authenticated API request
  private async makeAuthenticatedRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    if (!this.accessToken) {
      const storedToken = localStorage.getItem('zerodha_access_token');
      if (!storedToken) {
        throw new Error('No access token available. Please login first.');
      }
      this.accessToken = storedToken;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `token ${this.apiKey}:${this.accessToken}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        ...options.headers,
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.accessToken || !!localStorage.getItem('zerodha_access_token');
  }

  // Logout
  logout(): void {
    this.accessToken = null;
    localStorage.removeItem('zerodha_access_token');
  }
}

export default ZerodhaService;
export type { ZerodhaOrder, ZerodhaPosition, ZerodhaHolding };
