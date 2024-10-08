import { Suspense } from "react";
import EmptyState from "@/components/empty";
import { getCurrentUser } from "@/lib/actions/getcurrentuser";
import FavoritesClient from "./favoritesclient";
import { getfavoriteListing } from "@/lib/actions/listingactions";
export const dynamic = "force-dynamic";

const FavoritesContent = async () => {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return <EmptyState title="Unauthorized" subtitle="Please login first" />;
  }

  const favoritelisting = await getfavoriteListing();

  if (favoritelisting.length === 0) {
    return (
      <EmptyState
        title="No favorites found"
        subtitle="Looks like you have no favorite listings."
      />
    );
  }

  return (
    <FavoritesClient listing={favoritelisting} currentUser={currentUser} />
  );
};

const FavoritesPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FavoritesContent />
    </Suspense>
  );
};

export default FavoritesPage;
