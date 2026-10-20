import React, { useState } from "react";
import { ArrowRight, HelpCircle, Tag, Check, X } from "lucide-react";
import { Link } from "react-router";

const BagSummary = ({
  planTitle = "Bag Summary",
  items = [
    { name: "Hoodie with embroidered slogan", originalPrice: 180, price: 126 },
    { name: "Heavyweight Boxy Fleece", originalPrice: null, price: 145 },
  ],
  shippingCost = 0,
  taxes = 0,
  onCheckout,
  onContinueShopping,
  continueShoppingUrl = "/shop",
}) => {
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [promoCodeInput, setPromoCodeInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("BACHELOR10");
  const [discountValue, setDiscountValue] = useState(27.1);

  // Calculations
  const rawOriginalTotal = items.reduce(
    (acc, item) => acc + (item.originalPrice ?? item.price),
    0
  );
  const rawSubtotal = items.reduce((acc, item) => acc + item.price, 0);

  const activeDiscount = appliedCoupon ? discountValue : 0;
  const finalTotal = Math.max(0, rawSubtotal - activeDiscount + shippingCost + taxes).toFixed(2);
  const originalTotalFormatted = rawOriginalTotal.toFixed(2);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCodeInput.trim()) {
      setAppliedCoupon(promoCodeInput.trim().toUpperCase());
      setDiscountValue(rawSubtotal * 0.1);
      setShowCouponInput(false);
      setPromoCodeInput("");
    }
  };

  const handleRemovePromo = () => {
    setAppliedCoupon(null);
    setDiscountValue(0);
  };

  // Render Continue Shopping link/button matching editorial component headers
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
        
        {/* HEADER WITH CONTINUOUS NAVIGATION */}
        <div className="flex items-center justify-between border-b border-black pb-4">
          <div className="flex items-center gap-2.5">
            <span className="h-px w-6 bg-black" />
            <h2 className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-black">
              {planTitle}
            </h2>
          </div>

          {/* CONTINUE SHOPPING ACTION */}
          {renderContinueShopping()}
        </div>

        {/* ITEMIZED LINE BREAKDOWN */}
        <div className="flex flex-col gap-3.5 text-xs sm:text-sm">
          
          {/* SUBTOTALS ROW */}
          <div className="flex items-center justify-between text-black/70 transition-colors duration-200 hover:text-black">
            <span className="font-medium tracking-wide text-xs sm:text-sm text-black/80">
              Subtotals
            </span>

            <div className="flex items-center gap-2.5">
              {items[0].originalPrice !== null && items[0].originalPrice > items[0].price && (
                <span className="relative text-xs font-medium text-black/40">
                  ${items[0].originalPrice.toFixed(2)}
                  {/* Optically centered strikethrough line */}
                  <span className="absolute inset-x-0 top-[43%] h-[1px] -translate-y-1/2 bg-black/40" />
                </span>
              )}
              <span className="font-bold text-black text-xs sm:text-sm">
                {items[0].price === 0 ? "FREE" : `$${items[0].price.toFixed(2)}`}
              </span>
            </div>
          </div>

          {/* SHIPPING ROW */}
          <div className="flex items-center justify-between text-black/70">
            <span className="font-medium tracking-wide text-xs sm:text-sm text-black/80">
              Shipping
            </span>
            <span className="font-bold text-black text-xs sm:text-sm">
              {shippingCost === 0 ? "$0.00" : `$${shippingCost.toFixed(2)}`}
            </span>
          </div>

          <div className="my-1 h-px w-full bg-black/10" />

          {/* TAXES ROW WITH TOOLTIP */}
          <div className="flex items-center justify-between text-black/70">
            <div className="flex items-center gap-1.5">
              <span className="font-medium tracking-wide text-xs sm:text-sm text-black/80">
                Taxes
              </span>
              <button
                type="button"
                className="text-black/40 transition-colors duration-200 hover:text-black focus:outline-none hover:cursor-pointer"
                title="Taxes calculated at checkout"
              >
                <HelpCircle size={14} strokeWidth={1.8} />
              </button>
            </div>
            <span className="font-bold text-black text-xs sm:text-sm">
              {taxes === 0 ? "$0.00" : `$${taxes.toFixed(2)}`}
            </span>
          </div>

          {/* COUPON SAVINGS ITEM */}
          {appliedCoupon && (
            <div className="flex items-center justify-between text-black transition-all duration-300">
              <span className="font-medium tracking-wide text-xs sm:text-sm text-black">
                Coupon savings applied
              </span>
              <span className="font-bold text-xs sm:text-sm">-${discountValue.toFixed(2)}</span>
            </div>
          )}

          <div className="my-1 h-px w-full bg-black/10" />

          {/* TOTAL READOUT */}
          <div className="flex items-baseline justify-between pt-1">
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm font-bold tracking-[0.18em] text-black">
                Total
              </span>
            </div>

            <div className="flex items-baseline gap-2.5">
              {rawOriginalTotal > Number(finalTotal) && (
                <span className="relative text-xs font-semibold text-black/40 sm:text-sm">
                  ${originalTotalFormatted}
                  {/* Optically centered strikethrough line */}
                  <span className="absolute inset-x-0 top-[43%] h-[1px] -translate-y-1/2 bg-black/40" />
                </span>
              )}
              <span className="text-lg font-black tracking-tight text-black sm:text-xl">
                ${finalTotal}
              </span>
            </div>
          </div>
        </div>

        {/* COUPON INPUT / BADGE */}
        <div className="mt-1 transition-all duration-300">
          {appliedCoupon ? (
            <div className="flex items-center justify-between rounded-full border border-black bg-white px-4 py-3 text-xs font-medium text-black transition-all duration-300 shadow-xs">
              <div className="flex items-center gap-2">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-black text-white">
                  <Check size={12} strokeWidth={3} />
                </span>
                <span className="font-bold tracking-wider text-black text-xs">
                  {appliedCoupon}
                </span>
                <span className="text-[10px] font-semibold text-black/60">
                  (Applied)
                </span>
              </div>

              <button
                type="button"
                onClick={handleRemovePromo}
                className="flex items-center gap-1 text-[10px] font-bold tracking-wider text-black/80 transition-opacity duration-200 hover:text-black hover:underline hover:cursor-pointer"
              >
                <X size={12} />
                <span>Remove</span>
              </button>
            </div>
          ) : !showCouponInput ? (
            <button
              type="button"
              onClick={() => setShowCouponInput(true)}
              className="group relative text-xs font-bold tracking-wider text-black focus:outline-none hover:cursor-pointer"
            >
              <span className="relative">
                Have a coupon code?
                <span className="absolute -bottom-0.5 left-0 h-[1.5px] w-full bg-black transition-all duration-300 group-hover:bg-black/50" />
              </span>
            </button>
          ) : (
            <form
              onSubmit={handleApplyPromo}
              className="flex h-11 w-full items-center overflow-hidden rounded-full border border-black bg-white p-1 transition-all duration-300 focus-within:border-black focus-within:ring-1 focus-within:ring-black"
            >
              <div className="flex items-center pl-3 text-black">
                <Tag size={15} strokeWidth={2} />
              </div>

              <input
                type="text"
                placeholder="Enter code"
                value={promoCodeInput}
                onChange={(e) => setPromoCodeInput(e.target.value)}
                className="w-full bg-transparent px-2.5 uppercase text-xs font-bold tracking-wider text-black placeholder:text-black/50 focus:outline-none"
                autoFocus
              />

              <button
                type="submit"
                disabled={!promoCodeInput.trim()}
                className="h-full rounded-full border border-black bg-black px-5 text-[10px] font-bold tracking-widest text-white transition-all duration-300 hover:bg-white hover:text-black active:scale-95 disabled:cursor-not-allowed disabled:border-transparent disabled:bg-black/60 disabled:text-white hover:cursor-pointer"
              >
                Apply
              </button>
            </form>
          )}
        </div>

        {/* PRIMARY CHECKOUT BUTTON */}
        <button
          type="button"
          onClick={onCheckout}
          className="
            group
            relative
            mt-2
            inline-flex
            h-13
            w-full
            items-center
            justify-center
            gap-3
            overflow-hidden
            rounded-full
            hover:cursor-pointer
            border
            hover:border-black/10
            bg-black
            px-8
            text-xs
            font-bold
            tracking-[0.18em]
            text-white
            shadow-lg
            shadow-black/10
            will-change-transform
            transition-all
            duration-500
            ease-[cubic-bezier(0.25,1,0.5,1)]
            hover:-translate-y-0.5
            hover:bg-white
            hover:text-black
            hover:shadow-xl
            hover:shadow-black/20
            active:translate-y-0
            active:scale-[0.98]
            sm:h-14
            sm:text-sm
          "
        >
          <span className="font-primary">Checkout</span>

          <span
            className="
              flex
              h-6
              w-6
              items-center
              justify-center
              rounded-full
              bg-white
              text-black
              transition-all
              duration-500
              ease-[cubic-bezier(0.25,1,0.5,1)]
              group-hover:translate-x-1
              group-hover:bg-black
              group-hover:text-white
              sm:h-7
              sm:w-7
            "
          >
            <ArrowRight size={14} strokeWidth={2.2} />
          </span>
        </button>

      </div>
    </aside>
  );
};

export default BagSummary;