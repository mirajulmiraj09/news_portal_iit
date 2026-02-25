import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditNews() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("access");

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/v1/news/${id}/`)
      .then((res) => res.json())
      .then((data) => {
        setTitle(data.title);
        setBody(data.body);
      });
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    const res = await fetch(
      `http://127.0.0.1:8000/api/v1/news/${id}/`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, body }),
      }
    );

    if (res.ok) {
      navigate("/");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Edit News</h1>

      <form onSubmit={handleUpdate} className="flex flex-col gap-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded"
        />

        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="border p-2 rounded"
        />

        <button className="bg-blue-600 text-white py-2 rounded">
          Update
        </button>
      </form>
    </div>
  );
}