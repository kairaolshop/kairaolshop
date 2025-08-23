import { AuthOptions, getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 hari
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) return null;

        const valid = await bcrypt.compare(credentials.password, user.password);
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role || "USER",
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      // Saat login pertama kali
      if (user) {
        token.id = user.id;
        token.role = user.role || "USER";
        token.lastDbCheck = Date.now(); // waktu terakhir cek DB
      }

      // Cek DB tiap 5 menit sekali (bukan tiap request)
      const FIVE_MINUTES = 60 * 60 * 1000;
      if (!token.lastDbCheck || Date.now() - token.lastDbCheck > FIVE_MINUTES) {
        const existingUser = await prisma.user.findUnique({
          where: { id: token.id as string },
        }).catch(() => null);

        token.lastDbCheck = Date.now();

        if (!existingUser) {
          // user sudah dihapus → reset token supaya logout
          token.id = "";
          token.role = "USER";
          token.invalid = true;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (token.invalid) {
        // Reset session jadi kosong
        return {
          ...session,
          user: {
            id: "",
            name: "",
            email: "",
            role: "USER",
          },
        };
      }

      if (session.user) {
        session.user.id = token.id as string;
         session.user.role = token.role === "ADMIN" ? "ADMIN" : "USER";
      }
      return session;
    },
  },
};

export async function getAuthSession() {
  return await getServerSession(authOptions);
}
