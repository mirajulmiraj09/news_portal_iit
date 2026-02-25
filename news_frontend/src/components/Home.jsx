import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openMenu, setOpenMenu] = useState(null);

  const navigate = useNavigate();

  const token = localStorage.getItem("access");
  const currentUser = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    const fetchNews = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("http://127.0.0.1:8000/api/v1/news/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          console.error("Fetch error:", data);
          setNews([]);
          return;
        }

        setNews(Array.isArray(data) ? data : data.results || []);
      } catch (err) {
        console.error(err);
        setNews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [token]);

  const handleDelete = async (id, e) => {
    e.stopPropagation();

    if (!window.confirm("Are you sure you want to delete this news?"))
      return;

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
        setNews(prev => prev.filter(item => item.id !== id));
        setOpenMenu(null);
      } else {
        alert("Delete failed");
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading)
    return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Latest News</h1>

        {token && (
          <button
            onClick={() => navigate("/create")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Create News
          </button>
        )}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.length === 0 && (
          <p className="text-gray-500">No news available</p>
        )}

        {news.map(item => {
          const isOwner = currentUser?.id === item.author?.id;

          return (
            <div
              key={item.id}
              onClick={() => navigate(`/news/${item.id}`)}
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition cursor-pointer relative"
            >
              <div className="flex justify-between items-center mb-3">
                <div>
                  <p className="font-semibold">
                    {item.author?.email}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(item.created_at).toLocaleDateString()}
                  </p>
                </div>

                {token && isOwner && (
                  <div
                    className="relative"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className="text-xl"
                      onClick={() =>
                        setOpenMenu(
                          openMenu === item.id ? null : item.id
                        )
                      }
                    >
                      ⋮
                    </button>

                    {openMenu === item.id && (
                      <div className="absolute right-0 mt-2 bg-white border rounded-lg shadow-md w-28 z-20">
                        <button
                          onClick={() =>
                            navigate(`/edit/${item.id}`)
                          }
                          className="block w-full px-4 py-2 hover:bg-gray-100 text-left"
                        >
                          Edit
                        </button>

                        <button
                          onClick={(e) =>
                            handleDelete(item.id, e)
                          }
                          className="block w-full px-4 py-2 text-red-600 hover:bg-gray-100 text-left"
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