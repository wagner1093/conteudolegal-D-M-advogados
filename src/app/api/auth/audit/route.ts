import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Usamos as variáveis de ambiente base do Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// A função RPC 'check_login_anomaly' é SECURITY DEFINER, então a anon key é suficiente
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { user_id } = body;

    if (!user_id) {
      return NextResponse.json({ error: 'user_id is required' }, { status: 400 });
    }

    // Capturar dados de IP e User Agent
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const country = request.headers.get('x-vercel-ip-country') || request.headers.get('cf-ipcountry') || 'unknown';

    // Chama a função RPC para checar anomalia e registrar o login
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
