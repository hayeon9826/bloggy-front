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
  email: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    const { prompt, type, email }: RequestData = req.body;
    let object;

    try {
      if (prompt == null) {
        throw new Error("No prompt was provided");
      }
      console.log("prompt:", `${PromptPrefix[type]}${prompt}`);
      // trigger OpenAI completion
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        max_tokens: 2000,
        prompt: `${PromptPrefix[type]}${prompt}`,
      });

      // retrieve the completion text from response
      const result = response.data.choices[0]?.text;

      const user = await prisma.user.findMany({
        where: { email: email },
      });

      if (result && user) {
        object = await prisma["aiRecord"].create({
          data: {
            prompt,
            answer: result,
            userId: user?.[0]?.id,
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
      console.log("error", error.message);
      if (error.response.status === 429) {
        let retries = 0;
        while (retries < MAX_RETRIES) {
          const waitTime = 2 ** retries * 1000;
          console.log(`Rate limited. Retrying in ${waitTime}ms`);
          await new Promise((resolve) => setTimeout(resolve, waitTime));
          retries++;
        }
        return res.status(500).json({
          success: false,
          error: error,
        });
      } else {
        console.log(error);
        throw error;
      }
    }
  } else {
    res.status(200).json({ message: "" });
  }
}
