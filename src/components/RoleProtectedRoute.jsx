import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Spinner from "./Spinner";

const RoleProtectedRoute = ({
  children,
  allowedRoles,
  requireUpdate = false,
}) => {
  const { isLoggedIn, loading, hasAnyRole } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center">
          <Spinner />
          <p className="mt-4 text-gray-600">Checking permissions...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has any of the allowed roles
  if (!hasAnyRole(allowedRoles)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-gray-800">
            Access Denied
          </h1>
          <p className="mb-4 text-gray-600">
            You don't have permission to access this page.
          </p>
          <p className="text-sm text-gray-500">
            Required role: {allowedRoles.join(", ")}
          </p>
        </div>
      </div>
    );
  }

  // Check if update permission is required (for Settings)
  if (requireUpdate && !hasAnyRole(["ADMIN"])) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-gray-900">
            Read Only Access
          </h1>
          <p className="mb-4 text-gray-600">
            You can view this page but cannot make changes.
          </p>
          <p className="text-sm text-gray-500">
            Only administrators can update settings.
          </p>
        </div>
      </div>
    );
  }

  return children;
};

export default RoleProtectedRoute;
