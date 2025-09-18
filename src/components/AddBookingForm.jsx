import { useState } from "react";
import toast from "react-hot-toast";
import Button from "./Button";
import SpinnerMini from "./SpinnerMini";
import { updateRoom } from "../apis/roomsApi";
import { useEffect } from "react";
import { getCountries } from "../apis/countriesApi";

function AddBookingForm({ onSubmit, onClose, isSubmitting }) {
  const [formData, setFormData] = useState({
    guestFullName: "",
    guestIdNumber: "",
    guestNationality: "",
    roomNumber: "",
    checkInDate: "",
    checkOutDate: "",
    actualCheckInTime: "",
    actualCheckOutTime: "",
    bookingType: "Hourly",
    status: "Unconfirmed",
    numberOfGuests: "1",
    notes: "",
    cancelReason: "",
  });

  const [countries, setCountries] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const list = await getCountries();
        setCountries(list);
      } catch (e) {
        console.log(e);
      }
    };
    load();
  }, []);

  const inputClass =
    "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500";

  const isHourly = formData.bookingType === "Hourly";

  const toISODateTime = (v) => (v ? new Date(v).toISOString() : "");
  const toISOStartOfDay = (v) =>
    v ? new Date(`${v}T00:00:00`).toISOString() : "";
  const toISOEndOfDay = (v) =>
    v ? new Date(`${v}T23:59:59`).toISOString() : "";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.guestFullName.trim())
      return toast.error("Guest name is required!");
    if (!formData.guestIdNumber.trim())
      return toast.error("ID number is required!");
    if (!formData.roomNumber) return toast.error("Room number is required!");
    if (!formData.checkInDate) return toast.error("Check-in date is required!");
    if (!formData.checkOutDate)
      return toast.error("Check-out date is required!");
    if (!formData.bookingType) return toast.error("Booking type is required!");
    if (!formData.status) return toast.error("Status is required!");
    if (!formData.numberOfGuests)
      return toast.error("Number of guests is required!");

    const bookingData = {
      guestFullName: formData.guestFullName.trim(),
      guestIdNumber: formData.guestIdNumber.trim(),
      guestNationality: formData.guestNationality.trim(),
      roomNumber: parseInt(formData.roomNumber),
      checkInDate: isHourly
        ? toISODateTime(formData.checkInDate)
        : toISOStartOfDay(formData.checkInDate),
      checkOutDate: isHourly
        ? toISODateTime(formData.checkOutDate)
        : toISOEndOfDay(formData.checkOutDate),
      actualCheckInTime:
        isHourly && formData.actualCheckInTime
          ? toISODateTime(formData.actualCheckInTime)
          : "",
      actualCheckOutTime:
        isHourly && formData.actualCheckOutTime
          ? toISODateTime(formData.actualCheckOutTime)
          : "",
      bookingType: formData.bookingType.toUpperCase(),
      status: formData.status,
      numberOfGuests: parseInt(formData.numberOfGuests),
      notes: formData.notes.trim(),
      cancelReason: formData.cancelReason.trim(),
    };

    try {
      let bookingWithFlag = bookingData;

      const selectedByName = countries.find(
        (c) => c.name === bookingData.guestNationality,
      );
      if (selectedByName) {
        bookingWithFlag = {
          ...bookingData,
          guestFlag: selectedByName.flagPng || selectedByName.flagSvg,
        };
      }

      const createdBooking = await onSubmit(bookingWithFlag);

      if (createdBooking && createdBooking.roomId) {
        await updateRoom(createdBooking.roomId, { status: "Reserved" });
        toast.success("Room status updated to Reserved");
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      toast.error("Failed to create booking");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="mb-6 text-xl font-semibold text-gray-800">
        Add New Booking
      </h2>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Guest Full Name *
            </label>
            <input
              type="text"
              name="guestFullName"
              value={formData.guestFullName}
              onChange={handleChange}
              required
              className={inputClass}
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              ID Number *
            </label>
            <input
              type="text"
              name="guestIdNumber"
              value={formData.guestIdNumber}
              onChange={handleChange}
              required
              className={inputClass}
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Nationality
            </label>
            <select
              name="guestNationality"
              value={formData.guestNationality}
              onChange={handleChange}
              className={inputClass}
              disabled={isSubmitting}
            >
              <option value="">Select country</option>
              {countries.map((c) => (
                <option key={c.code} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Room Number *
            </label>
            <input
              type="number"
              name="roomNumber"
              value={formData.roomNumber}
              onChange={handleChange}
              required
              min="1"
              className={inputClass}
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label
              className="mb-2 block overflow-hidden text-sm font-medium text-ellipsis whitespace-nowrap text-gray-700"
              title="Booking Type"
            >
              Booking Type *
            </label>
            <select
              name="bookingType"
              value={formData.bookingType}
              onChange={handleChange}
              required
              className={inputClass}
              disabled={isSubmitting}
            >
              <option value="Hourly">Hourly</option>
              <option value="Daily">Daily</option>
            </select>
          </div>

          <div>
            <label
              className="mb-2 block overflow-hidden text-sm font-medium text-ellipsis whitespace-nowrap text-gray-700"
              title="Status"
            >
              Status *
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              className={inputClass}
              disabled={isSubmitting}
            >
              <option value="Unconfirmed">Unconfirmed</option>
              <option value="Checked in">Checked in</option>
              <option value="Checked out">Checked out</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label
              className="mb-2 block overflow-hidden text-sm font-medium text-ellipsis whitespace-nowrap text-gray-700"
              title="Number of Guests"
            >
              Number of Guests *
            </label>
            <input
              type="number"
              name="numberOfGuests"
              value={formData.numberOfGuests}
              onChange={handleChange}
              min="1"
              required
              className={inputClass}
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              {isHourly ? "Check-in DateTime *" : "Check-in Date *"}
            </label>
            <input
              type={isHourly ? "datetime-local" : "date"}
              name="checkInDate"
              value={formData.checkInDate}
              onChange={handleChange}
              required
              className={inputClass}
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              {isHourly ? "Check-out DateTime *" : "Check-out Date *"}
            </label>
            <input
              type={isHourly ? "datetime-local" : "date"}
              name="checkOutDate"
              value={formData.checkOutDate}
              onChange={handleChange}
              required
              className={inputClass}
              disabled={isSubmitting}
            />
          </div>
        </div>

        {isHourly && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Actual Check-in Time
              </label>
              <input
                type="datetime-local"
                name="actualCheckInTime"
                value={formData.actualCheckInTime}
                onChange={handleChange}
                className={inputClass}
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Actual Check-out Time
              </label>
              <input
                type="datetime-local"
                name="actualCheckOutTime"
                value={formData.actualCheckOutTime}
                onChange={handleChange}
                className={inputClass}
                disabled={isSubmitting}
              />
            </div>
          </div>
        )}

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
            className={inputClass}
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Cancel Reason
          </label>
          <textarea
            name="cancelReason"
            value={formData.cancelReason}
            onChange={handleChange}
            rows="2"
            className={inputClass}
            disabled={isSubmitting}
          />
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-3 border-t pt-6">
        <Button variation="secondary" onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <SpinnerMini /> : "Add booking"}
        </Button>
      </div>
    </form>
  );
}

export default AddBookingForm;
