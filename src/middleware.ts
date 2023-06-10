import { withAuth } from "next-auth/middleware";

export default withAuth({
  secret: process.env.SECRET,
});

export const config = {
  matcher: ["/((?!sign_in|[^/.]|invitation).*)"],
};
