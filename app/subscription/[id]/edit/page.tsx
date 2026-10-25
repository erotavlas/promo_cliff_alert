import { Suspense } from "react";
import EditView from "@/components/EditView";

export default function EditPage() {
  return (
    <Suspense>
      <EditView />
    </Suspense>
  );
}
