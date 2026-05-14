import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Geoblocking: bloquear IPs que não sejam do Brasil
  // Usando os cabeçalhos padrão de CDNs (Vercel, Cloudflare)
  const country = request.headers.get('x-vercel-ip-country') || request.headers.get('cf-ipcountry');
  const path = request.nextUrl.pathname;

  // Aplica geoblocking apenas para a área administrativa
  if (path.startsWith('/admin') || path.startsWith('/api/admin')) {
    if (country && country !== 'BR') {
      // Retorna 403 Forbidden se o país for identificado e não for Brasil
      return new NextResponse('Access Denied: Geographic restriction.', { status: 403 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
