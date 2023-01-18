import { NextApiHandler } from "next";
import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GithubProvider from "next-auth/providers/github";
import prisma from "../../../lib/prisma";
import CredentialsProvider from "next-auth/providers/credentials";

const authHandler: NextApiHandler = (req, res) =>
  NextAuth(req, res, {
    providers: [
      GithubProvider({
        clientId: process.env.GITHUB_ID as string,
        clientSecret: process.env.GITHUB_SECRET as string,
      }),
      // CredentialsProvider({
      //   name: "credentials",
      // credentials: {
      //   email: {
      //     label: "Email",
      //     type: "email",
      //     placeholder: "jsmith@gmail.com",
      //   },
      //   password: { label: "Password", type: "password" },
      // },
      // authorize: async (credentials, request) => {
      //   // login logic goes here
      // },
      // }),
    ],
    adapter: PrismaAdapter(prisma),
    secret: process.env.SECRET,
  });

export default authHandler;
