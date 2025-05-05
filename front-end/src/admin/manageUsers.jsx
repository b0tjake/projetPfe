import axios from "axios";
import { useEffect, useState } from "react";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [totpos,setTotalPosts] = useState([])
  const [admin, setAdmin] = useState(null);

   
//affichage dial users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/showUsers");
        setUsers(res.data); // adjust if it's res.data.users
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
        const state = users.map(user => {
            const totPosts  = posts.filter((post) => post.user._id === user._id).length
            return {
                ...user,
                totPosts
            }
        })
        setTotalPosts(state)
    },[users,posts])
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
            // أولاً: جبد البوستات ديال هاد اليوزر
            const userPosts = posts.filter(post => post.user._id === userId); // دير user._id ماشي userId مباشرة
            
            // ثانياً: مسح البوستات
            for (let post of userPosts) {
              await axios.delete(`http://localhost:5000/api/posts/${post._id}`);
            }
      
            // ثالثاً: مسح اليوزر من السيستم
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
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">👥 Manage Users</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-xl overflow-hidden">
          <thead className="bg-gray-200 text-gray-700 text-left">
            <tr>
              <th className="px-6 py-3">🆔 ID</th>
              <th className="px-6 py-3">🙍 Username</th>
              <th className="px-6 py-3">📧 Email</th>
              <th className="px-6 py-3">📦 Total Posts</th>
              <th className="px-6 py-3">⚙️ Actions</th>
            </tr>
          </thead>
          <tbody>
            {totpos.map((user,index) => (
              <tr key={user._id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4 font-mono">{(index+1)}</td>
                <td className="px-6 py-4">{user.username}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4 text-center"> {user.totPosts}</td>
                <td className="px-6 py-4 space-x-2">
                  <a href={`/profile/${user._id}`} className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">View</a>
                  <button onClick={() => deleteUser(user._id)} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">delete</button>
                  {user.role === "user" ? (
                    <button onClick={() => makeAdmin(user._id)} className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600">Make Admin</button>
                  ) : (
                    <button onClick={() => removeAdmin(user._id)} className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600">Remove Admin</button>
                  )}

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
