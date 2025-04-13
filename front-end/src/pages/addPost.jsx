import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

export default function AddPost() {
  const [content, setContent] = useState("");
  const [userId,setUserId] = useState("")
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUser(decodedToken);
      } catch (error) {
        console.error("Error decoding token:", error);
        setError("Invalid token. Please log in again.");
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); 

    if (!user) {
      setError("Please log in to create a post.");
      return;
    }

    if (!content.trim()) {
      setError("Post content cannot be empty.");
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
        alert("Post added successfully!");
        setContent("");
        setImage(null);
        navigate("/");
      }
    } catch (err) {
      console.error("Error creating post:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Error creating post, please try again.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Create a new post</h1>

      {error && <p className="text-red-500">{error}</p>}

      {user ? (
        <div className="mb-4 flex items-center">
          <img
            src={`http://localhost:5000/${user.image}`}
            alt="Profile"
            className="w-12 h-12 rounded-full"
          />
          <span className="ml-4 text-lg">{user.fullname}</span>
        </div>
      ) : (
        <p>Please log in to create a post.</p>
      )}

      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md mb-4"
          rows="5"
        />

        <div className="mb-4">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="p-2 border border-gray-300 rounded-md"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Post
        </button>
      </form>
    </div>
  );
}
