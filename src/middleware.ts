import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware de Segurança (Versão Robusta para Next.js 15/16)
 * 
 * Devido a incompatibilidades entre as versões mais recentes do Next.js (Turbopack) 
 * e o pacote legado @supabase/auth-helpers-nextjs, mudamos para uma validação 
 * baseada em cookies que funciona tanto para o Mock quanto para a futura integração SSR.
 */
export async function middleware(req: NextRequest) {
    const res = NextResponse.next();

    // Pegamos o cookie de sessão (Mock ou Real)
    const sessionCookie = req.cookies.get('cv_finance_user_mock');
    const { pathname } = req.nextUrl;

    // 1. Definição de rotas públicas
    const isLoginPage = pathname === '/login';
    const isPublicAsset = pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.includes('favicon.ico') ||
        /\.(png|jpg|jpeg|gif|svg|ico|webp|woff|woff2|ttf|eot|css|js|map)$/i.test(pathname);

    // 2. Lógica de Redirecionamento
    if (!sessionCookie && !isLoginPage && !isPublicAsset) {
        // Usuário não autenticado tentando acessar rota privada
        const redirectUrl = req.nextUrl.clone();
        redirectUrl.pathname = '/login';
        return NextResponse.redirect(redirectUrl);
    }

    if (sessionCookie && isLoginPage) {
        // Usuário já autenticado tentando acessar login
        const redirectUrl = req.nextUrl.clone();
        redirectUrl.pathname = '/';
        return NextResponse.redirect(redirectUrl);
    }

    return res;
}

export const config = {
    matcher: [
        /*
         * Corresponde a todas as rotas, exceto:
         * - api (rotas de API)
         * - _next/static (arquivos estáticos)
         * - _next/image (otimização de imagem)
         * - favicon.ico (arquivo de ícone)
         * - Arquivos estáticos com extensões comuns (imagens, fontes, etc.)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$|.*\\.ico$|.*\\.webp$).*)',
    ],
};
