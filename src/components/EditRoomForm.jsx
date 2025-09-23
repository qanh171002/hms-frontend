import React, { useState, useEffect } from "react";
import Button from "./Button";
import { updateRoom } from "../apis/roomsApi";
import { getHotelInfo } from "../apis/hotelApi";
import toast from "react-hot-toast";
import SpinnerMini from "./SpinnerMini";

function EditRoomForm({ room, onSubmit, onClose }) {
  const hourly = room.prices?.find((p) => p.priceType === "HOURLY");
  const daily = room.prices?.find((p) => p.priceType === "DAILY");
  const [formData, setFormData] = useState({
    roomNumber: room.roomNumber || "",
    maxOccupancy: room.maxOccupancy || "",
    roomType: room.roomType || "",
    location: room.location || "",
    hourlyPrice: hourly ? hourly.basePrice : "",
    dailyPrice: daily ? daily.basePrice : "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [numberOfFloors, setNumberOfFloors] = useState(5);
  const [isLoadingFloors, setIsLoadingFloors] = useState(true);

  useEffect(() => {
    const fetchHotelInfo = async () => {
      try {
        const hotelData = await getHotelInfo();
        setNumberOfFloors(hotelData.numberOfFloors || 5);
      } catch (err) {
        console.error("Error fetching hotel info:", err);
      } finally {
        setIsLoadingFloors(false);
      }
    };

    fetchHotelInfo();
  }, []);

  const generateFloorOptions = () => {
    const options = [];
    for (let i = 1; i <= numberOfFloors; i++) {
      const suffix = i === 1 ? "st" : i === 2 ? "nd" : i === 3 ? "rd" : "th";
      options.push(
        <option key={i} value={`${i}${suffix} floor`}>
          {i}
          {suffix} floor
        </option>,
      );
    }
    return options;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const prices = [];
      if (formData.hourlyPrice) {
        prices.push({
          priceType: "HOURLY",
          basePrice: Number(formData.hourlyPrice),
        });
      }
      if (formData.dailyPrice) {
        prices.push({
          priceType: "DAILY",
          basePrice: Number(formData.dailyPrice),
        });
      }
      const updatedRoom = {
        ...room,
        roomNumber: Number(formData.roomNumber),
        maxOccupancy: Number(formData.maxOccupancy),
        roomType: formData.roomType,
        location: formData.location,
        prices,
      };

      const result = await updateRoom(room.id, updatedRoom);
      if (onSubmit) onSubmit(result);
      onClose();
      toast.success("Room updated successfully!");
    } catch (err) {
      console.error("Error updating room:", err);

      let errorMessage = "Failed to update room!";

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const inputClass =
    "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500";

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="mb-6 text-xl font-semibold text-gray-800">Edit room</h2>

      <div className="grid grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Room number
            </label>
            <input
              type="number"
              name="roomNumber"
              value={formData.roomNumber}
              onChange={handleChange}
              placeholder="Room number"
              className={inputClass}
              required
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Room type
            </label>
            <select
              name="roomType"
              value={formData.roomType}
              onChange={handleChange}
              className={inputClass}
              required
              disabled={isSubmitting}
            >
              <option value="">Choose room type</option>
              <option value="Standard">Standard</option>
              <option value="Deluxe">Deluxe</option>
              <option value="Suite">Suite</option>
              <option value="Executive">Executive</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Max occupancy
            </label>
            <select
              name="maxOccupancy"
              value={formData.maxOccupancy}
              onChange={handleChange}
              className={inputClass}
              required
              disabled={isSubmitting}
            >
              <option value="">Choose capacity</option>
              <option value="1">1 person</option>
              <option value="2">2 person</option>
              <option value="4">4 person</option>
            </select>
          </div>
        </div>
        {/* Right Column */}
        <div className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Location
            </label>
            <select
              name="location"
              value={formData.location}
              onChange={handleChange}
              className={inputClass}
              required
              disabled={isSubmitting || isLoadingFloors}
            >
              <option value="">Select location</option>
              {isLoadingFloors ? (
                <option value="" disabled>
                  Loading floors...
                </option>
              ) : (
                generateFloorOptions()
              )}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Daily price
            </label>
            <input
              type="number"
              name="dailyPrice"
              value={formData.dailyPrice}
              onChange={handleChange}
              placeholder="Daily price"
              className={inputClass}
              min="0"
              required
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Hourly price (optional)
            </label>
            <input
              type="number"
              name="hourlyPrice"
              value={formData.hourlyPrice}
              onChange={handleChange}
              placeholder="Hourly price"
              className={inputClass}
              min="0"
              disabled={isSubmitting}
            />
          </div>
          {/* <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={inputClass}
              required
              disabled={isSubmitting}
            >
              <option value="Available">Available</option>
              <option value="Reserved">Reserved</option>
              <option value="Booked">Booked</option>
            </select>
          </div> */}
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-3 border-t pt-6">
        <Button variation="secondary" onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <SpinnerMini /> : "Save"}
        </Button>
      </div>
    </form>
  );
}

export default EditRoomForm;
