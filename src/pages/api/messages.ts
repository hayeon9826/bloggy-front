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
  answer?: any;
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
    let object;
    let answer;

    try {
      if (prompt == null) {
        throw new Error("No prompt was provided");
      }

      const user = await prisma.user.findFirst({
        where: { email },
      });

      object = await prisma.message.create({
        data: {
          userId: user.id,
          chatType,
          chatId,
          body: prompt,
        },
        include: {
          chat: true,
        },
      });

      // trigger OpenAI completion
      // const response = await openai.createCompletion({
      //   model: "gpt-4o-mini",
      //   max_tokens: 50,
      //   prompt: `${PromptPrefix[type]}${prompt} \nAI:`,
      //   temperature: 0.9,
      //   top_p: 1,
      //   frequency_penalty: 0.0,
      //   presence_penalty: 0.6,
      //   stop: [" Human:", " AI:"],
      // });

      // retrieve the completion text from response
      // const completion = response.data.choices[0]?.text;

      // if (completion) {
      //   answer = await prisma.message.create({
      //     data: {
      //       chatType: "AI",
      //       chatId,
      //       body: completion,
      //     },
      //     include: {
      //       chat: true,
      //     },
      //   });
      // }
      return res.status(200).json({
        success: true,
        message: object,
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
