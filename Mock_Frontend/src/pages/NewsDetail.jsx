import React, { useEffect, useState } from "react";
import API from "../api";
import { useParams, Link } from "react-router-dom";
import { getUser } from "../auth";

export default function NewsDetail() {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [users, setUsers] = useState([]);
  const [commentText, setCommentText] = useState("");
  const me = getUser();

  useEffect(() => {
    API.get(`/news/${id}`)
      .then((r) => setNews(r.data))
      .catch(console.error);

    API.get("/users")
      .then((r) => setUsers(r.data))
      .catch(console.error);
  }, [id]);

  if (!news) return <div className="text-center py-10">Loading...</div>;

  const author = users.find((u) => u.id === news.author_id);

  const addComment = async (e) => {
    e.preventDefault();
    if (!me) return alert("Login to comment");
    if (!commentText.trim()) return alert("Comment cannot be empty");

    const newComment = {
      id: Date.now(),
      text: commentText.trim(),
      user_id: me.id,
    };
    const updated = { comments: [...(news.comments || []), newComment] };
    await API.patch(`/news/${id}`, updated);

    const r = await API.get(`/news/${id}`);
    setNews(r.data);
    setCommentText("");
  };

  const commenterName = (user_id) => {
    const u = users.find((x) => x.id === user_id);
    return u ? u.name : "Unknown";
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* News Card */}
      <div className="bg-white shadow-lg rounded-xl p-6 mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">{news.title}</h2>

        <p className="text-gray-500 text-sm mb-4">
          By: <span className="font-medium">{author ? author.name : "Unknown"}</span>
        </p>

        <p className="text-gray-700 leading-relaxed">{news.body}</p>
      </div>

      {/* Comments */}
      <div className="bg-white shadow-lg rounded-xl p-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Comments ({(news.comments || []).length})
        </h3>

        <ul className="space-y-4">
          {(news.comments || []).map((c) => (
            <li
              key={c.id}
              className="p-4 border rounded-lg bg-gray-50 shadow-sm"
            >
              <p className="text-gray-800">{c.text}</p>
              <p className="text-sm text-gray-500 mt-1">
                — {commenterName(c.user_id)}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* Add Comment */}
      <div className="bg-white shadow-lg rounded-xl p-6">
        <form onSubmit={addComment} className="space-y-4">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write a comment..."
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            rows="4"
          ></textarea>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Add Comment
          </button>
        </form>
      </div>

      {/* Back */}
      <p className="text-center mt-6">
        <Link
          to="/"
          className="text-blue-600 hover:underline font-medium"
        >
          ← Back to Home
        </Link>
      </p>
    </div>
  );
}
