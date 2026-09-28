import { Outlet, Link } from "react-router";

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      {/* Header / Navbar */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="font-primary text-2xl font-bold text-gray-800">
            Main Layout Header
          </h1>
          
          <nav className="flex gap-6 font-secondary text-sm font-medium text-gray-600">
            <Link to="/home" className="hover:text-blue-600 transition-colors">Home</Link>
            <Link to="/shop" className="hover:text-blue-600 transition-colors">Shop</Link>
            <Link to="/cart" className="hover:text-blue-600 transition-colors">Cart</Link>
            <Link to="/profile" className="hover:text-blue-600 transition-colors">Profile</Link>
          </nav>
        </div>
      </header>

      {/* Main Content (Child routes render here) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8 px-6 mt-auto">
        <div className="max-w-7xl mx-auto space-y-2 text-center sm:text-left">
          <p className="font-sans text-sm text-gray-400">
            Main Layout Footer (Default Sans Font)
          </p>
          <p className="font-primary text-base font-semibold text-white">
            Main Layout footer (Spartan / Primary Font)
          </p>
          <p className="font-secondary text-sm text-gray-300">
            Main Layout footer (Poppins / Secondary Font)
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;