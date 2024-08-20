import NextAuth from "next-auth";
// import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./lib/prisma";
import type { Provider } from "next-auth/providers";
import Credentials from "next-auth/providers/credentials";
import { fetchUserByEmail } from "./lib/actions";
import bcryptjs from "bcryptjs";

const providers: Provider[] = [
  Google,
  Credentials({
    credentials: { 
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" } 
    },
    async authorize(credentials: Partial<Record<"email" | "password", unknown>>, request: Request) {
      const {email, password} = credentials as { email: string, password: string };
      const user = await fetchUserByEmail(email);
      if (!user) {
        throw new Error("User not found.");
      }
      if (!bcryptjs.compareSync(password, user.password?? " ")) {
        throw new Error("Password is incorrect.");
      }
      return user;
    },
  }),
];

export const providerMap = providers.map((provider) => {
  if (typeof provider === "function") {
    const providerData = provider();
    return { id: providerData.id, name: providerData.name };
  } else {
    return { id: provider.id, name: provider.name };
  }
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
  },
  adapter: PrismaAdapter(prisma),
  providers,
  pages: {
    signIn: "/login",
  },
});


