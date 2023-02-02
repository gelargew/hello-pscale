import { NextApiHandler } from "next";
import NextAuth, { Awaitable, Session } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import prisma from "../../../../lib/prisma";
import CredentialsProvider from "next-auth/providers/credentials";

const bcrypt = require("bcrypt");

const authHandler: NextApiHandler = (req, res) =>
  NextAuth(req, res, {
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_SECRET as string,
      }),
      GithubProvider({
        clientId: process.env.GITHUB_ID as string,
        clientSecret: process.env.GITHUB_SECRET as string,
      }),
      CredentialsProvider({
        name: "Credentials",
        async authorize(credentials) {
          if (!credentials) {
            throw new Error("Invalid credentials");
          }
          const user = await prisma.user.findFirst({
            where: { email: credentials.email },
          });
          if (!user) {
            throw new Error("No user found");
          }
          const isValid = await bcrypt.compare(
            credentials.password,
            user.password
          );
          console.log(isValid, "isValid");
          if (!isValid) {
            throw new Error("Invalid password");
          }
          console.log(user);
          return user;
        },
        credentials: {
          email: { label: "Email", type: "text", placeholder: "jsmith" },
          password: { label: "Password", type: "password" },
        },
      }),
    ],
    adapter: PrismaAdapter(prisma),
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
      jwt: async ({ user, token, ...rest }) => {
        console.log(user, token, "jwt", rest);
        if (user) {
          token.uid = user.id;
        }
        return token;
      },
    },
    session: {
      strategy: "jwt",
    },
  });

export default authHandler;
