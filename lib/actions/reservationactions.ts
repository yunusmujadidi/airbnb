"use server";

import { getCurrentUser } from "./getcurrentuser";
import prisma from "../prisma";
import { revalidatePath } from "next/cache";

interface ReservationInput {
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  listingId: string;
  userId: string;
}

interface IParams {
  listingId?: string;
  userId?: string;
  authorId?: string;
}

export async function deleteReservation(reservationId: string) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      throw new Error("Unauthorized");
    }

    const reservation = await prisma.reservation.deleteMany({
      where: {
        id: reservationId,
        OR: [
          { userId: currentUser.id },
          { listing: { userId: currentUser.id } },
        ],
      },
    });

    revalidatePath("/trips");
    return { success: true };
  } catch (error) {
    console.error("Error deleting reservation:", error);
    return { success: false, error: "Failed to delete reservation" };
  }
}

export const createReservation = async (reservation: ReservationInput) => {
  if (
    !reservation.startDate ||
    !reservation.endDate ||
    !reservation.totalPrice ||
    !reservation.listingId
  ) {
    throw new Error("Invalid reservation data");
  }
  try {
    const listingandreservation = await prisma.listing.update({
      where: {
        id: reservation.listingId,
      },
      data: {
        reservation: {
          create: {
            userId: reservation.userId,
            startDate: reservation.startDate,
            endDate: reservation.endDate,
            totalPrice: reservation.totalPrice,
          },
        },
      },
    });
    return listingandreservation;
  } catch (error) {
    console.error("Error details:", error);
    throw new Error("Failed to create a reservation ");
  }
};

export async function getReservations(params: IParams) {
  try {
    const { listingId, userId, authorId } = params;
    const query: any = {};
    if (listingId) {
      query.listingId = listingId;
    }
    if (userId) {
      query.userId = userId;
    }
    if (authorId) {
      query.listing = { userId: authorId };
    }

    const reservations = await prisma.reservation.findMany({
      where: query,
      include: {
        listing: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return reservations;
  } catch (error) {
    throw new Error(error as string);
  }
}
