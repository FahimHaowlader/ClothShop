import React from "react";

const ProductCardSkeleton = () => {
  return (
    <article className="w-full animate-pulse">
      {/* ========================================
          IMAGE SKELETON
      ======================================== */}

      <div
        className="
         
           h-[220px]
          w-full
          overflow-hidden
          bg-neutral-200

          sm:h-[280px]
          md:h-[300px]
          xl:h-[370px]
        "
      />

      {/* ========================================
          PRODUCT DETAILS SKELETON
      ======================================== */}

      <div className="pt-3">
        {/* PRODUCT NAME */}

        <div className="h-5 w-[75%] rounded-sm bg-neutral-200" />

        {/* PRICE */}

        <div className="mt-1.5 flex items-center gap-2">
          <div className="h-4 w-12 rounded-sm bg-neutral-200" />
          <div className="h-3 w-10 rounded-sm bg-neutral-200" />
        </div>

        {/* VARIANTS (Matches the 7x7 / h-7 w-7 circle size) */}

        <div className="mt-3 flex min-h-[30px] items-center gap-2.5">
          <div className="h-7 w-7 rounded-full bg-neutral-200 shrink-0" />
          <div className="h-7 w-7 rounded-full bg-neutral-200 shrink-0" />
          <div className="h-7 w-7 rounded-full bg-neutral-200 shrink-0" />
          <div className="h-7 w-7 rounded-full bg-neutral-200 shrink-0" />
        </div>

        {/* VIEW DETAILS */}

        <div className="mt-5 flex w-full items-center justify-center gap-3">
          {/* Left Line */}
          {/* <span className="block h-px w-5 sm:w-10 bg-neutral-200" /> */}

          {/* Text */}
          <span className="h-4 w-full rounded-sm bg-neutral-200" />

          {/* Right Line */}
          {/* <span className="block h-px w-5 sm:w-10 bg-neutral-200" /> */}
        </div>
      </div>
    </article>
  );
};

export default ProductCardSkeleton;