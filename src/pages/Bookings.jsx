import { HiDotsVertical, HiEye, HiTrash } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import Button from "../components/Button";
import Modal from "../components/Modal";
import ConfirmModal from "../components/ConfirmModal";
import {
  createBooking,
  deleteBooking,
  getBookings,
  filterBookings,
} from "../apis/bookingsApi";
import toast from "react-hot-toast";
import Spinner from "../components/Spinner";
import AddBookingForm from "../components/AddBookingForm";
import {
  FaFilter,
  FaSearch,
  FaUser,
  FaIdCard,
  FaGlobe,
  FaBed,
  FaCalendarAlt,
  FaUsers,
} from "react-icons/fa";
import { FaX } from "react-icons/fa6";
import { usePaginationState } from "../hooks/usePaginationState";

const statusStyles = {
  "CHECKED IN": "bg-green-100 text-green-700",
  "CHECKED OUT": "bg-gray-200 text-gray-700",
  UNCONFIRMED: "bg-blue-100 text-blue-700",
  CANCELLED: "bg-red-100 text-red-700",
};

const bookingTypes = ["Hourly", "Daily"];
const statusOptions = ["Checked in", "Checked out", "Unconfirmed", "Cancelled"];

function Bookings() {
  const navigate = useNavigate();
  const { currentPage, setCurrentPage, resetToFirstPage } = usePaginationState(
    "page",
    1,
  );
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const pageBookings = bookings;
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const [filters, setFilters] = useState({
    guestFullName: "",
    guestIdNumber: "",
    guestNationality: "",
    roomNumber: "",
    checkInDateFrom: "",
    checkInDateTo: "",
    checkOutDateFrom: "",
    checkOutDateTo: "",
    bookingType: "",
    status: "",
    numberOfGuestsMin: "",
    numberOfGuestsMax: "",
  });
  const [filterTimeout, setFilterTimeout] = useState(null);

  useEffect(() => {
    const fetchInitialBookings = async () => {
      try {
        setIsLoading(true);
        const data = await getBookings(currentPage - 1, pageSize);
        setBookings(data.content || []);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        toast.error("Failed to load bookings");
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialBookings();
  }, [currentPage, pageSize]);

  const applyFilters = useCallback(async () => {
    try {
      setIsFiltering(true);
      const hasActiveFilters = Object.values(filters).some(
        (value) => value !== "",
      );

      let data;
      if (hasActiveFilters) {
        data = await filterBookings(filters, currentPage - 1, pageSize);
      } else {
        data = await getBookings(currentPage - 1, pageSize);
      }

      setBookings(data.content || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("Error filtering bookings:", err);
      toast.error("Failed to filter bookings");
    } finally {
      setIsFiltering(false);
    }
  }, [filters, currentPage, pageSize]);

  useEffect(() => {
    if (filterTimeout) {
      clearTimeout(filterTimeout);
    }

    const newTimeout = setTimeout(() => {
      applyFilters();
    }, 500);

    setFilterTimeout(newTimeout);

    return () => {
      if (newTimeout) {
        clearTimeout(newTimeout);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, applyFilters]);

  const handleAddBooking = async (newBooking) => {
    try {
      setIsSubmitting(true);
      const createdBooking = await createBooking(newBooking);
      setBookings((prevBookings) => [...prevBookings, createdBooking]);
      setIsModalOpen(false);
      toast.success("Booking added successfully!");
      return createdBooking;
    } catch (err) {
      console.error("Error in handleAddBooking:", err);

      let errorMessage = "Failed to add booking!";

      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.message) {
        errorMessage = err.message;
      }

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteBooking = async (id) => {
    setConfirmDeleteId(id);
  };

  const confirmDeleteBooking = async () => {
    try {
      const id = confirmDeleteId;
      if (!id) return;
      setIsDeleting(true);
      await deleteBooking(id);
      setBookings((prevBookings) =>
        prevBookings.filter((booking) => booking.id !== id),
      );
      toast.success("Booking deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete booking!");
      console.log(err);
    } finally {
      setIsDeleting(false);
      setConfirmDeleteId(null);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
    resetToFirstPage();
  };

  const clearFilters = () => {
    setFilters({
      guestFullName: "",
      guestIdNumber: "",
      guestNationality: "",
      roomNumber: "",
      checkInDateFrom: "",
      checkInDateTo: "",
      checkOutDateFrom: "",
      checkOutDateTo: "",
      bookingType: "",
      status: "",
      numberOfGuestsMin: "",
      numberOfGuestsMax: "",
    });
    resetToFirstPage();
  };

  const hasActiveFilters = Object.values(filters).some((value) => value !== "");

  const getActiveFilterCount = () => {
    return Object.values(filters).filter((value) => value !== "").length;
  };

  const formatDateTimeByType = (dateString, type) => {
    if (!dateString) return "_";
    try {
      const d = new Date(dateString);
      return type === "Hourly"
        ? d.toLocaleString(undefined, {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })
        : d.toLocaleDateString();
    } catch {
      return "Invalid Date";
    }
  };

  const PER_PAGE = 10;

  const goPrev = () => setCurrentPage((p) => Math.max(1, p - 1));
  const goNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

  return (
    <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <div className="col-span-1 mb-6 flex flex-col justify-center md:col-span-2">
          <h2 className="text-2xl font-bold text-gray-800">
            Booking Management
          </h2>
          <p className="text-base text-gray-500">
            Track and manage all hotel reservations.
          </p>
        </div>
        <div className="col-span-1 flex items-center justify-end gap-3 md:col-span-2">
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variation={showFilters ? "primary" : "tertiary"}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 transition-all duration-300 ${
              showFilters ? "shadow-lg" : ""
            }`}
          >
            <FaFilter className="h-4 w-4" />
            <span>Filters</span>
            {getActiveFilterCount() > 0 && (
              <span className="rounded-full bg-blue-600 px-2 py-1 text-xs text-white">
                {getActiveFilterCount()}
              </span>
            )}
          </Button>
          <Button onClick={() => setIsModalOpen(true)}>Add booking</Button>
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="col-span-4 rounded-2xl bg-white p-6">
        {showFilters && (
          <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FaSearch className="h-5 w-5 text-slate-400" />
                <h3 className="text-lg font-semibold text-slate-800">
                  Advanced Filters
                </h3>
                {isFiltering && (
                  <div className="ml-2 h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
                )}
              </div>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 text-slate-500 transition-colors hover:text-red-500"
                >
                  <FaX className="h-4 w-4" />
                  <span className="text-sm">Clear All</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {/* Guest Name Filter */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <FaUser className="text-slate-400" />
                  Guest Name
                </label>
                <input
                  type="text"
                  placeholder="Enter guest name"
                  value={filters.guestFullName}
                  onChange={(e) =>
                    handleFilterChange("guestFullName", e.target.value)
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Guest ID Number Filter */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <FaIdCard className="text-slate-400" />
                  ID Number
                </label>
                <input
                  type="text"
                  placeholder="Enter ID number"
                  value={filters.guestIdNumber}
                  onChange={(e) =>
                    handleFilterChange("guestIdNumber", e.target.value)
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Guest Nationality Filter */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <FaGlobe className="text-slate-400" />
                  Nationality
                </label>
                <input
                  type="text"
                  placeholder="Enter nationality"
                  value={filters.guestNationality}
                  onChange={(e) =>
                    handleFilterChange("guestNationality", e.target.value)
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Room Number Filter */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <FaBed className="text-slate-400" />
                  Room Number
                </label>
                <input
                  type="number"
                  placeholder="Enter room number"
                  value={filters.roomNumber}
                  onChange={(e) =>
                    handleFilterChange("roomNumber", e.target.value)
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Check-in Date From */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <FaCalendarAlt className="text-slate-400" />
                  Check-in From
                </label>
                <input
                  type="date"
                  value={filters.checkInDateFrom}
                  onChange={(e) =>
                    handleFilterChange("checkInDateFrom", e.target.value)
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Check-in Date To */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <FaCalendarAlt className="text-slate-400" />
                  Check-in To
                </label>
                <input
                  type="date"
                  value={filters.checkInDateTo}
                  onChange={(e) =>
                    handleFilterChange("checkInDateTo", e.target.value)
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Check-out Date From */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <FaCalendarAlt className="text-slate-400" />
                  Check-out From
                </label>
                <input
                  type="date"
                  value={filters.checkOutDateFrom}
                  onChange={(e) =>
                    handleFilterChange("checkOutDateFrom", e.target.value)
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Check-out Date To */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <FaCalendarAlt className="text-slate-400" />
                  Check-out To
                </label>
                <input
                  type="date"
                  value={filters.checkOutDateTo}
                  onChange={(e) =>
                    handleFilterChange("checkOutDateTo", e.target.value)
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Booking Type Filter */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <FaBed className="text-slate-400" />
                  Booking Type
                </label>
                <select
                  value={filters.bookingType}
                  onChange={(e) =>
                    handleFilterChange("bookingType", e.target.value)
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All types</option>
                  {bookingTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <FaUser className="text-slate-400" />
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) =>
                    handleFilterChange("status", e.target.value.toUpperCase())
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All statuses</option>
                  {statusOptions.map((status) => (
                    <option key={status} value={status.toUpperCase()}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              {/* Number of Guests Min */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <FaUsers className="text-slate-400" />
                  Min Guests
                </label>
                <input
                  type="number"
                  placeholder="Min guests"
                  value={filters.numberOfGuestsMin}
                  onChange={(e) =>
                    handleFilterChange("numberOfGuestsMin", e.target.value)
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Number of Guests Max */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <FaUsers className="text-slate-400" />
                  Max Guests
                </label>
                <input
                  type="number"
                  placeholder="Max guests"
                  value={filters.numberOfGuestsMax}
                  onChange={(e) =>
                    handleFilterChange("numberOfGuestsMax", e.target.value)
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Bookings Table */}
        <div className="rounded-lg bg-white shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Booking ID
                  </th>
                  <th className="px-3 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Guest Name
                  </th>
                  <th className="hidden px-3 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase sm:table-cell">
                    Room Number
                  </th>
                  <th className="hidden px-3 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase md:table-cell">
                    Check-in/Check-out
                  </th>
                  <th className="hidden px-3 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase lg:table-cell">
                    Guests
                  </th>
                  <th className="px-3 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Type
                  </th>
                  <th className="px-3 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-3 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {isLoading ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-4">
                      <div className="flex h-40 items-center justify-center">
                        <Spinner />
                      </div>
                    </td>
                  </tr>
                ) : bookings.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-4">
                      <div className="flex flex-col items-center justify-center py-16">
                        <div className="text-lg font-semibold text-gray-400">
                          {hasActiveFilters
                            ? "No bookings match your current filter criteria."
                            : "There are no bookings available at the moment."}
                        </div>
                        {hasActiveFilters && (
                          <button
                            onClick={clearFilters}
                            className="mt-4 font-medium text-blue-500 hover:text-blue-600"
                          >
                            Clear all filters
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  pageBookings.map((booking) => (
                    <tr key={booking.id}>
                      <td className="px-3 py-4 text-base font-medium whitespace-nowrap text-gray-900">
                        <div className="font-semibold">#{booking.id}</div>
                      </td>
                      <td className="px-3 py-4 text-base font-medium whitespace-nowrap text-gray-900">
                        <div className="font-semibold">
                          {booking.guestFullName}
                        </div>
                        <div className="text-xs text-gray-500">
                          {booking.guestNationality}
                        </div>
                      </td>
                      <td className="hidden px-3 py-4 text-base font-semibold whitespace-nowrap text-gray-800 sm:table-cell">
                        {booking.roomNumber}
                      </td>
                      <td className="hidden px-3 py-4 text-base whitespace-nowrap text-gray-800 md:table-cell">
                        {booking.bookingType?.toUpperCase() === "HOURLY" ? (
                          <div className="space-y-1">
                            <div className="text-sm">
                              <span className="mr-1 font-semibold">In:</span>
                              <span className="rounded-md bg-gray-100 px-2 py-0.5">
                                {formatDateTimeByType(
                                  booking.checkInDate,
                                  "Hourly",
                                )}
                              </span>
                            </div>
                            <div className="text-sm">
                              <span className="mr-1 font-semibold">Out:</span>
                              <span className="rounded-md bg-gray-100 px-2 py-0.5">
                                {formatDateTimeByType(
                                  booking.checkOutDate,
                                  "Hourly",
                                )}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <div className="text-sm">
                              <span className="mr-1 font-semibold">In:</span>
                              <span>
                                {formatDateTimeByType(
                                  booking.checkInDate,
                                  "Daily",
                                )}
                              </span>
                            </div>
                            <div className="text-sm">
                              <span className="mr-1 font-semibold">Out:</span>
                              <span>
                                {formatDateTimeByType(
                                  booking.checkOutDate,
                                  "Daily",
                                )}
                              </span>
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="hidden px-3 py-4 text-base whitespace-nowrap text-gray-800 lg:table-cell">
                        {booking.numberOfGuests}
                      </td>
                      <td className="px-3 py-4 text-base whitespace-nowrap text-gray-800">
                        {booking.bookingType?.charAt(0).toUpperCase() +
                          booking.bookingType?.slice(1).toLowerCase()}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs leading-5 font-semibold ${
                            statusStyles[booking.status]
                          }`}
                        >
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-3 py-4 text-right text-sm font-medium whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            className="rounded-full p-2 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`${booking.id}`);
                            }}
                            title="See details"
                          >
                            <HiEye />
                          </button>
                          <button
                            className="rounded-full p-2 text-red-600 hover:bg-red-50 hover:text-red-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteBooking(booking.id);
                            }}
                            title="Delete booking"
                          >
                            <HiTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between p-4">
            <p className="hidden text-sm text-gray-500 md:block">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                onClick={goPrev}
                disabled={currentPage === 1}
              >
                &lt; Previous
              </button>
              <button
                className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                onClick={goNext}
                disabled={currentPage === totalPages}
              >
                Next &gt;
              </button>
            </div>
            <div className="hidden items-center gap-4 md:flex">
              <label className="text-sm text-gray-600">Rows per page:</label>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="rounded-md border border-gray-300 px-2 py-1 text-sm text-gray-700"
              >
                <option value={10}>10</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <AddBookingForm
          onSubmit={handleAddBooking}
          onClose={() => setIsModalOpen(false)}
          isSubmitting={isSubmitting}
        />
      </Modal>

      <ConfirmModal
        isOpen={!!confirmDeleteId}
        onClose={() => setConfirmDeleteId(null)}
        onConfirm={confirmDeleteBooking}
        title="Delete booking"
        message="Are you sure you want to delete this booking? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variation="danger"
        isConfirming={isDeleting}
        isCancelling={isDeleting}
      />
    </>
  );
}

export default Bookings;
