// middleware.ts
import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: { signIn: "/login" }, // optional
  // callbacks: { authorized: ({ token }) => !!token } // optional
});

export const config = {
  matcher: ["/boards/:path*"],
};
