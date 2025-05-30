import axios from "axios";
import { useState } from "react";
import { FiCheck, FiImage, FiArrowLeft } from "react-icons/fi";

export default function AddSuggestion() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [cost, setCost] = useState(0);
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("cost", cost);
    formData.append("image", image);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/admin/addSuggestion",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data);
      setMessage(response.data.message);
    } catch (error) {
      console.error(error.response?.data || error.message);
      setMessage(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="flex justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 min-h-screen py-10 px-4">
      <div className="w-full max-w-2xl bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-100">
        {/* Back Button */}
        <button
          type="button"
          onClick={() => (window.location.href = "/manageSuggestions")}
          className="flex items-center gap-2 mb-6 text-blue-600 hover:text-blue-800 font-medium transition-colors"
        >
          <FiArrowLeft className="w-5 h-5" />
          <span>Back to Suggestions</span>
        </button>
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Add Your Suggestion
        </h1>
  
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              placeholder="Enter the suggestion title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all"
            />
          </div>
  
          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              placeholder="Write a detailed description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows="4"
              className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all resize-none"
            ></textarea>
          </div>
  
          {/* Cost */}
          <div>
            <label htmlFor="cost" className="block text-sm font-medium text-gray-700 mb-2">
              Estimated Cost
            </label>
            <input
              type="number"
              id="cost"
              placeholder="Enter estimated cost"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              required
              className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all"
            />
          </div>
  
          {/* Image */}
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
              Upload an Image
            </label>
            <div className="relative">
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                required
                className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all"
              />
              <FiImage className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>
  
          {/* Submit */}
          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl shadow-sm hover:from-blue-600 hover:to-indigo-700 transition-all"
            >
              <FiCheck className="w-5 h-5" />
              <span>Submit Suggestion</span>
            </button>
          </div>
        </form>
  
        {/* Message */}
        {message && (
          <p className="mt-6 text-center text-sm font-medium text-green-600 bg-green-50 py-2 px-4 rounded-lg">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
