import React from "react";
import { ShoppingBag, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router";

const SUGGESTED_CATEGORIES = [
  { name: "New Arrivals", path: "/category/new-arrivals" },
  { name: "Best Sellers", path: "/category/best-sellers" },
  { name: "Hoodies & Sweatshirts", path: "/category/hoodies" },
  { name: "Urban Essentials", path: "/category/essentials" },
];

const EmptyBag = ({ onShopNow }) => {
  return (
    <section className="relative w-full overflow-hidden  px-5 py-16 font-primary sm:px-8  lg:px-12">
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
            Your Bag is Empty
          </span>
          <span className="h-px w-6 bg-black/20" />
        </div>

        {/* Main Heading */}
        <h2 className="text-2xl font-bold tracking-tight text-black sm:text-3xl md:text-4xl">
          Looks Like You Haven’t Added Anything Yet.
        </h2>

        {/* Subtitle Description */}
        <p className="mt-4 max-w-md text-xs leading-relaxed text-black/50 sm:text-sm sm:leading-6">
          Explore our latest drops, premium streetwear essentials, and exclusive
          collections crafted for everyday style.
        </p>

        {/* Primary Call To Action - "Shop Now" */}
       <button
                  type="button"
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
    </section>
  );
};

export default EmptyBag;