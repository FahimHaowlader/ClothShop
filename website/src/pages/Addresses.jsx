import React, { useState, useRef } from "react";
import {
  MapPin,
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  Home,
  Briefcase,
  Building,
  Sparkles,
  X,
  AlertTriangle,
  Loader2,
} from "lucide-react";

// Initial Mock Addresses Data
const INITIAL_ADDRESSES = [
  {
    id: "addr-1",
    label: "Home",
    type: "home", // "home" | "work" | "other"
    fullName: "Siam Ahmed",
    phone: "+880 1712-345678",
    addressLine: "House 42, Road 11, Block D",
    area: "Banani",
    city: "Dhaka",
    postalCode: "1213",
    isDefault: true,
  },
  {
    id: "addr-2",
    label: "Office",
    type: "work",
    fullName: "Siam Ahmed",
    phone: "+880 1819-987654",
    addressLine: "Level 8, Tower 3, Tech Park",
    area: "Gulshan-2",
    city: "Dhaka",
    postalCode: "1212",
    isDefault: false,
  },
];

const Addresses = () => {
  const [addresses, setAddresses] = useState(INITIAL_ADDRESSES);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [successInfo, setSuccessInfo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Ref to scroll to top of component
  const topRef = useRef(null);

  // Form State
  const [formData, setFormData] = useState({
    label: "Home",
    type: "home",
    fullName: "",
    phone: "",
    addressLine: "",
    area: "",
    city: "Dhaka",
    postalCode: "",
    isDefault: false,
  });

  // Helper to scroll to top smoothly
  const scrollToTop = () => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Helper to show temporary success notification
  const showSuccess = (message) => {
    setSuccessInfo(message);
    scrollToTop();
    setTimeout(() => {
      setSuccessInfo("");
    }, 4000);
  };

  // Handle Set Default with Loading State
  const handleSetDefault = (id) => {
    setActionLoadingId(id);
    setTimeout(() => {
      setAddresses((prev) =>
        prev.map((item) => ({
          ...item,
          isDefault: item.id === id,
        }))
      );
      setActionLoadingId(null);
      showSuccess("Default address updated successfully.");
    }, 500);
  };

  // Confirm Delete Address
  const confirmDelete = (id) => {
    setAddresses((prev) => prev.filter((item) => item.id !== id));
    setDeletingId(null);
    showSuccess("Address deleted successfully.");
  };

  // Open Inline Form for Add / Edit
  const openForm = (address = null) => {
    if (address) {
      setEditingAddress(address);
      setFormData(address);
    } else {
      setEditingAddress(null);
      setFormData({
        label: "Home",
        type: "home",
        fullName: "",
        phone: "",
        addressLine: "",
        area: "",
        city: "Dhaka",
        postalCode: "",
        isDefault: addresses.length === 0,
      });
    }
    setIsFormOpen(true);
    scrollToTop();
  };

  // Handle Form Submit with Loading Effect & Auto Scroll Top
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      if (editingAddress) {
        setAddresses((prev) =>
          prev.map((item) => (item.id === editingAddress.id ? formData : item))
        );
        showSuccess("Address updated successfully.");
      } else {
        const newAddress = {
          ...formData,
          id: `addr-${Date.now()}`,
        };
        if (formData.isDefault) {
          setAddresses((prev) =>
            prev.map((item) => ({ ...item, isDefault: false })).concat(newAddress)
          );
        } else {
          setAddresses((prev) => [...prev, newAddress]);
        }
        showSuccess("New address added successfully.");
      }

      setIsSubmitting(false);
      setIsFormOpen(false);
    }, 600); // Simulated delay for loading feedback
  };

  // Icon Helper by Type
  const getTypeIcon = (type) => {
    switch (type) {
      case "home":
        return <Home size={15} />;
      case "work":
        return <Briefcase size={15} />;
      default:
        return <Building size={15} />;
    }
  };

  return (
    <section className="w-full font-primary px-5 py-5 sm:px-8 lg:px-12">
      <div ref={topRef}>
        {/* Page Header */}
        <div className="mb-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2.5">
              <span className="h-px w-8 bg-black" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-black/45">
                Saved Locations
              </span>
            </div>
            <h1 className="text-[clamp(2rem,4vw,3.5rem)] font-bold leading-[0.9] tracking-[-0.06em] text-black">
              My Addresses
            </h1>
          </div>

          <p className="hidden text-right text-xs sm:text-sm leading-relaxed text-black/40 md:block max-w-xl">
            Manage your shipping and billing addresses for faster
            <br />
            checkout, or add a new delivery point.
          </p>
        </div>

        {/* Success Info Banner */}
        {successInfo && (
          <div className="mb-6 flex items-center justify-between rounded-xl border border-black/10 bg-black/5 p-4 text-xs font-semibold text-black animate-in fade-in duration-300">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 size={16} strokeWidth={2.2} className="text-black shrink-0" />
              <span>{successInfo}</span>
            </div>
            <button
              type="button"
              onClick={() => setSuccessInfo("")}
              className="text-black/40 hover:text-black cursor-pointer"
            >
              <X size={15} />
            </button>
          </div>
        )}
 
        {/* Top Action Bar */}
        {addresses.length > 0 && 
        (<div className="mb-4 flex items-center justify-between gap-4 pb-3 ">
          <p className="text-xs font-semibold text-black/50 w-28 sm:w-auto">
            Showing {addresses.length} saved{" "}
            {addresses.length === 1 ? "address" : "addresses"}
          </p>

          {!isFormOpen && (
            <button
              type="button"
              onClick={() => openForm()}
              className="inline-flex items-center gap-2 rounded-full border border-black/20 bg-white px-3 sm:px-6 py-2.5 text-xs font-semibold text-black hover:bg-black hover:text-white transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] active:scale-95 cursor-pointer shadow-sm"
            >
              <Plus size={15} />
              <span>Add New Address</span>
            </button>
          )}
        </div>)}

        {/* Inline Form Section */}
        {isFormOpen && (
          <div className="mb-8 rounded-2xl border border-black/10 bg-white p-6 sm:p-8 shadow-xs animate-in fade-in duration-300">
            <div className="flex items-center justify-between border-b border-black/10 pb-4">
              <h3 className="text-base font-bold text-black tracking-tight">
                {editingAddress ? "Edit Address" : "Add New Address"}
              </h3>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => setIsFormOpen(false)}
                className="rounded-full p-1.5 text-black/40 hover:bg-black/5 hover:text-black cursor-pointer disabled:opacity-50"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              {/* Type Selection */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-black/45 mb-2">
                  Address Tag
                </label>
                <div className="flex gap-2 max-w-md">
                  {["home", "work", "other"].map((t) => (
                    <button
                      key={t}
                      type="button"
                      disabled={isSubmitting}
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          type: t,
                          label: t.charAt(0).toUpperCase() + t.slice(1),
                        }))
                      }
                      className={`capitalize flex-1 rounded-xl py-2 text-xs font-semibold border transition-all cursor-pointer ${
                        formData.type === t
                          ? "bg-black text-white border-black"
                          : "bg-white border-black/10 text-black/60 hover:border-black hover:text-black"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-black/45 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    disabled={isSubmitting}
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    className="w-full rounded-xl border border-black/10 bg-neutral-50/30 px-3.5 py-2.5 text-xs text-black focus:border-black focus:outline-none disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-black/45 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    required
                    disabled={isSubmitting}
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full rounded-xl border border-black/10 bg-neutral-50/30 px-3.5 py-2.5 text-xs text-black focus:border-black focus:outline-none disabled:opacity-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-black/45 mb-1">
                  Street / House Address
                </label>
                <input
                  type="text"
                  required
                  disabled={isSubmitting}
                  value={formData.addressLine}
                  onChange={(e) =>
                    setFormData({ ...formData, addressLine: e.target.value })
                  }
                  className="w-full rounded-xl border border-black/10 bg-neutral-50/30 px-3.5 py-2.5 text-xs text-black focus:border-black focus:outline-none disabled:opacity-50"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-black/45 mb-1">
                    Area
                  </label>
                  <input
                    type="text"
                    required
                    disabled={isSubmitting}
                    value={formData.area}
                    onChange={(e) =>
                      setFormData({ ...formData, area: e.target.value })
                    }
                    className="w-full rounded-xl border border-black/10 bg-neutral-50/30 px-3.5 py-2.5 text-xs text-black focus:border-black focus:outline-none disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-black/45 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    disabled={isSubmitting}
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    className="w-full rounded-xl border border-black/10 bg-neutral-50/30 px-3.5 py-2.5 text-xs text-black focus:border-black focus:outline-none disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-black/45 mb-1">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    required
                    disabled={isSubmitting}
                    value={formData.postalCode}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        postalCode: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-black/10 bg-neutral-50/30 px-3.5 py-2.5 text-xs text-black focus:border-black focus:outline-none disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="default-check"
                  disabled={isSubmitting}
                  checked={formData.isDefault}
                  onChange={(e) =>
                    setFormData({ ...formData, isDefault: e.target.checked })
                  }
                  className="rounded border-black/20 text-black focus:ring-black accent-black cursor-pointer disabled:opacity-50"
                />
                <label
                  htmlFor="default-check"
                  className="text-xs font-semibold text-black cursor-pointer select-none"
                >
                  Set as default delivery address
                </label>
              </div>

              {/* Form Buttons */}
              <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-black/10">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setIsFormOpen(false)}
                  className="inline-flex items-center gap-2 rounded-full border border-black/20 bg-white px-6 py-2.5 text-xs font-semibold text-black hover:bg-black hover:text-white transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] active:scale-95 cursor-pointer shadow-sm disabled:pointer-events-none disabled:opacity-75"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 rounded-full border border-black/20 bg-white px-6 py-2.5 text-xs font-semibold text-black hover:bg-black hover:text-white transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] active:scale-95 cursor-pointer shadow-sm disabled:pointer-events-none disabled:opacity-75"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={14} className="animate-spin text-inherit" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>{editingAddress ? "Save Changes" : "Save Address"}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Addresses Grid */}
        {addresses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {addresses.map((address) => (
              <div
                key={address.id}
                className={`relative flex flex-col justify-between rounded-2xl border p-6 sm:p-8 shadow-2xs transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] hover:border-black/30 ${
                  address.isDefault
                    ? "border-black/20 bg-white shadow-sm"
                    : "border-black/10 bg-white"
                }`}
              >
                <div>
                  {/* Top Header Card */}
                  <div className="flex items-center justify-between gap-3 border-b border-black/10 pb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-black text-white shadow-xs">
                        {getTypeIcon(address.type)}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold tracking-tight text-black">
                          {address.label}
                        </h3>
                        <p className="text-[11px] font-medium text-black/45">
                          {address.fullName}
                        </p>
                      </div>
                    </div>

                    {/* Default Tag Badge */}
                    {address.isDefault ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-black/15 bg-black px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-white shadow-2xs">
                        <CheckCircle2 size={11} strokeWidth={2} />
                        Default
                      </span>
                    ) : (
                      <button
                        type="button"
                        disabled={actionLoadingId === address.id}
                        onClick={() => handleSetDefault(address.id)}
                        className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-black hover:underline cursor-pointer disabled:opacity-50"
                      >
                        {actionLoadingId === address.id ? (
                          <>
                            <Loader2 size={12} className="animate-spin" />
                            <span>Saving...</span>
                          </>
                        ) : (
                          <span>Set as Default</span>
                        )}
                      </button>
                    )}
                  </div>

                  {/* Address Details */}
                  <div className="mt-4 space-y-1.5 text-xs font-medium text-black/70 leading-relaxed">
                    <p className="font-semibold text-black">
                      {address.addressLine}
                    </p>
                    <p>
                      {address.area}, {address.city} - {address.postalCode}
                    </p>
                    <p className="pt-2 text-[11px] text-black/45 font-mono">
                      Phone: {address.phone}
                    </p>
                  </div>
                </div>

                {/* Inline Confirmation Text / Card Actions */}
                <div className="mt-6 border-t border-black/5 pt-4">
                  {deletingId === address.id ? (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-red-50/60 p-3 rounded-xl border border-red-100">
                      <div className="flex items-center gap-2 text-red-600 text-xs font-semibold">
                        <AlertTriangle size={14} className="shrink-0" />
                        <span>Delete this address?</span>
                      </div>
                      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                        <button
                          type="button"
                          onClick={() => setDeletingId(null)}
                          className="rounded-lg px-3 py-1 text-xs font-semibold text-black/60 hover:text-black cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => confirmDelete(address.id)}
                          className="rounded-lg bg-red-600 px-3 py-1 text-xs font-semibold text-white hover:bg-red-700 cursor-pointer shadow-xs"
                        >
                          Yes, Delete
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => openForm(address)}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-black hover:underline cursor-pointer"
                        >
                          <Pencil size={13} />
                          <span>Edit</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeletingId(address.id)}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:underline cursor-pointer"
                        >
                          <Trash2 size={13} />
                          <span>Delete</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-black/30">
                        <MapPin size={12} />
                        <span>Verified</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty Address State matching Empty Bag Style */
          <div className="relative w-full overflow-hidden px-5 py-5 font-primary sm:px-8 lg:px-12">
            <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
              {/* Icon Container */}
              <div className="group relative mb-8 flex h-24 w-24 items-center justify-center rounded-full border border-black/10 bg-black/[0.02] transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] hover:scale-105 hover:border-black hover:bg-black sm:h-28 sm:w-28">
                <div className="absolute inset-0 -z-10 rounded-full bg-black/5 blur-xl transition-all duration-700 group-hover:bg-black/20" />

                <span className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full border border-black/10 bg-white text-black shadow-xs transition-all duration-500 ease-out group-hover:rotate-12 group-hover:scale-110">
                  <Sparkles size={13} strokeWidth={2} />
                </span>

                <MapPin
                  size={36}
                  strokeWidth={1.4}
                  className="text-black transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-110 group-hover:text-white sm:size-10"
                />
              </div>

              {/* Tag */}
              <div className="mb-3 flex items-center justify-center gap-2.5">
                <span className="h-px w-6 bg-black/20" />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/45">
                  No Saved Addresses
                </span>
                <span className="h-px w-6 bg-black/20" />
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold tracking-tight text-black sm:text-3xl md:text-4xl">
                Add an Address for Express Checkout.
              </h2>

              <p className="mt-4 max-w-md text-xs leading-relaxed text-black/50 sm:text-sm sm:leading-6">
                Save your primary delivery locations, office drop-offs, or home
                address to make ordering fast and seamless.
              </p>

              {!isFormOpen && (
                <button
                  type="button"
                  onClick={() => openForm()}
                  className="inline-flex mt-4 items-center gap-2 rounded-full border border-black/20 bg-white px-6 py-2.5 text-xs font-semibold text-black hover:bg-black hover:text-white transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] active:scale-95 cursor-pointer shadow-sm disabled:pointer-events-none disabled:opacity-75"
                >
                  <span>Add First Address</span>
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-black text-white text-xs transition-all duration-500 group-hover:bg-white group-hover:text-black">
                    +
                  </span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Addresses;