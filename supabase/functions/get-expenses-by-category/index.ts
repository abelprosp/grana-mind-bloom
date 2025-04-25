
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Não autorizado' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create a Supabase client with the auth header
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: { headers: { Authorization: authHeader } },
      }
    );

    // Get user info from the auth header
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Usuário não autenticado' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get transactions with negative amounts (expenses)
    const { data: transactions, error: txError } = await supabaseClient
      .from('transactions')
      .select('category, amount')
      .lt('amount', 0)
      .eq('user_id', user.id);
    
    if (txError) {
      throw txError;
    }
    
    // Aggregate by category
    const categories: Record<string, number> = {};
    transactions.forEach(tx => {
      const absAmount = Math.abs(tx.amount);
      if (categories[tx.category]) {
        categories[tx.category] += absAmount;
      } else {
        categories[tx.category] = absAmount;
      }
    });
    
    // Calculate total
    const total = Object.values(categories).reduce((a, b) => a + b, 0);
    
    // Convert to percentage
    const result = Object.entries(categories).map(([name, value]) => ({
      name,
      value: Number(((value / total) * 100).toFixed(0))
    }));
    
    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
