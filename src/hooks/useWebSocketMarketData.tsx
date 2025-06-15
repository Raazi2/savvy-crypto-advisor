
import { useState, useEffect, useRef, useCallback } from 'react';
import WebSocketMarketService, { LiveMarketData } from '@/services/websocketMarketService';

interface UseWebSocketMarketDataOptions {
  symbols: string[];
  exchange?: 'NSE' | 'BSE' | 'NASDAQ' | 'NYSE';
  autoConnect?: boolean;
}

interface MarketDataState {
  [symbol: string]: LiveMarketData;
}

export const useWebSocketMarketData = (options: UseWebSocketMarketDataOptions) => {
  const { symbols, exchange = 'NSE', autoConnect = true } = options;
  const [marketData, setMarketData] = useState<MarketDataState>({});
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected'>('disconnected');
  const [error, setError] = useState<string | null>(null);
  
  const wsServiceRef = useRef<WebSocketMarketService | null>(null);
  const unsubscribeFunctionsRef = useRef<Array<() => void>>([]);

  const updateMarketData = useCallback((symbol: string, data: LiveMarketData) => {
    setMarketData(prev => ({
      ...prev,
      [symbol]: data
    }));
  }, []);

  const connect = useCallback(() => {
    if (!wsServiceRef.current) {
      try {
        wsServiceRef.current = new WebSocketMarketService();
        setError(null);
      } catch (err) {
        setError('Failed to initialize WebSocket service');
        console.error('WebSocket initialization error:', err);
      }
    }
  }, []);

  const disconnect = useCallback(() => {
    // Cleanup existing subscriptions
    unsubscribeFunctionsRef.current.forEach(unsubscribe => unsubscribe());
    unsubscribeFunctionsRef.current = [];

    if (wsServiceRef.current) {
      wsServiceRef.current.disconnect();
      wsServiceRef.current = null;
    }
    
    setConnectionStatus('disconnected');
    setMarketData({});
  }, []);

  const subscribeToSymbols = useCallback(() => {
    if (!wsServiceRef.current) return;

    // Clear existing subscriptions
    unsubscribeFunctionsRef.current.forEach(unsubscribe => unsubscribe());
    unsubscribeFunctionsRef.current = [];

    // Subscribe to new symbols
    symbols.forEach(symbol => {
      const unsubscribe = wsServiceRef.current!.subscribe(
        symbol, 
        exchange, 
        (data) => updateMarketData(symbol, data)
      );
      unsubscribeFunctionsRef.current.push(unsubscribe);
    });
  }, [symbols, exchange, updateMarketData]);

  // Monitor connection status
  useEffect(() => {
    if (!wsServiceRef.current) return;

    const checkStatus = () => {
      if (wsServiceRef.current) {
        setConnectionStatus(wsServiceRef.current.getConnectionStatus());
      }
    };

    const interval = setInterval(checkStatus, 1000);
    return () => clearInterval(interval);
  }, [wsServiceRef.current]);

  // Initialize connection and subscriptions
  useEffect(() => {
    if (autoConnect && symbols.length > 0) {
      connect();
      
      // Small delay to ensure connection is established
      const timer = setTimeout(() => {
        subscribeToSymbols();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [autoConnect, symbols.length, connect, subscribeToSymbols]);

  // Update subscriptions when symbols change
  useEffect(() => {
    if (wsServiceRef.current && connectionStatus === 'connected') {
      subscribeToSymbols();
    }
  }, [symbols, exchange, subscribeToSymbols, connectionStatus]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    marketData,
    connectionStatus,
    error,
    connect,
    disconnect,
    isConnected: connectionStatus === 'connected',
    subscribe: subscribeToSymbols
  };
};
