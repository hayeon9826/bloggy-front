import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";

type Data = {
  success?: boolean;
  message?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method === "POST") {
    let object;
    const { title, content, email, summary } = req.body;
    const user = await prisma.user.findFirst({
      where: { email: email },
    });

    if (user) {
      object = await prisma["post"].create({
        data: {
          title: title,
          content: content,
          summary: summary,
          userId: user?.id,
        },
      });
    }

    res.json(object);
  } else if (req.method === "PUT") {
    const { title, content, id, summary } = req.body;
    const object = await prisma.post.update({
      where: { id },
      data: {
        title,
        content,
        summary,
      },
    });
    return res.json(object);
  } else if (req.method === "DELETE") {
    const { id } = req.query;
    const object = await prisma.post.delete({ where: { id } });
    return res.json(object);
  } else {
    const { id, email, limit = "10", page, q }: any = req.query;
    const where = JSON.parse((req.query.where as any) || "{}");
    let user;

    if (email) {
      user = await prisma.user.findFirst({
        where: { email: email },
      });
    }

    const count = await prisma.post.count({ where });

    const postWhereClause = {
      ...where,
      id: id ? id : undefined, // Corrected: Use undefined instead of {} for optional fields
      userId: email ? user?.id || undefined : undefined,
      ...(q && {
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { content: { contains: q, mode: "insensitive" } },
          { summary: { contains: q, mode: "insensitive" } },
        ],
      }),
    };

    const objects = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      where: postWhereClause,
      skip: page === undefined ? 0 : parseInt(page) * parseInt(limit),
      take: parseInt(limit),
      include: { user: true },
    });

    if (page) {
      return res.json({
        page: parseInt(page),
        objects,
        total_pages: Math.ceil(count / limit),
        total_count: count,
      });
    }

    return res.json(id ? objects[0] : objects);
  }
}
