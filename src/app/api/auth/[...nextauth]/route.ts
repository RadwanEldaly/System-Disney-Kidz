import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "admin@disneykidz.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // In a fully working system, we would check bcrypt hash against the DB.
        // As a fallback until DB is fully seeded with an admin user:
        if (credentials?.email === "admin@disneykidz.com" && credentials?.password === "admin123") {
          return { id: "1", name: "Admin", email: "admin@disneykidz.com", role: "ADMIN" };
        }
        return null;
      }
    })
  ],
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        (session.user as any).role = token.role;
      }
      return session;
    }
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-dev",
});

export { handler as GET, handler as POST };
