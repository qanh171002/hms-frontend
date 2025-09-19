import { HiDotsVertical, HiEye, HiTrash } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Button from "../components/Button";
import Modal from "../components/Modal";
import ConfirmModal from "../components/ConfirmModal";
import { createBooking, deleteBooking, getBookings } from "../apis/bookingsApi";
import toast from "react-hot-toast";
import Spinner from "../components/Spinner";
import AddBookingForm from "../components/AddBookingForm";

const statusStyles = {
  "Checked in": "bg-green-100 text-green-700",
  "Checked out": "bg-gray-200 text-gray-700",
  Unconfirmed: "bg-blue-100 text-blue-700",
  Cancelled: "bg-red-100 text-red-700",
};

const FilterButton = ({ active, children, onClick }) => (
  <button
    onClick={onClick}
    className={`rounded-md px-4 py-2 text-sm font-medium ${
      active
        ? "bg-blue-500 text-white"
        : "bg-white text-gray-700 hover:bg-gray-50"
    }`}
  >
    {children}
  </button>
);

function Bookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const pageBookings = bookings;
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        const data = await getBookings(currentPage - 1, PER_PAGE);
        const sorted = [...(data.content || [])].sort(
          (a, b) => (a.id || 0) - (b.id || 0),
        );
        setBookings(sorted);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        toast.error("Failed to fetch bookings!");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, [currentPage, activeFilter]);

  const handleAddBooking = async (newBooking) => {
    try {
      setIsSubmitting(true);
      const createdBooking = await createBooking(newBooking);
      setBookings((prevBookings) =>
        [...prevBookings, createdBooking].sort(
          (a, b) => (a.id || 0) - (b.id || 0),
        ),
      );
      setIsModalOpen(false);
      toast.success("Booking added successfully!");
      return createdBooking;
    } catch (err) {
      console.error("Error in handleAddBooking:", err);
      toast.error(err.message || "Failed to add booking!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const handleDeleteBooking = async (id) => {
    setConfirmDeleteId(id);
  };
  const confirmDeleteBooking = async () => {
    try {
      const id = confirmDeleteId;
      if (!id) return;
      await deleteBooking(id);
      setBookings((prevBookings) =>
        prevBookings
          .filter((booking) => booking.id !== id)
          .sort((a, b) => (a.id || 0) - (b.id || 0)),
      );
      toast.success("Booking deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete booking!");
      console.log(err);
    } finally {
      setConfirmDeleteId(null);
    }
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  const filteredBookings = bookings.filter((booking) => {
    if (activeFilter === "All") return true;
    return booking.status === activeFilter;
  });

  const formatDateTimeByType = (dateString, type) => {
    if (!dateString) return "N/A";
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
      <div className="mb-8 flex flex-col items-center justify-between sm:flex-row">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Booking Management
          </h2>
          <p className="text-base text-gray-500">
            Track and manage all hotel reservations.
          </p>
        </div>
        <div className="mt-4 flex items-center gap-2 sm:mt-0">
          <div className="flex items-center gap-2 rounded-md bg-gray-100 p-1">
            <FilterButton
              active={activeFilter === "All"}
              onClick={() => handleFilterChange("All")}
            >
              All
            </FilterButton>
            <FilterButton
              active={activeFilter === "Checked in"}
              onClick={() => handleFilterChange("Checked in")}
            >
              Checked in
            </FilterButton>
            <FilterButton
              active={activeFilter === "Checked out"}
              onClick={() => handleFilterChange("Checked out")}
            >
              Checked out
            </FilterButton>
            <FilterButton
              active={activeFilter === "Unconfirmed"}
              onClick={() => handleFilterChange("Unconfirmed")}
            >
              Unconfirmed
            </FilterButton>
            <FilterButton
              active={activeFilter === "Cancelled"}
              onClick={() => handleFilterChange("Cancelled")}
            >
              Cancelled
            </FilterButton>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>Add booking</Button>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="rounded-lg bg-white shadow-md">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Booking ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Guest Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Room Number
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Check-in/Check-out
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Guests
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"></th>
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
              ) : filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-4">
                    <div className="flex flex-col items-center justify-center py-16">
                      <div className="text-lg font-semibold text-gray-400">
                        No bookings found with the selected filters.
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                pageBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td className="px-6 py-4 text-base font-medium whitespace-nowrap text-gray-900">
                      <div className="font-semibold">#{booking.id}</div>
                    </td>
                    <td className="px-6 py-4 text-base font-medium whitespace-nowrap text-gray-900">
                      <div className="font-semibold">
                        {booking.guestFullName}
                      </div>
                      <div className="text-xs text-gray-500">
                        {booking.guestNationality}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-base font-semibold whitespace-nowrap text-gray-800">
                      {booking.roomNumber}
                    </td>
                    <td className="px-6 py-4 text-base whitespace-nowrap text-gray-800">
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
                    <td className="px-6 py-4 text-base whitespace-nowrap text-gray-800">
                      {booking.numberOfGuests}
                    </td>
                    <td className="px-6 py-4 text-base whitespace-nowrap text-gray-800">
                      {booking.bookingType?.charAt(0).toUpperCase() +
                        booking.bookingType?.slice(1).toLowerCase()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-base leading-5 font-semibold ${
                          statusStyles[booking.status]
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          className="rounded-full p-2 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/bookings/${booking.id}`);
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
          <p className="text-sm text-gray-500">
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
          <div className="flex items-center gap-4">
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
      />
    </>
  );
}

export default Bookings;
