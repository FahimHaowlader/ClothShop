
import React, { useEffect, useState, useRef } from "react";
import { Ruler, ShoppingBag } from "lucide-react";
import { Star } from "lucide-react";

// Images
import image1 from "../assets/images.webp";
import image2 from "../assets/images2.webp";

const ProductBasic = ({ setCartCount }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  // State for Order Now button
  const [isOrdering, setIsOrdering] = useState(false);
  const [isOrdered, setIsOrdered] = useState(false);

  // Flying Product Thumbnail State
  const [flyingParticle, setFlyingParticle] = useState(null);

  const addToBagBtnRef = useRef(null);

  // Synchronous lock refs to block rapid double-clicks/spam clicks immediately
  const isLockedRef = useRef(false);
  const lastClickTimeRef = useRef(0);

  const product = {
    name: "Levi's essential western aasa",
    price: 126,
    originalPrice: 180,
    discountPercentage: 30,

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

  const handleAddToBag = async () => {
    if (isAdding) return;
    setIsAdding(true);

    if (addToBagBtnRef.current) {
      const btnRect = addToBagBtnRef.current.getBoundingClientRect();
      const cartIcon = document.getElementById("navbar-cart-icon");

      // Start coordinates on the LEFT side of the Add to Bag button
      const startX = btnRect.left + btnRect.width / 2 + 24;
      const startY = btnRect.top + btnRect.height / 2 - 30;

      // Target coordinates anchored on the navbar bag section
      let targetX;
      let targetY;

      if (window.innerWidth < 640) {
        targetX = window.innerWidth - 50;
        targetY = 5;
      } else if (window.innerWidth < 1024) {
        targetX = window.innerWidth - 70;
        targetY = 5;
      } else if (window.innerWidth < 1440) {
        targetX = window.innerWidth - 118;
        targetY = 7;
      } else {
        targetX = window.innerWidth - 130;
        targetY = 8;
      }

      // If the cart icon exists, it takes priority over the fallback
      if (cartIcon) {
        const cartRect = cartIcon.getBoundingClientRect();
        targetX = cartRect.left + cartRect.width / 2 - 24;
        targetY = cartRect.top + cartRect.height / 2 - 24;
      }

      setFlyingParticle({
        startX,
        startY,
        image: product.images[0],
      });

      // Smooth Hyperbolic Arc Animation via requestAnimationFrame
      requestAnimationFrame(() => {
        const el = document.getElementById("flying-product-thumbnail");
        if (!el) return;

        const duration = 800;
        const startTime = performance.now();

        // Control point centered horizontally and clamped safely inside screen top boundary
        const peakX = window.innerWidth / 2 - 180;
        const peakY = Math.max(30, Math.min(startY, targetY) - 120);

        const animateParticle = (currentTime) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);

          // Optimized buttery-smooth cubic bezier easing curve
          const easeProgress =
            progress < 0.5
              ? 4 * progress * progress * progress
              : 1 - Math.pow(-2 * progress + 2, 3) / 2;

          const currentX =
            Math.pow(1 - easeProgress, 2) * startX +
            2 * (1 - easeProgress) * easeProgress * peakX +
            Math.pow(easeProgress, 2) * targetX;

          const currentY =
            Math.pow(1 - easeProgress, 2) * startY +
            2 * (1 - easeProgress) * easeProgress * peakY +
            Math.pow(easeProgress, 2) * targetY;

          const currentScale = 1 - easeProgress * 0.85;
          const currentRotate = easeProgress * -35;
          const currentOpacity = progress > 0.85 ? (1 - progress) / 0.15 : 1;

          el.style.transform = `translate3d(${currentX - startX}px, ${
            currentY - startY
          }px, 0) scale(${currentScale}) rotate(${currentRotate}deg)`;
          el.style.opacity = currentOpacity;

          if (progress < 1) {
            requestAnimationFrame(animateParticle);
          } else {
            setFlyingParticle(null);
            if (setCartCount) {
              setCartCount((prev) => prev + quantity);
            }
          }
        };

        requestAnimationFrame(animateParticle);
      });
    }

    try {
      setIsAdded(true);
      await new Promise((resolve) => setTimeout(resolve, 1500));
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
      await new Promise((resolve) => setTimeout(resolve, 1500));
    } finally {
      setIsOrdered(false);
      setIsOrdering(false);
    }
  };

  // =====================================================
  // IMAGE SLIDER
  // =====================================================

  const sliderImages = [...product.images, product.images[0]];

  const [currentImage, setCurrentImage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  /* ==========================================
     NEXT IMAGE
  ========================================== */

  const nextImage = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
      if (e.nativeEvent) e.nativeEvent.stopImmediatePropagation();
    }

    const now = Date.now();
    if (now - lastClickTimeRef.current < 400 || isLockedRef.current || product.images.length <= 1) {
      return;
    }

    lastClickTimeRef.current = now;
    isLockedRef.current = true;
    setIsAnimating(true);
    setCurrentImage((prev) => prev + 1);
  };

  /* ==========================================
     PREVIOUS IMAGE
  ========================================== */

  const previousImageHandler = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
      if (e.nativeEvent) e.nativeEvent.stopImmediatePropagation();
    }

    const now = Date.now();
    if (now - lastClickTimeRef.current < 400 || isLockedRef.current || product.images.length <= 1) {
      return;
    }

    lastClickTimeRef.current = now;
    isLockedRef.current = true;

    if (currentImage === 0) {
      setIsResetting(true);
      setCurrentImage(product.images.length);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsResetting(false);
          setIsAnimating(true);
          setCurrentImage(product.images.length - 1);
        });
      });

      return;
    }

    setIsAnimating(true);
    setCurrentImage((prev) => prev - 1);
  };

  /* ==========================================
     SELECT IMAGE INDEX
  ========================================== */

  const selectImageIndex = (index, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
      if (e.nativeEvent) e.nativeEvent.stopImmediatePropagation();
    }

    const now = Date.now();
    if (now - lastClickTimeRef.current < 400 || isLockedRef.current) {
      return;
    }

    const realCurrentIndex =
      currentImage === product.images.length ? 0 : currentImage;

    if (index === realCurrentIndex) {
      return;
    }

    lastClickTimeRef.current = now;
    isLockedRef.current = true;
    setIsAnimating(true);
    setCurrentImage(index);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (isAnimating || isResetting || isLockedRef.current) {
        return;
      }

      isLockedRef.current = true;
      setIsAnimating(true);
      setCurrentImage((prev) => prev + 1);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAnimating, isResetting]);

  /* ==========================================
     TRANSITION END
  ========================================== */

  const handleTransitionEnd = (e) => {
    if (e && e.target !== e.currentTarget) {
      return;
    }

    if (currentImage === product.images.length && product.images.length > 1) {
      setIsResetting(true);

      requestAnimationFrame(() => {
        setCurrentImage(0);

        requestAnimationFrame(() => {
          setIsResetting(false);
          setIsAnimating(false);
          isLockedRef.current = false;
        });
      });

      return;
    }

    setIsAnimating(false);
    isLockedRef.current = false;
  };

  /* ==========================================
     SAFETY NET
  ========================================== */

  useEffect(() => {
    if (!isAnimating) return;

    const timeout = setTimeout(() => {
      handleTransitionEnd(null);
    }, 1500);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAnimating, currentImage]);

  const activeImageIndex =
    product.images.length > 0
      ? currentImage === product.images.length
        ? 0
        : currentImage
      : 0;

  return (
    <section className="relative w-full overflow-hidden bg-white font-primary">
      {/* =================================================
          FLYING THUMBNAIL PARTICLES (SMOOTH ARC)
      ================================================== */}
      {flyingParticle && (
        <div
          id="flying-product-thumbnail"
          className="pointer-events-none fixed z-[999] h-12 w-12 overflow-hidden rounded-full border border-gray-400 bg-white shadow-2xl"
          style={{
            left: `${flyingParticle.startX}px`,
            top: `${flyingParticle.startY}px`,
            willChange: "transform, opacity",
          }}
        >
          <img
            src={flyingParticle.image}
            alt="Flying product"
            className="h-full w-full object-cover"
          />
        </div>
      )}

      <div className="grid w-full items-stretch lg:grid-cols-2">
        {/* =================================================
            IMAGE SECTION (Non-clickable container)
        ================================================== */}

        <div className="group relative h-[100svh] min-h-[500px] w-full overflow-hidden bg-neutral-100 lg:h-full lg:min-h-0">
          {/* Discount Badge on Top Left with White Background */}
          {product.discountPercentage && (
            <span
              className="
                absolute
                left-10
                top-10
                z-46
                flex
                h-8
                w-14
                items-center
                justify-center
                rounded-full
                bg-white
                text-[11px]
                font-semibold
                tracking-wide
                text-black
                shadow-md
                pointer-events-none
              "
            >
              <span className="relative -top-[1px] text-2xl font-medium">-</span>
              {product.discountPercentage}%
            </span>
          )}

          {/* NON-CLICKABLE IMAGE CONTAINER */}
          <div className="absolute inset-0 z-10 h-full w-full">
            <div
              onTransitionEnd={handleTransitionEnd}
              className="absolute inset-0 flex h-full w-full will-change-transform"
              style={{
                transform: `translate3d(-${currentImage * 100}%, 0, 0)`,
                transition: isResetting
                  ? "none"
                  : "transform 1000ms cubic-bezier(0.25, 1, 0.5, 1)",
                backfaceVisibility: "hidden",
              }}
            >
              {sliderImages.map((image, index) => {
                const isClone =
                  product.images.length > 1 &&
                  index === sliderImages.length - 1;

                return (
                  <div
                    key={index}
                    aria-hidden={isClone || undefined}
                    className="relative h-full min-w-full shrink-0 overflow-hidden"
                    style={{ flexBasis: "100%" }}
                  >
                    <img
                      src={image}
                      alt={isClone ? "" : `${product.name} ${index + 1}`}
                      className="block h-full w-full select-none object-cover transition-transform duration-1000 ease-out hover:scale-105"
                      draggable="false"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={previousImageHandler}
            aria-label="Previous image"
            disabled={isAnimating || isResetting}
            className="absolute left-4 top-1/2 z-45 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 font-sans text-lg text-black shadow-lg transition-all duration-300 hover:scale-105 hover:bg-white active:scale-95 disabled:pointer-events-none sm:left-5 sm:h-11 sm:w-11"
          >
            ←
          </button>

          <button
            type="button"
            onClick={nextImage}
            aria-label="Next image"
            disabled={isAnimating || isResetting}
            className="absolute right-4 top-1/2 z-45 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 font-sans text-lg text-black shadow-lg transition-all duration-300 hover:scale-105 hover:bg-white active:scale-95 disabled:pointer-events-none sm:right-5 sm:h-11 sm:w-11"
          >
            →
          </button>

          <div className="absolute bottom-5 left-1/2 z-45 flex -translate-x-1/2 items-center gap-2 sm:bottom-6">
            {product.images.map((_, index) => (
              <button
                key={index}
                type="button"
                disabled={isAnimating || isResetting}
                onClick={(e) => selectImageIndex(index, e)}
                aria-label={`View image ${index + 1}`}
                aria-current={activeImageIndex === index}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  activeImageIndex === index
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

        <div className="flex w-full bg-bg-primary flex-col justify-center px-5 py-12 sm:px-8 sm:py-16 md:px-12 lg:px-14 xl:px-20 2xl:px-24">
          <div className="mb-5 flex items-center gap-3">
            <span className="h-px w-8 bg-black" />
           <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-black/50">
              Product Details
            </span>
          </div>

          <h1 className="max-w-xl text-2xl font-semibold leading-tight tracking-tight text-black sm:text-3xl lg:text-4xl xl:text-[42px]">
            {product.name}
          </h1>

         <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
  <div
    className="flex items-center gap-1 text-black"
    aria-label={`${product.rating} out of 5 stars`}
  >
    {[1, 2, 3, 4, 5].map((starIndex) => {
      const rating = product?.rating || 0;
      const fillPercentage = Math.max(
        0,
        Math.min(100, (rating - (starIndex - 1)) * 100)
      );

      return (
        <div key={starIndex} className="relative flex items-center">
          {/* Background outline star */}
          <Star size={18} className="text-black/20" strokeWidth={1.5} />

          {/* Filled star overlay clipped to exact rating percentage */}
          <div
            className="absolute inset-0 overflow-hidden text-black transition-all duration-500 ease-out"
            style={{ width: `${fillPercentage}%` }}
          >
            <Star size={18} fill="currentColor" strokeWidth={1.5} />
          </div>
        </div>
      );
    })}
  </div>

  <span className="text-sm font-semibold text-black/60 inline-block pt-1">
    {Number(product?.rating || 0).toFixed(1)}
  </span>
</div>

          <div className="mt-5 flex items-center gap-5">
            <p className="text-lg font-semibold text-black sm:text-xl">
              ${product.price}
            </p>
            {product.originalPrice && (
              <span className="relative text-xs text-black/50 sm:text-base">
                ${product.originalPrice}
                <span className="absolute -left-[25%] -right-[25%] top-[43%] h-px bg-black/50 -translate-y-1/2" />
              </span>
            )}
          </div>

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
                        ? "border-transparent ring-2 ring-black ring-offset-2 shadow-sm"
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
                  className="pointer-events-none absolute inset-y-0 left-0 w-1/5 rounded-full bg-black will-change-transform transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"
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
            {/* Quantity Selector */}
            <div className="flex h-12 w-[112px] shrink-0 items-center overflow-hidden rounded-full border border-black/15 bg-white sm:w-[130px]">
              <button
                type="button"
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                aria-label="Decrease quantity"
                className="flex h-full w-9 shrink-0 items-center justify-center pt-1 text-lg font-medium text-black transition hover:bg-black/5 active:bg-black/10 sm:w-10"
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
                className="flex h-full w-9 shrink-0 items-center justify-center pt-1 text-lg font-medium text-black transition hover:bg-black/5 active:bg-black/10 sm:w-10"
              >
                +
              </button>
            </div>

            {/* Add To Bag CTA */}
            <button
              ref={addToBagBtnRef}
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
                  size={17}
                  strokeWidth={2}
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
              ORDER NOW BUTTON
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
            "
          >
            <div className="relative flex h-5 items-center justify-center overflow-hidden">
              <span className="font-primary whitespace-nowrap will-change-transform transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]">
                Order Now
              </span>
            </div>

            <span className="flex h-6 w-6 sm:h-7 sm:w-7 shrink-0 items-center justify-center rounded-full bg-white text-black will-change-transform transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:translate-x-1 group-hover:bg-black group-hover:text-white">
              <span className="font-sans text-xs font-bold leading-none sm:text-sm">
                →
              </span>
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductBasic;