import {
  HiOutlineArrowLeft,
  HiOutlineUser,
  HiOutlineHome,
  HiOutlineCalendar,
  HiOutlineCurrencyDollar,
  HiOutlineChatBubbleLeftRight,
} from "react-icons/hi2";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  getBookingById,
  updateBooking,
  deleteBooking,
} from "../apis/bookingsApi";
import { createInvoice } from "../apis/invoicesApi";
import { updateRoom } from "../apis/roomsApi";
import Spinner from "../components/Spinner";
import toast from "react-hot-toast";
import Button from "../components/Button";

const statusStyles = {
  "Checked in": "bg-green-100 text-green-600",
  "Checked out": "bg-gray-100 text-gray-600",
  Unconfirmed: "bg-blue-100 text-blue-600",
  Cancelled: "bg-red-100 text-red-600",
};

function BookingDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        setIsLoading(true);

        if (!id) {
          toast.error("No booking ID provided!");
          setIsLoading(false);
          return;
        }

        const bookingData = await getBookingById(id);
        setBooking(bookingData);
      } catch (err) {
        console.error("Error fetching booking:", err);
        toast.error("Failed to fetch booking details!");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookingData();
  }, [id]);

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleString("en-US");
    } catch {
      return "Invalid Date";
    }
  };

  const formatWeekdayDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Invalid Date";
    }
  };

  const formatWeekdayDateTime = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Invalid Date";
    }
  };

  const formatRelative = (from, to) => {
    try {
      const a = new Date(from);
      const b = new Date(to);

      if (a.toDateString() === b.toDateString()) return "today";

      const ms = b - a;
      const absDays = Math.abs(Math.round(ms / (1000 * 60 * 60 * 24)));
      const isFuture = ms < 0;

      const fmt = (v, unit) =>
        isFuture
          ? `in ${v} ${unit}${v > 1 ? "s" : ""}`
          : `${v} ${unit}${v > 1 ? "s" : ""} ago`;

      if (absDays >= 60) {
        const months = Math.floor(absDays / 30);
        return fmt(months, "month");
      }
      if (absDays >= 14) {
        const weeks = Math.floor(absDays / 7);
        return fmt(weeks, "week");
      }
      return fmt(absDays, "day");
    } catch {
      return "";
    }
  };

  const calculateNights = () => {
    if (!booking?.checkInDate || !booking?.checkOutDate) return 0;
    try {
      const checkIn = new Date(booking.checkInDate);
      const checkOut = new Date(booking.checkOutDate);
      const diffTime = Math.abs(checkOut - checkIn);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    } catch {
      return 0;
    }
  };

  const handleCheckIn = async () => {
    if (!booking) return;

    try {
      setIsUpdating(true);
      const now = new Date().toISOString();
      const updatedBooking = {
        ...booking,
        status: "Checked in",
        actualCheckInTime: now,
      };

      await updateBooking(booking.id, updatedBooking);
      setBooking(updatedBooking);

      const roomId = booking.roomId;
      if (roomId) {
        await updateRoom(roomId, { status: "Booked" });
        toast.success("Check-in successful! Room status updated to Booked");
      } else {
        toast.success("Check-in successful!");
      }
    } catch (err) {
      toast.error("Failed to check in!");
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCheckOut = async () => {
    if (!booking) return;

    try {
      setIsUpdating(true);
      const now = new Date().toISOString();
      const updatedBooking = {
        ...booking,
        status: "Checked out",
        actualCheckOutTime: now,
      };

      await updateBooking(booking.id, updatedBooking);
      setBooking(updatedBooking);

      const roomId = booking.roomId;
      if (roomId) {
        await updateRoom(roomId, { status: "Available" });
      }

      const invoiceData = {
        bookingId: booking.id,
        amount: 0,
        paidAmount: 0,
        status: "Pending",
        issuedDate: now,
        dueDate: "",
        paymentMethod: "",
        notes: "",
      };
      const createdInvoice = await createInvoice(invoiceData);

      if (roomId) {
        toast.success(
          `Check-out successful! Invoice #${createdInvoice.id} created!`,
        );
      } else {
        toast.success(
          `Check-out successful! Invoice #${createdInvoice.id} created!`,
        );
      }
    } catch (err) {
      toast.error("Failed to check out!");
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteBooking = async () => {
    if (!booking) return;

    if (
      window.confirm(
        "Are you sure you want to delete this booking? This action cannot be undone.",
      )
    ) {
      try {
        setIsUpdating(true);
        await deleteBooking(booking.id);

        const roomId = booking.roomId;
        if (roomId) {
          await updateRoom(roomId, { status: "Available" });
          toast.success(
            "Booking deleted successfully! Room status updated to Available",
          );
        } else {
          toast.success("Booking deleted successfully!");
        }

        navigate("/bookings");
      } catch (err) {
        toast.error("Failed to delete booking!");
        console.error(err);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="flex h-40 items-center justify-center">
        <div className="text-lg text-gray-600">Booking not found</div>
      </div>
    );
  }

  const nights = calculateNights();
  const relative = booking.checkInDate
    ? formatRelative(booking.checkInDate, new Date())
    : "";

  return (
    <div className="w-full py-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Booking <span className="text-blue-500">#{booking.id}</span>
          </h1>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${
              statusStyles[booking.status] || statusStyles.Unconfirmed
            }`}
          >
            {booking.status}
          </span>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-lg font-semibold text-blue-600 hover:text-blue-800"
        >
          <HiOutlineArrowLeft />
          Back
        </button>
      </div>

      {/* Card */}
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow">
        {/* Purple bar */}
        <div className="flex flex-col justify-between gap-3 bg-blue-500 p-6 text-blue-100 md:flex-row md:items-center">
          <div className="flex items-center gap-2">
            <HiOutlineHome className="text-3xl" />
            <span className="text-lg font-semibold">
              {nights}{" "}
              {booking.bookingType?.toUpperCase() === "HOURLY"
                ? "hours"
                : "nights"}{" "}
              in Cabin {booking.roomNumber ?? "N/A"}
            </span>
          </div>

          <div className="text-lg font-medium">
            {booking.checkInDate && booking.checkOutDate ? (
              <>
                {booking.bookingType?.toUpperCase() === "HOURLY"
                  ? `${formatWeekdayDateTime(
                      booking.checkInDate,
                    )} (${relative}) — ${formatWeekdayDateTime(
                      booking.checkOutDate,
                    )}`
                  : `${formatWeekdayDate(
                      booking.checkInDate,
                    )} (${relative}) — ${formatWeekdayDate(
                      booking.checkOutDate,
                    )}`}
              </>
            ) : (
              "-"
            )}
          </div>
        </div>

        {/* Body list */}
        <div className="space-y-6 px-6 py-5">
          {/* Guest line */}
          <div className="flex items-center gap-3 text-gray-800">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-red-100 text-xs text-red-500">
              ●
            </span>
            <span className="font-semibold">{booking.guestFullName}</span>
            <span className="mx-2 text-gray-300">•</span>
            <span className="text-gray-700">
              {booking.guestNationality || "—"}
            </span>
            {booking.guestIdNumber && (
              <>
                <span className="mx-2 text-gray-300">•</span>
                <span className="text-gray-700">
                  National ID {booking.guestIdNumber}
                </span>
              </>
            )}
          </div>

          {/* Room number */}
          <div className="flex items-center gap-3 text-gray-800">
            <HiOutlineHome className="text-xl text-blue-500" />
            <span className="font-medium">Room number</span>
            <span className="text-gray-700">{booking.roomNumber ?? "—"}</span>
          </div>

          {/* Booking type */}
          <div className="flex items-center gap-3 text-gray-800">
            <HiOutlineCalendar className="text-xl text-blue-500" />
            <span className="font-medium">Booking type</span>
            <span className="text-gray-700">
              {booking.bookingType?.charAt(0).toUpperCase() +
                booking.bookingType?.slice(1).toLowerCase()}
            </span>
          </div>

          {/* Number of guests */}
          <div className="flex items-center gap-3 text-gray-800">
            <HiOutlineUser className="text-xl text-blue-500" />
            <span className="font-medium">Number of guests</span>
            <span className="text-gray-700">{booking.numberOfGuests}</span>
          </div>

          {/* Notes (optional) */}
          {booking.notes && booking.notes.trim() !== "" && (
            <div className="flex items-center gap-3 text-gray-800">
              <HiOutlineChatBubbleLeftRight className="text-xl text-blue-500" />
              <span className="font-medium">Notes</span>
              <span className="text-gray-700">{booking.notes}</span>
            </div>
          )}

          {/* Cancel reason (optional) */}
          {booking.cancelReason && booking.cancelReason.trim() !== "" && (
            <div className="flex items-center gap-3 text-gray-800">
              <HiOutlineChatBubbleLeftRight className="text-xl text-blue-500" />
              <span className="font-medium">Cancel reason</span>
              <span className="text-gray-700">{booking.cancelReason}</span>
            </div>
          )}

          {/* Total price banner */}
          <div className="mt-4">
            <div className="flex items-center justify-between rounded-lg border border-yellow-100 bg-yellow-50 px-5 py-4">
              <div className="flex items-center gap-2 text-yellow-800">
                <HiOutlineCurrencyDollar className="text-2xl" />
                <span className="font-semibold">Total price</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold text-yellow-900">
                  $0.00
                </span>
                <span className="rounded-full border border-yellow-200 bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-800">
                  WILL PAY AT PROPERTY
                </span>
              </div>
            </div>
          </div>

          {/* Footer booked time */}
          {booking.createdAt && (
            <div className="pt-2 text-right text-xs text-gray-500">
              Booked {formatDateTime(booking.createdAt)}
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 flex flex-wrap justify-end gap-4">
        {booking.status === "Unconfirmed" && (
          <Button size="medium" onClick={handleCheckIn} disabled={isUpdating}>
            {isUpdating ? "Processing..." : "Check in"}
          </Button>
        )}

        {booking.status === "Checked in" && (
          <Button size="medium" onClick={handleCheckOut} disabled={isUpdating}>
            {isUpdating ? "Processing..." : "Check out"}
          </Button>
        )}

        <Button
          variation="danger"
          size="medium"
          onClick={handleDeleteBooking}
          disabled={isUpdating}
        >
          {isUpdating ? "Processing..." : "Delete booking"}
        </Button>

        <Button
          variation="secondary"
          size="medium"
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
      </div>
    </div>
  );
}

export default BookingDetail;
