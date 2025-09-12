import { HiDotsVertical, HiEye, HiTrash } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Button from "../components/Button";
import Modal from "../components/Modal";
import { createBooking, deleteBooking, getBookings } from "../apis/bookingsApi";
import { FaPlus } from "react-icons/fa";
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

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        const data = await getBookings();
        setBookings(data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        toast.error("Failed to fetch bookings!");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleAddBooking = async (newBooking) => {
    try {
      setIsSubmitting(true);
      const createdBooking = await createBooking(newBooking);
      setBookings((prevBookings) => [...prevBookings, createdBooking]);
      setIsModalOpen(false);
      toast.success("Booking added successfully!");
    } catch (err) {
      console.error("Error in handleAddBooking:", err);
      toast.error(err.message || "Failed to add booking!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteBooking = async (id) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      try {
        await deleteBooking(id);
        setBookings((prevBookings) =>
          prevBookings.filter((booking) => booking.id !== id)
        );
        toast.success("Booking deleted successfully!");
      } catch (err) {
        toast.error("Failed to delete booking!");
        console.log(err);
      }
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
  const totalPages = Math.max(1, Math.ceil(filteredBookings.length / PER_PAGE));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);
  const start = (safePage - 1) * PER_PAGE;
  const end = start + PER_PAGE;
  const pageBookings = filteredBookings.slice(start, end);

  const goPrev = () => setCurrentPage((p) => Math.max(1, p - 1));
  const goNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

  return (
    <>
      <div className="mb-8 flex flex-col items-center justify-between sm:flex-row">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">List of Bookings</h2>
          <p className="text-base text-gray-500">
            Here is the list of bookings.
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
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Booking ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Guest Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Room Number
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Check-in/Check-out
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Guests
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500"></th>
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
                    <td className="whitespace-nowrap px-6 py-4 text-base font-medium text-gray-900 ">
                      <div className="font-semibold">#{booking.id}</div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-base font-medium text-gray-900 ">
                      <div className="font-semibold">
                        {booking.guestFullName}
                      </div>
                      <div className="text-xs text-gray-500">
                        {booking.guestNationality}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-base font-semibold text-gray-800 ">
                      {booking.roomNumber}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-base text-gray-800 ">
                      {booking.bookingType === "Hourly" ? (
                        <div className="space-y-1">
                          <div className="text-sm">
                            <span className="mr-1 font-semibold">In:</span>
                            <span className="rounded-md bg-gray-100 px-2 py-0.5">
                              {formatDateTimeByType(
                                booking.checkInDate,
                                "Hourly"
                              )}
                            </span>
                          </div>
                          <div className="text-sm">
                            <span className="mr-1 font-semibold">Out:</span>
                            <span className="rounded-md bg-gray-100 px-2 py-0.5">
                              {formatDateTimeByType(
                                booking.checkOutDate,
                                "Hourly"
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
                                "Daily"
                              )}
                            </span>
                          </div>
                          <div className="text-sm">
                            <span className="mr-1 font-semibold">Out:</span>
                            <span>
                              {formatDateTimeByType(
                                booking.checkOutDate,
                                "Daily"
                              )}
                            </span>
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-base text-gray-800 ">
                      {booking.numberOfGuests}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-base text-gray-800 ">
                      {booking.bookingType}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-base font-semibold leading-5 ${
                          statusStyles[booking.status]
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
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

        {/* Pagination */}
        <div className="flex items-center justify-between p-4">
          <p className="text-sm text-gray-500">
            Showing {filteredBookings.length === 0 ? 0 : start + 1} to{" "}
            {Math.min(end, filteredBookings.length)} of{" "}
            {filteredBookings.length} results
          </p>
          <div className="flex items-center gap-2">
            <button
              className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50"
              onClick={goPrev}
              disabled={safePage === 1}
            >
              &lt; Previous
            </button>
            <button
              className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50"
              onClick={goNext}
              disabled={safePage === totalPages}
            >
              Next &gt;
            </button>
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
    </>
  );
}

export default Bookings;
