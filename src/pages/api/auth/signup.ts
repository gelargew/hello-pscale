import { NextApiHandler } from "next";
import prisma from "../../../../lib/prisma";
const bcrypt = require("bcrypt");

const handler: NextApiHandler = async (req, res) => {
  if (req.method === "POST") {
    const { email, password } = req.body;
    if (
      !email ||
      !email.includes("@") ||
      !password ||
      password.trim().length < 7
    ) {
      res.status(422).json({
        message:
          "Invalid input - password should be at least 7 characters long.",
      });
      return;
    }
    const existingUser = await prisma.user.findFirst({
      where: { email: email },
    });
    if (existingUser) {
      res.status(422).json({ message: "User exists already!" });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const result = await prisma.user.create({
      data: {
        email: email,
        password: hashedPassword,
      },
    });
    res.status(201).json({ message: "Created user!", userId: result.id });
  }
};

export default handler;
