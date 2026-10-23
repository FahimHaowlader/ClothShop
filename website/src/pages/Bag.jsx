import React, { useState } from "react";
import BagItem from "../components/BagItem";
import EmptyBag from "../components/EmptyBag";
import BagHeader from "../components/BagHeader";
import BagSummary from "../components/BagSummary";
import BagSummarySkeleton from "../components/BagSummarySkeleton";
import BagItemSkeleton from "../components/BagItemSkeleton";

const Bag = () => {
  // Cart items state with strictly unique IDs
  // const [items, setItems] = useState([])
  const [items, setItems] = useState([
    {
      id: "cart-item-1",
      name: "Hoodie with embroidered slogan",
      price: 126,
      originalPrice: 180,
      selectedColor: "Black",
      colorValue: "#000000",
      selectedSize: "M",
      quantity: 1,
      image:
        "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
      sku: "YX180-27",
      slug: "hoodie-embroidered-slogan",
    },
    {
      id: "cart-item-2",
      name: "Heavyweight Boxy Fleece",
      price: 145,
      originalPrice: null,
      selectedColor: "Charcoal",
      colorValue: "#333333",
      selectedSize: "L",
      quantity: 1,
      image:
        "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
      sku: "YX180-28",
      slug: "heavyweight-boxy-fleece",
    },
    {
      id: "cart-item-3",
      name: "Heavyweight Boxy Fleece",
      price: 145,
      originalPrice: null,
      selectedColor: "Charcoal",
      colorValue: "#333333",
      selectedSize: "L",
      quantity: 1,
      image:
        "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
      sku: "YX180-28",
      slug: "heavyweight-boxy-fleece",
    },
    
    {
      id: "cart-item-4",
      name: "Heavyweight Boxy Fleece",
      price: 145,
      originalPrice: null,
      selectedColor: "Charcoal",
      colorValue: "#333333",
      selectedSize: "L",
      quantity: 1,
      image:
        "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
      sku: "YX180-28",
      slug: "heavyweight-boxy-fleece",
    },
    
    {
      id: "cart-item-5",
      name: "Heavyweight Boxy Fleece",
      price: 145,
      originalPrice: null,
      selectedColor: "Charcoal",
      colorValue: "#333333",
      selectedSize: "L",
      quantity: 1,
      image:
        "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
      sku: "YX180-28",
      slug: "heavyweight-boxy-fleece",
    },
    
    
    
    
  ]);

  const [loading, setLoading] = useState(false);

  // Handle quantity changes from BagItem steppers
  const handleUpdateQuantity = (id, newQuantity) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Handle item removal cleanly by unique ID
  const handleRemoveItem = (id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <div className="w-full font-primary antialiased pb-24">
      {/* BAG HEADER */}
      <BagHeader count={items.length} />

      {loading ? (
        <div className="mx-auto max-w-7xl px-6 py-12">
          <BagSummarySkeleton />
        </div>
      ) : items.length === 0 ? (
        /* EMPTY STATE RENDER */
        <EmptyBag />
      ) : (
        /* FILLED BAG GRID LAYOUT */
        <div className=" grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start lg:gap-12 px-10">
          
          {/* LEFT COLUMN: CART ITEMS LIST */}
          <section className="flex flex-col lg:col-span-7 xl:col-span-8">
            <div className="flex flex-col">

              {items.map((item) => (
                <BagItem
                  key={item.id}
                  item={item}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemove={handleRemoveItem}
                />
              ))}
            </div>
          </section>

          {/* RIGHT COLUMN: STICKY BAG SUMMARY SIDEBAR */}
          <aside className="lg:col-span-5 pt-2 sm:pt-5 xl:col-span-4 lg:sticky lg:top-[13%]">
            <BagSummary items={items} />
          </aside>

        </div>
      )}
      {/* <BagItemSkeleton/> */}
    </div>
  );
};

export default Bag;