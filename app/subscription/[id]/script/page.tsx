import { Suspense } from "react";
import ScriptView from "@/components/ScriptView";

export default function ScriptPage() {
  return (
    <Suspense>
      <ScriptView />
    </Suspense>
  );
}
