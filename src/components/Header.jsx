import { HiMagnifyingGlass } from "react-icons/hi2";
import HeaderMenu from "./HeaderMenu";

function Header() {
  return (
    <header className="flex items-center justify-between border-b border-gray-200 bg-white/80 px-8 py-4 shadow-sm backdrop-blur-sm">
      {/* Search Section */}
      <div className="flex w-full max-w-md items-center gap-3">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <HiMagnifyingGlass className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search hotels, bookings, users..."
            className="w-full rounded-xl border border-gray-300 bg-gray-50 py-3 pr-4 pl-10 text-sm transition-all duration-200 focus:border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* User Menu */}
      <div className="flex items-center gap-4">
        <div className="hidden items-center gap-2 text-sm text-gray-600 md:flex">
          <div className="h-2 w-2 rounded-full bg-green-400"></div>
          <span>System Online</span>
        </div>
        <HeaderMenu />
      </div>
    </header>
  );
}

export default Header;
