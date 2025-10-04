import HeaderMenu from "./HeaderMenu";
import NotificationBell from "./NotificationBell";
import { HiBars3 } from "react-icons/hi2";
import { useAuth } from "../hooks/useAuth";

function Header({ onToggleSidebar }) {
  const { hasRole } = useAuth();

  const showNotifications = !hasRole("ACCOUNTANT");

  return (
    <header className="relative z-50 flex items-center justify-between border-b border-gray-200 bg-white/80 px-4 py-3 shadow-sm backdrop-blur-sm md:px-8 md:py-4">
      {/* Mobile hamburger */}
      <button
        className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 md:hidden"
        onClick={onToggleSidebar}
        aria-label="Open menu"
      >
        <HiBars3 className="h-6 w-6" />
      </button>

      <div className="hidden items-center gap-2 text-sm text-gray-600 md:flex">
        <div className="h-2 w-2 rounded-full bg-green-400"></div>
        <span>System Online</span>
      </div>

      {/* User Menu */}
      <div className="ml-auto flex items-center gap-4">
        {showNotifications && <NotificationBell />}
        <HeaderMenu />
      </div>
    </header>
  );
}

export default Header;
