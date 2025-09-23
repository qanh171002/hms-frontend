import { useEffect, useState, useCallback } from "react";
import {
  createRoom,
  filterRooms,
  getRooms,
  updateRoom,
} from "../apis/roomsApi";
import { createBooking } from "../apis/bookingsApi";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import {
  FaUserFriends,
  FaBed,
  FaFilter,
  FaSearch,
  FaMapMarkedAlt,
  FaUsers,
  FaCalendarAlt,
  FaCalendarPlus,
} from "react-icons/fa";
import Spinner from "../components/Spinner";
import toast from "react-hot-toast";
import Modal from "../components/Modal";
import AddRoomForm from "../components/AddRoomForm";
import AddBookingForm from "../components/AddBookingForm";
import { FaX } from "react-icons/fa6";

const roomTypes = ["Standard", "Deluxe", "Suite", "Executive"];
const maxOccupancies = [1, 2, 3, 4];

function Rooms() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const [filters, setFilters] = useState({
    roomType: "",
    location: "",
    maxOccupancy: "",
    desiredCheckIn: "",
    desiredCheckOut: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [filterTimeout, setFilterTimeout] = useState(null);

  useEffect(() => {
    const fetchInitialRooms = async () => {
      try {
        setIsLoading(true);
        const data = await getRooms(currentPage - 1, pageSize);
        const sorted = [...(data.content || [])].sort(
          (a, b) => (a.roomNumber || 0) - (b.roomNumber || 0),
        );
        setRooms(sorted);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        console.error("Error fetching rooms:", err);
        toast.error("Failed to load rooms");
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialRooms();
  }, [currentPage, pageSize]);

  const applyFilters = useCallback(async () => {
    try {
      setIsFiltering(true);
      const hasActiveFilters = Object.values(filters).some(
        (value) => value !== "",
      );

      let data;
      if (hasActiveFilters) {
        data = await filterRooms(filters, currentPage - 1, pageSize);
      } else {
        data = await getRooms(currentPage - 1, pageSize);
      }
      const sorted = [...(data.content || [])].sort(
        (a, b) => (a.roomNumber || 0) - (b.roomNumber || 0),
      );

      setRooms(sorted);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("Error filtering rooms:", err);
      toast.error("Failed to filter rooms");
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

  const handleAddRoom = async (newRoom) => {
    try {
      setIsSubmitting(true);
      const createdRoom = await createRoom(newRoom);
      setRooms((prevRooms) =>
        [...prevRooms, createdRoom].sort(
          (a, b) => (a.roomNumber || 0) - (b.roomNumber || 0),
        ),
      );
      setIsModalOpen(false);
      toast.success("Room added successfully!");
    } catch (err) {
      console.error("Error adding room:", err);

      let errorMessage = "Failed to add room!";

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

  const handleBookRoom = (room) => {
    setSelectedRoom(room);
    setIsBookingModalOpen(true);
  };

  const handleAddBooking = async (bookingData) => {
    try {
      setIsSubmitting(true);
      const createdBooking = await createBooking(bookingData);

      if (createdBooking && createdBooking.roomId) {
        await updateRoom(createdBooking.roomId, { status: "Reserved" });
        toast.success("Room status updated to Reserved");
      }

      toast.success("Booking created successfully!");
      setIsBookingModalOpen(false);
      setSelectedRoom(null);
    } catch (err) {
      console.error("Error creating booking:", err);

      let errorMessage = "Failed to create booking!";

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

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      roomType: "",
      location: "",
      maxOccupancy: "",
      desiredCheckIn: "",
      desiredCheckOut: "",
    });
    setCurrentPage(1);
  };

  const hasActiveFilters = Object.values(filters).some((value) => value !== "");

  const getActiveFilterCount = () => {
    return Object.values(filters).filter((value) => value !== "").length;
  };

  return (
    <div className="grid grid-cols-4 gap-6">
      <div className="col-span-2 mb-6 flex flex-col justify-center">
        <h2 className="text-2xl font-bold text-gray-800">Room Management</h2>
        <p className="text-base text-gray-500">
          Manage and monitor hotel room status.
        </p>
      </div>
      <div className="col-span-2 flex items-center justify-end gap-3">
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
        <Button
          onClick={() => setIsModalOpen(true)}
          variation="primary"
          className="rounded-xl px-6 py-3 shadow-lg transition-all duration-300 hover:shadow-xl"
        >
          Add Room
        </Button>
      </div>
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

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {/* Room Type Filter */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <FaBed className="text-slate-400" />
                  Room Type
                </label>
                <select
                  value={filters.roomType}
                  onChange={(e) =>
                    handleFilterChange("roomType", e.target.value)
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All types</option>
                  {roomTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location Filter */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <FaMapMarkedAlt className="text-slate-400" />
                  Location/Floor
                </label>
                <input
                  type="text"
                  placeholder="e.g., 1st floor"
                  value={filters.location}
                  onChange={(e) =>
                    handleFilterChange("location", e.target.value)
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Max Occupancy Filter */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <FaUsers className="text-slate-400" />
                  Min Capacity
                </label>
                <select
                  value={filters.maxOccupancy}
                  onChange={(e) =>
                    handleFilterChange("maxOccupancy", e.target.value)
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">Any capacity</option>
                  {maxOccupancies.map((capacity) => (
                    <option key={capacity} value={capacity}>
                      {capacity}+ guests
                    </option>
                  ))}
                </select>
              </div>

              {/* Check-in Date */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <FaCalendarAlt className="text-slate-400" />
                  Check-in
                </label>
                <input
                  type="date"
                  value={filters.desiredCheckIn}
                  onChange={(e) =>
                    handleFilterChange("desiredCheckIn", e.target.value)
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Check-out Date */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <FaCalendarAlt className="text-slate-400" />
                  Check-out
                </label>
                <input
                  type="date"
                  value={filters.desiredCheckOut}
                  onChange={(e) =>
                    handleFilterChange("desiredCheckOut", e.target.value)
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}
        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <Spinner />
          </div>
        ) : rooms.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <FaBed className="mb-2 text-6xl text-gray-400" />
            <div className="text-lg font-semibold text-gray-400">
              {hasActiveFilters
                ? "No rooms match your current filter criteria."
                : "There are no rooms available at the moment."}
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
        ) : (
          <>
            <div className="grid grid-cols-5 gap-4">
              {rooms.map((room) => (
                <RoomCard
                  key={room.id}
                  room={room}
                  onBookRoom={handleBookRoom}
                  filters={filters}
                />
              ))}
            </div>
            <div className="flex items-center justify-between p-4">
              <p className="text-sm text-gray-500">
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <button
                  className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  &lt; Previous
                </button>
                <button
                  className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next &gt;
                </button>
              </div>
              <div className="flex items-center gap-4">
                <label className="text-sm text-gray-600">Rooms per page:</label>
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
          </>
        )}
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <AddRoomForm
          onSubmit={handleAddRoom}
          onClose={() => setIsModalOpen(false)}
          isSubmitting={isSubmitting}
        />
      </Modal>

      <Modal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      >
        <AddBookingForm
          onSubmit={handleAddBooking}
          onClose={() => {
            setIsBookingModalOpen(false);
            setSelectedRoom(null);
          }}
          isSubmitting={isSubmitting}
          prefillData={
            selectedRoom
              ? {
                  roomNumber: selectedRoom.roomNumber,
                  checkInDate: filters.desiredCheckIn || "",
                  checkOutDate: filters.desiredCheckOut || "",
                  numberOfGuests: filters.maxOccupancy || "1",
                }
              : null
          }
        />
      </Modal>
    </div>
  );
}

export default Rooms;

function RoomCard({ room, onBookRoom }) {
  const navigate = useNavigate();
  const roomName = `Room ${String(room.roomNumber).padStart(3, "0")}`;
  const hourlyPrice = room.prices?.find((p) => p.priceType === "HOURLY");
  const dailyPrice = room.prices?.find((p) => p.priceType === "DAILY");

  const displayPrice = dailyPrice || hourlyPrice;
  const priceType = dailyPrice ? "day" : "hour";

  const handleBookClick = (e) => {
    e.stopPropagation();
    onBookRoom(room);
  };

  const handleCardClick = () => {
    navigate(`/rooms/${room.id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="relative flex min-h-[200px] flex-col justify-between rounded-2xl border border-gray-200 bg-white p-6 shadow-md transition duration-300 hover:scale-[1.02] hover:shadow-lg"
    >
      <div className="flex-1">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-800">{roomName}</h3>
          <p className="text-sm text-gray-500">{room.location}</p>
        </div>

        <div className="mb-4 flex flex-col gap-3">
          <div className="flex items-center text-sm text-gray-600">
            <FaBed className="mr-2 text-blue-500" />
            <span className="font-medium">{room.roomType}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <FaUserFriends className="mr-2 text-blue-500" />
            <span>
              Up to <span className="font-semibold">{room.maxOccupancy}</span>{" "}
              {room.maxOccupancy === 1 ? "guest" : "guests"}
            </span>
          </div>
        </div>

        {displayPrice && (
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">
              ${displayPrice.basePrice}
              <span className="text-sm font-medium text-gray-500">
                /{priceType}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Book Room Button */}
      <div className="mt-4 flex justify-end gap-2">
        <button
          onClick={handleBookClick}
          className="flex cursor-pointer items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600"
        >
          <FaCalendarPlus className="h-4 w-4" />
          Book Now
        </button>
      </div>
    </div>
  );
}
