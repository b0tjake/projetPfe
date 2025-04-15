// import React, { useEffect, useState } from "react";
// import { jwtDecode } from "jwt-decode";
// import { Link } from "react-router-dom";
// import {
//   FiHome,
//   FiUser,
//   FiSettings,
//   FiLogOut,
//   FiMessageSquare,
//   FiBell
// } from "react-icons/fi";

// export default function Sidebar() {
//   const [user, setUser] = useState(null);
//   const [activeItem, setActiveItem] = useState("home");

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       try {
//         const decodedToken = jwtDecode(token);
//         setUser(decodedToken);
//       } catch (error) {
//         console.error("Error decoding token:", error);
//       }
//     }
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     window.location.reload();
//   };

//   return (
//     <div className="w-64 bg-white shadow-md p-4 mt-4 rounded-sm flex flex-col">

//       {user && (
//         <div className="flex items-center p-3 mb-6 bg-indigo-50 rounded-lg">
//           <img
//             src={`http://localhost:5000/${user.image}`}
//             alt="Profile"
//             className="w-10 h-10 rounded-full object-cover border-2 border-indigo-200"
//           />
//           <div className="ml-3">
//             <p className="font-medium text-gray-800">{user.fullname}</p>
//             <p className="text-xs text-gray-500">@{user.username}</p>
//           </div>
//         </div>
//       )}

//       <nav className="flex-1">
//         <ul className="space-y-2">
//           <li>
//             <Link
//               to="/"
//               className={`flex items-center p-3 rounded-lg ${
//                 activeItem === "home" ? "bg-indigo-100 text-indigo-700" : "text-gray-700 hover:bg-gray-100"
//               }`}
//               onClick={() => setActiveItem("home")}
//             >
//               <FiHome className="mr-3" />
//               Home
//             </Link>
//           </li>
//           <li>
//             <Link
//               to="/profile"
//               className={`flex items-center p-3 rounded-lg ${
//                 activeItem === "profile" ? "bg-indigo-100 text-indigo-700" : "text-gray-700 hover:bg-gray-100"
//               }`}
//               onClick={() => setActiveItem("profile")}
//             >
//               <FiUser className="mr-3" />
//               Profile
//             </Link>
//           </li>
//           <li>
//             <Link
//               to="/messages"
//               className={`flex items-center p-3 rounded-lg ${
//                 activeItem === "messages" ? "bg-indigo-100 text-indigo-700" : "text-gray-700 hover:bg-gray-100"
//               }`}
//               onClick={() => setActiveItem("messages")}
//             >
//               <FiMessageSquare className="mr-3" />
//               Messages
//             </Link>
//           </li>
//           <li>
//             <Link
//               to="/notifications"
//               className={`flex items-center p-3 rounded-lg ${
//                 activeItem === "notifications" ? "bg-indigo-100 text-indigo-700" : "text-gray-700 hover:bg-gray-100"
//               }`}
//               onClick={() => setActiveItem("notifications")}
//             >
//               <FiBell className="mr-3" />
//               Notifications
//             </Link>
//           </li>
//           <li>
//             <Link
//               to="/settings"
//               className={`flex items-center p-3 rounded-lg ${
//                 activeItem === "settings" ? "bg-indigo-100 text-indigo-700" : "text-gray-700 hover:bg-gray-100"
//               }`}
//               onClick={() => setActiveItem("settings")}
//             >
//               <FiSettings className="mr-3" />
//               Settings
//             </Link>
//           </li>
//         </ul>
//       </nav>

//       {user && (
//         <button
//           onClick={handleLogout}
//           className="flex items-center p-3 mt-auto text-gray-700 hover:bg-gray-100 rounded-lg"
//         >
//           <FiLogOut className="mr-3" />
//           Logout
//         </button>
//       )}
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Link, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiUser,
  FiSettings,
  FiLogOut,
  FiMessageSquare,
  FiBell,
  FiMenu,
  FiX,
  FiChevronRight,
} from "react-icons/fi";

export default function Sidebar() {
  const [user, setUser] = useState(null);
  const [activeItem, setActiveItem] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Close sidebar when clicking on a link (for mobile)
  const handleLinkClick = () => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed top-71 left-0 mt-3 z-50 p-2 bg-white rounded-md shadow-md"
      >
        {sidebarOpen ? <FiX size={24} /> : <FiChevronRight size={17} />}
      </button>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:relative z-50 md:z-auto w-80 h-screen mt-3 bg-white ms:w-64 shadow-md transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="p-4 flex flex-col h-full">
          {/* {user && (
            <div className="flex items-center p-3 mb-6 bg-indigo-50 rounded-lg">
              <img
                src={`http://localhost:5000/${user.image}`}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover border-2 border-indigo-200"
              />
              <div className="ml-3">
                <p className="font-medium text-gray-800">{user.fullname}</p>
                <p className="text-xs text-gray-500">@{user.username}</p>
              </div>
            </div>
          )} */}
          {user && (
            <div className="w-full bg-white rounded-xl overflow-hidden border border-gray-200 mb-3">
              <div className="bg-[#F2A261] h-16 relative">
                <img
                  src={`http://localhost:5000/${user.image}`}
                  alt="Profile"
                  className="w-16 h-16 rounded-full object-cover border-4 border-white absolute left-10 -bottom-8 transform -translate-x-1/2"
                />
              </div>
              <div className="pt-10 pb-4 px-4">
                <Link to="profile">
                  <h1 className="font-medium text-[#000]" t>
                    {user.fullname}
                  </h1>
                </Link>
                <p className="text-sm text-[#0077B6]">@{user.username}</p>
              </div>
            </div>
          )}

          <nav className="flex-1">
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className={`flex items-center p-3 rounded-lg ${
                    activeItem === "home"
                      ? "bg-[#CCE3F0] text-[#000]"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => {
                    setActiveItem("home");
                    handleLinkClick();
                  }}
                >
                  <FiHome className="mr-3" />
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/messages"
                  className={`flex items-center p-3 rounded-lg ${
                    activeItem === "messages"
                      ? "bg-indigo-100 text-indigo-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => {
                    setActiveItem("messages");
                    handleLinkClick();
                  }}
                >
                  <FiMessageSquare className="mr-3" />
                  Messages
                </Link>
              </li>
              <li>
                <Link
                  to="/notifications"
                  className={`flex items-center p-3 rounded-lg ${
                    activeItem === "notifications"
                      ? "bg-indigo-100 text-indigo-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => {
                    setActiveItem("notifications");
                    handleLinkClick();
                  }}
                >
                  <FiBell className="mr-3" />
                  Notifications
                </Link>
              </li>
              <li>
                <Link
                  to="/settings"
                  className={`flex items-center p-3 rounded-lg ${
                    activeItem === "settings"
                      ? "bg-indigo-100 text-indigo-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => {
                    setActiveItem("settings");
                    handleLinkClick();
                  }}
                >
                  <FiSettings className="mr-3" />
                  Settings
                </Link>
              </li>
            </ul>
          </nav>

          {user && (
            <button
              onClick={() => {
                handleLogout();
                handleLinkClick();
              }}
              className="flex items-center p-3 mt-auto text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <FiLogOut className="mr-3" />
              Logout
            </button>
          )}
        </div>
      </div>
    </>
  );
}
