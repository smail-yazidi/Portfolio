"use server";

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/lib/mongodb";
import bcrypt from "bcryptjs";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Password Only",
      credentials: {
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.password) return null;

        const db = await connectDB();
        const admin = await db.collection("adminpassword").findOne({});
        if (!admin || !admin.hashedPassword) return null;

        const isValid = await bcrypt.compare(credentials.password, admin.hashedPassword);
        if (!isValid) return null;

        // return object to store in session
        return { id: admin._id.toString() };
      },
    }),
  ],
  session: {
    strategy: "jwt", // استخدم JWT بدل DB session
    maxAge: 24 * 60 * 60, // 24 ساعة
  },
  pages: {
    signIn: "/login",
    error: "/login?error=true", // سيحول الخطأ إلى صفحة تسجيل الدخول
  },
  secret: process.env.NEXTAUTH_SECRET, // لازم يكون في env
});

export { handler as GET, handler as POST };
