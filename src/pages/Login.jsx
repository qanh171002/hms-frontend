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
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-sm rounded-xl bg-white p-8 shadow-md">
        <div className="flex flex-col items-center">
          <h1 className="mt-2 text-2xl font-bold text-blue-500">Hotelio</h1>
          <p className="mb-6 font-medium text-gray-700">
            Sign in to your account
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="mb-1 block font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div className="mb-6">
            <label className="mb-1 block font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <div className="mt-1 text-right">
              <a href="#" className="text-sm text-gray-500 hover:underline">
                Forgot password?
              </a>
            </div>
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-md font-semibold uppercase"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <SpinnerMini />
                {/* <span className="ml-2">Signing in...</span> */}
              </div>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>
        <div className="text-md mt-5 text-center">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-500 hover:underline">
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
}

export default Login;
