import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
  const token = localStorage.getItem("access");
  const storedUser = localStorage.getItem("user");

  if (token && storedUser) {
    try {
      setUser(JSON.parse(storedUser));
    } catch (error) {
      setUser(null);
    }
  } else {
    setUser(null);
  }
}, []);

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-600">
          NewsPortal
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="hover:text-blue-600 transition">
            Home
          </Link>

          {user && (
            <Link to="/create" className="hover:text-blue-600 transition">
              Create News
            </Link>
          )}

          {!user ? (
            <>
              <Link
                to="/login"
                className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              {/* Profile Button */}
              <Link
                to="/profile"
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
              >
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold">
                  {user.first_name?.charAt(0)}
                </div>
                <span className="font-medium">
                  {user.first_name}
                </span>
              </Link>

              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile Button */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-100 px-6 py-4 space-y-4">
          <Link to="/" className="block" onClick={() => setIsOpen(false)}>
            Home
          </Link>

          {user && (
            <Link to="/create" className="block" onClick={() => setIsOpen(false)}>
              Create News
            </Link>
          )}

          {!user ? (
            <>
              <Link to="/login" className="block" onClick={() => setIsOpen(false)}>
                Login
              </Link>
              <Link to="/register" className="block" onClick={() => setIsOpen(false)}>
                Register
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/profile"
                className="block font-semibold"
                onClick={() => setIsOpen(false)}
              >
                Profile
              </Link>

              <button
                onClick={handleLogout}
                className="block text-red-500"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}