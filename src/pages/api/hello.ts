// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import prisma from "../../../lib/prisma";

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const session = await getToken({ req });
  const user = await prisma.user.findUnique({
    where: { id: session?.sub },
  });
  console.log(user);

  return res.status(200).json({ name: "John Doe" });
}
