
import { useState, useEffect, createContext, useContext } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

interface SettingsData {
  apiKeys: {
    openrouter: string;
    alphavantage: string;
    etherscan: string;
  };
  notifications: {
    priceAlerts: boolean;
    securityAlerts: boolean;
    marketNews: boolean;
    portfolioUpdates: boolean;
    tradeConfirmations: boolean;
    educationalContent: boolean;
    socialUpdates: boolean;
  };
  preferences: {
    defaultCurrency: string;
    theme: string;
    refreshInterval: string;
    language: string;
    timezone: string;
    dateFormat: string;
    numberFormat: string;
  };
  privacy: {
    sharePortfolio: boolean;
    showOnlineStatus: boolean;
    allowDataCollection: boolean;
    marketingEmails: boolean;
  };
}

interface SettingsContextType {
  settings: SettingsData;
  updateSettings: (newSettings: Partial<SettingsData>) => void;
  saveSettings: () => Promise<void>;
  loadSettings: () => Promise<void>;
  resetSettings: () => void;
  getApiKey: (service: string) => string;
  isNotificationEnabled: (type: string) => boolean;
}

const defaultSettings: SettingsData = {
  apiKeys: {
    openrouter: '',
    alphavantage: '',
    etherscan: ''
  },
  notifications: {
    priceAlerts: true,
    securityAlerts: true,
    marketNews: false,
    portfolioUpdates: true,
    tradeConfirmations: true,
    educationalContent: false,
    socialUpdates: true
  },
  preferences: {
    defaultCurrency: 'USD',
    theme: 'dark',
    refreshInterval: '60',
    language: 'en',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    dateFormat: 'MM/DD/YYYY',
    numberFormat: 'en-US'
  },
  privacy: {
    sharePortfolio: false,
    showOnlineStatus: true,
    allowDataCollection: true,
    marketingEmails: false
  }
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<SettingsData>(defaultSettings);

  useEffect(() => {
    if (user) {
      loadSettings();
    }
  }, [user]);

  const loadSettings = async () => {
    if (!user) return;

    try {
      // Load from localStorage
      const storedSettings = localStorage.getItem(`settings_${user.id}`);
      if (storedSettings) {
        const parsed = JSON.parse(storedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
      }

      // Load from Supabase user metadata
      if (user.user_metadata?.settings) {
        setSettings(prev => ({ ...prev, ...user.user_metadata.settings }));
      }

      // Load API keys separately
      const storedApiKeys = localStorage.getItem(`api_keys_${user.id}`);
      if (storedApiKeys) {
        const parsed = JSON.parse(storedApiKeys);
        setSettings(prev => ({ ...prev, apiKeys: parsed }));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const updateSettings = (newSettings: Partial<SettingsData>) => {
    setSettings(prev => {
      const updated = { ...prev };
      Object.keys(newSettings).forEach(key => {
        if (newSettings[key as keyof SettingsData]) {
          updated[key as keyof SettingsData] = {
            ...updated[key as keyof SettingsData],
            ...newSettings[key as keyof SettingsData]
          } as any;
        }
      });
      return updated;
    });
  };

  const saveSettings = async () => {
    if (!user) return;

    try {
      // Save main settings to localStorage and Supabase
      const { apiKeys, ...settingsWithoutKeys } = settings;
      localStorage.setItem(`settings_${user.id}`, JSON.stringify(settingsWithoutKeys));

      // Update user metadata
      await supabase.auth.updateUser({
        data: {
          settings: settingsWithoutKeys
        }
      });

      // Save API keys separately
      if (Object.values(apiKeys).some(key => key.trim())) {
        localStorage.setItem(`api_keys_${user.id}`, JSON.stringify(apiKeys));
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      throw error;
    }
  };

  const resetSettings = () => {
    if (!user) return;
    
    localStorage.removeItem(`settings_${user.id}`);
    localStorage.removeItem(`api_keys_${user.id}`);
    setSettings(defaultSettings);
  };

  const getApiKey = (service: string): string => {
    return settings.apiKeys[service as keyof typeof settings.apiKeys] || '';
  };

  const isNotificationEnabled = (type: string): boolean => {
    return settings.notifications[type as keyof typeof settings.notifications] || false;
  };

  return (
    <SettingsContext.Provider value={{
      settings,
      updateSettings,
      saveSettings,
      loadSettings,
      resetSettings,
      getApiKey,
      isNotificationEnabled
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
