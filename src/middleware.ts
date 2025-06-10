import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// This middleware runs on every request to check if the user is authenticated
// and to update the session cookies accordingly
// It also redirects unauthenticated users to the login page if they try to access protected routes
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

// This function updates the session by checking the user's authentication status
// and setting the appropriate cookies
// It also handles redirection for unauthenticated users
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const isAuthRoute =
    request.nextUrl.pathname === '/sign-in' ||
    request.nextUrl.pathname === '/sign-up';

  const isEmailConfirmRoute =
    request.nextUrl.pathname.startsWith('/auth/confirm');

  const isPublicRoute =
    isAuthRoute || request.nextUrl.pathname === '/' || isEmailConfirmRoute;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (isAuthRoute && user) {
    return NextResponse.redirect(
      new URL('/', process.env.NEXT_PUBLIC_BASE_URL),
    );
  }

  if (!isPublicRoute && !user) {
    return NextResponse.redirect(
      new URL('/sign-in', process.env.NEXT_PUBLIC_BASE_URL),
    );
  }

  return supabaseResponse;
}

// This middleware function is called on every request to update the session
export async function middleware(request: NextRequest) {
  return updateSession(request);
}
