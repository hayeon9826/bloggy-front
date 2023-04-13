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
  prompt: string;
  type: PromptType;
  chatId: string;
  chatType: "USER" | "AI";
  email: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    const { prompt, type, chatId, chatType, email }: RequestData = req.body;

    try {
      if (prompt == null) {
        throw new Error("No prompt was provided");
      }

      if (chatType === "USER") {
        const user = await prisma.user.findFirst({
          email,
        });
        const message = await prisma.message.create({
          data: {
            userId: user.id,
            chatType,
            chatId,
            body: prompt,
          },
          include: {
            user: true,
          },
        });
      }

      // trigger OpenAI completion
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        max_tokens: 50,
        prompt: `${PromptPrefix[type]}${prompt}`,
      });

      // retrieve the completion text from response
      const completion = response.data.choices[0]?.text;

      if (completion) {
        const message = await prisma.message.create({
          data: {
            chatType,
            chatId: "AI",
            body: completion,
          },
        });
      }

      return res.status(200).json({
        success: true,
        message: completion,
      });
    } catch (error: any) {
      console.log(error.message);
      return res.status(500).json({
        success: false,
        error: error?.message,
      });
    }
  } else {
    res.status(200).json({ message: "TEST" });
  }
}
