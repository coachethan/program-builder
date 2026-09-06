import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// Scope is deliberately narrow: drive.file only grants access to files THIS app creates, never
// the user's existing Drive contents. access_type=offline + prompt=consent ensure Google actually
// returns an access token we can use immediately after sign-in (some browsers/accounts skip
// returning one on repeat sign-ins without this).
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          scope: "openid email profile https://www.googleapis.com/auth/drive.file",
          access_type: "offline",
          prompt: "consent"
        }
      }
    })
  ],
  callbacks: {
    // Runs on sign-in and on every subsequent request that reads the session. `account` is only
    // present on the initial sign-in call, so this is where the access token first becomes
    // available - it's copied onto the token so later requests (which only see `token`, not
    // `account`) can still read it.
    async jwt({ token, account }) {
      if (account?.access_token) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    // Exposes the access token on the session object so both the client (to check "are we
    // signed in") and server-side session reads (the actual export API route) can use it.
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    }
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
