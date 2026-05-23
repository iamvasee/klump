import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that never require auth (fully public)
const PUBLIC_ROUTES = ['/auth'];

// The landing page is public for unauthenticated users,
// but logged-in users get redirected to their workspace/onboarding.
const LANDING_ROUTE = '/';

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
  const isLandingRoute = pathname === LANDING_ROUTE;
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

  // 1. No session + public route or landing page → let through
  if (!user && (isPublicRoute || isLandingRoute)) {
    return response;
  }

  // 2. No session + protected route → send to login
  if (!user && !isPublicRoute && !isLandingRoute) {
    return redirect('/auth');
  }

  // 3. Has session but on login page → send to root for workspace resolution
  if (user && isPublicRoute) {
    return redirect('/');
  }

  // 4. Has session → check workspace membership to decide destination
  if (user) {
    const isPrefetch = request.headers.get('x-middleware-prefetch') === '1';

    if (!isPrefetch) {
      console.log(`[PROXY DEBUG] [${request.method}] ${pathname}`, {
        user: user.id,
        purpose: request.headers.get('purpose'),
        accept: request.headers.get('accept')?.split(',')[0],
      });
    }

    // FETCH WORKSPACES AND SLUGS IN ONE QUERY
    const { data: workspaces, error: workspaceError } = await supabase
      .from('workspaces')
      .select('id, slug, workspace_members!inner(user_id)')
      .eq('workspace_members.user_id', user.id);

    if (workspaceError) {
      console.error('[PROXY ERROR] Workspace lookup:', workspaceError);
    }

    const userWorkspaces = workspaces || [];
    const hasWorkspaces = userWorkspaces.length > 0;
    const workspaceCount = userWorkspaces.length;
    const firstSlug = hasWorkspaces ? userWorkspaces[0].slug : null;

    if (!isPrefetch) {
      console.log(`[PROXY DEBUG] Result for ${pathname}:`, {
        hasWorkspaces,
        workspaceCount,
        firstSlug,
      });
    }

    // 1. NO WORKSPACES -> Must go to onboarding
    if (!hasWorkspaces && !isOnboardingRoute) {
      return redirect('/onboarding');
    }

    // 2. HAS WORKSPACES -> Routing based on count and current path
    if (hasWorkspaces) {
      // If hitting the landing page while logged in, redirect to workspace or lobby
      if (isLandingRoute) {
        if (workspaceCount === 1 && firstSlug) {
          return redirect(`/${firstSlug}`);
        } else {
          return redirect('/workspaces');
        }
      }

      // If they try to access onboarding but they have workspaces,
      // we let them through if they are at /onboarding (e.g. from the Lobby "Create New" button)
      // but we redirect them from the dashboard back to selection if they are lost.
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
