// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { jwtDecode } from "jwt-decode";
// import { useNavigate } from "react-router-dom";

// export default function AddPost() {
//   const [content, setContent] = useState("");
//   const [userId,setUserId] = useState("")
//   const [image, setImage] = useState(null);
//   const [error, setError] = useState("");
//   const [user, setUser] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       try {
//         const decodedToken = jwtDecode(token);
//         setUser(decodedToken);
//       } catch (error) {
//         console.error("Error decoding token:", error);
//         setError("Invalid token. Please log in again.");
//       }
//     }
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(""); 

//     if (!user) {
//       setError("Please log in to create a post.");
//       return;
//     }

//     if (!content.trim()) {
//       setError("Post content cannot be empty.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("user", user.id);
//     formData.append("content", content);
//     if (image) formData.append("image", image);

//     try {
//       const response = await axios.post("http://localhost:5000/api/posts", formData, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });

//       if (response.status === 201) {
//         alert("Post added successfully!");
//         setContent("");
//         setImage(null);
//         navigate("/");
//       }
//     } catch (err) {
//       console.error("Error creating post:", err.response?.data || err.message);
//       setError(err.response?.data?.message || "Error creating post, please try again.");
//     }
//   };

//   return (
//     <div className="max-w-2xl mx-auto p-4 h-screen">
//       <h1 className="text-3xl font-bold mb-6 text-center">Create a new post</h1>

//       {error && <p className="text-red-500">{error}</p>}

//       {user ? (
//         <div className="mb-4 flex items-center">
//           <img
//             src={`http://localhost:5000/${user.image}`}
//             alt="Profile"
//             className="w-12 h-12 rounded-full"
//           />
//           <span className="ml-4 text-lg">{user.fullname}</span>
//         </div>
//       ) : (
//         <p>Please log in to create a post.</p>
//       )}

//       <form onSubmit={handleSubmit}>
//         <textarea
//           placeholder="What's on your mind?"
//           value={content}
//           onChange={(e) => setContent(e.target.value)}
//           className="w-full p-3 border border-gray-300 rounded-md mb-4"
//           rows="5"
//         />

//         <div className="mb-4">
//           <input
//             type="file"
//             accept="image/*"
//             onChange={(e) => setImage(e.target.files[0])}
//             className="p-2 border border-gray-300 rounded-md"
//           />
//         </div>

//         <button
//           type="submit"
//           className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
//         >
//           Post
//         </button>
//       </form>
//     </div>
//   );
// }



import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { FiImage, FiUser, FiUpload } from "react-icons/fi";

export default function AddPost() {
  const [content, setContent] = useState("");
  const [userId, setUserId] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
        alert("Post added successfully!");
        setContent("");
        setImage(null);
        setPreview(null);
        navigate("/");
      }
    } catch (err) {
      console.error("Error creating post:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Error creating post, please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen">
    <div className="max-w-2xl mx-auto mt-28 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center text-indigo-700">Create a New Post</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700">
          <p>{error}</p>
        </div>
      )}

      {user ? (
        <div className="mb-6 flex items-center p-3 bg-gray-50 rounded-lg">
          <div className="relative">
            <img
              src={`http://localhost:5000/${user.image}`}
              alt="Profile"
              className="w-12 h-12 rounded-full object-cover border-2 border-indigo-200"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
          </div>
          <span className="ml-4 text-lg font-medium text-gray-800">{user.fullname}</span>
        </div>
      ) : (
        <div className="mb-6 p-4 bg-yellow-100 rounded-lg flex items-center">
          <FiUser className="text-yellow-600 mr-2" />
          <span className="text-yellow-800">Please log in to create a post.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <textarea
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            rows="5"
          />
          <div className="absolute bottom-3 right-3 text-sm text-gray-500">
            {content.length}/500
          </div>
        </div>

        {preview && (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="w-full rounded-lg border border-gray-200"
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

        <div className="flex items-center justify-between">
          <label className="flex items-center px-4 py-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200">
            <FiImage className="text-indigo-600 mr-2" />
            <span className="text-gray-700">Add Image</span>
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
            className={`flex items-center px-6 py-2 rounded-lg ${
              isSubmitting
                ? "bg-indigo-400"
                : "bg-indigo-600 hover:bg-indigo-700"
            } text-white font-medium`}
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