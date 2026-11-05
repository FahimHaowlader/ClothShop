
import React, { useEffect, useMemo, useState,useparams } from "react";
import { Link, useParams } from "react-router";
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  ArrowRight,
  Check,
  RotateCcw,
  Package,
 
  GalleryVerticalEnd,
  
} from "lucide-react";
import Pagenation from "../components/Pagenation.jsx";
import { collections } from "../assets/collection.js";
import NoCollection from "../components/NoCollection.jsx";


const CATEGORIES = ["All", "Shirts", "T-Shirts", "Tops", "Jeans", "Hoodies"];
const SIZES = ["XS", "S", "M", "L", "XL"];
const PRICE_MIN = 0;
const PRICE_MAX = 3000;

const FILTER_DURATION = 1000;
const FILTER_EASING = "cubic-bezier(0.22, 1, 0.36, 1)";

const formatPrice = (amount) => (
  <span>
    <span className="text-[1.25em] font-semibold">৳ </span>
    {Number(amount || 0).toLocaleString("en-BD")}
  </span>
);

const normalizeCharater = (value = "") =>
  decodeURIComponent(value)
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

const FilterGroup = ({ title, children, open, onToggle }) => (
  <section className="border-b border-black/10 py-5">
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      className="flex w-full shrink-0 items-center justify-between gap-3 text-left"
    >
      <span className="shrink-0 text-xs font-bold tracking-tight text-black">
        {title}
      </span>

      <span
        className={`shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open ? "rotate-180" : "rotate-0"
        }`}
      >
        <ChevronDown size={15} className="text-black/45" />
      </span>
    </button>

    <div
      className={`grid ${
        open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
      }`}
      style={{
        transition: `grid-template-rows 650ms ${FILTER_EASING}`,
      }}
      aria-hidden={!open}
    >
      <div className="min-h-0 overflow-hidden">
        <div
          className={`pt-5 transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            open
              ? "translate-y-0 opacity-100"
              : "translate-y-1 opacity-0"
          }`}
        >
          {children}
        </div>
      </div>
    </div>
  </section>
);

const Collection = () => {
    const PRODUCTS = [
  {
    id: "shirt-men",
    name: "Essential Men's Casual Shirt",
    category: "Shirts",
    gender: "Men",
    price: 1350,
    originalPrice: 1700,
    colors: [
      { name: "White", value: "#f5f5f5" },
      { name: "Blue", value: "#536d91" },
      { name: "Black", value: "#171717" },
    ],
    sizes: ["S", "M", "L", "XL"],
    image: "YOUR_IMAGE_URL",
    badge: "New",
  },
]



  const { charater } = useParams();
  console.log("Charater from URL:", charater);

  const activeCharater = useMemo(
    () => normalizeCharater(charater),
    [charater],
  );

  const currentCollection = collections.find(
    (col) => col.name.toLowerCase() === charater?.toLowerCase()
  );

  console.log("Current Collection:", currentCollection);

  if(!currentCollection) {
    return (
      <NoCollection />
    );
  }

  if (currentCollection.name === "men") {
    return <Men />;
  } 
  if (currentCollection.name === "women") {
    return <Women />;
   }


  const [search, setSearch] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [minPrice, setMinPrice] = useState(PRICE_MIN);
  const [maxPrice, setMaxPrice] = useState(PRICE_MAX);
  const [sortBy, setSortBy] = useState("featured");

  const [CharaterOpen, setCharaterOpen] = useState(false);
  const [sizeOpen, setSizeOpen] = useState(false);
  const [colorOpen, setColorOpen] = useState(false);
  const [priceOpen, setPriceOpen] = useState(false);

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filtersMounted, setFiltersMounted] = useState(false);

  const [showDesktopFilters, setShowDesktopFilters] = useState(true);
  const [desktopFilterClosing, setDesktopFilterClosing] = useState(false);
  const [desktopFilterOpening, setDesktopFilterOpening] = useState(false);
  const [showDesktopFilterHeader, setShowDesktopFilterHeader] =
    useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  const desktopFiltersExpanded =
    showDesktopFilters && !desktopFilterClosing;

  // Get available colors dynamically from products.
  const availableColors = useMemo(() => {
    const colors = PRODUCTS.filter((product) => {
      return (
        activeCharater === "All" ||
        product.Charater?.toLowerCase() === activeCharater.toLowerCase()
      );
    }).flatMap((product) => product.colors || []);

    return [...new Map(colors.map((color) => [color.name, color])).values()];
  }, [activeCharater]);

  const filteredProducts = useMemo(() => {
    const query = submittedSearch.trim().toLowerCase();

    const result = PRODUCTS.filter((product) => {
      const matchesCharater =
        activeCharater === "All" ||
        product.Charater?.toLowerCase() === activeCharater.toLowerCase();

      const searchableText =
        `${product.name} ${product.Charater} ${product.gender || ""}`.toLowerCase();

      const matchesSearch =
        !query || searchableText.includes(query);

      const matchesPrice =
        product.price >= minPrice && product.price <= maxPrice;

      const matchesSize =
        selectedSizes.length === 0 ||
        selectedSizes.some((size) =>
          product.sizes?.includes(size),
        );

      const matchesColor =
        selectedColors.length === 0 ||
        selectedColors.some((color) =>
          product.colors?.some((item) => item.name === color),
        );

      return (
        matchesCharater &&
        matchesSearch &&
        matchesPrice &&
        matchesSize &&
        matchesColor
      );
    });

    if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "newest") {
      result.sort(
        (a, b) =>
          Number(b.badge === "New") - Number(a.badge === "New"),
      );
    }

    return result;
  }, [
    activeCharater,
    submittedSearch,
    selectedSizes,
    selectedColors,
    minPrice,
    maxPrice,
    sortBy,
  ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    activeCharater,
    submittedSearch,
    selectedSizes,
    selectedColors,
    minPrice,
    maxPrice,
    sortBy,
    itemsPerPage,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / itemsPerPage),
  );

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;

    return filteredProducts.slice(
      startIndex,
      startIndex + itemsPerPage,
    );
  }, [filteredProducts, currentPage, itemsPerPage]);

  const firstProduct =
    filteredProducts.length === 0
      ? 0
      : (currentPage - 1) * itemsPerPage + 1;

  const lastProduct = Math.min(
    currentPage * itemsPerPage,
    filteredProducts.length,
  );

  const activeFilterCount =
    selectedSizes.length +
    selectedColors.length +
    Number(minPrice !== PRICE_MIN || maxPrice !== PRICE_MAX);

  const resetFilters = () => {
    setSearch("");
    setSubmittedSearch("");
    setSearchFocused(false);
    setSelectedSizes([]);
    setSelectedColors([]);
    setMinPrice(PRICE_MIN);
    setMaxPrice(PRICE_MAX);
    setSortBy("featured");
    setCurrentPage(1);
  };

  const clearSearch = () => {
    setSearch("");
    setSubmittedSearch("");
    setCurrentPage(1);
    setSearchFocused(true);
  };

  const showSearchButton =
    searchFocused &&
    search.trim() !== submittedSearch.trim() &&
    (!submittedSearch || Boolean(search.trim()));

  const showClearButton =
    !showSearchButton && Boolean(search || submittedSearch);

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearch(value);

    if (!value.trim()) {
      setSubmittedSearch("");
      setCurrentPage(1);
    }
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setSubmittedSearch(search.trim());
    setSearchFocused(false);
    setCurrentPage(1);
  };

  const openMobileFilters = () => {
    setFiltersMounted(true);
    requestAnimationFrame(() => setFiltersOpen(true));
  };

  const closeMobileFilters = () => {
    setFiltersOpen(false);
  };

  const closeDesktopFilters = () => {
    if (!showDesktopFilters || desktopFilterClosing) return;

    setDesktopFilterClosing(true);
    setDesktopFilterOpening(false);
  };

  const openDesktopFilters = () => {
    if (showDesktopFilters && !desktopFilterClosing) return;

    setDesktopFilterClosing(false);
    setShowDesktopFilters(true);
    setShowDesktopFilterHeader(true);
    setDesktopFilterOpening(true);
  };

  useEffect(() => {
    if (!desktopFilterOpening) return;

    let firstFrame;
    let secondFrame;

    firstFrame = requestAnimationFrame(() => {
      secondFrame = requestAnimationFrame(() => {
        setDesktopFilterOpening(false);
      });
    });

    return () => {
      cancelAnimationFrame(firstFrame);
      cancelAnimationFrame(secondFrame);
    };
  }, [desktopFilterOpening]);

  const handleDesktopFilterTransitionEnd = (event) => {
    if (
      event.target !== event.currentTarget ||
      event.propertyName !== "clip-path"
    ) {
      return;
    }

    if (desktopFilterClosing) {
      setShowDesktopFilters(false);
      setShowDesktopFilterHeader(false);
      setDesktopFilterClosing(false);
    }
  };

  const renderFilters = (mobile = false) => (
    <div className="space-y-0">
      {(mobile || showDesktopFilters) && (
        <div
          className={`flex items-center lg:pb-2 ${
            mobile ? "justify-between" : "justify-end pl-[76px]"
          }`}
        >
          {!mobile && (
            <button
              type="button"
              onClick={resetFilters}
              className={`flex items-center gap-1.5 pt-1 text-[10px] font-semibold text-black/45 transition-[opacity,transform,color] duration-[1000ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:text-black ${
                desktopFilterClosing
                  ? "translate-x-[-8px] opacity-0 pointer-events-none"
                  : "translate-x-0 opacity-100"
              }`}
            >
              <RotateCcw size={12} />
              Clear all
            </button>
          )}
        </div>
      )}

      <FilterGroup
        title="Charater"
        open={CharaterOpen}
        onToggle={() => setCharaterOpen((previous) => !previous)}
      >
        <div className="space-y-3">
          {CATEGORIES.filter((item) => item !== "All").map((item) => (
            <Link
              key={item}
              to={`/Charater/${item.toLowerCase().replace(/\s+/g, "-")}`}
              className={`flex w-full items-center justify-between text-left text-xs transition-colors ${
                activeCharater.toLowerCase() === item.toLowerCase()
                  ? "font-semibold text-black"
                  : "text-black/50 hover:text-black"
              }`}
            >
              <span>{item}</span>

              <span
                className={`transition-all duration-300 ${
                  activeCharater.toLowerCase() === item.toLowerCase()
                    ? "translate-x-0 opacity-100"
                    : "-translate-x-1 opacity-0"
                }`}
              >
                <Check size={14} strokeWidth={2} />
              </span>
            </Link>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup
        title="Size"
        open={sizeOpen}
        onToggle={() => setSizeOpen((previous) => !previous)}
      >
        <div className="flex flex-wrap gap-2">
          {SIZES.map((size) => {
            const selected = selectedSizes.includes(size);

            return (
              <button
                key={size}
                type="button"
                aria-pressed={selected}
                onClick={() =>
                  setSelectedSizes((previous) =>
                    selected
                      ? previous.filter((item) => item !== size)
                      : [...previous, size],
                  )
                }
                className={`flex h-9 min-w-9 items-center justify-center rounded-full border px-3 text-[10px] font-semibold transition-all duration-300 ${
                  selected
                    ? "border-black bg-black text-white"
                    : "border-black/10 text-black/55 hover:border-black"
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </FilterGroup>

      <FilterGroup
        title="Color"
        open={colorOpen}
        onToggle={() => setColorOpen((previous) => !previous)}
      >
        <div className="space-y-3">
          {availableColors.map((color) => {
            const selected = selectedColors.includes(color.name);

            return (
              <button
                key={color.name}
                type="button"
                onClick={() =>
                  setSelectedColors((previous) =>
                    selected
                      ? previous.filter((item) => item !== color.name)
                      : [...previous, color.name],
                  )
                }
                className="flex w-full items-center justify-between text-xs"
              >
                <span className="flex items-center gap-2.5 text-black/55">
                  <span
                    className="h-4 w-4 rounded-full border border-black/10"
                    style={{ backgroundColor: color.value }}
                  />
                  {color.name}
                </span>

                <Check
                  size={14}
                  className={`transition-opacity ${
                    selected ? "opacity-100" : "opacity-0"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </FilterGroup>

      <FilterGroup
        title="Price"
        open={priceOpen}
        onToggle={() => setPriceOpen((previous) => !previous)}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-black/50">Minimum</span>
            <span className="font-semibold">{formatPrice(minPrice)}</span>
          </div>

          <input
            type="range"
            min={PRICE_MIN}
            max={PRICE_MAX}
            step={50}
            value={minPrice}
            onChange={(event) =>
              setMinPrice(
                Math.min(Number(event.target.value), maxPrice),
              )
            }
            className="w-full accent-black"
            aria-label="Minimum price"
          />

          <div className="flex items-center justify-between text-xs">
            <span className="text-black/50">Maximum</span>
            <span className="font-semibold">{formatPrice(maxPrice)}</span>
          </div>

          <input
            type="range"
            min={PRICE_MIN}
            max={PRICE_MAX}
            step={50}
            value={maxPrice}
            onChange={(event) =>
              setMaxPrice(
                Math.max(Number(event.target.value), minPrice),
              )
            }
            className="w-full accent-black"
            aria-label="Maximum price"
          />

          <div className="flex justify-between text-[10px] text-black/40">
            <span>৳ {minPrice.toLocaleString("en-BD")}</span>
            <span>৳ {maxPrice.toLocaleString("en-BD")}</span>
          </div>
        </div>
      </FilterGroup>
    </div>
  );

  return (
    <main className="min-h-screen bg-bg-primary font-primary text-black">
      {/* Page heading */}
      <section className="px-5 py-5 sm:px-8 lg:px-12">
        <div className="mb-2 flex items-center gap-2.5">
          <span className="h-px w-8 bg-black" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-black/45">
            The BachelorShop Edition
          </span>
        </div>

        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <h1 className="text-[clamp(2.5rem,6vw,5rem)] font-bold leading-[0.95] tracking-[-0.065em]">
            {activeCharater}
          </h1>

          <p className="max-w-md text-xs leading-relaxed text-black/50 sm:text-right sm:text-sm">
            Explore thoughtfully selected {activeCharater.toLowerCase()} for
            effortless everyday style.
          </p>
        </div>
      </section>

      {/* Search and sorting */}
      <section className=" border-black/10 px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-4 pb-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
          <form onSubmit={handleSearchSubmit} className="w-full sm:max-w-xs">
            <div
              className={`flex w-full items-center gap-3 border-b transition-colors duration-300 ${
                searchFocused ? "border-black" : "border-black/15"
              }`}
            >
              <div className="relative min-w-0 flex-1">
                <Search
                  size={16}
                  className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-black/40"
                />

                <input
                  type="search"
                  value={search}
                  onChange={handleSearchChange}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  placeholder={`Search ${activeCharater.toLowerCase()}...`}
                  aria-label={`Search ${activeCharater} products`}
                  className="shop-search-input w-full min-w-0 bg-transparent py-2 pl-7 pr-1 text-xs outline-none placeholder:text-black/35"
                />
              </div>

              <button
                type="submit"
                onMouseDown={(event) => event.preventDefault()}
                tabIndex={showSearchButton ? 0 : -1}
                aria-hidden={!showSearchButton}
                aria-label="Search products"
                className={`grid shrink-0 place-items-center overflow-hidden transition-[width,opacity,transform] duration-300 ease-out ${
                  showSearchButton
                    ? "w-10 translate-x-0 opacity-100"
                    : "pointer-events-none w-0 translate-x-1 opacity-0"
                }`}
              >
                <span className="whitespace-nowrap text-[10px] font-semibold">
                  Search
                </span>
              </button>

              <button
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={clearSearch}
                tabIndex={showClearButton ? 0 : -1}
                aria-hidden={!showClearButton}
                aria-label="Clear search"
                className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full transition-[width,opacity,transform,background-color] duration-300 ease-out hover:bg-neutral-200 ${
                  showClearButton
                    ? "h-5 w-5 translate-x-0 p-1 opacity-100"
                    : "pointer-events-none w-0 translate-x-1 opacity-0"
                }`}
              >
                <X size={15} strokeWidth={1.8} />
              </button>
            </div>
          </form>

          <div className="flex items-center justify-between gap-4 sm:justify-end">
            <button
              type="button"
              onClick={openMobileFilters}
              className="flex items-center gap-2 rounded-full border border-black/15 px-4 py-2.5 text-[11px] font-semibold transition-all duration-300 hover:border-black lg:hidden"
            >
              <SlidersHorizontal size={14} />
              Filters

              {activeFilterCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-black px-1 text-[9px] text-white">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <div className="flex items-center gap-2">
              <label htmlFor="Charater-sort" className="sr-only">
                Sort products
              </label>

              <select
                id="Charater-sort"
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="max-w-[155px] cursor-pointer bg-transparent py-2 text-[11px] font-semibold outline-none"
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest arrivals</option>
                <option value="price-low">Low to high</option>
                <option value="price-high">High to low</option>
                <option value="name">Name: a to z</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Products and filters */}
      <section className="px-5 py-8 sm:px-8 lg:px-12">
        <div className="mb-5 flex items-center justify-between lg:hidden">
          <p className="text-xs text-black/50">
            Showing{" "}
            <span className="font-semibold text-black">
              {filteredProducts.length}
            </span>{" "}
            products
          </p>

          {(activeFilterCount > 0 || submittedSearch) && (
            <button
              type="button"
              onClick={resetFilters}
              className="text-[10px] font-semibold text-black underline underline-offset-4"
            >
              Clear filters
            </button>
          )}
        </div>

        <div
          className={`grid min-w-0 grid-cols-1 ${
            desktopFiltersExpanded
              ? "gap-8 lg:grid-cols-[220px_minmax(0,1fr)] xl:grid-cols-[245px_minmax(0,1fr)] xl:gap-10"
              : "gap-8 lg:grid-cols-[0px_minmax(0,1fr)] lg:gap-0"
          }`}
          style={{
            transition: `
              grid-template-columns ${FILTER_DURATION}ms ${FILTER_EASING},
              column-gap ${FILTER_DURATION}ms ${FILTER_EASING}
            `,
            willChange: "grid-template-columns, column-gap",
          }}
        >
          {/* Desktop filters */}
          <aside className="relative hidden min-w-0 overflow-visible lg:block">
            <div className="sticky top-24 h-fit self-start">
              {showDesktopFilterHeader && (
                <button
                  type="button"
                  onClick={closeDesktopFilters}
                  aria-label="Collapse filters"
                  aria-expanded={desktopFiltersExpanded}
                  className={`absolute left-0 top-0 z-10 flex items-center text-sm font-bold tracking-tight text-black transition-opacity duration-[1000ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:text-black/60 ${
                    desktopFilterClosing || desktopFilterOpening
                      ? "pointer-events-none opacity-0"
                      : "opacity-100"
                  }`}
                >
                  <SlidersHorizontal size={18} strokeWidth={2} />
                  <span className="inline-block pl-2">Filters</span>
                </button>
              )}

              <div
                inert={
                  !showDesktopFilters ||
                  desktopFilterClosing ||
                  desktopFilterOpening
                }
                onTransitionEnd={handleDesktopFilterTransitionEnd}
                className="w-[220px] overflow-hidden xl:w-[245px]"
                style={{
                  clipPath:
                    !showDesktopFilters ||
                    desktopFilterClosing ||
                    desktopFilterOpening
                      ? "inset(0 100% 0 0)"
                      : "inset(0 0 0 0)",
                  transition: `clip-path ${FILTER_DURATION}ms ${FILTER_EASING}`,
                  willChange: "clip-path",
                }}
              >
                {renderFilters()}
              </div>
            </div>
          </aside>

          {/* Product grid */}
          <div className="min-w-0">
            <div className="mb-5 hidden w-full items-center justify-between gap-6 lg:flex">
              <div className="flex min-w-0 shrink-0 items-center justify-start gap-3">
                {!desktopFiltersExpanded && (
                  <button
                    type="button"
                    onClick={openDesktopFilters}
                    aria-label="Expand filters"
                    aria-expanded={desktopFiltersExpanded}
                    className="flex shrink-0 items-center text-sm font-bold tracking-tight text-black transition-colors hover:text-black/60"
                  >
                    <SlidersHorizontal size={18} strokeWidth={2} />
                  </button>
                )}

                <p className="shrink-0 text-xs text-black/50">
                  Showing{" "}
                  <span className="font-semibold text-black">
                    {filteredProducts.length}
                  </span>{" "}
                  products
                </p>
              </div>

              {(activeFilterCount > 0 || submittedSearch) &&
                !showDesktopFilters && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="text-[10px] font-semibold text-black underline underline-offset-4"
                  >
                    Clear filters
                  </button>
                )}
            </div>

            {filteredProducts.length > 0 ? (
              <>
                <div
                  className={`grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 sm:gap-y-10 ${
                    desktopFiltersExpanded
                      ? "lg:grid-cols-3 xl:grid-cols-3"
                      : "lg:grid-cols-4 xl:grid-cols-4"
                  } xl:gap-x-6`}
                >
                  {paginatedProducts.map((product) => (
                    <article
                      key={product.id}
                      className="group min-w-0 animate-[shopFadeIn_600ms_cubic-bezier(0.22,1,0.36,1)_both]"
                    >
                      <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100">
                        <Link
                          to={`/products/${product.id}`}
                          aria-label={`View ${product.name}`}
                          className="block h-full w-full"
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.045]"
                          />
                        </Link>

                        {product.badge && (
                          <span className="absolute left-2.5 top-2.5 bg-white px-2.5 py-1.5 text-[8px] font-semibold uppercase tracking-[0.14em] text-black sm:left-3 sm:top-3 sm:text-[9px]">
                            {product.badge}
                          </span>
                        )}

                        <Link
                          to={`/products/${product.id}`}
                          aria-label={`View details for ${product.name}`}
                          className="absolute bottom-0 left-0 right-0 flex translate-y-full items-center justify-between bg-white/95 px-3 py-3 text-[10px] font-semibold text-black backdrop-blur-sm transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0"
                        >
                          <span>View Details</span>
                          <ArrowRight
                            size={14}
                            className="transition-transform duration-300 group-hover:translate-x-1"
                          />
                        </Link>
                      </div>

                      <div className="pt-3.5 sm:pt-4">
                        <div className="mb-1.5 flex items-start justify-between gap-2">
                          <p className="text-[9px] font-medium uppercase tracking-[0.16em] text-black/40 sm:text-[10px]">
                            {product.Charater}
                          </p>

                          <span className="text-[9px] text-black/40 sm:text-[10px]">
                            {product.gender}
                          </span>
                        </div>

                        <Link
                          to={`/products/${product.id}`}
                          className="block text-[11px] font-semibold leading-relaxed text-black transition-colors duration-300 hover:text-black/55 sm:text-xs"
                        >
                          {product.name}
                        </Link>

                        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1">
                          <span className="text-xs font-bold text-black">
                            {formatPrice(product.price)}
                          </span>

                          {product.originalPrice > product.price && (
                            <span className="relative inline-block text-[10px] text-black/35">
                              {formatPrice(product.originalPrice)}
                              <span className="absolute -left-[5%] top-1/2 h-px w-[110%] -translate-y-1/2 bg-black/35" />
                            </span>
                          )}
                        </div>

                        <div className="mt-3 flex items-center gap-1.5">
                          {product.colors?.map((color) => (
                            <span
                              key={color.name}
                              title={color.name}
                              className="h-3.5 w-3.5 rounded-full border border-black/10 transition-transform duration-300 hover:scale-125 sm:h-4 sm:w-4"
                              style={{ backgroundColor: color.value }}
                            />
                          ))}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                <Pagenation
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  totalPages={totalPages}
                  itemsPerPage={itemsPerPage}
                  setItemsPerPage={setItemsPerPage}
                  firstProduct={firstProduct}
                  lastProduct={lastProduct}
                  totalProducts={filteredProducts.length}
                />
              </>
            ) : (
             <div className="flex flex-col items-center justify-center px-5  text-center">
  {/* Icon */}
  <div className="relative mb-7 flex h-20 w-20 items-center justify-center rounded-full border border-black/[0.06] bg-neutral-50">
    <Package
      size={30}
      strokeWidth={1.1}
      className="text-black/65"
    />

    <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-black" />
  </div>

  

  <h3 className="text-2xl font-bold tracking-[-0.06em] text-black sm:text-3xl">
    No products found<span className="text-black/25">.</span>
  </h3>

  <p className="mt-3 max-w-[380px] sm:max-w-[450px] lg:max-w-[600px] text-[12px] leading-[1.9] text-black/45">
    We couldn't find anything matching your selection.
    Try adjusting your filters or exploring a different search.
  </p>

  {/* Action */}
<button
  type="button"
  onClick={resetFilters}
  className="
    group
    pointer-events-auto
    cursor-pointer
    relative
    z-[130]
    mt-8
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
  <span className="font-primary">Reset Filters</span>

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
    <RotateCcw
      size={13}
      strokeWidth={1.8}
      className="transition-transform duration-500 group-hover:-rotate-180"
    />
  </span>
</button>

  <span className="mt-5 text-[9px] font-medium tracking-[0.12em] text-black/50">
    YOUR NEXT FAVORITE STYLE IS WAITING
  </span>
</div>
            )}
          </div>
        </div>
      </section>

      {/* Mobile and tablet filter drawer */}
      {filtersMounted && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <button
            type="button"
            aria-label="Close filters"
            onClick={closeMobileFilters}
            className={`absolute inset-0 transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              filtersOpen ? "opacity-100" : "opacity-0"
            }`}
            style={{ backgroundColor: "rgba(0, 0, 0, 0.45)" }}
          />

          <aside
            role="dialog"
            aria-modal="true"
            aria-label={`${activeCharater} product filters`}
            onTransitionEnd={(event) => {
              if (event.target === event.currentTarget && !filtersOpen) {
                setFiltersMounted(false);
              }
            }}
            className={`absolute inset-y-0 right-0 flex w-full max-w-[390px] flex-col bg-white shadow-2xl transition-transform duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
              filtersOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex items-center justify-between border-b border-black/10 px-5 py-5">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-black/40">
                  Find your style
                </p>

                <h2 className="mt-1 flex items-center gap-2 text-lg font-bold tracking-tight">
                  <SlidersHorizontal size={17} strokeWidth={1.7} />
                  Filters
                </h2>
              </div>

              <button
                type="button"
                onClick={closeMobileFilters}
                aria-label="Close filters"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 transition-all duration-300 hover:rotate-90 hover:bg-neutral-100"
              >
                <X size={17} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 pb-6">
              {renderFilters(true)}
            </div>

            <div className="flex items-center gap-3 border-t border-black/10 bg-white p-5">
              <button
                type="button"
                onClick={resetFilters}
                className="flex flex-1 items-center justify-center gap-2 rounded-full border border-black/15 px-4 py-3.5 text-xs font-semibold transition-all duration-300 hover:border-black"
              >
                <RotateCcw size={13} />
                Reset
              </button>

              <button
                type="button"
                onClick={closeMobileFilters}
                className="flex flex-[1.5] items-center justify-center gap-2 rounded-full bg-black px-4 py-3.5 text-xs font-semibold text-white transition-all duration-300 hover:bg-black/80"
              >
                Show {filteredProducts.length} products
                <ArrowRight size={14} />
              </button>
            </div>
          </aside>
        </div>
      )}

      <style>{`
        .shop-search-input::-webkit-search-cancel-button,
        .shop-search-input::-webkit-search-decoration,
        .shop-search-input::-webkit-search-results-button,
        .shop-search-input::-webkit-search-results-decoration {
          -webkit-appearance: none;
          appearance: none;
          display: none;
        }

        .shop-search-input::-ms-clear,
        .shop-search-input::-ms-reveal {
          display: none;
          width: 0;
          height: 0;
        }

        .shop-search-input {
          appearance: none;
          -webkit-appearance: none;
          border-radius: 0;
        }

        @keyframes shopFadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            scroll-behavior: auto !important;
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </main>
  );
};

export default Collection;
