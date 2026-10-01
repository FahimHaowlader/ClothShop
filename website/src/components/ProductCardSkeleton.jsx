import React from "react";

const ProductCardSkeleton = () => {
  return (
    <article className="w-full animate-pulse">
      {/* ========================================
          IMAGE SKELETON
      ======================================== */}

      <div
        className="
          h-[260px]
          w-full
          overflow-hidden
          bg-neutral-200

          sm:h-[300px]
          md:h-[320px]
          lg:h-[350px]
        "
      />

      {/* ========================================
          PRODUCT DETAILS SKELETON
      ======================================== */}

      <div className="pt-3">
        {/* PRODUCT NAME */}

        <div className="h-4 w-[75%] rounded-sm bg-neutral-200" />

        {/* PRICE */}

        <div className="mt-2 flex items-center gap-2">
          <div className="h-4 w-12 rounded-sm bg-neutral-200" />
          <div className="h-3 w-10 rounded-sm bg-neutral-200" />
        </div>

        {/* VARIANTS */}

        <div className="mt-3 flex min-h-[30px] items-center gap-2.5">
          <div className="h-9 w-9 rounded-full bg-neutral-200" />
          <div className="h-9 w-9 rounded-full bg-neutral-200" />
          <div className="h-9 w-9 rounded-full bg-neutral-200" />
          <div className="h-9 w-9 rounded-full bg-neutral-200" />
        </div>
        {/* VIEW DETAILS */}

        <div className="mt-5 flex w-full flex-col items-center">
          {/* Top Line */}
         <div className="h-px w-full bg-gray-300" />

          {/* Text */}
          <div className="flex items-center justify-center py-2">
            <div className="h-5 w-60 rounded-sm bg-neutral-200" />
          </div>

          {/* Bottom Line */}
          <div className="h-px w-full bg-gray-300" />
        </div>
      </div>
    </article>
  );
};

export default ProductCardSkeleton;