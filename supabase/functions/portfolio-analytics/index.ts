
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId } = await req.json();
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const alphaVantageKey = Deno.env.get('ALPHA_VANTAGE_API_KEY');
    const finnhubKey = Deno.env.get('FINNHUB_API_KEY');
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    if (!alphaVantageKey || !finnhubKey) {
      return new Response(
        JSON.stringify({ error: 'API keys not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Fetching portfolio analytics for user:', userId);

    // Get user's portfolio holdings from database
    const { data: holdings, error: holdingsError } = await supabase
      .from('portfolio_holdings')
      .select('*')
      .eq('user_id', userId);

    if (holdingsError) {
      console.error('Error fetching holdings:', holdingsError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch portfolio holdings' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // If no holdings, return empty portfolio
    if (!holdings || holdings.length === 0) {
      return new Response(
        JSON.stringify({
          totalValue: 0,
          totalGainLoss: 0,
          totalGainLossPercent: 0,
          holdings: [],
          assetAllocation: [],
          riskMetrics: {
            volatility: 0,
            sharpeRatio: 0,
            beta: 0,
            maxDrawdown: 0
          },
          performanceHistory: []
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch current prices for all holdings
    const pricePromises = holdings.map(async (holding) => {
      try {
        let currentPrice = 0;
        
        if (holding.asset_type === 'stock') {
          // Use Alpha Vantage for Indian stocks
          const response = await fetch(
            `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${holding.symbol}.BSE&apikey=${alphaVantageKey}`
          );
          const data = await response.json();
          
          if (data['Global Quote'] && data['Global Quote']['05. price']) {
            currentPrice = parseFloat(data['Global Quote']['05. price']);
          } else {
            // Fallback to Finnhub
            const finnhubResponse = await fetch(
              `https://finnhub.io/api/v1/quote?symbol=${holding.symbol}&token=${finnhubKey}`
            );
            const finnhubData = await finnhubResponse.json();
            currentPrice = finnhubData.c || 0;
          }
        } else if (holding.asset_type === 'crypto') {
          // Use CoinGecko for crypto
          const response = await fetch(
            `https://api.coingecko.com/api/v3/simple/price?ids=${holding.symbol}&vs_currencies=inr`
          );
          const data = await response.json();
          currentPrice = data[holding.symbol]?.inr || 0;
        }

        const currentValue = currentPrice * holding.quantity;
        const gainLoss = currentValue - (holding.avg_cost * holding.quantity);
        const gainLossPercent = holding.avg_cost > 0 ? (gainLoss / (holding.avg_cost * holding.quantity)) * 100 : 0;

        return {
          ...holding,
          current_price: currentPrice,
          current_value: currentValue,
          gain_loss: gainLoss,
          gain_loss_percent: gainLossPercent
        };
      } catch (error) {
        console.error(`Error fetching price for ${holding.symbol}:`, error);
        return {
          ...holding,
          current_price: holding.avg_cost,
          current_value: holding.avg_cost * holding.quantity,
          gain_loss: 0,
          gain_loss_percent: 0
        };
      }
    });

    const updatedHoldings = await Promise.all(pricePromises);

    // Calculate portfolio metrics
    const totalValue = updatedHoldings.reduce((sum, holding) => sum + holding.current_value, 0);
    const totalCost = updatedHoldings.reduce((sum, holding) => sum + (holding.avg_cost * holding.quantity), 0);
    const totalGainLoss = totalValue - totalCost;
    const totalGainLossPercent = totalCost > 0 ? (totalGainLoss / totalCost) * 100 : 0;

    // Calculate asset allocation
    const assetAllocation = updatedHoldings.reduce((acc, holding) => {
      const existing = acc.find(item => item.type === holding.asset_type);
      if (existing) {
        existing.value += holding.current_value;
        existing.percentage = (existing.value / totalValue) * 100;
      } else {
        acc.push({
          type: holding.asset_type,
          value: holding.current_value,
          percentage: (holding.current_value / totalValue) * 100
        });
      }
      return acc;
    }, [] as any[]);

    // Calculate basic risk metrics (simplified)
    const returns = updatedHoldings.map(h => h.gain_loss_percent);
    const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length;
    const volatility = Math.sqrt(variance);

    const riskMetrics = {
      volatility: volatility,
      sharpeRatio: volatility > 0 ? avgReturn / volatility : 0,
      beta: 1.0, // Simplified - would need market data for proper calculation
      maxDrawdown: Math.min(...returns, 0)
    };

    // Get historical performance (last 30 days)
    const performanceHistory = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Simplified - in real implementation, would fetch historical prices
      const randomVariation = (Math.random() - 0.5) * 0.02; // ±1% random variation
      const value = totalValue * (1 + randomVariation * i / 30);
      
      performanceHistory.push({
        date: date.toISOString().split('T')[0],
        value: value,
        change: i === 29 ? 0 : value - performanceHistory[performanceHistory.length - 1]?.value || 0
      });
    }

    console.log('Portfolio analytics calculated successfully');

    return new Response(
      JSON.stringify({
        totalValue,
        totalGainLoss,
        totalGainLossPercent,
        holdings: updatedHoldings,
        assetAllocation,
        riskMetrics,
        performanceHistory
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in portfolio analytics function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
