// Phone numbers open the dialer, emails open the mail app.
export default function ContactLink({ contact }: { contact: string }) {
  const isEmail = contact.includes("@");
  const href = isEmail ? `mailto:${contact}` : `tel:${contact.replace(/[^\d+]/g, "")}`;
  return (
    <a href={href} className="font-semibold underline underline-offset-4">
      {contact}
    </a>
  );
}
