import type { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

type Data = {
  success?: boolean;
  message?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === "POST") {
    const prompt = req.body.prompt;
    try {
      if (prompt == null) {
        throw new Error("No prompt was provided");
      }

      // trigger OpenAI completion
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        max_tokens: 2048,
        prompt,
      });

      // retrieve the completion text from response
      const completion = response.data.choices[0].text;

      return res.status(200).json({
        success: true,
        message: completion,
      });
    } catch (error: any) {
      console.log(error.message);
    }
  } else {
    res.status(200).json({ message: "TEST" });
  }
}
