import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that never require auth
const PUBLIC_ROUTES = ['/auth'];

// Routes that require auth but NOT an org (onboarding state)
const ONBOARDING_ROUTES = ['/onboarding'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  const isPublicRoute = PUBLIC_ROUTES.some((r) => pathname.startsWith(r));
  const isOnboardingRoute = ONBOARDING_ROUTES.some((r) => pathname.startsWith(r));

  // 1. No session → send to login
  if (!user && !isPublicRoute) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  // 2. Has session but on login page → send home
  if (user && isPublicRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 3. Has session → check workspace membership
  if (user && !isPublicRoute && !isOnboardingRoute) {
    const { data: memberships } = await supabase
      .from('workspace_members')
      .select('id')
      .eq('user_id', user.id)
      .limit(1);

    if (!memberships || memberships.length === 0) {
      return NextResponse.redirect(new URL('/onboarding', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
