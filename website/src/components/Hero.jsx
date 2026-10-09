import React, { useEffect, useState } from "react";

// Images
import heroImg1 from "../assets/images.webp";
import heroImg2 from "../assets/images2.webp";

const Hero = () => {
  const [currentSection, setCurrentSection] = useState(0);

  const sections = [
    {
      eyebrow: "NEW COLLECTION",
      title: "Hoodie with embroidered slogan",
      subtitle:
        "Discover effortless streetwear designed for everyday comfort and modern style.",
      leftImage: heroImg1,
      rightImage: heroImg2,
    },
    {
      eyebrow: "NEW COLLECTION",
      title: "Hoodie with embroidered slogan",
      subtitle:
        "Discover one of the effortless streetwear designed for everyday comfort and modern style.",
      leftImage: heroImg1,
      rightImage: heroImg2,
    },
    {
      eyebrow: "NEW COLLECTION",
      title: "Hoodie with embroidered slogan",
      subtitle:
        "Discover effortless streetwear designed for everyday comfort and modern style.",
      leftImage: heroImg1,
      rightImage: heroImg2,
    },
    {
      eyebrow: "NEW COLLECTION",
      title: "Hoodie with embroidered slogan",
      subtitle:
        "Discover effortless streetwear designed for everyday comfort and modern style.",
      leftImage: heroImg1,
      rightImage: heroImg2,
    },
    {
      eyebrow: "URBAN ESSENTIALS",
      title: "Elevate Your Style",
      subtitle:
        "Premium essentials made to bring confidence and comfort to your everyday look.",
      leftImage: heroImg2,
      rightImage: heroImg1,
    },
    {
      eyebrow: "ESSENTIAL APPAREL",
      title: "Made for Your Lifestyle",
      subtitle:
        "Simple, versatile pieces that fit effortlessly to your  into your daily routine.",
      leftImage: heroImg2,
      rightImage: heroImg1,
    },
    {
      eyebrow: "BACHELORSHOP",
      title: "Built for Modern Living",
      subtitle:
        "Discover most timeless pieces to the created for comfort, confidence, and everyday life.",
      leftImage: heroImg1,
      rightImage: heroImg2,
    },
  ];

  /*
- ============================================
- SLIDER
- ============================================
   */

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSection(
        (prev) => (prev + 1) % sections.length
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [sections.length]);

  return (
    <section
      className="
        relative
        h-screen
        min-h-[400px]
        sm:min-h-[500px]
        lg:min-h-[600px]
        w-full
        overflow-hidden
        bg-white
        font-primary
        [perspective:1800px]
      "
    >
      {sections.map((sec, index) => {
        const isActive = index === currentSection;

        const isPrev =
          index ===
          (currentSection - 1 + sections.length) %
            sections.length;

        const isNext =
          index ===
          (currentSection + 1) % sections.length;

        /*
- ============================================
- LAYER (Fixed stacking order for smooth 1-to-2 transition)
- ============================================
         */

        let layerClass = "z-10 pointer-events-none";

        if (isActive) {
          layerClass = "z-30 pointer-events-auto";
        } else if (isPrev) {
          layerClass = "z-20 pointer-events-none";
        } else {
          layerClass = "z-10 pointer-events-none";
        }

        /*
- ============================================
- LEFT IMAGE TRANSFORM
- ============================================
         */

        let leftTransform =
          "translate-y-full [transform:rotateX(90deg)]";

        if (isActive) {
          leftTransform =
            "translate-y-0 [transform:rotateX(0deg)]";
        } else if (isPrev) {
          leftTransform =
            "-translate-y-full [transform:rotateX(-90deg)]";
        } else if (isNext) {
          leftTransform =
            "translate-y-full [transform:rotateX(90deg)]";
        }

        /*
- ============================================
- RIGHT IMAGE TRANSFORM
- ============================================
         */

        let rightTransform =
          "-translate-y-full [transform:rotateX(-90deg)]";

        if (isActive) {
          rightTransform =
            "translate-y-0 [transform:rotateX(0deg)]";
        } else if (isPrev) {
          rightTransform =
            "translate-y-full [transform:rotateX(90deg)]";
        } else if (isNext) {
          rightTransform =
            "-translate-y-full [transform:rotateX(-90deg)]";
        }

        /*
- ============================================
- MOBILE IMAGE TRANSFORM
- ============================================
         */

        let mobileTransform =
          "translate-y-full [transform:rotateX(90deg)]";

        if (isActive) {
          mobileTransform =
            "translate-y-0 [transform:rotateX(0deg)]";
        } else if (isPrev) {
          mobileTransform =
            "-translate-y-full [transform:rotateX(-90deg)]";
        } else if (isNext) {
          mobileTransform =
            "translate-y-full [transform:rotateX(90deg)]";
        }

        return (
          <div
            key={index}
            className={`
              absolute
              inset-0
              h-full
              w-full
              ${layerClass}
            `}
            style={{
              transformStyle: "preserve-3d",
            }}
          >
            {/* ========================================
                TABLET / LAPTOP
                TWO IMAGES
            ======================================== */}

            <div
              className="
                hidden
                h-full
                w-full
                md:grid
                md:grid-cols-2
              "
              style={{
                transformStyle: "preserve-3d",
              }}
            >
              {/* LEFT IMAGE */}

              <div
                className="
                  relative
                  h-full
                  w-full
                  overflow-hidden
                "
                style={{
                  transformStyle: "preserve-3d",
                }}
              >
                <div
                  className={`
                    h-full
                    w-full
                    origin-center
                    transform
                    will-change-transform
                    transition-transform
                    duration-[1800ms]
                    ease-[cubic-bezier(0.25,1,0.5,1)]
                    [backface-visibility:hidden]
                    ${leftTransform}
                  `}
                >
                  <img
                    src={sec.leftImage}
                    alt={`${sec.title} left`}
                    className="
                      h-full
                      w-full
                      object-cover
                      select-none
                    "
                    draggable="false"
                  />
                </div>
              </div>

              {/* RIGHT IMAGE */}

              <div
                className="
                  relative
                  h-full
                  w-full
                  overflow-hidden
                "
                style={{
                  transformStyle: "preserve-3d",
                }}
              >
                <div
                  className={`
                    h-full
                    w-full
                    origin-center
                    transform
                    will-change-transform
                    transition-transform
                    duration-[1800ms]
                    ease-[cubic-bezier(0.25,1,0.5,1)]
                    [backface-visibility:hidden]
                    ${rightTransform}
                  `}
                >
                  <img
                    src={sec.rightImage}
                    alt={`${sec.title} right`}
                    className="
                      h-full
                      w-full
                      object-cover
                      select-none
                    "
                    draggable="false"
                  />
                </div>
              </div>
            </div>

            {/* ========================================
                MOBILE
                SINGLE IMAGE
            ======================================== */}

            <div
              className="
                relative
                block
                h-full
                w-full
                overflow-hidden
                md:hidden
              "
              style={{
                transformStyle: "preserve-3d",
              }}
            >
              <div
                className={`
                  h-full
                  w-full
                  origin-center
                  transform
                  will-change-transform
                  transition-transform
                  duration-[1800ms]
                  ease-[cubic-bezier(0.25,1,0.5,1)]
                  [backface-visibility:hidden]
                  ${mobileTransform}
                `}
              >
                <img
                  src={sec.leftImage}
                  alt={sec.title}
                  className="
                    h-full
                    w-full
                    object-cover
                    select-none
                  "
                  draggable="false"
                />
              </div>
            </div>

            {/* ========================================
                IMAGE OVERLAY
            ======================================== */}

            <div
              className="
                pointer-events-none
                absolute
                inset-0
              "
            />
          </div>
        );
      })}

      {/* ============================================
          CENTER CONTENT (Moved outside the image loops to z-50 absolute top layer)
      ============================================ */}

     <div
        className="
          absolute
          inset-0
          z-[100]
          flex
          items-center
          justify-center
          px-5
          sm:px-8
          text-center
          pointer-events-none
        "
      >
        {sections.map((sec, index) => {
          const isActive = index === currentSection;

          return (
            <div
              key={index}
              className={`
                absolute
                inset-0
                flex
                items-center
                justify-center
                transition-opacity
                duration-1000
                ${
                  isActive
                    ? "opacity-100 pointer-events-auto"
                    : "opacity-0 pointer-events-none"
                }
              `}
            >
              <div
                className="
                  flex
                  max-w-2xl
                  flex-col
                  items-center
                  pointer-events-auto
                "
              >
               {/* TITLE */}
<h1
  className={`
    text-center
    max-w-lg
    uppercase
    text-lg
    sm:text-xl
    font-black
    leading-[0.95]
    tracking-[-0.04em]
    text-black
    drop-shadow-[0_2px_8px_rgba(255,255,255,0.5)]
    lg:max-w-2xl
    lg:text-2xl
    transition-all
    duration-1500
    ease-[cubic-bezier(0.25,1,0.5,1)]
    ${
      isActive
        ? "opacity-100 scale-100"
        : "opacity-0 scale-95"
    }
  `}
>
  {sec.title}
</h1>

{/* SUBTITLE */}
<p
  className={`
    text-center
    mt-6
    max-w-md
    text-xs
    font-medium
    leading-6
    text-black/70
    sm:leading-7
    md:text-sm
    lg:max-w-lg
    transition-all
    duration-1500
    ease-[cubic-bezier(0.25,1,0.5,1)]
    ${
      isActive
        ? "opacity-100 scale-100"
        : "opacity-0 scale-95"
    }
  `}
>
  {sec.subtitle}
</p>

                {/* BUTTON */}
                <button
                  type="button"
                  className="
                    group
                    pointer-events-auto
                    cursor-pointer
                    relative
                    z-[130]
                   
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

                  <span
                    className="
                      flex
                      h-6
                      w-6
                      items-center
                      justify-center

                      rounded-full

                      bg-white
                      text-black

                      text-xs

                      transition-all
                      duration-300

                      group-hover:translate-x-1
                      group-hover:bg-black
                      group-hover:text-white

                      md:h-6
                      md:w-6
                      font-sans
                      lg:h-7
                      lg:w-7
                      lg:text-sm
                    "
                  >
                    →
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
      

    {/* ============================================
          SLIDE INDICATORS
      ============================================ */}

      <div
        className="
          absolute
          bottom-8
          left-1/2
          z-[120]
          pointer-events-auto

          flex
          -translate-x-1/2

          items-center
          gap-2
        "
      >
        {sections.map((_, index) => (
          <button
            key={index}
            type="button"
            aria-label={`Go to slide ${index + 1}`}
            onClick={() => setCurrentSection(index)}
            className={`
              h-1.5
              rounded-full
              
              pointer-events-auto

              transition-all
              duration-500

              ${
                currentSection === index
                  ? "w-10 bg-black"
                  : "w-2 bg-black/40 hover:bg-black/70"
              }
            `}
          />
        ))}
      </div>

      {/* ============================================
          SIDE LABEL
      ============================================ */}

      <div
        className="
          absolute
          bottom-8
          left-4
          sm:left-6
          z-50
          
          block

          text-[10px]
          font-semibold
          tracking-[0.3em]

          text-black/60

          [writing-mode:vertical-lr]

          md:[writing-mode:horizontal-tb]
        "
      >
        BachelorShop
      </div>
    </section>
  );
};

export default Hero;