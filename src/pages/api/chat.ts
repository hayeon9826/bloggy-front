import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import axios from "axios";
import { makeSignature } from "./signature"; // 위에서 만든 Signature 생성 함수 임포트

const CLOVA_CHATBOT_API_URL = process.env.CLOVA_CHAT_API_URL as string;
const CLOVA_SECRET_KEY = process.env.CLOVA_CHAT_SECRET as string;

type Data = {
  success?: boolean;
  message?: string;
  error?: any;
};

type RequestData = {
  email: string;
  prompt: string;
  type: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    try {
      const { email, prompt }: RequestData = req.body;

      // 데이터베이스에서 현재 사용자 검색
      const currentUser = await prisma.user.findFirst({
        where: { email },
      });

      if (!currentUser) {
        return res.status(404).json({ message: "User not found." });
      }

      // CLOVA Chatbot 요청 바디 생성
      const requestBody = {
        version: "v2",
        userId: currentUser.id, // 사용자 고유 ID
        timestamp: Date.now(),
        bubbles: [
          {
            type: "text",
            data: {
              description: prompt, // 사용자의 질의
            },
          },
        ],
        event: "send", // 이벤트 타입
      };

      // Signature 생성
      const signature = makeSignature(
        CLOVA_SECRET_KEY,
        JSON.stringify(requestBody)
      );

      // CLOVA Chatbot API 호출
      const response = await axios.post(CLOVA_CHATBOT_API_URL, requestBody, {
        headers: {
          "Content-Type": "application/json;UTF-8",
          "X-NCP-CHATBOT_SIGNATURE": signature,
        },
      });

      const chatbotResponse = response.data;

      // 결과를 데이터베이스에 저장하거나 필요한 처리를 진행
      const object = await prisma.chat.create({
        data: {
          userId: currentUser.id,
          title: chatbotResponse.bubbles[0]?.data?.description || "No Title",
        },
      });

      res.status(200).json({ success: true, ...object });
    } catch (error) {
      console.error("Error in POST handler:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error", error });
    }
  } else if (req.method === "GET") {
    // GET 메서드 처리 (변경 없음)
    try {
      const { id, email, page = 1, limit = 12 } = req.query;

      let user;

      if (email) {
        user = await prisma.user.findFirst({
          where: { email: String(email) },
        });

        if (!user) {
          return res.status(404).json({ message: "User not found." });
        }
      }

      const totalCount = await prisma.chat.count({
        where: {
          ...(email && { userId: user?.id }),
        },
      });

      const take = Number(page) * Number(limit);

      const objects = await prisma.chat.findMany({
        orderBy: { createdAt: "desc" },
        where: {
          ...(id && { id: String(id) }),
          ...(email && { userId: user?.id }),
        },
        include: { user: true, messages: true },
        take: take,
      });

      res.status(200).json(id ? objects[0] : { objects, totalCount });
    } catch (error) {
      console.error("Error in GET handler:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error", error });
    }
  } else {
    res.setHeader("Allow", ["POST", "GET"]);
    res
      .status(405)
      .json({ success: false, message: `Method ${req.method} not allowed` });
  }
}
