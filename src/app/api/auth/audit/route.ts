import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(request: Request) {
  try {
    // SECURITY: Verificar autenticação antes de processar
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    
    // Criar cliente autenticado com o token do usuário
    const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${token}` } }
    });

    // Verificar se o token é válido
    const { data: { user }, error: userError } = await supabaseAuth.auth.getUser(token);
    if (userError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    const { user_id } = body;

    // Garantir que o user_id do body corresponde ao usuário autenticado
    if (!user_id || user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Capturar dados de IP e User Agent
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const country = request.headers.get('x-vercel-ip-country') || request.headers.get('cf-ipcountry') || 'unknown';

    // Usar cliente com anon key para chamar a RPC (que é SECURITY DEFINER)
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data: isAnomaly, error } = await supabase.rpc('check_login_anomaly', {
      p_user_id: user_id,
      p_ip_address: ip,
      p_user_agent: userAgent,
      p_country: country
    });

    if (error) {
      console.error('Erro ao registrar auditoria de login:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    return NextResponse.json({ success: true, anomalyDetected: isAnomaly });
  } catch (err) {
    console.error('Erro na API de auditoria:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

