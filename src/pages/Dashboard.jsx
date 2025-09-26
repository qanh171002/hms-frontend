import { useState, useEffect } from "react";
import { getDashboardData } from "../apis/dashboardApi";
import {
  HiOutlineCalendar,
  HiOutlineCurrencyDollar,
  HiOutlineUser,
  HiOutlineLogout,
  HiOutlineTrendingUp,
  HiOutlineTrendingDown,
} from "react-icons/hi";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import toast from "react-hot-toast";
import Spinner from "../components/Spinner";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDays, setSelectedDays] = useState(7);

  const fetchDashboardData = async (days) => {
    try {
      setIsLoading(true);
      const data = await getDashboardData(days);
      setDashboardData(data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
      } else {
        toast.error("Failed to fetch dashboard data");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData(selectedDays);
  }, [selectedDays]);

  const handleDateFilterChange = (days) => {
    setSelectedDays(days);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  // Custom tooltip for pie charts
  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
          <p className="font-medium text-gray-900">
            {data.status}: {data.count}
          </p>
        </div>
      );
    }
    return null;
  };

  const bookingsPerDayData = dashboardData?.bookingsPerDayLast7Days
    ? Object.entries(dashboardData.bookingsPerDayLast7Days).map(
        ([date, count]) => ({
          date: formatDate(date),
          bookings: count,
        }),
      )
    : [];

  const bookingsPerStatusData = dashboardData?.bookingsPerStatus
    ? Object.entries(dashboardData.bookingsPerStatus).map(
        ([status, count]) => ({
          status,
          count,
        }),
      )
    : [];

  const invoicesPerStatusData = dashboardData?.invoicesPerStatus
    ? Object.entries(dashboardData.invoicesPerStatus).map(
        ([status, count]) => ({
          status,
          count,
        }),
      )
    : [];

  const dailyRevenueData = dashboardData?.dailyRevenueLast7Days
    ? Object.entries(dashboardData.dailyRevenueLast7Days).map(
        ([date, revenue]) => ({
          date: formatDate(date),
          revenue,
        }),
      )
    : [];

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="py-12 text-center">
        <p className="mb-4 text-gray-500">No dashboard data available</p>
        <button
          onClick={() => fetchDashboardData(selectedDays)}
          className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <div className="mb-6 flex flex-col justify-center lg:col-span-2">
          <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
          <p className="text-base text-gray-500">
            Overview of your hotel performance
          </p>
        </div>
        <div className="flex items-center justify-end lg:col-span-2">
          <div className="flex items-center gap-2 rounded-lg bg-gray-100 p-1">
            <button
              onClick={() => handleDateFilterChange(7)}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                selectedDays === 7
                  ? "bg-blue-500 text-white"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Last 7 days
            </button>
            <button
              onClick={() => handleDateFilterChange(30)}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                selectedDays === 30
                  ? "bg-blue-500 text-white"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Last 30 days
            </button>
            <button
              onClick={() => handleDateFilterChange(90)}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                selectedDays === 90
                  ? "bg-blue-500 text-white"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Last 90 days
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-200 hover:border-blue-200 hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Bookings
              </p>
              <p className="text-3xl font-bold text-gray-800">
                {dashboardData.totalBookings}
              </p>
              <p className="mt-1 text-xs text-gray-500">All time</p>
            </div>
            <div className="rounded-full bg-blue-100 p-4 transition-colors group-hover:bg-blue-200">
              <HiOutlineCalendar className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-200 hover:border-green-200 hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Checked In</p>
              <p className="text-3xl font-bold text-gray-800">
                {dashboardData.checkedInBookings}
              </p>
              <p className="mt-1 text-xs text-gray-500">All time</p>
            </div>
            <div className="rounded-full bg-green-100 p-4 transition-colors group-hover:bg-green-200">
              <HiOutlineUser className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-200 hover:border-purple-200 hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Upcoming Check-ins
              </p>
              <p className="text-3xl font-bold text-gray-800">
                {dashboardData.upcomingCheckInsToday}
              </p>
              <p className="mt-1 text-xs text-gray-500">Today</p>
            </div>
            <div className="rounded-full bg-purple-100 p-4 transition-colors group-hover:bg-purple-200">
              <HiOutlineTrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-200 hover:border-yellow-200 hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-800">
                {formatCurrency(dashboardData.totalRevenueGenerated)}
              </p>
              <p className="mt-1 text-xs text-gray-500">All time</p>
            </div>
            <div className="rounded-full bg-yellow-100 p-4 transition-colors group-hover:bg-yellow-200">
              <HiOutlineCurrencyDollar className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Bookings per Day Chart */}
        <div className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-200 hover:border-blue-200 hover:shadow-md">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">
              Bookings per Day ({selectedDays} days)
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="h-2 w-2 rounded-full bg-blue-500"></div>
              <span>Bookings</span>
            </div>
          </div>
          {bookingsPerDayData.length === 0 ? (
            <div className="flex h-[300px] flex-col items-center justify-center text-center">
              <div className="mb-4 rounded-full bg-blue-100 p-4">
                <HiOutlineCalendar className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="mb-2 text-lg font-medium text-gray-700">
                No booking data for this period
              </h4>
              <p className="text-sm text-gray-500">
                Create bookings to see daily trends
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={bookingsPerDayData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Bar dataKey="bookings" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Daily Revenue Chart */}
        <div className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-200 hover:border-green-200 hover:shadow-md">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">
              Daily Revenue ({selectedDays} days)
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span>Revenue</span>
            </div>
          </div>
          {dailyRevenueData.length === 0 ? (
            <div className="flex h-[300px] flex-col items-center justify-center text-center">
              <div className="mb-4 rounded-full bg-green-100 p-4">
                <HiOutlineCurrencyDollar className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="mb-2 text-lg font-medium text-gray-700">
                No revenue data for this period
              </h4>
              <p className="text-sm text-gray-500">
                Complete bookings to generate revenue
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyRevenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip
                  formatter={(value) => formatCurrency(value)}
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10B981"
                  strokeWidth={3}
                  dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: "#10B981", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Bookings by Status */}
        <div className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-200 hover:border-purple-200 hover:shadow-md">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">
              Bookings by Status
            </h3>
            <div className="text-sm text-gray-500">
              {bookingsPerStatusData.length} statuses
            </div>
          </div>
          {bookingsPerStatusData.length === 0 ? (
            <div className="flex h-[300px] flex-col items-center justify-center text-center">
              <div className="mb-4 rounded-full bg-purple-100 p-4">
                <HiOutlineCalendar className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="mb-2 text-lg font-medium text-gray-700">
                No booking data available
              </h4>
              <p className="text-sm text-gray-500">
                Create your first booking to see status distribution
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={bookingsPerStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={false}
                  outerRadius={100}
                  innerRadius={65}
                  fill="#8884d8"
                  dataKey="count"
                  paddingAngle={2}
                >
                  {bookingsPerStatusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
                <Legend
                  verticalAlign="middle"
                  align="right"
                  layout="vertical"
                  formatter={(value, entry) => (
                    <span style={{ color: "#374151", fontSize: "14px" }}>
                      {entry.payload.status}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Invoices by Status */}
        <div className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-200 hover:border-orange-200 hover:shadow-md">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">
              Invoices by Status
            </h3>
            <div className="text-sm text-gray-500">
              {invoicesPerStatusData.length} statuses
            </div>
          </div>
          {invoicesPerStatusData.length === 0 ? (
            <div className="flex h-[300px] flex-col items-center justify-center text-center">
              <div className="mb-4 rounded-full bg-orange-100 p-4">
                <HiOutlineCurrencyDollar className="h-8 w-8 text-orange-600" />
              </div>
              <h4 className="mb-2 text-lg font-medium text-gray-700">
                No invoice data available
              </h4>
              <p className="text-sm text-gray-500">
                Check out bookings to generate invoices and see status
                distribution
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={invoicesPerStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={false}
                  outerRadius={100}
                  innerRadius={65}
                  fill="#8884d8"
                  dataKey="count"
                  paddingAngle={2}
                >
                  {invoicesPerStatusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
                <Legend
                  verticalAlign="middle"
                  align="right"
                  layout="vertical"
                  formatter={(value, entry) => (
                    <span style={{ color: "#374151", fontSize: "14px" }}>
                      {entry.payload.status}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-200 hover:border-green-200 hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Active Bookings
              </p>
              <p className="text-3xl font-bold text-gray-800">
                {dashboardData.activeBookings}
              </p>
              <p className="mt-1 text-xs text-gray-500">Currently active</p>
            </div>
            <div className="rounded-full bg-green-100 p-4 transition-colors group-hover:bg-green-200">
              <HiOutlineUser className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-200 hover:border-teal-200 hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Check-outs Today
              </p>
              <p className="text-3xl font-bold text-gray-800">
                {dashboardData.checkedOutBookingsToday}
              </p>
              <p className="mt-1 text-xs text-gray-500">Today</p>
            </div>
            <div className="rounded-full bg-teal-100 p-4 transition-colors group-hover:bg-teal-200">
              <HiOutlineLogout className="h-6 w-6 text-teal-600" />
            </div>
          </div>
        </div>

        <div className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-200 hover:border-blue-200 hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Upcoming Check-outs
              </p>
              <p className="text-3xl font-bold text-gray-800">
                {dashboardData.upcomingCheckOutsToday}
              </p>
              <p className="mt-1 text-xs text-gray-500">Today</p>
            </div>
            <div className="rounded-full bg-blue-100 p-4 transition-colors group-hover:bg-blue-200">
              <HiOutlineLogout className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-200 hover:border-red-200 hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Outstanding Amount
              </p>
              <p className="text-3xl font-bold text-gray-800">
                {formatCurrency(dashboardData.totalOutstandingAmount)}
              </p>
              <p className="mt-1 text-xs text-gray-500">Pending payment</p>
            </div>
            <div className="rounded-full bg-red-100 p-4 transition-colors group-hover:bg-red-200">
              <HiOutlineTrendingDown className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
