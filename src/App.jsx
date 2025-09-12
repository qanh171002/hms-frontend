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
import ProtectedRoute from "./components/ProtectedRoute";
import RoomDetail from "./pages/RoomDetail";
import BookingDetail from "./pages/BookingDetail";

function AppLayout() {
  return (
    <div className="flex overflow-hidden h-screen">
      <Sidebar />
      <div className="flex overflow-auto flex-col flex-1 bg-gray-50">
        <Header />
        <main className="overflow-scroll p-8 no-scrollbar">
          <div className="flex flex-col gap-8 p-8 mx-auto max-w-10xl">
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
          <Routes>
            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/rooms" element={<Rooms />} />
              <Route path="/rooms/:id" element={<RoomDetail />} />
              <Route path="/bookings" element={<Bookings />} />
              <Route path="/bookings/:id" element={<BookingDetail />} />
              <Route path="/users" element={<Users />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/assets" element={<Assets />} />
              <Route path="/invoices" element={<Invoices />} />
            </Route>

            <Route path="/login" element={<Login />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
