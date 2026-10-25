import { generateScript } from "@/lib/llm";
import { ScriptRequestSchema } from "@/lib/scriptTypes";

export async function POST(request: Request) {
  const parsed = ScriptRequestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }
  try {
    const script = await generateScript(parsed.data);
    return Response.json(script);
  } catch {
    // Details stay out of the response and logs (the request carries personal subscription info).
    return Response.json({ error: "Script generation failed" }, { status: 502 });
  }
}
