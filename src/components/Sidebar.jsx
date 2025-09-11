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
    <aside className="flex relative z-10 flex-col w-64 h-full bg-white">
      <div className="flex items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-blue-500">Hotelio</h1>
      </div>
      <nav className="flex flex-col p-4">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `my-2 flex items-center rounded-lg px-4 py-3 text-base font-medium transition duration-100 ease-in-out ${
              isActive
                ? "bg-blue-500 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`
          }
        >
          <HiOutlineHome className="mr-3 text-2xl" />
          Dashboard
        </NavLink>
        <NavLink
          to="/users"
          className={({ isActive }) =>
            `my-2 flex items-center rounded-lg px-4 py-3 text-base font-medium transition duration-100 ease-in-out ${
              isActive
                ? "bg-blue-500 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`
          }
        >
          <HiOutlineUsers className="mr-3 text-2xl" />
          Users
        </NavLink>
        <NavLink
          to="/bookings"
          className={({ isActive }) =>
            `my-2 flex items-center rounded-lg px-4 py-3 text-base font-medium transition duration-100 ease-in-out ${
              isActive
                ? "bg-blue-500 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`
          }
        >
          <HiOutlineCalendarDays className="mr-3 text-2xl" />
          Bookings
        </NavLink>
        <NavLink
          to="/rooms"
          className={({ isActive }) =>
            `my-2 flex items-center rounded-lg px-4 py-3 text-base font-medium transition duration-100 ease-in-out ${
              isActive
                ? "bg-blue-500 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`
          }
        >
          <HiOutlineHomeModern className="mr-3 text-2xl" />
          Rooms
        </NavLink>
        <NavLink
          to="/invoices"
          className={({ isActive }) =>
            `my-2 flex items-center rounded-lg px-4 py-3 text-base font-medium transition duration-100 ease-in-out ${
              isActive
                ? "bg-blue-500 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`
          }
        >
          <HiOutlineCash className="mr-3 text-2xl" />
          Invoices
        </NavLink>
        <NavLink
          to="/assets"
          className={({ isActive }) =>
            `my-2 flex items-center rounded-lg px-4 py-3 text-base font-medium transition duration-100 ease-in-out ${
              isActive
                ? "bg-blue-500 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`
          }
        >
          <HiOutlineInboxStack className="mr-3 text-2xl" />
          Assets
        </NavLink>
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `my-2 flex items-center rounded-lg px-4 py-3 text-base font-medium transition duration-100 ease-in-out ${
              isActive
                ? "bg-blue-500 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`
          }
        >
          <HiOutlineCog6Tooth className="mr-3 text-2xl" />
          Settings
        </NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;
