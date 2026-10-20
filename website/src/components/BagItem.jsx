import React, { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { Link } from "react-router";

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

const BagItem = ({ item = DEFAULT_ITEM, onUpdateQuantity, onRemove }) => {
  const [isRemoving, setIsRemoving] = useState(false);
  const [quantity, setQuantity] = useState(item.quantity ?? 1);

  useEffect(() => {
    if (item.quantity !== undefined) {
      setQuantity(item.quantity);
    }
  }, [item.quantity]);

  const updateQty = (newQty) => {
    const clampedQty = Math.max(1, Math.min(10, newQty));
    setQuantity(clampedQty);
    if (onUpdateQuantity) {
      onUpdateQuantity(item.id, clampedQty);
    }
  };

  const handleDecrease = (e) => {
    e.preventDefault();
    if (quantity > 1) updateQty(quantity - 1);
  };

  const handleIncrease = (e) => {
    e.preventDefault();
    if (quantity < 10) updateQty(quantity + 1);
  };

  // Two-stage smooth delete: slide right first, then collapse height
  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => {
      onRemove?.(item.id);
    }, 300); // Matches the CSS transition duration
  };

  const displayQty = typeof quantity === "number" ? quantity : 1;
  const itemSubtotal = (item.price * displayQty).toFixed(2);

  return (
    <div
      className={`
        w-full overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]
        ${isRemoving ? "max-h-0 opacity-0 py-0 my-0 border-0" : "max-h-[300px] opacity-100"}
      `}
    >
      <div
        className={`
          group relative flex w-full flex-col items-start justify-between gap-4 border-b border-black/10 py-4 font-primary 
          transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] sm:flex-row sm:items-center sm:gap-6
          ${isRemoving ? "translate-x-12 opacity-0 py-0 border-transparent" : "translate-x-0 opacity-100"}
        `}
      >
        {/* LEFT SECTION: IMAGE & DETAILS */}
        <div className="flex w-full items-start gap-4 sm:w-auto sm:items-center sm:gap-6">
          <Link
            to={`/product/${item.slug || item.id}`}
            className="group/img relative h-28 w-22 shrink-0 overflow-hidden rounded-lg bg-neutral-100 sm:h-32 sm:w-26"
          >
            <img
              src={item.image}
              alt={item.name}
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover/img:scale-110"
            />
          </Link>

          <div className="flex min-w-0 flex-1 flex-col justify-center gap-1">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-black/40">
              SKU: {item.sku}
            </span>

            <Link
              to={`/product/${item.slug || item.id}`}
              className="line-clamp-2 text-sm font-bold tracking-tight text-black transition-colors duration-300 hover:text-black/70 sm:text-base"
            >
              {item.name}
            </Link>

            <div className="mt-1 flex flex-wrap items-center gap-2">
              {item.selectedColor && (
                <div className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-black/[0.02] px-2.5 py-0.5 text-[11px] font-medium text-black/80">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full border border-black/20"
                    style={{ backgroundColor: item.colorValue || "#000" }}
                  />
                  <span>{item.selectedColor}</span>
                </div>
              )}

              {item.selectedSize && (
                <div className="inline-flex items-center rounded-full border border-black/10 bg-black/[0.02] px-2.5 py-0.5 text-[11px] font-semibold text-black">
                  Size: {item.selectedSize}
                </div>
              )}
            </div>

            {/* Unit Price */}
            <div className="mt-1 flex items-center gap-1.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-black/40">
                Unit Price:
              </span>
              <span className="text-sm font-bold text-black">${item.price}</span>
              {item.originalPrice && (
                <span className="relative text-xs text-black/40">
                  ${item.originalPrice}
                  <span className="absolute inset-x-0 top-[43%] h-[1px] -translate-y-1/2 bg-black/40" />
                </span>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT SECTION: SUBTOTAL & ACTIONS */}
        <div className="flex w-full shrink-0 flex-row items-center justify-between gap-3 border-t border-black/5 pt-3 sm:w-auto sm:flex-col sm:items-end sm:border-t-0 sm:pt-0">
          <div className="text-left sm:text-right">
            <span className="block text-[10px] font-semibold uppercase tracking-wider text-black/40">
              Sub Total
            </span>
            <span className="text-sm font-bold tracking-tight text-black sm:text-base">
              ${itemSubtotal}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quantity Stepper */}
            <div className="flex h-9 w-[100px] shrink-0 items-center overflow-hidden rounded-full border border-black/15 bg-white sm:h-10 sm:w-[115px]">
              <button
                type="button"
                onClick={handleDecrease}
                disabled={displayQty <= 1}
                aria-label="Decrease quantity"
                className="flex h-full w-8 shrink-0 items-center justify-center text-base font-medium text-black transition hover:bg-black/5 active:bg-black/10 disabled:pointer-events-none disabled:opacity-25 sm:w-9 hover:cursor-pointer"
              >
                −
              </button>

              <div className="flex h-full min-w-0 flex-1 items-center justify-center text-xs font-bold text-black sm:text-sm">
                {quantity}
              </div>

              <button
                type="button"
                onClick={handleIncrease}
                disabled={displayQty >= 10}
                aria-label="Increase quantity"
                className="flex h-full w-8 shrink-0 items-center justify-center text-base font-medium text-black transition hover:bg-black/5 active:bg-black/10 disabled:pointer-events-none disabled:opacity-25 sm:w-9 hover:cursor-pointer"
              >
                +
              </button>
            </div>

            {/* Delete Button */}
            <button
              type="button"
              onClick={handleRemove}
              disabled={isRemoving}
              aria-label="Remove product from cart"
              className="group/btn flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-black/10 bg-white text-black/50 shadow-2xs transition-all duration-300 ease-out hover:border-black hover:bg-black hover:text-white hover:shadow-md active:scale-90 sm:h-10 sm:w-10 disabled:pointer-events-none hover:cursor-pointer"
            >
              <Trash2
                size={17}
                strokeWidth={1.8}
                className="transition-transform duration-300 group-hover/btn:scale-110"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BagItem;