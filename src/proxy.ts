export { auth as proxy } from "@/auth";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/applications/:path*",
    "/kanban/:path*",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
  ],
};
