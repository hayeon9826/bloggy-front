import type { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";
import prisma from "../../lib/prisma";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

type Data = {
  success?: boolean;
  message?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    let object;
    const { title, content, email } = req.body;
    const user = await prisma.user.findMany({
      where: { email: email },
    });

    if (user) {
      object = await prisma["post"].create({
        data: {
          title: title,
          content: content,
          userId: user[0]?.id,
        },
      });
    }

    res.json(object);
  } else {
    const { id, email } = req.query;
    console.log(email, "##email");
    let user;

    if (email) {
      user = await prisma.user.findMany({
        where: { email: email },
      });
      console.log(user, "##user");
    }

    const objects = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      where: {
        id: id ? id : {},
        userId: email ? user?.[0]?.id : {},
      },
      include: { user: true },
    });

    return res.json(id ? objects[0] : objects);
  }
}
