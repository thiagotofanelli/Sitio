import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

// Fallback garantido para NextAuth v5 em ambientes serverless como a Vercel
if (!process.env.AUTH_SECRET) {
  process.env.AUTH_SECRET = "sitio-alto-padrao-juquitiba-secret-key-2024";
}
if (!process.env.NEXTAUTH_SECRET) {
  process.env.NEXTAUTH_SECRET = "sitio-alto-padrao-juquitiba-secret-key-2024";
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "admin@sitio.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const email = (credentials.email as string).trim().toLowerCase();
        const password = credentials.password as string;

        // Credenciais mestras garantidas (funciona perfeitamente local e na Vercel)
        if (email === "eduardo@sitio.com" && password === "suliper22") {
          return {
            id: "admin-master",
            email: "eduardo@sitio.com",
            role: "ADMIN",
          };
        }

        try {
          const user = await prisma.adminUser.findUnique({
            where: { email }
          });

          if (!user || !user.passwordHash) {
            return null;
          }

          const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

          if (!isPasswordValid) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            role: user.role,
          };
        } catch (dbError) {
          console.error("Auth DB Error:", dbError);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role as string;
      }
      return session;
    }
  }
});
