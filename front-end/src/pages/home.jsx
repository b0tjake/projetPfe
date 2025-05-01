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
  const [showComments, setShowComments] = useState({}); // Track which posts show comments
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
        response.data.forEach((post) => {
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
    <div className="bg-[#f3f4f6]">
    <div className="flex min-h-screen bg-[#FCFCFB]">
      {/* Sidebar - hidden on mobile/tablet, doesn't take space */}
      <div className="hidden lg:block mt-10">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 p-4 md:p-8 flex justify-center">
        <div className="w-full max-w-2xl">
          {/* Create Post Button */}
          <div className="bg-white/80 py-3 mb-3 border-b border-gray-200">
            <Link
              to="/addPost"
              className="w-full bg-white p-3 rounded-xl shadow-sm border border-gray-200 flex items-center hover:bg-gray-50 transition-all duration-200 hover:shadow-md"
            >
              <img
                src={`http://localhost:5000/${jwtDecode(token)?.image}`}
                alt="User"
                className="w-10 h-10 rounded-full mr-3 object-cover border-2 border-blue-100"
              />
              <div className="flex-1 bg-gray-100 hover:bg-gray-200 rounded-full px-4 py-2.5 transition-colors duration-200">
                <span className="text-gray-500 text-sm font-medium">
                  What's on your mind?
                </span>
              </div>
              <div className="ml-2 p-1.5 rounded-lg bg-gray-100 transition-colors duration-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    className="bg-[#0077B6] hover:bg-[#006BA3]"
                  />
                </svg>
              </div>
            </Link>
          </div>

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
              <div
                key={post._id}
                className="bg-white rounded-xl shadow-md mb-1 border border-gray-200 overflow-hidden"
              >
                {/* User info section with timestamp */}
                <div className="flex items-center p-4 pb-2">
                  <Link
                    to={`profile/${post.user?._id}`}
                    className="flex-shrink-0"
                  >
                    <img
                      src={`http://localhost:5000/${post.user?.image}`}
                      alt="User"
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full mr-3 object-cover border-2 border-blue-100 shadow-sm"
                    />
                  </Link>
                  <div className="flex-1">
                    <Link
                      to={`profile/${post.user?._id}`}
                      className="font-semibold text-gray-800 text-sm sm:text-base hover:underline"
                    >
                      {post.user?.fullname}
                    </Link>
                    <div className="flex items-center text-gray-500 text-xs mt-1">
                      <span>
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                      <span className="mx-1">•</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Post content */}
                <div className="px-4 pb-2">
                  <p className="text-gray-800 text-sm sm:text-base leading-relaxed">
                    {post.content}
                  </p>
                </div>

                {/* Post image */}
                {post.image && (
                  <div className="border-t border-b border-gray-100">
                    <img
                      src={`http://localhost:5000/${post.image}`}
                      alt="Post"
                      className="w-full h-auto object-cover max-h-[500px]"
                    />
                  </div>
                )}

                {/* Likes and comments count */}
                <div className="px-4 pt-2 pb-1 border-b border-gray-100 flex items-center justify-between text-sm text-gray-500">
                  {post.likesCount > 0 && (
                    <div className="flex items-center">
                      <div className="flex items-center -space-x-1">
                        <div className="bg-blue-500 rounded-full p-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3 text-white"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        {/* <div className="bg-red-500 rounded-full p-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3 text-white"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path
                              fillRule="evenodd"
                              d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div> */}
                      </div>
                      <span className="ml-2">
                        {post.likesCount}{" "}
                        {post.likesCount === 1 ? "like" : "likes"}
                      </span>
                    </div>
                  )}
                  {post.commentsCount > 0 && (
                    <button
                      onClick={() => toggleComments(post._id)}
                      className="hover:underline"
                    >
                      {post.commentsCount}{" "}
                      {post.commentsCount === 1 ? "comment" : "comments"}
                    </button>
                  )}
                </div>

                {/* Action buttons */}
                <div className="px-2 py-1 flex items-center justify-between text-gray-500">
                  <button
                    onClick={() => handleLike(post._id)}
                    className={`flex items-center justify-center flex-1 py-2 rounded-md mx-1 hover:bg-gray-100 transition-colors ${
                      post.likes?.includes(userId) ? "text-blue-600" : ""
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-5 w-5 mr-1 ${
                        post.likes?.includes(userId) ? "fill-blue-600" : ""
                      }`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {/* <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-5 w-5 mr-1 ${
                        post.likes?.includes(userId) ? "fill-blue-600" : ""
                      }`}
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={post.likes?.includes(userId) ? 0 : 1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                      />
                    </svg> */}
                    <span className="text-sm font-medium">Like</span>
                  </button>

                  <button
                    onClick={() => toggleComments(post._id)}
                    className="flex items-center justify-center flex-1 py-2 rounded-md mx-1 hover:bg-gray-100 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    <span className="text-sm font-medium">Comment</span>
                  </button>

                  <button className="flex items-center justify-center flex-1 py-2 rounded-md mx-1 hover:bg-gray-100 transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                      />
                    </svg>
                    <span className="text-sm font-medium">Share</span>
                  </button>
                </div>

                {/* Comments section - only shown when toggled */}
                {showComments[post._id] && (
                  <div className="bg-gray-50 px-4 py-2 border-t border-gray-100">
                    {/* Existing comments */}
                    {post.comments?.length > 0 && (
                      <div className="space-y-3 mb-3">
                        {post.comments.map((comment, index) => (
                          <div key={index} className="flex items-start">
                            <Link
                              to={`profile/${comment.user?._id}`}
                              className="flex-shrink-0"
                            >
                              <img
                                src={`http://localhost:5000/${comment.user?.image}`}
                                alt="User"
                                className="w-8 h-8 rounded-full mr-2 object-cover border border-gray-200"
                              />
                            </Link>
                            <div className="flex-1">
                              <div className="bg-white p-3 rounded-lg shadow-sm">
                                <Link
                                  to={`profile/${comment.user?._id}`}
                                  className="font-semibold text-sm hover:underline"
                                >
                                  {comment.user?.fullname}
                                </Link>
                                <p className="text-sm text-gray-700 mt-1">
                                  {comment.text}
                                </p>
                                <div className="flex items-center mt-2 text-xs text-gray-500 space-x-3">
                                  <button className="hover:underline">
                                    Like
                                  </button>
                                  <span>
                                    {new Date(
                                      comment.createdAt
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Comment input */}
                    <div className="flex items-start">
                      <img
                        src={`http://localhost:5000/${jwtDecode(token)?.image}`}
                        alt="User"
                        className="w-8 h-8 rounded-full mr-2 object-cover border border-gray-200 flex-shrink-0"
                      />
                      <div className="flex-1 flex bg-white rounded-full border border-gray-200 overflow-hidden">
                        <input
                          type="text"
                          value={commentInputs[post._id] || ""}
                          onChange={(e) =>
                            handleCommentChange(post._id, e.target.value)
                          }
                          placeholder="Write a comment..."
                          className="flex-1 px-4 py-2 text-sm focus:outline-none"
                        />
                        <button
                          onClick={() => handleComment(post._id)}
                          className="px-3 text-blue-500 font-medium hover:bg-gray-50 transition-colors"
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
    </div>
    </div>
  );
}
