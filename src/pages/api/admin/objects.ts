import prisma from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { where } = req.query;
  let objects;
  if (req.method === "GET") {
    const { model, id, limit = "30", page }: any = req.query;
    if (model === "models") {
      const objects = prisma._dmmf.datamodel.models.map((modelInfo: any) => ({
        name: modelInfo.name,
        fields: modelInfo.fields,
      }));

      return res.json(objects);
    }
    const where = JSON.parse((req.query.where as any) || "{}");

    const count = await prisma[model]?.count({
      where,
    });

    if (model !== undefined) {
      console.log(model);
      objects = await prisma[model].findMany({
        where: { ...where, id: id || {} },
        orderBy: JSON.parse((req.query.orderBy as string) || "{}"),
        include: JSON.parse((req.query.include as string) || "null"),
        skip: page === undefined ? 0 : parseInt(page) * parseInt(limit),
        take: parseInt(limit),
      });
    }

    if (id) {
      return res.json(objects[0]);
    }

    if (page) {
      return res.json({
        page: parseInt(page),
        objects,
        total_pages: Math.ceil(count / limit),
        total_count: count,
      });
    }
    return res.json(objects);
  } else if (req.method === "DELETE") {
    const { model, id }: any = req.query;
    const ids = req.query["ids[]"];
    if (id) {
      await prisma[model].delete({ where: { id } });
    } else if (ids) {
      await prisma[model].deleteMany({
        where: { id: { in: ids } },
      });
    }
    return res.json({});
  }
}
