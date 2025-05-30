import axios from "axios";
import { useEffect, useState } from "react";
import AdminDash from "./adminDash";
import AdminSide from "./adminSide";
import { FiSearch, FiUser, FiUsers, FiMail, FiFileText, FiEye, FiTrash2, FiShield, FiUserMinus } from "react-icons/fi";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [totpos,setTotalPosts] = useState([])
  const [findUser, setFindUser] = useState("");


   
//affichage dial users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/showUsers");
        setUsers(res.data); 
      } catch (err) {
        console.log(err);
      }
    };
    fetchUsers();
  }, []);
  //affichage dial posts
  useEffect(() => {
      const fetchPosts = async () => {
        try {
          const res = await axios.get("http://localhost:5000/api/posts/");
          setPosts(res.data);
        //   console.log(res.data);
        } catch (err) {
          console.log(err);
        }
      };
      fetchPosts();
    }, []);

    //affichage dial posts
   useEffect(() => {
  if (findUser === "") {
    const state = users.map(user => {
      const totPosts = posts.filter((post) => post.user._id === user._id).length;
      return {
        ...user,
        totPosts
      };
    });
    setTotalPosts(state);
  } else {
    const filterUsers = users.filter((user) =>
      user.username.toLowerCase().includes(findUser.toLocaleLowerCase()) ||
      user.email.toLowerCase().includes(findUser.toLocaleLowerCase()) ||
      user._id.toLowerCase().includes(findUser.toLocaleLowerCase())
    ).map(user => {
      const totPosts = posts.filter(post => post.user._id === user._id).length;
      return {
        ...user,
        totPosts
      };
    });
    setTotalPosts(filterUsers);
  }
}, [findUser, users, posts]);


console.log(findUser)
    const makeAdmin = async (userId) => {
        try{
            const res = await axios.put(`http://localhost:5000/api/admin/makeAdmin/${userId}`)
            setUsers((prevUsers) => prevUsers.map(user => user._id === userId ? { ...user, role: "admin" } : user));
        }
        catch(err){
            console.log(err)
        }
    }
    const removeAdmin = async (userId) => {
        try{
            const res = await axios.put(`http://localhost:5000/api/admin/removeAdmin/${userId}`)
            setUsers((prevUsers) => prevUsers.map(user => user._id === userId ? { ...user, role: "user" } : user));
        }
        catch(err){
            console.log(err)
        }
    }
    const deleteUser = async (userId) => {
        const confirmed = window.confirm("Are you sure you want to delete this user?");
        if (confirmed) {
          try {
            const userPosts = posts.filter(post => post.user._id === userId); 
            
            for (let post of userPosts) {
              await axios.delete(`http://localhost:5000/api/posts/${post._id}`);
            }
      
            const res = await axios.delete(`http://localhost:5000/api/admin/deleteUser/${userId}`);
            if (res.status === 200) {
              setUsers((prevUsers) => prevUsers.filter(user => user._id !== userId));
            }
          } catch (err) {
            console.log(err);
          }
        }
      };
      
      
    
    


  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <aside className="hidden md:block w-64 bg-white border-r shadow-lg p-4">
        <AdminSide />
      </aside>

      <main className="flex-1 p-4 sm:p-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 sm:p-10 border border-gray-100">
          {/* Header with Stats */}
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-6">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-2xl text-white shadow-lg">
                <FiUsers className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Manage Users
                </h1>
                <p className="text-sm text-gray-500 mt-1">Review and manage user accounts</p>
              </div>
            </div>
            <div className="relative w-full sm:w-auto">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                onChange={(e) => setFindUser(e.target.value)}
                type="text"
                placeholder="Search users..."
                className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all w-full sm:w-64 bg-white/50 backdrop-blur-sm"
              />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-80">Total Users</p>
                  <h3 className="text-2xl font-bold mt-1">{users.length}</h3>
                </div>
                <FiUsers className="w-8 h-8 opacity-80" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-80">Total Posts</p>
                  <h3 className="text-2xl font-bold mt-1">{posts.length}</h3>
                </div>
                <FiFileText className="w-8 h-8 opacity-80" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-80">Admin Users</p>
                  <h3 className="text-2xl font-bold mt-1">
                    {users.filter(user => user.role === "admin").length}
                  </h3>
                </div>
                <FiShield className="w-8 h-8 opacity-80" />
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-lg bg-white/50 backdrop-blur-sm">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 uppercase rounded-t-2xl">
                <tr>
                  <th className="px-6 py-4 font-semibold rounded-tl-2xl">ID</th>
                  <th className="px-6 py-4 font-semibold">Username</th>
                  <th className="px-6 py-4 font-semibold">Email</th>
                  <th className="px-6 py-4 font-semibold">Total Posts</th>
                  <th className="px-6 py-4 font-semibold rounded-tr-2xl">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {totpos.map((user, index) => (
                  <tr key={user._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-gray-600">{index + 1}</td>
                    <td className="px-6 py-4 font-medium text-gray-800">{user.username}</td>
                    <td className="px-6 py-4 text-gray-600">{user.email}</td>
                    <td className="px-6 py-4 text-gray-600">{user.totPosts}</td>
                    <td className="px-6 py-4 space-y-2 sm:space-y-0 sm:space-x-2 flex flex-col sm:flex-row">
                      <a
                        href={`/profile/${user._id}`}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-sm hover:shadow"
                      >
                        <FiEye className="w-4 h-4" />
                        View
                      </a>
                      <button
                        onClick={() => deleteUser(user._id)}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl hover:from-red-600 hover:to-pink-700 transition-all shadow-sm hover:shadow"
                      >
                        <FiTrash2 className="w-4 h-4" />
                        Delete
                      </button>
                      {user.role === "user" ? (
                        <button
                          onClick={() => makeAdmin(user._id)}
                          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-sm hover:shadow"
                        >
                          <FiShield className="w-4 h-4" />
                          Make Admin
                        </button>
                      ) : (
                        <button
                          onClick={() => removeAdmin(user._id)}
                          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-xl hover:from-yellow-600 hover:to-orange-700 transition-all shadow-sm hover:shadow"
                        >
                          <FiUserMinus className="w-4 h-4" />
                          Remove Admin
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
