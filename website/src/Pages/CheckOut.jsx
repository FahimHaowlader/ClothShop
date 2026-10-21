import React, { useMemo, useState } from "react";
import { Link } from "react-router";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  CreditCard,
  LockKeyhole,
  MapPin,
  Minus,
  Package,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Truck,
  UserRound,
} from "lucide-react";

const INPUT_CLASS =
  "w-full rounded-xl border border-black/10 bg-neutral-50/30 px-3.5 py-3 text-xs text-black transition-all duration-300 placeholder:text-black/30 focus:border-black focus:outline-none disabled:opacity-50";

const LABEL_CLASS =
  "mb-1.5 block text-[10px] font-bold uppercase tracking-[0.15em] text-black/45";

const BUTTON_CLASS =
  "inline-flex items-center justify-center gap-2 rounded-full bg-black px-6 py-3.5 text-xs font-semibold text-white transition-all duration-300 hover:bg-black/80 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50";

const DEFAULT_ITEMS = [
  {
    id: "product-1",
    name: "Essential Everyday Shirt",
    variant: "Black / Medium",
    price: 1260,
    quantity: 1,
    image: "",
  },
  {
    id: "product-2",
    name: "Classic Cotton T-Shirt",
    variant: "White / Large",
    price: 890,
    quantity: 1,
    image: "",
  },
];

const SHIPPING_OPTIONS = [
  {
    id: "inside",
    label: "Inside Dhaka",
    description: "Standard delivery",
    price: 70,
  },
  {
    id: "outside",
    label: "Outside Dhaka",
    description: "Standard delivery",
    price: 130,
  },
];

const PAYMENT_OPTIONS = [
  {
    id: "cod",
    title: "Cash on Delivery",
    description: "Pay when your order arrives",
  },
  {
    id: "bkash",
    title: "bKash",
    description: "Pay using your bKash account",
  },
  {
    id: "card",
    title: "Debit / Credit Card",
    description: "Pay securely by card",
  },
];

const formatPrice = (amount) =>
  `৳${Number(amount || 0).toLocaleString("en-BD")}`;

const CheckOut = ({
  cartItems = DEFAULT_ITEMS,
  onPlaceOrder,
}) => {
  const [step, setStep] = useState("checkout");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [shippingLocation, setShippingLocation] = useState("inside");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    area: "",
    postalCode: "",
    notes: "",
  });

  const [order, setOrder] = useState(null);

  const items = useMemo(
    () =>
      cartItems.filter(
        (item) => Number(item.quantity) > 0 && Number(item.price) >= 0
      ),
    [cartItems]
  );

  const subtotal = useMemo(
    () =>
      items.reduce(
        (total, item) =>
          total + Number(item.price) * Number(item.quantity),
        0
      ),
    [items]
  );

  const shippingCost =
    SHIPPING_OPTIONS.find((option) => option.id === shippingLocation)?.price ??
    70;

  const discount =
    appliedCoupon === "WELCOME10" ? Math.round(subtotal * 0.1) : 0;

  const discountedSubtotal = subtotal - discount;
  const originalTotal = subtotal + shippingCost;
  const total = discountedSubtotal + shippingCost;

  const updateField = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const handleApplyCoupon = () => {
    setError("");

    const normalizedCoupon = coupon.trim().toUpperCase();

    if (normalizedCoupon === "WELCOME10" && subtotal > 0) {
      setAppliedCoupon(normalizedCoupon);
      setCoupon(normalizedCoupon);
    } else {
      setAppliedCoupon("");
      setError("This coupon is invalid or cannot be applied.");
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError("");

    if (items.length === 0) {
      setError("Your cart is empty. Add products before checking out.");
      return;
    }

    if (!/^[0-9]{11}$/.test(formData.phone.trim())) {
      setError("Enter a valid 11-digit Bangladesh phone number.");
      return;
    }

    setIsSubmitting(true);

    const orderData = {
      customer: {
        ...formData,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
      },
      items: items.map((item) => ({
        productId: item.id,
        name: item.name,
        variant: item.variant,
        price: Number(item.price),
        quantity: Number(item.quantity),
      })),
      shippingLocation,
      shippingCost,
      paymentMethod,
      coupon: appliedCoupon || null,
      subtotal,
      discount,
      total,
    };

    try {
      if (onPlaceOrder) {
        // Use your backend/API through this callback.
        const result = await onPlaceOrder(orderData);

        setOrder({
          ...orderData,
          orderId: result?.orderId || result?._id || null,
        });

        setStep("success");
      } else {
        // Preview mode: no real order is submitted.
        setError(
          "Checkout preview only. Connect your order API to place an order."
        );
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to place your order. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderHeading = (eyebrow, title, description) => (
    <div className="mb-7">
      <div className="mb-3 flex items-center gap-2.5">
        <span className="h-px w-8 bg-black" />
        <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-black/45">
          {eyebrow}
        </span>
      </div>

      <h2 className="text-xl font-bold leading-tight tracking-[-0.04em] text-black sm:text-2xl">
        {title}
      </h2>

      {description && (
        <p className="mt-2 text-xs leading-relaxed text-black/45">
          {description}
        </p>
      )}
    </div>
  );

  const renderSectionTitle = (number, title, description, Icon) => (
    <div className="mb-6 flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-black text-white">
        <Icon size={16} strokeWidth={1.7} />
      </div>

      <div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold text-black/35">
            {number}
          </span>

          <h3 className="text-sm font-bold tracking-tight text-black">
            {title}
          </h3>
        </div>

        <p className="mt-1 text-[11px] leading-relaxed text-black/45">
          {description}
        </p>
      </div>
    </div>
  );

  if (step === "success") {
    return (
      <section className="min-h-[70vh] bg-bg-primary px-5 pb-16 pt-0 font-primary sm:px-8 lg:px-12">
        <header className="sticky top-0 z-50 -mx-5 mb-10 flex justify-center bg-white/95 px-5 py-7 backdrop-blur-sm sm:-mx-8 lg:-mx-12">
          <Link
            to="/"
            className="text-2xl font-bold tracking-tight text-gray-900"
          >
            BachelorShop
          </Link>
        </header>

        <div className="mx-auto max-w-xl rounded-2xl border border-black/10 bg-white px-6 py-12 text-center shadow-sm sm:px-12">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-black text-white">
            <CheckCircle2 size={30} strokeWidth={1.7} />
          </div>

          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-black/40">
            Thank You For Your Order
          </p>

          <h1 className="text-2xl font-bold tracking-[-0.05em] text-black sm:text-3xl">
            Order placed successfully.
          </h1>

          <p className="mx-auto mt-4 max-w-sm text-xs leading-relaxed text-black/50">
            Thank you, {order?.customer?.firstName}. Your order has been
            submitted. We'll use your delivery information to process it.
          </p>

          {order?.orderId && (
            <div className="mt-7 rounded-xl border border-black/10 bg-neutral-50/50 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-black/40">
                Order Reference
              </p>

              <p className="mt-2 break-all text-sm font-bold text-black">
                {order.orderId}
              </p>
            </div>
          )}

          <div className="my-7 flex items-center justify-between border-y border-black/10 py-4 text-xs">
            <span className="text-black/45">Order total</span>
            <span className="font-bold text-black">
              {formatPrice(order?.total)}
            </span>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link to="/" className={BUTTON_CLASS}>
              Continue Shopping
              <ArrowRight size={14} />
            </Link>

            <Link
              to="/my-orders"
              className={`${BUTTON_CLASS} border border-black/15 bg-white text-black hover:bg-neutral-100`}
            >
              View My Orders
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-bg-primary px-5 pb-16 pt-0 font-primary sm:px-8 lg:px-12">
      {/* Brand Header */}
      {/* <header className="sticky top-0 z-50 -mx-5 mb-8 flex items-center justify-between bg-white/95 px-5 py-5 backdrop-blur-sm sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12">
        <Link
          to="/"
          className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl"
        >
          BachelorShop
        </Link>

        <div className="flex items-center gap-2 text-black/45">
          <LockKeyhole size={14} />
          <span className="text-[10px] font-semibold uppercase tracking-[0.15em]">
            Secure Checkout
          </span>
        </div>
      </header> */}

      {/* Page Heading */}
      <div className="mb-10 flex w-full flex-col justify-between gap-5 md:flex-row md:items-end md:gap-10">
        <div>
          <div className="mb-3 flex items-center gap-2.5">
            <span className="h-px w-8 bg-black" />

            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-black/45">
              Almost Yours
            </span>
          </div>

          <h1 className="text-[clamp(2rem,4.5vw,3.5rem)] font-bold leading-[0.98] tracking-[-0.055em] text-black">
            Checkout.
          </h1>
        </div>

        <p className="max-w-md text-xs leading-relaxed text-black/45 sm:text-sm md:ml-auto md:text-right">
          You're one step away from your next favorite look. Confirm your
          delivery details and choose how you'd like to pay.
        </p>
      </div>

      {/* Checkout Layout */}
      <form
        onSubmit={handlePlaceOrder}
        className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.8fr)] lg:gap-14"
      >
        {/* Left: Checkout Details */}
        <div className="min-w-0 space-y-10">
          {/* Contact Information */}
          <section className="border-b border-black/10 pb-10">
            <div className="mb-7">
              <div className="mb-3 flex items-center gap-2.5">
                <UserRound size={14} strokeWidth={1.8} className="text-black/55" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-black/45">
                  01 / Your Details
                </span>
              </div>

              <h2 className="text-xl font-bold leading-tight tracking-[-0.04em] text-black sm:text-2xl">
                Contact information
              </h2>

              <p className="mt-2 text-xs leading-relaxed text-black/45">
                Where can we reach you about your order?
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="email" className={LABEL_CLASS}>
                  Email Address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={updateField}
                  maxLength={254}
                  required
                  className={INPUT_CLASS}
                />
              </div>

              <div>
                <label htmlFor="firstName" className={LABEL_CLASS}>
                  First Name
                </label>

                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={updateField}
                  maxLength={80}
                  required
                  className={INPUT_CLASS}
                />
              </div>

              <div>
                <label htmlFor="lastName" className={LABEL_CLASS}>
                  Last Name
                </label>

                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  autoComplete="family-name"
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={updateField}
                  maxLength={80}
                  required
                  className={INPUT_CLASS}
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="phone" className={LABEL_CLASS}>
                  Phone Number
                </label>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  placeholder="01XXXXXXXXX"
                  value={formData.phone}
                  onChange={updateField}
                  pattern="[0-9]{11}"
                  maxLength={11}
                  required
                  className={INPUT_CLASS}
                />

                <p className="mt-2 text-[10px] text-black/40">
                  Enter your 11-digit Bangladesh mobile number.
                </p>
              </div>
            </div>
          </section>

          {/* Delivery Address */}
          <section className="border-b border-black/10 pb-10">
            {renderSectionTitle(
              "02",
              "Delivery address",
              "Where should we deliver your order?",
              MapPin
            )}

            <div className="space-y-5">
              <div>
                <label htmlFor="address" className={LABEL_CLASS}>
                  Street Address
                </label>

                <input
                  id="address"
                  name="address"
                  type="text"
                  autoComplete="street-address"
                  placeholder="House number, street, road"
                  value={formData.address}
                  onChange={updateField}
                  maxLength={250}
                  required
                  className={INPUT_CLASS}
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="city" className={LABEL_CLASS}>
                    City / District
                  </label>

                  <input
                    id="city"
                    name="city"
                    type="text"
                    autoComplete="address-level2"
                    placeholder="e.g. Dhaka"
                    value={formData.city}
                    onChange={updateField}
                    maxLength={100}
                    required
                    className={INPUT_CLASS}
                  />
                </div>

                <div>
                  <label htmlFor="area" className={LABEL_CLASS}>
                    Area / Upazila
                  </label>

                  <input
                    id="area"
                    name="area"
                    type="text"
                    placeholder="Enter your area"
                    value={formData.area}
                    onChange={updateField}
                    maxLength={100}
                    required
                    className={INPUT_CLASS}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="postalCode" className={LABEL_CLASS}>
                    Postal Code
                  </label>

                  <input
                    id="postalCode"
                    name="postalCode"
                    type="text"
                    inputMode="numeric"
                    autoComplete="postal-code"
                    placeholder="Postal code (optional)"
                    value={formData.postalCode}
                    onChange={updateField}
                    maxLength={12}
                    className={INPUT_CLASS}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Shipping Method */}
          <section className="border-b border-black/10 pb-10">
            {renderSectionTitle(
              "03",
              "Shipping method",
              "Choose the delivery option for your location.",
              Truck
            )}

            <div className="space-y-3">
              {SHIPPING_OPTIONS.map((option) => (
                <label
                  key={option.id}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-all duration-300 ${
                    shippingLocation === option.id
                      ? "border-black bg-neutral-50"
                      : "border-black/10 hover:border-black/30"
                  }`}
                >
                  <input
                    type="radio"
                    name="shippingLocation"
                    value={option.id}
                    checked={shippingLocation === option.id}
                    onChange={() => setShippingLocation(option.id)}
                    className="h-3.5 w-3.5 accent-black"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-black">
                      {option.label}
                    </p>

                    <p className="mt-1 text-[10px] text-black/45">
                      {option.description}
                    </p>
                  </div>

                  <span className="text-xs font-semibold text-black">
                    {formatPrice(option.price)}
                  </span>
                </label>
              ))}
            </div>
          </section>

          {/* Payment Method */}
          <section className="border-b border-black/10 pb-10">
            {renderSectionTitle(
              "04",
              "Payment method",
              "Select your preferred payment option.",
              CreditCard
            )}

            <div className="space-y-3">
              {PAYMENT_OPTIONS.map((option) => (
                <label
                  key={option.id}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-all duration-300 ${
                    paymentMethod === option.id
                      ? "border-black bg-neutral-50"
                      : "border-black/10 hover:border-black/30"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={option.id}
                    checked={paymentMethod === option.id}
                    onChange={() => setPaymentMethod(option.id)}
                    className="h-3.5 w-3.5 accent-black"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-black">
                      {option.title}
                    </p>

                    <p className="mt-1 text-[10px] leading-relaxed text-black/45">
                      {option.description}
                    </p>
                  </div>

                  {option.id === "cod" && (
                    <Package size={17} className="shrink-0 text-black/45" />
                  )}

                  {option.id === "bkash" && (
                    <span className="text-xs font-bold text-black">
                      bKash
                    </span>
                  )}

                  {option.id === "card" && (
                    <CreditCard
                      size={17}
                      className="shrink-0 text-black/45"
                    />
                  )}
                </label>
              ))}
            </div>

            {paymentMethod !== "cod" && (
              <p className="mt-4 rounded-xl bg-neutral-50 p-4 text-[11px] leading-relaxed text-black/55">
                Your selected payment method will require the appropriate
                payment gateway integration before checkout can be completed.
              </p>
            )}
          </section>

          {/* Order Notes */}
          <section>
            {renderSectionTitle(
              "05",
              "Additional notes",
              "Any special instructions for your delivery? (Optional)",
              Package
            )}

            <div>
              <label htmlFor="notes" className={LABEL_CLASS}>
                Order Notes
              </label>

              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={updateField}
                placeholder="Delivery instructions or other requests..."
                rows={3}
                maxLength={500}
                className={`${INPUT_CLASS} resize-y`}
              />
            </div>
          </section>

          {error && (
            <p
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs leading-relaxed text-red-700"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting || items.length === 0}
            className={`${BUTTON_CLASS} w-full lg:hidden`}
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin">
                  <LockKeyhole size={14} />
                </span>
                Processing Order...
              </>
            ) : (
              <>
                Place Order · {formatPrice(total)}
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </div>

        {/* Right: Order Summary */}
        <aside className="min-w-0 lg:sticky lg:top-24">
          <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6 flex items-center justify-between border-b border-black/10 pb-5">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-black/40">
                  Your Selection
                </p>

                <h2 className="mt-2 text-lg font-bold tracking-tight text-black">
                  Order Summary
                </h2>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-50 text-black">
                <ShoppingBag size={18} />
              </div>
            </div>

            {/* Cart Items */}
            <div className="space-y-5">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4"
                >
                  <div className="relative flex h-20 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-neutral-100">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Package
                        size={20}
                        strokeWidth={1.3}
                        className="text-black/25"
                      />
                    )}

                    <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-black px-1 text-[9px] font-semibold text-white">
                      {item.quantity}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1 py-1">
                    <h3 className="text-xs font-semibold leading-relaxed text-black">
                      {item.name}
                    </h3>

                    {item.variant && (
                      <p className="mt-1 text-[10px] text-black/45">
                        {item.variant}
                      </p>
                    )}

                    <p className="mt-2 text-xs font-semibold text-black">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}

              {items.length === 0 && (
                <p className="py-5 text-center text-xs text-black/45">
                  Your shopping bag is empty.
                </p>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-black/50">
                  Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)}{" "}
                  items)
                </span>

                <span className="flex flex-wrap items-center justify-end gap-2 font-medium text-black">
                  {discount > 0 && (
                    <span className="text-[10px] text-black/35 line-through">
                      {formatPrice(subtotal)}
                    </span>
                  )}
                  <span>{formatPrice(discountedSubtotal)}</span>
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-black/50">Shipping</span>

                <span className="font-medium text-black">
                  {formatPrice(shippingCost)}
                </span>
              </div>

              {discount > 0 && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-black/50">Discount</span>

                  <span className="font-medium text-black">
                    -{formatPrice(discount)}
                  </span>
                </div>
              )}

              {/* Coupon */}
              <div className="border-y border-black/10 py-5">
                <label htmlFor="coupon" className={LABEL_CLASS}>
                  Discount Code
                </label>

                <div className="flex gap-2">
                  <input
                    id="coupon"
                    type="text"
                    value={coupon}
                    onChange={(e) => {
                      setCoupon(e.target.value);
                      setError("");
                    }}
                    placeholder="Enter code"
                    className={`${INPUT_CLASS} min-w-0`}
                  />

                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="shrink-0 rounded-xl border border-black/15 px-4 text-[10px] font-semibold text-black transition-colors hover:bg-black hover:text-white"
                  >
                    Apply
                  </button>
                </div>

                {appliedCoupon && (
                  <div className="mt-3 flex items-center justify-between text-[10px] text-black/55">
                    <span>WELCOME10 applied</span>

                    <button
                      type="button"
                      onClick={() => {
                        setAppliedCoupon("");
                        setCoupon("");
                      }}
                      className="font-semibold underline underline-offset-2"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between border-t border-black/10 pt-5">
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

            {/* Desktop Submit */}
            <button
              type="submit"
              disabled={isSubmitting || items.length === 0}
              className={`${BUTTON_CLASS} mt-7 hidden w-full lg:inline-flex`}
            >
              {isSubmitting ? (
                <>
                  <LockKeyhole size={14} />
                  Processing Order...
                </>
              ) : (
                <>
                  Place Order
                  <ArrowRight size={14} />
                </>
              )}
            </button>

            <div className="mt-5 flex items-start gap-2">
              <ShieldCheck
                size={15}
                className="mt-0.5 shrink-0 text-black/40"
              />

              <p className="text-[10px] leading-relaxed text-black/40">
                Your personal information is handled securely. Payment
                processing must be configured before accepting online payments.
              </p>
            </div>

            <Link
              to="/cart"
              className="mt-6 flex items-center justify-center gap-2 border-t border-black/10 pt-5 text-[11px] font-semibold text-black/50 transition-colors hover:text-black"
            >
              <ArrowLeft size={13} />
              Return to Shopping Bag
            </Link>
          </div>

          <div className="mt-5 flex items-center justify-center gap-6 text-[10px] text-black/35">
            <span className="flex items-center gap-1.5">
              <LockKeyhole size={12} />
              Secure checkout
            </span>

            <span className="flex items-center gap-1.5">
              <Truck size={13} />
              Reliable delivery
            </span>
          </div>
        </aside>
      </form>
    </section>
  );
};

export default CheckOut;