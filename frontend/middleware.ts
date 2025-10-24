import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define public routes that don't require authentication
const publicRoutes = [
  '/',
  '/login',
  '/ctf',
  '/chatbot',
  '/api-demo',
];

// Define protected route patterns
const protectedRoutePatterns = [
  '/admin',
  '/reports',
  '/personnel',
  '/assets',
  '/vendor',
  '/risk',
  '/integrations',
  '/compliance',
  '/policies',
  '/security',
  '/trust',
  '/tests',
  '/feeds',
];

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Check if it's a public route
  const isPublicRoute = publicRoutes.some(route =>
    path === route || path.startsWith(route + '/')
  );

  // Check if it's a protected route
  const isProtectedRoute = protectedRoutePatterns.some(pattern =>
    path.startsWith(pattern)
  );

  // If it's a protected route, check for authentication
  if (isProtectedRoute && !isPublicRoute) {
    const token = request.cookies.get('adminToken')?.value;

    if (!token) {
      // Redirect to login with return URL
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', path);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public directory)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};