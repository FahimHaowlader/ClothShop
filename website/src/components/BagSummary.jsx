import React, { useMemo, useState } from "react";
import { Link } from "react-router";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  LockKeyhole,
  ShoppingBag,
  Tag,
  Truck,
  ShieldCheck,
  X,
} from "lucide-react";

const INPUT_CLASS =
  "w-full rounded-xl border border-black/10 bg-neutral-50/30 px-3.5 py-3 text-xs text-black transition-[border-color,background-color,box-shadow] duration-500 ease-in-out placeholder:text-black/30 focus:border-black focus:bg-white focus:outline-none focus:ring-1 focus:ring-black/5 disabled:opacity-50";

const BUTTON_CLASS =
  "inline-flex items-center justify-center gap-2 rounded-full border border-black/15 bg-white px-6 py-3.5 text-xs font-semibold text-black shadow-sm transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-black hover:text-white active:scale-[0.98]";

const formatPrice = (amount) =>
  `৳${Number(amount || 0).toLocaleString("en-BD")}`;

const BagSummary = ({
  subtotal = 0,
  shippingCost = 70,
  discountRate = 25,
  checkoutLink = "/checkout",
  returnLink = "/cart",
  showCheckoutButton = true,
}) => {
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [couponError, setCouponError] = useState("");

  const safeSubtotal = Math.max(0, Number(subtotal) || 0);
  const safeShipping = Math.max(0, Number(shippingCost) || 0);
  const safeDiscountRate = Math.min(
    100,
    Math.max(0, Number(discountRate) || 0)
  );

  const discount = useMemo(
    () =>
      appliedCoupon
        ? Math.round(safeSubtotal * (safeDiscountRate / 100))
        : 0,
    [appliedCoupon, safeSubtotal, safeDiscountRate]
  );

  const discountedSubtotal = Math.max(0, safeSubtotal - discount);
  const originalTotal = safeSubtotal + safeShipping;
  const total = discountedSubtotal + safeShipping;

  const handleApplyCoupon = () => {
    setCouponError("");

    const normalizedCode = couponCode.trim();

    if (!normalizedCode) {
      setCouponError("Please enter a coupon code.");
      return;
    }

    if (safeSubtotal <= 0) {
      setCouponError("Add products to your bag before applying a coupon.");
      return;
    }

    setAppliedCoupon(normalizedCode);
    setCouponCode("");
    setShowCouponInput(false);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon("");
    setCouponCode("");
    setCouponError("");
    setShowCouponInput(false);
  };

  const toggleCouponInput = () => {
    setShowCouponInput((previous) => !previous);
    setCouponError("");
  };

  const renderCouponSection = () => (
    <div>
      {!appliedCoupon ? (
        <>
          {!showCouponInput ? (
            <button
              type="button"
              onClick={toggleCouponInput}
              className="group flex w-full cursor-pointer h-7 items-center justify-between gap-3 text-left transition-opacity duration-500 ease-in-out hover:opacity-75"
            >
              <span className="flex items-center gap-2">
               

                <span className="relative pb-0.5 text-xs font-bold text-black after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:bg-black/80 after:transition-all after:duration-500 after:ease-in-out group-hover:after:bg-black/40">
                  Have a coupon code?
                </span>
              </span>

              <ArrowRight
                size={15}
                className="shrink-0 text-black/40 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1 group-hover:text-black"
              />
            </button>
          ) : (
            <div className="animate-in fade-in slide-in-from-top-1 space-y-3 duration-500 ease-out">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-bold tracking-tight text-black">
                  Coupon code
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setShowCouponInput(false);
                    setCouponCode("");
                    setCouponError("");
                  }}
                  aria-label="Close coupon input"
                  className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-black/45 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:rotate-90 hover:bg-black/5 hover:text-black active:scale-95"
                >
                  <X size={15} />
                </button>
              </div>

              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  handleApplyCoupon();
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={couponCode}
                  onChange={(event) => {
                    setCouponCode(event.target.value);
                    setCouponError("");
                  }}
                  placeholder="Enter coupon code"
                  aria-label="Coupon code"
                  className={`${INPUT_CLASS} min-w-0 flex-1`}
                />

                <button
                  type="submit"
                  disabled={!couponCode.trim()}
                  className="inline-flex shrink-0 cursor-pointer items-center justify-center rounded-xl border border-black/10 bg-white px-4 py-3 text-xs font-semibold text-black transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-black hover:text-white active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Apply
                </button>
              </form>

              {couponError && (
                <p
                  role="alert"
                  className="animate-in fade-in slide-in-from-top-1 text-[10px] leading-relaxed text-red-600 duration-300 ease-out"
                >
                  {couponError}
                </p>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-black/10 bg-neutral-50/50 p-3 transition-colors duration-500 ease-in-out sm:p-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-black text-white transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]">
              <CheckCircle2 size={15} strokeWidth={1.7} />
            </div>

            <div className="min-w-0">
              <p className="break-words text-xs font-bold tracking-tight text-black">
                <span className="uppercase">{appliedCoupon}</span> Applied
              </p>

              <p className="mt-1 text-[10px] text-black/45">
                {safeDiscountRate}% discount applied.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRemoveCoupon}
            className="inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-lg border border-black/10 bg-white px-2.5 py-2 text-[10px] font-semibold text-black transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-black hover:bg-black hover:text-white active:scale-95"
          >
            <X size={12} />
            Remove
          </button>
        </div>
      )}
    </div>
  );

  const renderPriceBreakdown = (compact = false) => (
    <div className={compact ? "space-y-2.5" : "space-y-4"}>
      {!compact && (
        <>
          <div className="flex items-center justify-between gap-3 text-xs">
            <span className="text-black/50">Subtotal</span>

            <span className="flex flex-wrap items-center justify-end gap-2 font-medium text-black">
              {discount > 0 && (
                <span className="text-[10px] text-black/35 line-through">
                  {formatPrice(safeSubtotal)}
                </span>
              )}

              <span>{formatPrice(discountedSubtotal)}</span>
            </span>
          </div>

          <div className="flex items-center justify-between gap-3 text-xs">
            <span className="text-black/50">Shipping</span>

            <span className="font-medium text-black">
              {safeShipping === 0 ? "Free" : formatPrice(safeShipping)}
            </span>
          </div>

          {discount > 0 && (
            <div className="flex items-center justify-between gap-3 text-xs">
              <span className="text-black/50">
                Coupon discount ({safeDiscountRate}%)
              </span>

              <span className="font-medium text-black">
                -{formatPrice(discount)}
              </span>
            </div>
          )}
        </>
      )}

      {compact && discount > 0 && (
        <div className="flex items-center justify-between gap-3 text-xs">
          <span className="text-black/50">
            Coupon discount ({safeDiscountRate}%)
          </span>

          <span className="font-medium text-black">
            -{formatPrice(discount)}
          </span>
        </div>
      )}

      <div
        className={`flex items-center justify-between gap-3 ${
          compact ? "" : "border-t border-black/10 pt-4"
        }`}
      >
        <div>
          <p className="text-sm font-bold text-black">Total</p>

          <p className="mt-1 text-[10px] text-black/40">
            Including shipping
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2">
          {discount > 0 && (
            <span className="text-xs text-black/35 line-through">
              {formatPrice(originalTotal)}
            </span>
          )}

          <p className="text-xl font-bold tracking-tight text-black">
            {formatPrice(total)}
          </p>
        </div>
      </div>
    </div>
  );

  const renderSecurityNotice = () => (
    <div className="flex items-start gap-2">
      <ShieldCheck
        size={15}
        className="mt-0.5 shrink-0 text-black/40"
      />

      <p className="text-[10px] leading-relaxed text-black/40">
        Your personal information is handled securely.
      </p>
    </div>
  );

  const renderTrustIndicators = () => (
    <div className="flex items-center justify-center gap-5 text-[10px] text-black/35 sm:gap-6">
      <span className="flex items-center gap-1.5 transition-colors duration-500">
        <LockKeyhole size={12} />
        Secure checkout
      </span>

      <span className="flex items-center gap-1.5 transition-colors duration-500">
        <Truck size={13} />
        Reliable delivery
      </span>
    </div>
  );

  const renderCheckoutButton = (mobile = false) =>
    showCheckoutButton ? (
      <Link
        to={checkoutLink}
        className={
          mobile
            ? "inline-flex w-full items-center justify-center gap-2 rounded-full bg-black px-6 py-4 text-xs font-semibold text-white shadow-sm transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-black/80 active:scale-[0.98]"
            : `${BUTTON_CLASS} mt-6 w-full`
        }
      >
        Proceed to Checkout
        <ArrowRight
          size={14}
          className="transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1"
        />
      </Link>
    ) : null;

  return (
    <>
      {/* Desktop Summary */}
      <aside className="hidden min-w-0 lg:block">
        <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm transition-shadow duration-500 ease-in-out hover:shadow-md sm:p-7">
          <div className="mb-6 flex items-center justify-between border-b border-black/10 pb-5">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-black/40">
                Your Selection
              </p>

              <h2 className="mt-2 text-lg font-bold tracking-tight text-black">
                Bag Summary
              </h2>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 text-black transition-colors duration-500 ease-in-out ">
              <ShoppingBag size={18} strokeWidth={1.7} />
            </div>
          </div>

          {renderPriceBreakdown()}

          <div className="mt-5 border-t border-black/10 pt-5">
            {renderCouponSection()}
          </div>

          {renderCheckoutButton()}

          <Link
            to={returnLink}
            className={`group flex items-center justify-center gap-2 border-t border-black/10 pt-5 text-[11px] font-semibold text-black/50 transition-colors duration-500 ease-in-out hover:text-black ${
              showCheckoutButton ? "mt-5" : "mt-6"
            }`}
          >
            <ArrowLeft
              size={13}
              className="transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-x-1"
            />
            Return to Shopping Bag
          </Link>
        </div>

        <div className="mt-5">
          {renderTrustIndicators()}
        </div>
      </aside>

      {/* Mobile and Tablet Sticky Summary — No Expand/Collapse */}
      <div className="lg:hidden">
        {/* Space reserved so page content is not hidden behind the fixed bar */}
        <div
          aria-hidden="true"
          className="h-[235px] sm:h-[250px]"
        />

        <aside
          aria-label="Shopping bag summary"
          className="fixed inset-x-0 bottom-0 z-50 border-t border-black/10 bg-white/95 shadow-[0_-8px_35px_rgba(0,0,0,0.08)] backdrop-blur-xl transition-[background-color,box-shadow] rounded-t-2xl duration-500 ease-in-out"
        >
          <div className="mx-auto max-w-3xl space-y-3 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-4 sm:px-8 sm:pb-5">
            {/* Compact price breakdown — always visible */}
            <div className="border-b border-black/10 pb-3">
              {renderPriceBreakdown(true)}
            </div>

            {/* Coupon section */}
            {renderCouponSection()}

            {/* Checkout action */}
            {renderCheckoutButton(true)}

            {/* Trust indicators */}
            {renderTrustIndicators()}
          </div>
        </aside>
      </div>
    </>
  );
};

export default BagSummary;