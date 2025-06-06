import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useState, useEffect, useContext, useRef } from "react";
import { DarkModeContext } from "../assets/darkmode";
import { FiSun, FiMoon, FiHome, FiPlusSquare, FiHelpCircle, FiSearch, FiLogOut, FiUser, FiSettings, FiMessageSquare, FiBell, FiUserPlus, FiHeart, FiMessageCircle } from "react-icons/fi";
import axios from 'axios';

const Navbar = ({ setLoading }) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [userData, setUserData] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const notificationRef = useRef(null);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext);

  useEffect(() => {
    // Close notifications when clicking outside
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      setUserData(decoded);
      fetchNotifications(decoded.id);
    }
  }, [token]);

  const fetchNotifications = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/profile/profile/${userId}`);
      const user = response.data.user;
      
      // Get friend requests
      const friendRequests = await Promise.all(
        user.friendRequestsReceived.map(async (senderId) => {
          const senderResponse = await axios.get(`http://localhost:5000/api/profile/profile/${senderId}`);
          return {
            id: Date.now() + Math.random(),
            type: 'friend_request',
            sender: senderResponse.data.user,
            timestamp: new Date(),
            read: false
          };
        })
      );

      // Combine all notifications and sort by timestamp
      const allNotifications = [
        ...friendRequests,
        // Add other types of notifications here when implemented
      ].sort((a, b) => b.timestamp - a.timestamp);

      setNotifications(allNotifications);
      setUnreadCount(allNotifications.filter(n => !n.read).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    setShowNotifications(false);
    
    // Handle different notification types
    switch (notification.type) {
      case 'friend_request':
        navigate(`/profile/${notification.sender._id}`);
        break;
      // Add other cases when implementing more notification types
      default:
        break;
    }
  };

  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(date).toLocaleDateString();
  };

  const logOut = async () => {
    try {
      // await axios.post('http://localhost:5000/api/auth/logout');
      localStorage.removeItem("token");
      setLoading(true);
      setTimeout(() => {
        navigate("/login");
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const bgColor = darkMode ? "bg-gray-900" : "bg-white";
  const textColor = darkMode ? "text-gray-100" : "text-gray-700";
  const hoverColor = darkMode ? "hover:text-white" : "hover:text-black";
  const inputBg = darkMode ? "bg-gray-800 border-gray-600 placeholder-gray-400" : "bg-white border-gray-300 placeholder-gray-500";

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5000/api/profile/search?query=${encodeURIComponent(query)}`);
      setSearchResults(response.data.users);
      setShowSearchResults(true);
    } catch (error) {
      console.error('Error searching users:', error);
      setSearchResults([]);
    }
  };

  const handleUserClick = (userId) => {
    setShowSearchResults(false);
    setSearchQuery('');
    navigate(`/profile/${userId}`);
  };

  return (
    <nav className={`${bgColor} shadow-md w-full fixed z-10`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img className="w-20 rounded-full" src="/src/assets/images/Logo2.png" alt="Logo" />
            </Link>

            <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
              <Link to="/" className={`${textColor} ${hoverColor} px-3 py-2 rounded-md text-sm font-medium flex items-center`}>
                <FiHome className="h-5 w-5 mr-1" />
                Home
              </Link>
              <Link to="/suggestions" className={`${textColor} ${hoverColor} px-3 py-2 rounded-md text-sm font-medium flex items-center`}>
                <FiHelpCircle className="h-5 w-5 mr-1" />
                Suggestions
              </Link>
            </div>
          </div>

          {/* Search bar */}
          <div className="flex-1 flex items-center justify-center px-2 lg:ml-6 lg:justify-end">
            <div className="max-w-lg w-full lg:max-w-xs" ref={searchRef}>
              <label htmlFor="search" className="sr-only">Search users</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="search"
                  name="search"
                  type="search"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className={`block w-full pl-10 pr-3 py-2 rounded-md leading-5 ${inputBg} focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                />
              </div>

              {/* Search Results */}
              {showSearchResults && searchResults.length > 0 && (
                <div className={`absolute mt-2 w-full rounded-md shadow-lg ${
                  darkMode ? 'bg-gray-800' : 'bg-white'
                } ring-1 ring-black ring-opacity-5 z-50 max-h-96 overflow-y-auto`}>
                  <div className="py-2">
                    {searchResults.map((user) => (
                      <div
                        key={user._id}
                        onClick={() => handleUserClick(user._id)}
                        className={`px-4 py-3 hover:${darkMode ? 'bg-gray-700' : 'bg-gray-50'} cursor-pointer`}
                      >
                        <div className="flex items-center space-x-3">
                          <img
                            src={`http://localhost:5000/${user.image}`}
                            alt={user.fullname}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium ${textColor} truncate`}>
                              {user.fullname}
                            </p>
                            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} truncate`}>
                              @{user.username}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {showSearchResults && searchQuery && searchResults.length === 0 && (
                <div className={`absolute mt-2 w-full rounded-md shadow-lg ${
                  darkMode ? 'bg-gray-800' : 'bg-white'
                } ring-1 ring-black ring-opacity-5 z-50`}>
                  <div className="px-4 py-3 text-sm text-gray-500">
                    No users found
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right section */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {/* Notifications */}
            {token && (
              <div className="relative" ref={notificationRef}>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className={`relative p-2 rounded-full ${textColor} ${hoverColor}`}
                >
                  <FiBell className="h-6 w-6" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className={`absolute right-0 mt-2 w-80 rounded-md shadow-lg ${
                    darkMode ? 'bg-gray-800' : 'bg-white'
                  } ring-1 ring-black ring-opacity-5 z-50`}>
                    <div className="py-2">
                      <div className={`px-4 py-2 border-b ${
                        darkMode ? 'border-gray-700' : 'border-gray-200'
                      }`}>
                        <h3 className={`text-sm font-semibold ${textColor}`}>Notifications</h3>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length > 0 ? (
                          notifications.map(notification => (
                            <div
                              key={notification.id}
                              onClick={() => handleNotificationClick(notification)}
                              className={`px-4 py-3 hover:${darkMode ? 'bg-gray-700' : 'bg-gray-50'} cursor-pointer ${
                                !notification.read ? (darkMode ? 'bg-gray-700/50' : 'bg-blue-50') : ''
                              }`}
                            >
                              <div className="flex items-center">
                                {notification.type === 'friend_request' && (
                                  <>
                                    <img
                                      src={`http://localhost:5000/${notification.sender.image}`}
                                      alt=""
                                      className="h-8 w-8 rounded-full"
                                    />
                                    <div className="ml-3 flex-1">
                                      <p className={`text-sm ${textColor}`}>
                                        <span className="font-medium">{notification.sender.fullname}</span>
                                        {' sent you a friend request'}
                                      </p>
                                      <p className={`text-xs ${
                                        darkMode ? 'text-gray-400' : 'text-gray-500'
                                      }`}>
                                        {formatTimeAgo(notification.timestamp)}
                                      </p>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-3 text-sm text-gray-500">
                            No notifications
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Dark mode toggle button */}
            <button
              onClick={toggleDarkMode}
              className={`mr-3 p-2 rounded-full border transition-colors duration-200 ${darkMode ? 'bg-gray-800 border-gray-700 text-yellow-300 hover:bg-gray-700' : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'}`}
              aria-label="Toggle dark mode"
              type="button"
            >
              {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>
            {token ? (
              <>
                {userData && (
                  <Link to={`/profile/${userData.id}`} className={`${textColor} mr-3 px-3 py-2 rounded-md text-sm font-medium flex items-center`}>
                    <img className="w-10 h-10 rounded-full" src={`http://localhost:5000/${userData.image}`} alt="User" />
                  </Link>
                )}
                <button onClick={logOut} className="text-white hover:bg-[#005885] bg-[#0077B6] px-3 py-2 rounded-md text-sm font-medium flex items-center">
                  <FiLogOut className="h-5 w-5 mr-1" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className={`${textColor} ${hoverColor} px-3 py-2 rounded-md text-sm font-medium`}>Login</Link>
                <Link to="/register" className="ml-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium">Register</Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="-mr-2 flex items-center sm:hidden">
            <button onClick={() => setShowMobileMenu(!showMobileMenu)} className={`inline-flex items-center justify-center p-2 rounded-md ${darkMode ? 'text-gray-100 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'} focus:outline-none`}>
              <span className="sr-only">Open main menu</span>
              {showMobileMenu ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {showMobileMenu && (
        <div className={`sm:hidden absolute z-10 ${bgColor} w-full flex justify-center`}>
          <div className="pt-2 pb-3 space-y-1">
            <Link to="/" className={`${textColor} ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} block pl-3 pr-4 py-2 text-base font-medium flex items-center`}>
              <FiHome className={`h-5 w-5 mr-2 ${darkMode ? 'text-gray-100' : 'text-gray-700'}`} />
              Home
            </Link>
            <Link to="/messages" className={`${textColor} ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} block pl-3 pr-4 py-2 text-base font-medium flex items-center`}>
              <FiMessageSquare className={`h-5 w-5 mr-2 ${darkMode ? 'text-gray-100' : 'text-gray-700'}`} />
              Messages
            </Link>
            <Link to="/suggestions" className={`${textColor} ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} block pl-3 pr-4 py-2 text-base font-medium flex items-center`}>
              <FiHelpCircle className={`h-5 w-5 mr-2 ${darkMode ? 'text-gray-100' : 'text-gray-700'}`} />
              Suggestions
            </Link>
            {token ? (
              <>
                <Link to={`/profile/${userData?.id}`} className={`${textColor} ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} block pl-3 pr-4 py-2 text-base font-medium flex items-center`}>
                  <FiUser className={`h-5 w-5 mr-2 ${darkMode ? 'text-gray-100' : 'text-gray-700'}`} />
                  Profile
                </Link>
                <Link to="/settings" className={`${textColor} ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} block pl-3 pr-4 py-2 text-base font-medium flex items-center`}>
                  <FiSettings className={`h-5 w-5 mr-2 ${darkMode ? 'text-gray-100' : 'text-gray-700'}`} />
                  Settings
                </Link>
                <button onClick={logOut} className="text-white hover:bg-[#005885] bg-[#0077B6] block pl-3 pr-4 py-2 text-base font-medium w-full text-left flex items-center">
                  <FiLogOut className="h-5 w-5 mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className={`${textColor} ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} block pl-3 pr-4 py-2 text-base font-medium`}>Login</Link>
                <Link to="/register" className={`${textColor} ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} block pl-3 pr-4 py-2 text-base font-medium`}>Register</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
