import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Sidebar from "../components/sideBar";
import { DarkModeContext } from "../assets/darkmode";
import { FiImage, FiUser, FiUpload, FiX } from "react-icons/fi";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState(null);
  const [commentInputs, setCommentInputs] = useState({});
  const [showComments, setShowComments] = useState({});
  const token = localStorage.getItem("token");
  const { darkMode } = useContext(DarkModeContext);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUser(decodedToken);
        setUserId(decodedToken.id);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, [token]);

  useEffect(() => {
    if (image) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(image);
    } else {
      setPreview(null);
    }
  }, [image]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/posts", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setPosts(response.data);
        const initialInputs = {};
        response.data.forEach((post) => {
          initialInputs[post._id] = "";
        });
        setCommentInputs(initialInputs);
      } catch (err) {
        setError("Failed to fetch posts.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    if (!user) {
      setError("Please log in to create a post.");
      setIsSubmitting(false);
      return;
    }

    if (!content.trim()) {
      setError("Post content cannot be empty.");
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append("user", user.id);
    formData.append("content", content);
    if (image) formData.append("image", image);

    try {
      const response = await axios.post("http://localhost:5000/api/posts", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.status === 201) {
        setContent("");
        setImage(null);
        setPreview(null);
        setPosts(prevPosts => [response.data, ...prevPosts]);
        setIsCreateModalOpen(false);
      }
    } catch (err) {
      console.error("Error creating post:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Error creating post, please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      const res = await axios.post("http://localhost:5000/api/posts/like", {
        postId,
        userId,
      });
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId
            ? {
                ...p,
                likes: res.data.likes,
                likesCount: res.data.likes.length,
              }
            : p
        )
      );
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const toggleComments = (postId) => {
    setShowComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleComment = async (postId) => {
    try {
      const textValue = commentInputs[postId];
      if (!textValue.trim()) return;

      const res = await axios.post("http://localhost:5000/api/posts/comment", {
        userId,
        postId,
        textValue,
      });

      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId
            ? {
                ...p,
                comments: res.data.comments || [],
                commentsCount: Array.isArray(res.data.comments)
                  ? res.data.comments.length
                  : 0,
              }
            : p
        )
      );

      setCommentInputs((prev) => ({
        ...prev,
        [postId]: "",
      }));
    } catch (err) {
      console.error("Error posting comment:", err);
    }
  };

  const handleCommentChange = (postId, value) => {
    setCommentInputs((prev) => ({
      ...prev,
      [postId]: value,
    }));
  };

  return (
    <div className={`min-h-screen flex ${darkMode ? 'bg-gray-900' : 'bg-[#f3f4f6]'}`}>
      {/* Sidebar */}
      <div className={`hidden lg:block h-full min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-800 border-r border-gray-700' : 'bg-white border-r border-gray-200'}`}>
        <Sidebar />
      </div>
      {/* Main content */}
      <div className="flex-1 p-4 md:p-8 flex justify-center">
        <div className="w-full max-w-2xl">
          {/* Create Post Button */}
          <div className={`py-3 mb-3 border-b transition-colors duration-300 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className={`w-full flex items-center rounded-xl shadow-sm border transition-all duration-200 hover:shadow-md ${darkMode ? 'bg-gray-900 border-gray-700 hover:bg-gray-800' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
            >
              <div className={`flex-1 rounded-full px-4 py-2.5 transition-colors duration-200 ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}`}>
                <span className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>What's on your mind?</span>
              </div>
              <div className={`ml-2 p-1.5 rounded-lg transition-colors duration-200 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <FiImage className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              </div>
            </button>
          </div>

          {error && (
            <div className={`mb-6 p-4 rounded-lg border transition-colors duration-300 ${darkMode ? 'bg-red-900 text-red-200 border-red-700' : 'bg-red-50 text-red-700 border-red-200'}`}>{error}</div>
          )}

          {/* Posts List */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No posts yet.</p>
            </div>
          ) : (
            posts.map((post) => (
              <div 
                key={post._id} 
                className={`mb-4 rounded-lg shadow-sm border overflow-hidden transition-all duration-300 ${
                  darkMode 
                    ? 'bg-gray-800 border-gray-700' 
                    : 'bg-white border-gray-200'
                }`}
              >
                {/* User info section with timestamp */}
                <div className="p-3">
                  <div className="flex items-center">
                    <Link to={`profile/${post.user?._id}`} className="flex-shrink-0">
                      <img 
                        src={`http://localhost:5000/${post.user?.image}`} 
                        alt="User" 
                        className="w-10 h-10 rounded-full object-cover" 
                      />
                    </Link>
                    <div className="flex-1 ml-3">
                      <Link 
                        to={`profile/${post.user?._id}`} 
                        className={`font-semibold text-[15px] hover:underline ${
                          darkMode ? 'text-gray-100' : 'text-gray-900'
                        }`}
                      >
                        {post.user?.fullname}
                      </Link>
                      <div className={`flex items-center text-[13px] ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        <span>{post.date}</span>
                        <span className="mx-1">•</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                    <button className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${darkMode ? 'hover:bg-gray-700' : ''}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Post content */}
                <div className="px-3 pb-3">
                  <p className={`text-[15px] leading-5 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                    {post.content}
                  </p>
                </div>

                {/* Post image */}
                {post.image && (
                  <div className="relative">
                    <img 
                      src={`http://localhost:5000/${post.image}`} 
                      alt="Post" 
                      className="w-full h-auto object-cover" 
                    />
                  </div>
                )}

                {/* Likes and comments count */}
                <div className={`px-3 py-2 border-b flex items-center justify-between text-[13px] ${
                  darkMode ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-500'
                }`}>
                  <div className="flex items-center">
                    <div className="flex items-center -space-x-1">
                      <div className="bg-blue-500 rounded-full p-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <span className="ml-2">{post.likesCount > 0 ? post.likesCount : ''} {post.likesCount === 1 ? "like" : post.likesCount > 1 ? "likes" : ""}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    {post.commentsCount > 0 && (
                      <button onClick={() => toggleComments(post._id)} className="hover:underline">
                        {post.commentsCount} {post.commentsCount === 1 ? "comment" : "comments"}
                      </button>
                    )}
                  </div>
                </div>

                {/* Action buttons */}
                <div className={`px-2 py-1 flex items-center justify-between ${
                  darkMode ? 'border-gray-700' : 'border-gray-200'
                }`}>
                  <button
                    onClick={() => handleLike(post._id)}
                    className={`flex items-center justify-center flex-1 py-2 rounded-md mx-1 hover:bg-gray-100 transition-colors ${
                      post.likes?.includes(userId) ? "text-blue-600" : ""
                    } ${darkMode ? 'hover:bg-gray-700' : ''}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-1 ${post.likes?.includes(userId) ? "fill-blue-600" : ""}`} viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                    <span className="text-[15px] font-medium">Like</span>
                  </button>

                  <button
                    onClick={() => toggleComments(post._id)}
                    className={`flex items-center justify-center flex-1 py-2 rounded-md mx-1 hover:bg-gray-100 transition-colors ${darkMode ? 'hover:bg-gray-700' : ''}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span className="text-[15px] font-medium">Comment</span>
                  </button>

                  <button className={`flex items-center justify-center flex-1 py-2 rounded-md mx-1 hover:bg-gray-100 transition-colors ${darkMode ? 'hover:bg-gray-700' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    <span className="text-[15px] font-medium">Share</span>
                  </button>
                </div>

                {/* Comments section */}
                {showComments[post._id] && (
                  <div className={`px-3 py-2 border-t ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                    {/* Existing comments */}
                    {post.comments?.length > 0 && (
                      <div className="space-y-2 mb-3">
                        {post.comments.map((comment, index) => (
                          <div key={index} className="flex items-start">
                            <Link to={`profile/${comment.user?._id}`} className="flex-shrink-0">
                              <img src={`http://localhost:5000/${comment.user?.image}`} alt="User" className="w-8 h-8 rounded-full object-cover" />
                            </Link>
                            <div className="flex-1 ml-2">
                              <div className={`inline-block px-3 py-2 rounded-2xl ${
                                darkMode ? 'bg-gray-700' : 'bg-gray-100'
                              }`}>
                                <Link to={`profile/${comment.user?._id}`} className={`font-semibold text-[13px] hover:underline ${
                                  darkMode ? 'text-gray-100' : 'text-gray-900'
                                }`}>
                                  {comment.user?.fullname}
                                </Link>
                                <p className={`text-[15px] mt-1 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                                  {comment.text}
                                </p>
                              </div>
                              <div className={`flex items-center mt-1 space-x-3 text-[12px] ${
                                darkMode ? 'text-gray-400' : 'text-gray-500'
                              }`}>
                                <button className="hover:underline font-semibold">Like</button>
                                <button className="hover:underline font-semibold">Reply</button>
                                <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {/* Comment input */}
                    <div className="flex items-center">
                      <img 
                        src={`http://localhost:5000/${jwtDecode(token)?.image}`} 
                        alt="User" 
                        className="w-8 h-8 rounded-full object-cover flex-shrink-0" 
                      />
                      <div className={`flex-1 flex rounded-full border overflow-hidden ml-2 ${
                        darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-200'
                      }`}>
                        <input
                          type="text"
                          value={commentInputs[post._id] || ""}
                          onChange={(e) => handleCommentChange(post._id, e.target.value)}
                          placeholder="Write a comment..."
                          className={`flex-1 px-4 py-2 text-[15px] focus:outline-none ${
                            darkMode ? 'bg-gray-700 text-gray-100 placeholder-gray-400' : 'bg-gray-100 text-gray-900 placeholder-gray-500'
                          }`}
                        />
                        <button
                          onClick={() => handleComment(post._id)}
                          className={`px-3 font-medium text-[15px] ${
                            darkMode ? 'text-blue-400 hover:bg-gray-600' : 'text-blue-600 hover:bg-gray-200'
                          }`}
                          disabled={!commentInputs[post._id]?.trim()}
                        >
                          Post
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Create Post Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`rounded-xl shadow-lg max-w-2xl w-full p-6 ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-xl font-semibold ${
                darkMode ? 'text-white' : 'text-gray-800'
              }`}>
                Create New Post
              </h2>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                className={`p-2 rounded-full ${
                  darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>
            <div className="space-y-4">
              {/* User info section */}
              <div className="flex items-center space-x-3 mb-4">
                  <img
                    src={`http://localhost:5000/${user.image}`}
                    alt="Profile"
                  className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
                />
                <div>
                  <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {user.fullname}
                  </h3>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    @{user.username}
                  </p>
                  </div>
              </div>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind?"
                className={`w-full p-4 rounded-lg resize-none ${
                  darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'
                } border focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                rows="4"
              />
              <div className="flex items-center justify-between">
                <button
                  onClick={() => document.getElementById('imageInput').click()}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                    darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <FiImage className="w-5 h-5" />
                  <span>Add Image</span>
                </button>
                <input
                  id="imageInput"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setImage(e.target.files[0])}
                />
                <button
                  onClick={handleSubmit}
                  disabled={!content.trim() || isSubmitting}
                  className={`px-6 py-2 rounded-lg ${
                    content.trim() && !isSubmitting
                      ? 'bg-blue-500 hover:bg-blue-600 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isSubmitting ? 'Posting...' : 'Post'}
                </button>
                </div>
                {preview && (
                  <div className="relative">
                    <img
                      src={preview}
                      alt="Preview"
                    className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => {
                        setImage(null);
                        setPreview(null);
                      }}
                    className="absolute top-2 right-2 p-1 rounded-full bg-red-500 text-white hover:bg-red-600"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
