
import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import { Trash2, ArrowUpRight, PackageCheck } from "lucide-react";

const DEFAULT_ITEM = {
  id: "cart-item-1",
  name: "Hoodie with embroidered slogan",
  price: 126,
  originalPrice: 180,
  selectedColor: "Black",
  colorValue: "#000000",
  selectedSize: "M",
  quantity: 1,
  image:
    "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
  sku: "YX180-27",
  slug: "hoodie-embroidered-slogan",
};

const formatPrice = (amount) =>
  `$${Number(amount || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const BagItem = ({
  item = DEFAULT_ITEM,
  onUpdateQuantity,
  onRemove,
}) => {
  const [quantity, setQuantity] = useState(item.quantity ?? 1);
  const [isRemoving, setIsRemoving] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    setQuantity(item.quantity ?? 1);
  }, [item.quantity]);

  const displayQty = Math.max(1, Math.min(10, Number(quantity) || 1));
  const itemSubtotal = Number(item.price || 0) * displayQty;

  const discountPercentage =
    item.originalPrice > item.price && item.originalPrice > 0
      ? Math.round(
          ((item.originalPrice - item.price) / item.originalPrice) * 100
        )
      : 0;

  const updateQty = (newQty) => {
    const nextQty = Math.max(1, Math.min(10, newQty));

    setQuantity(nextQty);
    onUpdateQuantity?.(item.id, nextQty);
  };

  const handleRemove = () => {
    if (isRemoving) return;

    setIsRemoving(true);

    setTimeout(() => {
      onRemove?.(item.id);
    }, 350);
  };

  const productLink = `/product/${item.slug || item.id}`;

  return (
    <article
      className={`overflow-hidden transition-[max-height,opacity,margin] duration-350 ease-[cubic-bezier(0.25,1,0.5,1)] ${
        isRemoving
          ? "pointer-events-none max-h-0 opacity-0"
          : "max-h-[420px] opacity-100"
      }`}
      aria-label={item.name}
    >
      <div
        className={`group/item relative grid grid-cols-1 gap-4 border-b border-black/10 py-6 transition-all duration-350 ease-[cubic-bezier(0.25,1,0.5,1)] sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:gap-6  ${
          isRemoving
            ? "translate-x-6 border-transparent"
            : "translate-x-0"
        }`}
      >
        {/* Product information */}
        <div className="flex min-w-0 gap-4 sm:gap-6">
          {/* Product image */}
          <Link
            to={productLink}
            aria-label={`View ${item.name}`}
            className="group/image relative h-32 w-24 shrink-0 overflow-hidden rounded-xl bg-neutral-100 sm:h-32 sm:w-28"
          >
            {item.image && (
              <img
                src={item.image}
                alt={item.name}
                loading="lazy"
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageLoaded(false)}
                className={`h-full w-full object-cover transition duration-700 ease-out group-hover/image:scale-105 ${
                  imageLoaded ? "opacity-100" : "opacity-0"
                }`}
              />
            )}

            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-black/25">
                  BachelorShop
                </span>
              </div>
            )}

            {discountPercentage > 0 && (
              <span className="absolute left-2 top-2 rounded-md bg-white px-2 py-1 text-[9px] font-bold text-black shadow-sm">
                -{discountPercentage}%
              </span>
            )}
          </Link>

          {/* Product details */}
          <div className="flex min-w-0 flex-1 flex-col items-start py-0.5">
            <div className="mb-2 flex max-w-full flex-wrap items-center gap-2">
              <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-black/40">
                SKU: {item.sku || "N/A"}
              </span>

              {item.inStock === false && (
                <span className="rounded-full bg-neutral-100 px-2 py-1 text-[9px] font-semibold text-black/55">
                  Out of stock
                </span>
              )}
            </div>

            <Link
              to={productLink}
              className="line-clamp-2 text-sm font-bold leading-snug tracking-tight text-black transition-colors duration-300 hover:text-black/55 sm:text-base"
            >
              {item.name}
            </Link>

            {/* Selected variants */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {item.selectedColor && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-black/10 px-2.5 py-1 text-[10px] font-medium text-black/70">
                  <span
                    className="h-2.5 w-2.5 rounded-full border border-black/15"
                    style={{
                      backgroundColor: item.colorValue || "#000000",
                    }}
                  />
                  {item.selectedColor}
                </span>
              )}

              {item.selectedSize && (
                <span className="rounded-full border border-black/10 px-2.5 py-1 text-[10px] font-medium text-black/70">
                  Size: {item.selectedSize}
                </span>
              )}
            </div>

            {/* Unit price */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-sm font-bold text-black">
                {formatPrice(item.price)}
              </span>

             {item.originalPrice > item.price && (
  <span className="relative inline-block text-xs text-black/35">
    {formatPrice(item.originalPrice)}
    <span className="absolute -left-[10%] top-[43%] h-px w-[120%] -translate-y-1/2 bg-black/35" />
  </span>
)}
              <span className="text-[9px] text-black/40">
                / unit
              </span>
            </div>

            {/* <Link
              to={productLink}
              className="mt-3 inline-flex items-center gap-1 text-[10px] font-semibold text-black/45 transition-colors hover:text-black"
            >
              View product
              <ArrowUpRight
                size={12}
                className="transition-transform duration-300 group-hover/item:translate-x-0.5 group-hover/item:-translate-y-0.5"
              />
            </Link> */}
          </div>
        </div>

        {/* Quantity and subtotal */}
        <div className="flex items-center justify-between gap-4 border-t border-black/5 pt-4 sm:min-w-[180px] sm:flex-col sm:items-end sm:justify-center sm:border-0 sm:pt-0">
          <div className="sm:text-right">
            <span className="mb-1 block text-[9px] font-semibold uppercase tracking-[0.18em] text-black/40">
              Item total
            </span>

            <p className="text-base font-bold tracking-tight text-black sm:text-lg">
              {formatPrice(itemSubtotal)}
            </p>

            {item.originalPrice > item.price && (
              <p className="mt-1 text-[10px] text-black/35 line-through">
                {formatPrice(item.originalPrice * displayQty)}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            {/* Quantity control */}
            <div className="flex h-9 items-center overflow-hidden rounded-full border border-black/15 bg-white sm:h-10">
              <button
                type="button"
                onClick={() => updateQty(displayQty - 1)}
                disabled={displayQty <= 1 || isRemoving}
                aria-label="Decrease quantity"
                className="flex h-full w-8 items-center justify-center text-base text-black transition-colors hover:bg-black hover:text-white disabled:pointer-events-none disabled:opacity-25 sm:w-9"
              >
                −
              </button>

              <span
                aria-live="polite"
                aria-label={`Quantity ${displayQty}`}
                className="flex h-full min-w-7 items-center justify-center text-xs font-semibold text-black sm:min-w-8"
              >
                {displayQty}
              </span>

              <button
                type="button"
                onClick={() => updateQty(displayQty + 1)}
                disabled={displayQty >= 10 || isRemoving}
                aria-label="Increase quantity"
                className="flex h-full w-8 items-center justify-center text-base text-black transition-colors hover:bg-black hover:text-white disabled:pointer-events-none disabled:opacity-25 sm:w-9"
              >
                +
              </button>
            </div>

            {/* Remove item */}
            <button
              type="button"
              onClick={handleRemove}
              disabled={isRemoving}
              aria-label={`Remove ${item.name} from bag`}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-black/10 bg-white text-black/45 transition-all duration-300 hover:border-black hover:bg-black hover:text-white active:scale-90 disabled:pointer-events-none sm:h-10 sm:w-10"
            >
              <Trash2 size={15} strokeWidth={1.7} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default BagItem;
