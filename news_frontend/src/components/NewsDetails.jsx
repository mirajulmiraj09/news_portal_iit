import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function NewsDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("access");
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const [news, setNews] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    // require login to view comments
    if (!token) {
      // optionally redirect or simply don't fetch comments
      navigate("/login");
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };

    const fetchComments = () => {
      fetch(`http://127.0.0.1:8000/api/v1/news/${id}/comments/`, {
        headers,
      })
        .then((res) => res.json())
        .then((data) => setComments(data));
    };

    fetch(`http://127.0.0.1:8000/api/v1/news/${id}/`, {
      headers,
    })
      .then((res) => res.json())
      .then((data) => setNews(data));

    fetchComments();
  }, [id, token, navigate]);

  // require login before displaying content
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-center">
          Please <a href="/login" className="text-blue-600 underline">login</a> to view this article and comments.
        </p>
      </div>
    );
  }

  // ✅ Create Comment (requires login)
  const handleCreate = async () => {
    if (!newComment.trim()) return;
    if (!token) {
      alert("Please log in to post a comment.");
      navigate("/login");
      return;
    }

    const res = await fetch(
      `http://127.0.0.1:8000/api/v1/news/${id}/comments/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        // backend uses `text` field for comment body
        body: JSON.stringify({ text: newComment }),
      }
    );

    const result = await res.json().catch(() => null);
    if (!res.ok) {
      console.error("Failed to create comment", res.status, result);
      alert(result?.detail || "Unable to post comment");
      return;
    }

    setNewComment("");
    // Refetch comments
    fetch(`http://127.0.0.1:8000/api/v1/news/${id}/comments/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setComments(data));
  };

  // ✅ Delete Comment
  const handleDelete = async (commentId) => {
    await fetch(
      `http://127.0.0.1:8000/api/v1/news/${id}/comments/${commentId}/`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Refetch comments
    fetch(`http://127.0.0.1:8000/api/v1/news/${id}/comments/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setComments(data));
  };

  // ✅ Update Comment
  const handleUpdate = async (commentId) => {
    const res = await fetch(
      `http://127.0.0.1:8000/api/v1/news/${id}/comments/${commentId}/`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: editContent }),
      }
    );

    if (res.ok) {
      setEditingId(null);
      // Refetch comments
      fetch(`http://127.0.0.1:8000/api/v1/news/${id}/comments/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setComments(data));
    }
  };

  if (!news) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-md">

        <h1 className="text-3xl font-bold mb-4">{news.title}</h1>
        <p className="text-gray-600 mb-6">{news.body}</p>

        <hr className="my-6" />

        <h2 className="text-xl font-semibold mb-4">
          Comments ({comments.length})
        </h2>

        {/* Add Comment (only show if logged in) */}
        {token ? (
          <div className="mb-6">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="w-full border rounded-lg p-3 mb-3"
            />
            <button
              onClick={handleCreate}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Post Comment
            </button>
          </div>
        ) : (
          <p className="mb-6 text-gray-500">
            <em>Login to post a comment.</em>
          </p>
        )}

        {/* Comment List */}
        {comments.map((comment) => {
          const isOwner = currentUser?.id === comment.user.id;

          return (
            <div
              key={comment.id}
              className="bg-gray-100 p-4 rounded-lg mb-3"
            >
              <p className="text-sm font-semibold">
                {comment.user.first_name}
              </p>

              {editingId === comment.id ? (
                <>
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full border rounded-lg p-2 my-2"
                  />
                  <button
                    onClick={() => handleUpdate(comment.id)}
                    className="px-3 py-1 bg-green-600 text-white rounded mr-2"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="px-3 py-1 bg-gray-500 text-white rounded"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <p className="text-gray-700">{comment.text}</p>
              )}

              {/* Owner Controls */}
              {isOwner && editingId !== comment.id && (
                <div className="mt-2 flex gap-3 text-sm">
                  <button
                    onClick={() => {
                      setEditingId(comment.id);
                      setEditContent(comment.text);
                    }}
                    className="text-blue-600"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}