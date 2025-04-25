
import { serve } from 'https://deno.land/std@0.182.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.26.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  
  try {
    // Criando o cliente supabase com a URL e chave da API
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Obtendo informações do usuário a partir do token de autenticação
    const authHeader = req.headers.get('Authorization')!
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Não autorizado' }), { 
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Buscar transações apenas do usuário autenticado que são despesas (valor < 0)
    const { data, error } = await supabaseClient
      .from('transactions')
      .select('category, amount')
      .eq('user_id', user.id)
      .lt('amount', 0)

    if (error) {
      throw error
    }

    // Agregar por categoria
    const categories: Record<string, number> = {}
    data.forEach(tx => {
      const absAmount = Math.abs(tx.amount)
      const category = tx.category || 'Outros'
      
      if (categories[category]) {
        categories[category] += absAmount
      } else {
        categories[category] = absAmount
      }
    })

    // Calcular o percentual de cada categoria
    const total = Object.values(categories).reduce((a, b) => a + b, 0)
    const result = Object.entries(categories).map(([name, value]) => ({
      name,
      value: total > 0 ? Number(((value / total) * 100).toFixed(1)) : 0
    }))

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
