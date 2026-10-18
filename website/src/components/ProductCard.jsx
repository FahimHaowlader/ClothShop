import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";

// Time each image stays before swapping automatically (ms)
const AUTOPLAY_DELAY = 4000;

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const variants = product.variants || [];

  const sliderImages =
    variants.length > 0
      ? [
          ...variants.map((variant) => variant.image),
          variants[0].image,
        ]
      : [product.image];

  const [currentImage, setCurrentImage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // Synchronous lock ref to block rapid double-clicks immediately
  const isLockedRef = useRef(false);
  const lastClickTimeRef = useRef(0);

  // Autoplay helpers
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isInView, setIsInView] = useState(true);

  // Each card gets a small random offset so a grid of cards
  // does not flip all its images at the same moment
  const autoplayOffset = useRef(Math.random() * 1500);

  const hasDiscount =
    product.oldPrice && product.oldPrice > product.price;

  const discountPercentage = hasDiscount
    ? Math.round(
        ((product.oldPrice - product.price) /
          product.oldPrice) *
          100
      )
    : null;

  /* ==========================================
     IMAGE CLICK HANDLER (Programmatic Navigation)
  ========================================== */

  const handleImageClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const now = Date.now();
    if (now - lastClickTimeRef.current < 400 || isLockedRef.current) {
      return;
    }

    lastClickTimeRef.current = now;
    navigate(product.path || `/products/${product.id}`);
  };

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
    if (now - lastClickTimeRef.current < 400 || isLockedRef.current || variants.length <= 1) {
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

  const previousImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.nativeEvent) e.nativeEvent.stopImmediatePropagation();

    const now = Date.now();
    if (now - lastClickTimeRef.current < 400 || isLockedRef.current || variants.length <= 1) {
      return;
    }

    lastClickTimeRef.current = now;
    isLockedRef.current = true;

    if (currentImage === 0) {
      // 1. Teleport to the clone (looks identical to the first image)
      setIsResetting(true);
      setCurrentImage(variants.length);

      // 2. After the browser has painted that, re-enable the
      //    transition and animate one step back to the last image
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsResetting(false);
          setIsAnimating(true);
          setCurrentImage(variants.length - 1);
        });
      });

      return;
    }

    setIsAnimating(true);
    setCurrentImage((prev) => prev - 1);
  };

  /* ==========================================
     SELECT VARIANT
  ========================================== */

  const selectVariant = (index, e) => {
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
      currentImage === variants.length
        ? 0
        : currentImage;

    if (index === realCurrentIndex) {
      return;
    }

    lastClickTimeRef.current = now;
    isLockedRef.current = true;
    setIsAnimating(true);
    setCurrentImage(index);
  };

  /* ==========================================
     TRANSITION END
  ========================================== */

  const handleTransitionEnd = (e) => {
    // Ignore transitionend events that bubble up from child
    // elements (for example the image hover zoom)
    if (e && e.target !== e.currentTarget) {
      return;
    }

    if (
      currentImage === variants.length &&
      variants.length > 1
    ) {
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

  /* ==========================================
     AUTOPLAY INTERSECTION OBSERVER
  ========================================== */

  useEffect(() => {
    const element = cardRef.current;
    if (!element || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.3 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  /* ==========================================
     AUTOPLAY INTERVAL LOOP
  ========================================== */

  useEffect(() => {
    if (
      variants.length <= 1 ||
      product.soldOut ||
      isHovered ||
      isFocused ||
      !isInView
    ) {
      return;
    }

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const interval = setInterval(() => {
      if (isLockedRef.current) return;
      
      isLockedRef.current = true;
      setIsAnimating(true);
      setCurrentImage((prev) => prev + 1);
    }, AUTOPLAY_DELAY + autoplayOffset.current);

    return () => clearInterval(interval);
  }, [
    isHovered,
    isFocused,
    isInView,
    variants.length,
    product.soldOut,
  ]);

  /* ==========================================
     ACTIVE VARIANT
  ========================================== */

  const activeVariant =
    variants.length > 0
      ? currentImage === variants.length
        ? 0
        : currentImage
      : 0;

  return (
    <article
      ref={cardRef}
      onPointerEnter={(e) => e.pointerType === "mouse" && setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
      onFocus={(e) => {
        if (e.target.matches(":focus-visible")) setIsFocused(true);
      }}
      onBlur={() => setIsFocused(false)}
      className="group/card relative w-full"
    >
      {/* ========================================
          IMAGE SECTION
      ======================================== */}

      <div
        className="
          group/image
          relative
          h-[220px]
          w-full
          overflow-hidden
          bg-neutral-100

          sm:h-[280px]
          md:h-[300px]
          xl:h-[370px]
        "
      >
        {/* CLICKABLE IMAGE CONTAINER */}
        <div
          onClick={handleImageClick}
          className="absolute inset-0 z-10 cursor-pointer h-full w-full"
        >
          {/* SLIDER */}
          <div
            onTransitionEnd={handleTransitionEnd}
            className="
              absolute
              inset-0
              flex
              flex-nowrap
              h-full
              w-full
              will-change-transform
            "
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
                variants.length > 1 &&
                index === sliderImages.length - 1;

              return (
                <div
                  key={index}
                  aria-hidden={isClone || undefined}
                  className="
                    relative
                    h-full
                    w-full
                    flex-shrink-0
                    overflow-hidden
                  "
                  style={{ flexBasis: "100%" }}
                >
                  <img
                    src={image}
                    alt={isClone ? "" : `${product.name} ${index + 1}`}
                    className="
                      block
                      h-full
                      w-full
                      select-none
                      object-cover

                      transition-transform
                      duration-[1000ms]
                      ease-out

                      group-hover/card:scale-[1.025]
                    "
                    draggable="false"
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* DISCOUNT */}

        {hasDiscount && (
          <span
            className="
              absolute
              left-3
              top-3
              z-30
              rounded-full
              bg-white
              px-3
              py-1.5
              text-[10px]
              font-semibold
              tracking-wide
              text-black
              shadow-sm
              pointer-events-none
            "
          >
            -{discountPercentage}%
          </span>
        )}

        {/* SOLD OUT */}

        {product.soldOut && (
          <div
            className="
              absolute
              inset-0
              z-30
              flex
              items-center
              justify-center
              pointer-events-none
            "
          >
            <span
              className="
                rounded-full
                bg-black
                px-5
                py-2.5
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.15em]
                text-white
              "
            >
              Sold Out
            </span>
          </div>
        )}

        {/* PREVIOUS */}

        {variants.length > 1 && !product.soldOut && (
          <button
            type="button"
            onClick={previousImage}
            aria-label="Previous image"
            disabled={isAnimating || isResetting}
            className="
              absolute
              left-3
              top-1/2
              z-30
              flex
              h-7
              w-7
              -translate-y-1/2
              items-center
              justify-center
              rounded-full
              bg-white/90
              text-sm
              text-black
              shadow-lg
              transition-all
              duration-300
              hover:scale-105
              hover:bg-white
              focus-visible:outline
              focus-visible:outline-2
              focus-visible:outline-offset-2
              focus-visible:outline-black
              active:scale-95
              disabled:pointer-events-none

              sm:left-3.5
              sm:h-8
              sm:w-8
              font-sans
              font-medium
            "
          >
            ←
          </button>
        )}

        {/* NEXT */}

        {variants.length > 1 && !product.soldOut && (
          <button
            type="button"
            onClick={nextImage}
            aria-label="Next image"
            disabled={isAnimating || isResetting}
            className="
              absolute
              right-3
              top-1/2
              z-30
              flex
              h-7
              w-7
              -translate-y-1/2
              items-center
              justify-center
              rounded-full
              bg-white/90
              text-sm
              text-black
              shadow-lg
              transition-all
              duration-300
              hover:scale-105
              hover:bg-white
              focus-visible:outline
              focus-visible:outline-2
              focus-visible:outline-offset-2
              focus-visible:outline-black
              active:scale-95
              disabled:pointer-events-none

              sm:right-3.5
              sm:h-8
              sm:w-8
              font-sans
              font-medium
            "
          >
            →
          </button>
        )}

        {/* INDICATORS */}

        {variants.length > 1 && !product.soldOut && (
          <div
            className="
              absolute
              bottom-3
              left-1/2
              z-30
              flex
              -translate-x-1/2
              items-center
              gap-1.5
            "
          >
            {variants.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={(e) => selectVariant(index, e)}
                disabled={isAnimating || isResetting}
                aria-label={`View image ${index + 1}`}
                aria-current={activeVariant === index}
                className={`
                  h-1.5
                  rounded-full
                  transition-all
                  duration-300
                  focus-visible:outline
                  focus-visible:outline-2
                  focus-visible:outline-offset-2
                  focus-visible:outline-black
                  disabled:pointer-events-none

                  ${
                    activeVariant === index
                      ? "w-8 bg-black"
                      : "w-2 bg-black/30 hover:bg-black/60"
                  }
                `}
              />
            ))}
          </div>
        )}
      </div>

      {/* ========================================
          PRODUCT DETAILS
      ======================================== */}

      <div className="pt-3">
        {/* PRODUCT NAME */}

        <h3
          className="
            line-clamp-1
            text-[14px]
            font-semibold
            leading-5
            text-black
          "
        >
          <Link
            to={product.path || `/products/${product.id}`}
            className=""
          >
            {product.name}
          </Link>
        </h3>

        {/* PRICE */}

  <div
  className="
  
    mt-1.5
    flex
    items-center
    gap-3.5
  "
>
  <span
    className="
      text-sm
      font-semibold
      text-black
    "
  >
    ${product.price}
  </span>

  {hasDiscount && (
    <span
      className="
        relative
        text-xs
        text-black/50
      "
    >
      ${product.oldPrice}
      {/* Extended line by 10% on both left and right sides (total 20% longer) */}
      <span 
        className="
          absolute 
          -left-[25%] 
          -right-[25%] 
          top-[40%] 
          h-[1px] 
          bg-black/50
          -translate-y-1/2
        " 
      />
    </span>
  )}
</div>

        {/* VARIANTS */}

        <div className="relative z-20 mt-3 min-h-[30px]">
          {variants.length > 0 && (
            <div
              className="
                flex
                items-center
                gap-2.5
              "
            >
              {variants.slice(0, 6).map(
                (variant, index) => (
                  <button
                    key={variant.name || index}
                    type="button"
                    onClick={(e) =>
                      selectVariant(index, e)
                    }
                    disabled={
                      isAnimating ||
                      isResetting
                    }
                    aria-label={`Select ${
                      variant.name || "color"
                    }`}
                    aria-pressed={activeVariant === index}
                    title={variant.name}
                    className={`
                      relative
                      h-7
                      w-7
                      shrink-0
                      cursor-pointer
                      overflow-hidden
                      rounded-full
                      transition-all
                      duration-300
                      focus-visible:outline
                      focus-visible:outline-2
                      focus-visible:outline-offset-2
                      focus-visible:outline-black

                      ${
                        activeVariant === index
                          ? "ring-1 ring-gray-400 ring-offset-2"
                          : ""
                      }
                    `}
                  >
                    <img
                      src={variant.image}
                      alt=""
                      className="
                        h-full
                        w-full
                        object-cover
                      "
                    />
                  </button>
                )
              )}

              {variants.length > 6 && (
                <span
                  className="
                    text-[10px]
                    font-medium
                    text-black/50
                  "
                >
                  +{variants.length - 6}
                </span>
              )}
            </div>
          )}
        </div>

        {/* VIEW DETAILS */}
        <Link
          to={product.path || `/products/${product.id}`}
          className="
            group/details
            relative
            z-20
            mt-5
            flex
            w-full
            items-center
            justify-center
            gap-3
            font-semibold
            text-[12px]
            tracking-[0.12em]
          "
        >
          {/* Left line */}
          <span
            className="
              block
              h-px
              w-5
              sm:w-10
              bg-black/40
              transition-all
              duration-[2000ms]
              ease-out
              motion-reduce:transition-none
              group-hover/details:grow
              group-hover/details:bg-black
            "
          />

          <span
            className="
              shrink-0
              transition-all
              duration-[1400ms]
              ease-out
              motion-reduce:transition-none
              group-hover/details:tracking-[0.18em]
            "
          >
            View Details
          </span>

          {/* Right line */}
          <span
            className="
              block
              h-px
              w-5
              sm:w-10
              bg-black/40
              transition-all
              duration-[2000ms]
              ease-out
              motion-reduce:transition-none
              group-hover/details:grow
              group-hover/details:bg-black
            "
          />
        </Link>
      </div>
    </article>
  );
};

export default ProductCard;