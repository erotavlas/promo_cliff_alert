import { Suspense } from "react";
import NegotiateView from "@/components/NegotiateView";

export default function NegotiatePage() {
  return (
    <Suspense>
      <NegotiateView />
    </Suspense>
  );
}
