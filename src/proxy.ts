import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Proxy de Segurança (Versão Robusta para Next.js 16)
 * Suporta tanto o Mock Cookie quanto a integração real com Supabase SSR.
 */
export async function proxy(request: NextRequest) {

    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    // 1. Verificamos se há um cookie de Mock (Estratégia do Renato)
    const sessionCookie = request.cookies.get('cv_finance_user_mock');
    const { pathname } = request.nextUrl;

    // 2. Inicializamos o cliente Supabase SSR para validação real
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    // 3. Verificamos a sessão real no Supabase
    const { data: { user } } = await supabase.auth.getUser();

    // 4. Lógica de Proteção de Rotas (Aceita Mock ou User Real)
    const isAuthenticated = !!user || !!sessionCookie;
    const isLoginPage = pathname === '/login';
    const isPublicAsset = pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.includes('favicon.ico');

    if (!isAuthenticated && !isLoginPage && !isPublicAsset) {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = '/login';
        return NextResponse.redirect(redirectUrl);
    }

    if (isAuthenticated && isLoginPage) {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = '/';
        return NextResponse.redirect(redirectUrl);
    }

    return response;
}

export const config = {
    matcher: [
        /*
         * Corresponde a todas as rotas, exceto arquivos de mídia e estáticos
         */
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$|.*\\.ico$|.*\\.webp$).*)',
    ],
};

