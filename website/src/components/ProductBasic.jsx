import React, { useEffect, useState } from "react";
import { Ruler, ShoppingBag } from "lucide-react";

// Images
import image1 from "../assets/images.webp";
import image2 from "../assets/images2.webp";

const ProductDetails = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  // State for Order Now button
  const [isOrdering, setIsOrdering] = useState(false);
  const [isOrdered, setIsOrdered] = useState(false);

  const handleAddToBag = async () => {
    if (isAdding) return;
    setIsAdding(true);

    try {
      setIsAdded(true);
      await new Promise((resolve) => setTimeout(resolve, 1600));
    } finally {
      setIsAdded(false);
      setIsAdding(false);
    }
  };

  const handleOrderNow = async () => {
    if (isOrdering) return;
    setIsOrdering(true);

    try {
      setIsOrdered(true);
      await new Promise((resolve) => setTimeout(resolve, 1600));
    } finally {
      setIsOrdered(false);
      setIsOrdering(false);
    }
  };

  const product = {
    name: "Levi's essential western aasa",
    price: 126,

    images: [image1, image2, image1, image2, image1],

    colors: [
      { name: "Indianred", value: "#58732f" },
      { name: "Black", value: "#000000" },
      { name: "Red", value: "#d15a5a" },
      { name: "White", value: "#ffffff" },
      { name: "Purple", value: "#4d4292" },
    ],

    sizes: ["XS", "S", "M", "L", "XL"],

    sku: "YX180-27",

    categories: [
      "Best Sellers",
      "Featured Products",
      "New Arrivals",
      "On Sale",
      "Product Variants",
      "Women variant",
      "Wonmen",
    ],

    rating: 4.8,
    reviewCount: 24,
  };

  const [selectedColor, setSelectedColor] = useState("Indianred");
  const [selectedSize, setSelectedSize] = useState("S");
  const [quantity, setQuantity] = useState(1);

  // =====================================================
  // IMAGE SLIDER
  // =====================================================

  const sliderImages = [...product.images, product.images[0]];

  const [currentImage, setCurrentImage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const nextImage = () => {
    if (isAnimating || isResetting) return;
    setIsAnimating(true);
    setCurrentImage((prev) => prev + 1);
  };

  const previousImageHandler = () => {
    if (isAnimating || isResetting) return;

    if (currentImage === 0) {
      setIsResetting(true);
      setCurrentImage(product.images.length);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsResetting(false);
          setCurrentImage(product.images.length - 1);
        });
      });

      return;
    }

    setIsAnimating(true);
    setCurrentImage((prev) => prev - 1);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (isAnimating || isResetting) {
        return;
      }

      setIsAnimating(true);
      setCurrentImage((prev) => prev + 1);
    }, 3500);

    return () => clearInterval(interval);
  }, [isAnimating, isResetting]);

  const handleTransitionEnd = () => {
    if (currentImage === product.images.length) {
      setIsResetting(true);

      requestAnimationFrame(() => {
        setCurrentImage(0);

        requestAnimationFrame(() => {
          setIsResetting(false);
          setIsAnimating(false);
        });
      });

      return;
    }

    setIsAnimating(false);
  };

  return (
    <section className="w-full overflow-hidden bg-white">
      <div className="grid w-full items-stretch lg:grid-cols-2">
        {/* =================================================
            IMAGE SECTION
        ================================================== */}

        <div className="group relative h-[100svh] min-h-[500px] w-full overflow-hidden bg-neutral-100 lg:h-full lg:min-h-0">
          <div
            onTransitionEnd={handleTransitionEnd}
            className="absolute inset-0 flex h-full w-full will-change-transform"
            style={{
              transform: `translate3d(-${currentImage * 100}%, 0, 0)`,
              transition: isResetting
                ? "none"
                : "transform 1200ms cubic-bezier(0.65, 0, 0.35, 1)",
            }}
          >
            {sliderImages.map((image, index) => (
              <div
                key={index}
                className="relative h-full min-w-full shrink-0 overflow-hidden"
              >
                <img
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  className="block h-full w-full select-none object-cover"
                  draggable="false"
                />
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={previousImageHandler}
            aria-label="Previous image"
            disabled={isAnimating || isResetting}
            className="absolute left-4 top-1/2 z-40 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-lg text-black shadow-lg transition-all duration-300 hover:scale-105 hover:bg-white active:scale-95 disabled:pointer-events-none sm:left-5 sm:h-11 sm:w-11 font-sans"
          >
            ←
          </button>

          <button
            type="button"
            onClick={nextImage}
            aria-label="Next image"
            disabled={isAnimating || isResetting}
            className="absolute right-4 top-1/2 z-40 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-lg text-black shadow-lg transition-all duration-300 hover:scale-105 hover:bg-white active:scale-95 disabled:pointer-events-none sm:right-5 sm:h-11 sm:w-11 font-sans"
          >
            →
          </button>

          <div className="absolute bottom-5 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 sm:bottom-6">
            {product.images.map((_, index) => (
              <button
                key={index}
                type="button"
                disabled={isAnimating || isResetting}
                onClick={() => {
                  if (isAnimating || isResetting) {
                    return;
                  }
                  setIsAnimating(true);
                  setCurrentImage(index);
                }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === currentImage % product.images.length
                    ? "w-8 bg-black"
                    : "w-2 bg-black/30 hover:bg-black/60"
                }`}
              />
            ))}
          </div>
        </div>

        {/* =================================================
            PRODUCT DETAILS
        ================================================== */}

        <div className="flex w-full flex-col justify-center px-5 py-12 sm:px-8 sm:py-16 md:px-12 lg:px-14 xl:px-20 2xl:px-24">
          <div className="mb-5 flex items-center gap-3">
            <span className="h-px w-8 bg-black" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-black/50">
              Product Details
            </span>
          </div>

          <h1 className="max-w-xl text-2xl font-semibold leading-tight tracking-tight text-black sm:text-3xl lg:text-4xl xl:text-[42px]">
            {product.name}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
            <div
              className="flex items-center gap-0.5"
              aria-label={`${product.rating} out of 5 stars`}
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className="text-sm leading-none text-black">
                  ★
                </span>
              ))}
            </div>
            <span className="text-xs font-medium text-black/60">
              {product.rating}
            </span>
          </div>

          <p className="mt-5 text-lg font-medium text-black/70 sm:text-xl">
            ${product.price}
          </p>

          <p className="mt-3 text-xs font-medium tracking-wide text-black/50">
            <span className="text-black/80">SKU:</span> {product.sku}
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-x-1 gap-y-1 text-xs leading-relaxed">
            <span className="font-medium text-black/80">Category:</span>
            {product.categories.map((category, index) => (
              <React.Fragment key={category}>
                <button
                  type="button"
                  className="text-black/50 transition-colors duration-300 hover:text-black"
                >
                  {category}
                </button>
                {index < product.categories.length - 1 && (
                  <span className="text-black/20">,</span>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* =================================================
              COLOR
          ================================================== */}

          <div className="mt-8 sm:mt-10">
            <p className="text-sm font-medium tracking-wide text-black">
              Color: <span className="text-black/50">{selectedColor}</span>
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3 sm:gap-4">
              {product.colors.map((color) => (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => setSelectedColor(color.name)}
                  aria-label={`Select color ${color.name}`}
                  aria-pressed={selectedColor === color.name}
                  className="group/color relative flex h-13 w-13 shrink-0 cursor-pointer items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 sm:h-15 sm:w-15"
                >
                  <span className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 -translate-x-1/2 translate-y-1 scale-95 whitespace-nowrap rounded-full bg-black px-3 py-1 text-[11px] font-medium tracking-wide text-white opacity-0 shadow-md transition-all duration-200 ease-out group-hover/color:translate-y-0 group-hover/color:scale-100 group-hover/color:opacity-100">
                    {color.name}
                  </span>
                  <span
                    className={`h-11 w-11 rounded-full border transition-all duration-300 ease-out group-hover/color:scale-105 group-active/color:scale-95 sm:h-12 sm:w-12 ${
                      selectedColor === color.name
                        ? "ring-2 ring-black ring-offset-2 border-transparent shadow-sm"
                        : "border-black/10"
                    }`}
                    style={{
                      backgroundColor: color.value,
                    }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* =================================================
              SIZE
          ================================================== */}

          <div className="mt-6 sm:mt-7">
            <div className="mb-3 flex items-center justify-between sm:mb-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-black">
                Select Size
              </p>
              <button
                type="button"
                className="group flex items-center gap-0.5 text-[10px] font-semibold uppercase tracking-wide text-black/60 transition-all duration-300 hover:gap-1 hover:text-black"
              >
                <Ruler size={15} strokeWidth={1.8} />
                <span>Size Guide</span>
              </button>
            </div>

            <div className="rounded-full border border-black/15 bg-white p-1">
              <div className="relative grid h-9 grid-cols-5 sm:h-10">
                <div
                  className="pointer-events-none absolute inset-y-0 left-0 w-1/5 rounded-full bg-black will-change-transform transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)]"
                  style={{
                    transform: `translate3d(${
                      product.sizes.indexOf(selectedSize) * 100
                    }%, 0, 0)`,
                  }}
                />
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`relative z-10 flex h-full items-center justify-center rounded-full text-xs font-semibold tracking-wide transition-colors duration-300 active:scale-95 ${
                      selectedSize === size
                        ? "text-white"
                        : "text-black/50 hover:text-black"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* =================================================
              QUANTITY + ADD TO BAG
          ================================================== */}

          <div className="mt-7 flex w-full items-center gap-2 sm:mt-8 sm:gap-3">
            {/* Quantity */}
            <div className="flex h-12 w-[112px] shrink-0 items-center overflow-hidden rounded-full border border-black/15 bg-white sm:w-[130px]">
              <button
                type="button"
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                aria-label="Decrease quantity"
                className="flex h-full pt-1 w-9 shrink-0 items-center justify-center text-lg font-medium text-black transition hover:bg-black/5 active:bg-black/10 sm:w-10"
              >
                −
              </button>

              <div className="flex h-full min-w-0 flex-1 items-center justify-center text-sm font-semibold text-black">
                {quantity}
              </div>

              <button
                type="button"
                onClick={() => setQuantity((prev) => Math.min(10, prev + 1))}
                aria-label="Increase quantity"
                className="flex h-full pt-1 w-9 shrink-0 items-center justify-center text-lg font-medium text-black transition hover:bg-black/5 active:bg-black/10 sm:w-10"
              >
                +
              </button>
            </div>

            {/* Add To Bag Button */}
            <button
              type="button"
              onClick={handleAddToBag}
              disabled={isAdding}
              aria-label={isAdded ? "Added to bag" : "Add to bag"}
              className="
                group
                relative
                flex
                h-12
                min-w-0
                flex-1
                cursor-pointer
                items-center
                justify-center
                gap-3
                overflow-hidden
                rounded-full
                border
                border-black/15
                bg-black
                px-6

                text-xs
                font-semibold
                tracking-[0.14em]
                text-white

                shadow-lg
                shadow-black/10

                will-change-transform
                transition-all
                duration-500
                ease-[cubic-bezier(0.25,1,0.5,1)]

                hover:-translate-y-0.5
                hover:border-black/15
                hover:bg-white
                hover:text-black
                hover:shadow-2xl
                hover:shadow-black/20

                active:translate-y-0
                active:scale-[0.98]

                disabled:pointer-events-none
                sm:text-sm
              "
            >
              <div className="relative flex h-5 items-center justify-center overflow-hidden">
                <span
                  className={`font-primary whitespace-nowrap will-change-transform transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${
                    isAdded ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"
                  }`}
                >
                  Add to Bag
                </span>
                <span
                  className={`absolute font-primary whitespace-nowrap will-change-transform transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${
                    isAdded ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
                  }`}
                >
                  Done
                </span>
              </div>

              <span className="flex h-6 w-6 sm:h-7 sm:w-7 shrink-0 items-center justify-center rounded-full bg-white text-black will-change-transform transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:translate-x-1 group-hover:bg-black group-hover:text-white">
                <ShoppingBag
                  size={14}
                  strokeWidth={1.8}
                  className={`transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${
                    isAdded ? "scale-0 opacity-0 absolute" : "scale-100 opacity-100"
                  }`}
                />
                <span
                  className={`text-xs font-bold transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${
                    isAdded ? "scale-100 opacity-100" : "scale-0 opacity-0 absolute"
                  }`}
                >
                  ✓
                </span>
              </span>
            </button>
          </div>

          {/* =================================================
              ORDER NOW BUTTON (Matched color theme with Add to Bag)
          ================================================== */}

          <button
            type="button"
            onClick={handleOrderNow}
            disabled={isOrdering}
            aria-label="Order Now"
            className="
              group
              relative
              mt-3
              flex
              h-12
              w-full
              cursor-pointer
              items-center
              justify-center
              gap-3
              overflow-hidden
              rounded-full
              border
              border-black/15
              bg-black
              px-6

              text-xs
              font-semibold
              tracking-[0.14em]
              text-white

              shadow-lg
              shadow-black/10

              will-change-transform
              transition-all
              duration-500
              ease-[cubic-bezier(0.25,1,0.5,1)]

              hover:-translate-y-0.5
              hover:border-black/15
              hover:bg-white
              hover:text-black
              hover:shadow-2xl
              hover:shadow-black/20

              active:translate-y-0
              active:scale-[0.98]

              disabled:pointer-events-none
              sm:text-sm
            "
          >
            {/* Text Label Container */}
            <div className="relative flex h-5 items-center justify-center overflow-hidden">
              <span className="font-primary whitespace-nowrap will-change-transform transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]">
                Order Now
              </span>
            </div>

            {/* Circle Badge Arrow Icon */}
            <span
              className="
                flex
                h-6
                w-6
                sm:h-7
                sm:w-7
                shrink-0
                items-center
                justify-center

                rounded-full
                bg-white
                text-black

                will-change-transform
                transition-all
                duration-500
                ease-[cubic-bezier(0.25,1,0.5,1)]

                group-hover:translate-x-1
                group-hover:bg-black
                group-hover:text-white
              "
            >
              <span className="text-xs font-bold leading-none sm:text-sm font-sans">
                →
              </span>
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductDetails;