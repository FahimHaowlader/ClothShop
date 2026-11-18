
import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Truck,
  BookOpen,
  Users,
  ChartNoAxesCombined,
  Settings,
  Search,
  Plus,
  Bell,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  LogOut,
  UserRound,
  TicketPercent,
  BadgePercent,
  RotateCcw,
  PackageX,
  ClipboardList,
} from "lucide-react";

const navigation = [
  { name: "Overview", path: "/dashboard", icon: LayoutDashboard },
  { name: "Inventory", path: "/inventory", icon: Package },
  { name: "Orders", path: "/order", icon: Truck },
  { name: "My Order", path: "/my-order", icon: ClipboardList },
  { name: "Collections", path: "/collections", icon: BookOpen },
  { name: "Customers", path: "/customers", icon: Users },
  { name: "Staff", path: "/staff", icon: UserRound },
  { name: "Coupons", path: "/coupons", icon: TicketPercent },
  { name: "Discounts", path: "/discounts", icon: BadgePercent },
  { name: "Refunds", path: "/refunds", icon: RotateCcw },
  { name: "Damage Log", path: "/damage-log", icon: PackageX },
  { name: "Analytics", path: "/analytics", icon: ChartNoAxesCombined },
  { name: "Settings", path: "/settings", icon: Settings },
];

const MainLayout = ({ onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Custom Scrollbar */}
      <style>
        {`
          * {
            scrollbar-width: thin;
            scrollbar-color: #d4d4d4 transparent;
          }

          *::-webkit-scrollbar {
            width: 6px;
            height: 6px;
          }

          *::-webkit-scrollbar-track {
            background: transparent;
          }

          *::-webkit-scrollbar-thumb {
            background: #d4d4d4;
            border-radius: 20px;
            border: 1px solid transparent;
            background-clip: padding-box;
            transition: background 0.2s ease;
          }

          *::-webkit-scrollbar-thumb:hover {
            background: #999;
            background-clip: padding-box;
          }

          *::-webkit-scrollbar-corner {
            background: transparent;
          }

          .sidebar-scroll {
            scrollbar-gutter: stable;
          }
        `}
      </style>

      {/* Mobile / Tablet Overlay */}
      <div
        onClick={() => setSidebarOpen(false)}
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]
          transition-[opacity,visibility] duration-500
          ease-[cubic-bezier(0.22,1,0.36,1)] lg:hidden ${
            sidebarOpen
              ? "visible opacity-100"
              : "invisible opacity-0"
          }`}
      />

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col
          overflow-hidden border-r border-black/[0.07] bg-white
          transform-gpu
          transition-transform duration-500
          ease-[cubic-bezier(0.22,1,0.36,1)]
          lg:translate-x-0
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
          ${
            sidebarCollapsed
              ? "w-52 md:w-60 lg:w-[76px]"
              : "w-52 md:w-60 lg:w-48"
          }`}
      >
        {/* Entire Sidebar Content */}
        <div className="flex h-full min-h-0 flex-col">

          {/* Logo */}
          <div
            className={`flex h-16 shrink-0 items-center border-b
              border-black/[0.06] transition-all duration-300
              ease-[cubic-bezier(0.22,1,0.36,1)] ${
                sidebarCollapsed
                  ? "justify-between px-5 lg:px-0 lg:pl-3 lg:pr-1"
                  : "justify-between px-5 lg:pl-3 lg:pr-1"
              }`}
          >
            <NavLink
              to="/dashboard"
              onClick={() => setSidebarOpen(false)}
              className={`flex min-w-0 items-center gap-2
                transition-all duration-300
                ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  sidebarCollapsed
                    ? "lg:flex-1 lg:justify-center"
                    : ""
                }`}
            >
              <span className="shrink-0 text-xl font-bold tracking-[-0.08em]">
                <span className="lg:hidden">ATELIER</span>
                <span className="hidden lg:inline">
                  {sidebarCollapsed ? "A" : "ATELIER"}
                </span>
              </span>

              {!sidebarCollapsed && (
                <span className="rounded-sm border border-black px-1.5 py-0.5 text-[8px] font-bold tracking-widest">
                  PRO
                </span>
              )}
            </NavLink>

            {/* Desktop Collapse */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden shrink-0 rounded-lg p-2 text-[#555]
                transition-all duration-200 ease-out
                hover:bg-[#f3f3f3] hover:text-black
                active:bg-black active:text-white lg:block"
              title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {sidebarCollapsed ? (
                <ChevronRight size={17} strokeWidth={1.8} />
              ) : (
                <ChevronLeft size={17} strokeWidth={1.8} />
              )}
            </button>

            {/* Mobile / Tablet Close */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="rounded-lg p-2 text-[#555]
                transition-all duration-200 ease-out
                hover:bg-[#f3f3f3] hover:text-black
                active:bg-black active:text-white lg:hidden"
              aria-label="Close sidebar"
            >
              <X size={19} strokeWidth={1.8} />
            </button>
          </div>

          {/* Navigation */}
          <nav
            className={`sidebar-scroll flex-1 space-y-1
              overflow-x-hidden overflow-y-auto px-3 ${
                sidebarCollapsed ? "pt-2" : "pt-6"
              }`}
          >
            <p
              className={`${
                sidebarCollapsed ? "mb-0" : "mb-3"
              } overflow-hidden whitespace-nowrap px-3
                text-[9px] font-semibold uppercase tracking-[0.18em]
                text-gray-400 transition-all duration-300 ${
                  sidebarCollapsed
                    ? "h-4 opacity-100 lg:h-0 lg:opacity-0"
                    : "h-4 opacity-100"
                }`}
            >
              Workspace
            </p>

            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  title={sidebarCollapsed ? item.name : undefined}
                  className={({ isActive }) =>
                    `group relative flex h-10 items-center rounded-lg
                      text-[12px] transition-all duration-300
                      ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        sidebarCollapsed
                          ? "justify-center px-0 lg:px-0"
                          : "gap-3 px-3"
                      } ${
                        isActive
                          ? sidebarCollapsed
                            ? "bg-black font-medium text-white shadow-sm lg:bg-transparent lg:text-[#555] lg:shadow-none"
                            : "bg-black font-medium text-white shadow-sm"
                          : "text-[#555] hover:bg-[#f3f3f3] hover:text-black"
                      }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {/* Navigation Icon */}
                      <span
                        className={`relative z-10 flex shrink-0
                          items-center justify-center rounded-md
                          transition-all duration-300 ${
                            sidebarCollapsed
                              ? "h-8 w-8 lg:h-9 lg:w-9"
                              : "h-7 w-7"
                          } ${
                            sidebarCollapsed
                              ? isActive
                                ? "lg:bg-black lg:text-white"
                                : "lg:bg-transparent lg:text-[#555] group-hover:lg:bg-[#f3f3f3] group-hover:lg:text-[#333]"
                              : ""
                          }`}
                      >
                        <Icon size={17} strokeWidth={1.7} />
                      </span>

                      {/* Navigation Label */}
                      <span
                        className={`overflow-hidden whitespace-nowrap
                          transition-all duration-300 ${
                            sidebarCollapsed
                              ? "flex-1 opacity-100 lg:w-0 lg:flex-none lg:-translate-x-2 lg:opacity-0"
                              : "flex-1 opacity-100"
                          }`}
                      >
                        {item.name}
                      </span>

                      {/* Active Indicator */}
                      {isActive && !sidebarCollapsed && (
                        <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-white/80" />
                      )}

                      {/* Tooltip */}
                      {sidebarCollapsed && (
                        <span
                          className="pointer-events-none absolute left-full
                            top-1/2 z-[60] ml-3 hidden -translate-y-1/2
                            translate-x-1 whitespace-nowrap rounded-md
                            bg-black px-3 py-2 text-[11px] font-medium
                            text-white opacity-0 shadow-xl
                            transition-all duration-200 ease-out
                            group-hover:translate-x-0 group-hover:opacity-100
                            lg:block"
                        >
                          {item.name}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="m-3 mt-auto shrink-0 border-t border-black/[0.06] pt-3">
            <button
              onClick={onLogout}
              title={sidebarCollapsed ? "Logout" : undefined}
              className={`group relative flex h-10 w-full items-center
                rounded-lg text-[12px] font-medium text-[#555]
                transition-all duration-300
                ease-[cubic-bezier(0.22,1,0.36,1)]
                hover:bg-[#f3f3f3] hover:text-black
                active:bg-black active:text-white ${
                  sidebarCollapsed
                    ? "justify-center px-0"
                    : "gap-3 px-3"
                }`}
            >
              <span
                className={`flex shrink-0 items-center justify-center
                  rounded-md transition-all duration-300 ${
                    sidebarCollapsed
                      ? "h-8 w-8 lg:h-9 lg:w-9"
                      : "h-7 w-7"
                  }`}
              >
                <LogOut
                  size={17}
                  strokeWidth={1.8}
                  className="transition-transform duration-300 ease-out group-hover:translate-x-0.5"
                />
              </span>

              <span
                className={`overflow-hidden whitespace-nowrap
                  transition-all duration-300 ${
                    sidebarCollapsed
                      ? "flex-1 opacity-100 lg:w-0 lg:flex-none lg:opacity-0"
                      : "flex-1 opacity-100"
                  }`}
              >
                Logout
              </span>

              {/* Tooltip */}
              {sidebarCollapsed && (
                <span
                  className="pointer-events-none absolute left-full
                    top-1/2 z-[60] ml-3 hidden -translate-y-1/2
                    translate-x-1 whitespace-nowrap rounded-md
                    bg-black px-3 py-2 text-[11px] font-medium
                    text-white opacity-0 shadow-xl
                    transition-all duration-200 ease-out
                    group-hover:translate-x-0 group-hover:opacity-100
                    lg:block"
                >
                  Logout
                </span>
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Section */}
      <div
        className={`min-h-screen w-full
          transition-[margin,width] duration-500
          ease-[cubic-bezier(0.22,1,0.36,1)] ${
            sidebarCollapsed
              ? "lg:ml-[76px] lg:w-[calc(100%-76px)]"
              : "lg:ml-44 lg:w-[calc(100%-176px)]"
          }`}
      >
        {/* Top Navbar */}
        <header
          className="sticky top-0 z-30 flex h-16 items-center
            justify-between gap-4 border-b border-black/[0.07]
            bg-white/90 px-4 backdrop-blur-xl sm:px-6 lg:px-8"
        >
          {/* Mobile Menu */}
          <div className="flex shrink-0 items-center gap-3 lg:hidden">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-md p-2 transition-all duration-200
                ease-out hover:bg-[#f3f3f3] hover:text-black
                active:bg-black active:text-white"
              aria-label="Open sidebar"
            >
              <Menu size={20} />
            </button>

            <span className="text-sm font-bold tracking-[-0.05em]">
              ATELIER
            </span>
          </div>

          {/* Online Status */}
          <div
            className="hidden shrink-0 items-center gap-2
              rounded-full border border-black/[0.08]
              px-3 py-1.5 md:flex"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-black" />
            <span className="text-[9px] font-semibold uppercase tracking-wider text-gray-600">
              Storefront Online
            </span>
          </div>

          {/* Search */}
          <div
            className="mx-auto hidden max-w-xl flex-1 items-center gap-2
              rounded-lg border border-transparent bg-[#f6f6f6]
              px-3 py-2 transition-all duration-300 ease-out
              focus-within:border-black/20 focus-within:bg-white"
          >
            <Search size={16} className="shrink-0 text-gray-400" />

            <input
              type="search"
              placeholder="Search SKU, garment, client, or order..."
              className="w-full bg-transparent text-xs outline-none placeholder:text-gray-400"
            />

            <span className="hidden shrink-0 rounded border border-black/10 px-1.5 py-0.5 text-[9px] text-gray-400 lg:block">
              /
            </span>
          </div>

          {/* Actions */}
          <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
            {/* New Product */}
            <button
              className="flex items-center gap-2 rounded-md
                bg-black px-3 py-2 text-white
                transition-all duration-200 ease-out
                hover:bg-[#333] active:scale-95"
            >
              <Plus size={15} />
              <span className="hidden text-[10px] font-medium sm:inline">
                New Product
              </span>
            </button>

            {/* Notifications */}
            <button
              className="relative rounded-lg p-2 text-gray-600
                transition-all duration-200 ease-out
                hover:bg-[#f3f3f3] hover:text-black
                active:bg-black active:text-white"
              aria-label="Notifications"
            >
              <Bell size={18} />
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full border border-white bg-black" />
            </button>

            {/* Profile */}
            <button
              className="flex items-center gap-2 rounded-lg p-1
                transition-colors duration-200 ease-out
                hover:bg-gray-100"
            >
              <div
                className="flex h-9 w-9 items-center justify-center
                  rounded-full border border-black/10 bg-[#f2f2f2]
                  text-[11px] font-semibold"
              >
                CV
              </div>

              <div className="hidden text-left xl:block">
                <p className="text-[11px] font-semibold">
                  Claire Vance
                </p>
                <p className="text-[10px] text-gray-400">
                  Studio Director
                </p>
              </div>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="min-h-[calc(100vh-64px)] bg-[#fafafa] p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
