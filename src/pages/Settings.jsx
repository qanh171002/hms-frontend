import { useState, useEffect } from "react";
import Button from "../components/Button";
import { getHotelInfo, updateHotelInfo } from "../apis/hotelApi";
import toast from "react-hot-toast";
import Spinner from "../components/Spinner";
import { useAuth } from "../hooks/useAuth";
import {
  FaBuilding,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaIdCard,
  FaSave,
  FaEdit,
  FaStackOverflow,
} from "react-icons/fa";

function Settings() {
  const { hasAnyRole } = useAuth();
  const [hotelInfo, setHotelInfo] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    taxCode: "",
    numberOfFloors: 1,
  });
  const [originalHotelInfo, setOriginalHotelInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const canUpdate = hasAnyRole(["ADMIN"]);

  useEffect(() => {
    const fetchHotelInfo = async () => {
      try {
        setIsLoading(true);
        const data = await getHotelInfo();
        setHotelInfo(data);
        setOriginalHotelInfo(data);
      } catch (err) {
        console.error("Error fetching hotel info:", err);
        toast.error("Failed to load hotel information");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHotelInfo();
  }, []);

  const handleInputChange = (field, value) => {
    setHotelInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setIsSubmitting(true);
      const payload = {
        ...hotelInfo,
        numberOfFloors: Math.max(
          1,
          Math.min(50, Number(hotelInfo.numberOfFloors) || 1),
        ),
      };
      const updated = await updateHotelInfo(payload);
      toast.success("Hotel information updated successfully!");
      setOriginalHotelInfo(updated || payload);
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating hotel info:", err);

      let errorMessage = "Failed to update hotel information!";
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

  const handleCancel = () => {
    if (originalHotelInfo) {
      setHotelInfo(originalHotelInfo);
    }
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-6">
      <div className="col-span-2 mb-6 flex flex-col justify-center">
        <h2 className="text-2xl font-bold text-gray-800">Hotel Settings</h2>
        <p className="text-base text-gray-500">
          Manage your hotel information and configuration.
        </p>
      </div>
      <div className="col-span-2 flex items-center justify-end gap-3">
        {canUpdate ? (
          !isEditing ? (
            <Button
              size="medium"
              className="flex items-center gap-2"
              onClick={() => setIsEditing(true)}
            >
              <FaEdit className="h-4 w-4" />
              Edit Settings
            </Button>
          ) : (
            <div className="flex gap-3">
              <Button
                onClick={handleCancel}
                variation="tertiary"
                size="medium"
                className="flex items-center gap-2"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                variation="primary"
                size="medium"
                className="flex items-center gap-2"
                disabled={isSubmitting}
              >
                <FaSave className="h-4 w-4" />
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          )
        ) : (
          <div className="text-sm text-gray-500">
            <span className="font-medium">Read-only access</span>
            <br />
            <span className="text-xs">
              Only administrators can update settings
            </span>
          </div>
        )}
      </div>

      <div className="col-span-4 rounded-2xl bg-white p-6 shadow-md">
        <div className="space-y-8">
          {/* Basic Information */}
          <div className="space-y-6">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
              <FaBuilding className="h-5 w-5 text-blue-500" />
              Basic Information
            </h3>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Hotel Name */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <FaBuilding className="text-gray-400" />
                  Hotel Name *
                </label>
                <input
                  type="text"
                  value={hotelInfo.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  disabled={!isEditing || !canUpdate}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100"
                  placeholder="Enter hotel name"
                />
              </div>

              {/* Address */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <FaMapMarkerAlt className="text-gray-400" />
                  Address *
                </label>
                <input
                  type="text"
                  value={hotelInfo.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  disabled={!isEditing || !canUpdate}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100"
                  placeholder="Enter hotel address"
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <FaPhone className="text-gray-400" />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={hotelInfo.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  disabled={!isEditing || !canUpdate}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100"
                  placeholder="Enter phone number"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <FaEnvelope className="text-gray-400" />
                  Email Address *
                </label>
                <input
                  type="email"
                  value={hotelInfo.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  disabled={!isEditing || !canUpdate}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100"
                  placeholder="Enter email address"
                />
              </div>

              {/* Tax Code */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <FaIdCard className="text-gray-400" />
                  Tax Code
                </label>
                <input
                  type="text"
                  value={hotelInfo.taxCode}
                  onChange={(e) => handleInputChange("taxCode", e.target.value)}
                  disabled={!isEditing || !canUpdate}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100"
                  placeholder="Enter tax code"
                />
              </div>

              {/* Number of Floors */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <FaStackOverflow className="text-gray-400" />
                  Number of Floors *
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={hotelInfo.numberOfFloors}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (v === "") {
                      handleInputChange("numberOfFloors", "");
                    } else {
                      const n = Math.max(1, Math.min(50, parseInt(v) || 1));
                      handleInputChange("numberOfFloors", n);
                    }
                  }}
                  onBlur={(e) => {
                    const v = e.target.value;
                    const n = Math.max(1, Math.min(50, Number(v) || 1));
                    handleInputChange("numberOfFloors", n);
                  }}
                  step="1"
                  inputMode="numeric"
                  disabled={!isEditing || !canUpdate}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100"
                  placeholder="Enter number of floors"
                />
                <p className="text-xs text-gray-500">
                  This determines the floor options in room creation form
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
