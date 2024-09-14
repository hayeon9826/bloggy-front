import { PromptPrefix, PromptType } from "@/interface";
import type { NextApiRequest, NextApiResponse } from "next";
import { makeSignature } from "./signature";

import prisma from "@/lib/prisma";
import axios from "axios";

const CLOVA_CHATBOT_API_URL = process.env.CLOVA_CHAT_API_URL as string;
const CLOVA_SECRET_KEY = process.env.CLOVA_CHAT_SECRET as string;

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

      // CLOVA Chatbot API 요청 설정
      const timestamp = Date.now();
      const requestBody = {
        version: "v2",
        userId: user.id,
        timestamp,
        bubbles: [{ type: "text", data: { description: prompt } }],
        event: "send",
      };

      const signature = makeSignature(
        CLOVA_SECRET_KEY,
        JSON.stringify(requestBody)
      );

      const response = await axios.post(CLOVA_CHATBOT_API_URL, requestBody, {
        headers: {
          "Content-Type": "application/json;UTF-8",
          "X-NCP-CHATBOT_SIGNATURE": signature,
        },
      });

      const botResponse = response.data.bubbles[0]?.data?.description;

      if (!botResponse) {
        return res
          .status(500)
          .json({ message: "Failed to generate response." });
      }

      // AI 응답을 데이터베이스에 저장
      answer = await prisma.message.create({
        data: {
          chatType: "AI",
          chatId,
          body: botResponse,
        },
        include: {
          chat: true,
        },
      });

      return res.status(200).json({
        success: true,
        message: object,
        answer,
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
