import prisma from "@/lib/prisma";

export const getCurrentUser = async (req: any) => {
  try {
    const user = await prisma.user.findFirst({
      where: { email: req.email },
    });
    return { id: user?.id };
  } catch (e) {
    return null;
  }
};
