
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const generateFallbackAnalysis = (portfolioSummary: any) => {
  const totalValue = portfolioSummary.totalValue || 0;
  const holdingsCount = portfolioSummary.totalHoldings || 0;
  const holdings = portfolioSummary.holdings || [];
  
  // Calculate basic metrics
  const assetTypes = [...new Set(holdings.map((h: any) => h.assetType))];
  const stocksCount = holdings.filter((h: any) => h.assetType === 'stock').length;
  const cryptoCount = holdings.filter((h: any) => h.assetType === 'crypto').length;
  
  // Basic risk assessment
  let riskScore = 50; // Default medium risk
  if (cryptoCount > stocksCount) riskScore += 20; // Higher risk if more crypto
  if (holdingsCount < 5) riskScore += 15; // Higher risk if low diversification
  if (totalValue > 1000000) riskScore -= 10; // Lower risk if high value (more stable)
  
  riskScore = Math.max(0, Math.min(100, riskScore)); // Clamp between 0-100
  
  // Diversification score
  let diversificationScore = Math.min(assetTypes.length * 25, 75); // Base on asset types
  if (holdingsCount >= 10) diversificationScore += 15;
  if (holdingsCount >= 20) diversificationScore += 10;
  diversificationScore = Math.min(100, diversificationScore);
  
  // Generate recommendations based on portfolio composition
  const recommendations = [];
  if (holdingsCount < 5) {
    recommendations.push("Consider adding more holdings to improve diversification");
  }
  if (assetTypes.length === 1) {
    recommendations.push("Diversify across different asset classes (stocks, bonds, crypto)");
  }
  if (cryptoCount > stocksCount * 2) {
    recommendations.push("Consider reducing crypto exposure and adding traditional assets");
  }
  if (totalValue > 100000 && !holdings.some((h: any) => h.symbol.includes('GOLD') || h.symbol.includes('GLD'))) {
    recommendations.push("Consider adding precious metals for portfolio stability");
  }
  recommendations.push("Regularly review and rebalance your portfolio");
  recommendations.push("Consider setting up systematic investment plans (SIPs)");
  
  // Generate predictions
  const predictions = {
    shortTerm: holdingsCount > 5 ? 
      "Portfolio shows good diversification for stable short-term performance" :
      "Limited diversification may lead to higher volatility in the short term",
    longTerm: totalValue > 500000 ?
      "Strong portfolio foundation suggests positive long-term growth potential" :
      "Focus on consistent investing and diversification for long-term wealth building"
  };
  
  // Rebalancing advice
  const rebalanceAdvice = [];
  if (cryptoCount > stocksCount) {
    rebalanceAdvice.push("Consider reducing crypto allocation to 20-30% of total portfolio");
  }
  if (stocksCount < 3) {
    rebalanceAdvice.push("Add more blue-chip stocks for stability");
  }
  rebalanceAdvice.push("Review portfolio allocation quarterly");
  rebalanceAdvice.push("Consider market conditions before making major changes");
  
  return {
    analysis: `Your portfolio currently holds ${holdingsCount} assets with a total value of ₹${totalValue.toLocaleString()}. The portfolio shows ${diversificationScore > 70 ? 'good' : diversificationScore > 40 ? 'moderate' : 'limited'} diversification across ${assetTypes.length} asset types. ${cryptoCount > 0 ? `Cryptocurrency holdings represent ${Math.round((cryptoCount/holdingsCount)*100)}% of your positions, ` : ''}${stocksCount > 0 ? `while traditional stocks make up ${Math.round((stocksCount/holdingsCount)*100)}% of holdings. ` : ''}Consider regular portfolio reviews and rebalancing to maintain optimal risk-return characteristics. Focus on building a well-diversified portfolio that aligns with your investment goals and risk tolerance.`,
    riskScore,
    diversificationScore,
    recommendations,
    predictions,
    rebalanceAdvice
  };
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, analysisType = 'comprehensive' } = await req.json();
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const openrouterKey = Deno.env.get('OPENROUTER_API_KEY');
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Fetching portfolio data for AI analysis, user:', userId);

    // Get user's portfolio data
    const { data: holdings } = await supabase
      .from('portfolio_holdings')
      .select('*')
      .eq('user_id', userId);

    const { data: portfolios } = await supabase
      .from('portfolios')
      .select('*')
      .eq('user_id', userId);

    if (!holdings || holdings.length === 0) {
      return new Response(
        JSON.stringify({
          analysis: 'No holdings found for analysis. Consider adding some stocks or crypto to your portfolio to get AI-powered insights.',
          recommendations: ['Add diversified holdings to your portfolio', 'Consider both stocks and crypto for balanced exposure'],
          riskScore: 0,
          diversificationScore: 0,
          predictions: {
            shortTerm: 'Unable to predict without portfolio data',
            longTerm: 'Start building your portfolio for long-term wealth creation'
          },
          rebalanceAdvice: ['Begin by adding your first investment']
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Prepare portfolio data for analysis
    const portfolioSummary = {
      totalHoldings: holdings.length,
      totalValue: portfolios?.[0]?.total_value || 0,
      holdings: holdings.map(h => ({
        symbol: h.symbol,
        name: h.name,
        quantity: h.quantity,
        avgPrice: h.average_price,
        currentPrice: h.current_price,
        assetType: h.asset_type
      }))
    };

    let analysis;

    // Try AI analysis first if API key is available
    if (openrouterKey) {
      try {
        console.log('Attempting AI analysis with OpenRouter');

        const aiResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openrouterKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://fintech-advisor.lovable.app',
            'X-Title': 'Fintech Advisor AI'
          },
          body: JSON.stringify({
            model: 'anthropic/claude-3.5-sonnet',
            messages: [
              {
                role: 'system',
                content: `You are an expert financial advisor and portfolio analyst. Analyze the given portfolio and provide insights in JSON format with the following structure:
                {
                  "analysis": "detailed analysis text",
                  "riskScore": number (0-100),
                  "diversificationScore": number (0-100),
                  "recommendations": ["recommendation1", "recommendation2", ...],
                  "predictions": {
                    "shortTerm": "1-3 month outlook",
                    "longTerm": "1+ year outlook"
                  },
                  "rebalanceAdvice": ["advice1", "advice2", ...]
                }

                Focus on practical, actionable advice for Indian markets and global investments.`
              },
              {
                role: 'user',
                content: `Analyze this portfolio: ${JSON.stringify(portfolioSummary)}`
              }
            ],
            temperature: 0.3
          }),
        });

        if (aiResponse.ok) {
          const aiData = await aiResponse.json();
          try {
            analysis = JSON.parse(aiData.choices[0].message.content);
            console.log('AI analysis successful');
          } catch {
            // If JSON parsing fails, use the raw content
            analysis = {
              analysis: aiData.choices[0].message.content,
              riskScore: 50,
              diversificationScore: 50,
              recommendations: ['Consider reviewing your portfolio allocation'],
              predictions: {
                shortTerm: 'Market conditions suggest cautious optimism',
                longTerm: 'Long-term growth potential remains positive'
              },
              rebalanceAdvice: ['Monitor your positions regularly']
            };
          }
        } else {
          const errorData = await aiResponse.text();
          console.log('OpenRouter API error:', errorData);
          
          if (errorData.includes('Insufficient credits') || errorData.includes('402')) {
            console.log('Insufficient credits detected, using fallback analysis');
            analysis = generateFallbackAnalysis(portfolioSummary);
          } else {
            throw new Error('AI API request failed');
          }
        }
      } catch (error) {
        console.log('AI analysis failed, using fallback:', error.message);
        analysis = generateFallbackAnalysis(portfolioSummary);
      }
    } else {
      console.log('No OpenRouter API key, using fallback analysis');
      analysis = generateFallbackAnalysis(portfolioSummary);
    }

    // Calculate additional metrics
    const assetTypes = [...new Set(holdings.map(h => h.asset_type))];
    const concentrationRisk = holdings.length > 0 ? 
      Math.max(...holdings.map(h => (h.quantity * h.average_price) / portfolioSummary.totalValue)) * 100 : 0;

    console.log('Portfolio analysis completed for user:', userId);

    return new Response(
      JSON.stringify({
        ...analysis,
        metrics: {
          assetTypeCount: assetTypes.length,
          concentrationRisk: concentrationRisk,
          holdingsCount: holdings.length
        },
        timestamp: new Date().toISOString(),
        analysisType: openrouterKey ? 'ai-powered' : 'algorithmic'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in AI portfolio analysis:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to analyze portfolio', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
