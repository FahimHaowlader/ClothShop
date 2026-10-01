import React, { useState } from "react";

const ProductCard = ({ product }) => {
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
     NEXT IMAGE
  ========================================== */

  const nextImage = () => {
    if (
      isAnimating ||
      isResetting ||
      variants.length <= 1
    ) {
      return;
    }

    setIsAnimating(true);
    setCurrentImage((prev) => prev + 1);
  };

  /* ==========================================
     PREVIOUS IMAGE
  ========================================== */

  const previousImage = () => {
    if (
      isAnimating ||
      isResetting ||
      variants.length <= 1
    ) {
      return;
    }

    if (currentImage === 0) {
      setIsResetting(true);
      setCurrentImage(variants.length);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setCurrentImage(variants.length - 1);

          requestAnimationFrame(() => {
            setIsResetting(false);
          });
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

  const selectVariant = (index) => {
    if (
      isAnimating ||
      isResetting
    ) {
      return;
    }

    const realCurrentIndex =
      currentImage === variants.length
        ? 0
        : currentImage;

    if (index === realCurrentIndex) {
      return;
    }

    setIsAnimating(true);
    setCurrentImage(index);
  };

  /* ==========================================
     TRANSITION END
  ========================================== */

  const handleTransitionEnd = () => {
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
        });
      });

      return;
    }

    setIsAnimating(false);
  };

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
    <article className="group w-full">
      {/* ========================================
          IMAGE SECTION
      ======================================== */}

      <div
        className="
          group/image
          relative
          h-[260px]
          w-full
          overflow-hidden
          bg-neutral-100

          sm:h-[300px]
          md:h-[320px]
          lg:h-[350px]
        "
      >
        {/* SLIDER */}

        <div
          onTransitionEnd={handleTransitionEnd}
          className="
            absolute
            inset-0
            flex
            h-full
            w-full
          "
          style={{
            transform: `translateX(-${
              currentImage * 100
            }%)`,
            transition: isResetting
              ? "none"
              : "transform 1200ms cubic-bezier(0.65, 0, 0.35, 1)",
          }}
        >
          {sliderImages.map((image, index) => (
            <div
              key={index}
              className="
                relative
                h-full
                min-w-full
                shrink-0
                overflow-hidden
              "
            >
              <img
                src={image}
                alt={`${product.name} ${index + 1}`}
                className="
                  block
                  h-full
                  w-full
                  select-none
                  object-cover

                  transition-transform
                  duration-[1000ms]
                  ease-out

                  group-hover/image:scale-[1.025]
                "
                draggable="false"
              />
            </div>
          ))}
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
              left-4
              top-1/2
              z-40
              flex
              h-10
              w-10
              -translate-y-1/2
              items-center
              justify-center
              rounded-full
              bg-white/90
              text-lg
              text-black
              shadow-lg
              transition-all
              duration-300
              hover:scale-105
              hover:bg-white
              active:scale-95
              disabled:pointer-events-none

              sm:left-5
              sm:h-11
              sm:w-11
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
              right-4
              top-1/2
              z-40
              flex
              h-10
              w-10
              -translate-y-1/2
              items-center
              justify-center
              rounded-full
              bg-white/90
              text-lg
              text-black
              shadow-lg
              transition-all
              duration-300
              hover:scale-105
              hover:bg-white
              active:scale-95
              disabled:pointer-events-none

              sm:right-5
              sm:h-11
              sm:w-11
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
              z-40
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
                onClick={() => selectVariant(index)}
                disabled={isAnimating || isResetting}
                aria-label={`View image ${index + 1}`}
                className={`
                  h-1.5
                  rounded-full
                  transition-all
                  duration-300
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
          {product.name}
        </h3>

        {/* PRICE */}

        <div
          className="
            mt-1.5
            flex
            items-center
            gap-2
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
                text-xs
                text-black/35
                line-through
              "
            >
              ${product.oldPrice}
            </span>
          )}
        </div>

        {/* VARIANTS */}

        <div className="mt-3 min-h-[30px]">
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
                    onClick={() =>
                      selectVariant(index)
                    }
                    disabled={
                      isAnimating ||
                      isResetting
                    }
                    aria-label={`Select ${
                      variant.name || "color"
                    }`}
                    className={`
                      relative
                      h-7
                      w-7
                      shrink-0
                      overflow-hidden
                      rounded-full
                      transition-all
                      duration-300
                      

                      ${
                        activeVariant === index
                          ? "ring-1 ring-black ring-offset-2"
                          : ""
                      }
                    `}
                  >
                    <img
                      src={variant.image}
                      alt={variant.name || ""}
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
                    text-black/40
                  "
                >
                  +{variants.length - 6}
                </span>
              )}
            </div>
          )}
        </div>

        {/* VIEW DETAILS */}

    <button
  type="button"
  onClick={() => {
    window.location.href = `/products/${product.id}`;
  }}
  className="
  cursor-pointer
    group/details
    pointer-events-auto
    mt-5
    w-full

    flex
    flex-col
    items-center

    text-[11px]
    font-bold
    uppercase
    tracking-[0.16em]
    text-black
  "
>
  {/* Top Line */}
  <span
    className="
      h-px
      w-full
      bg-gray-300
    " 
  />

  {/* Button Content */}
  <span
    className="
      flex
      items-center
      justify-center
      gap-0
      py-2
    "
  >
    <span>View Details</span>

    <span
      className="
        max-w-0
        overflow-hidden
        whitespace-nowrap
        text-sm
        opacity-0

        transition-all
        duration-[1000ms]
        ease-out

        group-hover/details:ml-2
        group-hover/details:max-w-4
        group-hover/details:opacity-100
      "
    >
      →
    </span>
  </span>

  {/* Bottom Line */}
  <span
    className="
      h-px
      w-full
      bg-gray-300
    "
  />
</button>
      </div>
    </article>
  );
};

export default ProductCard;