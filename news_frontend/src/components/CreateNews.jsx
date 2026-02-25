import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateNews() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("access");

  if (!token) {
    navigate("/login");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://127.0.0.1:8000/api/v1/news/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: title,
        body: body,
      }),
    });

    if (res.ok) {
      navigate("/");
    } else {
      const error = await res.json();
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-6">Create News</h2>

        <input
          type="text"
          placeholder="Title"
          className="w-full border p-2 rounded mb-4"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="Body"
          className="w-full border p-2 rounded mb-4"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          Submit
        </button>
      </form>
    </div>
  );
}