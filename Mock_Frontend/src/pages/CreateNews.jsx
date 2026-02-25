import React, { useState } from "react";
import API from "../api";
import { getUser } from "../auth";
import { useNavigate, Link } from "react-router-dom";

export default function CreateNews() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const nav = useNavigate();
  const me = getUser();

  if (!me)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white shadow-lg p-6 rounded-xl text-center w-96">
          <p className="text-lg font-semibold mb-4">
            You must login first
          </p>
          <Link
            to="/login"
            className="text-blue-600 underline font-medium"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );

  const submit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return alert("Title required");
    if (body.trim().length < 20)
      return alert("Body must be at least 20 characters");

    const payload = { title, body, author_id: me.id, comments: [] };
    await API.post("/news", payload);
    nav("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-xl">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Create News
        </h2>

        <form onSubmit={submit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter news title"
            />
          </div>

          {/* Body */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Body
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg h-40 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Write the full news content..."
            ></textarea>
          </div>

          {/* Buttons */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
          >
            Create News
          </button>
        </form>
      </div>
    </div>
  );
}
