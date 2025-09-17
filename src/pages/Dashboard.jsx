import {
  HiOutlineCalendar,
  HiOutlineCurrencyDollar,
  HiOutlineUser,
} from "react-icons/hi2";
import Stat from "../components/Stat";

import { HiOutlineLogout } from "react-icons/hi";
import DurationChart from "../components/DurationChart";
import { useAuth } from "../contexts/AuthContext";

function Dashboard() {
  const { user } = useAuth();
  return (
    <div className="grid grid-cols-4 gap-6">
      <div className="col-span-2 mb-6 flex flex-col justify-center">
        <h2 className="text-2xl font-bold text-gray-800">
          Welcome back, {user.fullName}!
        </h2>
        <p className="text-md text-gray-500">
          Here’s a quick overview of your dashboard.
        </p>
      </div>

      <div className="col-span-2 mb-6 flex items-center justify-end gap-4">
        <div>Filter by date</div>
      </div>

      {/* Stats Section */}
      <Stat
        title="Bookings"
        value="840"
        icon={<HiOutlineCalendar className="text-2xl text-blue-500" />}
        color="bg-blue-100"
        percentage={10}
        isGradient={true}
      />
      <Stat
        title="Check-ins"
        value="231"
        icon={<HiOutlineUser className="text-2xl text-yellow-500" />}
        color="bg-yellow-100"
        percentage={12}
      />
      <Stat
        title="Check-outs"
        value="124"
        icon={<HiOutlineLogout className="text-2xl text-teal-500" />}
        color="bg-teal-100"
        percentage={4}
      />

      <Stat
        title="Total Revenue"
        value="$5,000"
        icon={<HiOutlineCurrencyDollar className="text-2xl text-red-500" />}
        color="bg-red-100"
        percentage={10}
      />

      {/* Chart section */}
      <DurationChart />
    </div>
  );
}

export default Dashboard;
