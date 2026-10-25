"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import BrandIcon from "@/components/BrandIcon";
import ContactLink from "@/components/ContactLink";
import negotiations from "@/data/negotiations.json";
import { currentPrice, money, newPrice } from "@/lib/pricing";
import { useSubscriptions } from "@/lib/storage";
import { templateScript } from "@/lib/templateScript";
import { ScriptSchema, type Script, type ScriptRequest } from "@/lib/scriptTypes";
import type { NegotiationResult, Subscription } from "@/lib/types";

function buildRequest(
  sub: Subscription,
  resultId: string | null,
  tweak?: string,
  previousScript?: Script,
): ScriptRequest {
  const result = (negotiations as NegotiationResult[]).find((r) => r.id === resultId);
  return {
    subscription: {
      name: sub.name,
      category: sub.category,
      planText: sub.planText,
      planFeatures: sub.planFeatures,
      fullPrice: sub.fullPrice,
      discount: sub.discount,
      promoEndDate: sub.promoEndDate,
      startDate: sub.startDate,
    },
    target: result
      ? {
          price: result.finalPrice,
          source: "result",
          result: {
            provider: result.provider,
            username: result.username,
            startPrice: result.startPrice,
            finalPrice: result.finalPrice,
          },
        }
      : { price: currentPrice(sub), source: "current-promo" },
    tweak: tweak || undefined,
    previousScript,
  };
}

export default function ScriptView() {
  const { id } = useParams<{ id: string }>();
  const resultId = useSearchParams().get("result");
  const { subscriptions, loaded } = useSubscriptions();
  const sub = subscriptions.find((s) => s.id === id);

  const [script, setScript] = useState<Script | null>(null);
  const [isTemplate, setIsTemplate] = useState(false);
  const [busy, setBusy] = useState(false);
  const [tweak, setTweak] = useState("");
  const started = useRef(false);

  const generate = useCallback(
    async (s: Subscription, instruction?: string, previous?: Script | null) => {
      setBusy(true);
      const req = buildRequest(s, resultId, instruction, previous ?? undefined);
      try {
        const res = await fetch("/api/script", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(req),
        });
        if (!res.ok) throw new Error(String(res.status));
        setScript(ScriptSchema.parse(await res.json()));
        setIsTemplate(false);
      } catch {
        setScript(templateScript(req));
        setIsTemplate(true);
      } finally {
        setBusy(false);
      }
    },
    [resultId],
  );

  useEffect(() => {
    if (!sub || started.current) return;
    started.current = true;
    void generate(sub);
  }, [sub, generate]);

  if (!loaded) return null;
  if (!sub)
    return (
      <div className="mt-16 text-center">
        <p>Subscription not found.</p>
        <Link href="/" className="mt-3 inline-block text-muted underline">
          Back to your list
        </Link>
      </div>
    );

  const result = (negotiations as NegotiationResult[]).find((r) => r.id === resultId);
  const target = result ? result.finalPrice : currentPrice(sub);

  return (
    <div className="space-y-5 pb-8">
      <Link href={`/subscription/${sub.id}/negotiate`} className="text-sm text-muted">
        ← Back
      </Link>

      <section className="rounded-2xl bg-card p-4">
        <div className="text-xs uppercase tracking-wide text-muted">Call</div>
        <div className="mt-1 text-xl">
          <ContactLink contact={sub.contact} />
        </div>
        <div className="mt-4 flex items-center gap-3">
          <BrandIcon name={sub.name} />
          <div className="min-w-0 flex-1">
            <div className="truncate font-semibold">{sub.name}</div>
            <div className="text-xs text-muted">
              Now {money(currentPrice(sub))} · after promo {money(newPrice(sub))} · ends{" "}
              {sub.promoEndDate}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted">Ask for</div>
            <div className="text-xl font-bold text-good">{money(target)}</div>
          </div>
        </div>
      </section>

      {isTemplate && (
        <p className="rounded-xl bg-card px-4 py-3 text-sm text-muted">
          The AI version isn&apos;t available right now, so this is a plain template
          with your details filled in.
        </p>
      )}

      {busy && !script ? (
        <p className="py-8 text-center text-muted">Writing your script…</p>
      ) : (
        <div className={`space-y-3 ${busy ? "opacity-50" : ""}`}>
          {script?.sections.map((section) => (
            <section key={section.title} className="rounded-2xl bg-card p-4">
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted">
                {section.title}
              </h2>
              <p className="whitespace-pre-line leading-relaxed">{section.body}</p>
            </section>
          ))}
        </div>
      )}

      <div className="space-y-3">
        <button
          disabled={busy}
          onClick={() => generate(sub, undefined, script)}
          className="w-full rounded-xl bg-card py-3 font-semibold disabled:opacity-60"
        >
          Regenerate
        </button>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (tweak.trim()) void generate(sub, tweak.trim(), script);
          }}
          className="flex gap-2"
        >
          <input
            value={tweak}
            onChange={(e) => setTweak(e.target.value)}
            maxLength={500}
            placeholder="Tweak it: more aggressive, more polite…"
            className="min-w-0 flex-1 rounded-xl bg-card px-4 py-3 text-ink placeholder:text-muted outline-none focus:ring-2 focus:ring-muted"
          />
          <button
            type="submit"
            disabled={busy || !tweak.trim()}
            className="rounded-xl bg-ink px-5 font-semibold text-page disabled:opacity-60"
          >
            Apply
          </button>
        </form>
      </div>
    </div>
  );
}
