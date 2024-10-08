import { auth } from "@/auth";
import prisma from "../prisma";

export const getCurrentUser = async () => {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return null;
    }
    const currentUser = await prisma.user.findUnique({
      where: {
        email: session.user.email as string,
      },
    });

    return currentUser;
  } catch (error) {
    return null;
  }
};
