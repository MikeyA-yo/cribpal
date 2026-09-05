import Explore from "@/components/students/explore";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F9FBFF] flex items-center justify-center text-darkBlue font-semibold">Loading CribPal Hostels...</div>}>
      <Explore />
    </Suspense>
  );
}