
import React from 'react';
import { LivePortfolioManager } from './LivePortfolioManager';

export const WalletViewer = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Portfolio & Wallet
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage your investments and connect your crypto wallet
          </p>
        </div>
      </div>
      
      <LivePortfolioManager />
    </div>
  );
};
