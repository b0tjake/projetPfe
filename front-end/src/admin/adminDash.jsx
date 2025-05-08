import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDash() {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [isAdmin, setIsAdmin] = useState(true);  // To track if the user is an admin

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      if (decodedToken.role !== "admin") {
        setIsAdmin(false);
        navigate("/");
      }
    } catch (err) {
      console.log("Error decoding token", err);
      navigate("/");
    }
  }, [token, navigate]);

  // Fetch posts from API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/posts/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPosts(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchPosts();
  }, [token]);

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/showUsers", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUsers();
  }, [token]);

  // Fetch suggestions from API
  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const res = await axios.post(
          "http://localhost:5000/api/suggestions/getSuggestion",
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setSuggestions(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchSuggestions();
  }, [token]);

  if (!isAdmin) {
    return <div>You do not have access to this page.</div>;
  }

  return (
    <div className="h-full bg-gray-50 p-10 py-20 flex justify-center">
      <div className="w-full max-w-4xl bg-[#f3f4f6] p-20 rounded-2xl shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Admin Dashboard
        </h1>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-4 rounded-xl text-center shadow">
            <p className="text-gray-500 text-sm">Total Users 👥</p>
            <h3 className="text-2xl font-bold text-black">{users.length}</h3>
          </div>
          <div className="bg-white p-4 rounded-xl text-center shadow">
            <p className="text-gray-500 text-sm">Total Suggestions 📝</p>
            <h3 className="text-2xl font-bold text-black">{suggestions.length}</h3>
          </div>
          <div className="bg-white p-4 rounded-xl text-center shadow">
            <p className="text-gray-500 text-sm">Total Posts 📰</p>
            <h3 className="text-2xl font-bold text-black">{posts.length}</h3>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => navigate("/managePosts")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition"
          >
            📰 Manage Posts
          </button>
          <button
            onClick={() => navigate("/manageSuggestions")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition"
          >
            📋 Manage Suggestions
          </button>
          <button
            onClick={() => navigate("/manageUsers")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition"
          >
            👥 Manage Users
          </button>
        </div>
      </div>
    </div>
  );
}
