import Link from "next/link";
import Newsletter from "@/components/common/Newsletter";

export const metadata = {
  title: "Privacy Policy | SCENTORA",
  description:
    "Read SCENTORA Privacy Policy to understand how we collect, use, store, and protect customer information.",
};

const sections = [
  {
    title: "1. Information We Collect",
    blocks: [
      {
        heading: "Personal Information",
        items: [
          "Full name",
          "Phone number",
          "Email address",
          "Shipping and billing address",
          "Payment-related information",
        ],
      },
      {
        heading: "Non-Personal Information",
        items: [
          "Browser type and device information",
          "IP address",
          "Website usage data",
          "Cookies and analytics information",
        ],
      },
    ],
  },
  {
    title: "2. How We Use Your Information",
    content: ["SCENTORA uses your information to:"],
    items: [
      "Process and deliver your orders",
      "Provide customer support",
      "Improve website performance and user experience",
      "Send order updates and important notifications",
      "Prevent fraud and maintain website security",
      "Inform you about promotions, offers, or new products, if applicable",
    ],
  },
  {
    title: "3. Payment Security",
    content: [
      "We use secure payment methods and trusted payment providers to protect your transaction information.",
      "SCENTORA does not store sensitive payment card details on our servers.",
    ],
  },
  {
    title: "4. Cookies & Tracking Technologies",
    content: ["Our website may use cookies and similar technologies to:"],
    items: [
      "Improve website functionality",
      "Remember customer preferences",
      "Analyze website traffic and performance",
    ],
    note: "You may disable cookies through your browser settings, though some website features may not function properly.",
  },
  {
    title: "5. Sharing of Information",
    content: [
      "SCENTORA does not sell, rent, or trade your personal information to third parties.",
      "We may share limited information with trusted service providers only when necessary for:",
    ],
    items: [
      "Payment processing",
      "Order delivery",
      "Website hosting and maintenance",
      "Legal or regulatory requirements",
    ],
  },
  {
    title: "6. Data Protection",
    content: [
      "We implement reasonable security measures to protect your personal information against unauthorized access, misuse, or disclosure.",
      "However, no online system can guarantee complete security, and users share information at their own risk.",
    ],
  },
  {
    title: "7. Your Rights",
    content: ["You may request to:"],
    items: [
      "Access your personal information",
      "Correct inaccurate information",
      "Request deletion of your data where legally permitted",
      "Opt out of promotional communications",
    ],
    note: "To make such requests, please contact our support team.",
  },
  {
    title: "8. Third-Party Links",
    content: [
      "Our website may contain links to third-party websites or services. SCENTORA is not responsible for the privacy practices or content of external websites.",
    ],
  },
  {
    title: "9. Children's Privacy",
    content: [
      "SCENTORA does not knowingly collect personal information from individuals under the age of 18 without parental consent.",
    ],
  },
  {
    title: "10. Updates to This Policy",
    content: [
      "We may update this Privacy Policy from time to time to reflect changes in our services, legal requirements, or business practices.",
      "Updated versions will be posted on this page with immediate effect.",
    ],
  },
  {
    title: "11. Contact Us",
    content: [
      "If you have any questions regarding this Privacy Policy or how your information is handled, please contact SCENTORA through our official website or customer support channels.",
      "Thank you for trusting SCENTORA. Your privacy and confidence are important to us.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-[1300px] px-4 font-body">
      <section className="py-10 md:py-14">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
            Legal
          </p>
          <h1 className="mt-3 font-heading text-4xl font-semibold leading-tight text-textPrimary md:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-5 text-sm leading-7 text-textSecondary md:text-base">
            At SCENTORA, we value your privacy and are committed to protecting
            your personal information. This Privacy Policy explains how we
            collect, use, store, and protect your information when you use our
            website and services.
          </p>
          <p className="mt-4 text-sm leading-7 text-textSecondary md:text-base">
            By accessing or using the SCENTORA website, you agree to the terms
            outlined in this Privacy Policy.
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

              <div className="mt-4 space-y-4 text-sm leading-7 text-textSecondary">
                {section.content?.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}

                {section.blocks?.map((block) => (
                  <div key={block.heading}>
                    <h3 className="font-heading text-xl font-semibold text-textPrimary">
                      {block.heading}
                    </h3>
                    <ul className="mt-2 list-disc space-y-2 pl-5">
                      {block.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}

                {section.items ? (
                  <ul className="list-disc space-y-2 pl-5">
                    {section.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}

                {section.note ? <p>{section.note}</p> : null}

                {section.title === "11. Contact Us" ? (
                  <Link
                    href="/contact"
                    className="inline-flex text-sm font-semibold text-textPrimary underline-offset-4 hover:underline"
                  >
                    Contact SCENTORA
                  </Link>
                ) : null}
              </div>
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
