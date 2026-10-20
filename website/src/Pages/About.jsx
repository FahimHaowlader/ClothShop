import React from "react";
import { Link } from "react-router";

/* ------------------------------------------------------------------ */
/*  Full About page, text only, one file. Header + 5 sections.         */
/*  Big statements, plenty of white space, hairlines for structure.    */
/*  Replace the copy, numbers and policies with your own.              */
/* ------------------------------------------------------------------ */


const BELIEFS = [
  {
    title: "Fabric comes first",
    text: "We choose the fabric before we draw anything. If it doesn't feel good after many washes, it doesn't ship.",
  },
  {
    title: "Fit comes from real people",
    text: "Every cut is tried on people of different heights and builds before we sell it.",
  },
  {
    title: "Prices should be fair",
    text: "We sell straight to you, so the price covers the product and not a long chain of middlemen.",
  },
  {
    title: "Service should be honest",
    text: "Clear sizing, clear descriptions and easy exchanges if something isn't right.",
  },
];

/* EDIT: match these to your real policies */
const SERVICE = [
  {
    title: "Delivery",
    text: "Orders are checked and packed with care, then sent to any district in Bangladesh. Delivery time is shown at checkout.",
  },
  {
    title: "Exchanges",
    text: "If the size isn't right, message us and we will swap it. Keep the tags on and the item unwashed.",
  },
  {
    title: "Payment",
    text: "You can pay online or on delivery. The options available to you appear at checkout.",
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

const linkClass =
  "underline decoration-black/25 decoration-4 underline-offset-[0.12em] transition-colors duration-500 hover:decoration-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black motion-reduce:transition-none";

const About = () => {
  const pad = "px-5 sm:px-8 lg:px-12";

  return (
    <main className="w-full">
      {/* Header */}
      <div className="">
        <PageHeader
          tag="Who We Are"
          title="About Us"
          description={
            <>
              Who we are, how we work and <br />what you can expect.
            </>
          }
        />
      </div>

      {/* 1. Intro and figures */}
      <section className={`${pad} pb-16 pt-10 md:pb-24 md:pt-16`}>
        <p className="max-w-5xl text-[clamp(2.25rem,6vw,5.5rem)] font-bold leading-[0.95] tracking-[-0.065em]">
          We make simple clothing for men and women in Bangladesh, and we make it properly.
        </p>

     
      </section>

      {/* 2. Story */}
      <section className={`${pad} border-t border-black/10 py-16 md:py-24`}>
        <div className="grid gap-10 md:grid-cols-12 md:gap-16">
          <h2 className="text-[clamp(1.75rem,3.5vw,3rem)] font-bold leading-[0.95] tracking-[-0.05em] md:col-span-5">
            We started because good basics were hard to find.
          </h2>

          <div className="max-w-lg space-y-5 text-base leading-7 text-black/65 md:col-span-7">
            <p>
              Most shirts we bought looked fine in the shop and tired after a
              few washes. The colour faded, the collar lost its shape, and the
              price never matched the quality.
            </p>
            <p>
              So we began making our own, one small collection at a time. We
              read every message, note what customers say about fit and fabric,
              and change the next batch because of it.
            </p>
            <p className="font-medium text-black">
              A good shirt should feel the same on the fiftieth wear as on the
              first.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Beliefs */}
      <section className={`${pad} border-t border-black/10 py-16 md:py-24`}>
        <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-bold leading-[0.9] tracking-[-0.06em]">
          What we believe
        </h2>

        <ul className="mt-12 border-t border-black">
          {BELIEFS.map((item) => (
            <li
              key={item.title}
              className="group grid gap-2 border-b border-black/15 py-7 md:grid-cols-12 md:items-baseline md:gap-10 md:py-9"
            >
              <h3 className="text-2xl font-medium tracking-[-0.03em] transition-transform duration-500 ease-out group-hover:translate-x-1 motion-reduce:transition-none sm:text-3xl md:col-span-6">
                {item.title}
              </h3>
              <p className="max-w-md text-sm leading-6 text-black/55 md:col-span-6">
                {item.text}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* 4. Service */}
      <section className={`${pad} border-t border-black/10 py-16 md:py-24`}>
        <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-bold leading-[0.9] tracking-[-0.06em]">
          Before you order
        </h2>

        <div className="mt-12 grid gap-10 md:grid-cols-3 md:gap-12">
          {SERVICE.map((item) => (
            <div key={item.title}>
              <h3 className="text-xl font-medium tracking-[-0.03em]">
                {item.title}
              </h3>
              <p className="mt-3 max-w-xs text-sm leading-6 text-black/55">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Closing */}
      <section className={`${pad} border-t border-black py-20 md:py-32`}>
        <p className="max-w-5xl text-[clamp(2rem,5.5vw,5rem)] font-bold leading-[0.98] tracking-[-0.06em]">
          Find something you will{" "}
          <Link to="/shop" className={linkClass}>
            wear again and again
          </Link>
          .
        </p>
      </section>
    </main>
  );
};

export default About;