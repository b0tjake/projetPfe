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
            {/* لاحقاً نضيف زر لايك وتعليقات هنا */}
          </div>
        ))
      )}
    </div>
    </div>
  );
}