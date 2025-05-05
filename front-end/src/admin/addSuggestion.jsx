import axios from "axios";
import { useState } from "react";

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
    <div className="flex justify-center bg-gray-50 min-h-screen py-10 px-4">
    <div className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        📝 Add Your Suggestion
      </h1>
  
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-base font-semibold text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            placeholder="Enter the suggestion title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          />
        </div>
  
        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-base font-semibold text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            placeholder="Write a detailed description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows="4"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          ></textarea>
        </div>
  
        {/* Cost */}
        <div>
          <label htmlFor="cost" className="block text-base font-semibold text-gray-700 mb-1">
            Estimated Cost
          </label>
          <input
            type="number"
            id="cost"
            placeholder="Enter estimated cost"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          />
        </div>
  
        {/* Image */}
        <div>
          <label htmlFor="image" className="block text-base font-semibold text-gray-700 mb-1">
            Upload an Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition bg-white"
          />
        </div>
  
        {/* Submit */}
        <div className="flex justify-center mt-6">
          <button
            type="submit"
            className="w-fit p-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition duration-300"
          >
            ✅ Submit Suggestion
          </button>
        </div>
      </form>
  
      {/* Message */}
      {message && (
        <p className="mt-6 text-center text-base font-medium text-green-600">{message}</p>
      )}
    </div>
  </div>
  
  );
}
