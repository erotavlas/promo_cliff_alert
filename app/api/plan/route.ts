import { structurePlan } from "@/lib/llm";
import { PlanRequestSchema } from "@/lib/planTypes";

export async function POST(request: Request) {
  const parsed = PlanRequestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }
  try {
    return Response.json(await structurePlan(parsed.data));
  } catch {
    return Response.json({ error: "Plan structuring failed" }, { status: 502 });
  }
}
