import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/sideBar";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/posts/");
        setPosts(response.data);
      } catch (err) {
        setError("Failed to fetch posts.");
        console.error(err.response.data);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="flex justify-center bg-[#FCFCFB]">
      <div className="">
      <Sidebar/>
      </div>
    <div className="max-w-3xl mx-auto p-4">

      {error && <p className="text-red-500">{error}</p>}

      {posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        posts.map((post) => (
          <div key={post._id} className="bg-white p-4 shadow rounded-lg mb-3">
          <div className="flex items-center mb-2">
            <img
              src={`http://localhost:5000/${post.user?.image}`}
              alt="User"
              className="w-10 h-10 rounded-full mr-3"
            />
            <span className="font-semibold">{post.user?.fullname}</span>
          </div>
          <p className="mb-2">{post.content}</p>
          {post.image && (
            <img
              src={`http://localhost:5000/${post.image}`}
              alt="Post"
              className="max-w-full rounded-lg mb-2"
            />
          )}
          {/* Like and Comments Buttons */}
          <div className="flex items-center pt-2 border-t">
            <button className="flex items-center mr-4 text-gray-500 hover:text-blue-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                />
              </svg>
              Like
              {post.likesCount > 0 && (
                <span className="ml-1 text-sm">({post.likesCount})</span>
              )}
            </button>
            <button className="flex items-center text-gray-500 hover:text-blue-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              Comment
              {post.commentsCount > 0 && (
                <span className="ml-1 text-sm">({post.commentsCount})</span>
              )}
            </button>
          </div>
        </div>
        ))
      )}
    </div>
    </div>
  );
}