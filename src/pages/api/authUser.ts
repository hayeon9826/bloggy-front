import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";

type User = {
  name?: string;
  email?: string;
  id: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<User>) {
  const { email } = req.body;

  if (req.method === "POST") {
    let object;

    if (email !== undefined) {
      object = await prisma.user.findFirst({
        where: {
          email,
        },
      });
    }

    return res.json(object);
  }
}
