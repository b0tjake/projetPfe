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
    <div className="flex justify-center bg-bg1">
    <div className="max-w-3xl mx-auto bg-bg2 p-8 rounded-xl shadow-xl mt-12">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Add Your Suggestion</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title Input */}
        <div>
          <label htmlFor="title" className="text-lg font-medium text-gray-700">Title</label>
          <input
            type="text"
            id="title"
            placeholder="Enter the title of the suggestion"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-4 mt-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
          />
        </div>

        {/* Description Input */}
        <div>
          <label htmlFor="description" className="text-lg font-medium text-gray-700">Description</label>
          <textarea
            id="description"
            placeholder="Provide a detailed description of the suggestion"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows="4"
            className="w-full p-4 mt-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
          ></textarea>
        </div>

        {/* Cost Input */}
        <div>
          <label htmlFor="cost" className="text-lg font-medium text-gray-700">Cost</label>
          <input
            type="number"
            id="cost"
            placeholder="Enter the cost of the suggestion"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            required
            className="w-full p-4 mt-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
          />
        </div>

        {/* Image Input */}
        <div>
          <label htmlFor="image" className="text-lg font-medium text-gray-700">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            required
            className="w-full mt-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-300"
          >
            Add Suggestion
          </button>
        </div>
      </form>

      {/* Success/Message Display */}
      {message && (
        <p className="mt-6 text-center text-lg font-medium text-green-600">{message}</p>
      )}
    </div>
    </div>
  );
}
