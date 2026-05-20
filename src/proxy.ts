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

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isPublicRoute = PUBLIC_ROUTES.some((r) => pathname.startsWith(r));
  const isOnboardingRoute = ONBOARDING_ROUTES.some((r) =>
    pathname.startsWith(r)
  );

  // Helper to create a redirect response that preserves cookies set by Supabase
  const redirect = (url: string) => {
    const res = NextResponse.redirect(new URL(url, request.url));
    response.cookies.getAll().forEach((cookie) => {
      res.cookies.set(cookie.name, cookie.value, cookie.options);
    });
    return res;
  };

  // 1. No session → send to login
  if (!user && !isPublicRoute) {
    return redirect('/auth');
  }

  // 2. Has session but on login page → send home
  if (user && isPublicRoute) {
    return redirect('/');
  }

  // 3. Has session → check workspace membership
  if (user && !isPublicRoute) {
    // A. First, get all workspace IDs this user belongs to
    const { data: membershipData, error: membershipError } = await supabase
      .from('workspace_members')
      .select('workspace_id')
      .eq('user_id', user.id);

    if (membershipError)
      console.error('[PROXY ERROR] Membership check:', membershipError);

    const workspaceIds = (membershipData || []).map((m) => m.workspace_id);
    console.log('[PROXY DEBUG] User:', user.id, 'Workspace IDs:', workspaceIds);

    let firstSlug = null;

    if (workspaceIds.length > 0) {
      // B. Fetch the slugs for these workspaces directly to avoid join/RLS complexities
      const { data: workspaces, error: workspaceError } = await supabase
        .from('workspaces')
        .select('slug')
        .in('id', workspaceIds)
        .limit(1);

      if (workspaceError)
        console.error('[PROXY ERROR] Workspace lookup:', workspaceError);

      if (workspaces && workspaces.length > 0) {
        firstSlug = workspaces[0].slug;
      }
    }

    const hasWorkspaces = workspaceIds.length > 0;
    console.log(
      '[PROXY DEBUG] Decision - hasWorkspaces:',
      hasWorkspaces,
      'firstSlug:',
      firstSlug
    );

    // If they have a workspace but try to access onboarding, send them to their dashboard
    if (hasWorkspaces && isOnboardingRoute && firstSlug) {
      return redirect(`/${firstSlug}`);
    }

    // If hitting the exact root '/', redirect accordingly
    if (pathname === '/') {
      if (!hasWorkspaces) {
        return redirect('/onboarding');
      } else if (firstSlug) {
        return redirect(`/${firstSlug}`);
      }
    }

    // If trying to access any internal route but they have no workspace
    if (!hasWorkspaces && !isOnboardingRoute) {
      return redirect('/onboarding');
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
