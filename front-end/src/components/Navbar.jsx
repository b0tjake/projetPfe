import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useState, useEffect, useContext } from "react";
import { DarkModeContext } from "../assets/darkmode";
import { FiSun, FiMoon, FiHome, FiPlusSquare, FiHelpCircle, FiSearch, FiLogOut, FiUser, FiSettings, FiMessageSquare, FiBell } from "react-icons/fi";
import axios from 'axios';

const Navbar = ({ setLoading }) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext);

  const logOut = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/logout');
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

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      setUserData(decoded);
    }
  }, [token]);

  const bgColor = darkMode ? "bg-gray-900" : "bg-white";
  const textColor = darkMode ? "text-gray-100" : "text-gray-700";
  const hoverColor = darkMode ? "hover:text-white" : "hover:text-black";
  const inputBg = darkMode ? "bg-gray-800 border-gray-600 placeholder-gray-400" : "bg-white border-gray-300 placeholder-gray-500";

  return (
    <nav className={`${bgColor} shadow-md w-full fixed z-10`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img className="w-20 rounded-full" src="/src/assets/images/joualaLogo.png" alt="Logo" />
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
              <Link to="/notifications" className={`${textColor} ${hoverColor} px-3 py-2 rounded-md text-sm font-medium flex items-center`}>
                <FiBell className="h-5 w-5 mr-1" />
                Notifications
              </Link>
            </div>
          </div>

          {/* Search bar */}
          <div className="flex-1 flex items-center justify-center px-2 lg:ml-6 lg:justify-end">
            <div className="max-w-lg w-full lg:max-w-xs">
              <label htmlFor="search" className="sr-only">Search</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input id="search" name="search" type="search" placeholder="Search" className={`block w-full pl-10 pr-3 py-2 rounded-md leading-5 ${inputBg} focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm`} />
              </div>
            </div>
          </div>

          {/* Right section */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
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
                <button onClick={logOut} className="text-white hover:bg-red-400 bg-red-600 dark:hover:bg-red-700 px-3 py-2 rounded-md text-sm font-medium flex items-center">
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
            <button onClick={() => setShowMobileMenu(!showMobileMenu)} className={`inline-flex items-center justify-center p-2 rounded-md ${textColor} hover:bg-gray-100 focus:outline-none`}>
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
            <Link to="/" className={`${textColor} hover:bg-gray-100 block pl-3 pr-4 py-2 text-base font-medium flex items-center`}>
              <FiHome className="h-5 w-5 mr-2" />
              Home
            </Link>
            <Link to="/messages" className={`${textColor} hover:bg-gray-100 block pl-3 pr-4 py-2 text-base font-medium flex items-center`}>
              <FiMessageSquare className="h-5 w-5 mr-2" />
              Messages
            </Link>
            <Link to="/notifications" className={`${textColor} hover:bg-gray-100 block pl-3 pr-4 py-2 text-base font-medium flex items-center`}>
              <FiBell className="h-5 w-5 mr-2" />
              Notifications
            </Link>
            <Link to="/suggestions" className={`${textColor} hover:bg-gray-100 block pl-3 pr-4 py-2 text-base font-medium flex items-center`}>
              <FiHelpCircle className="h-5 w-5 mr-2" />
              Suggestions
            </Link>
            {token ? (
              <>
                <Link to={`/profile/${userData?.id}`} className={`${textColor} hover:bg-gray-100 block pl-3 pr-4 py-2 text-base font-medium flex items-center`}>
                  <FiUser className="h-5 w-5 mr-2" />
                  Profile
                </Link>
                <Link to="/settings" className={`${textColor} hover:bg-gray-100 block pl-3 pr-4 py-2 text-base font-medium flex items-center`}>
                  <FiSettings className="h-5 w-5 mr-2" />
                  Settings
                </Link>
                <button onClick={logOut} className={`${textColor} hover:bg-gray-100 block pl-3 pr-4 py-2 text-base font-medium w-full text-left flex items-center`}>
                  <FiLogOut className="h-5 w-5 mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className={`${textColor} hover:bg-gray-100 block pl-3 pr-4 py-2 text-base font-medium`}>Login</Link>
                <Link to="/register" className={`${textColor} hover:bg-gray-100 block pl-3 pr-4 py-2 text-base font-medium`}>Register</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
