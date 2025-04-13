// // import React from "react";
// // import { Link, useNavigate } from "react-router-dom";
// // import { jwtDecode } from "jwt-decode";

// // export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
// //   const navigate = useNavigate();
// //   const token = localStorage.getItem("token");
// //   const user = token ? jwtDecode(token) : null;

// //   const handleLogout = () => {
// //     localStorage.removeItem("token");
// //     navigate("/login");
// //   };

// //   return (
// //     <div
// //       className={`${
// //         sidebarOpen ? "block" : "hidden"
// //       } md:block bg-white w-64 border-r border-gray-200 p-4 h-full z-8 mt-1`}
// //     >
// //       <div className="flex items-center justify-between mb-8">
// //         <h2 className="text-xl font-bold">Social App</h2>
// //         <button
// //           onClick={() => setSidebarOpen(false)}
// //           className="md:hidden text-gray-500 hover:text-gray-700"
// //         >
// //           <svg
// //             xmlns="http://www.w3.org/2000/svg"
// //             className="h-6 w-6"
// //             fill="none"
// //             viewBox="0 0 24 24"
// //             stroke="currentColor"
// //           >
// //             <path
// //               strokeLinecap="round"
// //               strokeLinejoin="round"
// //               strokeWidth={2}
// //               d="M6 18L18 6M6 6l12 12"
// //             />
// //           </svg>
// //         </button>
// //       </div>

// //       {user && (
// //         <div className="flex items-center mb-6">
// //           <img
// //             src={`http://localhost:5000/${user.image}`}
// //             alt="Profile"
// //             className="w-10 h-10 rounded-full"
// //           />
// //           <div className="ml-3">
// //             <p className="font-medium">{user.fullname}</p>
// //             <p className="text-sm text-gray-500">@{user.username}</p>
// //           </div>
// //         </div>
// //       )}

// //       <nav>
// //         <ul className="space-y-2">
// //           <li>
// //             <Link
// //               to="/"
// //               className="flex items-center p-2 text-blue-500 font-medium rounded hover:bg-blue-50"
// //               onClick={() => setSidebarOpen(false)}
// //             >
// //               <svg
// //                 xmlns="http://www.w3.org/2000/svg"
// //                 className="h-5 w-5 mr-3"
// //                 viewBox="0 0 20 20"
// //                 fill="currentColor"
// //               >
// //                 <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
// //               </svg>
// //               Home
// //             </Link>
// //           </li>
// //           <li>
// //             <Link
// //               to="/add-post"
// //               className="flex items-center p-2 text-gray-700 rounded hover:bg-gray-100"
// //               onClick={() => setSidebarOpen(false)}
// //             >
// //               <svg
// //                 xmlns="http://www.w3.org/2000/svg"
// //                 className="h-5 w-5 mr-3"
// //                 viewBox="0 0 20 20"
// //                 fill="currentColor"
// //               >
// //                 <path
// //                   fillRule="evenodd"
// //                   d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
// //                   clipRule="evenodd"
// //                 />
// //               </svg>
// //               Create Post
// //             </Link>
// //           </li>
// //           <li>
// //             <button
// //               onClick={handleLogout}
// //               className="w-full flex items-center p-2 text-gray-700 rounded hover:bg-gray-100"
// //             >
// //               <svg
// //                 xmlns="http://www.w3.org/2000/svg"
// //                 className="h-5 w-5 mr-3"
// //                 viewBox="0 0 20 20"
// //                 fill="currentColor"
// //               >
// //                 <path
// //                   fillRule="evenodd"
// //                   d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
// //                   clipRule="evenodd"
// //                 />
// //               </svg>
// //               Logout
// //             </button>
// //           </li>
// //         </ul>
// //       </nav>
// //     </div>
// //   );
// // }

// import React from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { jwtDecode } from "jwt-decode";

// export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");
//   const user = token ? jwtDecode(token) : null;

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate("/login");
//   };

//   return (
//     <div
//       className={`${
//         sidebarOpen ? "fixed inset-0 z-50 md:relative md:inset-auto" : "hidden"
//       } md:block bg-white w-64 border-r border-gray-200 p-4 h-full z-8 mt-1`}
//     >
//       {/* Overlay for mobile */}
//       {sidebarOpen && (
//         <div 
//           className="fixed inset-0 bg-black bg-opacity-50 md:hidden"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}
      
//       <div className="relative bg-white h-full">
//         <div className="flex items-center justify-between mb-8">
//           <h2 className="text-xl font-bold">Social App</h2>
//           <button
//             onClick={() => setSidebarOpen(false)}
//             className="md:hidden text-gray-500 hover:text-gray-700"
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-6 w-6"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M6 18L18 6M6 6l12 12"
//               />
//             </svg>
//           </button>
//         </div>

//         {user && (
//           <div className="flex items-center mb-6">
//             <img
//               src={`http://localhost:5000/${user.image}`}
//               alt="Profile"
//               className="w-10 h-10 rounded-full"
//             />
//             <div className="ml-3">
//               <p className="font-medium">{user.fullname}</p>
//               <p className="text-sm text-gray-500">@{user.username}</p>
//             </div>
//           </div>
//         )}

//         <nav>
//           <ul className="space-y-2">
//             <li>
//               <Link
//                 to="/"
//                 className="flex items-center p-2 text-blue-500 font-medium rounded hover:bg-blue-50"
//                 onClick={() => setSidebarOpen(false)}
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-5 w-5 mr-3"
//                   viewBox="0 0 20 20"
//                   fill="currentColor"
//                 >
//                   <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
//                 </svg>
//                 Home
//               </Link>
//             </li>
//             <li>
//               <Link
//                 to="/add-post"
//                 className="flex items-center p-2 text-gray-700 rounded hover:bg-gray-100"
//                 onClick={() => setSidebarOpen(false)}
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-5 w-5 mr-3"
//                   viewBox="0 0 20 20"
//                   fill="currentColor"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//                 Create Post
//               </Link>
//             </li>
//             <li>
//               <button
//                 onClick={handleLogout}
//                 className="w-full flex items-center p-2 text-gray-700 rounded hover:bg-gray-100"
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-5 w-5 mr-3"
//                   viewBox="0 0 20 20"
//                   fill="currentColor"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//                 Logout
//               </button>
//             </li>
//           </ul>
//         </nav>
//       </div>
//     </div>
//   );
// }

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = token ? jwtDecode(token) : null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:static transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out z-50 md:z-auto w-64 h-full bg-white border-r border-gray-200 flex-shrink-0`}
      >
        <div className="p-4 h-full flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold">Social App</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-gray-500 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {user && (
            <div className="flex items-center mb-6">
              <img
                src={`http://localhost:5000/${user.image}`}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="ml-3">
                <p className="font-medium">{user.fullname}</p>
                <p className="text-sm text-gray-500">@{user.username}</p>
              </div>
            </div>
          )}

          <nav className="flex-1">
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="flex items-center p-2 text-blue-500 font-medium rounded hover:bg-blue-50"
                  onClick={() => setSidebarOpen(false)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-3"
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
                  to="/add-post"
                  className="flex items-center p-2 text-gray-700 rounded hover:bg-gray-100"
                  onClick={() => setSidebarOpen(false)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-3"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Create Post
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center p-2 text-gray-700 rounded hover:bg-gray-100"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-3"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Logout
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}