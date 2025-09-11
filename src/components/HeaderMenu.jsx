import {
  HiArrowRightOnRectangle,
  HiOutlineBell,
  HiOutlineSun,
  HiOutlineUser,
} from "react-icons/hi2";
import ButtonIcon from "./ButtonIcon";
import { useNavigate } from "react-router-dom";

function HeaderMenu() {
  const navigate = useNavigate();
  return (
    <ul className="flex gap-1">
      <li>
        <ButtonIcon>
          <HiOutlineBell className="text-2xl text-gray-700" />
        </ButtonIcon>
      </li>
      <li>
        <ButtonIcon>
          <HiOutlineUser className="text-2xl text-gray-700" />
        </ButtonIcon>
      </li>
      <li>
        <ButtonIcon>
          <HiOutlineSun className="text-2xl text-gray-700" />
        </ButtonIcon>
      </li>
      <li>
        <ButtonIcon
          onClick={() => {
            navigate("/login", { replace: true });
          }}
        >
          <HiArrowRightOnRectangle className="text-2xl text-gray-700" />
        </ButtonIcon>
      </li>
    </ul>
  );
}

export default HeaderMenu;
