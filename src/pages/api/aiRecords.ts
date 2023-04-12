import { AiRecord, PromptPrefix, PromptType } from "@/interface";
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
  record?: AiRecord;
  error?: any;
};

type RequestData = {
  prompt: string;
  type: PromptType;
  userId: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === "POST") {
    const { prompt, type, userId }: RequestData = req.body;
    let object;

    try {
      if (prompt == null) {
        throw new Error("No prompt was provided");
      }
      const user = await prisma.user.findFirst({
        where: { id: userId },
        include: { ai_records: true },
      });

      if (user == null) {
        throw new Error("No user");
      }

      if (user?.ai_records?.length >= 10) {
        throw new Error("Free Trial Expired");
      }
      // trigger OpenAI completion
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        max_tokens: 100,
        prompt: `${PromptPrefix[type]}${prompt}`,
      });

      // retrieve the completion text from response
      const result = response.data.choices[0]?.text;

      if (result && user) {
        object = await prisma["aiRecord"].create({
          data: {
            prompt,
            answer: result,
            userId: user?.id,
          },
        });
      }

      return res.status(200).json({
        success: true,
        message: result,
        record: object,
      });
    } catch (error: any) {
      const MAX_RETRIES = 3;
      if (error?.response?.status === 429) {
        let retries = 0;
        while (retries < MAX_RETRIES) {
          const waitTime = 2 ** retries * 1000;
          console.log(`Rate limited. Retrying in ${waitTime}ms`);
          await new Promise((resolve) => setTimeout(resolve, waitTime));
          retries++;
        }
      } else {
        console.log(error);
        throw error;
      }
      return res.status(500).json({
        success: false,
        error: error?.message,
      });
    }
  } else {
    res.status(200).json({ message: "" });
  }
}
