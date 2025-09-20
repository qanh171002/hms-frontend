import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { useAuth } from "../contexts/AuthContext";
import SpinnerMini from "../components/SpinnerMini";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      return;
    }

    try {
      setIsLoading(true);
      await loginUser(formData);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
      <div className="w-full max-w-md">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <div className="rounded-full bg-blue-100 p-3">
              <img src="/logo.svg" alt="Hotelio logo" className="h-10 w-10" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Hotelio</h1>
          </div>
          <h2 className="mb-2 text-2xl font-semibold text-gray-700">
            Welcome back
          </h2>
          <p className="text-gray-600">Sign in to manage your hotel system</p>
        </div>

        {/* Login Form */}
        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 transition-all duration-200 focus:border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Enter your email"
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 transition-all duration-200 focus:border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Enter your password"
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full transform rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition-all duration-200 hover:scale-[1.02] hover:bg-blue-700 disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <SpinnerMini />
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                      />
                    </svg>
                    <span>Sign in</span>
                  </div>
                )}
              </Button>
            </div>
          </form>

          {/* Additional Info */}
          <div className="mt-8 border-t border-gray-100 pt-6">
            <div className="text-center">
              <p className="mb-4 text-sm text-gray-600">
                Professional hotel management system
              </p>
              <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-green-400"></div>
                  <span>High Security</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-blue-400"></div>
                  <span>Easy to Use</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-purple-400"></div>
                  <span>Efficient</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            © 2025 Hotelio. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
