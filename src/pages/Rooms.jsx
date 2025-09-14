import { useEffect, useState } from "react";
import { createRoom, getRooms } from "../apis/roomsApi";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import { FaUserFriends, FaBed } from "react-icons/fa";
import Spinner from "../components/Spinner";
import toast from "react-hot-toast";
import Modal from "../components/Modal";
import AddRoomForm from "../components/AddRoomForm";

const statusColors = {
  Available: {
    base: "bg-blue-500",
    hover: "hover:bg-blue-600",
  },
  Reserved: {
    base: "bg-green-500",
    hover: "hover:bg-green-600",
  },
  Booked: {
    base: "bg-red-500",
    hover: "hover:bg-red-600",
  },
};

function Rooms() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState("");
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setIsLoading(true);
        const data = await getRooms();
        setRooms(data);
      } catch (err) {
        console.error("Error fetching rooms:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const handleAddRoom = async (newRoom) => {
    try {
      setIsSubmitting(true);
      const createdRoom = await createRoom(newRoom);
      setRooms((prevRooms) => [...prevRooms, createdRoom]);
      setIsModalOpen(false);
      toast.success("Room added successfully!");
    } catch (err) {
      toast.error("Failed to add room!");
      console.log(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFloorChange = (e) => {
    setSelectedFloor(e.target.value);
  };

  const filteredRooms = selectedFloor
    ? rooms.filter((room) => room.location.startsWith(selectedFloor))
    : rooms;

  return (
    <div className="grid grid-cols-5 gap-6">
      <div className="col-span-2 mb-6 flex flex-col justify-center">
        <h2 className="text-2xl font-bold text-gray-800">Room Management</h2>
        <p className="text-base text-gray-500">
          Manage and monitor hotel room status.
        </p>
      </div>
      <div className="col-span-3 mb-6 flex items-center justify-end gap-4">
        <select
          className="rounded-md border border-gray-500 px-3 py-2 text-sm"
          value={selectedFloor}
          onChange={handleFloorChange}
        >
          <option value="">All floors</option>
          <option value="1">1st floor</option>
          <option value="2">2nd floor</option>
          <option value="3">3rd floor</option>
          <option value="4">4th floor</option>
        </select>
        <Button onClick={() => setIsModalOpen(true)}>Add room</Button>
      </div>
      <div className="col-span-5 rounded-2xl bg-white p-6">
        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <Spinner />
          </div>
        ) : filteredRooms.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <FaBed className="mb-2 text-6xl text-gray-400" />
            <div className="text-lg font-semibold text-gray-400">
              There are no rooms available on this floor at the moment.
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {filteredRooms.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
            <div className="mt-16 flex justify-center gap-6">
              <LegendItem color="bg-blue-500" label="Available" />
              <LegendItem color="bg-green-500" label="Reserved" />
              <LegendItem color="bg-red-500" label="Booked" />
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
    </div>
  );
}

export default Rooms;

function RoomCard({ room }) {
  const navigate = useNavigate();
  const roomName = `Cabin ${String(room.roomNumber).padStart(3, "0")}`;
  const colors = statusColors[room.status] || {
    base: "bg-gray-500",
    hover: "hover:bg-gray-600",
  };
  const hourlyPrice = room.prices?.find((p) => p.priceType === "HOURLY");
  const dailyPrice = room.prices?.find((p) => p.priceType === "DAILY");

  const displayPrice = dailyPrice || hourlyPrice;
  const priceType = dailyPrice ? "day" : "hour";

  return (
    <div
      className={`relative flex min-h-[140px] cursor-pointer flex-col justify-between rounded-2xl p-4 text-white shadow-md transition duration-300 hover:scale-[1.02] hover:shadow-lg ${colors.base} ${colors.hover}`}
      onClick={() => navigate(`/rooms/${room.id}`)}
    >
      <div className="mb-4 text-xl font-bold tracking-wide text-white">
        {roomName}
      </div>
      <div className="mb-14 flex flex-col gap-2">
        <div className="flex items-center text-base">
          <FaUserFriends className="mr-2 text-gray-100" />
          <span className="text-gray-100">
            For up to <span className="font-semibold">{room.maxOccupancy}</span>{" "}
            {room.maxOccupancy === 1 ? "guest" : "guests"}
          </span>
        </div>
        <div className="flex items-center text-base">
          <FaBed className="mr-2 text-gray-100" />
          <span className="text-gray-100">{room.roomType}</span>
        </div>
      </div>
      {displayPrice && (
        <div className="absolute right-6 bottom-6 text-2xl font-bold text-white">
          ${displayPrice.basePrice}
          <span className="text-base font-semibold text-gray-200">
            /{priceType}
          </span>
        </div>
      )}
    </div>
  );
}

function LegendItem({ color, label }) {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-700">
      <div className={`h-3 w-3 rounded-full ${color}`} />
      <span>{label}</span>
    </div>
  );
}
