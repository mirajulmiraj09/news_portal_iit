import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openMenu, setOpenMenu] = useState(null);

  const navigate = useNavigate();

  const token = localStorage.getItem("access");

  const storedUser = localStorage.getItem("user");
  const currentUser = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch(
          "http://127.0.0.1:8000/api/v1/news/"
        );
        const data = await res.json();
        setNews(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/v1/news/${id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        setNews((prev) =>
          prev.filter((item) => item.id !== id)
        );
        setOpenMenu(null);
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">
        Latest News
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map((item) => {
          const isOwner =
            currentUser?.id === item.author?.id;

          return (
            <div
              key={item.id}
              className="bg-white p-6 rounded-xl shadow relative"
            >
              {/* Author Info */}
              <div className="flex justify-between items-center mb-3">
                <div>
                  <p className="font-semibold">
                    {item.author?.email}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(
                      item.created_at
                    ).toLocaleDateString()}
                  </p>
                </div>

                {token && isOwner && (
                  <div className="relative">
                    <button
                      onClick={() =>
                        setOpenMenu(
                          openMenu === item.id
                            ? null
                            : item.id
                        )
                      }
                      className="text-xl"
                    >
                      ⋮
                    </button>

                    {openMenu === item.id && (
                      <div className="absolute right-0 mt-2 bg-white border rounded shadow-md z-10">
                        <button
                          onClick={() =>
                            navigate(`/edit/${item.id}`)
                          }
                          className="block px-4 py-2 hover:bg-gray-100 w-full text-left"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() =>
                            handleDelete(item.id)
                          }
                          className="block px-4 py-2 text-red-600 hover:bg-gray-100 w-full text-left"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <h2 className="text-xl font-bold mb-2">
                {item.title}
              </h2>

              <p className="text-gray-600">
                {item.body?.substring(0, 100)}...
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}