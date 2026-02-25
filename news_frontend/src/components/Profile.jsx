import { useState } from "react";

export default function Profile() {
  const token = localStorage.getItem("access");
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(() => {
    if (user) {
      return {
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        bio: user.bio || "",
      };
    }
    return {
      first_name: "",
      last_name: "",
      email: "",
      bio: "",
    };
  });


  if (!user) {
    return (
      <div className="text-center mt-10 text-lg font-semibold">
        No user data found
      </div>
    );
  }

  const avatarUrl = user.avatar
    ? `http://127.0.0.1:8000${user.avatar}`
    : null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/v1/me/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.detail || "Update failed");
        return;
      }

      // ✅ Update local state + localStorage
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
      setEditMode(false);
      alert("Profile updated successfully ✅");

    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-6">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden">

        {/* Header */}
        <div className="bg-linear-to-r from-blue-600 to-indigo-600 h-32"></div>

        <div className="relative px-8 pb-8">

          {/* Avatar */}
          <div className="absolute -top-16 left-8">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="avatar"
                className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-md"
              />
            ) : (
              <div className="w-32 h-32 rounded-full border-4 border-white bg-blue-200 flex items-center justify-center text-4xl font-bold text-blue-700 shadow-md">
                {user.first_name?.charAt(0)}
              </div>
            )}
          </div>

          {/* Edit Button */}
          <div className="flex justify-end mt-4">
            {!editMode ? (
              <button
                onClick={() => setEditMode(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Edit Profile
              </button>
            ) : (
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Save Changes
              </button>
            )}
          </div>

          {/* User Info */}
          <div className="mt-16">

            {editMode ? (
              <div className="space-y-4">
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="First Name"
                  className="w-full border px-4 py-2 rounded-lg"
                />
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Last Name"
                  className="w-full border px-4 py-2 rounded-lg"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-full border px-4 py-2 rounded-lg"
                />
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Bio"
                  className="w-full border px-4 py-2 rounded-lg"
                  rows="3"
                />
              </div>
            ) : (
              <>
                <h2 className="text-3xl font-bold">
                  {user.first_name} {user.last_name}
                </h2>

                <p className="text-gray-500 mt-1">{user.email}</p>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2">About</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {user.bio || "No bio available."}
                  </p>
                </div>
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}