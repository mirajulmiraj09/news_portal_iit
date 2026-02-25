import React, { useEffect, useState } from "react";
import API from "../api";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getUser } from "../auth";

export default function EditNews() {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const nav = useNavigate();
  const me = getUser();

  useEffect(() => {
    API.get(`/news/${id}`)
      .then((r) => {
        setNews(r.data);
        setTitle(r.data.title);
        setBody(r.data.body);
      })
      .catch(console.error);
  }, [id]);

  if (!news)
    return (
      <div className="flex justify-center items-center h-screen text-xl font-semibold">
        Loading...
      </div>
    );

  if (!me || me.id !== news.author_id)
    return (
      <div className="flex flex-col justify-center items-center h-screen text-center">
        <p className="text-red-600 text-xl font-semibold mb-4">
          ❌ You are not authorized to edit this news.
        </p>
        <Link
          to="/"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Go Back
        </Link>
      </div>
    );

  const submit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return alert("Title required");
    if (body.trim().length < 20)
      return alert("Body must be at least 20 characters");

    await API.patch(`/news/${id}`, { title, body });
    nav(`/news/${id}`);
  };

  return (
    <div className="min-h-screen flex justify-center items-start bg-gray-100 p-6">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          ✏️ Edit News
        </h2>

        <form onSubmit={submit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter updated title"
            />
          </div>

          {/* Body */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Body
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg h-48 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Update the full news content..."
            ></textarea>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-between mt-4">
            <Link
              to={`/news/${id}`}
              className="px-5 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 text-gray-800 font-semibold"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
