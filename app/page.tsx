import Header from "@/components/Header";
import TripCard from "@/components/TripCard";
import { getSortedTripsData } from "@/lib/trips";

export default function Home() {
  const trips = getSortedTripsData();

  return (
    <>
      <Header isHome />
      <main className="max-w-2xl mx-auto">
        <div className="flex flex-col gap-8">
          {trips.length === 0 ? (
            <p>No trips yet. Create your first trip in content/trips/</p>
          ) : (
            trips.map((trip) => (
              <TripCard key={trip.slug} {...trip} />
            ))
          )}
        </div>
      </main>
    </>
  );
}
