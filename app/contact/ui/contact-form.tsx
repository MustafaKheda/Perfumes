"use client";

import { type FormEvent, useState } from "react";
import { Send } from "lucide-react";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

export default function ContactForm() {
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{
    tone: "error" | "success";
    message: string;
  } | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setStatus(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const body = (await response.json().catch(() => null)) as
        | { error?: string; message?: string }
        | null;

      if (!response.ok || body?.error) {
        throw new Error(body?.error || "Unable to send your message");
      }

      setForm(emptyForm);
      setStatus({
        tone: "success",
        message: "Thank you. Your message has been sent to SCENTORA.",
      });
    } catch (error) {
      setStatus({
        tone: "error",
        message:
          error instanceof Error ? error.message : "Unable to send your message",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      className="rounded-lg border border-black/10 bg-white/80 p-6 shadow-card"
      onSubmit={onSubmit}
    >
      <h2 className="font-heading text-2xl font-semibold">Send a Message</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field
          label="Name"
          name="name"
          type="text"
          value={form.name}
          onChange={(value) => setForm((prev) => ({ ...prev, name: value }))}
          required
        />
        <Field
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={(value) => setForm((prev) => ({ ...prev, email: value }))}
          required
        />
        <Field
          label="Phone"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={(value) => setForm((prev) => ({ ...prev, phone: value }))}
        />
        <Field
          label="Subject"
          name="subject"
          type="text"
          value={form.subject}
          onChange={(value) => setForm((prev) => ({ ...prev, subject: value }))}
          required
        />
      </div>
      <label className="mt-4 block">
        <span className="mb-2 block text-sm font-medium">Message</span>
        <textarea
          name="message"
          rows={6}
          value={form.message}
          required
          onChange={(event) =>
            setForm((prev) => ({ ...prev, message: event.target.value }))
          }
          className="w-full rounded-lg border border-black/15 bg-white px-3 py-3 text-sm outline-none focus:border-black focus:ring-2 focus:ring-black/10"
        />
      </label>

      {status ? (
        <p
          className={`mt-4 rounded-lg border px-3 py-2 text-sm ${
            status.tone === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {status.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-textPrimary px-5 text-sm font-semibold text-white transition hover:bg-textPrimary/85 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Send className="h-4 w-4" aria-hidden="true" />
        {submitting ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type,
  value,
  onChange,
  required,
}: {
  label: string;
  name: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium">{label}</span>
      <input
        name={name}
        type={type}
        value={value}
        required={required}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-11 w-full rounded-lg border border-black/15 bg-white px-3 text-sm outline-none focus:border-black focus:ring-2 focus:ring-black/10"
      />
    </label>
  );
}
