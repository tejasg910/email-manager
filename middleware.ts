import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define public routes
const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)', // Public sign-in route
  '/api/clerk(.*)', // Public API route for Clerk webhooks
  "/"
]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {

    await auth.protect(); // Protect all non-public routes
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};