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
import { deleteRoom, getRoomById } from "../apis/roomsApi";
import Spinner from "../components/Spinner";
import toast from "react-hot-toast";

const demoImage =
  "https://www.realestate.com.au/blog/images/2633x1974-fit,progressive/2018/12/19142303/27616925_EPCExternalUser_63f6449d-d085-4d76-82ba-a2dd366d1d84.jpg?auto=format&fit=crop&w=800&q=80";

export default function RoomDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [roomData, setRoomData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
      <div className="flex justify-center items-center h-40">
        <Spinner />
      </div>
    );
  }

  if (!roomData) {
    return (
      <div className="flex justify-center items-center h-40">
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

  const statusColor =
    roomData.status === "Available"
      ? "bg-blue-100 text-blue-500"
      : roomData.status === "Reserved"
      ? "bg-green-100 text-green-500"
      : "bg-red-100 text-red-500";

  const handleEditRoom = (updatedRoom) => {
    setRoomData(updatedRoom);
  };

  const handleDeleteRoom = async () => {
    if (!window.confirm("Do you want to delete this room?")) return;
    try {
      await deleteRoom(id);
      toast.success("Delete room successfully!");
      navigate("/rooms");
    } catch (err) {
      toast.error("Delete room failed!");
      console.error("Error deleting room:", err);
    }
  };

  return (
    <div className="grid grid-cols-5 gap-6">
      <div className="flex flex-col col-span-2 justify-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Room detail</h2>
        <p className="text-gray-500 text-md">
          Here is the detail of your hotel room.
        </p>
      </div>

      <div className="flex col-span-3 gap-4 justify-end items-center mb-6"></div>
      <div className="col-span-5 p-6 bg-white rounded-2xl">
        <div className="grid grid-cols-12 gap-8">
          <div className="flex col-span-7 justify-center items-center">
            <img
              src={demoImage}
              alt="Room"
              className="h-[420px] w-full max-w-full rounded-2xl object-cover shadow-lg"
            />
          </div>
          <div className="flex flex-col col-span-5 gap-8 justify-center px-4 h-full">
            <div className="flex gap-4 items-center mb-2">
              <h2 className="text-3xl font-bold text-gray-800">
                Room #{roomNumberFormatted}
              </h2>
              <span
                className={`px-4 py-2 text-base font-semibold rounded-full ${statusColor}`}
              >
                {roomData.status}
              </span>
            </div>
            <div className="space-y-6 text-xl">
              {hourlyPrice && (
                <div className="flex gap-3 items-center text-gray-700">
                  <FaDollarSign className="text-2xl text-blue-500" />
                  <span className="font-semibold">
                    ${hourlyPrice.basePrice} per hour
                  </span>
                </div>
              )}
              {dailyPrice && (
                <div className="flex gap-3 items-center text-gray-700">
                  <FaDollarSign className="text-2xl text-blue-500" />
                  <span className="font-semibold">
                    ${dailyPrice.basePrice} per day
                  </span>
                </div>
              )}
              <div className="flex gap-3 items-center text-gray-700">
                <FaBed className="text-2xl text-blue-500" />
                <span className="font-semibold">{roomData.roomType}</span>
              </div>
              <div className="flex gap-3 items-center text-gray-700">
                <FaUserFriends className="text-2xl text-blue-500" />
                <span className="font-semibold">{capacityFormatted}</span>
              </div>
            </div>
            <div className="flex gap-4 items-center mt-10">
              <button
                onClick={() => navigate(-1)}
                className="flex gap-2 items-center px-7 py-3 text-lg font-semibold text-gray-700 rounded-md border border-gray-300 transition duration-200 ease-in-out hover:bg-gray-100"
              >
                <FaArrowLeft />
                Back
              </button>
              <button
                className="flex gap-2 items-center px-7 py-3 text-lg font-semibold text-white bg-blue-500 rounded-md transition duration-200 ease-in-out hover:bg-blue-600"
                onClick={() => setIsEditOpen(true)}
              >
                <FaEdit />
                Edit
              </button>
              <button
                className="flex gap-2 items-center px-7 py-3 text-lg font-semibold text-white bg-red-500 rounded-md transition duration-200 ease-in-out text-md hover:bg-red-600"
                onClick={handleDeleteRoom}
              >
                <FaTrash />
                Delete
              </button>
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
    </div>
  );
}
