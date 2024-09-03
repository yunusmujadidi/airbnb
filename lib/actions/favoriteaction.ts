"use server";

import prisma from "../prisma";
import { getCurrentUser } from "./getcurrentuser";

export async function toggleFavorite(
  listingId: string,
  userId: string
): Promise<{ success: boolean; isFavorite?: boolean; error?: string }> {
  try {
    const user = await getCurrentUser();

    if (!user) throw new Error("User not found");

    const isFavorite = user.favoriteIds.includes(listingId);

    if (isFavorite) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          favoriteIds: {
            set: user.favoriteIds.filter((id) => id !== listingId),
          },
        },
      });
    } else {
      await prisma.user.update({
        where: { id: userId },
        data: { favoriteIds: { push: listingId } },
      });
    }

    return { success: true, isFavorite: !isFavorite };
  } catch (error) {
    console.error("Error toggling favorite:", error);
    return { success: false, error: "Failed to toggle favorite" };
  } finally {
    await prisma.$disconnect();
  }
}

export async function getFavoriteListings(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { favoriteIds: true },
    });

    if (!user) throw new Error("User not found");

    const favoriteListings = await prisma.listing.findMany({
      where: {
        id: { in: user.favoriteIds },
      },
    });

    return favoriteListings;
  } catch (error) {
    console.error("Error getting favorite listings:", error);
    return [];
  }
}
