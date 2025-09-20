import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  FaBed,
  FaUserFriends,
  FaDollarSign,
  FaArrowLeft,
  FaEdit,
  FaTrash,
  FaClock,
  FaCalendarDay,
} from "react-icons/fa";
import Modal from "../components/Modal";
import EditRoomForm from "../components/EditRoomForm";
import Button from "../components/Button";
import { deleteRoom, getRoomById } from "../apis/roomsApi";
import Spinner from "../components/Spinner";
import toast from "react-hot-toast";
import ConfirmModal from "../components/ConfirmModal";

const demoImage =
  "https://www.realestate.com.au/blog/images/2633x1974-fit,progressive/2018/12/19142303/27616925_EPCExternalUser_63f6449d-d085-4d76-82ba-a2dd366d1d84.jpg?auto=format&fit=crop&w=800&q=80";

export default function RoomDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [roomData, setRoomData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        setIsLoading(true);
        const data = await getRoomById(id);
        setRoomData(data);
      } catch (err) {
        console.error("Error fetching room:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoomData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!roomData) {
    return (
      <div className="flex h-40 items-center justify-center">
        <div className="text-lg text-gray-600">Room not found</div>
      </div>
    );
  }

  const hourlyPrice = roomData.prices?.find((p) => p.priceType === "HOURLY");
  const dailyPrice = roomData.prices?.find((p) => p.priceType === "DAILY");

  const capacityFormatted = roomData.maxOccupancy
    ? roomData.maxOccupancy === 1
      ? "1 person"
      : `1-${roomData.maxOccupancy} person${
          roomData.maxOccupancy > 1 ? "s" : ""
        }`
    : "N/A";

  const roomNumberFormatted = roomData.roomNumber
    ? String(roomData.roomNumber).padStart(3, "0")
    : roomData.roomNumber;

  // const statusColor =
  //   roomData.status === "Available"
  //     ? "bg-blue-100 text-blue-500"
  //     : roomData.status === "Reserved"
  //     ? "bg-green-100 text-green-500"
  //     : "bg-red-100 text-red-500";

  const handleEditRoom = (updatedRoom) => {
    setRoomData(updatedRoom);
  };

  const handleDeleteRoom = async () => {
    setIsConfirmOpen(true);
  };
  const confirmDeleteRoom = async () => {
    try {
      await deleteRoom(id);
      toast.success("Delete room successfully!");
      navigate("/rooms");
    } catch (err) {
      console.error("Error deleting room:", err);

      let errorMessage = "Delete room failed!";

      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.message) {
        errorMessage = err.message;
      }

      toast.error(errorMessage);
    } finally {
      setIsConfirmOpen(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Room Details</h1>
          <p className="mt-2 text-gray-600">
            Complete information about this room
          </p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-lg font-semibold text-blue-600 hover:text-blue-800"
        >
          <FaArrowLeft />
          Back
        </button>
      </div>

      {/* Main Content */}
      <div className="rounded-2xl bg-white p-8 shadow-lg">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Left Column - Image */}
          <div className="flex items-center justify-center">
            <img
              src={demoImage}
              alt={`Room ${roomNumberFormatted}`}
              className="h-96 w-full max-w-full rounded-2xl object-cover shadow-lg"
            />
          </div>

          {/* Right Column - Room Info */}
          <div className="flex flex-col justify-center space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">
                Room #{roomNumberFormatted}
              </h2>
              <p className="mt-2 text-lg text-gray-600">{roomData.location}</p>
            </div>

            {/* Room Details */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-blue-100 p-3">
                  <FaBed className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Room Type</p>
                  <p className="text-xl font-semibold text-gray-800">
                    {roomData.roomType}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-green-100 p-3">
                  <FaUserFriends className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Capacity</p>
                  <p className="text-xl font-semibold text-gray-800">
                    {capacityFormatted}
                  </p>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800">Pricing</h3>
              <div className="space-y-3">
                {hourlyPrice && (
                  <div className="flex items-center justify-between rounded-lg bg-blue-50 p-4">
                    <div className="flex items-center gap-3">
                      <FaClock className="h-5 w-5 text-blue-600" />
                      <span className="text-gray-700">Hourly Rate</span>
                    </div>
                    <span className="text-xl font-bold text-blue-600">
                      ${hourlyPrice.basePrice}/hour
                    </span>
                  </div>
                )}
                {dailyPrice && (
                  <div className="flex items-center justify-between rounded-lg bg-green-50 p-4">
                    <div className="flex items-center gap-3">
                      <FaCalendarDay className="h-5 w-5 text-green-600" />
                      <span className="text-gray-700">Daily Rate</span>
                    </div>
                    <span className="text-xl font-bold text-green-600">
                      ${dailyPrice.basePrice}/day
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-4">
        <Button
          onClick={() => setIsEditOpen(true)}
          variation="primary"
          className="flex items-center gap-2"
        >
          <FaEdit />
          Edit Room
        </Button>
        <Button
          onClick={handleDeleteRoom}
          variation="danger"
          className="flex items-center gap-2"
        >
          <FaTrash />
          Delete Room
        </Button>
      </div>
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)}>
        <EditRoomForm
          room={roomData}
          onSubmit={handleEditRoom}
          onClose={() => setIsEditOpen(false)}
        />
      </Modal>
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDeleteRoom}
        title="Delete room"
        message="Are you sure you want to delete this room? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variation="danger"
      />
    </div>
  );
}
