import React, { useState } from "react";
import Button from "./Button";
import { updateRoom } from "../apis/roomsApi";
import toast from "react-hot-toast";
import SpinnerMini from "./SpinnerMini";

function EditRoomForm({ room, onSubmit, onClose }) {
  const hourly = room.prices?.find((p) => p.priceType === "HOURLY");
  const daily = room.prices?.find((p) => p.priceType === "DAILY");
  const [formData, setFormData] = useState({
    roomNumber: room.roomNumber || "",
    maxOccupancy: room.maxOccupancy || "",
    roomType: room.roomType || "",
    // status: room.status || "Available",
    location: room.location || "",
    hourlyPrice: hourly ? hourly.basePrice : "",
    dailyPrice: daily ? daily.basePrice : "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        // status: formData.status,
        location: formData.location,
        prices,
      };

      const result = await updateRoom(room.id, updatedRoom);
      if (onSubmit) onSubmit(result);
      onClose();
      toast.success("Room updated successfully!");
    } catch (err) {
      toast.error("Failed to update room!");
      console.log(err);
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
              disabled={isSubmitting}
            >
              <option value="">Select location</option>
              <option value="1st floor">1st floor</option>
              <option value="2nd floor">2nd floor</option>
              <option value="3rd floor">3rd floor</option>
              <option value="4th floor">4th floor</option>
              <option value="5th floor">5th floor</option>
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
