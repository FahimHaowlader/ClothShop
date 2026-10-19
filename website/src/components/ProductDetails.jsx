import React, { useState } from "react";
import { Star, ChevronDown, CheckCircle2, Loader2 } from "lucide-react";

const ProductDetails = ({ product }) => {
  const description =
    product?.description ||
    `Crafted from premium-grade breathable cotton twill, the Levi's Essential Western Aasa combines timeless heritage styling with modern contemporary comfort. Featuring authentic snap-button closures, pointed western yoke stitching, and a tailored silhouette designed for effortless everyday wear. Whether styled casually over a tee or buttoned up for a polished look, this versatile staple delivers unmatched durability and timeless appeal.`;

  const features = product?.features || [
    "100% Premium lightweight cotton twill",
    "Signature western front and back yoke detailing",
    "Custom branded pearl-finish snap buttons",
    "Double chest flap pockets with button closure",
    "Curved hemline for versatile tucking or untucking",
  ];

  const initialReviewsList = product?.reviewsList || [
    {
      id: 1,
      author: "Samantha W.",
      rating: 3,
      date: "October 14, 2026",
      comment:
        "The fabric quality is phenomenal. It fits like a glove and the color is even richer in person. Highly recommended!",
      verified: true,
    },
    {
      id: 2,
      author: "Jessica M.",
      rating: 3,
      date: "September 28, 2026",
      comment:
        "Super comfortable and breathable. I get compliments every single time I wear it out. Worth every penny.",
      verified: true,
    },
    {
      id: 3,
      author: "Elena R.",
      rating: 3,
      date: "September 12, 2026",
      comment:
        "Love the western cut and snap buttons. Sizing runs true to description. Fast shipping too!",
      verified: true,
    },
    {
      id: 4,
      author: "David K.",
      rating: 5,
      date: "August 30, 2026",
      comment:
        "Excellent shirt! Great weight to the material and fits true to size.",
      verified: true,
    },
    {
      id: 5,
      author: "Rachel B.",
      rating: 5,
      date: "August 18, 2026",
      comment:
        "The color accuracy is spot on. Very high craftsmanship and clean stitching.",
      verified: true,
    },
    {
      id: 6,
      author: "Michael T.",
      rating: 4,
      date: "August 02, 2026",
      comment: "Very stylish piece. Wears comfortably all day.",
      verified: true,
    },
    {
      id: 7,
      author: "Amanda L.",
      rating: 5,
      date: "July 25, 2026",
      comment: "Ordered two colors! Easily my favorite shirt now.",
      verified: true,
    },
  ];

  // Accordion State - All closed by default
  const [openSections, setOpenSections] = useState({
    description: false,
    features: false,
    reviews: false,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Reviews Pagination, Form, Loading & Animation State
  const [reviews, setReviews] = useState(initialReviewsList);
  const [visibleCount, setVisibleCount] = useState(5);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [newReview, setNewReview] = useState({
    name: "",
    rating: 5,
    comment: "",
  });

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!newReview.name.trim() || !newReview.comment.trim()) return;

    const reviewObj = {
      id: Date.now(),
      author: newReview.name,
      rating: Number(newReview.rating),
      date: "Just now",
      comment: newReview.comment,
      verified: true,
    };

    setReviews([reviewObj, ...reviews]);
    setNewReview({ name: "", rating: 5, comment: "" });
    setShowReviewForm(false);
    
    // Trigger Success Banner State
    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
    }, 4000);
  };

  const handleViewMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + 5);
      setIsLoadingMore(false);
    }, 600);
  };

  const sections = [
    {
      id: "description",
      label: "Description",
      content: (
        <div className="space-y-8 pt-2 pb-8">
          <p className="text-sm leading-relaxed text-black/45 sm:text-base  sm:leading-7">
            {description}
          </p>
        </div>
      ),
    },
    {
      id: "features",
      label: "Specifications & Care",
      content: (
        <div className="space-y-8 pt-2 pb-8">
          <div>
            <div className="mb-4 flex items-center gap-2.5">
              <span className="h-px w-6 bg-black" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-black/45">
                Key Highlights
              </span>
            </div>
            <ul className="space-y-3.5">
              {features.map((feature, idx) => (
                <li
                  key={idx}
                  className="flex items-center gap-3 text-xs font-medium text-black/60 sm:text-sm "
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-black text-white text-[10px]">
                    ✓
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-6 border-t border-black/10">
          <div className="mb-4 flex items-center gap-2.5">
              <span className="h-px w-6 bg-black" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-black/45">
               Care Instructions
              </span>
            </div>
          
            <p className="text-xs leading-relaxed text-black/45 sm:text-sm">
              Machine wash cold with like colors. Do not bleach. Tumble dry low.
              Warm iron if needed. Do not dry clean.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "reviews",
      label: `Reviews (${reviews.length})`,
      content: (
        <div className="space-y-8 pt-2 pb-8">
          {/* Header Summary */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 sm:p-8 bg-neutral-50/60 border border-black/10 rounded-2xl">
            <div className="flex items-center gap-5">
              <div className="text-3xl font-bold tracking-[-0.04em] text-black sm:text-4xl">
                {Number(product?.rating || 4).toFixed(1)}
              </div>

              <div>
                <div className="flex items-center gap-1 text-black">
                  {[1, 2, 3, 4, 5].map((starIndex) => {
                    const rating = product?.rating || 4;
                    const fillPercentage = Math.max(
                      0,
                      Math.min(100, (rating - (starIndex - 1)) * 100)
                    );

                    return (
                      <div key={starIndex} className="relative flex items-center">
                        <Star size={18} className="text-black/20" strokeWidth={1.5} />
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

                <p className="text-xs sm:text-sm text-black/45 mt-1.5 font-medium">
                  Based on {reviews.length} verified buyer reviews
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowReviewForm((prev) => !prev)}
              className="group relative flex h-11 items-center justify-center overflow-hidden rounded-full border border-black/15 bg-black px-6 text-xs font-semibold tracking-[0.12em] text-white transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] hover:bg-white hover:text-black active:scale-[0.98] cursor-pointer"
            >
              <span>{showReviewForm ? "Cancel Review" : "Write a Review"}</span>
            </button>
          </div>

          {/* SUCCESS SUBMISSION BANNER */}
          {submittedSuccess && (
            <div className="animate-in fade-in slide-in-from-top-3 duration-500 flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200/80 rounded-2xl text-emerald-900 text-xs font-medium">
              <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
              <span>Thank you! Your review has been submitted successfully.</span>
            </div>
          )}

          {/* INLINE WRITE REVIEW FORM */}
          {showReviewForm && (
            <div className="animate-in fade-in slide-in-from-top-4 duration-500 p-6 sm:p-8 rounded-2xl border border-black/10 bg-white shadow-sm">
              <div className="mb-4 flex items-center gap-2.5">
                <span className="h-px w-6 bg-black" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-black/80">
                  Share Your Thoughts
                </span>
              </div>

              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-black/40 mb-1.5">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={newReview.name}
                      onChange={(e) =>
                        setNewReview({ ...newReview, name: e.target.value })
                      }
                      placeholder="Enter your name"
                      className="w-full rounded-xl border border-black/10 bg-neutral-50/30 px-4 py-3 text-xs text-black focus:border-black focus:bg-white focus:outline-none transition-colors duration-300"
                    />
                  </div>

                  <div className="relative">
                    <label className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-black/40 mb-1.5">
                      Rating
                    </label>
                    <div className="relative flex items-center">
                      <select
                        value={newReview.rating}
                        onChange={(e) =>
                          setNewReview({ ...newReview, rating: e.target.value })
                        }
                        className="w-full appearance-none rounded-xl border border-black/10 bg-white pl-4 pr-10 py-3 text-xs text-black focus:border-black focus:outline-none transition-colors duration-300 cursor-pointer"
                      >
                        <option value="5">5 Stars - Excellent</option>
                        <option value="4">4 Stars - Very Good</option>
                        <option value="3">3 Stars - Average</option>
                        <option value="2">2 Stars - Poor</option>
                        <option value="1">1 Star - Terrible</option>
                      </select>
                      <ChevronDown
                        size={14}
                        className="pointer-events-none absolute right-3.5 text-black/40"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-black/40 mb-1.5">
                    Comments
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={newReview.comment}
                    onChange={(e) =>
                      setNewReview({ ...newReview, comment: e.target.value })
                    }
                    placeholder="What did you like or dislike about this product?"
                    className="w-full rounded-xl border border-black/10 bg-neutral-50/30 px-4 py-3 text-xs text-black focus:border-black focus:bg-white focus:outline-none transition-colors duration-300"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="rounded-full bg-black px-6 py-3 text-xs font-semibold tracking-[0.12em] text-white transition-all duration-300 hover:bg-neutral-800 active:scale-95 cursor-pointer"
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* REVIEWS LIST */}
          <div className="divide-y divide-black/10">
            {reviews.slice(0, visibleCount).map((rev, index) => (
              <div
                key={rev.id}
                className="py-6 first:pt-0 last:pb-0 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] animate-in fade-in slide-in-from-bottom-3 fill-mode-backwards"
                style={{
                  animationDelay: `${(index % 5) * 80}ms`,
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-semibold uppercase tracking-wider text-black">
                      {rev.author}
                    </span>
                    {rev.verified && (
                      <span className="rounded-full bg-black/5 px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-black/60">
                        Verified
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-black/40">{rev.date}</span>
                </div>

                <div className="flex items-center gap-1 text-black mb-2.5">
                  {[1, 2, 3, 4, 5].map((starIndex) => {
                    const fillPercentage = Math.max(
                      0,
                      Math.min(100, (rev.rating - (starIndex - 1)) * 100)
                    );

                    return (
                      <div key={starIndex} className="relative flex items-center">
                        <Star size={12} className="text-black/20" strokeWidth={1.5} />
                        <div
                          className="absolute inset-0 overflow-hidden text-black transition-all duration-500 ease-out"
                          style={{ width: `${fillPercentage}%` }}
                        >
                          <Star size={12} fill="currentColor" strokeWidth={1.5} />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <p className="text-xs leading-relaxed text-black/50 sm:text-sm">
                  {rev.comment}
                </p>
              </div>
            ))}
          </div>

          {/* VIEW MORE BUTTON WITH LOADING SPINNER */}
          {visibleCount < reviews.length && (
            <div className="flex justify-end pt-4">
              <button
                type="button"
                disabled={isLoadingMore}
                onClick={handleViewMore}
                className="group/btn relative inline-flex items-center gap-3 rounded-full border border-black/15 bg-white px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-black shadow-sm transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] hover:bg-black hover:text-white active:scale-95 cursor-pointer disabled:pointer-events-none disabled:opacity-75"
              >
                {isLoadingMore ? (
                  <>
                    <Loader2 size={13} className="animate-spin text-black group-hover/btn:text-white" />
                    <span>Loading...</span>
                  </>
                ) : (
                  <>
                    <span>View More</span>
                    <span className="block h-px w-8 bg-black/40 will-change-[width,background-color] transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover/btn:w-10 group-hover/btn:bg-white" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <section className="w-full font-primary ">
      <div className="mx-auto ">
        {/* Top Header Title Section */}
        <div className="mb-3">
          <div className="mb-2 flex items-center gap-2.5">
            <span className="h-px w-8 bg-black" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-black/45">
              Essential Details
            </span>
          </div>
          <h2 className="text-[clamp(1.75rem,3.5vw,2.75rem)] font-bold leading-none tracking-[-0.05em] text-black">
            Product Information
          </h2>
        </div>

        {/* Expandable Vertical Accordion */}
        <div>
          {sections.map((section) => {
            const isOpen = openSections[section.id];
            return (
              <div key={section.id} className="group relative border-b border-black/10">
                <button
                  type="button"
                  onClick={() => toggleSection(section.id)}
                  className="flex w-full items-center justify-between py-4 text-left transition-colors duration-500 cursor-pointer"
                >
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-black">
                    {section.label}
                  </span>

                  <div className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:border-black group-hover:bg-black group-hover:text-white">
                    <ChevronDown
                      size={15}
                      className={`transform transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${
                        isOpen ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  </div>
                </button>

                <div
                  className={`grid transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] overflow-hidden ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">{section.content}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProductDetails;