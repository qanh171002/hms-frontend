import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Spinner from "./Spinner";

const SmartRedirect = () => {
  const { hasAnyRole, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center">
          <Spinner />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (hasAnyRole(["ADMIN", "MANAGER"])) {
    return <Navigate to="/dashboard" replace />;
  } else if (hasAnyRole(["RECEPTIONIST"])) {
    return <Navigate to="/rooms" replace />;
  } else if (hasAnyRole(["ACCOUNTANT"])) {
    return <Navigate to="/invoices" replace />;
  } else {
    return <Navigate to="/profile" replace />;
  }
};

export default SmartRedirect;
