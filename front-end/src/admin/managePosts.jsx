import axios from "axios";
import { useEffect, useState } from "react";
import AdminSide from "./adminSide";
import { useNavigate } from "react-router-dom";
import { 
  FiSearch, 
  FiPlus, 
  FiTrash2, 
  FiEdit, 
  FiFileText, 
  FiImage, 
  FiHeart, 
  FiFilter,
  FiRefreshCw,
  FiEye
} from "react-icons/fi";

export default function ManagePosts() {
  const [posts, setPosts] = useState([]);
  const [findPost, setFindPost] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [totPosts, setTotPosts] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  // Fetching all posts
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:5000/api/admin/getPosts");
        setPosts(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // Filtering posts
  useEffect(() => {
    let filteredPosts = posts;

    // Apply search filter
    if (findPost !== "") {
      filteredPosts = filteredPosts.filter((post) =>
        post.user.username.toLowerCase().includes(findPost.toLowerCase()) ||
        post.content.toLowerCase().includes(findPost.toLowerCase())
      );
    }

    // Apply image filter
    if (filterType === "withImage") {
      filteredPosts = filteredPosts.filter((post) => post.image);
    } else if (filterType === "withoutImage") {
      filteredPosts = filteredPosts.filter((post) => !post.image);
    }

    setTotPosts(filteredPosts);
  }, [findPost, filterType, posts]);

  // Delete post
  const deletePost = async (postId) => {
    const confirmed = window.confirm("Are you sure you want to delete this post?");
    if (confirmed) {
      setLoading(true); // Set loading when deleting
      try {
        await axios.delete(`http://localhost:5000/api/posts/${postId}`);
        setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false); // Hide loading after deletion
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
                <FiFileText className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Manage Posts
                </h1>
                <p className="text-sm text-gray-500 mt-1">Review and manage user posts</p>
              </div>
            </div>
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  onChange={(e) => setFindPost(e.target.value)}
                  type="text"
                  placeholder="Search posts..."
                  className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all w-full sm:w-64 bg-white/50 backdrop-blur-sm"
                />
              </div>
              <button
                onClick={() => {
                  // Implement the fetchPosts function
                }}
                className="p-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
              >
                <FiRefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-80">Total Posts</p>
                  <h3 className="text-2xl font-bold mt-1">{posts.length}</h3>
                </div>
                <FiFileText className="w-8 h-8 opacity-80" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-80">Posts with Images</p>
                  <h3 className="text-2xl font-bold mt-1">
                    {posts.filter(post => post.image).length}
                  </h3>
                </div>
                <FiImage className="w-8 h-8 opacity-80" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-80">Total Likes</p>
                  <h3 className="text-2xl font-bold mt-1">
                    {posts.reduce((acc, post) => acc + post.likes.length, 0)}
                  </h3>
                </div>
                <FiHeart className="w-8 h-8 opacity-80" />
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
            <div className="relative w-full sm:w-auto">
              <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all w-full sm:w-48 bg-white/50 backdrop-blur-sm"
              >
                <option value="all">All Posts</option>
                <option value="withImage">With Images</option>
                <option value="withoutImage">Without Images</option>
              </select>
            </div>
            <button 
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 p-2.5 text-white font-medium rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl w-full sm:w-auto"
              onClick={() => navigate("/addPost")}
            >
              <FiPlus className="w-5 h-5" />
              Add Post
            </button>
          </div>

          {/* Posts List */}
          <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-lg bg-white/50 backdrop-blur-sm">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 uppercase rounded-t-2xl">
                <tr>
                  <th className="px-6 py-4 font-semibold rounded-tl-2xl">ID</th>
                  <th className="px-6 py-4 font-semibold">Writer</th>
                  <th className="px-6 py-4 font-semibold">Description</th>
                  <th className="px-6 py-4 font-semibold">Likes</th>
                  <th className="px-6 py-4 font-semibold">Comments</th>
                  <th className="px-6 py-4 font-semibold rounded-tr-2xl">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {totPosts.map((post, index) => (
                  <tr key={post._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-gray-600">{index + 1}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={post.user.profilePicture ? `http://localhost:5000/${post.user.profilePicture}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(post.user.username)}&background=random`}
                          alt={post.user.username}
                          className="w-8 h-8 rounded-full object-cover border border-gray-200"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(post.user.username)}&background=random`;
                          }}
                        />
                        <a className="text-blue-600 hover:text-blue-700" href={`/profile/${post.user._id}`}>
                          {post.user.username}
                        </a>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{post.content}</td>
                    <td className="px-6 py-4 text-gray-600">{post.likes.length}</td>
                    <td className="px-6 py-4 text-gray-600">{post.comments.length}</td>
                    <td className="px-6 py-4 space-y-2 sm:space-y-0 sm:space-x-2 flex flex-col sm:flex-row">
                      <button
                        onClick={() => navigate(`/posts/${post._id}`)}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-sm hover:shadow"
                      >
                        <FiEye className="w-4 h-4" />
                        View
                      </button>
                      <button
                        onClick={() => deletePost(post._id)}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl hover:from-red-600 hover:to-pink-700 transition-all shadow-sm hover:shadow"
                      >
                        <FiTrash2 className="w-4 h-4" />
                        Delete
                      </button>
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
