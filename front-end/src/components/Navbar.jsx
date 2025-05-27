import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useState, useEffect, useContext } from "react";
import { DarkModeContext } from "../assets/darkmode";

const Navbar = ({ setLoading }) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { darkMode } = useContext(DarkModeContext);

  const logOut = () => {
    localStorage.removeItem("token");
    setLoading(true);
    setTimeout(() => {
      navigate("/login");
      setLoading(false);
    }, 1000);
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
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                Home
              </Link>
              <Link to="/addPost" className={`${textColor} ${hoverColor} px-3 py-2 rounded-md text-sm font-medium flex items-center`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Create post
              </Link>
              <Link to="/suggestions" className={`${textColor} ${hoverColor} px-3 py-2 rounded-md text-sm font-medium flex items-center`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
                Suggestions
              </Link>
            </div>
          </div>

          {/* Search bar */}
          <div className="flex-1 flex items-center justify-center px-2 lg:ml-6 lg:justify-end">
            <div className="max-w-lg w-full lg:max-w-xs">
              <label htmlFor="search" className="sr-only">Search</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input id="search" name="search" type="search" placeholder="Search" className={`block w-full pl-10 pr-3 py-2 rounded-md leading-5 ${inputBg} focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm`} />
              </div>
            </div>
          </div>

          {/* Right section */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {token ? (
              <>
                {userData && (
                  <Link to={`/profile/${userData.id}`} className={`${textColor} mr-3 px-3 py-2 rounded-md text-sm font-medium flex items-center`}>
                    <img className="w-10 h-10 rounded-full" src={`http://localhost:5000/${userData.image}`} alt="User" />
                  </Link>
                )}
                <button onClick={logOut} className="text-white hover:bg-red-400 bg-red-600 dark:hover:bg-red-700 px-3 py-2 rounded-md text-sm font-medium flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                  </svg>
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
            <Link to="/" className={`${textColor} hover:bg-gray-100 block pl-3 pr-4 py-2 text-base font-medium`}>Home</Link>
            <Link to="/addPost" className={`${textColor} hover:bg-gray-100 block pl-3 pr-4 py-2 text-base font-medium`}>Add Post</Link>
            <Link to="/suggestions" className={`${textColor} hover:bg-gray-100 block pl-3 pr-4 py-2 text-base font-medium`}>Suggestions</Link>
            {token ? (
              <>
                <Link to={`/profile/${userData?.id}`} className={`${textColor} hover:bg-gray-100 block pl-3 pr-4 py-2 text-base font-medium`}>Profile</Link>
                <button onClick={logOut} className={`${textColor} hover:bg-gray-100 block pl-3 pr-4 py-2 text-base font-medium w-full text-left`}>Logout</button>
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
