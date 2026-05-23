export { proxy as middleware } from './src/proxy';

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, manifest.json, etc.
     * - Static assets in public folder (svg, png, woff2, etc)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|brandmark.svg|Klump.svg|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff2?|ttf|json)$).*)',
  ],
};
