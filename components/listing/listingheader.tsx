import useCountries from "@/app/hooks/useCountries";
import { Listing, User } from "@prisma/client";
import React from "react";
import Image from "next/image";
import Heading from "../heading";
import HeartButton from "../heartbutton";

interface ListingHeaderProps {
  listing: Listing;
  currentUser?: User | null;
}

const ListingHeader = ({ listing, currentUser }: ListingHeaderProps) => {
  const { getByValue } = useCountries();
  const location = getByValue(listing.locationValue);

  return (
    <>
      <Heading
        title={listing.title}
        subtitle={`${location?.label}, ${location?.region}`}
      />

      <div className="relative w-full h-[60vh] overflow-hidden rounded-xl shadow-lg">
        <Image
          src={listing.imageSrc}
          fill
          className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
          alt={listing.title}
        />

        <div className="absolute top-5 right-5">
          <HeartButton listingId={listing.id} currentUser={currentUser} />
        </div>
      </div>
    </>
  );
};

export default ListingHeader;
