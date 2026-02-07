import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string | null;
      email: string;
      role: "ADMIN" | "USER";
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    name: string | null;
    email: string;
    role: "ADMIN" | "USER";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: "ADMIN" | "USER";
    lastDbCheck?: number;
    invalid?: boolean;
  }
}