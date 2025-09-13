import { useState, useEffect } from "react";
import { updateUserProfile } from "../apis/usersApi";
import { useAuth } from "../contexts/AuthContext";
import Button from "../components/Button";
import Spinner from "../components/Spinner";
import toast from "react-hot-toast";
import { HiEye, HiEyeSlash } from "react-icons/hi2";

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
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Profile Header Card */}
      <div className="relative mb-8 overflow-hidden rounded-lg bg-blue-500 shadow-lg">
        <div className="relative p-8">
          <div className="flex items-end">
            {/* Avatar */}
            <div className="relative">
              <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-white shadow-lg">
                <svg
                  className="h-12 w-12 text-blue-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>

            {/* User Info */}
            <div className="ml-6 text-white">
              <h1 className="mb-1 text-3xl font-bold">{user.fullName}</h1>
              <p className="text-lg text-blue-200">
                {getRoleDisplay(user.roles)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8 rounded-lg bg-white p-8 shadow-lg">
        <h2 className="mb-8 text-2xl font-bold text-gray-600">
          Update user data
        </h2>

        <form onSubmit={handleProfileUpdate} className="space-y-6">
          <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-3">
            <label className="font-medium text-gray-600">Email address</label>
            <div className="md:col-span-2">
              <input
                type="email"
                value={user.email}
                disabled
                className="w-1/2 cursor-not-allowed rounded-md border border-gray-300 bg-gray-200 px-3 py-2 text-gray-500"
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                Email cannot be changed
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-3">
            <label className="font-medium text-gray-600">Full name</label>
            <div className="md:col-span-2">
              <input
                type="text"
                value={profileForm.fullName}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, fullName: e.target.value })
                }
                className="w-1/2 rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-3">
            <label className="font-medium text-gray-600">Phone number</label>
            <div className="md:col-span-2">
              <input
                type="tel"
                value={profileForm.phoneNumber}
                onChange={(e) =>
                  setProfileForm({
                    ...profileForm,
                    phoneNumber: e.target.value,
                  })
                }
                className="w-1/2 rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-3">
            <label className="font-medium text-gray-600">
              New password (leave blank if you don't want to change)
            </label>
            <div className="md:col-span-2">
              <div className="relative w-1/2">
                <input
                  type={showPassword ? "text" : "password"}
                  value={profileForm.password}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, password: e.target.value })
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 pr-10 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Enter new password..."
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? (
                    <HiEyeSlash className="h-5 w-5" />
                  ) : (
                    <HiEye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6">
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
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updating}>
              {updating ? "Updating..." : "Update account"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Profile;
