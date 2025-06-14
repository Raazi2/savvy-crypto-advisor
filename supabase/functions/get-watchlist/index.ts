
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
    const finnhubKey = Deno.env.get('FINNHUB_API_KEY')
    
    if (!finnhubKey) {
      throw new Error('Finnhub API key not configured')
    }

    // Default watchlist symbols
    const symbols = ['AAPL', 'TSLA', 'NVDA', 'MSFT', 'GOOGL']
    const watchlistData = []

    for (const symbol of symbols) {
      try {
        // Get quote data
        const quoteResponse = await fetch(
          `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${finnhubKey}`
        )
        const quoteData = await quoteResponse.json()

        // Get company profile
        const profileResponse = await fetch(
          `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${finnhubKey}`
        )
        const profileData = await profileResponse.json()

        const currentPrice = quoteData.c || 0
        const previousClose = quoteData.pc || 0
        const change = currentPrice - previousClose
        const changePercent = previousClose !== 0 ? (change / previousClose) * 100 : 0

        watchlistData.push({
          symbol: symbol,
          name: profileData.name || symbol,
          price: currentPrice,
          change: change,
          changePercent: changePercent,
          volume: quoteData.v ? (quoteData.v / 1000000).toFixed(1) + 'M' : 'N/A'
        })

        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 200))
      } catch (error) {
        console.error(`Error fetching ${symbol}:`, error)
      }
    }

    console.log('Watchlist data fetched:', watchlistData)

    return new Response(
      JSON.stringify(watchlistData),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Error fetching watchlist:', error)
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
