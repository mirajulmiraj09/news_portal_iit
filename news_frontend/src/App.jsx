import { Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Profile from "./components/Profile";
import NewsDetails from "./components/NewsDetails";
import CreateNews from "./components/CreateNews";
import EditNews from "./components/EditNews";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/news/:id" element={<NewsDetails />} />
        <Route path="/create" element={<CreateNews />} />
        <Route path="/edit/:id" element={<EditNews />} />
      </Routes>
    </>
  );
}

export default App;