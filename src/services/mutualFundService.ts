
interface MutualFund {
  id: string;
  name: string;
  amc: string;
  category: string;
  subCategory: string;
  nav: number;
  navChange: number;
  navChangePercent: number;
  aum: number;
  expenseRatio: number;
  exitLoad: string;
  minInvestment: number;
  rating: number;
  returns1Year: number;
  returns3Year: number;
  returns5Year: number;
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Very High';
  sipMinAmount: number;
  lastUpdated: string;
}

interface SIPInvestment {
  id: string;
  fundId: string;
  fundName: string;
  monthlyAmount: number;
  startDate: string;
  totalInvested: number;
  currentValue: number;
  absoluteReturn: number;
  xirr: number;
  nextSipDate: string;
  status: 'Active' | 'Paused' | 'Stopped';
}

interface AMC {
  id: string;
  name: string;
  shortName: string;
  totalAUM: number;
  fundCount: number;
  logo?: string;
}

class MutualFundService {
  private amcs: AMC[] = [
    { id: 'hdfc', name: 'HDFC Mutual Fund', shortName: 'HDFC', totalAUM: 485000000000, fundCount: 45 },
    { id: 'icici', name: 'ICICI Prudential MF', shortName: 'ICICI Pru', totalAUM: 520000000000, fundCount: 52 },
    { id: 'sbi', name: 'SBI Mutual Fund', shortName: 'SBI', totalAUM: 675000000000, fundCount: 67 },
    { id: 'axis', name: 'Axis Mutual Fund', shortName: 'Axis', totalAUM: 285000000000, fundCount: 38 },
    { id: 'kotak', name: 'Kotak Mahindra MF', shortName: 'Kotak', totalAUM: 195000000000, fundCount: 29 },
    { id: 'nippon', name: 'Nippon India MF', shortName: 'Nippon', totalAUM: 235000000000, fundCount: 42 },
    { id: 'franklin', name: 'Franklin Templeton MF', shortName: 'Franklin', totalAUM: 85000000000, fundCount: 24 },
    { id: 'aditya', name: 'Aditya Birla Sun Life MF', shortName: 'ABSL', totalAUM: 315000000000, fundCount: 48 }
  ];

  private mutualFunds: MutualFund[] = [
    {
      id: 'hdfc-top-100',
      name: 'HDFC Top 100 Fund',
      amc: 'HDFC',
      category: 'Equity',
      subCategory: 'Large Cap',
      nav: 785.45,
      navChange: 12.35,
      navChangePercent: 1.6,
      aum: 28500000000,
      expenseRatio: 1.95,
      exitLoad: '1% if redeemed within 1 year',
      minInvestment: 5000,
      rating: 4,
      returns1Year: 18.5,
      returns3Year: 15.2,
      returns5Year: 12.8,
      riskLevel: 'Moderate',
      sipMinAmount: 500,
      lastUpdated: '2024-06-15T15:30:00Z'
    },
    {
      id: 'icici-blue-chip',
      name: 'ICICI Prudential Bluechip Fund',
      amc: 'ICICI Pru',
      category: 'Equity',
      subCategory: 'Large Cap',
      nav: 68.25,
      navChange: -0.85,
      navChangePercent: -1.23,
      aum: 35200000000,
      expenseRatio: 1.85,
      exitLoad: '1% if redeemed within 1 year',
      minInvestment: 5000,
      rating: 5,
      returns1Year: 16.8,
      returns3Year: 14.5,
      returns5Year: 13.2,
      riskLevel: 'Moderate',
      sipMinAmount: 500,
      lastUpdated: '2024-06-15T15:30:00Z'
    },
    {
      id: 'sbi-small-cap',
      name: 'SBI Small Cap Fund',
      amc: 'SBI',
      category: 'Equity',
      subCategory: 'Small Cap',
      nav: 125.80,
      navChange: 2.45,
      navChangePercent: 1.98,
      aum: 18500000000,
      expenseRatio: 2.25,
      exitLoad: '1% if redeemed within 1 year',
      minInvestment: 5000,
      rating: 4,
      returns1Year: 28.5,
      returns3Year: 22.8,
      returns5Year: 18.5,
      riskLevel: 'Very High',
      sipMinAmount: 500,
      lastUpdated: '2024-06-15T15:30:00Z'
    },
    {
      id: 'axis-long-term-equity',
      name: 'Axis Long Term Equity Fund',
      amc: 'Axis',
      category: 'Equity',
      subCategory: 'ELSS',
      nav: 98.75,
      navChange: 1.25,
      navChangePercent: 1.28,
      aum: 25800000000,
      expenseRatio: 1.75,
      exitLoad: 'Nil',
      minInvestment: 500,
      rating: 5,
      returns1Year: 22.3,
      returns3Year: 18.5,
      returns5Year: 16.2,
      riskLevel: 'High',
      sipMinAmount: 500,
      lastUpdated: '2024-06-15T15:30:00Z'
    },
    {
      id: 'kotak-bond-short-term',
      name: 'Kotak Bond Short Term Fund',
      amc: 'Kotak',
      category: 'Debt',
      subCategory: 'Short Duration',
      nav: 45.68,
      navChange: 0.05,
      navChangePercent: 0.11,
      aum: 8500000000,
      expenseRatio: 0.95,
      exitLoad: '0.5% if redeemed within 1 year',
      minInvestment: 5000,
      rating: 4,
      returns1Year: 7.2,
      returns3Year: 6.8,
      returns5Year: 7.1,
      riskLevel: 'Low',
      sipMinAmount: 1000,
      lastUpdated: '2024-06-15T15:30:00Z'
    },
    {
      id: 'franklin-india-prima',
      name: 'Franklin India Prima Fund',
      amc: 'Franklin',
      category: 'Equity',
      subCategory: 'Multi Cap',
      nav: 1285.45,
      navChange: 18.75,
      navChangePercent: 1.48,
      aum: 12500000000,
      expenseRatio: 2.15,
      exitLoad: '1% if redeemed within 1 year',
      minInvestment: 5000,
      rating: 3,
      returns1Year: 19.8,
      returns3Year: 16.5,
      returns5Year: 14.2,
      riskLevel: 'High',
      sipMinAmount: 500,
      lastUpdated: '2024-06-15T15:30:00Z'
    }
  ];

  private sipInvestments: SIPInvestment[] = [
    {
      id: 'sip-1',
      fundId: 'hdfc-top-100',
      fundName: 'HDFC Top 100 Fund',
      monthlyAmount: 5000,
      startDate: '2023-01-15',
      totalInvested: 85000,
      currentValue: 98500,
      absoluteReturn: 13500,
      xirr: 18.2,
      nextSipDate: '2024-07-15',
      status: 'Active'
    },
    {
      id: 'sip-2',
      fundId: 'axis-long-term-equity',
      fundName: 'Axis Long Term Equity Fund',
      monthlyAmount: 3000,
      startDate: '2022-06-10',
      totalInvested: 72000,
      currentValue: 89500,
      absoluteReturn: 17500,
      xirr: 22.8,
      nextSipDate: '2024-07-10',
      status: 'Active'
    }
  ];

  async getMutualFunds(): Promise<MutualFund[]> {
    // Simulate API call with random variations
    return this.mutualFunds.map(fund => ({
      ...fund,
      nav: fund.nav + (Math.random() - 0.5) * 2,
      navChange: (Math.random() - 0.5) * 5,
      navChangePercent: (Math.random() - 0.5) * 3
    }));
  }

  async getMutualFundsByCategory(category: string): Promise<MutualFund[]> {
    const funds = await this.getMutualFunds();
    return funds.filter(fund => fund.category === category);
  }

  async getMutualFundsByAMC(amc: string): Promise<MutualFund[]> {
    const funds = await this.getMutualFunds();
    return funds.filter(fund => fund.amc === amc);
  }

  async getTopPerformingFunds(period: '1Year' | '3Year' | '5Year' = '1Year'): Promise<MutualFund[]> {
    const funds = await this.getMutualFunds();
    const key = `returns${period}` as keyof MutualFund;
    return funds.sort((a, b) => (b[key] as number) - (a[key] as number)).slice(0, 10);
  }

  async getAMCs(): Promise<AMC[]> {
    return this.amcs;
  }

  async getSIPInvestments(): Promise<SIPInvestment[]> {
    return this.sipInvestments;
  }

  calculateSIPProjection(monthlyAmount: number, expectedReturn: number, years: number) {
    const monthlyReturn = expectedReturn / 12 / 100;
    const totalMonths = years * 12;
    const totalInvestment = monthlyAmount * totalMonths;
    
    const futureValue = monthlyAmount * (((Math.pow(1 + monthlyReturn, totalMonths) - 1) / monthlyReturn) * (1 + monthlyReturn));
    const expectedReturns = futureValue - totalInvestment;
    
    return {
      totalInvestment,
      expectedReturns,
      totalValue: futureValue,
      monthlyReturns: expectedReturns / totalMonths
    };
  }

  formatCurrency(amount: number): string {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} L`;
    } else {
      return `₹${amount.toLocaleString('en-IN')}`;
    }
  }

  getRiskColor(riskLevel: string): string {
    switch (riskLevel) {
      case 'Low': return 'text-green-600';
      case 'Moderate': return 'text-yellow-600';
      case 'High': return 'text-orange-600';
      case 'Very High': return 'text-red-600';
      default: return 'text-gray-600';
    }
  }

  getStarRating(rating: number): string {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  }
}

export const mutualFundService = new MutualFundService();
