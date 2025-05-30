import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSide from "./adminSide";
import { 
  FiUsers, 
  FiFileText, 
  FiMessageSquare, 
  FiBarChart2,
  FiTrendingUp,
  FiActivity,
  FiArrowUp,
  FiArrowDown
} from "react-icons/fi";

export default function AdminDash() {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
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
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // Calculate statistics
  const totalUsers = users.length;
  const totalPosts = posts.length;
  const totalSuggestions = suggestions.length;
  const activeUsers = users.filter(user => user.isActive).length;
  const postsWithImages = posts.filter(post => post.image).length;
  const recentSuggestions = suggestions.filter(sugg => {
    const suggDate = new Date(sugg.createdAt);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return suggDate >= thirtyDaysAgo;
  }).length;

  if (!isAdmin) {
    return <div>You do not have access to this page.</div>;
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <aside className="hidden md:block w-64 bg-white border-r shadow-lg p-4">
        <AdminSide />
      </aside>

      <main className="flex-1 p-4 sm:p-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 sm:p-10 border border-gray-100">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-6">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-2xl text-white shadow-lg">
                <FiBarChart2 className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Dashboard Overview
                </h1>
                <p className="text-sm text-gray-500 mt-1">Monitor your platform's performance</p>
              </div>
            </div>
          </div>

          {/* Main Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-80">Total Users</p>
                  <h3 className="text-2xl font-bold mt-1">{totalUsers}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <FiArrowUp className="w-4 h-4 text-green-300" />
                    <span className="text-sm text-green-300">Active: {activeUsers}</span>
                  </div>
                </div>
                <FiUsers className="w-8 h-8 opacity-80" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-80">Total Posts</p>
                  <h3 className="text-2xl font-bold mt-1">{totalPosts}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <FiFileText className="w-4 h-4 text-purple-300" />
                    <span className="text-sm text-purple-300">With Images: {postsWithImages}</span>
                  </div>
                </div>
                <FiFileText className="w-8 h-8 opacity-80" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-80">Total Suggestions</p>
                  <h3 className="text-2xl font-bold mt-1">{totalSuggestions}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <FiTrendingUp className="w-4 h-4 text-pink-300" />
                    <span className="text-sm text-pink-300">Last 30 days: {recentSuggestions}</span>
                  </div>
                </div>
                <FiMessageSquare className="w-8 h-8 opacity-80" />
              </div>
            </div>
          </div>

          {/* Activity Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">User Activity</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Active Users</span>
                  <span className="font-medium text-gray-800">{activeUsers}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">New Users (30d)</span>
                  <span className="font-medium text-gray-800">{users.filter(user => {
                    const userDate = new Date(user.createdAt);
                    const thirtyDaysAgo = new Date();
                    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                    return userDate >= thirtyDaysAgo;
                  }).length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Admin Users</span>
                  <span className="font-medium text-gray-800">{users.filter(user => user.role === "admin").length}</span>
                </div>
              </div>
            </div>

            <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Content Overview</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Posts with Images</span>
                  <span className="font-medium text-gray-800">{postsWithImages}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Recent Suggestions</span>
                  <span className="font-medium text-gray-800">{recentSuggestions}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Comments</span>
                  <span className="font-medium text-gray-800">{posts.reduce((acc, post) => acc + post.comments.length, 0)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
