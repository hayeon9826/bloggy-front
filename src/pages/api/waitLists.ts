import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email } = req.query;
  if (req.method === "POST") {
    let object;
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
      include: { wait_lists: true },
    });

    if (user?.wait_lists?.length === 0) {
      object = await prisma.waitList.create({
        data: {
          userId: user.id,
        },
      });
    } else {
      object = await prisma.waitList.findFirst({
        where: {
          userId: user.id,
        },
      });
    }

    return res.json(object);
  }
}
