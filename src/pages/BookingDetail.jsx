import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaArrowLeft } from "react-icons/fa";
import {
  HiOutlineCalendar,
  HiOutlineChatBubbleLeftRight,
  HiOutlineHome,
  HiOutlineUser,
} from "react-icons/hi2";
import { useNavigate, useParams } from "react-router-dom";
import {
  deleteBooking,
  getBookingById,
  updateBooking,
} from "../apis/bookingsApi";
import { getCountries } from "../apis/countriesApi";
import { createInvoice, getInvoices } from "../apis/invoicesApi";
import { updateRoom } from "../apis/roomsApi";
import Button from "../components/Button";
import ConfirmModal from "../components/ConfirmModal";
import InvoiceModal from "../components/InvoiceModal";
import Spinner from "../components/Spinner";
import SpinnerMini from "../components/SpinnerMini";

const statusStyles = {
  "CHECKED IN": "bg-green-100 text-green-600",
  "CHECKED OUT": "bg-gray-100 text-gray-600",
  UNCONFIRMED: "bg-blue-100 text-blue-600",
  CANCELLED: "bg-red-100 text-red-600",
};

function BookingDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [countries, setCountries] = useState([]);
  const [flagLoaded, setFlagLoaded] = useState(false);
  const [invoiceId, setInvoiceId] = useState(null);
  const [isCreatingInvoice, setIsCreatingInvoice] = useState(false);
  const [hasSearchedForInvoice, setHasSearchedForInvoice] = useState(false);
  const [invoiceNotFound, setInvoiceNotFound] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

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

  useEffect(() => {
    const loadCountries = async () => {
      try {
        const list = await getCountries();
        setCountries(list);
      } catch (e) {
        console.log(e);
      }
    };
    loadCountries();
  }, []);

  useEffect(() => {
    setFlagLoaded(false);
  }, [booking?.guestNationality, countries]);

  useEffect(() => {
    setHasSearchedForInvoice(false);
    setInvoiceId(null);
    setInvoiceNotFound(false);
  }, [booking?.id]);

  const formatDateTime = (dateString) => {
    if (!dateString) return "_";
    try {
      const date = new Date(dateString);
      return date.toLocaleString("en-US");
    } catch {
      return "Invalid Date";
    }
  };

  const fetchInvoiceByBooking = useCallback(async () => {
    if (!booking?.id) return;
    try {
      const data = await getInvoices();
      const list = data?.content || [];
      const found = list.find((inv) => inv.bookingId === booking.id);
      if (found?.id) {
        setInvoiceId(found.id);
        setInvoiceNotFound(false);
      } else {
        setInvoiceId(null);
        setInvoiceNotFound(true);
      }
    } catch (e) {
      console.log(e);
      setInvoiceId(null);
      setInvoiceNotFound(true);
    }
  }, [booking?.id]);

  useEffect(() => {
    if (
      booking?.status === "CHECKED OUT" &&
      !invoiceId &&
      !isCheckingOut &&
      !isCreatingInvoice &&
      !hasSearchedForInvoice
    ) {
      setHasSearchedForInvoice(true);
      fetchInvoiceByBooking();
    }
  }, [
    booking?.status,
    booking?.id,
    invoiceId,
    isCheckingOut,
    isCreatingInvoice,
    hasSearchedForInvoice,
    fetchInvoiceByBooking,
  ]);

  const formatWeekdayDate = (dateString) => {
    if (!dateString) return "_";
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
    if (!dateString) return "_";
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

  const calculateDuration = () => {
    if (!booking?.checkInDate || !booking?.checkOutDate) return 0;
    try {
      const checkIn = new Date(booking.checkInDate);
      const checkOut = new Date(booking.checkOutDate);
      const diffTime = Math.abs(checkOut - checkIn);

      if (booking.bookingType?.toUpperCase() === "HOURLY") {
        const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
        return diffHours;
      } else {
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
      }
    } catch {
      return 0;
    }
  };

  const normalize = (s) => {
    try {
      return String(s || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .replace(/[^a-z\s]/g, "")
        .replace(/\s+/g, " ")
        .trim();
    } catch {
      return String(s || "")
        .toLowerCase()
        .trim();
    }
  };

  const handleCheckIn = async () => {
    if (!booking) return;

    try {
      setIsCheckingIn(true);
      const now = new Date().toISOString();
      const updatedBooking = {
        ...booking,
        status: "CHECKED IN",
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
      console.error("Error checking in:", err);

      let errorMessage = "Failed to check in!";

      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.message) {
        errorMessage = err.message;
      }

      toast.error(errorMessage);
    } finally {
      setIsCheckingIn(false);
    }
  };

  const handleCheckOut = async () => {
    if (!booking) return;

    try {
      setIsCheckingOut(true);
      const now = new Date().toISOString();
      const updatedBooking = {
        ...booking,
        status: "CHECKED OUT",
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
        status: "PENDING",
        issuedDate: now,
        dueDate: "",
        paymentMethod: "",
        notes: "",
      };

      try {
        setIsCreatingInvoice(true);
        setHasSearchedForInvoice(true);
        const createdInvoice = await createInvoice(invoiceData);
        if (createdInvoice?.id) {
          setInvoiceId(createdInvoice.id);
          toast.success(
            `Check-out successful! Invoice #${createdInvoice.id} created!`,
          );
        } else {
          toast.error("Invoice created but no ID returned");
        }
      } catch (invoiceError) {
        console.error("Error creating invoice:", invoiceError);
        toast.error("Check-out successful but failed to create invoice");
      } finally {
        setIsCreatingInvoice(false);
      }
    } catch (err) {
      console.error("Error checking out:", err);

      let errorMessage = "Failed to check out!";

      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.message) {
        errorMessage = err.message;
      }

      toast.error(errorMessage);
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!booking) return;
    setIsCancelOpen(true);
  };

  const handleDeleteBooking = async () => {
    if (!booking) return;
    setIsDeleteOpen(true);
  };

  const confirmCancelBooking = async (reason) => {
    try {
      setIsCancelling(true);
      const updatedBooking = {
        ...booking,
        status: "CANCELLED",
        cancelReason: String(reason || "").trim(),
      };

      await updateBooking(booking.id, updatedBooking);
      setBooking(updatedBooking);

      if (booking.roomId) {
        await updateRoom(booking.roomId, { status: "Available" });
      }

      toast.success("Booking cancelled successfully.");
    } catch (err) {
      console.error("Error cancelling booking:", err);

      let errorMessage = "Failed to cancel booking!";

      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.message) {
        errorMessage = err.message;
      }

      toast.error(errorMessage);
    } finally {
      setIsCancelling(false);
      setIsCancelOpen(false);
    }
  };

  const confirmDeleteBooking = async () => {
    try {
      setIsDeleting(true);
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
      console.error("Error deleting booking:", err);

      let errorMessage = "Failed to delete booking!";

      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.message) {
        errorMessage = err.message;
      }

      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
      setIsDeleteOpen(false);
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

  const duration = calculateDuration();
  const relative = booking.checkInDate
    ? formatRelative(booking.checkInDate, new Date())
    : "";

  return (
    <div className="w-full py-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-gray-800">
            Booking #{booking.id}
          </h1>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${
              statusStyles[booking.status] || statusStyles.UNCONFIRMED
            }`}
          >
            {booking.status}
          </span>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-lg font-semibold text-blue-600 hover:text-blue-800"
        >
          <FaArrowLeft />
          Back
        </button>
      </div>

      {/* Card */}
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow">
        {/* Purple bar */}
        <div className="flex flex-col justify-between gap-3 bg-blue-500 px-14 py-6 text-blue-50 md:flex-row md:items-center">
          <div className="flex items-center gap-2">
            <HiOutlineHome className="text-3xl" />
            <span className="text-lg font-semibold">
              {duration}{" "}
              {booking.bookingType?.toUpperCase() === "HOURLY"
                ? "hours"
                : "nights"}{" "}
              in Cabin {booking.roomNumber ?? "_"}
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
        <div className="space-y-6 px-14 py-12">
          {/* Guest line */}
          <div className="flex items-center gap-3 text-gray-800">
            {(() => {
              const country = countries.find(
                (c) =>
                  normalize(c.name) === normalize(booking.guestNationality),
              );
              const flagUrl = country?.flagPng || country?.flagSvg;
              return flagUrl ? (
                <>
                  {!flagLoaded && <span></span>}
                  <img
                    src={flagUrl}
                    alt={booking.guestNationality}
                    onLoad={() => setFlagLoaded(true)}
                    className={`${flagLoaded ? "inline-block" : "hidden"} h-4 w-6 rounded border border-gray-200 object-cover`}
                  />
                </>
              ) : (
                <span className="grid h-6 w-6 place-items-center rounded-full bg-red-100 text-xs text-red-500">
                  ●
                </span>
              );
            })()}
            <span className="text-lg font-semibold">
              {booking.guestFullName}
            </span>
            <span className="mx-2 text-lg text-gray-500">•</span>
            <span className="text-lg font-medium text-gray-500">
              {booking.guestNationality || "—"}
            </span>
            {booking.guestIdNumber && (
              <>
                <span className="mx-2 text-lg text-gray-500">•</span>
                <span className="text-lg font-medium text-gray-500">
                  National ID {booking.guestIdNumber}
                </span>
              </>
            )}
          </div>

          {/* Room number */}
          <div className="flex items-center gap-3 text-gray-800">
            <HiOutlineHome className="text-xl text-blue-500" />
            <span className="text-lg font-medium">Room number</span>
            <span className="text-lg text-gray-700">
              {booking.roomNumber ?? "—"}
            </span>
          </div>

          {/* Booking type */}
          <div className="flex items-center gap-3 text-gray-800">
            <HiOutlineCalendar className="text-xl text-blue-500" />
            <span className="text-lg font-medium">Booking type</span>
            <span className="text-lg text-gray-700">
              {booking.bookingType?.charAt(0).toUpperCase() +
                booking.bookingType?.slice(1).toLowerCase()}
            </span>
          </div>

          {/* Number of guests */}
          <div className="flex items-center gap-3 text-gray-800">
            <HiOutlineUser className="text-xl text-blue-500" />
            <span className="text-lg font-medium">Number of guests</span>
            <span className="text-lg text-gray-700">
              {booking.numberOfGuests}
            </span>
          </div>

          {/* Notes (optional) */}
          {booking.notes && booking.notes.trim() !== "" && (
            <div className="flex items-center gap-3 text-gray-800">
              <HiOutlineChatBubbleLeftRight className="text-xl text-blue-500" />
              <span className="text-lg font-medium">Notes</span>
              <span className="text-lg text-gray-700">{booking.notes}</span>
            </div>
          )}

          {/* Cancel reason (optional) */}
          {booking.cancelReason && booking.cancelReason.trim() !== "" && (
            <div className="flex items-center gap-3 text-gray-800">
              <HiOutlineChatBubbleLeftRight className="text-xl text-blue-500" />
              <span className="text-lg font-medium">Cancel reason</span>
              <span className="text-lg text-gray-700">
                {booking.cancelReason}
              </span>
            </div>
          )}

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
        {booking.status === "UNCONFIRMED" && (
          <>
            <Button
              size="medium"
              onClick={handleCheckIn}
              disabled={isCheckingIn || isCancelling || isDeleting}
              className="flex items-center gap-2"
            >
              {isCheckingIn ? <SpinnerMini /> : "Check in"}
            </Button>
            <Button
              variation="danger"
              size="medium"
              onClick={handleCancelBooking}
              disabled={isCheckingIn || isCancelling || isDeleting}
              className="flex items-center gap-2"
            >
              {isCancelling ? <SpinnerMini /> : "Cancel booking"}
            </Button>
          </>
        )}

        {booking.status === "CHECKED IN" && (
          <Button
            size="medium"
            onClick={handleCheckOut}
            disabled={isCheckingOut || isCancelling || isDeleting}
            className="flex items-center gap-2"
          >
            {isCheckingOut ? <SpinnerMini /> : "Check out"}
          </Button>
        )}

        {booking.status === "CHECKED OUT" && !invoiceNotFound && (
          <Button
            size="medium"
            onClick={() => setIsInvoiceModalOpen(true)}
            disabled={!invoiceId || isCheckingOut || isDeleting}
            className="flex items-center gap-2"
          >
            {invoiceId ? (
              "View invoice"
            ) : isCreatingInvoice ? (
              <SpinnerMini />
            ) : (
              <SpinnerMini />
            )}
          </Button>
        )}
        <Button
          variation="danger"
          size="medium"
          onClick={handleDeleteBooking}
          disabled={isCheckingIn || isCheckingOut || isCancelling || isDeleting}
          className="flex items-center gap-2"
        >
          {isDeleting ? <SpinnerMini /> : "Delete booking"}
        </Button>

        <Button
          variation="secondary"
          size="medium"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2"
        >
          Back
        </Button>
      </div>
      <ConfirmModal
        isOpen={isCancelOpen}
        onClose={() => setIsCancelOpen(false)}
        onConfirm={confirmCancelBooking}
        title="Cancel booking"
        message="Are you sure you want to cancel this booking? Please enter the reason for cancellation."
        confirmLabel="Cancel booking"
        cancelLabel="Close"
        variation="danger"
        requiresInput
        inputLabel="Cancel reason"
        inputPlaceholder="Enter the reason for cancellation"
        validateInput={(v) => String(v).trim().length > 0}
        isConfirming={isCancelling}
        isCancelling={isCancelling}
      />
      <ConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDeleteBooking}
        title="Delete booking"
        message="Are you sure you want to delete this booking? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variation="danger"
        isConfirming={isDeleting}
        isCancelling={isDeleting}
      />

      <InvoiceModal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        invoiceId={invoiceId}
      />
    </div>
  );
}

export default BookingDetail;
