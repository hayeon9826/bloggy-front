import * as deepl from "deepl-node";
import { NextApiRequest, NextApiResponse } from "next";

const authKey = process.env.DEEPL_API_KEY as string;
const translator = new deepl.Translator(authKey);

type Request = {
  text: string;
  source?: "en" | "ko";
  target?: "en-US" | "ko";
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method === "POST") {
    let translated;
    const { text, source, target }: Request = req.body;

    if (!text) {
      throw new Error("Text required");
    }

    if (source === "ko" && target === "en-US") {
      const result = await translator.translateText(text, source, target);
      translated = result.text;
    } else if (source === "en" && target === "ko") {
      const result = await translator.translateText(text, source, target);
      translated = result.text;
    } else {
      throw new Error("Invalid source/target language");
    }
    return res.status(200).json({
      translatedText: translated,
    });
  }
}
