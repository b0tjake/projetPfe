import axios from "axios";
import { useEffect, useState } from "react";
import AdminSide from "./adminSide";
import { useNavigate } from "react-router-dom";

export default function ManagePosts() {
  const [posts, setPosts] = useState([]);
  const [findPost, setFindPost] = useState("");
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
    if (findPost === "") {
      setTotPosts(posts);
    } else {
      const filteredPosts = posts.filter((post) =>
        post.user.username.toLowerCase().includes(findPost.toLowerCase()) ||
        post.content.toLowerCase().includes(findPost.toLowerCase())
      );
      setTotPosts(filteredPosts);
    }
  }, [findPost, posts]);

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
<div className="flex min-h-screen bg-gray-50">
  <aside className="hidden md:block w-64 bg-white border-r shadow-md p-4">
    <AdminSide />
  </aside>

  <main className="flex-1 p-4 sm:p-8">
    <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-10">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800 flex items-center gap-2">
          📝 Manage Posts
        </h1>
        <input
          onChange={(e) => setFindPost(e.target.value)}
          type="text"
          placeholder="Search Posts..."
          className="border rounded-lg px-8 py-2"
        />
      </div>
      <button
        className="bg-blue-600 p-2.5 text-white font-medium rounded-md mb-2 hover:bg-blue-700"
        onClick={() => navigate("/addPost")}
      >
        Add Post
      </button>

      {loading ? (
        <div className="skeleton-loader"></div> // Show loading while fetching or deleting
      ) : (
        <div className="overflow-x-auto mt-2 rounded-lg border">
          <table className="min-w-full bg-white text-sm text-left">
            <thead className="bg-gray-100 text-gray-700 uppercase">
              <tr>
                <th className="px-4 py-3">🆔 ID</th>
                <th className="px-4 py-3">📝 Writer</th>
                <th className="px-4 py-3">💬 Description</th>
                <th className="px-4 py-3">👍 Likes</th>
                <th className="px-4 py-3">💬 Comments</th>
                <th className="px-4 py-3">⚙️ Actions</th>
              </tr>
            </thead>
            <tbody>
              {totPosts.map((post, index) => (
                <tr key={post._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono">{index + 1}</td>
                  <td className="px-4 py-3">
                        <a className="text-blue-600 underline hover:text-blue-700" href={`/profile/${post.user._id}`}> {post.user.username} </a>
                  </td>
                  <td className="px-4 py-3">{post.content}</td>
                  <td className="px-4 py-3">{post.likes.length}</td>
                  <td className="px-4 py-3">{post.comments.length}</td>
                  <td className="px-4 py-3 space-y-2 sm:space-y-0 sm:space-x-2 flex flex-col sm:flex-row">
                    <button
                      onClick={() => deletePost(post._id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => navigate(`/posts/${post._id}`)}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  </main>
</div>

  );
}
