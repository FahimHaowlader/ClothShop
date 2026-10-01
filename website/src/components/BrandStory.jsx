import React from "react";

import brandImage from "../assets/images.webp";

const BrandStory = () => {
  return (
    <section
      className="
        w-full
        overflow-hidden
        px-5
        py-16
        sm:px-8
        sm:py-20
        lg:px-12
        lg:py-24
        lg:max-h-[700px]
      "
    >
      <div>
        {/* Section Heading */}
        <div className="mb-10 flex items-end justify-between md:mb-14">
          <div>
            <div className="mb-2 flex items-center gap-2.5">
              <span className="h-px w-8 bg-black" />

              <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-black/45 sm:text-[12px]">
                Our Story
              </span>
            </div>

            <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-bold leading-[0.9] tracking-[-0.06em]">
              More than clothing.
            </h2>
          </div>

          <p className="hidden text-right text-[14px] leading-5 text-black/40 sm:text-base md:block">
            Built around modern essentials,
            <br />
            designed for everyday confidence.
          </p>
        </div>

        {/* Story */}
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
          {/* Image */}
          <div className="group relative overflow-hidden">
            <img
              src={brandImage}
              alt="BachelorShop brand story"
              className="
                h-[320px]
                w-full
                object-cover
                transition-transform
                duration-[1500ms]
                ease-out
                group-hover:scale-[1.025]

                sm:h-[360px]
                md:h-[300px]
                lg:h-[400px]
              "
            />
          </div>

          {/* Content */}
          <div className="flex flex-col justify-center lg:pl-6">
            <p
              className="
                text-[clamp(1.5rem,2.5vw,2.25rem)]
                font-semibold
                leading-[1.08]
                tracking-[-0.04em]
              "
            >
              We believe great style should feel effortless.
            </p>

            <p className="mt-6 text-sm leading-6 text-black/50 sm:text-base">
              BachelorShop was created for those who appreciate simple
              silhouettes, quality materials and clothing that fits naturally
              into everyday life.
            </p>

            <p className="mt-4 text-sm leading-6 text-black/50 sm:text-base">
              From everyday essentials to standout pieces, every collection is
              thoughtfully selected to keep your wardrobe modern, versatile and
              distinctly yours.
            </p>

            <div className="mt-8">
              <button
                type="button"
                className="
                  group
                  inline-flex
                  items-center
                  gap-3
                  text-[12px]
                  font-semibold
                  tracking-[0.2em]
                  text-text-primary
                "
              >
                <span
                  className="
                    relative
                    after:absolute
                    after:-bottom-1
                    after:left-0
                    after:h-px
                    after:w-full
                    after:bg-black
                  "
                >
                  BachelorShop
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandStory;