import React, { useEffect, useState } from "react";

import menImg from "../assets/images.webp";
import womenImg from "../assets/images2.webp";

const GenderSelector = ({ onSelectGender }) => {
  const collections = [
    {
      id: "men",
      number: "01",
      title: "Men",
      label: "Men's Collection",
      description: "Essential everyday pieces designed with a modern attitude.",
      image: menImg,
    },
    {
      id: "women",
      number: "02",
      title: "Women",
      label: "Women's Collection",
      description: "Contemporary clothing made for effortless everyday style.",
      image: womenImg,
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % collections.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full overflow-hidden px-primary-boundary-m py-primary-boundary-m text-black md:px-primary-boundary-t md:py-primary-boundary-t lg:py-primary-boundary-xl lg:px-primary-boundary-xl">
      <div className="">
        {/* =========================
            HEADER
        ========================= */}

        <div className="mb-6 flex items-end justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2.5">
              <span className="h-px w-5 bg-black" />

              <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-black/45">
                Collections
              </span>
            </div>

            <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-bold leading-[0.9] tracking-[-0.06em]">
              Shop by style.
            </h2>
          </div>

          <p className="hidden text-right text-[14px] leading-5 text-black/40 md:block">
            Explore our latest clothing collections
            <br />
            designed for everyday wear.
          </p>
        </div>

        {/* =========================
            SLIDER
        ========================= */}

        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-[1000ms] ease-[cubic-bezier(0.77,0,0.175,1)]"
            style={{
              transform: `translateX(-${activeIndex * 100}%)`,
            }}
          >
            {collections.map((collection) => (
              <div key={collection.id} className="min-w-full">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-[0.85fr_1.15fr] lg:gap-4">
                  {/* =========================
                      TEXT SIDE
                  ========================= */}

                  <div className="flex min-h-[40vh] flex-col justify-between bg-[#f6f6f4] p-5 md:max-h-[70vh] md:p-7 lg:p-8">
                    {/* Top */}

                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-black">
                        {collection.label}
                      </span>

                      <span className="text-[7px] text-black/30">
                        {collection.number}
                      </span>
                    </div>

                    {/* Center */}

                    <div>
                      <h3 className="text-[clamp(2.8rem,5vw,5rem)] font-black uppercase leading-[0.8] tracking-[-0.08em]">
                        {collection.title}
                      </h3>

                      <p className="mt-4 text-[14px] leading-5 text-black/45">
                        {collection.description}
                      </p>

                      {/* Button */}
                      {/* 
                      <button
                        type="button"
                        onClick={() => onSelectGender(collection.id)}
                        className="
                          group
                          mt-4
                          inline-flex
                          items-center
                          gap-2
                          rounded-full
                          border
                          border-black
                          bg-black
                          px-3
                          py-2
                          text-[10px]
                          font-semibold
                          tracking-wide
                          text-white
                          shadow-lg
                          shadow-black/15
                          transition-all
                          duration-300
                          hover:-translate-y-1
                          hover:bg-white
                          hover:text-black
                          hover:shadow-xl
                        "
                      >
                        <span>Shop Now</span>

                        <span
                          className="
                            flex
                            h-5
                            w-5
                            items-center
                            justify-center
                            rounded-full
                            bg-white
                            text-[10px]
                            text-black
                            transition-all
                            duration-300
                            group-hover:translate-x-1
                            group-hover:bg-black
                            group-hover:text-white
                          "
                        >
                          →
                        </span>
                      </button> */}
                    </div>

                    {/* Bottom */}
                    <div></div>

                    {/* <div className="flex items-center justify-between border-t border-black/10 pt-3">

                      <span className="text-[6px] uppercase tracking-[0.3em] text-black/30">
                        BachelorShop
                      </span>

                      <span className="text-[6px] uppercase tracking-[0.3em] text-black/30">
                        2026
                      </span>

                    </div> */}
                  </div>

                  {/* =========================
                      IMAGE SIDE
                  ========================= */}

                  <div className="group relative min-h-[40vh] overflow-hidden md:max-h-[70vh]">
                    <img
                      src={collection.image}
                      alt={`${collection.title} clothing collection`}
                      className="
      h-full
      w-full
      object-cover
      transition-transform
      duration-[1500ms]
      ease-out
      group-hover:scale-[1.035]
    "
                    />

                    {/* Image Label */}

                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                      <button
                        type="button"
                        className="
        group
        pointer-events-auto
        cursor-pointer

        mt-6

        inline-flex
        items-center
        gap-2

        rounded-full

        border
        border-black
        hover:border-bg-primary

        bg-black

        px-3
        py-2

        text-xs
        font-semibold
        tracking-wide

        text-white

        shadow-xl
        shadow-black/20

        transition-all
        duration-300
        ease-out

        hover:-translate-y-1
        hover:bg-white
        hover:text-black
        hover:shadow-2xl
        hover:shadow-black/20

        active:translate-y-0

        md:px-4
        md:py-2.5
        md:text-sm

        lg:mt-8
        lg:gap-3
        lg:px-8
        lg:py-4
      "
                      >
                        <span>Shop Now</span>

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

          lg:h-7
          lg:w-7
          lg:text-sm
        "
                        >
                          →
                        </span>
                      </button>
                    </div>

                    {/* Image Bottom */}

                    <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                      <span className="text-[clamp(1.8rem,4vw,4rem)] font-black uppercase leading-none tracking-[-0.08em] text-white">
                        {collection.title}
                      </span>

                      <span className="text-[7px] font-medium tracking-[0.3em] text-white/70">
                        0{collection.number}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* =========================
            BOTTOM NAVIGATION
        ========================= */}

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {collections.map((collection, index) => (
              <button
                key={collection.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                className="group flex items-center gap-2"
              >
                <span
                  className={`
                    h-1
                    w-1
                    rounded-full
                    transition-all
                    duration-300

                    ${
                      activeIndex === index
                        ? "scale-100 bg-black"
                        : "scale-75 bg-black/20 group-hover:bg-black/50"
                    }
                  `}
                />

                <span
                  className={`
                    text-[10px]
                    font-medium
                    uppercase
                    tracking-[0.25em]
                    transition-colors
                    duration-300

                    ${
                      activeIndex === index
                        ? "text-black"
                        : "text-black/30 group-hover:text-black"
                    }
                  `}
                >
                  {collection.title}
                </span>
              </button>
            ))}
          </div>

         
        </div>
      </div>
    </section>
  );
};

export default GenderSelector;

/**
 * @SecondDesign

 */
// import React, { useEffect, useState } from "react";

// import menImg from "../assets/images.webp";
// import womenImg from "../assets/images2.webp";

// const GenderSelector = ({ onSelectGender }) => {
//   const collections = [
//     {
//       id: "men",
//       number: "01",
//       title: "Men",
//       label: "Men's Collection",
//       description:
//         "Essential everyday pieces designed with a modern attitude.",
//       image: menImg,
//     },
//     {
//       id: "women",
//       number: "02",
//       title: "Women",
//       label: "Women's Collection",
//       description:
//         "Contemporary clothing made for effortless everyday style.",
//       image: womenImg,
//     },
//   ];

//   const [activeIndex, setActiveIndex] = useState(0);

//   // Auto slide
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setActiveIndex((prev) => (prev + 1) % collections.length);
//     }, 5000);

//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <section className="w-full overflow-hidden bg-white px-5 py-20 text-black md:px-10 md:py-28 lg:px-16">
//       <div className="mx-auto max-w-[1500px]">

//         {/* =====================================================
//             SECTION HEADER
//         ===================================================== */}

//         <div className="mb-10 flex items-end justify-between md:mb-14">

//           <div>
//             <div className="mb-4 flex items-center gap-3">
//               <span className="h-px w-8 bg-black" />

//               <span className="text-[9px] font-semibold uppercase tracking-[0.4em] text-black/45">
//                 Collections
//               </span>
//             </div>

//             <h2 className="text-[clamp(2.8rem,6vw,6rem)] font-bold leading-[0.85] tracking-[-0.07em]">
//               Shop by style.
//             </h2>
//           </div>

//           <p className="hidden max-w-[220px] text-right text-xs leading-5 text-black/40 md:block">
//             Explore our latest clothing collections designed for everyday
//             wear.
//           </p>

//         </div>

//         {/* =====================================================
//             SLIDER
//         ===================================================== */}

//         <div className="overflow-hidden">

//           <div
//             className="flex transition-transform duration-[1100ms] ease-[cubic-bezier(0.77,0,0.175,1)]"
//             style={{
//               transform: `translateX(-${activeIndex * 100}%)`,
//             }}
//           >

//             {collections.map((collection) => (
//               <div
//                 key={collection.id}
//                 className="min-w-full"
//               >

//                 {/* =================================================
//                     IMAGE BACKGROUND CARD
//                 ================================================= */}

//                 <div className="group relative min-h-[550px] overflow-hidden md:min-h-[680px] lg:min-h-[720px]">

//                   {/* Background Image */}

//                   <img
//                     src={collection.image}
//                     alt={`${collection.title} clothing collection`}
//                     className="
//                       absolute
//                       inset-0
//                       h-full
//                       w-full
//                       object-cover

//                       transition-transform
//                       duration-[1800ms]
//                       ease-out

//                       group-hover:scale-[1.035]
//                     "
//                   />

//                   {/* Soft dark gradient */}

//                   <div className="absolute inset-0 bg-black/20" />

//                   <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/20" />

//                   {/* =================================================
//                       CENTER CONTENT
//                   ================================================= */}

//                   <div className="relative z-10 flex min-h-[550px] flex-col items-center justify-center px-6 text-center md:min-h-[680px] lg:min-h-[720px]">

//                     {/* Number */}

//                     <div className="mb-5 flex items-center gap-4">

//                       <span className="h-px w-8 bg-white/50" />

//                       <span className="text-[9px] font-medium uppercase tracking-[0.4em] text-white/80">
//                         {collection.number} / {collection.label}
//                       </span>

//                       <span className="h-px w-8 bg-white/50" />

//                     </div>

//                     {/* Title */}

//                     <h3 className="text-[clamp(5rem,13vw,13rem)] font-black uppercase leading-[0.72] tracking-[-0.09em] text-white">
//                       {collection.title}
//                     </h3>

//                     {/* Description */}

//                     <p className="mt-7 max-w-[340px] text-xs leading-6 text-white/75 md:text-sm">
//                       {collection.description}
//                     </p>

//                     {/* =================================================
//                         SHOP BUTTON
//                     ================================================= */}

//                     <button
//                       type="button"
//                       onClick={() => onSelectGender(collection.id)}
//                       className="
//                         group/button
//                         pointer-events-auto
//                         cursor-pointer

//                         mt-7

//                         inline-flex
//                         items-center
//                         gap-2

//                         rounded-full

//                         border
//                         border-black

//                         bg-black

//                         px-3
//                         py-2

//                         text-xs
//                         font-semibold
//                         tracking-wide

//                         text-white

//                         shadow-xl
//                         shadow-black/20

//                         transition-all
//                         duration-300
//                         ease-out

//                         hover:-translate-y-1
//                         hover:bg-white
//                         hover:text-black
//                         hover:shadow-2xl

//                         active:translate-y-0

//                         md:px-4
//                         md:py-2.5
//                         md:text-sm

//                         lg:mt-8
//                         lg:gap-3
//                         lg:px-8
//                         lg:py-4
//                       "
//                     >
//                       <span>Shop Now</span>

//                       <span
//                         className="
//                           flex
//                           h-6
//                           w-6
//                           items-center
//                           justify-center

//                           rounded-full

//                           bg-white
//                           text-black

//                           text-xs

//                           transition-all
//                           duration-300

//                           group-hover/button:translate-x-1
//                           group-hover/button:bg-black
//                           group-hover/button:text-white

//                           md:h-6
//                           md:w-6

//                           lg:h-7
//                           lg:w-7
//                           lg:text-sm
//                         "
//                       >
//                         →
//                       </span>
//                     </button>

//                   </div>

//                   {/* =================================================
//                       TOP LABEL
//                   ================================================= */}

//                   <div className="absolute left-6 top-6 z-20 md:left-8 md:top-8">

//                     <span className="rounded-full border border-white/30 bg-white/10 px-4 py-2 text-[8px] font-medium uppercase tracking-[0.3em] text-white backdrop-blur-md">
//                       BachelorShop
//                     </span>

//                   </div>

//                   {/* =================================================
//                       BOTTOM INFO
//                   ================================================= */}

//                   <div className="absolute bottom-6 left-6 right-6 z-20 flex items-end justify-between md:bottom-8 md:left-8 md:right-8">

//                     <span className="text-[8px] uppercase tracking-[0.35em] text-white/60">
//                       Everyday Clothing
//                     </span>

//                     <span className="text-[8px] uppercase tracking-[0.35em] text-white/60">
//                       2026
//                     </span>

//                   </div>

//                 </div>

//               </div>
//             ))}

//           </div>

//         </div>

//         {/* =====================================================
//             BOTTOM NAVIGATION
//         ===================================================== */}

//         <div className="mt-7 flex items-center justify-between">

//           <div className="flex items-center gap-6">

//             {collections.map((collection, index) => (
//               <button
//                 key={collection.id}
//                 type="button"
//                 onClick={() => setActiveIndex(index)}
//                 className="group flex items-center gap-2.5"
//               >

//                 <span
//                   className={`
//                     h-1.5
//                     w-1.5
//                     rounded-full
//                     transition-all
//                     duration-300

//                     ${
//                       activeIndex === index
//                         ? "scale-100 bg-black"
//                         : "scale-75 bg-black/20 group-hover:bg-black/50"
//                     }
//                   `}
//                 />

//                 <span
//                   className={`
//                     text-[9px]
//                     font-medium
//                     uppercase
//                     tracking-[0.3em]
//                     transition-colors
//                     duration-300

//                     ${
//                       activeIndex === index
//                         ? "text-black"
//                         : "text-black/30 group-hover:text-black"
//                     }
//                   `}
//                 >
//                   {collection.title}
//                 </span>

//               </button>
//             ))}

//           </div>

//           {/* Counter */}

//           <div className="flex items-center gap-3">

//             <span className="text-[9px] font-semibold">
//               0{activeIndex + 1}
//             </span>

//             <span className="h-px w-8 bg-black/15" />

//             <span className="text-[9px] text-black/30">
//               02
//             </span>

//           </div>

//         </div>

//       </div>
//     </section>
//   );
// };

// export default GenderSelector;
