import { Suspense } from "react";
import DetailView from "@/components/DetailView";

// useParams needs a Suspense boundary under Next's prerendering rules.
export default function DetailPage() {
  return (
    <Suspense>
      <DetailView />
    </Suspense>
  );
}
