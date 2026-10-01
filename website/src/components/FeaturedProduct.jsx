import React, { useEffect, useState } from "react";
import { Ruler } from "lucide-react";

// Images
import image1 from "../assets/images.webp";
import image2 from "../assets/images2.webp";

const FeaturedProduct = () => {
  const product = {
    name: "Levi's essential western aasa ",
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
  };

  const [selectedColor, setSelectedColor] =
    useState("Indianred");

  const [selectedSize, setSelectedSize] =
    useState("S");

  const [quantity, setQuantity] =
    useState(1);

  // =====================================================
  // IMAGE SLIDER
  // =====================================================

  const sliderImages = [
    ...product.images,
    product.images[0],
  ];

  const [currentImage, setCurrentImage] =
    useState(0);

  const [isAnimating, setIsAnimating] =
    useState(false);

  const [isResetting, setIsResetting] =
    useState(false);

  // =====================================================
  // NEXT IMAGE
  // =====================================================

  const nextImage = () => {
    if (isAnimating || isResetting) return;

    setIsAnimating(true);

    setCurrentImage(
      (prev) => prev + 1
    );
  };

  // =====================================================
  // PREVIOUS IMAGE
  // =====================================================

  const previousImageHandler = () => {
    if (isAnimating || isResetting) return;

    if (currentImage === 0) {
      setIsResetting(true);

      setCurrentImage(
        product.images.length
      );

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsResetting(false);

          setCurrentImage(
            product.images.length - 1
          );
        });
      });

      return;
    }

    setIsAnimating(true);

    setCurrentImage(
      (prev) => prev - 1
    );
  };

  // =====================================================
  // AUTO SLIDER
  // =====================================================

  useEffect(() => {
    const interval = setInterval(() => {
      if (
        isAnimating ||
        isResetting
      ) {
        return;
      }

      setIsAnimating(true);

      setCurrentImage(
        (prev) => prev + 1
      );
    }, 3500);

    return () =>
      clearInterval(interval);
  }, [
    isAnimating,
    isResetting,
  ]);

  // =====================================================
  // TRANSITION END
  // =====================================================

  const handleTransitionEnd = () => {
    if (
      currentImage ===
      product.images.length
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

  return (
    <section
      className="
        w-full
        overflow-hidden
      
      "
    >
      <div
        className="
          grid
          w-full
          items-stretch
          lg:grid-cols-2
        "
      >

        {/* =================================================
            IMAGE SECTION
        ================================================== */}

        <div
          className="
            group
            relative
            h-[100svh]
            min-h-[500px]
            w-full
            overflow-hidden
            bg-neutral-100
            lg:h-full
            lg:min-h-0
          "
        >

          {/* Slider */}

          <div
            onTransitionEnd={
              handleTransitionEnd
            }
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

              transition:
                isResetting
                  ? "none"
                  : "transform 1200ms cubic-bezier(0.65, 0, 0.35, 1)",
            }}
          >
            {sliderImages.map(
              (image, index) => (
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
                    alt={`${product.name} ${
                      index + 1
                    }`}
                    className="
                      block
                      h-full
                      w-full
                      select-none
                      object-cover
                    "
                    draggable="false"
                  />
                </div>
              )
            )}
          </div>

          {/* =================================================
              PREVIOUS
          ================================================== */}

          <button
            type="button"
            onClick={
              previousImageHandler
            }
            aria-label="Previous image"
            disabled={
              isAnimating ||
              isResetting
            }
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

          {/* =================================================
              NEXT
          ================================================== */}

          <button
            type="button"
            onClick={nextImage}
            aria-label="Next image"
            disabled={
              isAnimating ||
              isResetting
            }
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

          {/* =================================================
              IMAGE INDICATORS
          ================================================== */}

          <div
            className="
              absolute
              bottom-5
              left-1/2
              z-40
              flex
              -translate-x-1/2
              items-center
              gap-2
              sm:bottom-6
            "
          >
            {product.images.map(
              (_, index) => (
                <button
                  key={index}
                  type="button"
                  disabled={
                    isAnimating ||
                    isResetting
                  }
                  onClick={() => {
                    if (
                      isAnimating ||
                      isResetting
                    ) {
                      return;
                    }

                    setIsAnimating(true);

                    setCurrentImage(
                      index
                    );
                  }}
                  className={`
                    h-1.5
                    rounded-full
                    transition-all
                    duration-300

                    ${
                      index ===
                      currentImage %
                        product.images
                          .length
                        ? "w-8 bg-black"
                        : "w-2 bg-black/30 hover:bg-black/60"
                    }
                  `}
                />
              )
            )}
          </div>
        </div>

        {/* =================================================
            PRODUCT DETAILS
        ================================================== */}

        <div
          className="
            flex
            w-full
            flex-col
            justify-center
            px-5
            py-12
            sm:px-8
            sm:py-16
            md:px-12
            lg:px-14
            xl:px-20
            2xl:px-24
          "
        >

          {/* =================================================
              PRODUCT NAME
          ================================================== */}

          <h1
            className="
              max-w-xl
              text-2xl
              font-semibold
              leading-tight
              tracking-tight
              text-black
              sm:text-3xl
              lg:text-4xl
              xl:text-[42px]
            "
          >
            {product.name}
          </h1>

          {/* =================================================
              PRICE
          ================================================== */}

          <p
            className="
              mt-5
              text-lg
              font-medium
              text-black/70
              sm:text-xl
            "
          >
            ${product.price}
          </p>

          {/* =================================================
              COLOR
          ================================================== */}

          <div className="mt-8 sm:mt-10">

            <p
              className="
                text-sm
                font-medium
                tracking-wide
                text-black
              "
            >
              Color:{" "}
              <span className="text-black/50">
                {selectedColor}
              </span>
            </p>

            <div
              className="
                mt-5
                flex
                flex-wrap
                items-center
                gap-3
                sm:gap-4
              "
            >
              {product.colors.map(
                (color) => (
                  <button
                    key={color.name}
                    type="button"
                    onClick={() =>
                      setSelectedColor(
                        color.name
                      )
                    }
                    aria-label={`Select ${color.name}`}
                    className="
                      group/color
                      relative
                      flex
                      h-13
                      w-13
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      sm:h-15
                      sm:w-15
                    "
                  >

                    {/* Tooltip */}

                    <span
                      className="
                        pointer-events-none
                        absolute
                        bottom-full
                        left-1/2
                        mb-1
                        -translate-x-1/2
                        translate-y-2
                        whitespace-nowrap
                        rounded-full
                        bg-black
                        px-3
                        py-1.5
                        text-[12px]
                        font-medium
                        text-white
                        opacity-0
                        transition-all
                        duration-300
                        group-hover/color:translate-y-0
                        group-hover/color:opacity-100
                      "
                    >
                      {color.name}
                    </span>

                    {/* Swatch */}

                    <span
                      className={`
                        h-11
                        w-11
                        rounded-full
                        border
                        transition-all
                        duration-300
                        group-hover/color:scale-110
                        sm:h-12
                        sm:w-12

                        ${
                          selectedColor ===
                          color.name
                            ? "ring-2 ring-black ring-offset-2"
                            : "border-black/10"
                        }
                      `}
                      style={{
                        backgroundColor:
                          color.value,
                      }}
                    />
                  </button>
                )
              )}
            </div>
          </div>

          {/* =================================================
              SIZE
          ================================================== */}

          <div className="mt-6 sm:mt-7">
            <div
              className="
                mb-3
                flex
                items-center
                justify-between
                sm:mb-4
              "
            >
              <p
                className="
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wide
                "
              >
                Select Size
              </p>

              <button
                type="button"
                className="
                  group
                  flex
                  items-center
                  gap-0.5
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-wide
                  opacity-60
                  transition-all
                  duration-300
                  hover:gap-1
                  hover:opacity-100
                "
              >
                <Ruler
                  size={15}
                  strokeWidth={1.8}
                />

                <span>Size Guide</span>
              </button>
            </div>

            {/* Single Size Selector */}

            <div
              className="
                rounded-full
                border
                border-black/15
                bg-white
                p-1
              "
            >
              <div
                className="
                  relative
                  grid
                  h-9
                  grid-cols-5
                  sm:h-10
                "
              >
                {/* Animated Selected Background */}

                <div
                  className="
                    pointer-events-none
                    absolute
                    inset-y-0
                    left-0
                    w-1/5
                    rounded-full
                    bg-black
                    transition-transform
                    duration-500
                    ease-[cubic-bezier(0.65,0,0.35,1)]
                  "
                  style={{
                    transform: `translateX(${
                      product.sizes.indexOf(
                        selectedSize
                      ) * 100
                    }%)`,
                  }}
                />

                {product.sizes.map(
                  (size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() =>
                        setSelectedSize(
                          size
                        )
                      }
                      className={`
                        relative
                        z-10
                        flex
                        h-full
                        items-center
                        justify-center
                        rounded-full
                        text-xs
                        font-semibold
                        tracking-wide
                        transition-colors
                        duration-300
                        active:scale-95

                        ${
                          selectedSize ===
                          size
                            ? "text-white"
                            : "text-black/50 hover:text-black"
                        }
                      `}
                    >
                      {size}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>

          {/* =================================================
              QUANTITY + ADD TO BAG
          ================================================== */}

          <div
            className="
              mt-7
              flex
              w-full
              items-center
              gap-2
              sm:mt-8
              sm:gap-3
            "
          >

            {/* Quantity */}

            <div
              className="
                flex
                h-12
                w-[112px]
                shrink-0
                items-center
                overflow-hidden
                rounded-full
                border
                border-black/15
                sm:w-[130px]
              "
            >

              {/* Minus */}

              <button
                type="button"
                onClick={() =>
                  setQuantity(
                    (prev) =>
                      Math.max(
                        1,
                        prev - 1
                      )
                  )
                }
                aria-label="Decrease quantity"
                className="
                  flex
                  h-full
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  text-lg
                  font-medium
                  text-black
                  transition
                  hover:bg-black/5
                  active:bg-black/10
                  sm:w-10
                "
              >
                −
              </button>

              {/* Quantity */}

              <div
                className="
                  flex
                  h-full
                  min-w-0
                  flex-1
                  items-center
                  justify-center
                  text-sm
                  font-semibold
                  text-black
                "
              >
                {quantity}
              </div>

              {/* Plus */}

              <button
                type="button"
                onClick={() =>
                  setQuantity(
                    (prev) =>
                      Math.min(
                        10,
                        prev + 1
                      )
                  )
                }
                aria-label="Increase quantity"
                className="
                  flex
                  h-full
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  text-lg
                  font-medium
                  text-black
                  transition
                  hover:bg-black/5
                  active:bg-black/10
                  sm:w-10
                "
              >
                +
              </button>
            </div>

            {/* Add To Bag */}

            <button
              type="button"
              className="
                flex
                h-12
                min-w-0
                flex-1
                items-center
                justify-center
                rounded-full
                bg-black
                px-4
                text-xs
                font-semibold
                tracking-wide
                text-white
                transition-all
                duration-300
                hover:scale-[1.01]
                hover:bg-black/90
                active:scale-[0.99]
                sm:px-6
                sm:text-sm
              "
            >
              Add to Bag
            </button>
          </div>

          {/* =================================================
              PAYPAL
          ================================================== */}

          <button
            type="button"
            className="
              mt-5
              flex
              h-12
              w-full
              items-center
              justify-center
              rounded-full
              bg-[#ffc439]
              px-6
              text-sm
              font-semibold
              text-[#003087]
              transition-all
              duration-300
              hover:scale-[1.01]
              active:scale-[0.99]
            "
          >
            PayPal
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProduct;