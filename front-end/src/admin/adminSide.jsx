import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminSide() {
    const [posts, setPosts] = useState([]);
    const [users, setUsers] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const navigate = useNavigate();
  
    useEffect(() => {
      const fetchAll = async () => {
        try {
          const [postsRes, usersRes, suggRes] = await Promise.all([
            axios.get("http://localhost:5000/api/posts/"),
            axios.get("http://localhost:5000/api/admin/showUsers"),
            axios.post("http://localhost:5000/api/suggestions/getSuggestion")
          ]);
          setPosts(postsRes.data);
          setUsers(usersRes.data);
          setSuggestions(suggRes.data);
        } catch (err) {
          console.log(err);
        }
      };
      fetchAll();
    }, []);
  
    return (
      <div className="bg-gray-50 h-full p-4 flex flex-col items-center gap-6">
        <h2 className="text-xl font-bold text-gray-700">Admin Dashboard</h2>
  
        <div className="w-full flex flex-col gap-3">
          <div className="bg-white p-4 rounded-xl shadow text-center">
            <p className="text-sm text-gray-500">Total Users</p>
            <h3 className="text-lg font-bold">{users.length}</h3>
          </div>
          <div className="bg-white p-4 rounded-xl shadow text-center">
            <p className="text-sm text-gray-500">Total Suggestions</p>
            <h3 className="text-lg font-bold">{suggestions.length}</h3>
          </div>
          <div className="bg-white p-4 rounded-xl shadow text-center">
            <p className="text-sm text-gray-500">Total Posts</p>
            <h3 className="text-lg font-bold">{posts.length}</h3>
          </div>
        </div>
  
        <div className="w-full flex flex-col gap-3 mt-4">
          <button onClick={() => navigate("/managePosts")} className="bg-blue-600 text-white py-2 rounded-xl shadow hover:bg-blue-700">
            📰 Manage Posts
          </button>
          <button onClick={() => navigate("/manageSuggestions")} className="bg-blue-600 text-white py-2 rounded-xl shadow hover:bg-blue-700">
            📋 Manage Suggestions
          </button>
          <button onClick={() => navigate("/manageUsers")} className="bg-blue-600 text-white py-2 rounded-xl shadow hover:bg-blue-700">
            👥 Manage Users
          </button>
        </div>
      </div>
    );
  }
  