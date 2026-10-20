import React, { useState } from "react";
import { Ruler } from "lucide-react";

const Size = () => {
  const [gender, setGender] = useState("men");
  const [unit, setUnit] = useState("cm");

  // Example body measurements. Replace with your actual sizing.
  const charts = {
    men: [
      { size: "S", chest: 92, waist: 76, hip: 94 },
      { size: "M", chest: 100, waist: 84, hip: 102 },
      { size: "L", chest: 108, waist: 92, hip: 110 },
      { size: "XL", chest: 116, waist: 100, hip: 118 },
    ],
    women: [
      { size: "S", chest: 84, waist: 68, hip: 92 },
      { size: "M", chest: 90, waist: 74, hip: 98 },
      { size: "L", chest: 96, waist: 80, hip: 104 },
      { size: "XL", chest: 102, waist: 86, hip: 110 },
    ],
  };

  const formatValue = (value) =>
    unit === "cm" ? value : (value / 2.54).toFixed(1);

  const currentChart = charts[gender];

  return (
    <main className="min-h-screen overflow-hidden font-primary text-black">
      {/* Header */}
      <header className="w-full py-3 sm:py-5">
        <div className="px-5 sm:px-8">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className="mb-2 flex items-center gap-2.5">
                <span className="h-px w-8 bg-black" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-black/45">
                  The Perfect Fit
                </span>
              </div>

              <h1 className="text-[clamp(2rem,4vw,3.5rem)] font-bold leading-[0.9] tracking-[-0.06em]">
                Size Guide
              </h1>
            </div>

            <p className="hidden text-xs leading-relaxed text-black/50 sm:block sm:text-right sm:text-sm">
              Your fit, your way. Find the size
              <br />
              that feels right.
            </p>
          </div>
        </div>
      </header>

      {/* Intro */}
      <section className="px-5 py-10 sm:px-8">
        <div className="grid gap-6 pb-9 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-black/40">
              A guide to getting it right
            </p>

            <h2 className="mt-4 max-w-3xl text-4xl font-bold leading-[1.02] tracking-[-0.06em] sm:text-5xl md:text-6xl">
              Good style starts
              <br />
              with a <span className="text-black/30">good fit.</span>
            </h2>
          </div>

          <p className="max-w-sm text-sm leading-7 text-black/55 md:pb-1">
            Use your body measurements to find your size. Our guide helps you
            make a more confident choice before you order.
          </p>
        </div>
      </section>

      {/* Interactive Size Chart */}
      <section className="px-5 pb-20 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.65fr_1.35fr] lg:gap-20">
          {/* Left Side */}
          <div>
            <div className="flex items-center gap-3">
              <Ruler size={18} strokeWidth={1.5} />
              <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-black/50">
                Measurement chart
              </span>
            </div>

            <h3 className="mt-4 text-2xl font-bold tracking-[-0.05em] sm:text-3xl">
              Select your fit.
            </h3>

            <p className="mt-3 max-w-sm text-sm leading-7 text-black/55">
              Choose a category and switch units to view the measurements that
              work for you.
            </p>

            {/* Gender Tabs */}
            <div className="mt-8 grid grid-cols-2 border-b border-black/15">
              {[
                { label: "Men", value: "men" },
                { label: "Women", value: "women" },
              ].map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setGender(item.value)}
                  className={`relative py-4 text-left text-sm font-semibold transition-colors duration-200 ${
                    gender === item.value
                      ? "text-black"
                      : "text-black/35 hover:text-black/70"
                  }`}
                >
                  {item.label}

                  {gender === item.value && (
                    <span className="absolute bottom-[-1px] left-0 h-[2px] w-full bg-black" />
                  )}
                </button>
              ))}
            </div>

            {/* Unit Selector */}
            <div className="mt-7 flex items-center justify-between">
              <span className="text-xs text-black/45">Measurement unit</span>

              <div className="flex items-center gap-1 rounded-full bg-neutral-100 p-1">
                {["cm", "in"].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setUnit(item)}
                    className={`rounded-full px-4 py-2 text-[10px] font-bold uppercase transition-all duration-200 ${
                      unit === item
                        ? "bg-black text-white"
                        : "text-black/45 hover:text-black"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <p className="mt-7 border-l-2 border-black/15 pl-4 text-xs leading-6 text-black/45">
              If your measurements fall between two sizes, consider your
              preferred fit and the specific product&apos;s fit description.
            </p>
          </div>

          {/* Right Side: Table */}
          <div className="min-w-0">
            <div className="flex items-end justify-between gap-4 border-b-2 border-black pb-5">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-black/40">
                  Collection
                </p>

                <h3 className="mt-2 text-2xl font-bold tracking-[-0.05em] sm:text-3xl">
                  {gender === "men" ? "Men's sizing" : "Women's sizing"}
                </h3>
              </div>

              <span className="pb-1 text-xs text-black/40">
                {currentChart.length} sizes
              </span>
            </div>

            {/* Fixed Table Spacing */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[420px] table-fixed border-collapse text-left">
                <colgroup>
                  <col className="w-[25%]" />
                  <col className="w-[25%]" />
                  <col className="w-[25%]" />
                  <col className="w-[25%]" />
                </colgroup>

                <thead>
                  <tr className="border-b border-black/10 text-[10px] font-semibold uppercase tracking-[0.16em] text-black/40">
                    <th className="py-5 pr-2">Size</th>
                    <th className="px-2 py-5 text-center">Chest</th>
                    <th className="px-2 py-5 text-center">Waist</th>
                    <th className="px-2 py-5 text-center">Hip</th>
                  </tr>
                </thead>

                <tbody>
                  {currentChart.map((item) => (
                    <tr
                      key={item.size}
                      className="group border-b border-black/[0.08] transition-colors duration-200 hover:bg-neutral-50"
                    >
                      <td className="py-6 pr-2">
                        <span className="inline-flex h-9 min-w-10 items-center justify-center border border-black/10 px-2 text-xs font-bold transition-colors group-hover:border-black group-hover:bg-black group-hover:text-white">
                          {item.size}
                        </span>
                      </td>

                      <td className="px-2 py-6 text-center text-sm tabular-nums text-black/65">
                        {formatValue(item.chest)}
                      </td>

                      <td className="px-2 py-6 text-center text-sm tabular-nums text-black/65">
                        {formatValue(item.waist)}
                      </td>

                      <td className="px-2 py-6 text-center text-sm tabular-nums text-black/65">
                        {formatValue(item.hip)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-4 text-[11px] leading-5 text-black/40">
              Measurements are shown in{" "}
              {unit === "cm" ? "centimeters" : "inches"}. Values are
              illustrative and should be replaced with your actual product
              sizing.
            </p>
          </div>
        </div>
      </section>

      {/* How to Measure */}
      <section className="bg-[#f7f7f5] px-5 py-16 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
          <div>
            <div className="mb-3 flex items-center gap-2.5">
              <span className="h-px w-8 bg-black" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-black/45">
                Know your measurements
              </span>
            </div>

            <h2 className="text-4xl font-bold leading-[1.02] tracking-[-0.06em] sm:text-5xl md:text-6xl">
              Measure
              <br />
              <span className="text-black/30">with ease.</span>
            </h2>

            <p className="mt-5 max-w-md text-sm leading-7 text-black/55">
              Keep your measuring tape level and comfortably against your body
              for a consistent measurement.
            </p>
          </div>

          <div className="border-t border-black/15">
            {[
              {
                number: "01",
                title: "Chest",
                description:
                  "Measure around the fullest part of your chest, keeping the tape horizontal.",
              },
              {
                number: "02",
                title: "Waist",
                description:
                  "Measure around your natural waist without pulling the tape too tightly.",
              },
              {
                number: "03",
                title: "Hip",
                description:
                  "Measure around the fullest part of your hips while standing naturally.",
              },
            ].map((item) => (
              <div
                key={item.number}
                className="grid grid-cols-[38px_1fr] gap-4 border-b border-black/15 py-6 sm:grid-cols-[55px_1fr] sm:py-8"
              >
                <span className="pt-1 text-xs text-black/35">
                  {item.number}
                </span>

                <div>
                  <h3 className="text-lg font-semibold tracking-tight sm:text-xl">
                    {item.title}
                  </h3>

                  <p className="mt-2 max-w-lg text-sm leading-6 text-black/55">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fit Advice */}
      <section className="px-5 py-16 sm:px-8">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <div className="mb-3 flex items-center gap-2.5">
              <span className="h-px w-8 bg-black" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-black/45">
                Still not sure?
              </span>
            </div>

            <h2 className="max-w-2xl text-4xl font-bold leading-[1.05] tracking-[-0.06em] sm:text-5xl md:text-6xl">
              Your comfort.
              <br />
              <span className="text-black/30">Your confidence.</span>
            </h2>
          </div>

          {/* Inline Contact Text */}
          <div className="max-w-md md:pb-1">
            <p className="text-sm leading-7 text-black/55">
              <span className="font-semibold text-black">
                Need help choosing a size?
              </span> {" "}
              Contact us and our team will help you find the right fit for your
              next favorite piece.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Size;
