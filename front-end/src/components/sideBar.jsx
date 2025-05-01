import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";

export default function Sidebar() {
  const [user, setUser] = useState(null);
  const [activeItem, setActiveItem] = useState("home");

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

  return (
    <div className="hidden lg:block w-96 bg-white shadow-lg">
      <div className="p-4 flex flex-col h-full">
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
              <Link to={`profile/${user.id}`}>
                <h1 className="font-medium text-[#000]">{user.fullname}</h1>
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
                onClick={() => setActiveItem("home")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/friends"
                className={`flex items-center p-3 rounded-lg ${
                  activeItem === "friends"
                    ? "bg-[#CCE3F0] text-[#000]"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setActiveItem("friends")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M13 7a3 3 0 11-6 0 3 3 0 016 0zM3 14a4 4 0 018-1.465A4 4 0 0117 14v1a1 1 0 01-1 1H4a1 1 0 01-1-1v-1z" />
                </svg>
                Friends
              </Link>
            </li>
            <li>
              <Link
                to="/messages"
                className={`flex items-center p-3 rounded-lg ${
                  activeItem === "messages"
                    ? "bg-[#CCE3F0] text-[#000]"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setActiveItem("messages")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                    clipRule="evenodd"
                  />
                </svg>
                Messages
              </Link>
            </li>
            <li>
              <Link
                to="/notifications"
                className={`flex items-center p-3 rounded-lg ${
                  activeItem === "notifications"
                    ? "bg-[#CCE3F0] text-[#000]"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setActiveItem("notifications")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
                Notifications
              </Link>
            </li>
            <li>
              <Link
                to="/save"
                className={`flex items-center p-3 rounded-lg ${
                  activeItem === "save"
                    ? "bg-[#CCE3F0] text-[#000]"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setActiveItem("save")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                </svg>
                Save
              </Link>
            </li>
            <li>
              <Link
                to="/settings"
                className={`flex items-center p-3 rounded-lg ${
                  activeItem === "settings"
                    ? "bg-[#CCE3F0] text-[#000]"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setActiveItem("settings")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                    clipRule="evenodd"
                  />
                </svg>
                Settings
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}