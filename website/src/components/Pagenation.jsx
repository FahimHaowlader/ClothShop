
import React from "react";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";

// Create compact pagination with first/last pages and nearby page numbers.
const getPaginationPages = (currentPage, totalPages) => {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set([
    1,
    totalPages,
    currentPage,
    currentPage - 1,
    currentPage + 1,
  ]);

  if (currentPage <= 3) {
    pages.add(2);
    pages.add(3);
    pages.add(4);
  }

  if (currentPage >= totalPages - 2) {
    pages.add(totalPages - 1);
    pages.add(totalPages - 2);
    pages.add(totalPages - 3);
  }

  const sortedPages = [...pages]
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((a, b) => a - b);

  const result = [];

  sortedPages.forEach((page, index) => {
    if (index > 0 && page - sortedPages[index - 1] > 1) {
      result.push("ellipsis-" + page);
    }

    result.push(page);
  });

  return result;
};

const Pagenation = ({
  currentPage,
  setCurrentPage,
  totalPages,
  itemsPerPage,
  setItemsPerPage,
  firstProduct,
  lastProduct,
  totalProducts,
}) => {
  const paginationPages = getPaginationPages(currentPage, totalPages);

  return (
    <div className="mt-10 border-t border-black/10 pt-5">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        {/* Product count and items per page */}
        <div className="flex items-center justify-between gap-4 sm:justify-start">
          <p className="whitespace-nowrap text-[10px] text-black/45 sm:text-xs">
            Showing{" "}
            <span className="font-semibold text-black">
              {firstProduct}–{lastProduct}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-black">
              {totalProducts}
            </span>
          </p>

          <div className="flex shrink-0 items-center gap-2">
            <label
              htmlFor="items-per-page"
              className="whitespace-nowrap text-[10px] text-black/50 sm:text-xs"
            >
              Per page
            </label>

            <div className="relative">
              <select
                id="items-per-page"
                value={itemsPerPage}
                onChange={(event) => {
                  setItemsPerPage(Number(event.target.value));
                  setCurrentPage(1);
                }}
                className="h-8 min-w-[60px] cursor-pointer appearance-none rounded-full border border-black/15 bg-white py-2 pl-4 pr-6 text-[11px] font-semibold text-black outline-none transition-colors duration-500 ease-in-out hover:border-black/40 focus:border-black sm:text-xs"
              >
                <option value={4}>4</option>
                <option value={8}>8</option>
                <option value={12}>12</option>
                <option value={16}>16</option>
              </select>

              <ChevronDown
                size={13}
                strokeWidth={1.8}
                aria-hidden="true"
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-black/50"
              />
            </div>
          </div>
        </div>

        {/* Pagination controls */}
        {totalPages > 1 && (
          <nav
            aria-label="Product pagination"
            className="flex items-center justify-center gap-1.5 sm:gap-2"
          >
            <button
              type="button"
              onClick={() =>
                setCurrentPage((page) => Math.max(1, page - 1))
              }
              disabled={currentPage === 1}
              aria-label="Previous page"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-black/15 text-black transition-colors duration-500 ease-in-out hover:border-black hover:bg-black/[0.03] disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronLeft size={16} strokeWidth={1.7} />
            </button>

            {paginationPages.map((page) =>
              typeof page === "string" ? (
                <span
                  key={page}
                  aria-hidden="true"
                  className="flex h-9 min-w-8 shrink-0 items-center justify-center px-1 text-2xl font-medium tracking-[0.08em] text-black/45 select-none"
                >
                  …
                </span>
              ) : (
                <button
                  key={page}
                  type="button"
                  onClick={() => {
                    setCurrentPage(page);
                    document.getElementById("shop-sort")?.blur();
                  }}
                  aria-label={`Go to page ${page}`}
                  aria-current={
                    currentPage === page ? "page" : undefined
                  }
                  className={`flex h-9 min-w-9 shrink-0 items-center justify-center rounded-full border px-3 text-[11px] font-semibold transition-colors duration-500 ease-in-out ${
                    currentPage === page
                      ? "border-black bg-black text-white"
                      : "border-transparent bg-transparent text-black/60 hover:border-black/20 hover:bg-black/[0.03] hover:text-black"
                  }`}
                >
                  {page}
                </button>
              ),
            )}

            <button
              type="button"
              onClick={() =>
                setCurrentPage((page) =>
                  Math.min(totalPages, page + 1),
                )
              }
              disabled={currentPage === totalPages}
              aria-label="Next page"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-black/15 text-black transition-colors duration-500 ease-in-out hover:border-black hover:bg-black/[0.03] disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronRight size={16} strokeWidth={1.7} />
            </button>
          </nav>
        )}
      </div>
    </div>
  );
};

export default Pagenation;
