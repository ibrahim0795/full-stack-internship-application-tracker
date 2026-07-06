export { auth as proxy } from "@/auth";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/applications/:path*",
    "/kanban/:path*",
    "/calendar/:path*",
    "/interviews/:path*",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
  ],
};
