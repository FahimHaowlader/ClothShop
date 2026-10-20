import React from "react";

/* ------------------------------------------------------------------ */
/*  Privacy Policy page. One file, text only.                          */
/*  Layout: a contents list on the left (sticky on desktop) and the    */
/*  policy on the right.                                               */
/*                                                                     */
/*  IMPORTANT: this is a starting template, not legal advice.          */
/*  Edit every line marked EDIT so it matches what your store really   */
/*  does, and have it reviewed before publishing.                      */
/* ------------------------------------------------------------------ */

/* EDIT: your real contact details (there is no contact page, so give an email or social link) */
const CONTACT_EMAIL = "your-email@example.com";
const LAST_UPDATED = "21 October 2026";

/* Each section: id for the contents links, a title, and blocks.
   A block is { p: "paragraph" } or { list: ["item", ...] } */
const SECTIONS = [
  {
    id: "overview",
    title: "Overview",
    blocks: [
      {
        p: "This policy explains what personal information BachelorShop collects when you browse or order from our website, why we collect it, and the choices you have. By using the site you agree to the practices described here.",
      },
    ],
  },
  {
    id: "collect",
    title: "What we collect",
    blocks: [
      { p: "We collect only what we need to run the store:" },
      {
        list: [
          "Order details: your name, phone number, email address and delivery address.",
          "What you ordered, including sizes, quantities and order history.",
          "Messages you send us, for example about an exchange.",
          "Basic technical data such as your device type, browser and pages visited.",
        ],
      },
      /* EDIT: only keep this line if it is true for your payment setup */
      {
        p: "We do not store your card or mobile banking details. Payments are handled by our payment provider.",
      },
    ],
  },
  {
    id: "use",
    title: "How we use it",
    blocks: [
      {
        list: [
          "To process, pack and deliver your order.",
          "To contact you about your order, delivery or an exchange.",
          "To improve the site, our sizing and our collections.",
          "To keep the store secure and prevent fraud.",
        ],
      },
      {
        p: "We do not sell your personal information.",
      },
    ],
  },
  {
    id: "share",
    title: "Who we share it with",
    blocks: [
      {
        p: "We share information only with the services that help us fulfil your order, and only what they need:",
      },
      {
        /* EDIT: list the real services you use */
        list: [
          "Delivery partners, who receive your name, phone number and address.",
          "Payment providers, who process your payment.",
          "Website tools, such as hosting and analytics.",
        ],
      },
      {
        p: "We may also share information when the law requires it.",
      },
    ],
  },
  {
    id: "cookies",
    title: "Cookies",
    blocks: [
      {
        p: "We use cookies and similar technology to keep your bag and preferences, and to understand how the site is used. You can block or delete cookies in your browser settings, but some parts of the site, such as your shopping bag, may stop working.",
      },
    ],
  },
  {
    id: "keep",
    title: "How long we keep it",
    blocks: [
      {
        /* EDIT: match your real retention period */
        p: "We keep order information for as long as we need it to handle exchanges, resolve problems and meet legal and accounting requirements. After that we delete it or make it anonymous.",
      },
    ],
  },
  {
    id: "choices",
    title: "Your choices",
    blocks: [
      { p: "You can ask us to:" },
      {
        list: [
          "Show you the personal information we hold about you.",
          "Correct information that is wrong.",
          "Delete your information, where we are not required to keep it.",
          "Stop sending you promotional messages.",
        ],
      },
      {
        p: `To make a request, email us at ${CONTACT_EMAIL}. We may need to confirm who you are first.`,
      },
    ],
  },
  {
    id: "security",
    title: "Keeping it safe",
    blocks: [
      {
        p: "We take reasonable steps to protect your information, including secure connections on our site and limited access to order data. No system is completely secure, so we cannot guarantee absolute security.",
      },
    ],
  },
  {
    id: "children",
    title: "Children",
    blocks: [
      {
        p: "Our site is not meant for children under 18, and we do not knowingly collect their information. If you think a child has given us information, tell us and we will delete it.",
      },
    ],
  },
  {
    id: "changes",
    title: "Changes to this policy",
    blocks: [
      {
        p: "We may update this policy from time to time. The date at the top of the page shows when it last changed. If the changes are significant, we will make that clear on the site.",
      },
    ],
  },
  {
    id: "contact",
    title: "Questions",
    blocks: [
      {
        p: `If you have a question about this policy or how we handle your information, email us at ${CONTACT_EMAIL}.`,
      },
    ],
  },
];

/* Page header, same style as BagHeader */
const PageHeader = ({ tag, title, description }) => (
  <header className="w-full font-primary py-3 sm:py-5">
    <div className="px-5 sm:px-8 lg:px-12">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="mb-2 flex items-center gap-2.5">
            <span className="h-px w-8 bg-black" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-black/45">
              {tag}
            </span>
          </div>
          <h1 className="text-[clamp(2rem,4vw,3.5rem)] font-bold leading-[0.9] tracking-[-0.06em] text-black">
            {title}
          </h1>
        </div>

        <p className="hidden text-xs leading-relaxed text-black/50 sm:block sm:text-right sm:text-sm">
          {description}
        </p>
      </div>
    </div>
  </header>
);

const Privacy = () => {
  const pad = "px-5 sm:px-8 lg:px-12";

  return (
    <main className="w-full">
      <div className="">
        <PageHeader
          tag="Legal"
          title="Privacy Policy"
          description={
            <>
              How we collect, use and protect <br /> your information.
            </>
          }
        />
      </div>

      <div
        className={`${pad} grid gap-10 pb-20 pt-10 md:grid-cols-12 md:gap-16 md:pb-32 `}
      >
        {/* Contents */}
        <nav aria-label="Contents" className="md:col-span-4">
          <div className="md:sticky md:top-[20%]">
            <p className="mb-4 text-sm text-black/45">
              Last updated {LAST_UPDATED}
            </p>

            <ol className="space-y-1 border-t border-black pt-4 text-sm">
              {SECTIONS.map((section, i) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="group flex gap-3 py-1 text-black/60 transition-colors duration-300 hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                  >
                    <span className="w-5 shrink-0 tabular-nums text-black/30">
                      {i + 1}.
                    </span>
                    <span className="underline decoration-transparent underline-offset-4 transition-colors duration-300 group-hover:decoration-black/40">
                      {section.title}
                    </span>
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </nav>

        {/* Policy */}
        <div className="md:col-span-8">
          {SECTIONS.map((section, i) => (
            <section
              key={section.id}
              id={section.id}
              className="scroll-mt-8 border-t border-black/10 py-10 first:border-t-0 first:pt-0"
            >
              <h2 className="text-2xl font-medium tracking-[-0.03em] sm:text-3xl">
                <span className="mr-3 text-black/30">{i + 1}.</span>
                {section.title}
              </h2>

              <div className="mt-5 max-w-xl space-y-4 text-base leading-7 text-black/65">
                {section.blocks.map((block, j) =>
                  block.p ? (
                    <p key={j}>{block.p}</p>
                  ) : (
                    <ul key={j} className="list-disc space-y-2 pl-5 marker:text-black/30">
                      {block.list.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  )
                )}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Privacy;