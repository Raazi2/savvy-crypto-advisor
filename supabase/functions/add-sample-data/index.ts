
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
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Adding sample portfolio data for user:', userId);

    // Get user's portfolio
    const { data: portfolios } = await supabase
      .from('portfolios')
      .select('*')
      .eq('user_id', userId)
      .limit(1);

    if (!portfolios || portfolios.length === 0) {
      // Create a portfolio first
      const { data: newPortfolio } = await supabase
        .from('portfolios')
        .insert({
          user_id: userId,
          name: 'My Portfolio',
          total_value: 125000
        })
        .select()
        .single();

      if (!newPortfolio) {
        throw new Error('Failed to create portfolio');
      }
    }

    const portfolio = portfolios?.[0] || { id: 'sample' };

    // Sample holdings data
    const sampleHoldings = [
      {
        portfolio_id: portfolio.id,
        user_id: userId,
        symbol: 'RELIANCE',
        name: 'Reliance Industries Ltd',
        asset_type: 'stock',
        quantity: 50,
        average_price: 2450.00,
        current_price: 2520.00
      },
      {
        portfolio_id: portfolio.id,
        user_id: userId,
        symbol: 'TCS',
        name: 'Tata Consultancy Services',
        asset_type: 'stock',
        quantity: 30,
        average_price: 3200.00,
        current_price: 3350.00
      },
      {
        portfolio_id: portfolio.id,
        user_id: userId,
        symbol: 'INFY',
        name: 'Infosys Limited',
        asset_type: 'stock',
        quantity: 40,
        average_price: 1450.00,
        current_price: 1480.00
      },
      {
        portfolio_id: portfolio.id,
        user_id: userId,
        symbol: 'bitcoin',
        name: 'Bitcoin',
        asset_type: 'crypto',
        quantity: 0.5,
        average_price: 4200000.00,
        current_price: 4350000.00
      },
      {
        portfolio_id: portfolio.id,
        user_id: userId,
        symbol: 'ethereum',
        name: 'Ethereum',
        asset_type: 'crypto',
        quantity: 2.0,
        average_price: 280000.00,
        current_price: 295000.00
      }
    ];

    // Clear existing holdings first
    await supabase
      .from('portfolio_holdings')
      .delete()
      .eq('user_id', userId);

    // Insert sample holdings
    const { data: insertedHoldings, error } = await supabase
      .from('portfolio_holdings')
      .insert(sampleHoldings)
      .select();

    if (error) {
      throw error;
    }

    // Update portfolio total value
    const totalValue = sampleHoldings.reduce((sum, holding) => {
      return sum + (holding.current_price * holding.quantity);
    }, 0);

    await supabase
      .from('portfolios')
      .update({ total_value: totalValue })
      .eq('user_id', userId);

    console.log('Sample data added successfully for user:', userId);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Sample portfolio data added successfully',
        holdingsCount: insertedHoldings?.length || 0,
        totalValue: totalValue
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error adding sample data:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to add sample data', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
