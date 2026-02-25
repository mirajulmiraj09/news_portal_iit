import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 🔐 Step 1: Login Request
      const loginRes = await fetch("http://127.0.0.1:8000/api/v1/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const loginData = await loginRes.json();
      console.log("Login response:", loginRes.status, loginData);

      if (!loginRes.ok) {
        alert(loginData.detail || "Invalid credentials");
        return;
      }

      // ✅ Ensure access token exists (backend nests tokens)
      if (!loginData.tokens || !loginData.tokens.access) {
        console.error("No access token returned from backend", loginData);
        alert("Login failed: No access token received.");
        return;
      }

      const accessToken = loginData.tokens.access.trim();
      const refreshToken = loginData.tokens.refresh;

      console.log("Access Token:", accessToken);

      // 💾 Store tokens
      localStorage.setItem("access", accessToken);
      if (refreshToken) {
        localStorage.setItem("refresh", refreshToken);
      }

      // 🔎 Step 2: Fetch logged-in user
      const profileRes = await fetch(
        "http://127.0.0.1:8000/api/v1/me/",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const profileData = await profileRes.json();
      console.log("/me response:", profileRes.status, profileData);

      if (!profileRes.ok) {
        alert(
          `Unable to retrieve user info: ${
            profileData.detail || "Authentication failed"
          }`
        );
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        return;
      }

      // 💾 Store user info
      localStorage.setItem("user", JSON.stringify(profileData));

      // 🚀 Redirect
      navigate("/profile", { replace: true });

    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
          Login
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
          className="w-full mb-6 px-4 py-2 border rounded-lg"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </div>
  );
}