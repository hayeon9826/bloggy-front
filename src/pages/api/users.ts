import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";

type User = {
  name?: string;
  email?: string;
  id: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<User>) {
  const { email, name } = req.body;
  if (req.method === "POST") {
    const object = await prisma.user.create({
      data: { name, email },
    });

    return res.json(object);
  }
}
