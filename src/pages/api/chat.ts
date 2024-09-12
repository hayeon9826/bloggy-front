import { PromptPrefix, PromptType } from "@/interface";
import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
import prisma from "@/lib/prisma";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPEN_AI_ORGANIZATION_KEY,
  project: process.env.OPEN_AI_PROJECT_ID,
});

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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    try {
      const { email, prompt, type }: RequestData = req.body;

      // Fetch the current user from the database
      const currentUser = await prisma.user.findFirst({
        where: { email },
      });

      if (!currentUser) {
        return res.status(404).json({ message: "User not found." });
      }

      // Make a request to the OpenAI API using the gpt-4o-mini model
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: `${PromptPrefix[type]}${prompt}`,
          },
        ],
        temperature: 0.7,
      });

      const title = response.choices[0]?.message?.content?.trim();

      if (!title) {
        return res.status(500).json({ message: "Failed to generate title." });
      }

      // Create a chat record in the database
      const object = await prisma.chat.create({
        data: {
          userId: currentUser.id,
          title,
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
    try {
      const { id, email } = req.query;

      let user;

      if (email) {
        user = await prisma.user.findFirst({
          where: { email: String(email) },
        });

        if (!user) {
          return res.status(404).json({ message: "User not found." });
        }
      }

      const objects = await prisma.chat.findMany({
        orderBy: { createdAt: "desc" },
        where: {
          ...(id && { id: String(id) }),
          ...(email && { userId: user?.id }),
        },
        include: { user: true, messages: true },
      });

      res.status(200).json(id ? objects[0] : objects);
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
