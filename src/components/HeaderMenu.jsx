import {
  HiArrowRightOnRectangle,
  HiOutlineSun,
  HiOutlineUser,
} from "react-icons/hi2";
import ButtonIcon from "./ButtonIcon";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function HeaderMenu() {
  const navigate = useNavigate();
  const location = useLocation();
  const isProfileActive = location.pathname === "/profile";
  const { logoutUser, user } = useAuth();

  const handleLogout = () => {
    logoutUser();
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex items-center gap-3">
      {/* User Info */}
      {user && (
        <div className="hidden items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 md:flex">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
            <HiOutlineUser className="text-lg text-blue-500" />
          </div>
          <div className="text-sm">
            <p className="font-medium text-gray-800">{user.fullName}</p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <ButtonIcon
          onClick={() => navigate("/profile")}
          className={`rounded-xl p-3 transition-all duration-200 ${
            isProfileActive
              ? "bg-blue-100 text-blue-500 shadow-md"
              : "text-gray-600 hover:bg-gray-100 hover:text-blue-500"
          }`}
        >
          <HiOutlineUser className="text-xl" />
        </ButtonIcon>

        <ButtonIcon className="rounded-xl p-3 text-gray-600 transition-all duration-200 hover:bg-gray-100 hover:text-yellow-600">
          <HiOutlineSun className="text-xl" />
        </ButtonIcon>

        <ButtonIcon
          onClick={handleLogout}
          className="rounded-xl p-3 text-gray-600 transition-all duration-200 hover:bg-red-50 hover:text-red-600"
        >
          <HiArrowRightOnRectangle className="text-xl" />
        </ButtonIcon>
      </div>
    </div>
  );
}

export default HeaderMenu;
