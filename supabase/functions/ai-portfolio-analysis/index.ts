
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
    const { userId, analysisType = 'comprehensive' } = await req.json();
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const openrouterKey = Deno.env.get('OPENROUTER_API_KEY');
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    if (!openrouterKey) {
      return new Response(
        JSON.stringify({ error: 'OpenRouter API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

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

    // Prepare portfolio data for AI analysis
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

    console.log('Sending request to OpenRouter for AI analysis');

    // AI Analysis using OpenRouter
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

    if (!aiResponse.ok) {
      console.error('OpenRouter API error:', await aiResponse.text());
      throw new Error('Failed to get AI analysis');
    }

    const aiData = await aiResponse.json();
    let analysis;
    
    try {
      analysis = JSON.parse(aiData.choices[0].message.content);
    } catch {
      // Fallback if JSON parsing fails
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

    // Calculate additional metrics
    const assetTypes = [...new Set(holdings.map(h => h.asset_type))];
    const concentrationRisk = holdings.length > 0 ? 
      Math.max(...holdings.map(h => (h.quantity * h.average_price) / portfolioSummary.totalValue)) * 100 : 0;

    console.log('AI Portfolio analysis completed for user:', userId);

    return new Response(
      JSON.stringify({
        ...analysis,
        metrics: {
          assetTypeCount: assetTypes.length,
          concentrationRisk: concentrationRisk,
          holdingsCount: holdings.length
        },
        timestamp: new Date().toISOString()
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
