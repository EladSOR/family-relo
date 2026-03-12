import Hero from "@/components/home/Hero";
import DestinationsGrid from "@/components/home/DestinationsGrid";
import citiesData from "@/data/cities.json";
import type { City } from "@/lib/types";

export default function Home() {
  return (
    <main className="min-h-screen bg-stone-50">
      <Hero />
      <DestinationsGrid cities={citiesData as City[]} />
    </main>
  );
}
