
interface IndianStockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  high: number;
  low: number;
  open: number;
  marketCap: number;
  exchange: 'NSE' | 'BSE';
}

interface SIPCalculationResult {
  totalInvestment: number;
  expectedReturns: number;
  totalValue: number;
  monthlyReturns: number;
}

class IndianMarketService {
  // Popular Indian stocks with mock data (in real app, this would come from NSE/BSE APIs)
  private indianStocks: IndianStockData[] = [
    {
      symbol: 'RELIANCE',
      name: 'Reliance Industries Ltd',
      price: 2450.50,
      change: 25.30,
      changePercent: 1.04,
      volume: 1250000,
      high: 2465.00,
      low: 2425.00,
      open: 2430.00,
      marketCap: 16589500000000, // in INR
      exchange: 'NSE'
    },
    {
      symbol: 'TCS',
      name: 'Tata Consultancy Services',
      price: 3650.75,
      change: -18.25,
      changePercent: -0.50,
      volume: 890000,
      high: 3670.00,
      low: 3640.00,
      open: 3665.00,
      marketCap: 13295000000000,
      exchange: 'NSE'
    },
    {
      symbol: 'HDFCBANK',
      name: 'HDFC Bank Limited',
      price: 1555.20,
      change: 12.80,
      changePercent: 0.83,
      volume: 2100000,
      high: 1565.00,
      low: 1545.00,
      open: 1550.00,
      marketCap: 11578000000000,
      exchange: 'NSE'
    },
    {
      symbol: 'INFY',
      name: 'Infosys Limited',
      price: 1425.30,
      change: 8.50,
      changePercent: 0.60,
      volume: 1750000,
      high: 1430.00,
      low: 1415.00,
      open: 1420.00,
      marketCap: 5945000000000,
      exchange: 'NSE'
    },
    {
      symbol: 'HINDUNILVR',
      name: 'Hindustan Unilever Ltd',
      price: 2785.40,
      change: -15.60,
      changePercent: -0.56,
      volume: 650000,
      high: 2800.00,
      low: 2780.00,
      open: 2795.00,
      marketCap: 6545000000000,
      exchange: 'NSE'
    },
    {
      symbol: 'ITC',
      name: 'ITC Limited',
      price: 445.80,
      change: 3.20,
      changePercent: 0.72,
      volume: 3200000,
      high: 448.00,
      low: 442.00,
      open: 443.50,
      marketCap: 5534000000000,
      exchange: 'NSE'
    },
    {
      symbol: 'SBIN',
      name: 'State Bank of India',
      price: 785.60,
      change: -5.40,
      changePercent: -0.68,
      volume: 4100000,
      high: 795.00,
      low: 780.00,
      open: 790.00,
      marketCap: 7005000000000,
      exchange: 'NSE'
    },
    {
      symbol: 'BHARTIARTL',
      name: 'Bharti Airtel Limited',
      price: 1195.25,
      change: 8.75,
      changePercent: 0.74,
      volume: 1850000,
      high: 1200.00,
      low: 1185.00,
      open: 1190.00,
      marketCap: 6798000000000,
      exchange: 'NSE'
    }
  ];

  async getIndianStocks(): Promise<IndianStockData[]> {
    // Simulate live data with small random variations
    return this.indianStocks.map(stock => ({
      ...stock,
      price: stock.price + (Math.random() - 0.5) * 10,
      change: (Math.random() - 0.5) * 20,
      changePercent: (Math.random() - 0.5) * 3,
      volume: stock.volume + Math.floor((Math.random() - 0.5) * 100000)
    }));
  }

  calculateSIP(monthlyAmount: number, annualReturn: number, years: number): SIPCalculationResult {
    const monthlyReturn = annualReturn / 12 / 100;
    const totalMonths = years * 12;
    const totalInvestment = monthlyAmount * totalMonths;
    
    // Future Value of SIP formula
    const futureValue = monthlyAmount * (((Math.pow(1 + monthlyReturn, totalMonths) - 1) / monthlyReturn) * (1 + monthlyReturn));
    const expectedReturns = futureValue - totalInvestment;
    
    return {
      totalInvestment,
      expectedReturns,
      totalValue: futureValue,
      monthlyReturns: expectedReturns / totalMonths
    };
  }

  calculatePPF(yearlyContribution: number, years: number = 15): { maturityAmount: number; totalContribution: number; interest: number } {
    const ppfRate = 7.1; // Current PPF rate
    let totalAmount = 0;
    const totalContribution = yearlyContribution * years;
    
    for (let year = 1; year <= years; year++) {
      totalAmount = (totalAmount + yearlyContribution) * (1 + ppfRate / 100);
    }
    
    return {
      maturityAmount: totalAmount,
      totalContribution,
      interest: totalAmount - totalContribution
    };
  }

  formatIndianCurrency(amount: number): string {
    const formatter = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    return formatter.format(amount);
  }

  formatIndianNumber(num: number): string {
    if (num >= 10000000) {
      return `₹${(num / 10000000).toFixed(2)} Cr`;
    } else if (num >= 100000) {
      return `₹${(num / 100000).toFixed(2)} L`;
    } else {
      return `₹${num.toLocaleString('en-IN')}`;
    }
  }

  getMarketStatus(): { status: 'OPEN' | 'CLOSED' | 'PRE_OPEN'; nextSession: string } {
    const now = new Date();
    const istTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Kolkata"}));
    const hours = istTime.getHours();
    const minutes = istTime.getMinutes();
    const currentTime = hours * 60 + minutes;
    
    // Market timings in minutes from midnight
    const preOpenStart = 9 * 60; // 9:00 AM
    const marketOpen = 9 * 60 + 15; // 9:15 AM
    const marketClose = 15 * 60 + 30; // 3:30 PM
    
    if (currentTime >= preOpenStart && currentTime < marketOpen) {
      return { status: 'PRE_OPEN', nextSession: 'Market opens at 9:15 AM IST' };
    } else if (currentTime >= marketOpen && currentTime <= marketClose) {
      return { status: 'OPEN', nextSession: 'Market closes at 3:30 PM IST' };
    } else {
      return { status: 'CLOSED', nextSession: 'Market opens at 9:15 AM IST tomorrow' };
    }
  }

  getTaxSavingOptions() {
    return [
      {
        section: '80C',
        limit: 150000,
        options: ['ELSS Mutual Funds', 'PPF', 'NSC', 'Tax Saver FD', 'ULIP', 'Home Loan Principal']
      },
      {
        section: '80D',
        limit: 25000,
        options: ['Health Insurance Premium', 'Preventive Health Check-up']
      },
      {
        section: '80CCD',
        limit: 50000,
        options: ['NPS (Additional)', 'Atal Pension Yojana']
      }
    ];
  }
}

export const indianMarketService = new IndianMarketService();
