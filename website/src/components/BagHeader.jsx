const BagHeader = () => {
  return (
   <div> 
       <header className="w-full  font-primary py-3 sm:py-5">
      <div className="px-5 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end items-start justify-between gap-4">
          {/* Left Title & Tag */}
          <div>
            {/* Section Tag Accent Line */}
            <div className="mb-2 flex items-center gap-2.5">
              <span className="h-px w-8 bg-black" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-black/45">
                Your Selection
              </span>
            </div>

            {/* Headline with Live Item Pill Counter */}
            <div className="flex items-center gap-3">
              <h1 className="text-[clamp(2rem,4vw,3.5rem)] font-bold leading-[0.9] tracking-[-0.06em]  text-black">
                Shopping Bag
              </h1>

              {/* Pill Counter */}
              <span className="inline-flex h-7 min-w-[28px] items-center justify-center rounded-full border border-black/15 bg-black/[0.03] px-2.5 text-xs font-bold text-black shadow-2xs">
                {0}
              </span>
            </div>
          </div>

          {/* Right Subtitle Description */}
          <p className="text-xs leading-relaxed text-black/50 hidden sm:block sm:text-right sm:text-sm">
            Review your selected streetwear essentials <br /> before proceeding to checkout.
          </p>
        </div>
      </div>
    </header>
      </div>
  );
};  

export default BagHeader;