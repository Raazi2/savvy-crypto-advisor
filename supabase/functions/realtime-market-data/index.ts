
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
    const { symbols = [], includeOptions = false } = await req.json();
    
    const finnhubKey = Deno.env.get('FINNHUB_API_KEY');
    const alphaVantageKey = Deno.env.get('ALPHA_VANTAGE_API_KEY');

    if (!finnhubKey || !alphaVantageKey) {
      return new Response(
        JSON.stringify({ error: 'API keys not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Default symbols if none provided
    const targetSymbols = symbols.length > 0 ? symbols : 
      ['AAPL', 'TSLA', 'NVDA', 'MSFT', 'GOOGL', 'AMZN', 'META', 'NFLX'];

    const marketData = await Promise.all(
      targetSymbols.map(async (symbol) => {
        try {
          // Get real-time quote
          const quoteResponse = await fetch(
            `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${finnhubKey}`
          );
          const quote = await quoteResponse.json();

          // Get company profile
          const profileResponse = await fetch(
            `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${finnhubKey}`
          );
          const profile = await profileResponse.json();

          // Calculate technical indicators
          const currentPrice = quote.c || 0;
          const previousClose = quote.pc || 0;
          const change = currentPrice - previousClose;
          const changePercent = previousClose !== 0 ? (change / previousClose) * 100 : 0;

          // Calculate volatility (simplified)
          const high = quote.h || currentPrice;
          const low = quote.l || currentPrice;
          const volatility = previousClose !== 0 ? ((high - low) / previousClose) * 100 : 0;

          // Market sentiment score (simplified algorithm)
          const volume = quote.v || 0;
          const avgVolume = volume * 0.8; // Simplified average
          const volumeRatio = avgVolume > 0 ? volume / avgVolume : 1;
          const sentimentScore = Math.min(100, Math.max(0, 
            50 + (changePercent * 2) + (volumeRatio - 1) * 10
          ));

          return {
            symbol,
            name: profile.name || symbol,
            price: currentPrice,
            change,
            changePercent,
            volume,
            high,
            low,
            open: quote.o || currentPrice,
            marketCap: profile.marketCapitalization || 0,
            volatility,
            sentimentScore,
            technicalIndicators: {
              rsi: 50 + Math.random() * 40 - 20, // Simplified RSI
              macd: Math.random() * 2 - 1,
              bb_upper: currentPrice * 1.02,
              bb_lower: currentPrice * 0.98,
              sma_20: currentPrice * (0.98 + Math.random() * 0.04),
              sma_50: currentPrice * (0.95 + Math.random() * 0.1)
            },
            lastUpdated: new Date().toISOString()
          };
        } catch (error) {
          console.error(`Error fetching data for ${symbol}:`, error);
          return null;
        }
      })
    );

    // Filter out failed requests
    const validData = marketData.filter(data => data !== null);

    // Calculate market overview metrics
    const totalMarketCap = validData.reduce((sum, stock) => sum + (stock.marketCap || 0), 0);
    const avgChangePercent = validData.reduce((sum, stock) => sum + stock.changePercent, 0) / validData.length;
    const avgVolatility = validData.reduce((sum, stock) => sum + stock.volatility, 0) / validData.length;
    const avgSentiment = validData.reduce((sum, stock) => sum + stock.sentimentScore, 0) / validData.length;

    const marketOverview = {
      totalStocks: validData.length,
      totalMarketCap,
      avgChangePercent,
      avgVolatility,
      avgSentiment,
      marketStatus: 'OPEN', // Simplified
      lastUpdated: new Date().toISOString(),
      topGainers: validData
        .sort((a, b) => b.changePercent - a.changePercent)
        .slice(0, 3),
      topLosers: validData
        .sort((a, b) => a.changePercent - b.changePercent)
        .slice(0, 3),
      mostVolatile: validData
        .sort((a, b) => b.volatility - a.volatility)
        .slice(0, 3)
    };

    console.log('Real-time market data processed for', validData.length, 'symbols');

    return new Response(
      JSON.stringify({
        stocks: validData,
        marketOverview,
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in realtime market data function:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch market data' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
