import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  FiUsers, 
  FiFileText, 
  FiMessageSquare, 
  FiBarChart2,
  FiTrendingUp,
  FiActivity,
  FiGrid,
  FiLogOut,
  FiHome
} from "react-icons/fi";

export default function AdminSide() {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const menuItems = [
    {
      title: "Dashboard",
      icon: <FiHome className="w-5 h-5" />,
      path: "/adminDash",
      stats: null
    },
    {
      title: "Manage Users",
      icon: <FiUsers className="w-5 h-5" />,
      path: "/manageUsers",
      stats: users.length
    },
    {
      title: "Manage Posts",
      icon: <FiFileText className="w-5 h-5" />,
      path: "/managePosts",
      stats: posts.length
    },
    {
      title: "Manage Suggestions",
      icon: <FiMessageSquare className="w-5 h-5" />,
      path: "/manageSuggestions",
      stats: suggestions.length
    }
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Logo/Brand */}
      <div className="mb-8 p-2">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-lg">
            <FiBarChart2 className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Admin Panel
          </h1>
        </div>
        <p className="text-sm text-gray-500 ml-1">Manage your platform</p>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-2">
        <ul className="space-y-1.5">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <button
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-all group
                    ${isActive 
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md' 
                      : 'hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 text-gray-700 hover:text-blue-600'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`transition-colors ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-blue-500'}`}>
                      {item.icon}
                    </div>
                    <span className="font-medium">{item.title}</span>
                  </div>
                  {item.stats !== null && (
                    <span className={`px-2 py-1 text-xs font-medium rounded-lg transition-colors
                      ${isActive 
                        ? 'bg-white/20 text-white' 
                        : 'bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600'
                      }`}>
                      {item.stats}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-4 mx-2"></div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 p-3 mx-2 mb-4 text-red-600 hover:bg-red-50 rounded-xl transition-all group"
      >
        <FiLogOut className="w-5 h-5" />
        <span className="font-medium">Logout</span>
      </button>
    </div>
  );
}
  