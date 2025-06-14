
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
    const alphaVantageKey = Deno.env.get('ALPHA_VANTAGE_API_KEY')
    
    if (!alphaVantageKey) {
      throw new Error('Alpha Vantage API key not configured')
    }

    // Fetch major market indices
    const indices = ['SPY', 'QQQ', 'DIA', 'VIX']
    const marketData = []

    for (const symbol of indices) {
      try {
        const response = await fetch(
          `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${alphaVantageKey}`
        )
        const data = await response.json()
        
        if (data['Global Quote']) {
          const quote = data['Global Quote']
          const price = parseFloat(quote['05. price']) || 0
          const change = parseFloat(quote['09. change']) || 0
          const changePercent = parseFloat(quote['10. change percent']?.replace('%', '')) || 0

          let indexName = symbol
          switch (symbol) {
            case 'SPY': indexName = 'S&P 500'; break
            case 'QQQ': indexName = 'NASDAQ'; break
            case 'DIA': indexName = 'DOW'; break
            case 'VIX': indexName = 'VIX'; break
          }

          marketData.push({
            index: indexName,
            value: price.toFixed(2),
            change: (change >= 0 ? '+' : '') + change.toFixed(2),
            changePercent: (changePercent >= 0 ? '+' : '') + changePercent.toFixed(2) + '%'
          })
        }
      } catch (error) {
        console.error(`Error fetching ${symbol}:`, error)
      }

      // Rate limiting - wait between requests
      await new Promise(resolve => setTimeout(resolve, 200))
    }

    console.log('Market data fetched:', marketData)

    return new Response(
      JSON.stringify(marketData),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Error fetching market overview:', error)
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
