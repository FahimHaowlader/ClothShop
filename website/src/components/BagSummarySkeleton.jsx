import React from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router";

const BagSummarySkeleton = ({
  planTitle = "Bag Summary",
  onContinueShopping,
  continueShoppingUrl = "/shop",
}) => {
  // Render real Continue Shopping navigation link without skeleton placeholder
 const renderContinueShopping = () => {
   const className =
     "group relative inline-flex uppercase items-center justify-center gap-1.5 text-[10px] sm:text-xs font-bold tracking-wider text-black focus:outline-none hover:cursor-pointer";
 
   const content = (
     <>
       {/* Animated Underline Text Wrapper with Baseline Lock */}
       <span className="relative inline-flex items-center leading-none">
         <span>Continue Shopping</span>
         <span className="absolute -bottom-1 left-0 h-[1.5px] w-0 bg-black transition-all duration-300 ease-out group-hover:w-full" />
       </span>
 
       {/* Center-aligned Right Arrow with Optical Upward Adjustment */}
       <ArrowRight
         size={13}
         strokeWidth={2.2}
         className="shrink-0 -translate-y-[2px] transition-transform duration-300 ease-out group-hover:translate-x-1"
       />
     </>
   );
 
   if (onContinueShopping) {
     return (
       <button type="button" onClick={onContinueShopping} className={className}>
         {content}
       </button>
     );
   }
 
   return (
     <Link to={continueShoppingUrl} className={className}>
       {content}
     </Link>
   );
 };
 

  return (
    <aside className="w-full font-primary antialiased">
      <div className="sticky top-8 flex flex-col gap-6">
        
        {/* REAL HEADER (No Skeleton) */}
        <div className="flex items-center justify-between border-b border-black pb-4">
          <div className="flex items-center gap-2.5">
            <span className="h-px w-6 bg-black" />
            <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-black">
              {planTitle}
            </h2>
          </div>

          {/* REAL CONTINUE SHOPPING ACTION */}
          {renderContinueShopping()}
        </div>

        {/* ITEMIZED LINE BREAKDOWN SKELETON */}
        <div className="flex flex-col gap-3.5 animate-pulse">
          
          {/* SUBTOTALS ROW */}
          <div className="flex items-center justify-between">
            <div className="h-3.5 w-16 rounded-full bg-black/10" />
            <div className="h-3.5 w-14 rounded-full bg-black/10" />
          </div>

          {/* SHIPPING ROW */}
          <div className="flex items-center justify-between">
            <div className="h-3.5 w-14 rounded-full bg-black/10" />
            <div className="h-3.5 w-12 rounded-full bg-black/10" />
          </div>

          <div className="my-1 h-px w-full bg-black/10" />

          {/* TAXES ROW */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="h-3.5 w-12 rounded-full bg-black/10" />
              {/* Tooltip icon circle skeleton */}
              <div className="h-3.5 w-3.5 rounded-full bg-black/10" />
            </div>
            <div className="h-3.5 w-12 rounded-full bg-black/10" />
          </div>

          {/* COUPON ROW SKELETON */}
          <div className="flex items-center justify-between">
            <div className="h-3.5 w-36 rounded-full bg-black/10" />
            <div className="h-3.5 w-12 rounded-full bg-black/10" />
          </div>

          <div className="my-1 h-px w-full bg-black/10" />

          {/* TOTAL READOUT SKELETON */}
          <div className="flex items-baseline justify-between pt-1">
            <div className="h-4 w-12 rounded-full bg-black/15" />
            <div className="flex items-baseline gap-2.5">
              {/* Original price strikethrough skeleton */}
              <div className="h-3.5 w-12 rounded-full bg-black/10" />
              {/* Main total price skeleton */}
              <div className="h-6 w-20 rounded-full bg-black/20" />
            </div>
          </div>
        </div>

        {/* COUPON INPUT / BADGE SKELETON */}
        <div className="mt-1 animate-pulse">
          <div className="h-11 w-full rounded-full border border-black/10 bg-black/[0.02]" />
        </div>

        {/* CHECKOUT BUTTON SKELETON */}
        <div className="mt-2 h-13 w-full rounded-full bg-black/15 sm:h-14 animate-pulse" />

      </div>
    </aside>
  );
};

export default BagSummarySkeleton;