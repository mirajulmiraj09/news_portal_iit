import { useState } from "react";

export default function Register() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    bio: "",
    avatar: null,
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "avatar") {
      setFormData({ ...formData, avatar: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("first_name", formData.first_name);
    data.append("last_name", formData.last_name);
    data.append("bio", formData.bio);
    if (formData.avatar) {
      data.append("avatar", formData.avatar);
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/v1/register/",
        {
          method: "POST",
          body: data,
        }
      );

      const result = await response.json();

      if (response.ok) {
        setMessage("Registration successful ");
      } else {
        setMessage(JSON.stringify(result));
      }
    } catch (error) {
      setMessage("Something went wrong (error: " + error.message + ") ");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
          Register
        </h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
          className="w-full mb-4 px-4 py-2 border rounded-lg"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
          className="w-full mb-4 px-4 py-2 border rounded-lg"
        />

        <input
          type="text"
          name="first_name"
          placeholder="First Name"
          onChange={handleChange}
          required
          className="w-full mb-4 px-4 py-2 border rounded-lg"
        />

        <input
          type="text"
          name="last_name"
          placeholder="Last Name"
          onChange={handleChange}
          required
          className="w-full mb-4 px-4 py-2 border rounded-lg"
        />

        <textarea
          name="bio"
          placeholder="Bio"
          onChange={handleChange}
          className="w-full mb-4 px-4 py-2 border rounded-lg"
        />

        <input
          type="file"
          name="avatar"
          accept="image/*"
          onChange={handleChange}
          className="w-full mb-4"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          Register
        </button>

        {message && (
          <p className="mt-4 text-center text-sm text-gray-600">
            {message}
          </p>
        )}
      </form>
    </div>
  );
}