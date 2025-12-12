import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import NewsList from "./pages/NewsList";
import CreateNews from "./pages/CreateNews";
import NewsDetail from "./pages/NewsDetail";
import EditNews from "./pages/EditNews";
import { getUser, logout } from "./auth";

export default function App() {
  const user = getUser();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <header className="bg-white shadow-md mb-6">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            to="/"
            className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition"
          >
            News Portal
          </Link>

          <nav className="flex items-center gap-6 text-gray-700 font-medium">
            <Link
              to="/"
              className="hover:text-blue-600 transition duration-150"
            >
              Home
            </Link>

            <Link
              to="/create"
              className="hover:text-blue-600 transition duration-150"
            >
              Create News
            </Link>

            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-gray-600">
                  Logged in as:{" "}
                  <strong className="text-gray-800">{user.name}</strong>
                </span>

                <button
                  onClick={() => {
                    logout();
                    window.location = "/";
                  }}
                  className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 pb-10">
        <Routes>
          <Route path="/" element={<NewsList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create" element={<CreateNews />} />
          <Route path="/news/:id" element={<NewsDetail />} />
          <Route path="/news/:id/edit" element={<EditNews />} />
        </Routes>
      </div>
    </div>
  );
}
