import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router';
import { Search, UserRound, ShoppingBag, Menu, X } from 'lucide-react';

// Custom React Hook to track page scroll
const useScroll = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return isScrolled;
};

const Navbar = () => {
  const isScrolled = useScroll();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const linkStyles = ({ isActive }) => `
    relative pt-1 pb-[1px] font-secondary text-sm font-medium transition-colors
    
    /* Text Color: Changes ONLY when Active */
    ${isActive ? 'text-primary font-semibold' : 'text-secondary'}

    /* Underline Base: Left-to-Right layout & animation */
    after:content-[''] after:absolute after:bottom-0 after:left-0
    after:h-[1.5px] after:bg-black 
    after:transition-all after:duration-[800ms] after:ease-in-out
    
    /* Underline behavior: Only shows on hover */
    after:w-0 hover:after:w-full
  `;

  return (
    <header className={`bg-white sticky top-0 z-50 px-primary-boundary-m md:px-primary-boundary-t lg:px-primary-boundary-xl transition-shadow duration-[1500ms] ${isScrolled ? 'shadow-2xl' : 'shadow-none'}`}>
      <div className={`${isScrolled ? 'py-2 lg:py-4' : 'py-10'} transition-all duration-[1500ms] ease-in-out flex justify-between items-center relative`}>
        
        {/* Left Side: Mobile Hamburger + Brand / Desktop Nav */}
        <div className="flex items-center gap-4 lg:gap-0">
          {/* Mobile / Tablet Hamburger Toggle */}
          <button
            aria-label="Open menu"
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden py-1  text-gray-800 cursor-pointer focus:outline-none transition-transform duration-300 active:scale-90"
          >
            <Menu size={24} />
          </button>

          {/* Left Navigation Links (Desktop Only) */}
          <nav className="hidden lg:flex items-center gap-10">
            <NavLink to="/home" className={linkStyles}>Home</NavLink>
            <NavLink to="/shop" className={linkStyles}>Shop</NavLink>
            <NavLink to="/men" className={linkStyles}>Men</NavLink>
            <NavLink to="/women" className={linkStyles}>Women</NavLink>
          </nav>
        </div>

        {/* Brand Name: Left-aligned on Mobile, Absolute Centered on Tablet & Desktop */}
        <div className="md:absolute md:left-1/2 md:-translate-x-1/2 font-primary text-2xl font-bold text-gray-900 tracking-tight">
          <Link to="/">BachelorShop</Link>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-5 md:gap-6  lg:gap-7">
          {/* Search Button */}
          <button 
            aria-label="Search" 
            className="group transform cursor-pointer transition-transform duration-[2000ms] ease-in-out hover:scale-120 active:scale-95"
          >
            <div className="transition-transform duration-[2000ms] ease-in-out group-hover:rotate-360">
              <Search size={20} strokeWidth={1.7} />
            </div>
          </button>

          {/* Account Button */}
          <button 
            aria-label="Account" 
            className="group transform cursor-pointer transition-transform duration-[500ms] ease-in-out hover:scale-120 active:scale-95"
          >
            <div className="transition-transform duration-[500ms] ease-in-out group-hover:-translate-y-0.5">
              <UserRound size={20} strokeWidth={1.7} />
            </div>
          </button>

          {/* Shopping Bag Button */}
          <button 
            aria-label="Shopping bag" 
            className="group relative transform cursor-pointer transition-transform duration-[500ms] ease-in-out hover:scale-120 active:scale-95"
          >
            <ShoppingBag size={20} strokeWidth={1.7} />
            <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[10px] text-white group-hover:animate-bounce">
              2
            </span>
          </button>
        </div>

      </div>

      {/* Mobile / Tablet Dropdown Drawer */}
      <div 
        className={`lg:hidden fixed top-0 left-0 h-full w-72 bg-white shadow-2xl z-50 transform transition-transform duration-1500 ease-[cubic-bezier(0.16,1,0.3,1)] p-6 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header with Centered Close (X) Button */}
        <div className="flex justify-between items-center pb-6 border-b border-gray-100">
          <span className="font-primary font-bold text-lg text-gray-900">Menu</span>
          
          {/* Close Button centered inside container */}
          <button
            aria-label="Close menu"
            onClick={() => setIsMobileMenuOpen(false)}
            className="w-10 h-10 flex items-center justify-center rounded-full text-gray-700 hover:bg-gray-100 transition-colors duration-300 focus:outline-none cursor-pointer"
          >
            <X size={22} />
          </button>
        </div>

        {/* Links with Staggered Fade & Slide Animation */}
        <nav className="flex flex-col gap-6 pt-6">
          <div className={`transition-all duration-1500 delay-100 ${isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <NavLink to="/home" className={linkStyles} onClick={() => setIsMobileMenuOpen(false)}>
              Home
            </NavLink>
          </div>

          <div className={`transition-all duration-1500 delay-150 ${isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <NavLink to="/shop" className={linkStyles} onClick={() => setIsMobileMenuOpen(false)}>
              Shop
            </NavLink>
          </div>

          <div className={`transition-all duration-1500 delay-200 ${isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <NavLink to="/men" className={linkStyles} onClick={() => setIsMobileMenuOpen(false)}>
              Men
            </NavLink>
          </div>

          <div className={`transition-all duration-1500 delay-250 ${isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <NavLink to="/women" className={linkStyles} onClick={() => setIsMobileMenuOpen(false)}>
              Women
            </NavLink>
          </div>
        </nav>
      </div>

      {/* Backdrop overlay with Fade Transition */}
      <div 
        onClick={() => setIsMobileMenuOpen(false)}
        className={`lg:hidden fixed inset-0 bg-black/40 z-40 transition-opacity duration-500 ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />
    </header>
  );
};

export default Navbar;