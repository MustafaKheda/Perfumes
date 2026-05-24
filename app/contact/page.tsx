import {
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import Newsletter from "@/components/common/Newsletter";
import ContactForm from "./ui/contact-form";

export const metadata = {
  title: "Contact SCENTORA | Perfume Store Kuwait",
  description:
    "Contact SCENTORA for perfume orders, fragrance guidance, support, and customer care in Kuwait.",
};

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-[1300px] px-4 font-body">
      <section className="py-10 md:py-14">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
              Contact Us
            </p>
            <h1 className="mt-3 font-heading text-4xl font-semibold leading-tight text-textPrimary md:text-5xl">
              We are here to help you find your signature scent.
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-textSecondary md:text-base">
              Reach out for order support, perfume recommendations, product
              questions, or help choosing a gift. SCENTORA customer care is ready
              to assist fragrance lovers across Kuwait and beyond.
            </p>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-lg border border-black/10 bg-white/80 p-6 shadow-card">
              <h2 className="font-heading text-2xl font-semibold">
                Quick Contact
              </h2>
              <div className="mt-5 space-y-4 text-sm text-textSecondary">
                <ContactLink
                  href="tel:+96500000000"
                  icon={<Phone className="h-5 w-5" aria-hidden="true" />}
                  label="Phone"
                  value="+965 0000 0000"
                />
                <ContactLink
                  href="mailto:support@scentora.com"
                  icon={<Mail className="h-5 w-5" aria-hidden="true" />}
                  label="Email"
                  value="support@scentora.com"
                />
                <ContactLink
                  href="https://wa.me/96500000000"
                  icon={<MessageCircle className="h-5 w-5" aria-hidden="true" />}
                  label="WhatsApp"
                  value="Chat with SCENTORA"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-12 md:pb-16">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="space-y-5">
              <InfoBlock
                icon={<MapPin className="h-5 w-5" aria-hidden="true" />}
                title="Location"
                text="Kuwait"
              />
              <InfoBlock
                icon={<Clock className="h-5 w-5" aria-hidden="true" />}
                title="Customer Care Hours"
                text="Saturday to Thursday, 10:00 AM - 8:00 PM"
              />
              <InfoBlock
                icon={<Send className="h-5 w-5" aria-hidden="true" />}
                title="Support"
                text="For order updates, fragrance advice, product details, and online shopping help."
              />
            </div>
          </div>

          <div className="lg:col-span-7">
            <ContactForm />
          </div>
        </div>
      </section>

      <section className="pb-14 md:pb-20">
        <Newsletter />
      </section>
    </main>
  );
}

function ContactLink({
  href,
  icon,
  label,
  value,
}: {
  href: string;
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-lg border border-black/10 p-3 transition hover:bg-black/5"
    >
      <span className="grid h-10 w-10 place-items-center rounded-full bg-textPrimary text-white">
        {icon}
      </span>
      <span>
        <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-textSecondary">
          {label}
        </span>
        <span className="mt-1 block font-medium text-textPrimary">{value}</span>
      </span>
    </Link>
  );
}

function InfoBlock({
  icon,
  title,
  text,
}: {
  icon: ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-4 rounded-lg border border-black/10 bg-white/80 p-5 shadow-card">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-accentLight/30 text-textPrimary">
        {icon}
      </span>
      <div>
        <h2 className="font-heading text-xl font-semibold">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-textSecondary">{text}</p>
      </div>
    </div>
  );
}
