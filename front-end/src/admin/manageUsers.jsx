import axios from "axios";
import { useEffect, useState } from "react";
import AdminDash from "./adminDash";
import AdminSide from "./adminSide";

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
<div className="flex min-h-screen bg-gray-50">
  <aside className="hidden md:block w-64 bg-white border-r shadow-md p-4">
    <AdminSide />
  </aside>

  <main className="flex-1 p-4 sm:p-8">
    <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-10">
      <div className="flex items-center justify-between mb-4">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        👥 Manage Users
      </h1>
      <input onChange={(e) => setFindUser(e.target.value)} type="text" placeholder="Search..." className="border rounded-lg px-8 py-2" />
      </div>
      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full bg-white text-sm text-left">
          <thead className="bg-gray-100 text-gray-700 uppercase">
            <tr>
              <th className="px-4 py-3">🆔 ID</th>
              <th className="px-4 py-3">🙍 Username</th>
              <th className="px-4 py-3">📧 Email</th>
              <th className="px-4 py-3 text-center">📦 Total Posts</th>
              <th className="px-4 py-3">⚙️ Actions</th>
            </tr>
          </thead>
          <tbody>
            {totpos.map((user, index) => (
              <tr key={user._id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 font-mono">{index + 1}</td>
                <td className="px-4 py-3">{user.username}</td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3 text-center">{user.totPosts}</td>
                <td className="px-4 py-3 space-y-2 sm:space-y-0 sm:space-x-2 flex flex-col sm:flex-row">
                  <a
                    href={`/profile/${user._id}`}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-center"
                  >
                    View
                  </a>
                  <button
                    onClick={() => deleteUser(user._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-center"
                  >
                    Delete
                  </button>
                  {user.role === "user" ? (
                    <button
                      onClick={() => makeAdmin(user._id)}
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-center"
                    >
                      Make Admin
                    </button>
                  ) : (
                    <button
                      onClick={() => removeAdmin(user._id)}
                      className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 text-center"
                    >
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
