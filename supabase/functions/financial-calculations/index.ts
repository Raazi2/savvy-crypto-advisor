
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { calculationType, params } = await req.json();

    let result = {};

    switch (calculationType) {
      case 'compound_interest':
        result = calculateCompoundInterest(params);
        break;
      case 'sip_returns':
        result = calculateSIPReturns(params);
        break;
      case 'retirement_planning':
        result = calculateRetirementPlanning(params);
        break;
      case 'risk_metrics':
        result = calculateRiskMetrics(params);
        break;
      case 'portfolio_optimization':
        result = calculatePortfolioOptimization(params);
        break;
      case 'dividend_analysis':
        result = calculateDividendAnalysis(params);
        break;
      case 'valuation_metrics':
        result = calculateValuationMetrics(params);
        break;
      default:
        throw new Error('Unknown calculation type');
    }

    console.log('Financial calculation completed:', calculationType);

    return new Response(
      JSON.stringify({
        calculationType,
        result,
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in financial calculations:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function calculateCompoundInterest(params: any) {
  const { principal, rate, time, frequency = 1 } = params;
  const amount = principal * Math.pow(1 + rate / frequency, frequency * time);
  const interest = amount - principal;
  
  return {
    finalAmount: amount,
    totalInterest: interest,
    yearlyBreakdown: Array.from({ length: time }, (_, i) => {
      const year = i + 1;
      const yearAmount = principal * Math.pow(1 + rate / frequency, frequency * year);
      return {
        year,
        amount: yearAmount,
        interest: yearAmount - principal
      };
    })
  };
}

function calculateSIPReturns(params: any) {
  const { monthlyInvestment, expectedReturn, timePeriod } = params;
  const monthlyRate = expectedReturn / 12;
  const totalMonths = timePeriod * 12;
  
  let totalInvested = 0;
  let futureValue = 0;
  const monthlyBreakdown = [];

  for (let month = 1; month <= totalMonths; month++) {
    totalInvested += monthlyInvestment;
    futureValue = futureValue * (1 + monthlyRate) + monthlyInvestment;
    
    if (month % 12 === 0) {
      monthlyBreakdown.push({
        year: month / 12,
        invested: totalInvested,
        value: futureValue,
        gains: futureValue - totalInvested
      });
    }
  }

  return {
    totalInvested,
    futureValue,
    totalGains: futureValue - totalInvested,
    monthlyBreakdown
  };
}

function calculateRetirementPlanning(params: any) {
  const { currentAge, retirementAge, currentSavings, monthlyContribution, expectedReturn, inflationRate } = params;
  
  const yearsToRetirement = retirementAge - currentAge;
  const monthsToRetirement = yearsToRetirement * 12;
  const monthlyReturn = expectedReturn / 12;
  
  // Future value of current savings
  const futureValueCurrentSavings = currentSavings * Math.pow(1 + expectedReturn, yearsToRetirement);
  
  // Future value of monthly contributions
  const futureValueContributions = monthlyContribution * 
    ((Math.pow(1 + monthlyReturn, monthsToRetirement) - 1) / monthlyReturn);
  
  const totalRetirementCorpus = futureValueCurrentSavings + futureValueContributions;
  
  // Adjust for inflation
  const inflationAdjustedCorpus = totalRetirementCorpus / Math.pow(1 + inflationRate, yearsToRetirement);
  
  return {
    yearsToRetirement,
    totalRetirementCorpus,
    inflationAdjustedCorpus,
    monthlyIncomeAt4Percent: (totalRetirementCorpus * 0.04) / 12,
    breakdown: {
      fromCurrentSavings: futureValueCurrentSavings,
      fromMonthlyContributions: futureValueContributions
    }
  };
}

function calculateRiskMetrics(params: any) {
  const { returns } = params; // Array of historical returns
  
  if (!returns || returns.length < 2) {
    throw new Error('Insufficient data for risk calculation');
  }
  
  const mean = returns.reduce((sum: number, r: number) => sum + r, 0) / returns.length;
  const variance = returns.reduce((sum: number, r: number) => sum + Math.pow(r - mean, 2), 0) / (returns.length - 1);
  const standardDeviation = Math.sqrt(variance);
  
  // Calculate downside deviation
  const downsideReturns = returns.filter((r: number) => r < mean);
  const downsideVariance = downsideReturns.length > 0 ? 
    downsideReturns.reduce((sum: number, r: number) => sum + Math.pow(r - mean, 2), 0) / downsideReturns.length : 0;
  const downsideDeviation = Math.sqrt(downsideVariance);
  
  // Sharpe ratio (assuming risk-free rate of 3%)
  const riskFreeRate = 0.03;
  const sharpeRatio = standardDeviation > 0 ? (mean - riskFreeRate) / standardDeviation : 0;
  
  // Maximum drawdown
  let maxDrawdown = 0;
  let peak = returns[0];
  for (const r of returns) {
    if (r > peak) peak = r;
    const drawdown = (peak - r) / peak;
    if (drawdown > maxDrawdown) maxDrawdown = drawdown;
  }
  
  return {
    mean,
    standardDeviation,
    downsideDeviation,
    sharpeRatio,
    maxDrawdown,
    volatility: standardDeviation * Math.sqrt(252), // Annualized
    var95: mean - 1.645 * standardDeviation // Value at Risk 95%
  };
}

function calculatePortfolioOptimization(params: any) {
  const { assets, targetReturn, riskTolerance = 'moderate' } = params;
  
  // Simplified Modern Portfolio Theory implementation
  const riskMultipliers = { conservative: 0.5, moderate: 1.0, aggressive: 1.5 };
  const riskMultiplier = riskMultipliers[riskTolerance as keyof typeof riskMultipliers] || 1.0;
  
  const totalAssets = assets.length;
  const baseWeight = 1 / totalAssets;
  
  // Simple optimization based on Sharpe ratios
  const optimizedWeights = assets.map((asset: any) => {
    const sharpe = asset.expectedReturn / Math.max(asset.risk, 0.01);
    const adjustedWeight = baseWeight * (1 + sharpe * riskMultiplier * 0.1);
    return Math.max(0.05, Math.min(0.5, adjustedWeight)); // Min 5%, Max 50%
  });
  
  // Normalize weights to sum to 1
  const totalWeight = optimizedWeights.reduce((sum, w) => sum + w, 0);
  const normalizedWeights = optimizedWeights.map(w => w / totalWeight);
  
  // Calculate portfolio metrics
  const portfolioReturn = assets.reduce((sum: number, asset: any, i: number) => 
    sum + asset.expectedReturn * normalizedWeights[i], 0);
  
  const portfolioRisk = Math.sqrt(
    assets.reduce((sum: number, asset: any, i: number) => 
      sum + Math.pow(asset.risk * normalizedWeights[i], 2), 0)
  );
  
  return {
    optimizedWeights: normalizedWeights.map((weight, i) => ({
      asset: assets[i].symbol,
      weight,
      allocation: weight * 100
    })),
    portfolioReturn,
    portfolioRisk,
    sharpeRatio: portfolioRisk > 0 ? portfolioReturn / portfolioRisk : 0,
    rebalanceRecommendations: normalizedWeights.map((weight, i) => ({
      asset: assets[i].symbol,
      currentWeight: assets[i].currentWeight || 0,
      targetWeight: weight,
      action: weight > (assets[i].currentWeight || 0) ? 'BUY' : 'SELL'
    }))
  };
}

function calculateDividendAnalysis(params: any) {
  const { stocks } = params;
  
  return stocks.map((stock: any) => {
    const { symbol, dividendPerShare, price, dividendsHistory = [] } = stock;
    
    const dividendYield = price > 0 ? (dividendPerShare / price) * 100 : 0;
    
    // Calculate dividend growth rate
    let growthRate = 0;
    if (dividendsHistory.length >= 2) {
      const recent = dividendsHistory[dividendsHistory.length - 1];
      const previous = dividendsHistory[dividendsHistory.length - 2];
      growthRate = previous > 0 ? ((recent - previous) / previous) * 100 : 0;
    }
    
    // Payout ratio estimation (simplified)
    const estimatedEPS = dividendPerShare / 0.4; // Assuming 40% payout ratio
    const payoutRatio = estimatedEPS > 0 ? (dividendPerShare / estimatedEPS) * 100 : 0;
    
    return {
      symbol,
      dividendYield,
      growthRate,
      payoutRatio,
      sustainability: payoutRatio < 60 ? 'High' : payoutRatio < 80 ? 'Medium' : 'Low',
      annualDividend: dividendPerShare * 4 // Quarterly to annual
    };
  });
}

function calculateValuationMetrics(params: any) {
  const { symbol, price, eps, bookValue, revenue, marketCap, industry = 'Technology' } = params;
  
  // Industry average P/E ratios (simplified)
  const industryPE = {
    'Technology': 25,
    'Healthcare': 20,
    'Finance': 12,
    'Energy': 15,
    'Consumer': 18
  };
  
  const peRatio = eps > 0 ? price / eps : null;
  const pbRatio = bookValue > 0 ? price / bookValue : null;
  const psRatio = revenue > 0 ? marketCap / revenue : null;
  
  const industryAvgPE = industryPE[industry as keyof typeof industryPE] || 20;
  const relativeValuation = peRatio ? peRatio / industryAvgPE : null;
  
  let valuation = 'Unknown';
  if (relativeValuation) {
    if (relativeValuation < 0.8) valuation = 'Undervalued';
    else if (relativeValuation > 1.2) valuation = 'Overvalued';
    else valuation = 'Fair Value';
  }
  
  return {
    symbol,
    peRatio,
    pbRatio,
    psRatio,
    industryAvgPE,
    relativeValuation,
    valuation,
    metrics: {
      priceToEarnings: peRatio,
      priceToBook: pbRatio,
      priceToSales: psRatio,
      marketCap
    }
  };
}
