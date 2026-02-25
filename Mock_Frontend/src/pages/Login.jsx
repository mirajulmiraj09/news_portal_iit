import React, { useEffect, useState } from "react";
import API from "../api";
import { saveUser } from "../auth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState("");
  const nav = useNavigate();

  useEffect(() => {
    API.get("/users")
      .then((r) => setUsers(r.data))
      .catch(console.error);
  }, []);

  const submit = (e) => {
    e.preventDefault();
    const u = users.find((x) => String(x.id) === String(selected));
    if (!u) return alert("Select a user");
    saveUser(u);
    nav("/");
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Login (Simulated)
        </h2>

        <form onSubmit={submit} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Select User
            </label>
            <select
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">-- Select user --</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
