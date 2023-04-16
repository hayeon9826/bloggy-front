import { PromptPrefix, PromptType } from "@/interface";
import type { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";
import prisma from "@/lib/prisma";
import { useCurrentUser } from "@/lib";
import { getCurrentUser } from "@/lib/backend";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

type Data = {
  success?: boolean;
  message?: string;
  error?: any;
};

type RequestData = {
  email: string;
  prompt: string;
  type: PromptType;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === "POST") {
    let object;
    const { email, prompt, type }: RequestData = req.body;
    console.log(email, prompt, type, "@@@email, prompt, type");

    const currentUser = await prisma.user.findFirst({
      where: { email },
    });
    console.log(currentUser, "@@@currentUser");

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      max_tokens: 50,
      prompt: `${PromptPrefix[type]}${prompt}`,
    });

    console.log(response, "@@@response");

    const title = response.data.choices[0]?.text;

    console.log(title, "@@@title");

    if (currentUser) {
      object = await prisma.chat.create({
        data: {
          userId: currentUser.id,
          title,
        },
      });
    }

    res.status(200).json(object);
  } else {
    const { id, email } = req.query;

    let user;

    if (email) {
      user = await prisma.user.findFirst({
        where: { email: email },
      });
    }

    const objects = await prisma.chat.findMany({
      orderBy: { createdAt: "desc" },
      where: {
        id: id ? id : {},
        userId: email ? user?.id || "" : {},
      },
      include: { user: true, messages: true },
    });

    res.status(200).json(id ? objects[0] : objects);
  }
}
