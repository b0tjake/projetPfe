import React, { useEffect, useState, useContext } from "react";
import { jwtDecode } from "jwt-decode";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { DarkModeContext } from "../assets/darkmode";
import { motion } from "framer-motion";
import { FiHome, FiUsers, FiMessageSquare, FiBell, FiBookmark, FiSettings, FiUser, FiLogOut, FiPlusCircle } from "react-icons/fi";

export default function Sidebar() {
  const [user, setUser] = useState(null);
  const { darkMode } = useContext(DarkModeContext);
  const location = useLocation();
  const [activeItem, setActiveItem] = useState(location.pathname);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUser(decodedToken);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  const menuItems = [
    { id: "home", icon: <FiHome />, label: "Home", path: "/" },
    { id: "friends", icon: <FiUsers />, label: "Friends", path: "/friends" },
    { id: "messages", icon: <FiMessageSquare />, label: "Messages", path: "/messages" },
    // { id: "notifications", icon: <FiBell />, label: "Notifications", path: "/notifications" },
    { id: "save", icon: <FiBookmark />, label: "Save", path: "/saved" },
    { id: "settings", icon: <FiSettings />, label: "Settings", path: "/settings" },
    // { path: '/addpost', icon: <FiPlusCircle />, label: 'Add Post' },
  ];

  const handleItemClick = (path) => {
    setActiveItem(path);
  };

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`hidden lg:block w-80 min-h-screen transition-colors duration-300 ${
        darkMode ? 'bg-gray-800 border-r border-gray-700' : 'bg-white border-r border-gray-200'
      }`}
    >
      <div className="p-6 flex flex-col h-full">
        {user && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`w-full rounded-2xl overflow-hidden border mb-6 transition-colors duration-300 ${
              darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
            }`}
          >
            <div className="relative h-24 bg-gradient-to-r from-[#0077B6] via-[#66add3] to-[#006ba3]">
              <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
            </div>
            <div className="relative px-6 pb-6">
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-r from-[#006ba3] via-[#66add3] to-[#0077B6]">
                    <img
                      src={`http://localhost:5000/${user.image}`}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover border-2 border-white cursor-pointer"
                      onClick={() => navigate(`/profile/${user.id}`)}
                    />
                  </div>
                  <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-green-500 border-2 border-white"></div>
                </div>
              </div>
              <div className="pt-14 text-center">
                <h1 
                  className={`font-semibold text-lg mb-1 ${darkMode ? 'text-gray-100' : 'text-gray-800'} cursor-pointer hover:text-blue-500 transition-colors`}
                  onClick={() => navigate(`/profile/${user.id}`)}
                >
                  {user.fullname}
                </h1>
                <p className={`text-sm ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>@{user.username}</p>
              </div>
            </div>
          </motion.div>
        )}

        <nav className="flex-1">
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <motion.li
                key={item.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 * index }}
              >
                <Link
                  to={item.path}
                  className={`flex items-center p-4 rounded-xl transition-all duration-300 ${
                    activeItem === item.path
                      ? darkMode
                        ? 'bg-blue-900 text-white shadow-lg shadow-blue-900/50'
                        : 'bg-blue-50 text-blue-600 shadow-lg shadow-blue-100'
                      : darkMode
                      ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
                  }`}
                  onClick={() => handleItemClick(item.path)}
                >
                  <span className="text-xl mr-3">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              </motion.li>
            ))}
          </ul>
        </nav>
      </div>
    </motion.div>
  );
}