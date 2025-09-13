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
    <ul className="flex items-center gap-4">
      {user && (
        <li className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200">
            <HiOutlineUser className="text-lg text-gray-600" />
          </div>
          <span className="font-medium text-gray-700">{user.fullName}</span>
        </li>
      )}

      <li>
        <ButtonIcon onClick={() => navigate("/profile")}>
          <HiOutlineUser
            className={`text-2xl ${isProfileActive ? "text-blue-600" : "text-gray-700"}`}
          />
        </ButtonIcon>
      </li>
      <li>
        <ButtonIcon>
          <HiOutlineSun className="text-2xl text-gray-700" />
        </ButtonIcon>
      </li>

      <li>
        <ButtonIcon onClick={handleLogout}>
          <HiArrowRightOnRectangle className="text-2xl text-gray-700" />
        </ButtonIcon>
      </li>
    </ul>
  );
}

export default HeaderMenu;
