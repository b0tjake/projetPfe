import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { FiImage, FiUser, FiUpload } from "react-icons/fi";
import { DarkModeContext } from "../assets/darkmode";

export default function AddPost() {
  const [content, setContent] = useState("");
  const [userId, setUserId] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { darkMode } = useContext(DarkModeContext);

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
        // alert("Post added successfully!");
        setContent("");
        setImage(null);
        setPreview(null);
        navigate("/");
      }
    } catch (err) {
      console.error("Error creating post:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Error creating post, please try again.");
    } finally {
      // setIsSubmitting(false);
    }
  };

  return (
    <div className={`h-full min-h-screen p-6 sm:p-10 transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-[#f3f4f6]'}`}>
      <div className={`max-w-2xl mx-auto p-6 sm:p-8 rounded-2xl shadow-lg border transition-colors duration-300 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <h1 className={`text-3xl font-bold mb-6 text-center transition-colors duration-300 ${darkMode ? 'text-yellow-300' : 'text-[#0077B6]'}`}>Create a new post</h1>

        {error && (
          <div className={`mb-4 p-3 rounded-lg border-l-4 transition-colors duration-300 ${darkMode ? 'bg-red-900 border-red-700 text-red-200' : 'bg-red-100 border-red-500 text-red-700'}`}>
            <p>{error}</p>
          </div>
        )}

        {user ? (
          <div className={`mb-6 flex items-center p-3 rounded-lg transition-colors duration-300 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className="relative">
              <img
                src={`http://localhost:5000/${user.image}`}
                alt="Profile"
                className="w-12 h-12 rounded-full object-cover border-2 border-[#F2A261]"
              />
              {/* <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span> */}
            </div>
            <span className={`ml-4 text-lg font-medium transition-colors duration-300 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>{user.fullname}</span>
          </div>
        ) : (
          <div className={`mb-6 p-4 rounded-lg flex items-center transition-colors duration-300 ${darkMode ? 'bg-yellow-900' : 'bg-yellow-100'}`}>
            <FiUser className={`mr-2 ${darkMode ? 'text-yellow-300' : 'text-yellow-600'}`} />
            <span className={`${darkMode ? 'text-yellow-200' : 'text-yellow-800'}`}>Please log in to create a post.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <textarea
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className={`w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-[#F2A261] focus:border-[#F2A261] transition-colors duration-300 ${darkMode ? 'bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
              rows="5"
            />
            <div className={`absolute bottom-3 right-3 text-xs transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{content.length}</div>
          </div>

          {preview && (
            <div className="relative">
              <img
                src={preview}
                alt="Preview"
                className="w-full rounded-lg border transition-colors duration-300 ${darkMode ? 'border-gray-700' : 'border-gray-200'}"
              />
              <button
                type="button"
                onClick={() => {
                  setImage(null);
                  setPreview(null);
                }}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
              >
                ×
              </button>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <label className={`flex items-center px-4 py-2 rounded-lg cursor-pointer transition-colors duration-300 ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}>
              <FiImage className={`mr-2 ${darkMode ? 'text-yellow-300' : 'text-[#0077B6]'}`} />
              <span>Add Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                className="hidden"
              />
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex items-center px-6 py-2 rounded-lg font-medium transition-colors duration-300 shadow-sm ${isSubmitting ? (darkMode ? 'bg-[#0077B6]' : 'bg-[#0077B6]') : (darkMode ? 'bg-[#0077B6] hover:bg-[#006BA3]' : 'bg-[#0077B6] hover:bg-[#006BA3]')} text-white`}
            >
              {isSubmitting ? (
                "Posting..."
              ) : (
                <>
                  <FiUpload className="mr-2" />
                  Post
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}