import { useState, useEffect } from "react";
import { updateUserProfile } from "../apis/usersApi";
import { useAuth } from "../hooks/useAuth";
import Button from "../components/Button";
import Spinner from "../components/Spinner";
import toast from "react-hot-toast";
import { HiEye, HiEyeSlash } from "react-icons/hi2";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaSave,
  FaTimes,
} from "react-icons/fa";

function Profile() {
  const { user, updateUserProfile: updateUserInContext } = useAuth();
  const [updating, setUpdating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [profileForm, setProfileForm] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  useEffect(() => {
    if (user) {
      setProfileForm({
        fullName: user.fullName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        password: "",
      });
    }
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    if (!profileForm.fullName.trim()) {
      toast.error("Please enter your full name");
      return;
    }

    try {
      setUpdating(true);
      const updateData = {
        id: user.id,
        fullName: profileForm.fullName,
        email: user.email,
        phoneNumber: profileForm.phoneNumber,
        roles: user.roles,
        password: profileForm.password || undefined,
      };

      if (!profileForm.password) {
        delete updateData.password;
      }

      await updateUserProfile(user.id, updateData);
      await updateUserInContext(updateData);

      toast.success("Update profile successfully!");
    } catch (error) {
      toast.error("Update profile failed");
      console.error("Error updating profile:", error);
    } finally {
      setUpdating(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const getRoleDisplay = (roles) => {
    return roles
      .map((role) => {
        switch (role.toLowerCase()) {
          case "admin":
            return "Admin";
          case "manager":
            return "Manager";
          case "accountant":
            return "Accountant";
          case "receptionist":
            return "Receptionist";
          default:
            return role;
        }
      })
      .join(" / ");
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Profile Settings
          </h1>
          <p className="mt-2 text-gray-600">
            Manage your account information and preferences
          </p>
        </div>
      </div>

      {/* Profile Card */}
      <div className="rounded-2xl bg-white p-8 shadow-lg">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column - Profile Info */}
          <div className="space-y-6">
            {/* Profile Header */}
            <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white">
              <div className="flex items-center space-x-4">
                {/* Avatar */}
                <div className="relative">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-white/20 bg-white/10 backdrop-blur-sm">
                    <FaUser className="h-10 w-10 text-white" />
                  </div>
                  <div className="absolute -right-1 -bottom-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-green-400">
                    <div className="h-2 w-2 rounded-full bg-white"></div>
                  </div>
                </div>

                {/* User Info */}
                <div className="min-w-0 flex-1">
                  <h2 className="truncate text-xl font-bold">
                    {user.fullName}
                  </h2>
                  <p className="text-sm font-medium text-blue-100">
                    {getRoleDisplay(user.roles)}
                  </p>
                  <p className="mt-1 truncate text-xs text-blue-200">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Account Stats */}
            <div className="space-y-4">
              <div className="rounded-xl border border-green-200 bg-green-50 p-4">
                <div className="flex items-center space-x-3">
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <div>
                    <div className="text-sm font-semibold text-green-800">
                      Account Active
                    </div>
                    <div className="text-xs text-green-600">
                      Last login: Today
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                <div className="flex items-center space-x-3">
                  <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                  <div>
                    <div className="text-sm font-semibold text-blue-800">
                      Profile Complete
                    </div>
                    <div className="text-xs text-blue-600">
                      All information updated
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800">
                Account Information
              </h3>
              <p className="text-gray-600">
                Update your personal details and security settings
              </p>
            </div>

            <form onSubmit={handleProfileUpdate} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <FaEnvelope className="h-4 w-4 text-blue-500" />
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-500 focus:outline-none"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="rounded-lg bg-gray-100 px-2 py-1 text-xs text-gray-400">
                      Read Only
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  Email address cannot be changed for security reasons
                </p>
              </div>

              {/* Full Name Field */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <FaUser className="h-4 w-4 text-blue-500" />
                  Full Name
                </label>
                <input
                  type="text"
                  value={profileForm.fullName}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, fullName: e.target.value })
                  }
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              {/* Phone Number Field */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <FaPhone className="h-4 w-4 text-blue-500" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={profileForm.phoneNumber}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      phoneNumber: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                  placeholder="Enter your phone number"
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <FaLock className="h-4 w-4 text-blue-500" />
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={profileForm.password}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        password: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 pr-12 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                    placeholder="Enter new password (optional)"
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showPassword ? (
                      <HiEyeSlash className="h-5 w-5" />
                    ) : (
                      <HiEye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  Leave blank if you don't want to change your password
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-4 pt-6">
                <Button
                  type="button"
                  variation="secondary"
                  onClick={() => {
                    setProfileForm({
                      fullName: user.fullName || "",
                      email: user.email || "",
                      phoneNumber: user.phoneNumber || "",
                      password: "",
                    });
                  }}
                  className="flex items-center gap-2"
                >
                  <FaTimes />
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={updating}
                  className="flex items-center gap-2"
                >
                  <FaSave />
                  {updating ? "Updating..." : "Update Profile"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
