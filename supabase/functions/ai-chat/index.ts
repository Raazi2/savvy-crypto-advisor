
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
    const { messages, model = 'nousresearch/nous-capybara-7b:free' } = await req.json();
    
    const openRouterKey = Deno.env.get('OPENROUTER_API_KEY');
    
    if (!openRouterKey) {
      console.error('OpenRouter API key not configured');
      return new Response(
        JSON.stringify({ error: 'API key not configured. Please add your OpenRouter API key.' }),
        { 
          status: 500,
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      );
    }

    console.log('AI Chat request:', { messageCount: messages.length, model });

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://fintech-advisor.app',
        'X-Title': 'Fintech Advisor'
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'system',
            content: `You are a professional Indian financial advisor AI assistant. You specialize in:
            - Indian stock market (NSE, BSE)
            - Mutual funds and SIPs
            - Cryptocurrency in India
            - Tax planning (Section 80C, ELSS, etc.)
            - Investment strategies for Indian market
            - Cybersecurity for financial accounts
            
            Always provide practical, India-specific financial advice. Mention relevant regulations like SEBI guidelines when appropriate. Be helpful but remind users that this is not personalized financial advice and they should consult a certified financial planner for major decisions.`
          },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 1000
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenRouter API error:', errorData);
      
      // Handle specific error cases
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ 
            error: 'OpenRouter credits exhausted. Please add credits at https://openrouter.ai/settings/credits or try again later.' 
          }),
          { 
            status: 402,
            headers: { 
              ...corsHeaders, 
              'Content-Type': 'application/json' 
            } 
          }
        );
      }
      
      if (response.status === 404) {
        return new Response(
          JSON.stringify({ 
            error: 'Selected AI model is not available. Please try a different model.' 
          }),
          { 
            status: 404,
            headers: { 
              ...corsHeaders, 
              'Content-Type': 'application/json' 
            } 
          }
        );
      }
      
      return new Response(
        JSON.stringify({ error: `OpenRouter API error: ${response.status}. ${errorData}` }),
        { 
          status: response.status,
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      );
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    console.log('AI response generated successfully');

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error in AI chat function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error. Please try again.' }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
