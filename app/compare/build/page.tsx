import { Suspense } from "react";
import CompareBuildClient from "@/components/compare/CompareBuildClient";

export const metadata = {
  title: "Build Your City Comparison",
  robots: { index: false },
};

export default function CompareBuildPage() {
  return (
    <Suspense fallback={null}>
      <CompareBuildClient />
    </Suspense>
  );
}
