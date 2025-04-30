import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Sidebar from "../components/sideBar";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState(null);
  const [commentInputs, setCommentInputs] = useState({});
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      setUserId(decoded.id);
    }
  }, [token]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/posts");
        setPosts(response.data);
        const initialInputs = {};
        response.data.forEach(post => {
          initialInputs[post._id] = "";
        });
        setCommentInputs(initialInputs);
      } catch (err) {
        setError("Failed to fetch posts.");
        console.error(err);
      }
    };

    fetchPosts();
  }, []);

  const handleLike = async (postId) => {
    try {
      const res = await axios.post("http://localhost:5000/api/posts/like", { postId, userId });
      setPosts(prev =>
        prev.map(p =>
          p._id === postId
            ? {
                ...p,
                likes: res.data.likes,
                likesCount: res.data.likes.length
              }
            : p
        )
      );
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleComment = async (postId) => {
    try {
      const textValue = commentInputs[postId];
      if (!textValue.trim()) return;

      const res = await axios.post("http://localhost:5000/api/posts/comment", {
        userId,
        postId,
        textValue
      });

      setPosts(prev =>
        prev.map(p =>
          p._id === postId
            ? {
                ...p,
                comments: res.data.comments || [],
                commentsCount: Array.isArray(res.data.comments) ? res.data.comments.length : 0
                
              }
            : p
        )
      );

      setCommentInputs(prev => ({
        ...prev,
        [postId]: ""
      }));
    } catch (err) {
      console.error("Error posting comment:", err);
    }
  };

  const handleCommentChange = (postId, value) => {
    setCommentInputs(prev => ({
      ...prev,
      [postId]: value
    }));
  };

  return (
    <div className="flex min-h-screen bg-[#f3f4f6]">
      {/* Sidebar on the left */}
      <div className="w-64 ">
        <Sidebar />
      </div>

      {/* Main content on the right */}
      <div className="flex-1 p-8 flex justify-center">
        <div className="w-full md:max-w-2xl">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No posts yet.</p>
            </div>
          ) : (
            posts.map((post) => (
              <div key={post._id} className="bg-white p-6 rounded-xl shadow-sm mb-6 border border-gray-100">
                <div className="flex items-center mb-4">
                  <Link to={`profile/${post.user?._id}`}>
                  <img
                    src={`http://localhost:5000/${post.user?.image}`}
                    alt="User"
                    className="w-12 h-12 rounded-full mr-3 object-cover border-2 border-white shadow"
                  />
                  
                  </Link>
                  <a href={`profile/${post.user?._id}`} className="font-semibold text-gray-800">{post.user?.fullname}</a>
                </div>

                <p className="mb-4 text-gray-700">{post.content}</p>

                {post.image && (
                  <img
                    src={`http://localhost:5000/${post.image}`}
                    alt="Post"
                    className="w-full h-auto rounded-lg mb-4 object-cover max-h-96"
                  />
                )}

                <div className="flex items-center justify-between pt-3 pb-3 border-t border-gray-100">
                  <button
                    onClick={() => handleLike(post._id)}
                    className="flex items-center px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-5 w-5 mr-2 ${post.likes?.includes(userId) ? 'text-blue-500 fill-blue-500' : 'text-gray-500'}`}
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                        />
                      </svg>
                      <span className={`text-sm font-medium ${post.likes?.includes(userId) ? 'text-blue-500' : 'text-gray-600'}`}>
                        {post.likes?.includes(userId) ? 'Liked' : 'Like'}
                      </span>
                    </div>
                    {post.likesCount > 0 && (
                      <span className="ml-2 text-xs font-medium bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
                        {post.likesCount}
                      </span>
                    )}
                  </button>

                  <button className="flex items-center px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors group">
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-500 mr-2 group-hover:text-blue-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                      <span className="text-sm font-medium text-gray-600 group-hover:text-blue-500">Comment</span>
                    </div>
                    {post.commentsCount > 0 && (
                      <span className="ml-2 text-xs font-medium bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
                        {post.commentsCount}
                      </span>
                    )}
                  </button>

                  <button className="flex items-center px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors group">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-500 mr-2 group-hover:text-green-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                      />
                    </svg>
                    <span className="text-sm font-medium text-gray-600 group-hover:text-green-500">Share</span>
                  </button>
                </div>

                {post.comments?.length > 0 && (
                  <div className="mt-4 space-y-3">
                    {post.comments.map((comment, index) => (
                      <div key={index} className="flex items-start">
                        <Link to={`profile/${comment.user?._id}`}>
                        <img
                          src={`http://localhost:5000/${comment.user?.image}`}
                          alt="User"
                          className="w-8 h-8 rounded-full mr-2 object-cover"
                        />
                        
                        </Link>
                        {/* {console.log(posts)} */}
                        <div className="bg-gray-50 p-3 rounded-lg flex-1">
                          <a href={`profile/${comment.user?._id}`} className="font-semibold text-sm">{comment.user?.fullname}</a>
                          <p className="text-sm text-gray-700">{comment.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-4 flex">
                  <input
                    type="text"
                    value={commentInputs[post._id] || ""}
                    onChange={(e) => handleCommentChange(post._id, e.target.value)}
                    placeholder="Write a comment..."
                    className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={() => handleComment(post._id)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-lg transition-colors"
                  >
                    Post
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
