// import React, { useEffect, useState } from "react";
// import axios from "axios";

// export default function UserSpace() {
//   const [users, setUsers] = useState([]);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const res = await axios.get("http://localhost:5000/api/users");
//         setUsers(res.data);
//       } catch (err) {
//         setError("Failed to fetch users.");
//         console.error(err);
//       }
//     };

//     fetchUsers();
//   }, []);

//   const handleAddFriend = (userId) => {
//     // هنا ممكن تضيف طلب API
//     console.log("Add friend with ID:", userId);
//   };

//   return (
//     <div className="bg-white p-4 rounded shadow mb-6">
//       <h2 className="text-lg font-bold mb-4">Suggested Friends</h2>
//       {error && <p className="text-red-500">{error}</p>}
//       {users.length === 0 ? (
//         <p>No users found.</p>
//       ) : (
//         users.map((user) => (
//           <div
//             key={user._id}
//             className="flex items-center justify-between bg-gray-100 p-3 rounded-lg mb-2"
//           >
//             <div className="flex items-center">
//               <img
//                 src={`http://localhost:5000/${user.image}`}
//                 alt="User"
//                 className="w-10 h-10 rounded-full mr-3"
//               />
//               <span className="font-medium">{user.fullname}</span>
//             </div>
//             <button
//               onClick={() => handleAddFriend(user._id)}
//               className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
//             >
//               Add Friend
//             </button>
//           </div>
//         ))
//       )}
//     </div>
//   );
// }
