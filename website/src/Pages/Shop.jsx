
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  ArrowUpDown,
  ArrowRight,
  Check,
  RotateCcw,
  Package,
} from "lucide-react";
import Pagenation from "../components/Pagenation.jsx";

const CATEGORIES = ["All", "Shirts", "T-Shirts", "Tops", "Jeans", "Hoodies"];
const SIZES = ["XS", "S", "M", "L", "XL"];
const PRICE_MIN = 0;
const PRICE_MAX = 3000;

const FILTER_DURATION = 1000;
const FILTER_EASING = "cubic-bezier(0.22, 1, 0.36, 1)";

const SHIRT = {
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
};

const DENIM = {
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
};

const PRODUCTS = [
  ...Array.from({ length: 20 }, (_, index) => ({
    ...SHIRT,
    id: `shirt-${index + 1}`,
  })),
  {
    id: "tshirt-1",
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
  ...Array.from({ length: 5 }, (_, index) => ({
    ...DENIM,
    id: `denim-${index + 1}`,
  })),
  {
    id: "hoodie-men",
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
    id: "top-women",
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
    id: "jeans-women",
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
    id: "shirt-women",
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
    id: "hoodie-women",
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

const formatPrice = (amount) => (
  <span>
    <span className="text-[1.25em] font-semibold">৳ </span>
    {Number(amount || 0).toLocaleString("en-BD")}
  </span>
);

const FilterGroup = ({ title, children, }) => {
  const [open, setOpen] = useState(false);

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
          className={`transition-transform duration-500 ${
            open ? "rotate-180" : "rotate-0"
          }`}
        >
          <ChevronDown size={15} className="text-black/45" />
        </span>
      </button>

      <div
        className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
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
  const [desktopFilterClosing, setDesktopFilterClosing] = useState(false);
  const [desktopFilterOpening, setDesktopFilterOpening] = useState(false);
  const [showDesktopFilterHeader, setShowDesktopFilterHeader] =
    useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  const desktopFiltersExpanded =
    showDesktopFilters && !desktopFilterClosing;

  const filteredProducts = useMemo(() => {
    const query = submittedSearch.trim().toLowerCase();

    const result = PRODUCTS.filter((product) => {
      const searchableText =
        `${product.name} ${product.category} ${product.gender}`.toLowerCase();

      const matchesSearch = !query || searchableText.includes(query);
      const matchesCategory =
        category === "All" || product.category === category;
      const matchesGender = gender === "All" || product.gender === gender;
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

  useEffect(() => {
    setCurrentPage(1);
  }, [
    submittedSearch,
    category,
    gender,
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
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
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

    const frame = requestAnimationFrame(() => {
      setDesktopFilterOpening(false);
    });

    return () => cancelAnimationFrame(frame);
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
              className={`flex pt-1 items-center gap-1.5 text-[10px] font-semibold text-black/45 transition-[opacity,transform,color] duration-[1000ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:text-black ${
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

     

      <FilterGroup title="Gender">
        <div className="flex flex-wrap gap-2">
          {["All", "Men", "Women"].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setGender(item)}
              className={`rounded-full border px-4 py-2 text-[10px] font-semibold transition-all duration-300 ${
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
                className={`transition-all duration-300 ${
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

      <FilterGroup title="Size">
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

      {/* <FilterGroup title="Color">
        <div className="flex flex-wrap gap-3">
          {[
            { name: "Olive", value: "#58732f" },
            { name: "Black", value: "#171717" },
            { name: "White", value: "#f5f5f5" },
            { name: "Brown", value: "#80624e" },
            { name: "Blue", value: "#536d91" },
            { name: "Gray", value: "#aaa9a6" },
            { name: "Cream", value: "#e8dfd0" },
            { name: "Pink", value: "#d9a2ad" },
          ].map((color) => {
            const selected = selectedColors.includes(color.name);

            return (
              <button
                key={color.name}
                type="button"
                title={color.name}
                aria-label={color.name}
                aria-pressed={selected}
                onClick={() =>
                  setSelectedColors((previous) =>
                    selected
                      ? previous.filter((item) => item !== color.name)
                      : [...previous, color.name],
                  )
                }
                className={`grid h-7 w-7 place-items-center rounded-full border transition-all duration-300 ${
                  selected
                    ? "border-black ring-2 ring-black ring-offset-2"
                    : "border-black/10 hover:scale-110"
                }`}
                style={{ backgroundColor: color.value }}
              >
                {selected && (
                  <Check
                    size={13}
                    className={
                      ["Black", "Blue", "Olive", "Brown"].includes(color.name)
                        ? "text-white"
                        : "text-black"
                    }
                  />
                )}
              </button>
            );
          })}
        </div>
      </FilterGroup> */}

      {/* <FilterGroup title="Price range">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <label className="min-w-0 flex-1">
              <span className="mb-1 block text-[10px] text-black/45">
                Minimum
              </span>
              <input
                type="number"
                min={PRICE_MIN}
                max={maxPrice}
                value={minPrice}
                onChange={(event) =>
                  setMinPrice(
                    Math.max(
                      PRICE_MIN,
                      Math.min(
                        maxPrice,
                        Number(event.target.value) || PRICE_MIN,
                      ),
                    ),
                  )
                }
                className="w-full rounded-lg border border-black/10 px-3 py-2 text-xs outline-none focus:border-black"
              />
            </label>

            <label className="min-w-0 flex-1">
              <span className="mb-1 block text-[10px] text-black/45">
                Maximum
              </span>
              <input
                type="number"
                min={minPrice}
                max={PRICE_MAX}
                value={maxPrice}
                onChange={(event) =>
                  setMaxPrice(
                    Math.max(
                      minPrice,
                      Math.min(
                        PRICE_MAX,
                        Number(event.target.value) || PRICE_MIN,
                      ),
                    ),
                  )
                }
                className="w-full rounded-lg border border-black/10 px-3 py-2 text-xs outline-none focus:border-black"
              />
            </label>
          </div>

          <div className="flex items-center justify-between text-[10px] text-black/50">
            <span>৳{minPrice.toLocaleString("en-BD")}</span>
            <span>৳{maxPrice.toLocaleString("en-BD")}</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setMinPrice(PRICE_MIN);
                setMaxPrice(1500);
              }}
              className="rounded-full border border-black/10 px-3 py-2 text-[10px] transition-colors hover:border-black"
            >
              Under ৳1,500
            </button>
            <button
              type="button"
              onClick={() => {
                setMinPrice(1500);
                setMaxPrice(PRICE_MAX);
              }}
              className="rounded-full border border-black/10 px-3 py-2 text-[10px] transition-colors hover:border-black"
            >
              ৳1,500+
            </button>
          </div>
        </div>
      </FilterGroup> */}
    </div>
  );

  return (
    <main className="min-h-screen bg-bg-primary font-primary text-black">
      <section className="px-5 py-5 sm:px-8 lg:px-12">
        <div className="mb-2 flex items-center gap-2.5">
          <span className="h-px w-8 bg-black" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-black/45">
            The BachelorShop Edition
          </span>
        </div>

        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <h1 className="text-[clamp(2.5rem,6vw,5rem)] font-bold leading-[0.95] tracking-[-0.065em]">
            Shop all
          </h1>
          <p className="max-w-md text-xs leading-relaxed text-black/50 sm:text-right sm:text-sm">
            Thoughtfully selected essentials. Discover everyday pieces that
            make getting dressed effortless.
          </p>
        </div>
      </section>

      <section className="border-b border-black/10 px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-4 pt-2 pb-4 sm:flex-row sm:items-center sm:justify-between">
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
                  placeholder="Search products..."
                  aria-label="Search products"
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
                    ? "w-5 h-5 p-1 translate-x-0 opacity-100"
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

           {/*  <p className="hidden text-[11px] text-black/45 sm:block">
              <span className="font-semibold text-black">
                {filteredProducts.length}
              </span>{" "}
              products
            </p> */}

            <div className="flex items-center gap-2 ">
              {/* <ArrowUpDown size={14} className="shrink-0 text-black/45" /> */}
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
                <option value="price-low">Low to high</option>
                <option value="price-high">High to low</option>
                <option value="name">Name: a to z</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-8 sm:px-8 sm:py-10 lg:px-12">
        <div className="mb-5 flex items-center justify-between lg:hidden">
          <p className="text-xs text-black/50">
            Showing{" "}
            <span className="font-semibold text-black">
              {filteredProducts.length}
            </span>{" "}
            of {PRODUCTS.length} products
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
              ? "gap-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[245px_minmax(0,1fr)] xl:gap-14"
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
          <aside className="relative hidden min-w-0 overflow-hidden lg:block">
            {showDesktopFilterHeader && (
              <button
                type="button"
                onClick={closeDesktopFilters}
                aria-label="Collapse filters"
                aria-expanded={desktopFiltersExpanded}
                className={`absolute left-0 top-0 z-10 flex items-center text-sm font-bold tracking-tight text-black transition-[opacity,transform] duration-[1000ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:text-black/60 ${
                  desktopFilterClosing
                    ? "translate-x-[-8px] opacity-0 pointer-events-none"
                    : "translate-x-0 opacity-100"
                }`}
              >
                <SlidersHorizontal size={18} strokeWidth={2} />
                <span className="inline-block pl-2">Filters</span>
              </button>
            )}

            <div
              inert={!showDesktopFilters || desktopFilterClosing}
              onTransitionEnd={handleDesktopFilterTransitionEnd}
              className="w-[220px] overflow-hidden xl:w-[245px]"
              style={{
                clipPath:
                  desktopFilterClosing || desktopFilterOpening
                    ? "inset(0 100% 0 0)"
                    : "inset(0 0 0 0)",
                transition: `clip-path ${FILTER_DURATION}ms ${FILTER_EASING}`,
                willChange: "clip-path",
              }}
            >
              {renderFilters()}
            </div>
          </aside>

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

export default Shop;

