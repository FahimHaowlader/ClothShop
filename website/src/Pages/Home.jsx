
import {
  ArrowRight,
  Search,
  ShoppingBag,
  User,
  UserRound,
  Truck,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";

const categories = [
  {
    name: "T-Shirts",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Shirts",
    image:
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Hoodies",
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Pants",
    image:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=80",
  },
];

const products = [
  {
    id: 1,
    name: "Essential Oversized T-Shirt",
    price: 799,
    category: "T-Shirt",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 2,
    name: "Classic Oxford Shirt",
    price: 1299,
    category: "Shirt",
    image:
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 3,
    name: "Premium Everyday Hoodie",
    price: 1499,
    category: "Hoodie",
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 4,
    name: "Relaxed Cargo Pants",
    price: 1399,
    category: "Pants",
    image:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=700&q=80",
  },
];

function Home() {
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      {/* Navbar */}
       {/* <header className="border-b border-neutral-200">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          {/* Logo *
          <a href="/" className="text-2xl font-bold tracking-tight">
            ANTIK
          </a>

          {/* Navigation 
          <nav className="hidden items-center gap-8 md:flex">
            <a href="/" className="text-sm hover:text-neutral-500">
              Home
            </a>
            <a href="/shop" className="text-sm hover:text-neutral-500">
              Shop
            </a>
            <a href="/collections" className="text-sm hover:text-neutral-500">
              Collections
            </a>
            <a href="/about" className="text-sm hover:text-neutral-500">
              About
            </a>
          </nav>

          {/* Actions  
      <div className="flex items-center gap-5">
  {/* Search Button: Tilts the magnifying glass on hover 
  <button 
    aria-label="Search" 
    className="group transform transition-transform duration-200 hover:scale-110 active:scale-95"
  >
    <div className="transition-transform duration-200 group-hover:rotate-12">
      <Search size={20} strokeWidth={1.7} />
    </div>
  </button>

  {/* Account Button: Smoothly shifts the user icon upward on hover 
  <button 
    aria-label="Account" 
    className="group transform transition-transform duration-200 hover:scale-110 active:scale-95"
  >
    <div className="transition-transform duration-200 group-hover:-translate-y-0.5">
      <UserRound size={20} strokeWidth={1.7} />
    </div>
  </button>

  {/* Shopping Bag Button: Bounces the notification badge on hover 
  <button 
    aria-label="Shopping bag" 
    className="group relative transform transition-transform duration-200 hover:scale-110 active:scale-95"
  >
    <ShoppingBag size={20} strokeWidth={1.7} />
    
    <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[10px] text-white group-hover:animate-bounce">
      2
    </span>
  </button>
</div>


        </div>
      </header>  */}

      {/* Hero */}
      <section className="relative">
        <div className="grid min-h-[650px] md:grid-cols-2">
          {/* Content */}
          <div className="flex items-center bg-neutral-100 px-6 py-20 md:px-16 lg:px-24">
            <div className="max-w-xl">
              <p className="mb-5 text-sm font-medium uppercase tracking-[0.3em] text-neutral-500">
                New Collection 2026
              </p>

              <h1 className="text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl">
                Everyday
                <br />
                <span className="text-neutral-500">Essentials.</span>
              </h1>

              <p className="mt-7 max-w-md text-base leading-7 text-neutral-600">
                Simple, comfortable and timeless clothing designed for
                everyday life.
              </p>

              <div className="mt-9 flex flex-wrap gap-4">
                <a
                  href="/shop"
                  className="flex items-center gap-3 bg-black px-7 py-4 text-sm font-medium text-white transition hover:bg-neutral-800"
                >
                  Shop Collection
                  <ArrowRight size={17} />
                </a>

                <a
                  href="/collections"
                  className="border border-black px-7 py-4 text-sm font-medium transition hover:bg-black hover:text-white"
                >
                  Explore
                </a>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="min-h-[500px] bg-neutral-200">
            <img
              src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1400&q=85"
              alt="New clothing collection"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-neutral-500">
              Explore
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
              Shop by category
            </h2>
          </div>

          <a
            href="/shop"
            className="hidden items-center gap-2 text-sm font-medium md:flex"
          >
            View all
            <ArrowRight size={16} />
          </a>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {categories.map((category) => (
            <a
              href={`/shop?category=${category.name}`}
              key={category.name}
              className="group"
            >
              <div className="aspect-[3/4] overflow-hidden bg-neutral-100">
                <img
                  src={category.image}
                  alt={category.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>

              <div className="mt-4 flex items-center justify-between">
                <h3 className="font-medium">{category.name}</h3>
                <ArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1"
                />
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="bg-neutral-50 py-24">
        <div className=" px-6">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-neutral-500">
                Just In
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
                New arrivals
              </h2>
            </div>

            <a
              href="/shop"
              className="hidden items-center gap-2 text-sm font-medium md:flex"
            >
              View all
              <ArrowRight size={16} />
            </a>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
            {products.map((product) => (
              <article key={product.id} className="group">
                <a
                  href={`/products/${product.id}`}
                  className="block overflow-hidden bg-white"
                >
                  <div className="aspect-[3/4] overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                </a>

                <div className="mt-4">
                  <p className="text-xs  uppercase tracking-wider text-neutral-500">
                    {product.category}
                  </p>

                  <h3 className="mt-1 font-medium">{product.name}</h3>

                  <p className="mt-2 font-medium">
                    ৳{product.price.toLocaleString()}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Collection */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid overflow-hidden bg-neutral-900 md:grid-cols-2">
          <div className="flex items-center px-8 py-16 text-white md:px-14 lg:px-20">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-neutral-400">
                Featured Collection
              </p>

              <h2 className="mt-5 text-4xl font-bold leading-tight md:text-5xl">
                Summer
                <br />
                Essentials
              </h2>

              <p className="mt-6 max-w-md leading-7 text-neutral-400">
                Lightweight pieces, relaxed silhouettes and everyday colors
                made for the season.
              </p>

              <a
                href="/collections/summer"
                className="mt-8 inline-flex items-center gap-3 bg-white px-7 py-4 text-sm font-medium text-black transition hover:bg-neutral-200"
              >
                Shop Collection
                <ArrowRight size={17} />
              </a>
            </div>
          </div>

          <div className="min-h-[450px]">
            <img
              src="https://images.unsplash.com/photo-1523381294911-8d3cead13475?auto=format&fit=crop&w=1200&q=85"
              alt="Summer collection"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="border-y border-neutral-200">
        <div className="mx-auto grid max-w-7xl divide-y divide-neutral-200 px-6 md:grid-cols-3 md:divide-x md:divide-y-0">
          <div className="flex items-center gap-4 py-10 md:px-8">
            <Truck size={25} strokeWidth={1.5} />

            <div>
              <h3 className="font-medium">Fast Delivery</h3>
              <p className="mt-1 text-sm text-neutral-500">
                Delivery across Bangladesh
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 py-10 md:px-8">
            <RotateCcw size={25} strokeWidth={1.5} />

            <div>
              <h3 className="font-medium">Easy Returns</h3>
              <p className="mt-1 text-sm text-neutral-500">
                Simple return process
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 py-10 md:px-8">
            <ShieldCheck size={25} strokeWidth={1.5} />

            <div>
              <h3 className="font-medium">Secure Payment</h3>
              <p className="mt-1 text-sm text-neutral-500">
                Safe and secure checkout
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-neutral-100 px-6 py-24 text-center">
        <div className="mx-auto max-w-xl">
          <p className="text-sm uppercase tracking-[0.2em] text-neutral-500">
            Stay Updated
          </p>

          <h2 className="mt-3 text-3xl font-bold md:text-4xl">
            Get the latest drops
          </h2>

          <p className="mt-4 text-neutral-600">
            Subscribe for new collections, exclusive offers and early access.
          </p>

          <form className="mx-auto mt-8 flex max-w-md">
            <input
              type="email"
              placeholder="Your email address"
              className="min-w-0 flex-1 border border-neutral-300 bg-white px-4 py-4 text-sm outline-none focus:border-black"
            />

            <button
              type="submit"
              className="bg-black px-6 text-sm font-medium text-white"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black px-6 py-16 text-white">
        <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-4">
          <div>
            <h2 className="text-2xl font-bold">ANTIK</h2>
            <p className="mt-4 max-w-xs text-sm leading-6 text-neutral-400">
              Everyday clothing designed with simplicity, comfort and quality
              in mind.
            </p>
          </div>

          <div>
            <h3 className="font-medium">Shop</h3>

            <div className="mt-5 space-y-3 text-sm text-neutral-400">
              <a href="/shop" className="block hover:text-white">
                All Products
              </a>
              <a href="/collections/new" className="block hover:text-white">
                New Arrivals
              </a>
              <a href="/collections" className="block hover:text-white">
                Collections
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-medium">Help</h3>

            <div className="mt-5 space-y-3 text-sm text-neutral-400">
              <a href="/contact" className="block hover:text-white">
                Contact
              </a>
              <a href="/shipping" className="block hover:text-white">
                Shipping
              </a>
              <a href="/returns" className="block hover:text-white">
                Returns
              </a>
              <a href="/faq" className="block hover:text-white">
                FAQ
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-medium">Follow us</h3>

            <div className="mt-5 space-y-3 text-sm text-neutral-400">
              <a href="#" className="block hover:text-white">
                Instagram
              </a>
              <a href="#" className="block hover:text-white">
                Facebook
              </a>
              <a href="#" className="block hover:text-white">
                TikTok
              </a>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-14 max-w-7xl border-t border-neutral-800 pt-6 text-sm text-neutral-500">
          © 2026 ANTIK. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default Home;
