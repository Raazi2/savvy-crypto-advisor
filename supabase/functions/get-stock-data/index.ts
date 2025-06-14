
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { symbol } = await req.json()
    
    if (!symbol) {
      throw new Error('Symbol is required')
    }

    const alphaVantageKey = Deno.env.get('ALPHA_VANTAGE_API_KEY')
    const finnhubKey = Deno.env.get('FINNHUB_API_KEY')

    if (!alphaVantageKey || !finnhubKey) {
      throw new Error('API keys not configured')
    }

    // Get real-time quote from Finnhub
    const quoteResponse = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${finnhubKey}`
    )
    const quoteData = await quoteResponse.json()

    // Get company profile from Finnhub
    const profileResponse = await fetch(
      `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${finnhubKey}`
    )
    const profileData = await profileResponse.json()

    // Calculate change and percentage
    const currentPrice = quoteData.c || 0
    const previousClose = quoteData.pc || 0
    const change = currentPrice - previousClose
    const changePercent = previousClose !== 0 ? (change / previousClose) * 100 : 0

    const stockData = {
      symbol: symbol.toUpperCase(),
      name: profileData.name || symbol,
      price: currentPrice,
      change: change,
      changePercent: changePercent,
      volume: quoteData.v || 0,
      high: quoteData.h || 0,
      low: quoteData.l || 0,
      marketCap: profileData.marketCapitalization || 0
    }

    console.log('Stock data fetched:', stockData)

    return new Response(
      JSON.stringify(stockData),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Error fetching stock data:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})
