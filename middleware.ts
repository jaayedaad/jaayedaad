export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/(.*)",
    "/auth(.*)",
    "/(api(?!/profile)|trpc)(.*)",
  ],
};
