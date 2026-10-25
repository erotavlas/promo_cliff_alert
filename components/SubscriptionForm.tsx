"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CATEGORIES, type SubscriptionInput } from "@/lib/types";
import { validate, type FormErrors } from "@/lib/validate";
import { currentPrice, money } from "@/lib/pricing";

type Props = {
  initial?: SubscriptionInput;
  submitLabel: string;
  cancelHref: string;
  onSubmit: (input: SubscriptionInput) => Promise<void> | void;
};

const fieldClass =
  "w-full rounded-xl bg-card px-4 py-3 text-ink placeholder:text-muted outline-none focus:ring-2 focus:ring-muted";

function Label({ children }: { children: React.ReactNode }) {
  return <span className="mb-1 block text-sm text-muted">{children}</span>;
}

function Err({ message }: { message?: string }) {
  return message ? <p className="mt-1 text-sm text-bad">{message}</p> : null;
}

export default function SubscriptionForm({
  initial,
  submitLabel,
  cancelHref,
  onSubmit,
}: Props) {
  const startCustom =
    !!initial && !(CATEGORIES as readonly string[]).includes(initial.category);
  const [name, setName] = useState(initial?.name ?? "");
  const [category, setCategory] = useState<string>(
    startCustom ? "custom" : (initial?.category ?? CATEGORIES[0]),
  );
  const [customCategory, setCustomCategory] = useState(
    startCustom ? initial!.category : "",
  );
  const [planText, setPlanText] = useState(initial?.planText ?? "");
  const [contact, setContact] = useState(initial?.contact ?? "");
  const [startDate, setStartDate] = useState(initial?.startDate ?? "");
  const [isContract, setIsContract] = useState(initial?.isContract ?? false);
  const [contractMonths, setContractMonths] = useState(
    String(initial?.contractMonths ?? 24),
  );
  const [fullPrice, setFullPrice] = useState(String(initial?.fullPrice ?? ""));
  const [discount, setDiscount] = useState(String(initial?.discount ?? "0"));
  const [promoEndDate, setPromoEndDate] = useState(initial?.promoEndDate ?? "");
  // Today's date is filled in after mount; reading the clock during prerender fails the build.
  useEffect(() => {
    setStartDate((d) => d || new Date().toLocaleDateString("en-CA")); // YYYY-MM-DD, local time
  }, []);
  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);

  const full = parseFloat(fullPrice);
  const disc = parseFloat(discount);
  const preview =
    Number.isFinite(full) && Number.isFinite(disc) && disc <= full
      ? `Pays ${money(currentPrice({ fullPrice: full, discount: disc }))} now, ${money(full)} after the promo`
      : null;

  async function submit(ev: React.FormEvent) {
    ev.preventDefault();
    const finalCategory = category === "custom" ? customCategory.trim() : category;
    const input: SubscriptionInput = {
      name: name.trim(),
      category: finalCategory,
      customCategory: category === "custom" ? finalCategory : undefined,
      planText: planText.trim(),
      planFeatures: initial?.planFeatures ?? [],
      logoDomain: initial?.logoDomain,
      contact: contact.trim(),
      startDate,
      isContract,
      contractMonths: isContract ? parseInt(contractMonths, 10) : undefined,
      fullPrice: full,
      discount: disc,
      promoEndDate,
    };
    const errs = validate(input);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setSaving(true);
    try {
      await onSubmit(input);
    } catch (err) {
      setErrors({
        form: err instanceof Error ? err.message : "Something went wrong.",
      });
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-4 pb-8">
      <label className="block">
        <Label>Name</Label>
        <input
          className={fieldClass}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Bell Internet"
        />
        <Err message={errors.name} />
      </label>

      <label className="block">
        <Label>Category</Label>
        <select
          className={fieldClass}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
          <option value="custom">Custom…</option>
        </select>
      </label>
      {category === "custom" && (
        <label className="block">
          <Label>Your category</Label>
          <input
            className={fieldClass}
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
          />
          <Err message={errors.customCategory} />
        </label>
      )}

      <label className="block">
        <Label>Plan, in your own words</Label>
        <textarea
          className={fieldClass}
          rows={3}
          value={planText}
          onChange={(e) => setPlanText(e.target.value)}
          placeholder="1.5 Gbps fibre, unlimited data, Wi-Fi 6 modem"
        />
      </label>

      <label className="block">
        <Label>Contact (phone or email), required</Label>
        <input
          className={fieldClass}
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          placeholder="1-888-555-0100 or help@provider.com"
        />
        <Err message={errors.contact} />
      </label>

      <label className="block">
        <Label>Start date</Label>
        <input
          type="date"
          className={fieldClass}
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <Err message={errors.startDate} />
      </label>

      <label className="flex items-center gap-3 rounded-xl bg-card px-4 py-3">
        <input
          type="checkbox"
          checked={isContract}
          onChange={(e) => setIsContract(e.target.checked)}
          className="h-5 w-5"
        />
        <span>This is a contract</span>
      </label>
      {isContract && (
        <label className="block">
          <Label>Contract length (months)</Label>
          <input
            type="number"
            min={1}
            className={fieldClass}
            value={contractMonths}
            onChange={(e) => setContractMonths(e.target.value)}
          />
          <Err message={errors.contractMonths} />
        </label>
      )}

      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <Label>Full price / month</Label>
          <input
            type="number"
            min={0}
            step="0.01"
            inputMode="decimal"
            className={fieldClass}
            value={fullPrice}
            onChange={(e) => setFullPrice(e.target.value)}
            placeholder="60"
          />
          <Err message={errors.fullPrice} />
        </label>
        <label className="block">
          <Label>Discount / month</Label>
          <input
            type="number"
            min={0}
            step="0.01"
            inputMode="decimal"
            className={fieldClass}
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
          />
          <Err message={errors.discount} />
        </label>
      </div>
      {preview && <p className="text-sm text-muted">{preview}</p>}

      <label className="block">
        <Label>Promo end date</Label>
        <input
          type="date"
          className={fieldClass}
          value={promoEndDate}
          onChange={(e) => setPromoEndDate(e.target.value)}
        />
        <Err message={errors.promoEndDate} />
      </label>

      {errors.form && <p className="text-sm text-bad">{errors.form}</p>}
      <div className="flex gap-3">
        <Link
          href={cancelHref}
          className="flex-1 rounded-xl bg-card py-3 text-center font-semibold text-ink"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={saving}
          className="flex-1 rounded-xl bg-ink py-3 font-semibold text-page disabled:opacity-60"
        >
          {saving ? "Saving…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
