
import { Link } from "react-router";
import { GalleryVerticalEnd } from "lucide-react";

const NoCollection = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-primary px-5 font-primary text-black">
      <div className="flex w-full flex-col items-center text-center">

        {/* Icon */}
        <div className="mb-9 flex h-[88px] w-[88px] items-center justify-center rounded-full border border-black/[0.07] bg-neutral-50">
          <GalleryVerticalEnd
            size={31}
            strokeWidth={1.1}
            className="text-black/55"
          />
        </div>

        {/* Label */}
        <div className="mb-5 flex items-center gap-3">
          <span className="h-px w-6 bg-black/20" />
          <span className="text-[9px] font-semibold uppercase tracking-[0.35em] text-black/40">
            Collection unavailable
          </span>
          <span className="h-px w-6 bg-black/20" />
        </div>

        {/* Heading */}
        <h1 className="text-[42px] font-bold leading-[0.96] tracking-[-0.075em] sm:text-5xl">
          Oops!
          
          <span className="text-black/25">Nothing to see here.</span>
        </h1>

        {/* Description */}
        <p className="mt-6 max-w-[380px] sm:max-w-[450px] lg:max-w-[600px] text-xs leading-[2] text-black/45">
          Looks like this collection isn't available right now.
          It may have been removed or the link might be incorrect.
        </p>

        {/* Button */}
        <Link
          to="/shop"
          className="
            group
            pointer-events-auto
            cursor-pointer
            relative
            z-[130]
            mt-9
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
          <span className="font-primary">Back to Shopping</span>

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
        </Link>


      </div>
    </div>
  );
};

export default NoCollection;
