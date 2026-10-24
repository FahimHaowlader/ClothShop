
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
        <div className="flex items-center justify-between gap-4 sm:justify-start">
          <p className="text-[10px] text-black/45 sm:text-xs">
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
              className="text-[10px] text-black/50 sm:text-xs"
            >
              Per page
            </label>

            <select
              id="items-per-page"
              value={itemsPerPage}
              onChange={(event) => {
                setItemsPerPage(Number(event.target.value));
                setCurrentPage(1);
              }}
              className="cursor-pointer rounded-full border border-black/15 bg-transparent px-3 py-2 text-[10px] font-semibold outline-none transition-colors hover:border-black sm:text-xs"
            >
              <option value={4}>4</option>
              <option value={8}>8</option>
              <option value={12}>12</option>
              <option value={16}>16</option>
            </select>
          </div>
        </div>

        {totalPages > 1 && (
          <nav
            aria-label="Product pagination"
            className="flex items-center justify-center gap-1 sm:gap-1.5"
          >
            <button
              type="button"
              onClick={() =>
                setCurrentPage((page) => Math.max(1, page - 1))
              }
              disabled={currentPage === 1}
              aria-label="Previous page"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-black/15 transition-all hover:border-black disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronLeft size={15} />
            </button>

            {paginationPages.map((page) =>
              typeof page === "string" ? (
                <span
                  key={page}
                  aria-hidden="true"
                  className="flex h-9 min-w-5 items-center justify-center text-xs text-black/40"
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
                  className={`flex h-9 min-w-9 items-center justify-center rounded-full px-3 text-[11px] font-semibold transition-all ${
                    currentPage === page
                      ? "bg-black text-white"
                      : "border border-transparent text-black/55 hover:border-black/20 hover:text-black"
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
              className="flex h-9 w-9 items-center justify-center rounded-full border border-black/15 transition-all hover:border-black disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronRight size={15} />
            </button>
          </nav>
        )}
      </div>
    </div>
  );
};

export default Pagenation;
