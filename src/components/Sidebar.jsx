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

function Sidebar() {
  return (
    <aside className="relative z-10 flex h-full w-72 flex-col border-r border-gray-200 bg-gradient-to-b from-white to-gray-50 shadow-lg">
      {/* Logo Section */}
      <div className="flex items-center justify-center gap-3 px-6 pt-8 pb-6">
        <div className="rounded-full bg-blue-100 p-3 shadow-sm">
          <img src="/logo.svg" alt="Hotelio logo" className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Hotelio</h1>
          <p className="text-xs text-gray-500">Hotel Management</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col space-y-2 px-4 py-4">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `group flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
              isActive
                ? "scale-[1.02] transform bg-blue-500 text-white shadow-lg shadow-blue-200"
                : "text-gray-600 hover:bg-blue-50 hover:text-blue-500 hover:shadow-md"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <HiOutlineHome
                className={`mr-3 text-xl transition-colors ${
                  isActive
                    ? "text-white"
                    : "text-gray-500 group-hover:text-blue-500"
                }`}
              />
              Dashboard
            </>
          )}
        </NavLink>
        <NavLink
          to="/users"
          className={({ isActive }) =>
            `group flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
              isActive
                ? "scale-[1.02] transform bg-blue-500 text-white shadow-lg shadow-blue-200"
                : "text-gray-600 hover:bg-blue-50 hover:text-blue-500 hover:shadow-md"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <HiOutlineUsers
                className={`mr-3 text-xl transition-colors ${
                  isActive
                    ? "text-white"
                    : "text-gray-500 group-hover:text-blue-500"
                }`}
              />
              Users
            </>
          )}
        </NavLink>
        <NavLink
          to="/bookings"
          className={({ isActive }) =>
            `group flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
              isActive
                ? "scale-[1.02] transform bg-blue-500 text-white shadow-lg shadow-blue-200"
                : "text-gray-600 hover:bg-blue-50 hover:text-blue-500 hover:shadow-md"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <HiOutlineCalendarDays
                className={`mr-3 text-xl transition-colors ${
                  isActive
                    ? "text-white"
                    : "text-gray-500 group-hover:text-blue-500"
                }`}
              />
              Bookings
            </>
          )}
        </NavLink>
        <NavLink
          to="/rooms"
          className={({ isActive }) =>
            `group flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
              isActive
                ? "scale-[1.02] transform bg-blue-500 text-white shadow-lg shadow-blue-200"
                : "text-gray-600 hover:bg-blue-50 hover:text-blue-500 hover:shadow-md"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <HiOutlineHomeModern
                className={`mr-3 text-xl transition-colors ${
                  isActive
                    ? "text-white"
                    : "text-gray-500 group-hover:text-blue-500"
                }`}
              />
              Rooms
            </>
          )}
        </NavLink>
        <NavLink
          to="/invoices"
          className={({ isActive }) =>
            `group flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
              isActive
                ? "scale-[1.02] transform bg-blue-500 text-white shadow-lg shadow-blue-200"
                : "text-gray-600 hover:bg-blue-50 hover:text-blue-500 hover:shadow-md"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <HiOutlineCash
                className={`mr-3 text-xl transition-colors ${
                  isActive
                    ? "text-white"
                    : "text-gray-500 group-hover:text-blue-500"
                }`}
              />
              Invoices
            </>
          )}
        </NavLink>
        <NavLink
          to="/assets"
          className={({ isActive }) =>
            `group flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
              isActive
                ? "scale-[1.02] transform bg-blue-500 text-white shadow-lg shadow-blue-200"
                : "text-gray-600 hover:bg-blue-50 hover:text-blue-500 hover:shadow-md"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <HiOutlineInboxStack
                className={`mr-3 text-xl transition-colors ${
                  isActive
                    ? "text-white"
                    : "text-gray-500 group-hover:text-blue-500"
                }`}
              />
              Assets
            </>
          )}
        </NavLink>
        <NavLink
          to="/promotions"
          className={({ isActive }) =>
            `group flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
              isActive
                ? "scale-[1.02] transform bg-blue-500 text-white shadow-lg shadow-blue-200"
                : "text-gray-600 hover:bg-blue-50 hover:text-blue-500 hover:shadow-md"
            }`
          }
        >
          <HiOutlineInboxStack className="mr-3 text-2xl" />
          Promotions
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `group flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
              isActive
                ? "scale-[1.02] transform bg-blue-500 text-white shadow-lg shadow-blue-200"
                : "text-gray-600 hover:bg-blue-50 hover:text-blue-500 hover:shadow-md"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <HiOutlineCog6Tooth
                className={`mr-3 text-xl transition-colors ${
                  isActive
                    ? "text-white"
                    : "text-gray-500 group-hover:text-blue-500"
                }`}
              />
              Settings
            </>
          )}
        </NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;
