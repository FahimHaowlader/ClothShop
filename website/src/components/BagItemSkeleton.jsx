import React from "react";

const BagItemSkeleton = () => {
  return (
    <div className="w-full overflow-hidden border-b border-black/10 py-4 font-primary antialiased">
      <div className="flex w-full flex-col items-start justify-between gap-4 animate-pulse sm:flex-row sm:items-center sm:gap-6">
        
        {/* LEFT SECTION: IMAGE & TEXT DETAILS SKELETON */}
        <div className="flex w-full items-start gap-4 sm:w-auto sm:items-center sm:gap-6">
          {/* Image Thumbnail Placeholder */}
          <div className="h-28 w-22 shrink-0 rounded-lg bg-black/10 sm:h-32 sm:w-26" />

          {/* Text Line Placeholders */}
          <div className="flex min-w-0 flex-1 flex-col justify-center gap-2">
            {/* SKU Placeholder */}
            <div className="h-3 w-16 rounded-full bg-black/10" />

            {/* Product Title Placeholder (2 lines simulated) */}
            <div className="flex flex-col gap-1.5 pt-0.5">
              <div className="h-4 w-48 rounded-full bg-black/15 sm:w-64" />
              <div className="h-4 w-32 rounded-full bg-black/10" />
            </div>

            {/* Color & Size Badges Placeholder */}
            <div className="mt-1 flex items-center gap-2">
              <div className="h-5 w-16 rounded-full border border-black/10 bg-black/5" />
              <div className="h-5 w-14 rounded-full border border-black/10 bg-black/5" />
            </div>

            {/* Unit Price Placeholder */}
            <div className="mt-1 flex items-center gap-2">
              <div className="h-3 w-14 rounded-full bg-black/10" />
              <div className="h-4 w-12 rounded-full bg-black/15" />
            </div>
          </div>
        </div>

        {/* RIGHT SECTION: SUBTOTAL & STEPPER SKELETON */}
        <div className="flex w-full shrink-0 flex-row items-center justify-between gap-3 border-t border-black/5 pt-3 sm:w-auto sm:flex-col sm:items-end sm:border-t-0 sm:pt-0">
          
          {/* Subtotal Readout Placeholder */}
          <div className="flex flex-col gap-1 text-left sm:text-right">
            <div className="h-3 w-12 rounded-full bg-black/10 sm:ml-auto" />
            <div className="h-5 w-16 rounded-full bg-black/15" />
          </div>

          {/* Stepper + Delete Button Placeholders */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quantity Stepper Pill Placeholder */}
            <div className="h-9 w-[100px] shrink-0 rounded-full border border-black/10 bg-black/5 sm:h-10 sm:w-[115px]" />

            {/* Delete Button Circle Placeholder */}
            <div className="h-9 w-9 shrink-0 rounded-full border border-black/10 bg-black/5 sm:h-10 sm:w-10" />
          </div>
        </div>

      </div>
    </div>
  );
};

export default BagItemSkeleton;