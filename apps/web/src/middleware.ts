import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  locales: ["zh-CN", "en"],
  defaultLocale: "zh-CN",
  localeDetection: false,
  localePrefix: "always",
});

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
