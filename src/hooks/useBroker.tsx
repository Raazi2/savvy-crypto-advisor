
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import ZerodhaService from '@/services/zerodhaService';
import { useToast } from '@/hooks/use-toast';

interface BrokerContextType {
  zerodhaService: ZerodhaService | null;
  isConnected: boolean;
  isConnecting: boolean;
  userProfile: any;
  connectZerodha: () => void;
  disconnect: () => void;
  refreshData: () => Promise<void>;
}

const BrokerContext = createContext<BrokerContextType | undefined>(undefined);

export const BrokerProvider = ({ children }: { children: ReactNode }) => {
  const [zerodhaService, setZerodhaService] = useState<ZerodhaService | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    // Initialize Zerodha service if API key is available
    const apiKey = import.meta.env.VITE_ZERODHA_API_KEY || 'demo_api_key';
    const service = new ZerodhaService(apiKey);
    setZerodhaService(service);

    // Check if already authenticated
    if (service.isAuthenticated()) {
      setIsConnected(true);
      loadUserProfile(service);
    }
  }, []);

  const loadUserProfile = async (service: ZerodhaService) => {
    try {
      const profile = await service.getProfile();
      setUserProfile(profile);
    } catch (error) {
      console.error('Failed to load user profile:', error);
      // If profile loading fails, token might be expired
      service.logout();
      setIsConnected(false);
    }
  };

  const connectZerodha = () => {
    if (!zerodhaService) {
      toast({
        title: "Configuration Error",
        description: "Zerodha API key not configured",
        variant: "destructive"
      });
      return;
    }

    setIsConnecting(true);
    
    // In a real implementation, this would redirect to Zerodha OAuth
    const loginUrl = zerodhaService.getLoginUrl(window.location.origin + '/broker-callback');
    
    toast({
      title: "Broker Authentication",
      description: "You will be redirected to Zerodha for authentication",
    });

    // For demo purposes, simulate connection
    setTimeout(() => {
      setIsConnected(true);
      setIsConnecting(false);
      setUserProfile({
        user_id: 'DEMO123',
        user_name: 'Demo User',
        email: 'demo@example.com',
        broker: 'ZERODHA'
      });
      
      toast({
        title: "Connected Successfully",
        description: "Your Zerodha account has been connected",
      });
    }, 2000);
  };

  const disconnect = () => {
    if (zerodhaService) {
      zerodhaService.logout();
    }
    setIsConnected(false);
    setUserProfile(null);
    
    toast({
      title: "Disconnected",
      description: "Your broker account has been disconnected",
    });
  };

  const refreshData = async () => {
    if (!zerodhaService || !isConnected) return;

    try {
      await loadUserProfile(zerodhaService);
    } catch (error) {
      console.error('Failed to refresh data:', error);
      toast({
        title: "Refresh Failed",
        description: "Failed to refresh broker data",
        variant: "destructive"
      });
    }
  };

  return (
    <BrokerContext.Provider value={{
      zerodhaService,
      isConnected,
      isConnecting,
      userProfile,
      connectZerodha,
      disconnect,
      refreshData
    }}>
      {children}
    </BrokerContext.Provider>
  );
};

export const useBroker = () => {
  const context = useContext(BrokerContext);
  if (context === undefined) {
    throw new Error('useBroker must be used within a BrokerProvider');
  }
  return context;
};
