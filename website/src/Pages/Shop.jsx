
import React, { useMemo, useState } from "react";
import { Link } from "react-router";
import {
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  X,
  ChevronDown,
  ArrowUpDown,
  ArrowRight,
  Check,
  RotateCcw,
  Package,
} from "lucide-react";

const PRODUCTS = [
  {
    id: "1",
    name: "Essential Everyday Shirt",
    category: "Shirts",
    gender: "Men",
    price: 1260,
    originalPrice: 1800,
    colors: [
      { name: "Olive", value: "#58732f" },
      { name: "Black", value: "#171717" },
      { name: "White", value: "#f5f5f5" },
    ],
    sizes: ["S", "M", "L", "XL"],
    image:
      "https://images.unsplash.com/photo-1603252110481-7ba873bf42ab?auto=format&fit=crop&w=900&q=85",
    badge: "Bestseller",
  },
  {
    id: "2",
    name: "Classic Cotton T-Shirt",
    category: "T-Shirts",
    gender: "Men",
    price: 890,
    originalPrice: 1200,
    colors: [
      { name: "White", value: "#f5f5f5" },
      { name: "Black", value: "#171717" },
      { name: "Brown", value: "#80624e" },
    ],
    sizes: ["S", "M", "L", "XL"],
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=85",
    badge: "",
  },
  {
    id: "3",
    name: "Relaxed Fit Denim",
    category: "Jeans",
    gender: "Men",
    price: 1890,
    originalPrice: 2400,
    colors: [
      { name: "Blue", value: "#536d91" },
      { name: "Black", value: "#252525" },
    ],
    sizes: ["S", "M", "L", "XL"],
    image:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=900&q=85",
    badge: "Sale",
  },
  {
    id: "4",
    name: "Minimal Everyday Hoodie",
    category: "Hoodies",
    gender: "Men",
    price: 1650,
    originalPrice: 2100,
    colors: [
      { name: "Gray", value: "#aaa9a6" },
      { name: "Black", value: "#171717" },
      { name: "Cream", value: "#e8dfd0" },
    ],
    sizes: ["M", "L", "XL"],
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=85",
    badge: "",
  },
  {
    id: "5",
    name: "Contemporary Women's Top",
    category: "Tops",
    gender: "Women",
    price: 1150,
    originalPrice: 1500,
    colors: [
      { name: "White", value: "#f5f5f5" },
      { name: "Brown", value: "#80624e" },
      { name: "Black", value: "#171717" },
    ],
    sizes: ["XS", "S", "M", "L"],
    image:
      "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&q=85",
    badge: "New",
  },
  {
    id: "6",
    name: "Classic Women's Denim",
    category: "Jeans",
    gender: "Women",
    price: 1750,
    originalPrice: 2200,
    colors: [
      { name: "Blue", value: "#536d91" },
      { name: "Black", value: "#252525" },
    ],
    sizes: ["XS", "S", "M", "L"],
    image:
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=85",
    badge: "",
  },
  {
    id: "7",
    name: "Everyday Casual Shirt",
    category: "Shirts",
    gender: "Women",
    price: 1350,
    originalPrice: 1700,
    colors: [
      { name: "Cream", value: "#e8dfd0" },
      { name: "Blue", value: "#536d91" },
      { name: "White", value: "#f5f5f5" },
    ],
    sizes: ["XS", "S", "M", "L"],
    image:
      "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=900&q=85",
    badge: "",
  },
  {
    id: "8",
    name: "Essential Streetwear Hoodie",
    category: "Hoodies",
    gender: "Women",
    price: 1590,
    originalPrice: 1990,
    colors: [
      { name: "Gray", value: "#aaa9a6" },
      { name: "Black", value: "#171717" },
      { name: "Pink", value: "#d9a2ad" },
    ],
    sizes: ["S", "M", "L", "XL"],
    image:
      "https://images.unsplash.com/photo-1578681994506-b8f463449011?auto=format&fit=crop&w=900&q=85",
    badge: "New",
  },
];

const CATEGORIES = [
  "All",
  "Shirts",
  "T-Shirts",
  "Tops",
  "Jeans",
  "Hoodies",
];

const SIZES = ["XS", "S", "M", "L", "XL"];
const PRICE_MIN = 0;
const PRICE_MAX = 3000;

const SMOOTH = "duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]";

const formatPrice = (amount) => (
  <span>
    <span className="text-[1.25em] font-semibold">৳{" "}</span>
    {Number(amount || 0).toLocaleString("en-BD")}
  </span>
);

const FilterGroup = ({ title, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="border-b border-black/10 py-5">
      <button
        type="button"
        onClick={() => setOpen((previous) => !previous)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 text-left"
      >
        <span className="text-xs font-bold tracking-tight text-black">
          {title}
        </span>

        <span
          className={`transition-transform ${SMOOTH} ${
            open ? "rotate-0" : "rotate-180"
          }`}
        >
          <ChevronDown size={15} className="text-black/45" />
        </span>
      </button>

      <div
        className={`grid transition-[grid-template-rows,opacity] ${SMOOTH} ${
          open
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="pt-5">{children}</div>
        </div>
      </div>
    </section>
  );
};

const Shop = () => {
  const [search, setSearch] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  const [category, setCategory] = useState("All");
  const [gender, setGender] = useState("All");
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [minPrice, setMinPrice] = useState(PRICE_MIN);
  const [maxPrice, setMaxPrice] = useState(PRICE_MAX);
  const [sortBy, setSortBy] = useState("featured");

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filtersMounted, setFiltersMounted] = useState(false);
  const [showDesktopFilters, setShowDesktopFilters] = useState(true);

  // const availableColors = useMemo(() => {
  //   const colorMap = new Map();

  //   PRODUCTS.forEach((product) => {
  //     product.colors.forEach((color) => {
  //       if (!colorMap.has(color.name)) {
  //         colorMap.set(color.name, color);
  //       }
  //     });
  //   });

  //   return Array.from(colorMap.values());
  // }, []);

  const filteredProducts = useMemo(() => {
    const result = PRODUCTS.filter((product) => {
      const matchesSearch = `${product.name} ${product.category} ${product.gender}`
        .toLowerCase()
        .includes(submittedSearch.trim().toLowerCase());

      const matchesCategory =
        category === "All" || product.category === category;

      const matchesGender =
        gender === "All" || product.gender === gender;

      const matchesPrice =
        product.price >= minPrice && product.price <= maxPrice;

      const matchesSize =
        selectedSizes.length === 0 ||
        selectedSizes.some((size) => product.sizes.includes(size));

      const matchesColor =
        selectedColors.length === 0 ||
        selectedColors.some((color) =>
          product.colors.some((item) => item.name === color),
        );

      return (
        matchesSearch &&
        matchesCategory &&
        matchesGender &&
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
        (a, b) => Number(b.badge === "New") - Number(a.badge === "New"),
      );
    }

    return result;
  }, [
    submittedSearch,
    category,
    gender,
    selectedSizes,
    selectedColors,
    minPrice,
    maxPrice,
    sortBy,
  ]);

  const activeFilterCount =
    Number(category !== "All") +
    Number(gender !== "All") +
    selectedSizes.length +
    selectedColors.length +
    Number(minPrice !== PRICE_MIN || maxPrice !== PRICE_MAX);

  const resetFilters = () => {
    setSearch("");
    setSubmittedSearch("");
    setSearchFocused(false);
    setCategory("All");
    setGender("All");
    setSelectedSizes([]);
    setSelectedColors([]);
    setMinPrice(PRICE_MIN);
    setMaxPrice(PRICE_MAX);
    setSortBy("featured");
  };

  const clearSearch = () => {
    setSearch("");
    setSubmittedSearch("");
    setSearchFocused(false);
  };

  const openMobileFilters = () => {
    setFiltersMounted(true);

    requestAnimationFrame(() => {
      setFiltersOpen(true);
    });
  };

  const closeMobileFilters = () => {
    setFiltersOpen(false);
  };



  const renderFilters = (mobile = false) => (
    <div className="space-y-0">
      {!mobile && (
      <div className="flex items-center justify-between pb-4">
        <button
          type="button"
          onClick={() => {
            if (mobile) {
              closeMobileFilters();
            } else {
              setShowDesktopFilters(false);
            }
          }}
          aria-label={mobile ? "Close filters" : "Collapse filters"}
          className="flex items-center gap-2 text-sm font-bold tracking-tight text-black transition-colors hover:text-black/60"
        >
        
         <> 
            <ChevronLeft size={17} strokeWidth={1.9} />
          <SlidersHorizontal size={15} strokeWidth={1.7} />
          Filters
          </>
        
        </button>
        

        <button
          type="button"
          onClick={resetFilters}
          className="flex items-center gap-1.5 text-[10px] font-semibold text-black/45 transition-colors hover:text-black hover:cursor-pointer active:scale-97"
        >
          <RotateCcw size={12} />
          Clear all
        </button>
      </div>
      )}

      <FilterGroup title="Collection">
        <div className="space-y-3">
          {CATEGORIES.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={`flex w-full items-center justify-between text-left text-xs transition-colors ${
                category === item
                  ? "font-semibold text-black"
                  : "text-black/50 hover:text-black"
              }`}
            >
              <span>{item}</span>

              <span
                className={`transition-all ${SMOOTH} ${
                  category === item
                    ? "translate-x-0 opacity-100"
                    : "-translate-x-1 opacity-0"
                }`}
              >
                <Check size={14} strokeWidth={2} />
              </span>
            </button>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Gender">
        <div className="flex flex-wrap gap-2">
          {["All", "Men", "Women"].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setGender(item)}
              className={`rounded-full border px-4 py-2 text-[10px] font-semibold transition-all ${SMOOTH} ${
                gender === item
                  ? "border-black bg-black text-white"
                  : "border-black/10 text-black/55 hover:border-black/40"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </FilterGroup>

      {/* <FilterGroup title="Price range">
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 rounded-lg border border-black/10 px-3 py-2.5">
            <p className="mb-1 text-[9px] uppercase tracking-wider text-black/40">
              Minimum
            </p>

            <div className="flex items-center gap-1">
              <span className="text-xs text-black/50">৳</span>

              <input
                type="number"
                min={PRICE_MIN}
                max={maxPrice}
                value={minPrice}
                onChange={(event) =>
                  setMinPrice(
                    Math.max(
                      PRICE_MIN,
                      Math.min(Number(event.target.value) || 0, maxPrice),
                    ),
                  )
                }
                className="w-full min-w-0 bg-transparent text-xs font-semibold text-black outline-none"
                aria-label="Minimum price"
              />
            </div>
          </div>

          <span className="text-xs text-black/30">—</span>

          <div className="flex-1 rounded-lg border border-black/10 px-3 py-2.5">
            <p className="mb-1 text-[9px] uppercase tracking-wider text-black/40">
              Maximum
            </p>

            <div className="flex items-center gap-1">
              <span className="text-xs text-black/50">৳</span>

              <input
                type="number"
                min={minPrice}
                max={PRICE_MAX}
                value={maxPrice}
                onChange={(event) =>
                  setMaxPrice(
                    Math.max(
                      minPrice,
                      Math.min(Number(event.target.value) || 0, PRICE_MAX),
                    ),
                  )
                }
                className="w-full min-w-0 bg-transparent text-xs font-semibold text-black outline-none"
                aria-label="Maximum price"
              />
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-[10px] text-black/40">
          <span>{formatPrice(minPrice)}</span>
          <span>{formatPrice(maxPrice)}</span>
        </div>

        <div className="mt-2 flex gap-2">
          <input
            type="range"
            min={PRICE_MIN}
            max={PRICE_MAX}
            step={50}
            value={minPrice}
            onChange={(event) =>
              setMinPrice(Math.min(Number(event.target.value), maxPrice))
            }
            aria-label="Minimum price slider"
            className="min-w-0 flex-1 accent-black"
          />

          <input
            type="range"
            min={PRICE_MIN}
            max={PRICE_MAX}
            step={50}
            value={maxPrice}
            onChange={(event) =>
              setMaxPrice(Math.max(Number(event.target.value), minPrice))
            }
            aria-label="Maximum price slider"
            className="min-w-0 flex-1 accent-black"
          />
        </div>
      </FilterGroup> */}

      {/* <FilterGroup title="Size">
        <div className="flex flex-wrap gap-2">
          {SIZES.map((size) => {
            const isSelected = selectedSizes.includes(size);

            return (
              <button
                key={size}
                type="button"
                onClick={() => toggleSize(size)}
                aria-pressed={isSelected}
                className={`flex h-10 min-w-10 items-center justify-center rounded-lg border px-3 text-[10px] font-semibold transition-all ${SMOOTH} ${
                  isSelected
                    ? "border-black bg-black text-white"
                    : "border-black/10 text-black/60 hover:border-black/50"
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </FilterGroup> */}

      {/* <FilterGroup title="Color">
        <div className="grid grid-cols-4 gap-x-2 gap-y-4">
          {availableColors.map((color) => {
            const isSelected = selectedColors.includes(color.name);

            return (
              <button
                key={color.name}
                type="button"
                onClick={() => toggleColor(color.name)}
                aria-label={color.name}
                aria-pressed={isSelected}
                className="group flex flex-col items-center gap-2"
              >
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full border transition-all ${SMOOTH} ${
                    isSelected
                      ? "scale-105 border-black p-1"
                      : "border-black/10 p-0.5 group-hover:border-black/40"
                  }`}
                >
                  <span
                    className="h-full w-full rounded-full border border-black/5"
                    style={{ backgroundColor: color.value }}
                  />
                </span>

                <span className="text-center text-[9px] text-black/50">
                  {color.name}
                </span>
              </button>
            );
          })}
        </div>
      </FilterGroup> */}
    </div>
  );

  return (
    <main className="min-h-screen bg-bg-primary font-primary text-black">
      {/* Page heading */}
      <section className="px-5 py-5 sm:px-8 lg:px-12 ">
        <div className="mb-2 flex items-center gap-2.5">
          <span className="h-px w-8 bg-black" />

          <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-black/45">
            The BachelorShop Edit
          </span>
        </div>

        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <h1 className="text-[clamp(2.5rem,6vw,5rem)] font-bold leading-[0.95] tracking-[-0.065em]">
              Shop all
            </h1>

          </div>
            <p className=" max-w-md text-xs leading-relaxed sm:text-right text-black/50 sm:text-sm">
              Thoughtfully selected essentials. Discover everyday 
              pieces that make getting dressed effortless.
            </p>

          {/* <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-black/40 md:pb-1">
            New season · Everyday essentials
          </p> */}
        </div>
      </section>

      {/* Search and toolbar */}
      <section className="border-b border-black/10 px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              setSubmittedSearch(search.trim());
              setSearchFocused(false);
            }}
            className="w-full sm:max-w-xs"
          >
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
                  onChange={(event) => setSearch(event.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  placeholder="Search products..."
                  aria-label="Search products"
                  className="shop-search-input w-full min-w-0 bg-transparent py-2 pl-7 pr-1 text-xs outline-none placeholder:text-black/35"
                />
              </div>

              {/* Animated Search button */}
              <button
                type="submit"
                onMouseDown={(event) => event.preventDefault()}
                tabIndex={searchFocused && !submittedSearch ? 0 : -1}
                aria-hidden={!searchFocused || Boolean(submittedSearch)}
                aria-label="Search products"
                className={`grid shrink-0 place-items-center overflow-hidden transition-[width,opacity,transform] duration-300 ease-out ${
                  searchFocused && !submittedSearch
                    ? "w-10 translate-x-0 opacity-100"
                    : "w-0 translate-x-1 opacity-0"
                }`}
              >
                <span className="whitespace-nowrap text-[10px] font-semibold">
                  Search
                </span>
              </button>

              {/* Show only the custom X after submitting */}
              <button
                type="button"
                onClick={clearSearch}
                tabIndex={submittedSearch ? 0 : -1}
                aria-hidden={!submittedSearch}
                aria-label="Clear search"
                className={`grid shrink-0 place-items-center overflow-hidden transition-[width,opacity,transform] duration-300 ease-out ${
                  submittedSearch
                    ? "w-5 translate-x-0 opacity-100"
                    : "w-0 translate-x-1 opacity-0"
                }`}
              >
                <X
                  size={15}
                  strokeWidth={1.8}
                  className="transition-transform duration-300 hover:rotate-90"
                />
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

            <p className="hidden text-[11px] text-black/45 sm:block">
              <span className="font-semibold text-black">
                {filteredProducts.length}
              </span>{" "}
              products
            </p>

            <div className="flex items-center gap-2">
              <ArrowUpDown size={14} className="shrink-0 text-black/45" />

              <label htmlFor="shop-sort" className="sr-only">
                Sort products
              </label>

              <select
                id="shop-sort"
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="max-w-[155px] cursor-pointer bg-transparent py-2 text-[11px] font-semibold outline-none"
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest arrivals</option>
                <option value="price-low">Price: Low to high</option>
                <option value="price-high">Price: High to low</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Shop content */}
      <section className="px-5 py-8 sm:px-8 sm:py-10 lg:px-12">
        <div className="mb-5 flex items-center justify-between lg:hidden">
          <p className="text-xs text-black/50">
            Showingg{" "}
            <span className="font-semibold text-black">
              {filteredProducts.length}
            </span>{" "}
            of {PRODUCTS.length} products
          </p>

          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={resetFilters}
              className="text-[10px] font-semibold text-black underline underline-offset-4"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Collapsed desktop filter toggle */}
        <div
          className={`hidden overflow-hidden transition-[max-height,opacity,margin] duration-[1500ms] ease-[cubic-bezier(0.16,1,0.3,1)] lg:block ${
            showDesktopFilters
              ? "mb-0 max-h-0 opacity-0"
              : "mb-5 max-h-12 opacity-100"
          }`}
          aria-hidden={showDesktopFilters}
        >
          <button
            type="button"
            onClick={() => setShowDesktopFilters(true)}
            aria-expanded={false}
            tabIndex={showDesktopFilters ? -1 : 0}
            className="flex items-center gap-0 text-sm font-bold tracking-tight text-black transition-colors hover:text-black/60"
          >
            <SlidersHorizontal size={20} strokeWidth={2} />
            {/* <span>Filters</span> */}
            {/* <ChevronRight size={15} strokeWidth={1.8} /> */}
          </button>
        </div>

        <div
          className={`grid min-w-0 grid-cols-1 transition-[grid-template-columns,gap] duration-[1500ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
            showDesktopFilters
              ? "gap-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[245px_minmax(0,1fr)] xl:gap-14"
              : "gap-8 lg:grid-cols-[0_minmax(0,1fr)] lg:gap-0"
          }`}
        >
          <aside
            aria-hidden={!showDesktopFilters}
            className={`relative hidden min-w-0 overflow-hidden lg:block ${
              showDesktopFilters
                ? "pointer-events-auto"
                : "pointer-events-none"
            }`}
          >
            <div
              className={`sticky top-28 w-[220px] transition-[transform,opacity] duration-[1500ms] ease-[cubic-bezier(0.16,1,0.3,1)] xl:w-[245px] ${
                showDesktopFilters
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-full opacity-0"
              }`}
              inert={!showDesktopFilters}
            >
              {renderFilters()}
            </div>
          </aside>

          {/* Product listing */}
          <div className="min-w-0">
            <div className="mb-5 hidden items-center justify-between lg:flex">
              <p className="text-xs text-black/50">
                Showing{" "}
                <span className="font-semibold text-black">
                  {filteredProducts.length}
                </span>{" "}
                products
              </p>

              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="flex items-center gap-1.5 text-[10px] font-semibold text-black/45 transition-colors hover:text-black"
                >
                  <RotateCcw size={12} />
                  Reset filters
                </button>
              )}
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 sm:gap-y-10 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-6">
                {filteredProducts.map((product) => (
                  <article
                    key={product.id}
                    className="group min-w-0 animate-[shopFadeIn_450ms_cubic-bezier(0.16,1,0.3,1)_both]"
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
                          className="h-full w-full object-cover transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.045]"
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
                        className="absolute bottom-0 left-0 right-0 flex translate-y-full items-center justify-between bg-white/95 px-3 py-3 text-[10px] font-semibold text-black backdrop-blur-sm transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0"
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
                          {product.category}
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
                        {product.colors.map((color) => (
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
            ) : (
              <div className="flex min-h-[350px] flex-col items-center justify-center px-5 text-center">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100">
                  <Package size={23} strokeWidth={1.4} />
                </div>

                <h3 className="text-lg font-bold tracking-tight">
                  No products found.
                </h3>

                <p className="mt-2 max-w-xs text-xs leading-relaxed text-black/45">
                  Try changing your search or adjusting your filters to
                  discover more styles.
                </p>

                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-black px-5 py-3 text-[11px] font-semibold text-white transition-all duration-300 hover:bg-black/75"
                >
                  <RotateCcw size={13} />
                  Clear all filters
                </button>
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
            aria-label="Product filters"
            onTransitionEnd={(event) => {
              if (
                event.target === event.currentTarget &&
                !filtersOpen
              ) {
                setFiltersMounted(false);
              }
            }}
            className={`absolute inset-y-0 right-0 flex w-full max-w-[390px] flex-col bg-white shadow-2xl transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
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
        /* Hide the browser's built-in search clear button */
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

export default Shop;
