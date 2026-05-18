import { Suspense } from "react";
import SingleCityBuildClient from "@/components/single-city/SingleCityBuildClient";

export const metadata = {
  title: "Build Your Single-City Report",
  robots: { index: false },
};

export default function SingleCityBuildPage() {
  return (
    <Suspense fallback={null}>
      <SingleCityBuildClient />
    </Suspense>
  );
}
