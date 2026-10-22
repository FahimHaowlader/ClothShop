
import React, { useMemo, useState } from "react";
import { Link } from "react-router";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CreditCard,
  LockKeyhole,
  MapPin,
  Package,
  ShieldCheck,
  ShoppingBag,
  Truck,
  UserRound,
  X,
  Tag,
} from "lucide-react";

const INPUT_CLASS =
  "w-full rounded-xl border border-black/10 bg-neutral-50/30 px-3.5 py-3 text-xs text-black transition-all duration-300 placeholder:text-black/30 focus:border-black focus:outline-none disabled:opacity-50";

const LABEL_CLASS =
  "mb-1.5 block text-[10px] font-bold uppercase tracking-[0.15em] text-black/45";

const BUTTON_CLASS =
  "inline-flex items-center justify-center gap-2 rounded-full border border-black/15 bg-white px-6 py-3.5 text-xs font-semibold text-black hover:bg-black hover:text-white transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] active:scale-95 cursor-pointer shadow-sm disabled:pointer-events-none disabled:opacity-75";

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
    id: "product-1-2",
    name: "Essential Everyday Shirt",
    variant: "Black / Medium",
    price: 1260,
    quantity: 1,
    image: "",
  },
  {
    id: "product-1-3",
    name: "Essential Everyday Shirt",
    variant: "Black / Medium",
    price: 1260,
    quantity: 1,
    image: "",
  },
  {
    id: "product-1-4",
    name: "Essential Everyday Shirt",
    variant: "Black / Medium",
    price: 1260,
    quantity: 1,
    image: "",
  },
  {
    id: "product-1-5",
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
    id: "online",
    title: "Online Payment",
    description: "Pay securely using your preferred payment method",
  },
];

const formatPrice = (amount) =>
  `৳${Number(amount || 0).toLocaleString("en-BD")}`;

const CheckOut = ({ cartItems = DEFAULT_ITEMS, onPlaceOrder, onPayNow }) => {
  const [couponCode, setCouponCode] = useState("");
  const [showCouponInput, setShowCouponInput] = useState(false);
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

  // Any non-empty coupon code gives a 25% discount.
  const discount =
    appliedCoupon && subtotal > 0 ? Math.round(subtotal * 0.25) : 0;

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

    const normalizedCoupon = couponCode.trim();

    if (!normalizedCoupon) {
      setAppliedCoupon("");
      setError("Please enter a coupon code.");
      return false;
    }

    if (subtotal <= 0) {
      setError("Add products to your bag before applying a coupon.");
      return false;
    }

    setAppliedCoupon(normalizedCoupon);
    setCoupon(normalizedCoupon);
    return true;
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon("");
    setCoupon("");
    setCouponCode("");
    setShowCouponInput(false);
    setError("");
  };

  const handleSubmit = async (e) => {
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

    if (
      paymentMethod === "online" &&
      typeof onPayNow !== "function"
    ) {
      setError(
        "Online payment is not configured yet. Connect your payment gateway to continue."
      );
      return;
    }

    const orderData = {
      customer: {
        ...formData,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        area: formData.area.trim(),
        postalCode: formData.postalCode.trim(),
        notes: formData.notes.trim(),
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

    setIsSubmitting(true);

    try {
      if (paymentMethod === "online") {
        // onPayNow should initiate the real payment gateway checkout.
        await onPayNow(orderData);
        return;
      }

      if (typeof onPlaceOrder !== "function") {
        setError(
          "Checkout preview only. Connect your order API to confirm your order."
        );
        return;
      }

      const result = await onPlaceOrder(orderData);

      setOrder({
        ...orderData,
        orderId: result?.orderId || result?._id || null,
      });

      setStep("success");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to process your request. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

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
      {/* Page Heading */}
      <div className="mb-10 flex w-full flex-col justify-between gap-5 md:flex-row md:items-end md:gap-10 pt-5">
        <div>
          <div className="mb-2 flex items-center gap-2.5">
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
           Confirm your delivery details and choose <br/> how you'd like to pay.
        </p>
      </div>

      {/* Checkout Layout */}
      <form
        onSubmit={handleSubmit}
        className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.8fr)] lg:gap-14"
      >
        {/* Left: Checkout Details */}
        <div className="min-w-0 space-y-10">
          {/* Contact Information */}
          <section className="border-b border-black/10 pb-10">
            {renderSectionTitle(
              "01",
              "Contact information",
              "Where can we reach you about your order?",
              UserRound
            )}

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
                    onChange={() => {
                      setPaymentMethod(option.id);
                      setError("");
                    }}
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

                  {option.id === "cod" ? (
                    <Package
                      size={17}
                      className="shrink-0 text-black/45"
                    />
                  ) : (
                    <CreditCard
                      size={17}
                      className="shrink-0 text-black/45"
                    />
                  )}
                </label>
              ))}
            </div>

            {paymentMethod === "online" && (
              <div className="mt-4 rounded-xl bg-neutral-50 p-4">
                <div className="flex items-start gap-2.5">
                  <LockKeyhole
                    size={15}
                    className="mt-0.5 shrink-0 text-black/50"
                  />

                  <p className="text-[11px] leading-relaxed text-black/55">
                    Go to secure payment. Your payment details are fully safe
                    and encrypted—get them ready to finish your purchase.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || items.length === 0}
                  className={`${BUTTON_CLASS} mt-4 w-full`}
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin">
                        <LockKeyhole size={14} />
                      </span>
                      Processing Payment...
                    </>
                  ) : (
                    <>
                     <span>Pay Now </span>  
                     
                    </>
                  )}
                </button>
              </div>
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

            {/* Scrollable cart items */}
            <div className="mb-6 max-h-44 space-y-5 overflow-y-auto overscroll-contain pr-2 [scrollbar-color:rgba(0,0,0,0.2)_transparent] [scrollbar-width:thin]">
              {items.map((item, index) => (
                <div
                  key={`${item.id}-${index}`}
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
              {/* Subtotal */}
              <div className="flex items-center justify-between gap-3 text-xs">
                <span className="text-black/50">
                  Subtotal (
                  {items.reduce(
                    (sum, item) => sum + Number(item.quantity),
                    0
                  )}{" "}
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

              {/* Shipping */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-black/50">Shipping</span>

                <span className="font-medium text-black">
                  {formatPrice(shippingCost)}
                </span>
              </div>

              {/* Discount */}
              {discount > 0 && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-black/50">
                    Coupon discount (25%)
                  </span>

                  <span className="font-medium text-black">
                    -{formatPrice(discount)}
                  </span>
                </div>
              )}

              {/* Total */}
              <div className="flex items-center justify-between gap-3 border-t border-black/10 pt-5">
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

              {/* Coupon Section */}
              
<div className="border-t border-black/10 pt-5">
  {!appliedCoupon ? (
  <>
  {!showCouponInput ? (
    <button
      type="button"
      onClick={() => setShowCouponInput(true)}
      className="group flex w-full items-center justify-between gap-3 text-left hover:cursor-pointer"
    >
      <span className="flex items-center gap-2.5">
        <span className="relative inline-block pb-0.5 text-xs font-bold text-black">
          Have a coupon code ?
          <span className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-100 bg-black/80 transition-all duration-300 ease-out group-hover:bg-black/40" />
        </span>
      </span>

      <ArrowRight
        size={15}
        className="shrink-0 text-black/40 transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:text-black"
      />
    </button>
  ) : (
    <div className="animate-in fade-in slide-in-from-top-1 space-y-3 duration-300">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-bold tracking-tight text-black">
          Coupon code
        </p>

        <button
          type="button"
          onClick={() => {
            setShowCouponInput(false);
            setCouponCode("");
            setError("");
          }}
          aria-label="Close coupon input"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-black/45 transition-all duration-300 ease-out hover:rotate-90 hover:bg-black/5 hover:text-black active:scale-90"
        >
          <X size={15} />
        </button>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={couponCode}
          onChange={(e) => {
            setCouponCode(e.target.value);
            setError("");
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();

              if (handleApplyCoupon()) {
                setShowCouponInput(false);
              }
            }
          }}
          placeholder="Enter coupon code"
          aria-label="Coupon code"
          className={`${INPUT_CLASS} min-w-0 flex-1 transition-all duration-300 ease-out focus:border-black focus:ring-1 focus:ring-black/10`}
        />

        <button
          type="button"
          onClick={() => {
            if (handleApplyCoupon()) {
              setShowCouponInput(false);
            }
          }}
          disabled={!couponCode.trim()}
          className="inline-flex shrink-0 cursor-pointer items-center justify-center border border-black/10 rounded-xl bg-white px-5 py-3 text-xs font-semibold text-black transition-all duration-300 ease-out hover:bg-black active:scale-[0.97] disabled:cursor-not-allowed hover:text-white "
        >
          Apply
        </button>
      </div>

      {error && (
        <p
          role="alert"
          className="animate-in fade-in slide-in-from-top-1 text-[10px] leading-relaxed text-black/60 duration-200"
        >
          {error}
        </p>
      )}
    </div>
  )}
</>
  ) : (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-black/10 bg-neutral-50/50 p-4 animate-in fade-in slide-in-from-bottom-1 duration-300">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-black text-white transition-transform duration-300">
          <CheckCircle2 size={16} strokeWidth={1.7} />
        </div>

        <div className="min-w-0">
          <p className="text-xs font-bold tracking-tight text-black">
            <span className="uppercase">{appliedCoupon}</span>{" "}
            Applied
          </p>

          <p className="mt-1 text-[10px] text-black/45">
            Your 25% discount has been applied.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={handleRemoveCoupon}
        className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-black/10 bg-white px-3 py-2 text-[10px] font-semibold text-black transition-all duration-300 ease-out hover:border-black hover:bg-black hover:text-white active:scale-[0.97]"
      >
        <X
          size={13}
          className="transition-transform duration-300 group-hover:rotate-90"
        />
        Remove
      </button>
    </div>
  )}
</div>

            </div>

            {/* Security Notice */}
            <div className="mt-5 flex items-start gap-2">
              <ShieldCheck
                size={15}
                className="mt-0.5 shrink-0 text-black/40"
              />

              <p className="text-[10px] leading-relaxed text-black/40">
                Your personal information is handled securely.
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
