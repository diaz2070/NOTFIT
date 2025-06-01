// import { createServerClient } from '@supabase/ssr';
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
  // Change to let later on dev
  const supabaseResponse = NextResponse.next({
    request,
  });

  // const supabase = createServerClient(
  //   process.env.SUPABASE_URL!,
  //   process.env.SUPABASE_ANON_KEY!,
  //   {
  //     cookies: {
  //       getAll() {
  //         return request.cookies.getAll();
  //       },
  //       setAll(cookiesToSet) {
  //         cookiesToSet.forEach(({ name, value }) =>
  //           request.cookies.set(name, value),
  //         );
  //         supabaseResponse = NextResponse.next({
  //           request,
  //         });
  //         cookiesToSet.forEach(({ name, value, options }) =>
  //           supabaseResponse.cookies.set(name, value, options),
  //         );
  //       },
  //     },
  //   },
  // // );

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: DO NOT REMOVE auth.getUser()

  // const {
  //   data: { user },
  // // } = await supabase.auth.getUser();

  // ! GET RID OF THIS LATER
  // if (
  //   !user &&
  //   !request.nextUrl.pathname.startsWith('/login') &&
  //   !request.nextUrl.pathname.startsWith('/auth')
  // ) {
  //   // no user, potentially respond by redirecting the user to the login page
  //   const url = request.nextUrl.clone();
  //   url.pathname = '/login';
  //   return NextResponse.redirect(url);
  // }

  return supabaseResponse;
}

// This middleware function is called on every request to update the session
export async function middleware(request: NextRequest) {
  return updateSession(request);
}
