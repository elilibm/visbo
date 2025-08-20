// middleware.ts
export { auth as middleware } from "./auth";

export const config = {
  matcher: ["/boards/:path*"], // protect everything under /boards
};

