import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Rooms from "./pages/Rooms";
import Bookings from "./pages/Bookings";
import Users from "./pages/Users";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Assets from "./pages/Assets";
import Invoices from "./pages/Invoices";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./contexts/AuthContext";
import { NotificationProvider } from "./contexts/NotificationContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleProtectedRoute from "./components/RoleProtectedRoute";
import SmartRedirect from "./components/SmartRedirect";
import RoomDetail from "./pages/RoomDetail";
import BookingDetail from "./pages/BookingDetail";
import InvoiceDetail from "./pages/InvoiceDetail";
import Promotions from "./pages/Promotions";

import { useState } from "react";

function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="flex flex-1 flex-col overflow-auto bg-gray-50">
        <Header onToggleSidebar={() => setIsSidebarOpen((v) => !v)} />
        <main className="no-scrollbar overflow-scroll p-1 md:p-3 lg:p-4">
          <div className="max-w-10xl mx-auto flex flex-col gap-6 px-4 py-6 md:gap-8 md:px-10 md:py-8 lg:px-28">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <>
      <Toaster />
      <BrowserRouter>
        <AuthProvider>
          <NotificationProvider>
            <Routes>
              <Route
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<SmartRedirect />} />

                {/* Dashboard - Admin, Manager */}
                <Route
                  path="/dashboard"
                  element={
                    <RoleProtectedRoute
                      allowedRoles={["ADMIN", "MANAGER", "ACCOUNTANT"]}
                    >
                      <Dashboard />
                    </RoleProtectedRoute>
                  }
                />

                {/* Rooms - Admin, Manager, Receptionist */}
                <Route
                  path="/rooms"
                  element={
                    <RoleProtectedRoute
                      allowedRoles={["ADMIN", "MANAGER", "RECEPTIONIST"]}
                    >
                      <Rooms />
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="/rooms/:id"
                  element={
                    <RoleProtectedRoute
                      allowedRoles={["ADMIN", "MANAGER", "RECEPTIONIST"]}
                    >
                      <RoomDetail />
                    </RoleProtectedRoute>
                  }
                />

                {/* Bookings - Admin, Receptionist */}
                <Route
                  path="/bookings"
                  element={
                    <RoleProtectedRoute
                      allowedRoles={["ADMIN", "RECEPTIONIST"]}
                    >
                      <Bookings />
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="/bookings/:id"
                  element={
                    <RoleProtectedRoute
                      allowedRoles={["ADMIN", "RECEPTIONIST"]}
                    >
                      <BookingDetail />
                    </RoleProtectedRoute>
                  }
                />

                {/* Users - Admin, Manager */}
                <Route
                  path="/users"
                  element={
                    <RoleProtectedRoute allowedRoles={["ADMIN", "MANAGER"]}>
                      <Users />
                    </RoleProtectedRoute>
                  }
                />

                {/* Profile - All roles */}
                <Route path="/profile" element={<Profile />} />

                {/* Settings - All roles (Admin can update, others read-only) */}
                <Route
                  path="/settings"
                  element={
                    <RoleProtectedRoute
                      allowedRoles={[
                        "ADMIN",
                        "MANAGER",
                        "RECEPTIONIST",
                        "ACCOUNTANT",
                      ]}
                    >
                      <Settings />
                    </RoleProtectedRoute>
                  }
                />

                {/* Assets - Admin, Manager, Receptionist */}
                <Route
                  path="/assets"
                  element={
                    <RoleProtectedRoute allowedRoles={["ADMIN", "MANAGER"]}>
                      <Assets />
                    </RoleProtectedRoute>
                  }
                />

                {/* Invoices - Admin, Receptionist, Accountant */}
                <Route
                  path="/invoices"
                  element={
                    <RoleProtectedRoute allowedRoles={["ADMIN", "ACCOUNTANT"]}>
                      <Invoices />
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="/invoices/:id"
                  element={
                    <RoleProtectedRoute
                      allowedRoles={["ADMIN", "RECEPTIONIST", "ACCOUNTANT"]}
                    >
                      <InvoiceDetail />
                    </RoleProtectedRoute>
                  }
                />

                {/* Promotions - Admin, Manager */}
                <Route
                  path="/promotions"
                  element={
                    <RoleProtectedRoute allowedRoles={["ADMIN", "MANAGER"]}>
                      <Promotions />
                    </RoleProtectedRoute>
                  }
                />
              </Route>

              <Route path="/login" element={<Login />} />
            </Routes>
          </NotificationProvider>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
