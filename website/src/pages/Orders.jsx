import React, { useState } from "react";
import { Link } from "react-router";
import {
  Package,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  ChevronRight,
  MapPin,
  ExternalLink,
  ShoppingBag,
  RefreshCw,
  Sparkles,
} from "lucide-react";

// Mock Sample Orders Data with Original and Discounted Pricing
const INITIAL_ORDERS = [
  {
    id: "BS-89021",
    date: "October 18, 2026",
    total: 252.0,
    originalTotal: 360.0,
    status: "In Transit", // "Delivered" | "In Transit" | "Processing" | "Cancelled"
    itemsCount: 2,
    shippingAddress: "House 42, Road 11, Banani, Dhaka",
    trackingNumber: "EXP-9082314-BD",
    items: [
      {
        id: "prod-1",
        sku: "SKU-90823",
        name: "Levi's essential western shirt",
        price: 126,
        originalPrice: 180,
        color: "Indianred",
        colorValue: "#58732f",
        size: "S",
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
        slug: "levis-essential-western",
      },
      {
        id: "prod-2",
        sku: "SKU-90824",
        name: "Hoodie with embroidered slogan",
        price: 126,
        originalPrice: 180,
        color: "Black",
        colorValue: "#000000",
        size: "M",
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=800&q=80",
        slug: "hoodie-embroidered-slogan",
      },
    ],
  },
  {
    id: "BS-76512",
    date: "September 24, 2026",
    total: 180.0,
    originalTotal: 220.0,
    status: "Delivered",
    itemsCount: 1,
    shippingAddress: "House 42, Road 11, Banani, Dhaka",
    trackingNumber: "EXP-7712390-BD",
    items: [
      {
        id: "prod-3",
        sku: "SKU-76512",
        name: "Oversized Minimalist Heavyweight Tee",
        price: 180,
        originalPrice: 220,
        color: "White",
        colorValue: "#ffffff",
        size: "L",
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
        slug: "oversized-heavyweight-tee",
      },
    ],
  },
];

const SUGGESTED_CATEGORIES = [
  { name: "New Arrivals", path: "/category/new-arrivals" },
  { name: "Best Sellers", path: "/category/best-sellers" },
  { name: "Hoodies & Sweatshirts", path: "/category/hoodies" },
  { name: "Urban Essentials", path: "/category/essentials" },
];

const Orders = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [expandedOrder, setExpandedOrder] = useState(INITIAL_ORDERS[0]?.id);

  // Tab Filtering
  const tabs = ["All", "In Transit", "Delivered", "Cancelled"];

  const filteredOrders = INITIAL_ORDERS.filter((order) => {
    if (activeTab === "All") return true;
    return order.status.toLowerCase() === activeTab.toLowerCase();
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "Delivered":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-black/5 px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-black">
            <CheckCircle2 size={11} strokeWidth={2} />
            Delivered
          </span>
        );
      case "In Transit":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-black/15 bg-black px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-white shadow-2xs">
            <Truck size={11} strokeWidth={2} />
            In Transit
          </span>
        );
      case "Processing":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-neutral-100 px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-black/70">
            <Clock size={11} strokeWidth={2} />
            Processing
          </span>
        );
      case "Cancelled":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-red-600">
            <XCircle size={11} strokeWidth={2} />
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <section className="w-full font-primary px-5 py-5 sm:px-8 lg:px-12">
      <div>
        {/* Page Header */}
        <div className="mb-7 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2.5">
              <span className="h-px w-8 bg-black" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-black/45">
                Order History
              </span>
            </div>
            <h1 className="text-[clamp(2rem,4vw,3.5rem)] font-bold leading-[0.9] tracking-[-0.06em] text-black">
              My Orders
            </h1>
          </div>

          <p className="hidden text-right text-xs sm:text-sm leading-relaxed text-black/40 md:block max-w-xl">
            Track active shipments, view receipts and review
            <br />
             your previous purchases.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-8 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-full px-4 sm:px-5 py-2 text-xs font-semibold transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] cursor-pointer whitespace-nowrap active:scale-95 ${
                activeTab === tab
                  ? "bg-black text-white shadow-sm"
                  : "bg-neutral-50/60 border border-black/10 text-black/60 hover:border-black hover:text-black"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {filteredOrders.length > 0 ? (
          <div className="space-y-6">
            {filteredOrders.map((order) => {
              const isExpanded = expandedOrder === order.id;

              return (
                <div
                  key={order.id}
                  className="rounded-2xl border border-black/5 bg-white p-6 sm:p-8 shadow-2xs transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] hover:border-black/20"
                >
                  {/* Top Order Meta */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/10 pb-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white shadow-md shadow-black/10">
                        <Package size={20} strokeWidth={1.8} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold tracking-tight text-black">
                            {order.id}
                          </h3>
                          {getStatusBadge(order.status)}
                        </div>
                        <p className="text-[11px] font-medium text-black/45 mt-0.5">
                          Placed on {order.date} • {order.itemsCount}{" "}
                          {order.itemsCount === 1 ? "Item" : "Items"}
                        </p>
                      </div>
                    </div>

                    <div className="flex  items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t border-black/5 sm:border-t-0">
                      <div >
                        <span className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-black/40">
                          Total Amount
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-base font-bold text-black">
                            ${order.total.toFixed(2)}
                          </span>
                          {order.originalTotal && (
                            <span className="relative text-xs text-black/40">
                              ${order.originalTotal.toFixed(2)}
                              <span className="absolute inset-x-0 top-[43%] h-[1px] -translate-y-1/2 bg-black/50" />
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setExpandedOrder(isExpanded ? null : order.id)
                        }
                        className="inline-flex w-28 items-center gap-1 text-xs font-semibold text-black hover:underline cursor-pointer"
                      >
                        <span>{isExpanded ? "Hide Details" : "View Details"}</span>
                        <ChevronRight
                          size={15}
                          className={`transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${
                            isExpanded ? "rotate-90" : ""
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Order Items List */}
                  <div className="mt-4 space-y-4">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-4 rounded-xl border border-black/5 bg-neutral-50/40 p-3.5 transition-all duration-300"
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-20 w-14 shrink-0 rounded-lg object-cover border border-black/5"
                          />
                          <div className="min-w-0">
                            <span className="text-[11px] font-medium text-black/45">
                              SKU: {item.sku}
                            </span>
                            <Link
                              to={`/product/${item.slug}`}
                              className="line-clamp-1 text-xs font-bold text-black hover:underline"
                            >
                              {item.name}
                            </Link>
                            
                            {/* Desktop view: single line */}
                            <div className="hidden sm:mt-1 sm:flex items-center gap-2 text-[11px] text-black/50 font-medium">
                              <span>Size: {item.size}</span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                Color:
                                <span
                                  className="h-2 w-2 rounded-full border border-black/20"
                                  style={{ backgroundColor: item.colorValue }}
                                />
                                {item.color}
                              </span>
                              <span>•</span>
                              <span>Qty: {item.quantity}</span>
                            </div>

                            {/* Mobile view: Color up, Size & Qty below */}
                            <div className="mt-1 flex flex-col gap-0.5 sm:hidden text-[11px] text-black/50 font-medium">
                              <span className="flex items-center gap-1">
                                Color:
                                <span
                                  className="h-2 w-2 rounded-full border border-black/20"
                                  style={{ backgroundColor: item.colorValue }}
                                />
                                {item.color}
                              </span>
                              <div className="flex items-center gap-2">
                                <span>Size: {item.size}</span>
                                <span>•</span>
                                <span>Qty: {item.quantity}</span>
                              </div>
                            </div>

                          </div>
                        </div>

                        {/* Item Price with Strikethrough Original Price */}
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs font-bold text-black">
                            ${item.price}
                          </span>
                          {item.originalPrice && (
                            <span className="relative text-[11px] text-black/40">
                              ${item.originalPrice}
                              <span className="absolute inset-x-0 top-[43%] h-[1px] -translate-y-1/2 bg-black/50" />
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Expanded Details Section */}
                  {isExpanded && (
                    <div className="mt-4 border-t border-black/10 pt-4 animate-in fade-in duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 rounded-xl border border-black/10 bg-neutral-50/30">
                        {/* Delivery Address */}
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-black/40 text-[10px] font-semibold uppercase tracking-[0.15em]">
                            <MapPin size={13} />
                            <span>Delivery Address</span>
                          </div>
                          <p className="text-xs font-semibold text-black leading-relaxed">
                            {order.shippingAddress}
                          </p>
                        </div>

                        {/* Tracking Number */}
                        <div className="space-y-1 sm:text-right">
                          <div className="flex items-center gap-1.5 text-black/40 text-[10px] font-semibold uppercase tracking-[0.15em] sm:justify-end">
                            <Truck size={13} />
                            <span>Tracking ID</span>
                          </div>
                          <p className="text-xs font-semibold text-black font-mono">
                            {order.trackingNumber}
                          </p>
                        </div>
                      </div>

                      {/* Bottom Order Actions */}
                      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                        <button
                          type="button"
                          className="inline-flex items-center gap-2 rounded-full border border-black/20 bg-white px-6 py-2.5 text-xs font-semibold text-black hover:bg-black hover:text-white transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] active:scale-95 cursor-pointer shadow-sm"
                        >
                          <RefreshCw size={13} />
                          <span>Buy Again</span>
                        </button>

                        <button
                          type="button"
                          className="inline-flex items-center gap-2 rounded-full border border-black/20 bg-white px-6 py-2.5 text-xs font-semibold text-black hover:bg-black hover:text-white transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] active:scale-95 cursor-pointer shadow-sm"
                        >
                          <span>Track Package</span>
                          <ExternalLink size={13} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty Orders State matching EmptyBag style */
          <div className="relative w-full overflow-hidden px-5 py-5 font-primary sm:px-8 lg:px-12  ">
            <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
              {/* Animated Icon Container */}
              <div className="group relative mb-8 flex h-24 w-24 items-center justify-center rounded-full border border-black/10 bg-black/[0.02] transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] hover:scale-105 hover:border-black hover:bg-black sm:h-28 sm:w-28">
                {/* Subtle Ambient Pulse Background */}
                <div className="absolute inset-0 -z-10 rounded-full bg-black/5 blur-xl transition-all duration-700 group-hover:bg-black/20" />

                {/* Floating Sparkle Accent Badge */}
                <span className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full border border-black/10 bg-white text-black shadow-xs transition-all duration-500 ease-out group-hover:rotate-12 group-hover:scale-110">
                  <Sparkles size={13} strokeWidth={2} />
                </span>

                <ShoppingBag
                  size={36}
                  strokeWidth={1.4}
                  className="text-black transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-110 group-hover:text-white sm:size-10"
                />
              </div>

              {/* Section Tag */}
              <div className="mb-3 flex items-center justify-center gap-2.5">
                <span className="h-px w-6 bg-black/20" />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/45">
                  No Orders Found
                </span>
                <span className="h-px w-6 bg-black/20" />
              </div>

              {/* Main Heading */}
              <h2 className="text-2xl font-bold tracking-tight text-black sm:text-3xl md:text-4xl">
                Looks Like You Haven’t Placed Any Orders Yet.
              </h2>

              {/* Subtitle Description */}
              <p className="mt-4 max-w-md text-xs leading-relaxed text-black/50 sm:text-sm sm:leading-6">
                Explore our latest drops, premium streetwear essentials, and exclusive
                collections crafted for everyday style.
              </p>

              {/* Primary Call To Action - "Shop Now" */}
              <Link
                to="/shop"
                className="
                  group
                  pointer-events-auto
                  cursor-pointer
                  relative
                  mt-6
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  bg-black
                  px-5
                  py-3
                  text-xs
                  font-semibold
                  tracking-wide
                  text-white
                  shadow-xl
                  shadow-black/20
                  transition-all
                  duration-300
                  ease-out
                  hover:-translate-y-0.5
                  hover:scale-105
                  hover:bg-white
                  hover:text-black
                  hover:shadow-2xl
                  hover:shadow-black/40
                  active:translate-y-0
                  hover:border
                  hover:border-gray-100
                  md:px-6
                  md:py-3
                  md:text-sm
                  lg:mt-8
                  lg:gap-3
                  lg:px-8
                  lg:py-4
                "
              >
                <span className="font-primary">Shop Now</span>

                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-black text-xs transition-all duration-300 group-hover:translate-x-1 group-hover:bg-black group-hover:text-white md:h-6 md:w-6 font-sans lg:h-7 lg:w-7 lg:text-sm">
                  →
                </span>
              </Link>

              {/* Quick Discovery Tags Divider */}
              <div className="mt-14 w-full border-t border-black/10 pt-8">
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-black/40">
                  Quick Discovery
                </p>

                <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
                  {SUGGESTED_CATEGORIES.map((cat) => (
                    <Link
                      key={cat.name}
                      to={cat.path}
                      className="
                        inline-flex
                        items-center
                        rounded-full
                        border
                        border-black/10
                        bg-white
                        px-4.5
                        py-2
                        text-[11px]
                        font-semibold
                        text-black/70
                        shadow-2xs
                        will-change-transform
                        transition-all
                        duration-300
                        ease-[cubic-bezier(0.25,1,0.5,1)]
                        hover:-translate-y-0.5
                        hover:border-black
                        hover:bg-black
                        hover:text-white
                        hover:shadow-md
                        active:translate-y-0
                        active:scale-95
                      "
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Orders;