import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// 定義公開路由（不需要登入）
const isPublicRoute = createRouteMatcher([
  '/',           // 首頁
  '/sign-in(.*)', // 登入頁面
  '/sign-up(.*)' // 註冊頁面
]);

export default clerkMiddleware(async (auth, req) => {
  // 如果不是公開路由，則需要保護
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
