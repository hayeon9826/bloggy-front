import { PromptPrefix, PromptType } from "@/interface";
import type { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";
import prisma from "@/lib/prisma";

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
  title: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    const { email, title }: RequestData = req.body;

    const user = await prisma.user.findFirst({
      email,
    });

    const object = await prisma.chat.create({
      userId: user.id,
      title,
    });

    res.status(200).json(object);
  } else {
    const { id } = req.body;
    const chat = await prisma.chat.findFirst({
      id,
    });

    res.status(200).json(chat);
  }
}
