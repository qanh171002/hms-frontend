import { HiOutlineCash } from "react-icons/hi";
import {
  HiOutlineCalendarDays,
  HiOutlineCog6Tooth,
  HiOutlineHome,
  HiOutlineHomeModern,
  HiOutlineInboxStack,
  HiOutlineUsers,
} from "react-icons/hi2";
import { NavLink } from "react-router-dom";
import { Fragment } from "react";
import { useAuth } from "../hooks/useAuth";

function Sidebar({ isOpen = false, setIsOpen = () => {} }) {
  const { hasAnyRole } = useAuth();

  // Define menu items with their required roles
  const menuItems = [
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: HiOutlineHome,
      roles: ["ADMIN", "MANAGER", "ACCOUNTANT"],
    },
    {
      path: "/rooms",
      label: "Rooms",
      icon: HiOutlineHomeModern,
      roles: ["ADMIN", "MANAGER", "RECEPTIONIST"],
    },
    {
      path: "/bookings",
      label: "Bookings",
      icon: HiOutlineCalendarDays,
      roles: ["ADMIN", "RECEPTIONIST"],
    },
    {
      path: "/users",
      label: "Users",
      icon: HiOutlineUsers,
      roles: ["ADMIN", "MANAGER"],
    },
    {
      path: "/assets",
      label: "Assets",
      icon: HiOutlineInboxStack,
      roles: ["ADMIN", "MANAGER"],
    },
    {
      path: "/invoices",
      label: "Invoices",
      icon: HiOutlineCash,
      roles: ["ADMIN", "ACCOUNTANT"],
    },
    {
      path: "/promotions",
      label: "Promotions",
      icon: HiOutlineCalendarDays,
      roles: ["ADMIN", "MANAGER"],
    },
    {
      path: "/settings",
      label: "Settings",
      icon: HiOutlineCog6Tooth,
      roles: ["ADMIN", "MANAGER", "RECEPTIONIST", "ACCOUNTANT"],
    },
  ];

  // Filter menu items based on user role
  const visibleMenuItems = menuItems.filter((item) => hasAnyRole(item.roles));

  return (
    <>
      {/* Backdrop on mobile */}
      <div
        className={`fixed inset-0 z-30 bg-black/30 transition-opacity md:hidden ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setIsOpen(false)}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex h-full w-64 flex-col border-r border-gray-200 bg-gradient-to-b from-white to-gray-50 shadow-xl transition-transform duration-200 md:relative md:z-10 md:w-48 md:shadow-lg lg:w-64 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-center gap-3 px-4 pt-6 pb-4 md:px-6 md:pt-8 md:pb-6">
          <div className="rounded-full bg-blue-100 p-3 shadow-sm">
            <img src="/logo.svg" alt="Hotelio logo" className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Hotelio</h1>
            <p className="text-xs text-gray-500">Hotel Management</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col space-y-2 px-3 py-3 md:px-4 md:py-4">
          {visibleMenuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `group flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "scale-[1.02] transform bg-blue-500 text-white shadow-lg shadow-blue-200"
                      : "text-gray-600 hover:bg-blue-50 hover:text-blue-500 hover:shadow-md"
                  }`
                }
                onClick={() => setIsOpen(false)}
              >
                {({ isActive }) => (
                  <>
                    <IconComponent
                      className={`mr-3 text-xl transition-colors ${
                        isActive
                          ? "text-white"
                          : "text-gray-500 group-hover:text-blue-500"
                      }`}
                    />
                    {item.label}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;
