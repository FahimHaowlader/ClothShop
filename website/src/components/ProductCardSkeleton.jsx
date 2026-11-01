import React from "react";

/* Shimmer is defined once here so no tailwind.config change is needed.
   Falls back to a static block when the user prefers reduced motion. */
const shimmerStyles = `
  .pc-skeleton {
    background-color: #e5e5e5;
    background-image: linear-gradient(
      100deg,
      rgba(255, 255, 255, 0) 30%,
      rgba(255, 255, 255, 0.65) 50%,
      rgba(255, 255, 255, 0) 70%
    );
    background-size: 200% 100%;
    background-repeat: no-repeat;
    background-position: 150% 0;
    animation: pc-shimmer 1.6s ease-in-out infinite;
  }

  @keyframes pc-shimmer {
    to {
      background-position: -50% 0;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .pc-skeleton {
      animation: none;
    }
  }
`;

const ProductCardSkeleton = () => {
  return (
    <article
      className="w-full"
      aria-busy="true"
      aria-live="polite"
      aria-label="Loading product"
    >
      <style>{shimmerStyles}</style>

      {/* ========================================
          IMAGE SKELETON (same sizes as the card)
      ======================================== */}

      <div
        className="
          pc-skeleton
          h-[220px]
          w-full
          rounded-lg
          sm:h-[280px]
          md:h-[300px]
          xl:h-[370px]
        "
      />

      {/* ========================================
          PRODUCT DETAILS SKELETON
      ======================================== */}

      <div className="pt-3">
        {/* PRODUCT NAME (card row is 20px + 2px padding = 22px) */}

        <div className="flex h-[22px] items-center">
          <div className="pc-skeleton h-3.5 w-[70%] rounded-full" />
        </div>

        {/* PRICE (card row is 20px tall) */}

        <div className="mt-1.5 flex h-5 items-center gap-3.5">
          <div className="pc-skeleton h-3.5 w-12 rounded-full" />
          <div className="pc-skeleton h-3 w-9 rounded-full" />
        </div>

        {/* VARIANTS (28px circles, same gap as the card) */}

        <div className="mt-3 flex min-h-[30px] items-center gap-2.5">
          <div className="pc-skeleton h-7 w-7 shrink-0 rounded-full" />
          <div className="pc-skeleton h-7 w-7 shrink-0 rounded-full" />
          <div className="pc-skeleton h-7 w-7 shrink-0 rounded-full" />
          <div className="pc-skeleton h-7 w-7 shrink-0 rounded-full" />
        </div>

        {/* VIEW DETAILS BUTTON (full-width pill like the card) */}

        <div className="pc-skeleton mt-3 h-9.5 w-full rounded-full" />
      </div>
    </article>
  );
};

export default ProductCardSkeleton;