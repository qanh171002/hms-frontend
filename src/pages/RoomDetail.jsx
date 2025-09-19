import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  FaBed,
  FaUserFriends,
  FaDollarSign,
  FaArrowLeft,
  FaEdit,
  FaTrash,
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
      toast.error("Delete room failed!");
      console.error("Error deleting room:", err);
    } finally {
      setIsConfirmOpen(false);
    }
  };

  return (
    <div className="grid grid-cols-5 gap-6">
      <div className="col-span-2 mb-6 flex flex-col justify-center">
        <h2 className="text-2xl font-bold text-gray-800">Room detail</h2>
        <p className="text-md text-gray-500">
          Here is the detail of your hotel room.
        </p>
      </div>

      <div className="col-span-3 mb-6 flex items-center justify-end gap-4"></div>
      <div className="col-span-5 rounded-2xl bg-white p-6">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-7 flex items-center justify-center">
            <img
              src={demoImage}
              alt="Room"
              className="h-[420px] w-full max-w-full rounded-2xl object-cover shadow-lg"
            />
          </div>
          <div className="col-span-5 flex h-full flex-col justify-center gap-8 px-4">
            <div className="mb-2 flex items-center gap-4">
              <h2 className="text-3xl font-bold text-gray-800">
                Room #{roomNumberFormatted}
              </h2>
              {/* <span
                className={`px-4 py-2 text-base font-semibold rounded-full ${statusColor}`}
              >
                {roomData.status}
              </span> */}
            </div>
            <div className="space-y-6 text-xl">
              {hourlyPrice && (
                <div className="flex items-center gap-3 text-gray-700">
                  <FaDollarSign className="text-2xl text-blue-500" />
                  <span className="font-semibold">
                    ${hourlyPrice.basePrice} per hour
                  </span>
                </div>
              )}
              {dailyPrice && (
                <div className="flex items-center gap-3 text-gray-700">
                  <FaDollarSign className="text-2xl text-blue-500" />
                  <span className="font-semibold">
                    ${dailyPrice.basePrice} per day
                  </span>
                </div>
              )}
              <div className="flex items-center gap-3 text-gray-700">
                <FaBed className="text-2xl text-blue-500" />
                <span className="font-semibold">{roomData.roomType}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <FaUserFriends className="text-2xl text-blue-500" />
                <span className="font-semibold">{capacityFormatted}</span>
              </div>
            </div>
            <div className="mt-10 flex items-center gap-4">
              <Button
                onClick={() => navigate(-1)}
                variation="tertiary"
                className="flex items-center gap-2 px-7 py-3 text-lg font-semibold"
              >
                <FaArrowLeft />
                Back
              </Button>
              <Button
                onClick={() => setIsEditOpen(true)}
                variation="primary"
                className="flex items-center gap-2 px-7 py-3 text-lg font-semibold"
              >
                <FaEdit />
                Edit
              </Button>
              <Button
                onClick={handleDeleteRoom}
                variation="danger"
                className="flex items-center gap-2 px-7 py-3 text-lg font-semibold"
              >
                <FaTrash />
                Delete
              </Button>
            </div>
          </div>
        </div>
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
