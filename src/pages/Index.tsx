import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, Loader2, ExternalLink, Shield, TrendingUp, Activity } from 'lucide-react';
import { BrokerConnection } from "@/components/BrokerConnection";
import { Trading } from "@/components/Trading";
import { Settings } from "@/components/Settings";
import { LiveMarketDashboard } from "@/components/LiveMarketDashboard";

const Index = () => {
  const [activeTab, setActiveTab] = useState('broker');

  const renderContent = () => {
    switch (activeTab) {
      case 'broker':
        return <BrokerConnection />;
      case 'trading':
        return <Trading />;
      case 'settings':
        return <Settings />;
      case 'live-market':
        return <LiveMarketDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="lg:w-64 space-y-2">
            <div className="bg-card rounded-lg border p-4">
              <h2 className="font-semibold mb-4">Navigation</h2>
              <nav className="space-y-1">
                <Button
                  variant={activeTab === 'broker' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('broker')}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Broker Connection
                </Button>
                <Button
                  variant={activeTab === 'trading' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('trading')}
                >
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Trading
                </Button>
                <Button
                  variant={activeTab === 'live-market' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('live-market')}
                >
                  <Activity className="mr-2 h-4 w-4" />
                  Live Market Data
                </Button>
                <Button
                  variant={activeTab === 'settings' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('settings')}
                >
                  <Shield className="mr-2 h-4 w-4" />
                  Settings
                </Button>
              </nav>
            </div>
          </aside>

          <main className="flex-1">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Index;
