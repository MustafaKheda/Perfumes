import Link from "next/link";
import Newsletter from "@/components/common/Newsletter";

export const metadata = {
  title: "Terms of Service | SCENTORA",
  description:
    "Read SCENTORA Terms of Service for website use, products, orders, payments, shipping, returns, privacy, and customer responsibilities.",
};

const sections = [
  {
    title: "1. General Information",
    content: [
      "SCENTORA is an online perfume and fragrance store based in Kuwait, serving customers with premium fragrances since 2000.",
      "By using our website, you confirm that you are at least 18 years old or using the website under the supervision of a parent or legal guardian.",
    ],
  },
  {
    title: "2. Products & Availability",
    content: [
      "All products displayed on our website are subject to availability.",
      "We reserve the right to limit quantities, discontinue products, or update product information without prior notice.",
      "We make every effort to display product descriptions, images, and pricing accurately; however, slight variations may occur.",
    ],
  },
  {
    title: "3. Pricing & Payments",
    content: [
      "All prices listed on the website are in the applicable currency and include applicable taxes unless stated otherwise.",
      "Payments must be completed using approved payment methods available during checkout.",
      "SCENTORA reserves the right to cancel any order in case of pricing errors, suspected fraud, or payment issues.",
    ],
  },
  {
    title: "4. Orders & Confirmation",
    content: [
      "After placing an order, you will receive an order confirmation.",
      "Order confirmation does not guarantee acceptance of the order.",
      "We reserve the right to refuse or cancel orders for any reason, including product availability or incorrect information.",
    ],
  },
  {
    title: "5. Shipping & Delivery",
    content: [
      "Delivery times are estimated and may vary depending on location and courier services.",
      "Customers are responsible for providing accurate shipping information.",
      "SCENTORA is not liable for delays caused by third-party shipping providers or unforeseen circumstances.",
      "Please review our Shipping & Returns Policy for more information.",
    ],
  },
  {
    title: "6. Returns & Exchanges",
    content: [
      "Due to hygiene and safety reasons, perfumes and fragrance products may only be returned or exchanged under specific conditions.",
      "Returns are accepted only for damaged, defective, or incorrect products according to our Returns Policy.",
    ],
  },
  {
    title: "7. User Responsibilities",
    content: [
      "By using our website, you agree not to misuse or interfere with the website's functionality.",
      "You agree not to use false information or engage in fraudulent activity.",
      "You agree not to copy, distribute, or exploit website content without permission.",
    ],
  },
  {
    title: "8. Intellectual Property",
    content: [
      "All content on the SCENTORA website, including logos, images, text, graphics, and branding, is the property of SCENTORA and protected under applicable intellectual property laws.",
      "Unauthorized use or reproduction is prohibited.",
    ],
  },
  {
    title: "9. Privacy",
    content: [
      "Your personal information is handled according to our Privacy Policy. By using our website, you consent to the collection and use of information as described in the policy.",
    ],
  },
  {
    title: "10. Limitation of Liability",
    content: [
      "SCENTORA shall not be held responsible for indirect or incidental damages resulting from the use of our website or products.",
      "SCENTORA shall not be held responsible for delays, interruptions, or technical issues beyond our control.",
      "SCENTORA shall not be held responsible for allergic reactions or sensitivities to fragrance ingredients. Customers are encouraged to review product details before purchase.",
    ],
  },
  {
    title: "11. Modifications to Terms",
    content: [
      "SCENTORA reserves the right to update or modify these Terms of Service at any time without prior notice. Continued use of the website after changes indicates acceptance of the updated terms.",
    ],
  },
  {
    title: "12. Governing Law",
    content: [
      "These Terms of Service shall be governed and interpreted in accordance with the laws and regulations of Kuwait.",
    ],
  },
  {
    title: "13. Contact Information",
    content: [
      "For any questions regarding these Terms of Service, please contact SCENTORA through our official website or customer support channels.",
      "Thank you for choosing SCENTORA.",
    ],
  },
];

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-[1300px] px-4 font-body">
      <section className="py-10 md:py-14">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
            Legal
          </p>
          <h1 className="mt-3 font-heading text-4xl font-semibold leading-tight text-textPrimary md:text-5xl">
            Terms of Service
          </h1>
          <p className="mt-5 text-sm leading-7 text-textSecondary md:text-base">
            Welcome to SCENTORA. By accessing or using our website, products,
            and services, you agree to comply with and be bound by the following
            Terms of Service. Please read them carefully before using our
            website.
          </p>
        </div>
      </section>

      <section className="pb-14 md:pb-20">
        <div className="space-y-5">
          {sections.map((section) => (
            <article
              key={section.title}
              className="rounded-lg border border-black/10 bg-white/80 p-6 shadow-card"
            >
              <h2 className="font-heading text-2xl font-semibold text-textPrimary">
                {section.title}
              </h2>
              <div className="mt-4 space-y-3 text-sm leading-7 text-textSecondary">
                {section.content.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              {section.title === "5. Shipping & Delivery" ? (
                <Link
                  href="/shipping-returns"
                  className="mt-4 inline-flex text-sm font-semibold text-textPrimary underline-offset-4 hover:underline"
                >
                  View Shipping & Returns Policy
                </Link>
              ) : null}
              {section.title === "13. Contact Information" ? (
                <Link
                  href="/contact"
                  className="mt-4 inline-flex text-sm font-semibold text-textPrimary underline-offset-4 hover:underline"
                >
                  Contact SCENTORA
                </Link>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <section className="pb-14 md:pb-20">
        <Newsletter />
      </section>
    </main>
  );
}
