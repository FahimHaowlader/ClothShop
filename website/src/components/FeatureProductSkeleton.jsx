import React from "react";

const FeaturedProductSkeleton = () => {
  return (
    <section className="w-full overflow-hidden">
      <div className="grid w-full items-stretch lg:grid-cols-2">

        {/* =================================================
            IMAGE SKELETON
        ================================================== */}

        <div
          className="
            relative
            h-[100svh]
            min-h-[500px]
            w-full
            overflow-hidden
            bg-neutral-100
            lg:h-full
            lg:min-h-0
          "
        >
          {/* Main image */}

          <div className="absolute inset-0 animate-pulse bg-black/[0.07]" />

          {/* Previous button */}

          <div
            className="
              absolute
              left-4
              top-1/2
              z-10
              flex
              h-10
              w-10
              -translate-y-1/2
              animate-pulse
              rounded-full
              bg-black/[0.10]
              sm:left-5
              sm:h-11
              sm:w-11
            "
          />

          {/* Next button */}

          <div
            className="
              absolute
              right-4
              top-1/2
              z-10
              flex
              h-10
              w-10
              -translate-y-1/2
              animate-pulse
              rounded-full
              bg-black/[0.10]
              sm:right-5
              sm:h-11
              sm:w-11
            "
          />

          {/* Image indicators */}

          <div
            className="
              absolute
              bottom-5
              left-1/2
              z-10
              flex
              -translate-x-1/2
              items-center
              gap-2
              sm:bottom-6
            "
          >
            {/* Active indicator */}

            <div className="h-1.5 w-8 animate-pulse rounded-full bg-black/20" />

            {/* Other indicators */}

            <div className="h-1.5 w-2 animate-pulse rounded-full bg-black/10" />
            <div className="h-1.5 w-2 animate-pulse rounded-full bg-black/10" />
            <div className="h-1.5 w-2 animate-pulse rounded-full bg-black/10" />
            <div className="h-1.5 w-2 animate-pulse rounded-full bg-black/10" />
          </div>
        </div>

        {/* =================================================
            PRODUCT DETAILS SKELETON
        ================================================== */}

        <div
          className="
            flex
            w-full
            flex-col
            justify-center
            px-5
            py-12
            sm:px-8
            sm:py-16
            md:px-12
            lg:px-14
            xl:px-20
            2xl:px-24
          "
        >

          {/* =================================================
              PRODUCT NAME
          ================================================== */}

          <div className="space-y-3">

            {/* First line */}

            <div
              className="
                h-8
                w-[90%]
                animate-pulse
                rounded-lg
                bg-black/[0.08]
                sm:h-9
                lg:h-10
                xl:h-11
              "
            />

            {/* Second line */}

            <div
              className="
                h-8
                w-[65%]
                animate-pulse
                rounded-lg
                bg-black/[0.08]
                sm:h-9
                lg:h-10
                xl:h-11
              "
            />

          </div>

          {/* =================================================
              PRICE
          ================================================== */}

          <div
            className="
              mt-5
              h-6
              w-20
              animate-pulse
              rounded-md
              bg-black/[0.08]
              sm:h-7
            "
          />

          {/* =================================================
              COLOR
          ================================================== */}

          <div className="mt-8 sm:mt-10">

            {/* Color title */}

            <div
              className="
                h-4
                w-32
                animate-pulse
                rounded-full
                bg-black/[0.08]
              "
            />

            {/* Color swatches */}

            <div
              className="
                mt-5
                flex
                flex-wrap
                items-center
                gap-3
                sm:gap-4
              "
            >
              <div
                className="
                  h-11
                  w-11
                  animate-pulse
                  rounded-full
                  bg-black/[0.08]
                  sm:h-12
                  sm:w-12
                "
              />

              <div
                className="
                  h-11
                  w-11
                  animate-pulse
                  rounded-full
                  bg-black/[0.08]
                  sm:h-12
                  sm:w-12
                "
              />

              <div
                className="
                  h-11
                  w-11
                  animate-pulse
                  rounded-full
                  bg-black/[0.08]
                  sm:h-12
                  sm:w-12
                "
              />

              <div
                className="
                  h-11
                  w-11
                  animate-pulse
                  rounded-full
                  bg-black/[0.08]
                  sm:h-12
                  sm:w-12
                "
              />

              <div
                className="
                  h-11
                  w-11
                  animate-pulse
                  rounded-full
                  bg-black/[0.08]
                  sm:h-12
                  sm:w-12
                "
              />
            </div>
          </div>

          {/* =================================================
              SIZE
          ================================================== */}

          <div className="mt-6 sm:mt-7">

            {/* Header */}

            <div
              className="
                mb-3
                flex
                items-center
                justify-between
                sm:mb-4
              "
            >

              {/* Select Size */}

              <div
                className="
                  h-3
                  w-24
                  animate-pulse
                  rounded-full
                  bg-black/[0.08]
                "
              />

              {/* Size Guide */}

              <div
                className="
                  h-3
                  w-20
                  animate-pulse
                  rounded-full
                  bg-black/[0.08]
                "
              />

            </div>

            {/* Size selector */}

            <div
              className="
                rounded-full
                border
                border-black/[0.06]
                bg-black/[0.025]
                p-1
              "
            >
              <div
                className="
                  h-9
                  w-full
                  animate-pulse
                  rounded-full
                  bg-black/[0.06]
                  sm:h-10
                "
              />
            </div>
          </div>

          {/* =================================================
              QUANTITY + ADD TO BAG
          ================================================== */}

          <div
            className="
              mt-7
              flex
              w-full
              items-center
              gap-2
              sm:mt-8
              sm:gap-3
            "
          >

            {/* Quantity */}

            <div
              className="
                h-12
                w-[112px]
                shrink-0
                animate-pulse
                rounded-full
                bg-black/[0.07]
                sm:w-[130px]
              "
            />

            {/* Add to bag */}

            <div
              className="
                h-12
                min-w-0
                flex-1
                animate-pulse
                rounded-full
                bg-black/[0.08]
              "
            />
          </div>

          {/* =================================================
              PAYPAL
          ================================================== */}

          <div
            className="
              mt-5
              h-12
              w-full
              animate-pulse
              rounded-full
              bg-black/[0.07]
            "
          />

        </div>
      </div>
    </section>
  );
};

export default FeaturedProductSkeleton;