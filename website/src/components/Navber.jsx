import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router';
import { Search, UserRound, ShoppingBag } from 'lucide-react';

// Custom React Hook to track page scroll
const useScroll = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return isScrolled;
};

const Navbar = () => {
  const isScrolled = useScroll();

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
    <header className={`bg-white sticky top-0 z-50 px-10 transition-shadow duration-[1500ms] ${isScrolled ? 'shadow-2xl border border-2. border-gray-100' : 'shadow-none'}`}>
      <div className={`${isScrolled ? 'py-3.5' : 'py-10'} transition-all duration-[1500ms] ease-in-out flex justify-between items-center relative`}>
        
        {/* Left Navigation Links */}
        <nav className="flex items-center gap-10">
          <NavLink to="/home" className={linkStyles}>Home</NavLink>
          <NavLink to="/shop" className={linkStyles}>Shop</NavLink>
          <NavLink to="/men" className={linkStyles}>Men</NavLink>
          <NavLink to="/women" className={linkStyles}>Women</NavLink>
        </nav>

        {/* Center Brand Name (Exact X-Axis Center) */}
        <div className="absolute left-1/2 -translate-x-1/2 font-primary text-2xl font-bold text-gray-900 tracking-tight">
          <Link to="/">BachelorShop</Link>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-5">
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
    </header>
  );
};

export default Navbar;