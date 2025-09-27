import HeaderMenu from "./HeaderMenu";

function Header() {
  return (
    <header className="flex items-center justify-end border-b border-gray-200 bg-white/80 px-8 py-4 shadow-sm backdrop-blur-sm">
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
