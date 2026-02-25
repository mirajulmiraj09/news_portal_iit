import React, { useEffect, useState } from "react";
import API from "../api";
import { Link } from "react-router-dom";
import { getUser } from "../auth";

export default function NewsList() {
  const [news, setNews] = useState([]);
  const [users, setUsers] = useState([]);
  const me = getUser();

  const fetchAll = () =>
    API.get("/news?_sort=id&_order=desc")
      .then((r) => setNews(r.data))
      .catch(console.error);

  useEffect(() => {
    fetchAll();
    API.get("/users")
      .then((r) => setUsers(r.data))
      .catch(console.error);
  }, []);

  const remove = (id) => {
    if (!me) return alert("Login first");
    if (!window.confirm("Delete this news?")) return;

    API.delete(`/news/${id}`).then(fetchAll);
  };

  const resolveAuthor = (author_id) => {
    const user = users.find((u) => u.id === author_id);
    return user ? user.name : "Unknown";
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Latest News</h2>

        <div className="flex items-center gap-4">
          <p className="text-gray-600">
            Logged in as:{" "}
            <span className="font-semibold">{me ? me.name : "Guest"}</span>
          </p>

          <Link
            to="/create"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
          >
            + Create News
          </Link>
        </div>
      </div>

      {/* List */}
      <div className="grid gap-6 md:grid-cols-2">
        {news.map((n) => (
          <div
            key={n.id}
            className="bg-white shadow-lg rounded-xl p-5 border hover:shadow-2xl transition"
          >
            <h3 className="text-xl font-semibold text-gray-800">{n.title}</h3>

            <p className="text-sm text-gray-500 mt-1">
              Author: {resolveAuthor(n.author_id)}
            </p>

            <div className="mt-4 flex items-center gap-3">
              <Link
                to={`/news/${n.id}`}
                className="text-blue-600 hover:underline font-medium"
              >
                View
              </Link>

              {me && me.id === n.author_id && (
                <>
                  <Link
                    to={`/news/${n.id}/edit`}
                    className="text-green-600 hover:underline font-medium"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => remove(n.id)}
                    className="text-red-600 hover:underline font-medium"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {news.length === 0 && (
        <p className="text-center text-gray-500 mt-10">
          No news found. Create one!
        </p>
      )}
    </div>
  );
}
